/**
 * `compile_and_run` and `memory_check`.
 *
 * Build the student's source (optionally linked against a reconstructed
 * driver), then run it once per configured case with fixed argv/stdin and
 * compare stdout byte-for-byte against stored expected output.
 *
 * Everything happens inside a temp directory created by `withBuiltProgram`,
 * so no `.o` file or executable is ever left in the assignment folder. Cases
 * run strictly serially: one student program at a time, which keeps peak RSS
 * flat no matter how many cases are configured.
 *
 * Three report dialects are supported, because the original grader used three:
 *   squares  -> `Testing ./squares 1 0 0 1` / `PASSED` / ` - Correct`
 *   testcase -> `###...` / `testcase1:` / `testcase1 passed`
 *   inline   -> `Testing max(-999, 123) ... Correct`
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { buffersEqual, echoBytes, filesEqual, foldNewlines, runWithTimeout, showBytes } from "../runner.ts";
import { resolveDriver } from "../paths.ts";
import { withBuiltProgram } from "../build.ts";
import { resolveExpected } from "../paths.ts";
import { expectedBytesFor } from "./file-compare.ts";
import type { CaseResult, TestCase } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

export interface RunStrategyOptions {
  /** Reserved; memory checking now lives in `runMemoryCases`. */
  memory?: boolean;
}

/** Locate the reconstructed driver declared by the config, if any. */
function driverPathFor(ctx: StrategyContext): string | undefined {
  const rel = ctx.config.build?.driver;
  if (!rel) return undefined;
  const file = resolveDriver(ctx.root, rel);
  if (!existsSync(file)) {
    throw new Error(`driver declared in config is missing: ${rel}`);
  }
  return file;
}

/** Expand `{n}` / `{label}` in a case-line template. */
function expand(template: string, index: number, label: string): string {
  return template.replaceAll("{n}", String(index + 1)).replaceAll("{label}", label);
}

function labelFor(tc: TestCase, index: number, exe: string): string {
  if (tc.label) return tc.label;
  const args = tc.args ?? [];
  return `./${path.basename(exe)}${args.length ? " " + args.join(" ") : ""}` || `testcase${index + 1}`;
}

