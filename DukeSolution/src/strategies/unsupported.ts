/**
 * `unsupported` -- an assignment that is recognised but cannot be graded
 * faithfully here.
 *
 * This strategy never fakes a pass. It explains precisely what is missing and
 * reports FAILED with the reason, so the student is never told they are done
 * when they are not. It exists for the handful of assignments whose grader
 * depended on a tool that does not exist on this platform.
 */

import type { CaseResult } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

export async function unsupported(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config } = ctx;
  const reason = config.notes ?? "this assignment cannot be graded on this platform";
  const lines = [
    "This assignment cannot be graded on this platform.",
    reason,
  ];
  if (config.title) lines.push(`Assignment: ${config.title}`);
  lines.forEach(ctx.report);
  return [{ label: config.id, passed: false, reason: "unsupported on this platform", lines }];
}

export const unsupportedStrategy: Strategy = {
  id: "unsupported",
  run: unsupported,
};
