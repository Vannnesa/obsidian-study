/**
 * Turning student sources into a runnable executable.
 *
 * Two platform realities shape this module:
 *
 *  1. The original tool linked against teacher-supplied Linux x86-64 `.o`
 *     files. Those cannot be linked on macOS/arm64, so each assignment instead
 *     names a reconstructed driver written in C (`drivers/<id>/*.c`).
 *
 *  2. Several capstone directories store git symlinks as ordinary files whose
 *     entire content is a relative path such as `../c2prj1_cards/cards.c`.
 *     `materializeTree` expands those into real content before building.
 *
 * Builds happen in a scratch directory that is always removed, so grading
 * never leaves `.o` files or executables behind in the assignment folder.
 */

import { copyFile, mkdir, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { withTempDir, type RunResult } from "./runner.ts";
import type { BuildSpec } from "./types.ts";

export interface BuildOutcome {
  ok: boolean;
  /** Commands executed, in order, for the "Attempting to compile" section. */
  log: string[];
  executable: string | null;
  stderr: string;
  /** Staged sources actually compiled, so a caller can build a second variant. */
  sources: string[];
  compiler: string;
  flags: string[];
}

/** A file whose whole content is a single relative path is a flattened symlink. */
const FLATTENED_LINK = /^\s*(\.\.?\/[^\n]*?)\s*$/;

export async function readFlattenedLink(file: string): Promise<string | null> {
  // A flattened symlink is one short line. Checking the size first avoids
  // decoding multi-megabyte object files as UTF-8.
  let size: number;
  try {
    size = (await stat(file)).size;
  } catch {
    return null;
  }
  if (size === 0 || size > 1024) return null;

  let text: string;
  try {
    text = await readFile(file, "utf8");
  } catch {
    return null;
  }
  const m = FLATTENED_LINK.exec(text);
  if (!m) return null;
  // The content must be a single line.
  if (text.trim().split("\n").length !== 1) return null;
  return m[1]!;
}

/**
 * Recursively copy `srcDir` into `destDir`, replacing flattened symlinks with
 * the content of their target. `seen` guards against link cycles.
 */
export async function materializeTree(
  srcDir: string,
  destDir: string,
  seen: Set<string> = new Set(),
): Promise<void> {
  const real = await realpathSafe(srcDir);
  if (seen.has(real)) throw new Error(`symlink cycle detected at ${srcDir}`);
  seen.add(real);

  await mkdir(destDir, { recursive: true });
  for (const entry of await readdir(srcDir, { withFileTypes: true })) {
    const from = path.join(srcDir, entry.name);
    const to = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      // `answer/` holds a copy of the reference and the user's own files;
      // staging it would be pure waste.
      if (entry.name === "answer" || entry.name === "node_modules") continue;
      await materializeTree(from, to, seen);
      continue;
    }
    if (!entry.isFile()) continue;
    const link = await readFlattenedLink(from);
    if (link) {
      const target = path.resolve(path.dirname(from), link);
      if (!existsSync(target)) {
        throw new Error(`${from} points at missing target ${link}`);
      }
      // Copy the target's *content*. Walking the target's whole directory
      // instead (as this used to) re-enters a directory an earlier link already
      // visited -- `c3prj2_eval/cards.c` and `c3prj1_deck/cards.c` both point
      // into `c2prj1_cards/` -- and trips the cycle guard on a legal tree.
      // A link that points at another link is still resolved, so chains work.
      await writeFile(to, await resolveLinkContent(target));
      continue;
    }
    await copyFile(from, to);
  }
  seen.delete(real);
}

/** Read a (possibly chained) flattened symlink's real content. */
async function resolveLinkContent(target: string, depth = 0): Promise<Uint8Array> {
  if (depth > 40) throw new Error(`flattened symlink chain too deep at ${target}`);
  const nested = await readFlattenedLink(target);
  if (nested) {
    const next = path.resolve(path.dirname(target), nested);
    if (!existsSync(next)) throw new Error(`${target} points at missing target ${nested}`);
    return resolveLinkContent(next, depth + 1);
  }
  return new Uint8Array(await readFile(target));
}

