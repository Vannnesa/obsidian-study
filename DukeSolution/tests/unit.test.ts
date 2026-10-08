/**
 * Self-tests for the parts of `grade` that are pure logic: the line diff, the
 * timestamp format, config validation, and the flattened-symlink detector.
 *
 * Run with:  bun test tests/
 */

import { describe, expect, test } from "bun:test";
import { diffLines, splitLines, unifiedDiff } from "../src/diff.ts";
import { formatTimestamp, renderGradeTxt } from "../src/output.ts";
import { compareAssignmentIds, validateConfig } from "../src/config.ts";
import { readFlattenedLink, normalizeFlags } from "../src/build.ts";
import { buffersEqual, firstDifference } from "../src/runner.ts";
import { stripComments } from "../src/strategies/source-check.ts";
import { isSourceFile } from "../src/answer.ts";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

describe("diff", () => {
  test("identical input produces only same-ops", () => {
    const ops = diffLines(["a", "b"], ["a", "b"]);
    expect(ops).not.toBeNull();
    expect(ops!.every((o) => o.kind === "same")).toBe(true);
  });

  test("detects a single substitution", () => {
    const ops = diffLines(["a", "b", "c"], ["a", "x", "c"])!;
    expect(ops.filter((o) => o.kind === "del").map((o) => o.line)).toEqual(["b"]);
    expect(ops.filter((o) => o.kind === "add").map((o) => o.line)).toEqual(["x"]);
  });

  test("detects insertions and deletions", () => {
    const added = diffLines(["a", "c"], ["a", "b", "c"])!;
    expect(added.filter((o) => o.kind === "add").map((o) => o.line)).toEqual(["b"]);

    const removed = diffLines(["a", "b", "c"], ["a", "c"])!;
    expect(removed.filter((o) => o.kind === "del").map((o) => o.line)).toEqual(["b"]);
  });

  test("splitLines does not invent a trailing empty line", () => {
    expect(splitLines("a\nb\n")).toEqual(["a", "b"]);
    expect(splitLines("a\nb")).toEqual(["a", "b"]);
    expect(splitLines("")).toEqual([]);
  });

  test("unifiedDiff says so when files are identical", () => {
    const out = unifiedDiff("x\n", "x\n", { fromLabel: "a", toLabel: "b" });
    expect(out).toContain("(files are identical)");
  });

  test("unifiedDiff emits a hunk header", () => {
    const out = unifiedDiff("a\nb\nc\n", "a\nB\nc\n", { fromLabel: "r", toLabel: "u" });
    expect(out).toContain("--- r");
    expect(out).toContain("+++ u");
    expect(out).toMatch(/@@ -\d+,\d+ \+\d+,\d+ @@/);
    expect(out).toContain("-b");
    expect(out).toContain("+B");
  });

  test("handles a large but similar input without blowing up", () => {
    const a = Array.from({ length: 5000 }, (_, i) => `line ${i}`);
    const b = [...a];
    b[2500] = "changed";
    const ops = diffLines(a, b);
    expect(ops).not.toBeNull();
    expect(ops!.filter((o) => o.kind !== "same")).toHaveLength(2);
  });
});

describe("output", () => {
  test("timestamp matches the original grader's format", () => {
    // Mon 19 Feb 2024 05:45:13 PM UTC, the timestamp in 00_hello/grade.txt.
    const d = new Date(Date.UTC(2024, 1, 19, 17, 45, 13));
    expect(formatTimestamp(d)).toBe("Mon 19 Feb 2024 05:45:13 PM UTC");
  });

  test("midnight and noon render as 12 AM / 12 PM", () => {
    expect(formatTimestamp(new Date(Date.UTC(2024, 0, 1, 0, 0, 0)))).toBe(
      "Mon 01 Jan 2024 12:00:00 AM UTC",
    );
    expect(formatTimestamp(new Date(Date.UTC(2024, 0, 1, 12, 0, 0)))).toBe(
      "Mon 01 Jan 2024 12:00:00 PM UTC",
    );
  });

  test("single-digit days are zero padded", () => {
    expect(formatTimestamp(new Date(Date.UTC(2024, 2, 5, 9, 8, 7)))).toContain("05 Mar 2024");
  });

  test("grade.txt has the original's shape", () => {
    const text = renderGradeTxt({
      id: "00_hello",
      passed: true,
      verdict: "PASSED",
      lines: ["Your file matched the expected output"],
      cases: [],
      startedAt: new Date(Date.UTC(2024, 1, 19, 17, 45, 13)),
      durationMs: 0,
    });
    expect(text).toBe(
      "Grading at Mon 19 Feb 2024 05:45:13 PM UTC\n" +
        "Your file matched the expected output\n" +
        "\n" +
        "Overall Grade: PASSED\n",
    );
  });
});

