#!/usr/bin/env bun
/**
 * `grade` -- local grading for the Duke "Programming Practice" assignments.
 *
 * The package (this checkout) is a read-only index: configs, templates, the
 * reconstructed drivers and the reference solutions. Your work happens in a
 * *workspace* somewhere else entirely.
 *
 *   grade init ~/duke-homework     create a workspace, hand out 00_hello
 *   cd ~/duke-homework/00_hello
 *   grade                          grade it; on a pass, unlock 01_apple
 *
 * Everything is local: no daemon, no git push, no network.
 */

import path from "node:path";
import { existsSync } from "node:fs";
import { ConfigError, readConfig, compareAssignmentIds, listAssignmentIds } from "./config.ts";
import {
  ENV_PACKAGE,
  ENV_WORKSPACE,
  configFile,
  configsDir,
  dataDir,
  findWorkspace,
  packageRoot,
  referenceFor,
  stateFile,
} from "./paths.ts";
import { buildResult, summarize, writeGradeTxt } from "./output.ts";
import {
  diagnose,
  installCommand,
  pathLineFor,
  shellRcFile,
  uninstallCommand,
} from "./install.ts";
import { strategyFor } from "./strategies/index.ts";
import { writeAnswerDir } from "./answer.ts";
import {
  WorkspaceError,
  advance,
  initWorkspace,
  progress,
  readState,
  resolveAssignment,
  scaffoldAssignment,
} from "./workspace.ts";
import type { AssignmentConfig, CaseResult } from "./types.ts";

type Command =
  | "grade"
  | "init"
  | "status"
  | "list"
  | "check"
  | "install"
  | "uninstall"
  | "doctor"
  | "help"
  | "version";

interface Args {
  command: Command;
  target?: string;
  workspace?: string;
  id?: string;
  dir?: string;
  repair: boolean;
  explain: boolean;
  quiet: boolean;
  noAnswer: boolean;
  noScaffold: boolean;
}

const HELP = `grade -- local grading for the Duke Programming Practice assignments

The package is a read-only index. Your work happens in a workspace elsewhere.

usage:
  grade                   grade the assignment you are in (or the current one)
  grade init [dir]        create a workspace and hand out the first assignment
  grade                   grade the assignment you are in (or the current one)
  grade status            show which assignments are done / current / locked
  grade list              list every assignment and its strategy
  grade new <id>          copy assignment <id> into the workspace, untouched
  grade check             validate every config in the package
  grade install           put \`grade\` on your PATH so it runs from anywhere
  grade uninstall         remove the installed launcher
  grade doctor            report anything that would stop grading working

options:
  --dir <dir>         with \`install\`: where to put the launcher
  --workspace <dir>   the workspace (default: nearest one above the cwd)
  --id <id>           which assignment (default: the cwd's name, else state)
  --dir <dir>         grade this directory instead of the resolved assignment
  --repair            with \`init\`: rewrite package.json and the ./grade shim
  --explain           print the assignment's config before grading
  --quiet, -q         write grade.txt only; print nothing on success
  --no-answer         skip the answer/ comparison folder
  --no-scaffold       do not unlock the next assignment
  --version, -v       print the version
  --help, -h          print this message

environment:
  ${ENV_PACKAGE}    package location, if it is not where it was cloned
  ${ENV_WORKSPACE}  workspace location, instead of discovering it

exit status:
  0  PASSED / A          2  usage or configuration error
  1  FAILED              3  NOT GRADED (cannot be checked on this platform)
`;

