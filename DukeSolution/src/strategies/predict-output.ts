/**
 * `predict_output` -- the student reads a provided program, works out what it
 * prints, and writes the answer into a text file.
 *
 * Assignments: 11_read_ptr1, 12_read_ptr2, 13_read_arr1, 17_read_arr2,
 * 21_read_rec1, 24_read_arr3.
 *
 * The original grader did two comparisons and reported both:
 *   "Your file matched the expected output"   -- prediction vs actual run
 *   "Your output matched what we expected"    -- actual run vs teacher's copy
 * The second one only fails when the provided program itself was modified, so
 * both are reproduced here.
 *
 * The historical reports also show *how* the program was built, and that part
 * is config-driven rather than assumed:
 *
 *   Attempting to compile test.c                              <- `header`
 *   gcc -std=gnu99 -pedantic -Wall -O3   -c -o test.o test.c  <- the recipes the
 *   gcc -o test -O3 test.o                                       student's own
 *   gcc -std=gnu99 -pedantic -Wall -ggdb3 -DDEBUG -c -o ...      Makefile printed
 *   gcc -o test-debug -ggdb3 test.dbg.o                          (`showCompileCommands`)
 *   compiled                                                  <- `compileMessage`
 *
 * Four of the six assignments ask the student for a Makefile and their reports
 * echo it; the other two (`21_read_rec1`, `24_read_arr3`) ship no Makefile and
 * were compiled silently. `build.make` selects between the two.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { buffersEqual, runWithTimeout, showBytes, withTempDir } from "../runner.ts";
import { materializeTree } from "../build.ts";
import { expectedBytesFor } from "./file-compare.ts";
import type { CaseResult } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

const DEFAULT_FLAGS = ["-std=gnu99", "-pedantic", "-Wall", "-O3"];
const BUILD_TIMEOUT_MS = 30_000;

interface ProgramRun {
  ok: boolean;
  stderr: string;
  stdout: Uint8Array;
}

/** `test.c` -> `test`: the program name every one of these READMEs asks for. */
function programName(program: string): string {
  return path.basename(program).replace(/\.c$/, "");
}

/**
 * Build the provided program and run it once, reporting the build the way the
 * original grader did: `header` before it, the compiler's own output when
 * `showCompileCommands` is set, and `compileMessage` after a successful build.
 *
 * The Makefile is driven with `-B` so that a build product left behind in the
 * directory cannot satisfy it -- without that, make declares the target up to
 * date and the check would silently run a stale binary. `-B` does not change
 * the recipes make echoes. The build happens in a scratch staging copy, so
 * grading never writes a `.o` file or an executable into the assignment.
 */
async function buildAndRun(ctx: StrategyContext, programPath: string): Promise<ProgramRun> {
  const { config, assignmentDir } = ctx;
  const timeoutMs = config.timeoutMs ?? 5000;
  const make = config.build?.make;

  const finish = async (exe: string): Promise<ProgramRun> => {
    if (config.compileMessage) ctx.report(config.compileMessage);
    const run = await runWithTimeout([exe], { cwd: assignmentDir, timeoutMs });
    return { ok: true, stderr: run.stderr, stdout: run.stdout };
  };

  if (make) {
    return withTempDir(async (tmp) => {
      const stage = path.join(tmp, "src");
      await materializeTree(assignmentDir, stage);

      if (make.cleanFirst) {
        await runWithTimeout(["make", "clean"], { cwd: stage, timeoutMs: BUILD_TIMEOUT_MS });
      }
      const args = make.args ?? ["-B"];
      const built = await runWithTimeout(["make", ...args], {
        cwd: stage,
        timeoutMs: BUILD_TIMEOUT_MS,
        maxCaptureBytes: 1 << 20,
      });

      if (config.showCompileCommands) {
        for (const line of new TextDecoder().decode(built.stdout).split("\n")) {
          if (line.trim()) ctx.report(line);
        }
      }

      const exe = path.join(stage, config.build?.output ?? programName(programPath));
      if (built.exitCode !== 0 || !existsSync(exe)) {
        return {
          ok: false,
          stderr: built.stderr.trim() || `the Makefile did not build ${path.basename(exe)}`,
          stdout: new Uint8Array(0),
        };
      }
      return finish(exe);
    });
  }

  return withTempDir(async (tmp) => {
    const exe = path.join(tmp, programName(programPath));
    const cmd = [
      config.build?.compiler ?? "cc",
      ...(config.build?.flags ?? DEFAULT_FLAGS),
      "-o",
      exe,
      programPath,
    ];
    if (config.showCompileCommands) ctx.report(cmd.join(" "));
    const build = await runWithTimeout(cmd, { cwd: assignmentDir, timeoutMs: BUILD_TIMEOUT_MS });
    if (build.exitCode !== 0) {
      return { ok: false, stderr: build.stderr, stdout: new Uint8Array(0) };
    }
    return finish(exe);
  });
}

export async function predictOutput(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config, assignmentDir, root } = ctx;
  const program = config.program!;
  const programPath = path.resolve(assignmentDir, program);

  if (!existsSync(programPath)) {
    const lines = [`Your file ${program} was not found`];
    lines.forEach(ctx.report);
    return [{ label: program, passed: false, reason: "program missing", lines }];
  }

  const predictionPath = path.resolve(assignmentDir, config.file!);
  if (!existsSync(predictionPath)) {
    const lines = [`Your file ${config.file} was not found`];
    lines.forEach(ctx.report);
    return [{ label: config.file!, passed: false, reason: "prediction missing", lines }];
  }

  if (config.header) ctx.report(config.header);

  const build = await buildAndRun(ctx, programPath);
  if (!build.ok) {
    const lines = ["Your code did not compile", build.stderr.trimEnd()];
    lines.forEach(ctx.report);
    return [{ label: program, passed: false, reason: "compilation failed", lines }];
  }

  const predicted = new Uint8Array(await Bun.file(predictionPath).arrayBuffer());
  const results: CaseResult[] = [];

  // (1) the student's prediction against what the program actually printed
  if (buffersEqual(predicted, build.stdout)) {
    ctx.report("Your file matched the expected output");
    results.push({
      label: config.file!,
      passed: true,
      lines: ["Your file matched the expected output"],
    });
  } else {
    const lines = [
      "Your file did not match the expected output",
      "Expected (what the program prints):",
      showBytes(build.stdout),
      "Got (your file):",
      showBytes(predicted),
    ];
    lines.forEach(ctx.report);
    results.push({
      label: config.file!,
      passed: false,
      reason: "prediction mismatch",
      lines,
    });
  }

  // (2) the program itself against the teacher's stored copy of its output
  const reference = await expectedBytesFor(root, config.expectedFile, config.expected);
  if (buffersEqual(build.stdout, reference)) {
    ctx.report("Your output matched what we expected");
    results.push({
      label: `${program} output`,
      passed: true,
      lines: ["Your output matched what we expected"],
    });
  } else {
    const lines = [
      "Your output did not match what we expected",
      " - did you modify " + program + "?",
      "Expected:",
      showBytes(reference),
      "Got:",
      showBytes(build.stdout),
    ];
    lines.forEach(ctx.report);
    results.push({
      label: `${program} output`,
      passed: false,
      reason: "program output changed",
      lines,
    });
  }

  return results;
}

export const predictOutputStrategy: Strategy = {
  id: "predict_output",
  run: predictOutput,
};