export async function runCases(
  ctx: StrategyContext,
  opts: RunStrategyOptions = {},
): Promise<CaseResult[]> {
  const { config, assignmentDir } = ctx;
  const timeoutMs = config.timeoutMs ?? 5000;
  // Hoisted as booleans: comparing `config.reportStyle` directly inside an
  // if/else chain narrows the property, which then makes a later comparison
  // against an already-excluded value look impossible to the type checker.
  const style = config.reportStyle;
  const isTestcase = style === "testcase";
  const isRunning = style === "running";
  const isInline = style === "inline";
  const isMessage = style === "message";
  const results: CaseResult[] = [];

  // ---- stage 0: the student's program on its own --------------------------
  // The original ran the submitted file first and reported
  // "Your file matched the expected output", then relinked with its own main.
  if (config.selfTest && config.build?.driver) {
    results.push(await runSelfTest(ctx, timeoutMs));
    if (config.selfTest.replaceMessage) ctx.report(config.selfTest.replaceMessage);
  }

  // The executable is named after the assignment unless the config says
  // otherwise, so `Testing ./squares 1 0 0 1` reads like the original.
  const spec = { output: config.id, ...(config.build ?? {}) };

  const caseResults = await withBuiltProgram(
    {
      workDir: assignmentDir,
      spec,
      driverPath: driverPathFor(ctx),
      defaultSource: config.source,
      timeoutMs: Math.max(timeoutMs * 4, 30_000),
      // Only the Makefile-driven assignments echoed compiler output.
      log: config.showCompileCommands ? ctx.report : undefined,
    },
    async (exe, _buildDir, outcome) => {
      if (!outcome.ok) {
        const lines = ["Your code did not compile"];
        if (outcome.stderr.trim()) {
          lines.push("Compilation failed with the following errors:", outcome.stderr.trimEnd());
        }
        lines.forEach(ctx.report);
        return [{ label: "compile", passed: false, reason: "compilation failed", lines }];
      }

      const cases = config.tests ?? [];
      const built: CaseResult[] = [];

      for (let i = 0; i < cases.length; i++) {
        const tc = cases[i]!;
        const label = labelFor(tc, i, exe);

        // Never force ASAN_OPTIONS here: `detect_leaks=1` aborts every program
        // on macOS, where LeakSanitizer does not exist. `runMemoryCases`
        // handles memory checks through its own two-pass engine instead.
        const env = tc.env;

        const run = await runWithTimeout([exe, ...(tc.args ?? [])], {
          cwd: assignmentDir,
          timeoutMs,
          env,
          stdinFile: tc.stdinFile ? path.resolve(assignmentDir, tc.stdinFile) : undefined,
          stdin: tc.stdin,
        });

        if (run.timedOut) {
          const lines = [`Testing ${label}`, "FAILED", ` - Timed out after ${timeoutMs} ms`];
          lines.forEach(ctx.report);
          built.push({ label, passed: false, reason: "timeout", lines });
          continue;
        }

        const passed = await evaluateCase(ctx, tc, run);

        const lines: string[] = [];
        // `07_retirement` prints a table from the driver; echo it back.
        if (config.echoStdout && run.stdout.byteLength > 0) {
          lines.push(echoBytes(run.stdout).trimEnd());
        }

        if (isTestcase) {
          const labelLine = expand(config.caseLabelTemplate ?? "testcase{n}:", i, label);
          lines.push("#################################################", labelLine);
          if (tc.hint) lines.push(tc.hint);
        } else if (isRunning) {
          lines.push(`Running testcase ${i + 1}`);
        } else if (!isInline && !isMessage) {
          lines.push(`Testing ${label}`);
        }

        if (passed) {
          if (isMessage) {
            // Message-only dialect: the case emits just its verdict sentence,
            // as 04_compile's report does (`Your file matched the expected output`).
            lines.push(tc.message ?? config.successMessage ?? "PASSED");
          } else if (isTestcase) {
            // Observed: the line after `testcaseN:` is EITHER `testcaseN passed`
            // (06_rect) OR the case's own line (14_array_max: `array size:0 was
            // Correct`) — never both. So `message` replaces the default, and an
            // empty string suppresses the line entirely (28_fix_vg_encr's
            // testcases 2-6 print nothing before the memory verdict).
            // Two observed shapes: `testcaseN:` is followed EITHER by the case's
            // own line in place of the default (14_array_max: `array size:0 was
            // Correct`), OR by that line AND `input.N passed` (08_testing). An
            // explicit `casePassTemplate` therefore means "always emit it";
            // otherwise a message replaces the default.
            const explicitPass = config.casePassTemplate !== undefined;
            if (tc.message !== undefined && tc.message !== "") lines.push(tc.message);
            if (tc.message === undefined || explicitPass) {
              lines.push(expand(config.casePassTemplate ?? "testcase{n} passed", i, label));
            }
          } else if (isRunning) {
            // Observed (20_rot_matrix): all three lines are present.
            lines.push(tc.message ?? "Your file matched the expected output");
            lines.push(`testcase${i + 1} passed`);
          } else if (isInline) {
            lines.push(`Testing ${label} ... Correct`);
          } else {
            lines.push("PASSED", " - Correct");
          }
          lines.forEach(ctx.report);
          built.push({ label, passed: true, lines });
          continue;
        }

        if (isInline) lines.push(`Testing ${label} ... Incorrect`);
        if (isMessage) {
          lines.push(tc.failureMessage ?? "FAILED");
        } else if (isTestcase) {
          lines.push(`testcase${i + 1} failed`);
        } else if (!isInline && !isMessage) {
          lines.push("FAILED");
        }
        const { expected } = await materialize(ctx, tc);
        if (expected) lines.push("Expected:", showBytes(expected), "Got:", showBytes(run.stdout));
        if (run.stderr.trim()) lines.push("stderr:", run.stderr.trimEnd());
        if (tc.expectedExit !== undefined && run.exitCode !== tc.expectedExit) {
          lines.push(`Your program exited with status ${run.exitCode}; expected ${tc.expectedExit}`);
        }
        lines.forEach(ctx.report);
        built.push({ label, passed: false, reason: "output mismatch", lines });
      }

      if (built.every((r) => r.passed) && config.passMessage) ctx.report(config.passMessage);
      return built;
    },
  );

  return [...results, ...caseResults];
}