function parseArgs(argv: string[]): Args {
  const a: Args = {
    command: "grade",
    repair: false,
    explain: false,
    quiet: false,
    noAnswer: false,
    noScaffold: false,
  };
  const words: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]!;
    switch (arg) {
      case "--workspace": a.workspace = argv[++i]; break;
      case "--id": a.id = argv[++i]; break;
      case "--dir": a.dir = argv[++i]; break;
      case "--repair": a.repair = true; break;
      case "--explain": a.explain = true; break;
      case "--quiet": case "-q": a.quiet = true; break;
      case "--no-answer": a.noAnswer = true; break;
      case "--no-scaffold": a.noScaffold = true; break;
      case "--version": case "-v": a.command = "version"; break;
      case "--help": case "-h": a.command = "help"; break;
      default:
        if (arg.startsWith("-")) fail(`unknown option: ${arg}`);
        words.push(arg);
    }
  }

  const first = words[0];
  if (first && ["init", "status", "list", "check", "install", "uninstall", "doctor"].includes(first)) {
    a.command = first as Command;
    a.target = words[1];
  } else if (first === "new") {
    a.command = "init";
    a.id = words[1] ?? a.id;
    a.target = undefined;
  } else if (first) {
    fail(`unknown command: ${first}\n\n${HELP}`);
  }
  return a;
}

function fail(message: string, code = 2): never {
  process.stderr.write(`grade: ${message}\n`);
  process.exit(code);
}

async function main(): Promise<number> {
  const args = parseArgs(process.argv.slice(2));
  const root = packageRoot();

  if (args.command !== "help" && !existsSync(dataDir(root))) {
    fail(
      `cannot find the package index (looked for ${dataDir(root)}).\n` +
        `Set ${ENV_PACKAGE} to the checkout directory if it has moved.`,
    );
  }

  switch (args.command) {
    case "help":
      process.stdout.write(HELP);
      return 0;
    case "version": {
      const pkg = (await Bun.file(path.join(root, "package.json")).json()) as { version?: string };
      process.stdout.write(`grade ${pkg.version ?? "0.0.0"}\npackage: ${root}\n`);
      return 0;
    }
    case "check":
      return await checkConfigs(root);
    case "list":
      return await listAssignments(root);
    case "init":
      return await doInit(root, args);
    case "status":
      return await doStatus(root, args);
    case "install":
      return await doInstall(args);
    case "uninstall":
      return await doUninstall(args);
    case "doctor":
      return await doDoctor();
    case "grade":
      return await doGrade(root, args);
  }
}

/**
 * Where `grade init` puts a workspace when no directory is given.
 *
 * Using the current directory is predictable, but when that is `$HOME` the
 * result would be 42 assignment folders scattered through the home directory.
 * In that one case a named subdirectory is used, and the choice is reported.
 */
function defaultWorkspaceDir(): { dir: string; because: string | null } {
  const cwd = process.cwd();
  const home = process.env.HOME ?? "";
  if (home && path.resolve(cwd) === path.resolve(home)) {
    return {
      dir: path.join(home, "duke-homework"),
      because: "You are in your home directory, so the workspace goes in ~/duke-homework instead.",
    };
  }
  return { dir: cwd, because: null };
}

async function doInit(root: string, args: Args): Promise<number> {
  const ids = (await listAssignmentIds(root)).sort(compareAssignmentIds);
  const explicit = args.target ?? args.workspace;
  const fallback = explicit ? null : defaultWorkspaceDir();
  const dir = path.resolve(explicit ?? fallback!.dir);
  if (fallback?.because && !args.quiet) process.stdout.write(`${fallback.because}\n\n`);
  const startAt = args.id ?? ids[0]!;

  try {
    const outcome = await initWorkspace({ dir, startAt, repair: args.repair });
    process.stdout.write(`Workspace ready: ${outcome.workspace}\n\n`);
    process.stdout.write(`Your first assignment is ${outcome.assignment}/:\n`);
    for (const f of outcome.files) process.stdout.write(`  ${f}\n`);
    process.stdout.write(
      `\nNext:\n` +
        `  cd ${path.join(outcome.workspace, outcome.assignment)}\n` +
        `  bun grade            (or ./grade from the workspace root)\n`,
    );
    return 0;
  } catch (err) {
    if (err instanceof WorkspaceError) fail(err.message);
    throw err;
  }
}