describe("config validation", () => {
  test("rejects an unknown type", () => {
    const problems = validateConfig({ id: "x", type: "nonsense" as never });
    expect(problems.join(" ")).toContain("`type` must be one of");
  });

  test("rejects an id that does not match its filename", () => {
    const problems = validateConfig({ id: "a", type: "file_compare" }, "b");
    expect(problems.join(" ")).toContain('`id` is "a" but the file is named "b.json"');
  });

  test("file_compare needs a file and an expectation", () => {
    const problems = validateConfig({ id: "x", type: "file_compare" });
    expect(problems.join(" ")).toContain("requires `file`");
    expect(problems.join(" ")).toContain("requires `expectedFile` or `expected`");
  });

  test("compile_and_run needs at least one case", () => {
    const problems = validateConfig({ id: "x", type: "compile_and_run", source: "x.c", tests: [] });
    expect(problems.join(" ")).toContain("non-empty `tests` array");
  });

  test("unsupported must explain itself", () => {
    const problems = validateConfig({ id: "x", type: "unsupported" });
    expect(problems.join(" ")).toContain("requires a `notes` field");
    expect(validateConfig({ id: "x", type: "unsupported", notes: "no valgrind" })).toEqual([]);
  });

  test("a valid config passes cleanly", () => {
    expect(
      validateConfig({
        id: "00_hello",
        type: "file_compare",
        file: "hello.txt",
        expected: "hello\n",
      }),
    ).toEqual([]);
  });
});

describe("assignment ordering", () => {
  test("numeric order, not lexicographic", () => {
    const ids = ["10_gdb", "02_code1", "00_hello", "05_squares"];
    expect([...ids].sort(compareAssignmentIds)).toEqual([
      "00_hello",
      "02_code1",
      "05_squares",
      "10_gdb",
    ]);
  });

  test("numbered assignments come before capstone projects", () => {
    const ids = ["c2prj1_cards", "34_put_together", "c4prj3_finish"];
    expect([...ids].sort(compareAssignmentIds)).toEqual([
      "34_put_together",
      "c2prj1_cards",
      "c4prj3_finish",
    ]);
  });
});

describe("runner", () => {
  test("buffersEqual is byte-exact", () => {
    expect(buffersEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 3]))).toBe(true);
    expect(buffersEqual(new Uint8Array([1, 2, 3]), new Uint8Array([1, 2, 4]))).toBe(false);
    expect(buffersEqual(new Uint8Array([1, 2]), new Uint8Array([1, 2, 0]))).toBe(false);
  });

  test("firstDifference reports the first differing line", () => {
    const enc = new TextEncoder();
    const d = firstDifference(enc.encode("a\nB\nc\n"), enc.encode("a\nb\nc\n"));
    expect(d).toEqual({ line: 2, actualLine: "B", expectedLine: "b" });
    expect(firstDifference(enc.encode("same\n"), enc.encode("same\n"))).toBeNull();
  });
});

describe("source_check comment stripping", () => {
  test("a declaration in a comment does not satisfy the check", () => {
    const stripped = stripComments("// int max (int a, int b)\nint x;");
    expect(/int\s+max/.test(stripped)).toBe(false);
    expect(/int x;/.test(stripped)).toBe(true);
  });

  test("a declaration in a string literal does not satisfy the check", () => {
    const stripped = stripComments('char * s = "int max (int a, int b)";');
    expect(/int\s+max/.test(stripped)).toBe(false);
  });

  test("line numbers survive stripping", () => {
    const text = "/* one\ntwo\nthree */\nint main(void) {}";
    const idx = stripComments(text).indexOf("int main");
    expect(text.slice(0, idx).split("\n")).toHaveLength(4);
  });

  test("real declarations are still found", () => {
    expect(/\bint\s+main\s*\(/.test(stripComments("int main(void) { return 0; }"))).toBe(true);
  });
});

describe("build helpers", () => {
  test("normalizeFlags rewrites --pedantic for clang", () => {
    const out = normalizeFlags(["--pedantic", "-Wall"], "cc");
    expect(out).toContain("-pedantic");
    expect(out).not.toContain("--pedantic");
  });

  test("normalizeFlags leaves gcc flags alone", () => {
    expect(normalizeFlags(["--pedantic"], "/usr/bin/gcc")).toEqual(["--pedantic"]);
  });

  test("detects a flattened git symlink", async () => {
    const dir = await mkdtemp(path.join(tmpdir(), "grade-test-"));
    try {
      const link = path.join(dir, "cards.c");
      await writeFile(link, "../c2prj1_cards/cards.c\n");
      expect(await readFlattenedLink(link)).toBe("../c2prj1_cards/cards.c");

      const real = path.join(dir, "real.c");
      await writeFile(real, "#include <stdio.h>\nint main(void){return 0;}\n");
      expect(await readFlattenedLink(real)).toBeNull();
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("answer snapshot filter", () => {
  test("never copies build products or grader output", () => {
    for (const name of ["a.o", "squares", "grade.txt", "vgcore.55", ".DS_Store"]) {
      expect(isSourceFile(name)).toBe(false);
    }
  });

  test("copies sources and the teacher's README", () => {
    for (const name of ["squares.c", "cards.h", "README", "Makefile", "answer.txt"]) {
      expect(isSourceFile(name)).toBe(true);
    }
  });
});