/**
 * Build and run the student's own source without the grader driver.
 *
 * Returns a passing no-op result when the source has no `main` and therefore
 * cannot link standalone — that is the normal case for assignments such as
 * `05_squares`, where the whole point is that the student writes no `main`.
 */
async function runSelfTest(ctx: StrategyContext, timeoutMs: number): Promise<CaseResult> {
  const { config, assignmentDir } = ctx;
  const selfTest = config.selfTest!;
  const label = config.source ?? "self test";

  const outcome = await withBuiltProgram(
    {
      workDir: assignmentDir,
      spec: {
        output: `${config.id}-self`,
        flags: config.build?.flags,
        compiler: config.build?.compiler,
        sources: [config.source!],
        linkObjects: config.build?.linkObjects,
      },
      defaultSource: config.source,
      timeoutMs: Math.max(timeoutMs * 4, 30_000),
    },
    async (exe, _dir, built) => {
      if (!built.ok) return { skipped: true as const, stdout: new Uint8Array(0) };
      const run = await runWithTimeout([exe], { cwd: assignmentDir, timeoutMs });
      return { skipped: false as const, stdout: run.stdout };
    },
  );

  if (outcome.skipped) return { label, passed: true, lines: [] };

  const expected = await expectedBytesFor(ctx.root, selfTest.expectedFile, selfTest.expected);
  const actual = outcome.stdout;
  let passed = actual.byteLength === expected.byteLength;
  if (passed) {
    for (let i = 0; i < expected.byteLength; i++) {
      if (actual[i] !== expected[i]) {
        passed = false;
        break;
      }
    }
  }

  if (passed) {
    const message = selfTest.successMessage ?? "Your file matched the expected output";
    ctx.report(message);
    return { label, passed: true, lines: [message] };
  }

  const lines = [
    "Your file did not match the expected output",
    "Expected:",
    showBytes(expected),
    "Got:",
    showBytes(actual),
  ];
  lines.forEach(ctx.report);
  return { label, passed: false, reason: "standalone program output mismatch", lines };
}

async function compareToExpectedFile(
  run: { stdout: Uint8Array; exitCode: number | null },
  expectedPath: string,
  _tc: TestCase,
): Promise<boolean> {
  // Spill to a temp file so large captures are compared by streaming.
  const { tmpdir } = await import("node:os");
  const { rm } = await import("node:fs/promises");
  const tmp = path.join(tmpdir(), `grade-cmp-${process.pid}-${Math.random().toString(36).slice(2)}`);
  try {
    await Bun.write(tmp, run.stdout);
    return await filesEqual(tmp, expectedPath);
  } finally {
    await rm(tmp, { force: true });
  }
}

/** Load expected bytes for the failure report, if the case has any. */
async function materialize(
  ctx: StrategyContext,
  tc: TestCase,
): Promise<{ expected: Uint8Array | null }> {
  if (tc.expectedFile) {
    const p = resolveExpected(ctx.root, tc.expectedFile);
    if (existsSync(p)) return { expected: new Uint8Array(await Bun.file(p).arrayBuffer()) };
    return { expected: null };
  }
  if (tc.expected !== undefined) {
    return { expected: new TextEncoder().encode(tc.expected) };
  }
  return { expected: null };
}

/**
 * Interpret an AddressSanitizer run. Returns null when memory was clean.
 *
 * Only an explicit `ERROR: AddressSanitizer:` line counts. Exit status 99 is
 * deliberately NOT treated as an error: ASan uses 99 as its generic failure
 * code, but it is also what the runtime returns when handed an option it does
 * not support, and Apple's runtime rejects `detect_leaks` outright. An
 * exit-code-only heuristic would therefore report a clean program as broken.
 */
function memoryVerdict(_exitCode: number | null, stderr: string): string | null {
  const match = stderr
    .split("\n")
    .find((l) => /ERROR: AddressSanitizer/.test(l) || /ERROR: LeakSanitizer/.test(l));
  return match ? match.trim() : null;
}

export async function compileAndRun(ctx: StrategyContext): Promise<CaseResult[]> {
  // `Attempting to compile <file>` comes first, then the run header, matching
  // the original's ordering (e.g. 06_rect).
  if (ctx.config.compileMessage) ctx.report(ctx.config.compileMessage);
  if (ctx.config.header) ctx.report(ctx.config.header);
  return runCases(ctx);
}

