/**
 * `grade.txt` rendering.
 *
 * The timestamp format matches the original tool byte-for-byte:
 *   Mon 19 Feb 2024 05:45:13 PM UTC
 * i.e. strftime("%a %d %b %Y %I:%M:%S %p UTC") in UTC.
 */

import path from "node:path";
import type { CaseResult, GradeResult } from "./types.ts";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatTimestamp(date: Date): string {
  const d = DAYS[date.getUTCDay()]!;
  const day = String(date.getUTCDate()).padStart(2, "0");
  const mon = MONTHS[date.getUTCMonth()]!;
  const year = date.getUTCFullYear();
  const hours24 = date.getUTCHours();
  const ampm = hours24 < 12 ? "AM" : "PM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const hh = String(hours12).padStart(2, "0");
  const mm = String(date.getUTCMinutes()).padStart(2, "0");
  const ss = String(date.getUTCSeconds()).padStart(2, "0");
  return `${d} ${day} ${mon} ${year} ${hh}:${mm}:${ss} ${ampm} UTC`;
}

export interface RenderOptions {
  /** Verdict vocabulary; `PASSED`/`FAILED` for most, `A` for the graded ones. */
  verdict: string;
}

/** Build the full text of a `grade.txt`. */
export function renderGradeTxt(result: GradeResult): string {
  const lines: string[] = [`Grading at ${formatTimestamp(result.startedAt)}`];
  for (const line of result.lines) lines.push(line);
  lines.push("", `Overall Grade: ${result.verdict}`, "");
  return lines.join("\n");
}

export async function writeGradeTxt(dir: string, result: GradeResult): Promise<string> {
  const file = path.join(dir, "grade.txt");
  await Bun.write(file, renderGradeTxt(result));
  return file;
}

/** One-line summary for the terminal, mirroring the original's vocabulary. */
export function summarize(result: GradeResult): string {
  const failed = result.cases.filter((c) => !c.passed);
  if (failed.length === 0) return `Overall Grade: ${result.verdict}`;
  const reasons = [...new Set(failed.map((f) => f.reason ?? "failed"))].join(", ");
  return `Overall Grade: ${result.verdict} (${failed.length}/${result.cases.length} checks failed: ${reasons})`;
}

/** Assemble a GradeResult from the reported lines and case outcomes. */
export function buildResult(
  id: string,
  cases: CaseResult[],
  lines: string[],
  startedAt: Date,
): GradeResult {
  const passed = cases.length > 0 && cases.every((c) => c.passed);
  return {
    id,
    passed,
    verdict: passed ? "PASSED" : "FAILED",
    lines,
    cases,
    startedAt,
    durationMs: Date.now() - startedAt.getTime(),
  };
}
