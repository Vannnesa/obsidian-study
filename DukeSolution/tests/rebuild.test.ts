/**
 * `grade rebuild <id>` — resetting an assignment to its starting state.
 *
 * The command overwrites student work, so most of what matters here is what it
 * refuses to do without being told, and what it leaves alone.
 */

import { describe, expect, test } from "bun:test";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { makeSandbox, runCli, writeConfig } from "./harness.ts";
import { resolveId, planRebuild, lossyFiles } from "../src/rebuild.ts";

const IDS = ["00_hello", "01_apple", "05_squares", "34_put_together", "c2prj1_cards"];

describe("resolveId", () => {
  test("accepts the full id", () => {
    expect(resolveId("01_apple", IDS)).toBe("01_apple");
  });

  test("pads a bare number", () => {
    expect(resolveId("1", IDS)).toBe("01_apple");
    expect(resolveId("01", IDS)).toBe("01_apple");
    expect(resolveId("5", IDS)).toBe("05_squares");
    expect(resolveId("34", IDS)).toBe("34_put_together");
  });

  test("accepts a unique prefix for the named projects", () => {
    expect(resolveId("c2prj1", IDS)).toBe("c2prj1_cards");
  });

  test("reports an unknown id with the list", () => {
    expect(() => resolveId("99", IDS)).toThrow(/no assignment matches/);
    expect(() => resolveId("99", IDS)).toThrow(/00_hello/);
  });

  test("reports an ambiguous prefix", () => {
    expect(() => resolveId("c2", ["c2prj1_cards", "c2prj2_testing"])).toThrow(/ambiguous/);
  });

  test("rejects an empty request", () => {
    expect(() => resolveId("  ", IDS)).toThrow(/no assignment given/);
  });
});

/** A sandbox with one assignment whose template has two files. */
async function fixture() {
  const sb = await makeSandbox();
  await writeConfig(sb.root, "01_a", {
    id: "01_a",
    type: "file_compare",
    file: "a.txt",
    expected: "a\n",
  });
  const tpl = path.join(sb.root, "data", "templates", "01_a");
  await mkdir(tpl, { recursive: true });
  await writeFile(path.join(tpl, "README"), "assignment\n");
  await writeFile(path.join(tpl, "a.txt"), "");
  return sb;
}

describe("planRebuild", () => {
  test("plans creation when the folder is absent", async () => {
    const sb = await fixture();
    try {
      const plan = await planRebuild(sb.root, "01_a", sb.ws, sb.ws);
      expect(plan.exists).toBe(false);
      expect(plan.inPlace).toBe(false);
      expect(lossyFiles(plan)).toEqual([]);
      expect(plan.files.every((f) => f.state === "new")).toBe(true);
    } finally {
      await sb.cleanup();
    }
  });

  test("detects an untouched folder as lossless", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const plan = await planRebuild(sb.root, "01_a", sb.ws, sb.ws);
      expect(lossyFiles(plan)).toEqual([]);
      expect(plan.files.every((f) => f.state === "same")).toBe(true);
    } finally {
      await sb.cleanup();
    }
  });

  test("flags a file the student changed", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      await writeFile(path.join(sb.ws, "01_a", "a.txt"), "my answer\n");
      const plan = await planRebuild(sb.root, "01_a", sb.ws, sb.ws);
      expect(lossyFiles(plan).map((f) => f.rel)).toEqual(["a.txt"]);
    } finally {
      await sb.cleanup();
    }
  });

  test("recognises when it was run from inside the folder", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const inside = path.join(sb.ws, "01_a");
      const plan = await planRebuild(sb.root, "01_a", inside, sb.ws);
      expect(plan.inPlace).toBe(true);
      expect(plan.target).toBe(inside);
    } finally {
      await sb.cleanup();
    }
  });
});