async function realpathSafe(p: string): Promise<string> {
  const { realpath } = await import("node:fs/promises");
  try {
    return await realpath(p);
  } catch {
    return path.resolve(p);
  }
}

/**
 * Compiler flags are shared between the original Ubuntu/gcc grader and the
 * clang on this machine. A few spelling differences are normalised here so a
 * single config works in both places.
 */
export function normalizeFlags(flags: string[], compiler: string): string[] {
  const isClang = /clang|\bcc$/.test(compiler);
  if (!isClang) return flags;
  const out: string[] = [];
  for (let i = 0; i < flags.length; i++) {
    const f = flags[i]!;
    // gcc accepts `--pedantic`; clang warns about the double dash on some
    // releases, so normalise to the canonical single-dash form.
    if (f === "--pedantic") {
      out.push("-pedantic");
      continue;
    }
    // `-Werror` turns clang's extra diagnostics into hard failures. The
    // original grader only used gcc's warning set, so relax the ones clang
    // adds that gcc 9 did not have.
    out.push(f);
  }
  if (out.includes("-Werror")) {
    out.push("-Wno-unused-command-line-argument", "-Wno-error=unused-but-set-variable");
  }
  return out;
}

/**
 * Fail with an actionable message when there is no C compiler.
 *
 * Without this the student sees a raw `posix_spawn ENOENT`, which says nothing
 * about what to install. Windows in particular ships no `cc` at all.
 */
export function assertCompilerAvailable(compiler: string): void {
  if (compiler.includes("/") || compiler.includes("\\")) {
    if (existsSync(compiler)) return;
  } else if (Bun.which(compiler)) {
    return;
  }

  const hint =
    process.platform === "darwin"
      ? "Install the Xcode command line tools:  xcode-select --install"
      : process.platform === "win32"
        ? "Install a C toolchain and put it on PATH. MSYS2 (https://www.msys2.org)\n" +
          "gives you gcc; then set CC=gcc. Note that MSVC's `cl` is not supported:\n" +
          "its flags and its command-line conventions differ from the gcc this\n" +
          "course was written for."
        : "Install a C compiler, e.g.  sudo apt install build-essential   (Debian/Ubuntu)\n" +
          "                           sudo dnf install gcc make          (Fedora)";

  throw new Error(
    `no C compiler found (tried "${compiler}").\n` +
      `Most assignments compile C, so one is required.\n\n${hint}\n\n` +
      `Set CC=<path> to point at a specific compiler.`,
  );
}

export interface CompileRequest {
  /** Directory containing the student's sources. */
  workDir: string;
  spec: BuildSpec;
  /** Absolute path of the reconstructed driver, when the assignment has one. */
  driverPath?: string;
  defaultSource?: string;
  timeoutMs?: number;
  log?: (line: string) => void;
}

/**
 * Compile and link inside a fresh temporary directory.
 *
 * Returns the path of the built executable *inside that temp directory*; the
 * caller must run it before the directory is removed, so this function hands
 * back a continuation rather than a bare path.
 */
