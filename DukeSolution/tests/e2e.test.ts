/**
 * End-to-end tests.
 *
 * Each builds a throwaway *package* plus a workspace in a temp directory and
 * drives the real CLI, so they cover what unit tests cannot: the package /
 * workspace split, temp-directory build isolation, `answer/` generation, the
 * next-assignment unlock, and the failure path.
 *
 * Run with:  bun test tests/
 */

import { describe, expect, test } from "bun:test";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { grade, makeAssignment, makeSandbox, runCli, writeConfig } from "./harness.ts";

/** A sandbox with a file_compare assignment and a template for the next one. */
async function fileCompareSandbox(expected = "hello\n", next = "01_b") {
  const sb = await makeSandbox();
  await makeAssignment(sb.ws, "00_a");
  await writeConfig(sb.root, "00_a", {
    id: "00_a",
    type: "file_compare",
    file: "hello.txt",
    expected,
    next,
  });
  await mkdir(path.join(sb.root, "data", "templates", next), { recursive: true });
  await writeFile(path.join(sb.root, "data", "templates", next, "README"), "next assignment\n");
  await writeFile(path.join(sb.root, "data", "templates", next, "b.c"), "// TODO\n");
  await mkdir(path.join(sb.root, "data", "reference", "00_a"), { recursive: true });
  return sb;
}