/**
 * `memory_check`: build twice and drive every case through both passes.
 *
 * On macOS LeakSanitizer is not implemented — `ASAN_OPTIONS=detect_leaks=1`
 * makes the process abort with exit 99 and "detect_leaks is not supported on
 * this platform". And `leaks` cannot inspect an ASan binary, because ASan
 * installs its own malloc. So the two defect classes need two builds:
 *
 *   pass 1  -fsanitize=address  -> out-of-bounds, use-after-free, double-free
 *   pass 2  plain + `leaks`     -> leaked allocations
 *
 * Where `leaks` is unavailable (Linux), only pass 1 runs; `notes` on the
 * config records that leak detection is then unavailable.
 */
export async function runMemoryCases(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config, assignmentDir } = ctx;
  const timeoutMs = config.timeoutMs ?? 5000;
  const cases = config.tests ?? [];
  // Leak detection differs by platform, and so does the best engine:
  //   Linux  - valgrind exists and does errors *and* leaks in one run, which is
  //            exactly what the original course used.
  //   macOS  - no valgrind, no LeakSanitizer, so ASan for errors and Apple's
  //            `leaks` for leaks, as two builds.
  const valgrind = process.platform === "linux" ? Bun.which("valgrind") : null;
  const useLeaks =
    !valgrind && process.platform === "darwin" && Bun.which("leaks") !== null;

  const baseFlags = config.build?.flags ?? [];
  const spec = {
    output: config.id,
    ...(config.build ?? {}),
    // With valgrind available, build once, plainly: valgrind reports both
    // errors and leaks, so instrumenting the binary adds nothing.
    flags: valgrind ? baseFlags : [...baseFlags, "-fsanitize=address", "-fno-omit-frame-pointer", "-g"],
  };

  return withBuiltProgram(
    {
      workDir: assignmentDir,
      spec,
      driverPath: driverPathFor(ctx),
      defaultSource: config.source,
      timeoutMs: Math.max(timeoutMs * 4, 30_000),
      log: config.showCompileCommands ? ctx.report : undefined,
    },
    async (asanExe, buildDir, outcome) => {
      if (!outcome.ok) {
        const lines = ["Your code did not compile"];
        if (outcome.stderr.trim()) {
          lines.push("Compilation failed with the following errors:", outcome.stderr.trimEnd());
        }
        lines.forEach(ctx.report);
        return [{ label: "compile", passed: false, reason: "compilation failed", lines }];
      }

      // Second build, without ASan, for `leaks`.
      let plainExe: string | null = null;
      if (useLeaks) {
        const candidate = path.join(buildDir, `${config.id}-plain`);
        const cmd = [outcome.compiler, ...baseFlags, "-g", "-o", candidate, ...outcome.sources];
        const r = await runWithTimeout(cmd, { cwd: buildDir, timeoutMs: 60_000 });
        if (r.exitCode === 0) plainExe = candidate;
      }

      const built: CaseResult[] = [];
      for (let i = 0; i < cases.length; i++) {
        const tc = cases[i]!;
        const label = labelFor(tc, i, `${config.id}${i + 1}`);

        const r = valgrind
          ? await valgrindRun(ctx, tc, { exe: asanExe, timeoutMs })
          : await memoryRun(ctx, tc, { asanExe, plainExe, timeoutMs });

        const lines: string[] = [];
        if (config.reportStyle === "testcase") {
          lines.push("#################################################", `testcase${i + 1}:`);
        }

        if (r.timedOut) {
          lines.push(`Testing ${label}`, "FAILED", ` - Timed out after ${timeoutMs} ms`);
          lines.forEach(ctx.report);
          built.push({ label, passed: false, reason: "timeout", lines });
          continue;
        }

        const outputOk = await evaluateCase(ctx, tc, r);
        const passed = outputOk && r.memIssue === null;

        if (passed) {
          // Observed: this dialect has no `testcaseN passed` line. The case
          // emits its own verdict sentence (`your output was correct`,
          // `Your output is correct`, or `testcase1 passed, your program
          // successfully indicated a failure`), then the memory verdict.
          lines.push(tc.message ?? config.successMessage ?? "Your output is correct");
          lines.push("  - Valgrind was clean (no errors, no memory leaks)");
          lines.push("valgrind was clean");
          lines.forEach(ctx.report);
          built.push({ label, passed: true, lines });
          continue;
        }

        if (r.memIssue) {
          lines.push(`Memory error detected: ${r.memIssue}`);
        } else {
          lines.push(tc.failureMessage ?? `testcase${i + 1} failed`);
          const { expected } = await materialize(ctx, tc);
          if (expected) lines.push("Expected:", showBytes(expected), "Got:", showBytes(r.stdout));
        }
        lines.forEach(ctx.report);
        built.push({ label, passed: false, reason: r.memIssue ?? "output mismatch", lines });
      }

      if (built.every((x) => x.passed) && config.passMessage) ctx.report(config.passMessage);
      return built;
    },
  );
}