export async function withBuiltProgram<T>(
  req: CompileRequest,
  fn: (exe: string, buildDir: string, outcome: BuildOutcome) => Promise<T>,
): Promise<T> {
  const spec = req.spec;
  return withTempDir(async (tmp) => {
    const buildDir = spec.buildDir
      ? path.resolve(req.workDir, spec.buildDir)
      : path.join(tmp, "build");
    await mkdir(buildDir, { recursive: true });

    // Stage sources so flattened symlinks become real files.
    const stage = path.join(tmp, "src");
    if (spec.resolveSymlinks !== false) {
      await materializeTree(req.workDir, stage);
    } else {
      await mkdir(stage, { recursive: true });
      for (const f of spec.sources ?? [req.defaultSource!]) {
        const from = path.resolve(req.workDir, f);
        if (existsSync(from)) await copyFile(from, path.join(stage, path.basename(f)));
      }
    }

    const outcome: BuildOutcome = {
      ok: false,
      log: [],
      executable: null,
      stderr: "",
      sources: [],
      compiler: "",
      flags: [],
    };
    const emit = (line: string) => {
      outcome.log.push(line);
      req.log?.(line);
    };

    const compiler = spec.compiler ?? process.env.CC ?? "cc";
    assertCompilerAvailable(compiler);
    const output = spec.output ?? "program";
    const exe = path.join(buildDir, output);

    const driverStage = path.join(stage, "__driver.c");
    if (req.driverPath) {
      await copyFile(req.driverPath, driverStage);
    }

    const sources = (spec.sources ?? [req.defaultSource!]).map((s) =>
      path.join(stage, path.basename(s)),
    );
    if (req.driverPath) sources.push(driverStage);

    const flags = normalizeFlags(spec.flags ?? [], compiler);
    const linkObjects = (spec.linkObjects ?? []).map((o) => path.resolve(req.workDir, o));
    outcome.sources = sources;
    outcome.compiler = compiler;
    outcome.flags = flags;

    if (spec.make) {
      const args = spec.make.args ?? [];
      if (spec.make.cleanFirst) {
        const clean = await runMake(req.workDir, ["clean"], req.timeoutMs);
        emit(`make clean$`);
        if (clean.stderr.trim()) emit(clean.stderr.trim());
      }
      emit(`make ${args.join(" ")}`);
      const made = await runMake(req.workDir, args, req.timeoutMs);
      if (made.stderr.trim()) emit(made.stderr.trim());
      outcome.ok = made.exitCode === 0 && existsSync(exe);
      outcome.executable = outcome.ok ? exe : null;
      outcome.stderr = made.stderr;
      if (!outcome.ok) return fn(exe, buildDir, outcome);
      return fn(exe, buildDir, outcome);
    }

    if (spec.separateCompile) {
      const objects: string[] = [];
      for (const src of sources) {
        const obj = path.join(buildDir, path.basename(src).replace(/\.c$/, ".o"));
        const cmd = [compiler, ...flags, "-c", "-o", obj, src];
        emit(cmd.join(" "));
        const r = await compile(cmd, buildDir, req.timeoutMs);
        if (r.exitCode !== 0) {
          outcome.stderr = r.stderr;
          outcome.ok = false;
          outcome.executable = null;
          return fn(exe, buildDir, outcome);
        }
        objects.push(obj);
      }
      const link = [compiler, ...flags, "-o", exe, ...objects, ...linkObjects];
      emit(link.join(" "));
      const r = await compile(link, buildDir, req.timeoutMs);
      if (r.exitCode !== 0) {
        outcome.stderr = r.stderr;
        return fn(exe, buildDir, outcome);
      }
    } else {
      const cmd = [compiler, ...flags, "-o", exe, ...sources, ...linkObjects];
      emit(cmd.join(" "));
      const r = await compile(cmd, buildDir, req.timeoutMs);
      if (r.exitCode !== 0) {
        outcome.stderr = r.stderr;
        return fn(exe, buildDir, outcome);
      }
    }

    outcome.ok = true;
    outcome.executable = exe;
    return fn(exe, buildDir, outcome);
  });
}

async function runMake(cwd: string, args: string[], timeoutMs = 60_000): Promise<RunResult> {
  const { runWithTimeout } = await import("./runner.ts");
  return runWithTimeout(["make", ...args], { cwd, timeoutMs, maxCaptureBytes: 1 << 20 });
}

/** Run one compiler invocation under the same timeout discipline as the tests. */
async function compile(cmd: string[], cwd: string, timeoutMs = 60_000): Promise<RunResult> {
  const { runWithTimeout } = await import("./runner.ts");
  return runWithTimeout(cmd, { cwd, timeoutMs, maxCaptureBytes: 1 << 20 });
}

/** Write a file, creating parent directories. */
export async function writeFileDeep(file: string, data: string | Uint8Array): Promise<void> {
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, data);
}
