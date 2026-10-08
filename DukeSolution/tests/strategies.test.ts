/**
 * One sandbox test per strategy, so that every config shape a `configs/*.json`
 * can declare is exercised by the framework itself. If a strategy is broken
 * here, no amount of correct reverse engineering in `data/configs/` will help.
 *
 * Run with:  bun test tests/
 */

import { describe, expect, test } from "bun:test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { grade, makeAssignment, makeSandbox, writeConfig } from "./harness.ts";

describe("source_check", () => {
  test("finds a required declaration and reports its line", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "01_s");
      await writeFile(
        path.join(sb.ws, "01_s", "s.c"),
        "// a comment\nint max (int num1, int num2) {\n  return num1 > num2 ? num1 : num2;\n}\nint main(void){return 0;}\n",
      );
      await writeConfig(sb.root, "01_s", {
        id: "01_s",
        type: "source_check",
        source: "s.c",
        requireMain: true,
        requiredPatterns: [
          { label: "Checking for int max (int num1, int num2)", pattern: "int\\s+max\\s*\\(\\s*int\\s+num1\\s*,\\s*int\\s+num2\\s*\\)" },
        ],
      });
      const r = await grade(sb.root, sb.ws, "01_s");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Checking for int max (int num1, int num2)");
      expect(r.text).toContain("Found on line 2, column 1");
      expect(r.text).toContain("Overall Grade: PASSED");
    } finally {
      await sb.cleanup();
    }
  });

  test("a declaration that only exists in a comment fails", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "01_s");
      await writeFile(path.join(sb.ws, "01_s", "s.c"), "// int max (int num1, int num2)\nint main(void){return 0;}\n");
      await writeConfig(sb.root, "01_s", {
        id: "01_s",
        type: "source_check",
        source: "s.c",
        requiredPatterns: [{ label: "Checking for int max (int num1, int num2)", pattern: "int\\s+max\\s*\\(" }],
      });
      const r = await grade(sb.root, sb.ws, "01_s");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Did not find");
      expect(r.text).toContain("Overall Grade: FAILED");
    } finally {
      await sb.cleanup();
    }
  });

  test("forbiddenPatterns flag an iterative solution", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "01_s");
      await writeFile(
        path.join(sb.ws, "01_s", "s.c"),
        "unsigned power(unsigned x, unsigned y){ unsigned r=1; for(unsigned i=0;i<y;i++) r*=x; return r; }\nint main(void){return 0;}\n",
      );
      await writeConfig(sb.root, "01_s", {
        id: "01_s",
        type: "source_check",
        source: "s.c",
        forbiddenPatterns: [{ label: "Checking for no iteration (do, while, for)", pattern: "\\b(for|while|do)\\b\\s*\\(" }],
      });
      const r = await grade(sb.root, sb.ws, "01_s");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Found a forbidden construct on line 1");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("test_identify", () => {
  test("a harness that rejects broken code and accepts correct code passes", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_t");
      await mkdir(dir, { recursive: true });
      // broken: always returns 0.  correct: doubles.
      await writeFile(path.join(dir, "broken.c"), "unsigned f(unsigned x){ return 0; }\n");
      await writeFile(path.join(dir, "correct.c"), "unsigned f(unsigned x){ return x * 2; }\n");
      // The harness exits non-zero when f is wrong.
      await writeFile(
        path.join(dir, "harness.c"),
        'unsigned f(unsigned);\n#include <stdio.h>\nint main(void){ return f(3) == 6 ? 0 : 1; }\n',
      );
      await writeConfig(sb.root, "01_t", {
        id: "01_t",
        type: "test_identify",
        studentTest: "harness.c",
        subjects: [
          { name: "broken1", source: "broken.c", broken: true },
          { name: "correct", source: "correct.c", broken: false },
        ],
      });
      const r = await grade(sb.root, sb.ws, "01_t");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Your tests identified the problem with broken1");
      expect(r.text).toContain("Overall Grade: PASSED");
    } finally {
      await sb.cleanup();
    }
  });

  test("a harness that misses a broken variant fails", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_t");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "broken.c"), "unsigned f(unsigned x){ return 0; }\n");
      await writeFile(path.join(dir, "correct.c"), "unsigned f(unsigned x){ return x * 2; }\n");
      // A harness that always succeeds cannot detect anything.
      await writeFile(path.join(dir, "harness.c"), "int main(void){ return 0; }\n");
      await writeConfig(sb.root, "01_t", {
        id: "01_t",
        type: "test_identify",
        studentTest: "harness.c",
        subjects: [{ name: "broken1", source: "broken.c", broken: true }],
      });
      const r = await grade(sb.root, sb.ws, "01_t");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("did not identify");
    } finally {
      await sb.cleanup();
    }
  });

  test("a harness with a false positive on the correct code fails", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_t");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, "broken.c"), "unsigned f(unsigned x){ return 0; }\n");
      await writeFile(path.join(dir, "correct.c"), "unsigned f(unsigned x){ return x * 2; }\n");
      await writeFile(path.join(dir, "harness.c"), "int main(void){ return 1; }\n");
      await writeConfig(sb.root, "01_t", {
        id: "01_t",
        type: "test_identify",
        studentTest: "harness.c",
        subjects: [
          { name: "broken1", source: "broken.c", broken: true },
          { name: "correct", source: "correct.c", broken: false },
        ],
      });
      const r = await grade(sb.root, sb.ws, "01_t");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("rejected the correct implementation");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("predict_output", () => {
  test("a correct prediction passes both checks", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_p");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "test.c"),
        '#include <stdio.h>\nint main(void){ printf("42\\n"); return 0; }\n',
      );
      await writeFile(path.join(dir, "answer.txt"), "42\n");
      await writeConfig(sb.root, "01_p", {
        id: "01_p",
        type: "predict_output",
        program: "test.c",
        file: "answer.txt",
        expected: "42\n",
      });
      const r = await grade(sb.root, sb.ws, "01_p");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Your file matched the expected output");
      expect(r.text).toContain("Your output matched what we expected");
      expect(r.text).toContain("Overall Grade: PASSED");
    } finally {
      await sb.cleanup();
    }
  });

  test("a wrong prediction fails and shows both sides", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_p");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "test.c"),
        '#include <stdio.h>\nint main(void){ printf("42\\n"); return 0; }\n',
      );
      await writeFile(path.join(dir, "answer.txt"), "43\n");
      await writeConfig(sb.root, "01_p", {
        id: "01_p",
        type: "predict_output",
        program: "test.c",
        file: "answer.txt",
        expected: "42\n",
      });
      const r = await grade(sb.root, sb.ws, "01_p");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Your file did not match the expected output");
      expect(r.text).toContain("42");
      expect(r.text).toContain("43");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("memory_check", () => {
  test("a leak is caught even when the output is correct", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_m");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "leak.c"),
        '#include <stdlib.h>\n#include <stdio.h>\nint main(void){ char *p = malloc(16); p[0]=0; printf("ok\\n"); return 0; }\n',
      );
      await writeConfig(sb.root, "01_m", {
        id: "01_m",
        type: "memory_check",
        source: "leak.c",
        build: { flags: ["-std=gnu99"] },
        tests: [{ args: [], expected: "ok\n" }],
      });
      const r = await grade(sb.root, sb.ws, "01_m");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Memory error detected");
      expect(r.text).toContain("Overall Grade: FAILED");
    } finally {
      await sb.cleanup();
    }
  });

  test("clean code passes and reports a clean verdict", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_m");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "clean.c"),
        '#include <stdlib.h>\n#include <stdio.h>\nint main(void){ char *p = malloc(16); p[0]=0; printf("ok\\n"); free(p); return 0; }\n',
      );
      await writeConfig(sb.root, "01_m", {
        id: "01_m",
        type: "memory_check",
        source: "clean.c",
        build: { flags: ["-std=gnu99"] },
        tests: [{ args: [], expected: "ok\n" }],
      });
      const r = await grade(sb.root, sb.ws, "01_m");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Valgrind was clean");
      expect(r.text).toContain("Overall Grade: PASSED");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("unsupported", () => {
  test("never reports a pass, and explains why", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "01_u");
      await writeConfig(sb.root, "01_u", {
        id: "01_u",
        type: "unsupported",
        notes: "requires the teacher's squares_test.o, which is Linux ELF",
      });
      const r = await grade(sb.root, sb.ws, "01_u");
      // Distinct exit status and verdict: neither a pass nor a student failure.
      expect(r.exitCode).toBe(3);
      expect(r.text).toContain("cannot be graded on this platform");
      expect(r.text).toContain("Linux ELF");
      expect(r.text).toContain("Overall Grade: NOT GRADED");
      expect(r.text).not.toContain("PASSED");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("report dialects", () => {
  test("testcase style uses the separator and testcaseN labels", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_r");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "p.c"),
        '#include <stdio.h>\nint main(void){ printf("x\\n"); return 0; }\n',
      );
      await writeConfig(sb.root, "01_r", {
        id: "01_r",
        type: "compile_and_run",
        source: "p.c",
        reportStyle: "testcase",
        tests: [{ args: [], expected: "x\n" }],
      });
      const r = await grade(sb.root, sb.ws, "01_r");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("#################################################");
      expect(r.text).toContain("testcase1:");
      expect(r.text).toContain("testcase1 passed");
    } finally {
      await sb.cleanup();
    }
  });

  test("squares style uses Testing/PASSED/- Correct", async () => {
    const sb = await makeSandbox();
    try {
      const dir = path.join(sb.ws, "01_r");
      await mkdir(dir, { recursive: true });
      await writeFile(
        path.join(dir, "p.c"),
        '#include <stdio.h>\nint main(int c, char**v){ printf("%s\\n", v[1]); return 0; }\n',
      );
      await writeConfig(sb.root, "01_r", {
        id: "01_r",
        type: "compile_and_run",
        source: "p.c",
        build: { output: "p" },
        reportStyle: "squares",
        passMessage: "You got all cases right",
        tests: [{ args: ["7"], expected: "7\n" }],
      });
      const r = await grade(sb.root, sb.ws, "01_r");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Testing ./p 7");
      expect(r.text).toContain("PASSED");
      expect(r.text).toContain(" - Correct");
      expect(r.text).toContain("You got all cases right");
    } finally {
      await sb.cleanup();
    }
  });
});