export const compileAndRunStrategy: Strategy = {
  id: "compile_and_run",
  run: compileAndRun,
};

export const memoryCheckStrategy: Strategy = {
  id: "memory_check",
  run: async (ctx) => {
    if (ctx.config.compileMessage) ctx.report(ctx.config.compileMessage);
    if (ctx.config.header) ctx.report(ctx.config.header);
    return runMemoryCases(ctx);
  },
};

/**
 * Does this run satisfy the case? Shared by the plain and memory paths so both
 * apply exactly the same comparison rules.
 */
async function evaluateCase(
  ctx: StrategyContext,
  tc: TestCase,
  run: { stdout: Uint8Array; exitCode: number | null },
): Promise<boolean> {
  if (tc.expectFailure) return run.exitCode !== 0;

  // On Windows a C program's stdout is opened in text mode, so the runtime
  // rewrites every "\n" as "\r\n" on the way out. Comparing that against the
  // LF fixtures would fail every case for a reason that has nothing to do with
  // the student's code, so a newline-only difference is accepted here.
  if (await matches(ctx, tc, run, (a, b) => buffersEqual(a, b))) return true;
  if (await matches(ctx, tc, run, (a, b) => buffersEqual(foldNewlines(a), foldNewlines(b)))) {
    return true;
  }
  return false;
}

/** One comparison attempt against whatever the case is configured with. */
async function matches(
  ctx: StrategyContext,
  tc: TestCase,
  run: { stdout: Uint8Array; exitCode: number | null },
  eq: (a: Uint8Array, b: Uint8Array) => boolean,
): Promise<boolean> {
  if (tc.expectedExit !== undefined && run.exitCode !== tc.expectedExit) return false;
  if (tc.expectedFile) {
    // Compare against a file on disk so large expected outputs are never fully
    // resident in memory.
    const expectedPath = resolveExpected(ctx.root, tc.expectedFile);
    if (!existsSync(expectedPath)) {
      throw new Error(`expected output file is missing: ${tc.expectedFile}`);
    }
    if (eq === buffersEqual) return compareToExpectedFile(run, expectedPath, tc);
    // Newline-tolerant path: fold both sides, then compare in memory. Fixtures
    // are capped well below the streaming threshold used elsewhere.
    const expected = new Uint8Array(await Bun.file(expectedPath).arrayBuffer());
    return eq(run.stdout, expected);
  }
  const expected = await expectedBytesFor(ctx.root, undefined, tc.expected);
  return eq(run.stdout, expected);
}

/** Apple's `leaks` reports either "is not leaking" or "N leaks for M bytes". */
const LEAK_REPORT = /Process \d+: (\d+) leaks? for (\d+) total leaked bytes/;
const LEAK_CLEAN = /Process \d+ is not leaking/;

/**
 * Run one case under valgrind, the engine the original course used.
 *
 * `--error-exitcode=99` makes valgrind itself the verdict: any reported error,
 * including a leak, turns into exit status 99. `--leak-check=full` is what the
 * original asked for, and `--errors-for-leak-kinds=definite,indirect` keeps
 * "still reachable" allocations from being called a leak, which is the same
 * distinction valgrind's own summary draws.
 */
