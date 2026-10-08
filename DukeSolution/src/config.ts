/**
 * Config loading and validation.
 *
 * Configs live in the package under `data/configs/`; the assignment they
 * describe lives in the student's workspace. `src/paths.ts` owns that split.
 */

import { existsSync } from "node:fs";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { configsDir, configFile, dataDir } from "./paths.ts";
import { STRATEGY_IDS, type AssignmentConfig, type StrategyId, type TestCase } from "./types.ts";

/** Every report dialect a config may select. Kept in one place so the union in
 *  types.ts and the validator here cannot drift apart. */
export const REPORT_STYLES = [
  "squares",
  "testcase",
  "inline",
  "running",
  "message",
  "identify-star",
] as const;

export class ConfigError extends Error {}

/** Every assignment id that has a config, in numeric/alphabetic order. */
export async function listAssignmentIds(root: string): Promise<string[]> {
  const dir = configsDir(root);
  if (!existsSync(dir)) return [];
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".json"))
    .map((e) => e.name.slice(0, -".json".length))
    .sort(compareAssignmentIds);
}

/**
 * Sort `05_squares` before `10_gdb`, and the capstone projects after the
 * numbered ones. Plain lexicographic order would put `10_gdb` after `01_apple`
 * only by luck of zero padding; this keeps the course order stable.
 */
export function compareAssignmentIds(a: string, b: string): number {
  const pa = parseAssignmentId(a);
  const pb = parseAssignmentId(b);
  if (pa.group !== pb.group) return pa.group - pb.group;
  if (pa.num !== pb.num) return pa.num - pb.num;
  return a.localeCompare(b);
}

function parseAssignmentId(id: string): { group: number; num: number } {
  const numbered = /^(\d+)_/.exec(id);
  if (numbered) return { group: 0, num: Number(numbered[1]) };
  const proj = /^c(\d+)prj(\d+)/.exec(id);
  if (proj) return { group: 1, num: Number(proj[1]) * 100 + Number(proj[2]) };
  return { group: 2, num: 0 };
}

export async function readConfig(root: string, id: string): Promise<AssignmentConfig> {
  const file = configFile(root, id);
  if (!existsSync(file)) {
    throw new ConfigError(
      `unknown assignment "${id}" (no ${path.relative(dataDir(root), file)} in the package)`,
    );
  }
  let parsed: unknown;
  const text = await readFile(file, "utf8");
  try {
    parsed = JSON.parse(text);
  } catch (err) {
    throw new ConfigError(`${path.relative(dataDir(root), file)} is not valid JSON: ${(err as Error).message}`);
  }
  const config = parsed as AssignmentConfig;
  const problems = validateConfig(config, id);
  if (problems.length > 0) {
    throw new ConfigError(
      `${path.relative(dataDir(root), file)} is invalid:\n  - ${problems.join("\n  - ")}`,
    );
  }
  return config;
}

/**
 * Structural validation. Returns a list of human-readable problems; an empty
 * list means the config is usable. Kept dependency-free on purpose.
 */
export function validateConfig(config: AssignmentConfig, expectedId?: string): string[] {
  const bad: string[] = [];
  const need = (cond: boolean, msg: string) => {
    if (!cond) bad.push(msg);
  };

  need(typeof config.id === "string" && config.id.length > 0, "`id` must be a non-empty string");
  if (expectedId !== undefined && config.id !== expectedId) {
    bad.push(`\`id\` is "${config.id}" but the file is named "${expectedId}.json"`);
  }
  need(
    typeof config.type === "string" && (STRATEGY_IDS as readonly string[]).includes(config.type),
    `\`type\` must be one of: ${STRATEGY_IDS.join(", ")}`,
  );
  if (config.type === "unsupported") {
    // An unsupported assignment still needs a reason so the report is honest.
    need(
      typeof config.notes === "string" && config.notes.length > 0,
      "`type: unsupported` requires a `notes` field explaining why",
    );
    return bad;
  }

  switch (config.type as StrategyId) {
    case "file_compare":
      need(!!config.file, "file_compare requires `file`");
      need(
        !!config.expectedFile || config.expected !== undefined,
        "file_compare requires `expectedFile` or `expected`",
      );
      break;
    case "compile_and_run":
    case "memory_check":
      need(!!config.source, `${config.type} requires \`source\``);
      need(Array.isArray(config.tests) && config.tests.length > 0, `${config.type} requires a non-empty \`tests\` array`);
      break;
    case "predict_output":
      need(!!config.program, "predict_output requires `program`");
      need(!!config.file, "predict_output requires `file` (the student's prediction file)");
      break;
    case "source_check":
      need(!!config.source, "source_check requires `source`");
      break;
    case "test_identify":
      need(!!config.studentTest, "test_identify requires `studentTest`");
      need(
        Array.isArray(config.subjects) && config.subjects.length > 0,
        "test_identify requires a non-empty `subjects` array",
      );
      break;
  }

  if (config.tests) {
    config.tests.forEach((t: TestCase, i: number) => {
      need(
        !!t.expectedFile || t.expected !== undefined || t.expectFailure === true,
        `tests[${i}] needs \`expectedFile\`, \`expected\` or \`expectFailure\``,
      );
    });
  }
  if (config.successVerdict !== undefined) {
    need(
      config.successVerdict === "PASSED" || config.successVerdict === "A",
      '`successVerdict` must be "PASSED" or "A"',
    );
  }
  if (config.reportStyle !== undefined) {
    need(
      (REPORT_STYLES as readonly string[]).includes(config.reportStyle),
      `\`reportStyle\` must be one of: ${REPORT_STYLES.join(", ")}`,
    );
  }
  if (config.timeoutMs !== undefined) {
    need(
      Number.isFinite(config.timeoutMs) && config.timeoutMs > 0,
      "`timeoutMs` must be a positive number",
    );
  }
  return bad;
}

export async function directoryExists(p: string): Promise<boolean> {
  try {
    return (await stat(p)).isDirectory();
  } catch {
    return false;
  }
}