async function doStatus(root: string, args: Args): Promise<number> {
  const workspace = resolveWorkspace(args);
  if (!workspace) {
    fail(`no workspace found above ${process.cwd()}.\nCreate one with:  grade init <dir>`);
  }
  const state = await readState(workspace);
  const rows = await progress(root, state);

  process.stdout.write(`workspace: ${workspace}\n`);
  process.stdout.write(`state:     ${existsSync(stateFile(workspace)) ? stateFile(workspace) : "(none)"}\n\n`);

  const mark = { done: "[x]", current: "[>]", locked: "[ ]" } as const;
  for (const r of rows) process.stdout.write(`  ${mark[r.status]} ${r.id}\n`);

  const done = rows.filter((r) => r.status === "done").length;
  process.stdout.write(`\n${done}/${rows.length} complete`);
  if (state?.current) process.stdout.write(`, currently on ${state.current}`);
  process.stdout.write("\n");
  return 0;
}

async function listAssignments(root: string): Promise<number> {
  const ids = await listAssignmentIds(root);
  process.stdout.write(`${ids.length} assignment(s) in ${path.relative(process.cwd(), configsDir(root))}\n`);
  for (const id of ids) {
    const cfg = await readConfig(root, id);
    const n = cfg.tests?.length ?? 0;
    const detail =
      cfg.type === "unsupported"
        ? "cannot be graded on this platform"
        : n > 0
          ? `${n} case(s)`
          : (cfg.file ?? cfg.source ?? "");
    process.stdout.write(`  ${id.padEnd(26)} ${cfg.type.padEnd(16)} ${detail}\n`);
  }
  return 0;
}

async function checkConfigs(root: string): Promise<number> {
  const ids = await listAssignmentIds(root);
  if (ids.length === 0) {
    process.stderr.write(`no configs found under ${configsDir(root)}\n`);
    return 2;
  }
  let problems = 0;
  for (const id of ids) {
    try {
      await readConfig(root, id);
    } catch (err) {
      problems++;
      process.stdout.write(`  ${id.padEnd(26)} INVALID: ${(err as Error).message.split("\n")[0]}\n`);
    }
  }
  process.stdout.write(
    problems === 0
      ? `${ids.length} assignment config(s) are all valid.\n`
      : `\n${problems} of ${ids.length} config(s) have problems.\n`,
  );
  return problems === 0 ? 0 : 2;
}

async function doInstall(args: Args): Promise<number> {
  const { location, shim, installed, reason } = await installCommand(args.dir);
  if (!installed) {
    process.stderr.write(`grade: ${reason}\n`);
    return 2;
  }
  process.stdout.write(`Installed ${shim}\n\n`);
  if (location.onPath) {
    process.stdout.write(`Run it from anywhere:\n  cd ~ && grade init\n`);
  } else {
    process.stdout.write(
      `${location.dir} is not on your PATH yet. Add this line to ${shellRcFile()}:\n\n` +
        `  ${pathLineFor(location.dir)}\n\n` +
        `then open a new terminal (or run the line now) and try:\n  grade init\n`,
    );
  }
  return 0;
}

async function doUninstall(args: Args): Promise<number> {
  const { shim, removed } = await uninstallCommand(args.dir);
  process.stdout.write(
    removed ? `Removed ${shim}\n` : `Nothing to remove at ${shim}\n`,
  );
  return 0;
}

async function doDoctor(): Promise<number> {
  const rows = await diagnose();
  for (const r of rows) {
    process.stdout.write(`  ${r.ok ? "ok  " : "FAIL"}  ${r.label.padEnd(16)} ${r.detail}\n`);
  }
  const bad = rows.filter((r) => !r.ok);
  process.stdout.write(
    bad.length === 0
      ? "\nEverything looks usable.\n"
      : `\n${bad.length} item(s) need attention.\n`,
  );
  return bad.length === 0 ? 0 : 1;
}

function resolveWorkspace(args: Args): string | null {
  if (args.workspace) return path.resolve(args.workspace);
  const fromEnv = process.env[ENV_WORKSPACE];
  if (fromEnv) return path.resolve(fromEnv);
  return findWorkspace(process.cwd(), []);
}

