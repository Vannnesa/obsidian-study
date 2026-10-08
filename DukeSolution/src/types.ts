/**
 * Core type definitions for the `grade` tool.
 *
 * One JSON file per assignment under `configs/<id>.json`. Everything the
 * runner needs to grade an assignment is declared there; the runner itself
 * contains no assignment-specific knowledge.
 */

/** Strategy identifiers, one per entry in `src/strategies/`. */
export type StrategyId =
  /** Compare a file the student authored against known-good content. */
  | "file_compare"
  /** Build student source, optionally linking a grader driver, run with argv/stdin, diff stdout. */
  | "compile_and_run"
  /** Compile a provided program, run it, check the student's prediction file matches. */
  | "predict_output"
  /** Parse student source for required declarations / constructs. */
  | "source_check"
  /** Student wrote a test program that must expose each broken implementation. */
  | "test_identify"
  /** compile_and_run with a memory-safety engine (ASan on macOS, valgrind on Linux). */
  | "memory_check"
  /** Recognised but not reproducible on this platform; reported honestly. */
  | "unsupported";

export const STRATEGY_IDS: readonly StrategyId[] = [
  "file_compare",
  "compile_and_run",
  "predict_output",
  "source_check",
  "test_identify",
  "memory_check",
  "unsupported",
] as const;

/** One graded case: arguments, stdin, and the output it must produce. */
export interface TestCase {
  /** Command-line arguments passed to the program (excluding argv[0]). */
  args?: string[];
  /** Path (relative to the assignment dir) of a file piped to stdin. */
  stdinFile?: string;
  /** Literal stdin content; ignored when `stdinFile` is set. */
  stdin?: string;
  /**
   * Expected stdout, as a path relative to the `configs/` directory.
   * Preferred over `expected` so the blob does not bloat the config itself.
   */
  expectedFile?: string;
  /** Expected stdout, inline. Only for very short outputs. */
  expected?: string;
  /** Expected process exit status. Defaults to 0. */
  expectedExit?: number;
  /** Human-readable case name used in `grade.txt`; defaults to the args joined by space. */
  label?: string;
  /** Extra environment variables for this case. */
  env?: Record<string, string>;
  /** When true, a non-zero exit is itself the success condition. */
  expectFailure?: boolean;
  /** Score weight. Defaults to 1. Used only for reporting. */
  weight?: number;
  /**
   * Success line for this case, printed before the verdict. The original
   * varied the wording per assignment: 28_fix_vg_encr prints
   * `your output was correct` (lowercase) while 29/30/31/32/33 print
   * `Your output is correct`.
   */
  message?: string;
  /** Failure line for this case, when the original used custom wording. */
  failureMessage?: string;
  /**
   * Extra line printed immediately after the `testcaseN:` label line.
   * `27_matrix_input` prints ` (should indicate an error)` there.
   */
  hint?: string;
}

/** How to turn student sources into an executable. */
export interface BuildSpec {
  /** Compiler driver. Defaults to `cc`. */
  compiler?: string;
  /**
   * Source files compiled and linked together, relative to the assignment dir.
   * `"$DRIVER"` is replaced by the assignment's `driver` path.
   * Defaults to `[source]`.
   */
  sources?: string[];
  /** Reconstructed grader driver (C source), relative to the project root. */
  driver?: string;
  /** Additional objects/archives to link, relative to the assignment dir. */
  linkObjects?: string[];
  /** Output executable name. Defaults to the assignment id. */
  output?: string;
  /** Flags for the compile+link invocation. */
  flags?: string[];
  /**
   * Compile each source to its own object first, then link. Used by the
   * Makefile-style projects so the reported command list matches the original.
   */
  separateCompile?: boolean;
  /** Run `make` with these arguments instead of invoking the compiler directly. */
  make?: { args?: string[]; cleanFirst?: boolean };
  /** Directory to build in, relative to the assignment dir. Defaults to a temp dir. */
  buildDir?: string;
  /**
   * Materialise flattened git symlinks before building. Several capstone
   * directories store symlinks as plain text files containing a relative path.
   */
  resolveSymlinks?: boolean;
}

/** A declaration the source checker must find. */
export interface RequiredPattern {
  /** Message printed before the result, e.g. `Checking for int max (int num1, int num2)`. */
  label: string;
  /** Regular expression source, compiled case-insensitively with the `m` flag. */
  pattern: string;
  /** When true, absence fails the assignment. Defaults to true. */
  required?: boolean;
}

/** One implementation the student's test program must be able to catch. */
export interface IdentifySubject {
  /** Name printed in `grade.txt`, e.g. `broken1` or `correct`. */
  name: string;
  /** Source file, relative to the assignment dir. */
  source: string;
  /**
   * True when the program is known-broken, so the student's tests must fail
   * on it. False for the reference-correct build, where the tests must pass.
   */
  broken: boolean;
  /** Extra sources that must also be linked. */
  extraSources?: string[];
  flags?: string[];
}

export interface AssignmentConfig {
  /** Assignment id; must equal the directory name. */
  id: string;
  /** One-line description shown in listings. */
  title?: string;
  type: StrategyId;
  /** Id of the assignment unlocked when this one passes; null ends the course. */
  next?: string | null;
  /** Per-process wall-clock limit. Defaults to 5000 ms. */
  timeoutMs?: number;
  /** Per-assignment wall-clock limit covering the whole run. Defaults to 120000 ms. */
  totalTimeoutMs?: number;

