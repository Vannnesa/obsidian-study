/**
 * Shared harness for the sandboxed tests.
 *
 * The tool locates its index from `GRADE_PACKAGE` (or its own module path), so
 * each test builds a throwaway *package* in a temp directory and points the CLI
 * at it. That keeps the real package — and the real upstream corpus — untouched.
 */

import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export const CLI = path.join(import.meta.dir, "..", "src", "index.ts");

export interface Sandbox {
  /** Package root: holds data/configs, data/templates, data/drivers, data/reference. */
  root: string;
  /** A workspace directory inside the sandbox, so `grade init` works. */
  ws: string;
  cleanup: () => Promise<void>;
}

/** Create a minimal but complete package with one assignment directory. */
export async function makeSandbox(opts: { withWorkspace?: boolean } = {}): Promise<Sandbox> {
  const root = await mkdtemp(path.join(tmpdir(), "grade-pkg-"));
  await mkdir(path.join(root, "data", "configs"), { recursive: true });
  await mkdir(path.join(root, "data", "templates"), { recursive: true });
  await mkdir(path.join(root, "data", "reference"), { recursive: true });
  await mkdir(path.join(root, "data", "drivers"), { recursive: true });
  await writeFile(
    path.join(root, "package.json"),
    JSON.stringify({ name: "git-homework", version: "0.0.0" }),
  );
  // The workspace lives outside the package, exactly as real usage requires —
  // `grade init` refuses to create one inside the index.
  const ws = await mkdtemp(path.join(tmpdir(), "grade-ws-"));
  return {
    root,
    ws,
    cleanup: async () => {
      await rm(root, { recursive: true, force: true });
      await rm(ws, { recursive: true, force: true });
    },
  };
}

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

/** Run the CLI against a sandbox package. */
export async function runCli(pkg: string, args: string[], cwd: string): Promise<RunResult> {
  const proc = Bun.spawn(["bun", CLI, ...args], {
    cwd,
    env: { ...process.env, GRADE_PACKAGE: pkg },
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  return { stdout, stderr, exitCode };
}

/** Write a config into the sandbox package. */
export async function writeConfig(pkg: string, id: string, config: object): Promise<void> {
  await writeFile(path.join(pkg, "data", "configs", `${id}.json`), JSON.stringify(config, null, 2));
}

/** Create an assignment directory in the workspace and return its path. */
export async function makeAssignment(ws: string, id: string): Promise<string> {
  const dir = path.join(ws, id);
  await mkdir(dir, { recursive: true });
  return dir;
}

/** Grade a sandbox assignment; returns the run result and the grade.txt text. */
export async function grade(pkg: string, ws: string, id: string, extra: string[] = []) {
  const dir = path.join(ws, id);
  await mkdir(dir, { recursive: true });
  const r = await runCli(pkg, ["--dir", dir, "--id", id, "--no-answer", "--no-scaffold", "--quiet", ...extra], dir);
  const f = Bun.file(path.join(dir, "grade.txt"));
  return { ...r, text: (await f.exists()) ? await f.text() : "" };
}