async function doGrade(root: string, args: Args): Promise<number> {
  const found = resolveWorkspace(args);
  const fallback = path.resolve(args.dir ?? process.cwd());

  let resolved;
  try {
    resolved = await resolveAssignment({
      workspace: found ?? fallback,
      cwd: process.cwd(),
      id: args.id,
      dir: args.dir,
    });
  } catch (err) {
    if (err instanceof ConfigError) fail(err.message);
    throw err;
  }

  // Grading a bare directory (no workspace around it) still has to put the next
  // assignment *beside* this one, the way the original tool did — not nested
  // inside it.
  if (!found) resolved.workspace = path.dirname(resolved.assignmentDir);

  const { assignmentDir, id } = resolved;

  if (!existsSync(assignmentDir)) {
    fail(`${id}/ does not exist in the workspace.\nCreate it with:  grade new ${id}`);
  }

  let config: AssignmentConfig;
  try {
    config = await readConfig(root, id);
  } catch (err) {
    if (err instanceof ConfigError) fail(err.message);
    throw err;
  }

  if (args.explain) {
    process.stdout.write(`# ${path.relative(root, configFile(root, id))}\n`);
    process.stdout.write(JSON.stringify(config, null, 2) + "\n\n");
  }

  const startedAt = new Date();
  const lines: string[] = [];
  const report = (line: string) => {
    lines.push(line);
    if (!args.quiet) process.stdout.write(line + "\n");
  };

  let cases: CaseResult[];
  try {
    cases = await strategyFor(config.type).run({ root, assignmentDir, config, report });
  } catch (err) {
    const message = (err as Error).message;
    report(`Internal grading error: ${message}`);
    cases = [
      { label: "internal", passed: false, reason: message, lines: [`Internal grading error: ${message}`] },
    ];
  }

  const result = buildResult(id, cases, lines, startedAt);
  if (result.passed) {
    result.verdict = config.successVerdict ?? "PASSED";
  } else if (config.type === "unsupported") {
    result.verdict = "NOT GRADED";
  }

  await writeGradeTxt(assignmentDir, result);
  if (!args.quiet) process.stdout.write(`\n${summarize(result)}\n`);

  if (config.type === "unsupported") {
    if (!args.quiet) process.stdout.write(`Nothing was unlocked.\n`);
    return 3;
  }

  if (!result.passed) {
    if (!args.quiet) process.stdout.write(`Wrote grade.txt. Fix the problems above and run grade again.\n`);
    return 1;
  }

  if (!args.noAnswer) {
    try {
      const outcome = await writeAnswerDir(assignmentDir, referenceFor(root, id));
      if (!args.quiet) {
        process.stdout.write(`Your code is in answer/user_code/; the reference is in answer/reference/.\n`);
        process.stdout.write(
          outcome.referenceAvailable
            ? `Read answer/diff.txt to see how your solution differs.\n`
            : `No reference solution is packaged for this assignment.\n`,
        );
      }
    } catch (err) {
      process.stdout.write(`grade: could not build answer/: ${(err as Error).message}\n`);
    }
  }

  const next = args.noScaffold ? null : (config.next ?? null);
  try {
    const { unlocked, skipped } = await advance(root, resolved.workspace, id, resolved.state, next);
    if (!args.quiet) {
      if (unlocked) {
        process.stdout.write(`\nYour next assignment is ready: ${unlocked}/\n`);
        process.stdout.write(`  cd ${path.join(resolved.workspace, unlocked)}\n`);
      } else if (next && skipped) {
        process.stdout.write(`\n${next}/ already exists, so it was left untouched.\n`);
      } else if (!next && !args.noScaffold) {
        process.stdout.write(`\nThat was the last assignment. Congratulations!\n`);
      }
    }
  } catch (err) {
    process.stdout.write(`grade: could not create ${next}/: ${(err as Error).message}\n`);
  }

  return 0;
}

process.exit(await main());