  // ---- file_compare -------------------------------------------------------
  /** File the student must create, relative to the assignment dir. */
  file?: string;
  /** Expected content of `file` as a path relative to `configs/`. */
  expectedFile?: string;
  /** Expected content of `file`, inline. */
  expected?: string;
  /** Message on success. Defaults to the original tool's wording. */
  successMessage?: string;

  // ---- build --------------------------------------------------------------
  /** Primary student source file, relative to the assignment dir. */
  source?: string;
  build?: BuildSpec;

  // ---- predict_output -----------------------------------------------------
  /** The provided program the student must predict the output of. */
  program?: string;

  // ---- source_check -------------------------------------------------------
  /** Declaration patterns that must be present. */
  requiredPatterns?: RequiredPattern[];
  /** Patterns whose *absence* is what is checked (e.g. `Checking for no iteration`). */
  forbiddenPatterns?: RequiredPattern[];
  /** Also require a `main` function. */
  requireMain?: boolean;
  /**
   * Lines prepended to the source before pattern matching, shifting every
   * reported line number.
   *
   * `02_code1` and `03_code2` were graded by physically prepending
   * `#include <stdio.h>` and `#include <stdlib.h>` (exactly what their
   * `test.sh` does), which is why the 2024 report says `Found on line 3` where
   * the student's file has the declaration on line 1. Reproducing the shift is
   * the difference between an accurate report and an invented one.
   */
  prependLines?: string[];

  // ---- test_identify ------------------------------------------------------
  /** The student's test harness, relative to the assignment dir. */
  studentTest?: string;
  subjects?: IdentifySubject[];

  // ---- cases --------------------------------------------------------------
  tests?: TestCase[];

  /**
   * Also build the student's source *standalone* (without the grader driver),
   * run it, and compare its output — before the driver-linked run.
   *
   * This reproduces the original's two-stage report:
   *   Your file matched the expected output
   *   Removing your main() and replacing it with our own to run more tests...
   *
   * Silently skipped when the source has no `main` and therefore cannot link
   * on its own, which is the case for assignments like 05_squares.
   */
  selfTest?: {
    expectedFile?: string;
    expected?: string;
    /** Verbatim line on success. Defaults to the original's wording. */
    successMessage?: string;
    /** Verbatim line printed before the driver-linked run. */
    replaceMessage?: string;
  };

  /** Echo each case's captured stdout into the report before its verdict. */
  echoStdout?: boolean;

  /**
   * Template for a case's label line in the `testcase` dialect.
   * Placeholders: `{n}` (1-based index) and `{label}` (the case's label).
   * Defaults to `testcase{n}:`.
   *
   * `08_testing` needs `test input.{n}:`, which is why this is configurable
   * rather than hardcoded.
   */
  caseLabelTemplate?: string;
  /** Template for a case's success line. Placeholder `{n}`. Defaults to `testcase{n} passed`. */
  casePassTemplate?: string;

  // ---- reporting ----------------------------------------------------------
  /** Verbatim line printed before the first case, e.g. `Trying to compile your code and link with squares_test.o`. */
  header?: string;
  /** Verbatim line printed when every case passes, e.g. `You got all cases right`. */
  passMessage?: string;
  /** Verbatim line printed while compiling. */
  compileMessage?: string;
  /**
   * Which of the two report dialects the original grader used for this
   * assignment:
   *   - `squares`: `Testing ./squares 1 0 0 1` / `PASSED` / ` - Correct`
   *   - `testcase`: `###...` separator / `testcase1:` / `testcase1 passed`
   */
  reportStyle?:
    | "squares"
    | "testcase"
    | "inline"
    | "identify-star"
    /** `Running testcase 1` / `Your file matched the expected output` / `testcase1 passed` */
    | "running"
    /** Message-only: just the verdict sentence, no `Testing …` line. */
    | "message";
  /**
   * The verdict word the original grader printed on success.
   *
   * This is not derivable from the strategy: reading the 42 historical
   * `grade.txt` files shows `05_squares` and `11_read_ptr1` ending in `PASSED`
   * while `17_read_arr2` and `21_read_rec1` — the same strategy family — end in
   * `A`. So it is recorded per assignment from the observed artifact rather
   * than guessed from the type. Defaults to `PASSED`.
   */
  successVerdict?: "PASSED" | "A";
  /**
   * Echo each compiler invocation into `grade.txt`. The original tool did this
   * for the Makefile-driven assignments (11_read_ptr1, 34_put_together) but not
   * for the simple link-with-a-driver ones.
   */
  showCompileCommands?: boolean;
  /** Free-form notes surfaced by `grade --explain`. */
  notes?: string;
}

/** Result of one graded case. */
export interface CaseResult {
  label: string;
  passed: boolean;
  /** Lines to append to `grade.txt` for this case. */
  lines: string[];
  /** Populated when the case failed, for the summary. */
  reason?: string;
}

export interface GradeResult {
  id: string;
  passed: boolean;
  /** `PASSED` / `A` / `FAILED`, mirroring the original tool's vocabulary. */
  verdict: string;
  lines: string[];
  cases: CaseResult[];
  startedAt: Date;
  durationMs: number;
}

/** Minimal logger so strategies never touch stdout directly. */
export interface Reporter {
  (line: string): void;
}