async function valgrindRun(
  ctx: StrategyContext,
  tc: TestCase,
  opts: { exe: string; timeoutMs: number },
): Promise<{ memIssue: string | null; exitCode: number | null; stdout: Uint8Array; timedOut: boolean }> {
  const args = tc.args ?? [];
  const result = await runWithTimeout(
    [
      "valgrind",
      "--leak-check=full",
      "--errors-for-leak-kinds=definite,indirect",
      "--error-exitcode=99",
      "--quiet",
      opts.exe,
      ...args,
    ],
    {
      cwd: ctx.assignmentDir,
      timeoutMs: Math.max(opts.timeoutMs * 20, 60_000),
      stdinFile: tc.stdinFile ? path.resolve(ctx.assignmentDir, tc.stdinFile) : undefined,
      stdin: tc.stdin,
      env: tc.env,
    },
  );

  if (result.timedOut) {
    return { memIssue: null, exitCode: result.exitCode, stdout: result.stdout, timedOut: true };
  }
  if (result.exitCode === 99) {
    const first = result.stderr
      .split("\n")
      .map((l) => l.trim())
      .find((l) => /lost|Invalid|uninitialised|Mismatched|ERROR SUMMARY/.test(l));
    return {
      memIssue: first ?? "valgrind reported a memory error",
      exitCode: result.exitCode,
      stdout: result.stdout,
      timedOut: false,
    };
  }
  return { memIssue: null, exitCode: result.exitCode, stdout: result.stdout, timedOut: false };
}

/**
 * Run one case under AddressSanitizer and, separately, under Apple's `leaks`.
 *
 * On macOS LeakSanitizer is not implemented — `ASAN_OPTIONS=detect_leaks=1`
 * makes the process abort with exit 99 and the message "detect_leaks is not
 * supported on this platform". And `leaks` cannot be combined with ASan,
 * because ASan installs its own malloc. So the two classes of defect need two
 * builds of the same program:
 *
 *   pass 1  -fsanitize=address   -> out-of-bounds, use-after-free, double-free
 *   pass 2  plain build + leaks  -> leaked allocations
 *
 * On Linux, where valgrind exists, pass 2 is replaced by valgrind itself.
 */
export async function memoryRun(
  ctx: StrategyContext,
  tc: TestCase,
  opts: { asanExe: string; plainExe: string | null; timeoutMs: number },
): Promise<{ memIssue: string | null; exitCode: number | null; stdout: Uint8Array; timedOut: boolean }> {
  const args = tc.args ?? [];
  const stdinFile = tc.stdinFile ? path.resolve(ctx.assignmentDir, tc.stdinFile) : undefined;

  const asan = await runWithTimeout([opts.asanExe, ...args], {
    cwd: ctx.assignmentDir,
    timeoutMs: opts.timeoutMs,
    stdinFile,
    stdin: tc.stdin,
    env: tc.env,
  });
  if (asan.timedOut) {
    return { memIssue: null, exitCode: asan.exitCode, stdout: asan.stdout, timedOut: true };
  }
  const asanIssue = memoryVerdict(asan.exitCode, asan.stderr);
  if (asanIssue) {
    return { memIssue: asanIssue, exitCode: asan.exitCode, stdout: asan.stdout, timedOut: false };
  }

  if (!opts.plainExe) {
    return { memIssue: null, exitCode: asan.exitCode, stdout: asan.stdout, timedOut: false };
  }

  const leak = await runWithTimeout(["leaks", "--atExit", "--", opts.plainExe, ...args], {
    cwd: ctx.assignmentDir,
    timeoutMs: opts.timeoutMs * 3,
    stdinFile,
    stdin: tc.stdin,
    env: tc.env,
  });
  const combined = leak.stderr + new TextDecoder().decode(leak.stdout);
  const m = LEAK_REPORT.exec(combined);
  // `leaks` prints "0 leaks for 0 total leaked bytes" on a clean run, so the
  // count itself decides, not the mere presence of the line.
  if (m && Number(m[1]) > 0 && !LEAK_CLEAN.test(combined)) {
    return {
      memIssue: `${m[1]} leaked allocation(s), ${m[2]} bytes total`,
      exitCode: asan.exitCode,
      stdout: asan.stdout,
      timedOut: false,
    };
  }
  return { memIssue: null, exitCode: asan.exitCode, stdout: asan.stdout, timedOut: false };
}
