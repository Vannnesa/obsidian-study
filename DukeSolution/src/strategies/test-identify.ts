/**
 * `test_identify` -- the student writes a test harness that must expose every
 * broken implementation of a function while accepting the correct one.
 *
 * Assignments: 08_testing, 09_testing2, 15_tests_subseq, 22_tests_power,
 * 26_tests_matrix_input, c2prj2_testing.
 *
 * Contract with the student's harness: exit status 0 means "this
 * implementation looks correct", non-zero means "I found the bug". The
 * harness output is captured and echoed on failure, because the original
 * grader showed it (for example `2 elevado a 2 en power da 2`).
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { runWithTimeout } from "../runner.ts";
import { withBuiltProgram } from "../build.ts";
import type { CaseResult } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

export async function testIdentify(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config, assignmentDir } = ctx;
  const harness = path.resolve(assignmentDir, config.studentTest!);

  if (!existsSync(harness)) {
    const lines = [`Your file ${config.studentTest} was not found`];
    lines.forEach(ctx.report);
    return [{ label: config.studentTest!, passed: false, reason: "harness missing", lines }];
  }

  const subjects = config.subjects ?? [];
  const results: CaseResult[] = [];
  const broken = subjects.filter((s) => s.broken);
  const correct = subjects.filter((s) => !s.broken);

  for (let i = 0; i < subjects.length; i++) {
    const subject = subjects[i]!;
    const outcome = await withBuiltProgram(
      {
        workDir: assignmentDir,
        spec: {
          output: `identify-${subject.name}`,
          flags: subject.flags ?? ["-std=gnu99", "-Wall"],
          sources: [config.studentTest!, ...(subject.extraSources ?? [])],
          resolveSymlinks: subject.source.includes("..") ? true : false,
        },
        driverPath: path.resolve(assignmentDir, subject.source),
        timeoutMs: 30_000,
      },
      async (exe, _dir, built) => {
        if (!built.ok) {
          return { compiled: false as const, stderr: built.stderr, exitCode: null, stdout: "" };
        }
        const run = await runWithTimeout([exe], {
          cwd: assignmentDir,
          timeoutMs: config.timeoutMs ?? 5000,
        });
        return {
          compiled: true as const,
          stderr: run.stderr,
          exitCode: run.exitCode,
          stdout: new TextDecoder().decode(run.stdout),
        };
      },
    );

    if (!outcome.compiled) {
      const lines = [
        `Your test program did not compile with ${subject.name}`,
        outcome.stderr.trimEnd(),
      ];
      lines.forEach(ctx.report);
      results.push({ label: subject.name, passed: false, reason: "harness failed to compile", lines });
      continue;
    }

    const detected = outcome.exitCode !== 0;
    const lines: string[] = [];

    if (subject.broken) {
      if (config.reportStyle === "identify-star") {
        lines.push(
          `**Testing broken implementation ${i + 1} **`,
          "-------------------------------------",
          "",
        );
      } else {
        lines.push(`Checking ${subject.name}`);
      }
      if (detected) {
        if (outcome.stdout.trim()) lines.push(outcome.stdout.trimEnd());
        if (config.reportStyle === "identify-star") lines.push("");
        else lines.push(`Your tests identified the problem with ${subject.name}`);
        lines.forEach(ctx.report);
        results.push({ label: subject.name, passed: true, lines });
      } else {
        lines.push(
          `Your tests did not identify the problem with ${subject.name}`,
          " - this implementation is broken, but your tests accepted it",
        );
        lines.forEach(ctx.report);
        results.push({ label: subject.name, passed: false, reason: "missed a broken program", lines });
      }
      continue;
    }

    // the reference-correct implementation: the harness must accept it
    if (config.reportStyle === "identify-star") {
      lines.push("**Testing correct implementation **", "-------------------------------------", "");
    }
    if (detected) {
      lines.push(
        `Your tests rejected the correct implementation (${subject.name})`,
        outcome.stdout.trimEnd(),
        outcome.stderr.trimEnd(),
      );
      lines.forEach(ctx.report);
      results.push({ label: subject.name, passed: false, reason: "false positive", lines });
    } else {
      lines.push(
        config.reportStyle === "identify-star"
          ? "All tests were ok."
          : "All test programs were handled correctly",
      );
      lines.forEach(ctx.report);
      results.push({ label: subject.name, passed: true, lines });
    }
  }

  if (broken.length > 0 && broken.every((b) => results.find((r) => r.label === b.name)?.passed)) {
    const summary =
      config.reportStyle === "identify-star"
        ? "All tests were ok."
        : "Your tests identified problems with all broken programs";
    ctx.report(summary);
  }
  if (correct.length > 0 && correct.every((c) => results.find((r) => r.label === c.name)?.passed)) {
    ctx.report("All test programs were handled correctly");
  }

  return results;
}

export const testIdentifyStrategy: Strategy = {
  id: "test_identify",
  run: testIdentify,
};
