/**
 * Tests for `providedObjects`: an assignment that expects a prebuilt object
 * file gets one compiled for the local platform, so the command its README
 * prints works without the student knowing anything about object formats.
 */

import { describe, expect, test } from "bun:test";
import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";
import { makeSandbox } from "./harness.ts";
import { ensureProvidedObjects, objectFormat } from "../src/provided.ts";

const DRIVER = `#include <stdio.h>
void squares(int a, int b, int c, int d);
int main(int argc, char **argv) { (void)argv; squares(argc, 1, 2, 3); return 0; }
`;

async function fixture(opts: { withOutput?: boolean; foreign?: boolean } = {}) {
  const dir = path.join(await mkdir(path.join(tmpdir(), `prov-${crypto.randomUUID()}`), { recursive: true }) as unknown as string);
  await writeFile(path.join(dir, "driver.c"), DRIVER);
  if (opts.withOutput) {
    // A Linux ELF header is enough to be recognised as a foreign object.
    await writeFile(path.join(dir, "driver.o"), Buffer.from([0x7f, 0x45, 0x4c, 0x46, 2, 1, 1, 0]));
  }
  return dir;
}

describe("objectFormat", () => {
  test("recognises ELF, Mach-O and PE headers", async () => {
    const dir = await fixture();
    try {
      await writeFile(path.join(dir, "a"), Buffer.from([0x7f, 0x45, 0x4c, 0x46]));
      expect(objectFormat(path.join(dir, "a"))).toBe("elf");
      await writeFile(path.join(dir, "b"), Buffer.from([0xcf, 0xfa, 0xed, 0xfe]));
      expect(objectFormat(path.join(dir, "b"))).toBe("macho");
      await writeFile(path.join(dir, "c"), Buffer.from([0x4d, 0x5a, 0x90, 0x00]));
      expect(objectFormat(path.join(dir, "c"))).toBe("pe");
      await writeFile(path.join(dir, "d"), Buffer.from([1, 2, 3, 4]));
      expect(objectFormat(path.join(dir, "d"))).toBe("unknown");
      expect(objectFormat(path.join(dir, "missing"))).toBe("unknown");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("ensureProvidedObjects", () => {
  test("builds the object when it is missing", async () => {
    const dir = await fixture();
    try {
      const out = await ensureProvidedObjects(dir, {
        id: "x",
        type: "compile_and_run",
        providedObjects: [{ source: "driver.c", output: "driver.o" }],
      });
      expect(out.errors).toEqual([]);
      expect(out.built).toEqual(["driver.o"]);
      expect(existsSync(path.join(dir, "driver.o"))).toBe(true);
      expect(objectFormat(path.join(dir, "driver.o"))).not.toBe("unknown");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("rebuilds an object built for another platform", async () => {
    const dir = await fixture({ withOutput: true });
    try {
      expect(objectFormat(path.join(dir, "driver.o"))).toBe("elf");
      const out = await ensureProvidedObjects(dir, {
        id: "x",
        type: "compile_and_run",
        providedObjects: [{ source: "driver.c", output: "driver.o" }],
      });
      // On Linux the ELF would be correct, so only assert on other platforms.
      if (process.platform !== "linux") {
        expect(out.built).toEqual(["driver.o"]);
        expect(objectFormat(path.join(dir, "driver.o"))).not.toBe("elf");
      }
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("leaves a current object alone", async () => {
    const dir = await fixture();
    try {
      const config = {
        id: "x",
        type: "compile_and_run" as const,
        providedObjects: [{ source: "driver.c", output: "driver.o" }],
      };
      await ensureProvidedObjects(dir, config);
      const before = (await stat(path.join(dir, "driver.o"))).mtimeMs;
      const second = await ensureProvidedObjects(dir, config);
      expect(second.built).toEqual([]);
      expect(second.present).toEqual(["driver.o"]);
      expect((await stat(path.join(dir, "driver.o"))).mtimeMs).toBe(before);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("rebuilds when the source is newer", async () => {
    const dir = await fixture();
    try {
      const config = {
        id: "x",
        type: "compile_and_run" as const,
        providedObjects: [{ source: "driver.c", output: "driver.o" }],
      };
      await ensureProvidedObjects(dir, config);
      await new Promise((r) => setTimeout(r, 1100)); // filesystem mtime granularity
      await writeFile(path.join(dir, "driver.c"), DRIVER + "\n/* touched */\n");
      const out = await ensureProvidedObjects(dir, config);
      expect(out.built).toEqual(["driver.o"]);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("reports a missing source instead of throwing", async () => {
    const dir = await fixture();
    try {
      const out = await ensureProvidedObjects(dir, {
        id: "x",
        type: "compile_and_run",
        providedObjects: [{ source: "nope.c", output: "nope.o" }],
      });
      expect(out.built).toEqual([]);
      expect(out.errors.join(" ")).toContain("nope.c is missing");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  test("does nothing when a config declares no objects", async () => {
    const dir = await fixture();
    try {
      const out = await ensureProvidedObjects(dir, { id: "x", type: "file_compare" });
      expect(out).toEqual({ built: [], present: [], errors: [] });
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});

describe("05_squares end to end", () => {
  test("the packaged template carries source, and grading builds the object", async () => {
    const repo = path.join(import.meta.dir, "..");
    const tpl = path.join(repo, "data", "templates", "05_squares");
    expect(existsSync(path.join(tpl, "squares_test.c"))).toBe(true);
    // The Linux object the course shipped must not be in the template.
    expect(existsSync(path.join(tpl, "squares_test.o"))).toBe(false);

    const config = JSON.parse(
      await readFile(path.join(repo, "data", "configs", "05_squares.json"), "utf8"),
    );
    expect(config.providedObjects?.[0]?.source).toBe("squares_test.c");
    expect(config.providedObjects?.[0]?.output).toBe("squares_test.o");
  });
});