describe("file_compare", () => {
  test("passes, writes grade.txt, builds answer/ and unlocks the next assignment", async () => {
    const sb = await fileCompareSandbox();
    try {
      await writeFile(path.join(sb.ws, "00_a", "hello.txt"), "hello\n");
      // The packaged reference differs, so diff.txt must be non-trivial.
      await writeFile(path.join(sb.root, "data", "reference", "00_a", "hello.txt"), "hello there\n");

      const dir = path.join(sb.ws, "00_a");
      // The full pass, with answer/ generation and the unlock enabled.
      const r = await runCli(sb.root, ["--dir", dir, "--id", "00_a"], dir);
      expect(r.exitCode).toBe(0);

      const written = await readFile(path.join(dir, "grade.txt"), "utf8");
      expect(written).toContain("Your file matched the expected output");
      expect(written).toContain("Overall Grade: PASSED");

      expect(existsSync(path.join(dir, "answer", "user_code", "hello.txt"))).toBe(true);
      expect(existsSync(path.join(dir, "answer", "reference", "hello.txt"))).toBe(true);
      const diff = await readFile(path.join(dir, "answer", "diff.txt"), "utf8");
      expect(diff).toContain("hello there");
      expect(diff).toContain("+hello");

      expect(r.stdout).toContain("01_b");
      expect(existsSync(path.join(sb.ws, "01_b", "README"))).toBe(true);
      expect(existsSync(path.join(sb.ws, "01_b", "b.c"))).toBe(true);
    } finally {
      await sb.cleanup();
    }
  });

  test("a wrong file fails, explains itself, and does not scaffold", async () => {
    const sb = await fileCompareSandbox();
    try {
      await writeFile(path.join(sb.ws, "00_a", "hello.txt"), "goodbye\n");
      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Overall Grade: FAILED");
      expect(r.text).toContain("Expected:");
      expect(r.text).toContain("Got:");
      expect(existsSync(path.join(sb.ws, "01_b"))).toBe(false);
      expect(existsSync(path.join(sb.ws, "00_a", "answer"))).toBe(false);
    } finally {
      await sb.cleanup();
    }
  });

  test("a missing file is reported by name", async () => {
    const sb = await fileCompareSandbox();
    try {
      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Your file hello.txt was not found");
    } finally {
      await sb.cleanup();
    }
  });

  test("a missing final newline is called out specifically", async () => {
    const sb = await fileCompareSandbox();
    try {
      await writeFile(path.join(sb.ws, "00_a", "hello.txt"), "hello");
      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.text).toContain("missing its final newline");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("compile_and_run", () => {
  test("builds in a temp dir and leaves no artefacts behind", async () => {
    const sb = await makeSandbox();
    try {
      const dir = await makeAssignment(sb.ws, "00_a");
      await writeFile(
        path.join(dir, "echo.c"),
        '#include <stdio.h>\nint main(int c, char **v){ if(c>1) printf("%s\\n", v[1]); return 0; }\n',
      );
      await mkdir(path.join(sb.root, "data", "configs", "expected", "00_a"), { recursive: true });
      await writeFile(path.join(sb.root, "data", "configs", "expected", "00_a", "hi.txt"), "hi\n");
      await writeConfig(sb.root, "00_a", {
        id: "00_a",
        type: "compile_and_run",
        source: "echo.c",
        build: { output: "echo", flags: ["-Wall", "-std=gnu99"] },
        tests: [{ args: ["hi"], expectedFile: "expected/00_a/hi.txt" }],
      });

      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.exitCode).toBe(0);
      expect(r.text).toContain("Testing ./echo hi");
      expect(r.text).toContain("PASSED");
      expect(existsSync(path.join(dir, "echo"))).toBe(false);
      const leftovers = (await Array.fromAsync(new Bun.Glob("*.o").scan(dir)));
      expect(leftovers).toEqual([]);
    } finally {
      await sb.cleanup();
    }
  });

  test("a compile error is reported instead of a crash", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "00_a");
      await writeFile(path.join(sb.ws, "00_a", "broken.c"), "int main(void) { this is not C }\n");
      await writeConfig(sb.root, "00_a", {
        id: "00_a",
        type: "compile_and_run",
        source: "broken.c",
        tests: [{ args: [], expected: "x\n" }],
      });
      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.exitCode).toBe(1);
      expect(r.text).toContain("Your code did not compile");
    } finally {
      await sb.cleanup();
    }
  });

  test("an infinite loop is killed by the timeout", async () => {
    const sb = await makeSandbox();
    try {
      await makeAssignment(sb.ws, "00_a");
      await writeFile(path.join(sb.ws, "00_a", "spin.c"), "int main(void){ for(;;){} return 0; }\n");
      await writeConfig(sb.root, "00_a", {
        id: "00_a",
        type: "compile_and_run",
        source: "spin.c",
        timeoutMs: 700,
        tests: [{ args: [], expected: "" }],
      });
      const started = Date.now();
      const r = await grade(sb.root, sb.ws, "00_a");
      expect(r.exitCode).toBe(1);
      expect(Date.now() - started).toBeLessThan(20_000);
      expect(r.text).toContain("Timed out");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("workspace lifecycle", () => {
  test("init creates a workspace outside the package and hands out the first assignment", async () => {
    const sb = await makeSandbox();
    try {
      // Two assignments so the chain is observable.
      for (const id of ["00_a", "01_b"]) {
        await writeConfig(sb.root, id, { id, type: "file_compare", file: "x", expected: "y", next: null });
        await mkdir(path.join(sb.root, "data", "templates", id), { recursive: true });
        await writeFile(path.join(sb.root, "data", "templates", id, "README"), `${id}\n`);
      }
      const ws = path.join(sb.ws, "fresh");
      const r = await runCli(sb.root, ["init", ws], sb.root);
      expect(r.exitCode).toBe(0);
      expect(existsSync(path.join(ws, "00_a", "README"))).toBe(true);
      expect(existsSync(path.join(ws, "package.json"))).toBe(true);
      expect(existsSync(path.join(ws, "grade"))).toBe(true);
      expect(existsSync(path.join(ws, ".grade", "state.json"))).toBe(true);
    } finally {
      await sb.cleanup();
    }
  });

  test("init refuses to create a workspace inside the package", async () => {
    const sb = await makeSandbox();
    try {
      await writeConfig(sb.root, "00_a", { id: "00_a", type: "file_compare", file: "x", expected: "y" });
      await mkdir(path.join(sb.root, "data", "templates", "00_a"), { recursive: true });
      const r = await runCli(sb.root, ["init", path.join(sb.root, "nested")], sb.root);
      expect(r.exitCode).toBe(2);
      expect(r.stderr).toContain("refusing to create a workspace inside the package");
    } finally {
      await sb.cleanup();
    }
  });

  test("status reports progress", async () => {
    const sb = await makeSandbox();
    try {
      await writeConfig(sb.root, "00_a", { id: "00_a", type: "file_compare", file: "x", expected: "y" });
      await mkdir(path.join(sb.root, "data", "templates", "00_a"), { recursive: true });
      await writeFile(path.join(sb.root, "data", "templates", "00_a", "README"), "a\n");
      await runCli(sb.root, ["init", sb.ws], sb.root);
      const r = await runCli(sb.root, ["status", "--workspace", sb.ws], sb.ws);
      expect(r.exitCode).toBe(0);
      expect(r.stdout).toContain("00_a");
      expect(r.stdout).toContain("0/1 complete");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("CLI", () => {
  test("list and check work", async () => {
    const sb = await makeSandbox();
    try {
      await writeConfig(sb.root, "00_a", { id: "00_a", type: "file_compare", file: "x", expected: "y" });
      const l = await runCli(sb.root, ["list"], sb.root);
      expect(l.exitCode).toBe(0);
      expect(l.stdout).toContain("00_a");
      expect(l.stdout).toContain("file_compare");

      const c = await runCli(sb.root, ["check"], sb.root);
      expect(c.exitCode).toBe(0);

      await writeConfig(sb.root, "bad", { id: "bad" });
      const bad = await runCli(sb.root, ["check"], sb.root);
      expect(bad.exitCode).toBe(2);
      expect(bad.stdout).toContain("INVALID");
    } finally {
      await sb.cleanup();
    }
  });

  test("--version and --help work", async () => {
    const sb = await makeSandbox();
    try {
      const v = await runCli(sb.root, ["--version"], sb.root);
      expect(v.exitCode).toBe(0);
      expect(v.stdout).toMatch(/^grade \d/);
      const h = await runCli(sb.root, ["--help"], sb.root);
      expect(h.exitCode).toBe(0);
      expect(h.stdout).toContain("usage:");
    } finally {
      await sb.cleanup();
    }
  });

  test("grading an unknown assignment fails clearly", async () => {
    const sb = await makeSandbox();
    try {
      const r = await runCli(sb.root, ["--dir", sb.ws, "--id", "nope"], sb.ws);
      expect(r.exitCode).toBe(2);
      expect(r.stderr).toContain("unknown assignment");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("install and doctor", () => {
  test("install writes a launcher into an explicit directory", async () => {
    const sb = await makeSandbox();
    try {
      const bin = path.join(sb.root, "bin");
      const r = await runCli(sb.root, ["install", "--dir", bin], sb.root);
      expect(r.exitCode).toBe(0);
      const shim = Bun.file(path.join(bin, "grade"));
      expect(await shim.exists()).toBe(true);
      const body = await shim.text();
      expect(body).toContain("Generated by `grade install`");
      expect(body).toContain("src/index.ts");
      // The launcher must be executable.
      const { stat } = await import("node:fs/promises");
      expect((await stat(path.join(bin, "grade"))).mode & 0o111).toBeGreaterThan(0);
    } finally {
      await sb.cleanup();
    }
  });

  test("install refuses to clobber a foreign file called grade", async () => {
    const sb = await makeSandbox();
    try {
      const bin = path.join(sb.root, "bin");
      await mkdir(bin, { recursive: true });
      await writeFile(path.join(bin, "grade"), "#!/bin/sh\necho something else\n");
      const r = await runCli(sb.root, ["install", "--dir", bin], sb.root);
      expect(r.exitCode).toBe(2);
      expect(r.stderr).toContain("already exists and was not created by grade install");
      expect(await Bun.file(path.join(bin, "grade")).text()).toContain("something else");
    } finally {
      await sb.cleanup();
    }
  });

  test("uninstall removes only launchers it wrote", async () => {
    const sb = await makeSandbox();
    try {
      const bin = path.join(sb.root, "bin");
      await runCli(sb.root, ["install", "--dir", bin], sb.root);
      const r = await runCli(sb.root, ["uninstall", "--dir", bin], sb.root);
      expect(r.exitCode).toBe(0);
      expect(await Bun.file(path.join(bin, "grade")).exists()).toBe(false);
    } finally {
      await sb.cleanup();
    }
  });

  test("doctor reports each prerequisite", async () => {
    const sb = await makeSandbox();
    try {
      await writeFile(path.join(sb.root, ".gitattributes"), "* -text\n");
      const r = await runCli(sb.root, ["doctor"], sb.root);
      expect(r.stdout).toContain("package");
      expect(r.stdout).toContain("bun");
      expect(r.stdout).toContain("C compiler");
      expect(r.stdout).toContain("line endings");
    } finally {
      await sb.cleanup();
    }
  });
});

describe("init defaults", () => {
  test("uses the current directory when it is not $HOME", async () => {
    const sb = await makeSandbox();
    try {
      await writeConfig(sb.root, "00_a", { id: "00_a", type: "file_compare", file: "x", expected: "y" });
      await mkdir(path.join(sb.root, "data", "templates", "00_a"), { recursive: true });
      await writeFile(path.join(sb.root, "data", "templates", "00_a", "README"), "a\n");
      const r = await runCli(sb.root, ["init"], sb.ws);
      expect(r.exitCode).toBe(0);
      expect(existsSync(path.join(sb.ws, "00_a", "README"))).toBe(true);
    } finally {
      await sb.cleanup();
    }
  });

  test("refuses to init over stray assignment folders", async () => {
    const sb = await makeSandbox();
    try {
      await writeConfig(sb.root, "00_a", { id: "00_a", type: "file_compare", file: "x", expected: "y" });
      await mkdir(path.join(sb.root, "data", "templates", "00_a"), { recursive: true });
      await makeAssignment(sb.ws, "00_a");
      const r = await runCli(sb.root, ["init", sb.ws], sb.root);
      expect(r.exitCode).toBe(2);
      expect(r.stderr).toContain("already contains assignment directory");
    } finally {
      await sb.cleanup();
    }
  });
});
