/**
 * `file_compare` -- the student must author a file with exact known content.
 *
 * Assignments: 00_hello, 01_apple, and the "write down what this program
 * prints" assignments where a plain text file is the whole deliverable.
 *
 * Comparison is byte-exact, including the trailing newline, because the
 * original grader compared the submitted blob against a stored blob. A
 * missing trailing newline is the single most common failure here, so the
 * report names it explicitly.
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { buffersEqual, describeNewlineDiff, showBytes } from "../runner.ts";
import { resolveExpected } from "../paths.ts";
import type { CaseResult } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

export async function expectedBytesFor(
  root: string,
  expectedFile: string | undefined,
  inline: string | undefined,
): Promise<Uint8Array> {
  if (expectedFile) {
    const file = resolveExpected(root, expectedFile);
    if (!existsSync(file)) {
      throw new Error(`expected output file is missing: ${path.relative(root, file)}`);
    }
    return new Uint8Array(await Bun.file(file).arrayBuffer());
  }
  return new TextEncoder().encode(inline ?? "");
}

export async function fileCompare(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config, assignmentDir, root } = ctx;
  const file = path.resolve(assignmentDir, config.file!);

  if (!existsSync(file)) {
    ctx.report(`Your file ${config.file} was not found`);
    return [
      {
        label: config.file!,
        passed: false,
        reason: "file missing",
        lines: [`Your file ${config.file} was not found`],
      },
    ];
  }

  const actual = new Uint8Array(await Bun.file(file).arrayBuffer());
  const expected = await expectedBytesFor(root, config.expectedFile, config.expected);

  if (buffersEqual(actual, expected)) {
    const message = config.successMessage ?? "Your file matched the expected output";
    ctx.report(message);
    return [{ label: config.file!, passed: true, lines: [message] }];
  }

  const lines = ["Your file did not match the expected output"];

  // Diagnose the difference before showing it: a CRLF or missing-newline
  // mismatch renders as two identical-looking blocks, which is useless.
  const newlineIssue = describeNewlineDiff(actual, expected);
  if (newlineIssue) {
    lines.push(newlineIssue);
  } else if (
    actual.byteLength === expected.byteLength - 1 &&
    buffersEqual(actual, expected.subarray(0, actual.byteLength))
  ) {
    lines.push("Your file is missing its final newline");
  } else if (actual.byteLength !== expected.byteLength) {
    lines.push(
      `Your file is ${actual.byteLength} bytes; the expected file is ${expected.byteLength} bytes`,
    );
  }
  lines.push("Expected:", showBytes(expected), "Got:", showBytes(actual));
  lines.forEach(ctx.report);
  return [{ label: config.file!, passed: false, reason: "content mismatch", lines }];
}

export const fileCompareStrategy: Strategy = {
  id: "file_compare",
  run: fileCompare,
};
