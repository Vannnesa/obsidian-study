/**
 * Strategy registry.
 *
 * Every `type` in a config maps to exactly one module here. Adding an
 * assignment type means adding a file and one registry entry -- no changes to
 * the CLI, config loader or report writer.
 */

import type { AssignmentConfig, CaseResult, StrategyId } from "../types.ts";
import { fileCompareStrategy } from "./file-compare.ts";
import { compileAndRunStrategy, memoryCheckStrategy } from "./compile-and-run.ts";
import { predictOutputStrategy } from "./predict-output.ts";
import { sourceCheckStrategy } from "./source-check.ts";
import { testIdentifyStrategy } from "./test-identify.ts";
import { unsupportedStrategy } from "./unsupported.ts";

export interface StrategyContext {
  /** Project root (the directory holding `configs/`). */
  root: string;
  /** Absolute path of the assignment directory currently being graded. */
  assignmentDir: string;
  config: AssignmentConfig;
  /** Append a line to the report and echo it to the terminal. */
  report: (line: string) => void;
}

export interface Strategy {
  id: StrategyId;
  run(ctx: StrategyContext): Promise<CaseResult[]>;
}

const REGISTRY: Record<StrategyId, Strategy> = {
  file_compare: fileCompareStrategy,
  compile_and_run: compileAndRunStrategy,
  memory_check: memoryCheckStrategy,
  predict_output: predictOutputStrategy,
  source_check: sourceCheckStrategy,
  test_identify: testIdentifyStrategy,
  unsupported: unsupportedStrategy,
};

export function strategyFor(id: StrategyId): Strategy {
  const s = REGISTRY[id];
  if (!s) throw new Error(`no strategy registered for type "${id}"`);
  return s;
}

export function registeredStrategies(): StrategyId[] {
  return Object.keys(REGISTRY) as StrategyId[];
}

export {
  fileCompareStrategy,
  compileAndRunStrategy,
  memoryCheckStrategy,
  predictOutputStrategy,
  sourceCheckStrategy,
  testIdentifyStrategy,
  unsupportedStrategy,
};