describe("rebuild command", () => {
  test("creates the folder from the workspace root", async () => {
    const sb = await fixture();
    try {
      const r = await runCli(sb.root, ["rebuild", "01"], sb.ws);
      expect(r.exitCode).toBe(0);
      expect(existsSync(path.join(sb.ws, "01_a", "README"))).toBe(true);
      expect(r.stdout).toContain("Created");
    } finally {
      await sb.cleanup();
    }
  });

  test("refreshes in place when run from inside the folder", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const inside = path.join(sb.ws, "01_a");
      await writeFile(path.join(inside, "a.txt"), "student work\n");
      const r = await runCli(sb.root, ["rebuild", "01", "--yes"], inside);
      expect(r.exitCode).toBe(0);
      expect(await readFile(path.join(inside, "a.txt"), "utf8")).toBe("");
      expect(r.stdout).toContain("this folder");
    } finally {
      await sb.cleanup();
    }
  });

  test("asks before overwriting, and cancels on anything but y", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const file = path.join(sb.ws, "01_a", "a.txt");
      await writeFile(file, "student work\n");
      const r = await runCli(sb.root, ["rebuild", "01"], sb.ws, "n\n");
      expect(r.exitCode).toBe(1);
      expect(r.stdout).toContain("would be overwritten");
      expect(await readFile(file, "utf8")).toBe("student work\n");
    } finally {
      await sb.cleanup();
    }
  });

  test("proceeds when the answer is y", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const file = path.join(sb.ws, "01_a", "a.txt");
      await writeFile(file, "student work\n");
      const r = await runCli(sb.root, ["rebuild", "01"], sb.ws, "y\n");
      expect(r.exitCode).toBe(0);
      expect(await readFile(file, "utf8")).toBe("");
    } finally {
      await sb.cleanup();
    }
  });

  test("an empty answer cancels", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const file = path.join(sb.ws, "01_a", "a.txt");
      await writeFile(file, "student work\n");
      const r = await runCli(sb.root, ["rebuild", "01"], sb.ws, "\n");
      expect(r.exitCode).toBe(1);
      expect(await readFile(file, "utf8")).toBe("student work\n");
    } finally {
      await sb.cleanup();
    }
  });

  test("closed stdin cancels rather than hangs", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      await writeFile(path.join(sb.ws, "01_a", "a.txt"), "student work\n");
      const r = await runCli(sb.root, ["rebuild", "01"], sb.ws, "");
      expect(r.exitCode).toBe(1);
    } finally {
      await sb.cleanup();
    }
  });

  test("leaves files the student added alone", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      await writeFile(path.join(sb.ws, "01_a", "NOTES.md"), "mine\n");
      await writeFile(path.join(sb.ws, "01_a", "a.txt"), "changed\n");
      const r = await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      expect(r.exitCode).toBe(0);
      expect(await readFile(path.join(sb.ws, "01_a", "NOTES.md"), "utf8")).toBe("mine\n");
      expect(r.stdout).toContain("NOTES.md");
    } finally {
      await sb.cleanup();
    }
  });

  test("clears generated artifacts", async () => {
    const sb = await fixture();
    try {
      await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      const dir = path.join(sb.ws, "01_a");
      await writeFile(path.join(dir, "grade.txt"), "Overall Grade: PASSED\n");
      await mkdir(path.join(dir, "answer"), { recursive: true });
      await writeFile(path.join(dir, "answer", "diff.txt"), "x\n");
      const r = await runCli(sb.root, ["rebuild", "01", "--yes"], sb.ws);
      expect(r.exitCode).toBe(0);
      expect(existsSync(path.join(dir, "grade.txt"))).toBe(false);
      expect(existsSync(path.join(dir, "answer"))).toBe(false);
    } finally {
      await sb.cleanup();
    }
  });

  test("errors clearly on an unknown or missing id", async () => {
    const sb = await fixture();
    try {
      const unknown = await runCli(sb.root, ["rebuild", "99"], sb.ws);
      expect(unknown.exitCode).toBe(2);
      expect(unknown.stderr).toContain("no assignment matches");

      const none = await runCli(sb.root, ["rebuild"], sb.ws);
      expect(none.exitCode).toBe(2);
      expect(none.stderr).toContain("rebuild needs an assignment");
    } finally {
      await sb.cleanup();
    }
  });
});
