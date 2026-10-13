/**
 * Platform-specific object files that an assignment expects to already exist.
 *
 * `05_squares/README` says the course provided `squares_test.o` and tells the
 * student to build with
 *
 *     gcc -o squares -Wall -Werror -std=gnu99 --pedantic squares.c squares_test.o
 *
 * The file the course shipped is a Linux x86-64 object, so that command works
 * on Linux and fails everywhere else. Rather than ship a binary that only works
 * on one platform, the template carries the driver as C source and this module
 * compiles it into an object for the machine the student is actually on.
 *
 * The result is that the command in the README works as written, on any
 * platform, without the student having to know any of the above.
 */

import { stat } from "node:fs/promises";
import { closeSync, existsSync, openSync, readSync } from "node:fs";
import path from "node:path";
import { assertCompilerAvailable } from "./build.ts";
import { runWithTimeout } from "./runner.ts";
import type { AssignmentConfig, ProvidedObject } from "./types.ts";

/** Magic numbers for the object formats we might meet. */
export function objectFormat(file: string): "elf" | "macho" | "pe" | "unknown" {
  try {
    const fd = openSync(file, "r");
    const buf = Buffer.alloc(4);
    try {
      readSync(fd, buf, 0, 4, 0);
    } finally {
      closeSync(fd);
    }
    const [a, b, c, d] = [buf[0], buf[1], buf[2], buf[3]];
    if (a === 0x7f && b === 0x45 && c === 0x4c && d === 0x46) return "elf";
    if (
      (a === 0xfe && b === 0xed && c === 0xfa && (d === 0xce || d === 0xcf)) ||
      (a === 0xcf && b === 0xfa && c === 0xed && d === 0xfe)
    ) {
      return "macho";
    }
    if (a === 0x4d && b === 0x5a) return "pe";
    return "unknown";
  } catch {
    return "unknown";
  }
}

function hostFormat(): "elf" | "macho" | "pe" {
  if (process.platform === "darwin") return "macho";
  if (process.platform === "win32") return "pe";
  return "elf";
}

async function mtime(file: string): Promise<number> {
  try {
    return (await stat(file)).mtimeMs;
  } catch {
    return -1;
  }
}

export interface ProvidedOutcome {
  /** Output files (re)built during this call. */
  built: string[];
  /** Output files that were already present and usable. */
  present: string[];
  /** Problems, as sentences. Never thrown: a failure here must not stop grading. */
  errors: string[];
}

/**
 * Make sure every object the config declares exists and suits this platform.
 *
 * Rebuilds when the output is missing, older than its source, or in a foreign
 * object format — the last case catches a workspace created before this
 * mechanism existed, where a Linux `.o` would be sitting in the directory.
 */
export async function ensureProvidedObjects(
  assignmentDir: string,
  config: AssignmentConfig,
  report?: (line: string) => void,
): Promise<ProvidedOutcome> {
  const outcome: ProvidedOutcome = { built: [], present: [], errors: [] };
  const entries = config.providedObjects ?? [];
  if (entries.length === 0) return outcome;

  for (const entry of entries) {
    const source = path.resolve(assignmentDir, entry.source);
    const output = path.resolve(assignmentDir, entry.output);

    if (!existsSync(source)) {
      outcome.errors.push(
        `${entry.source} is missing, so ${entry.output} cannot be built. ` +
          `It should have come from the assignment template.`,
      );
      continue;
    }

    const haveOutput = existsSync(output);
    const stale = haveOutput && (await mtime(output)) < (await mtime(source));
    const foreign = haveOutput && objectFormat(output) !== hostFormat();

    if (haveOutput && !stale && !foreign) {
      outcome.present.push(entry.output);
      continue;
    }

    const compiler = entry.compiler ?? config.build?.compiler ?? process.env.CC ?? "cc";
    try {
      assertCompilerAvailable(compiler);
    } catch (err) {
      outcome.errors.push((err as Error).message);
      continue;
    }

    const flags = entry.flags ?? ["-std=gnu99", "-Wall"];
    const cmd = [compiler, ...flags, "-c", "-o", output, source];
    const result = await runWithTimeout(cmd, {
      cwd: assignmentDir,
      timeoutMs: 60_000,
      maxCaptureBytes: 1 << 18,
    });

    if (result.exitCode !== 0) {
      outcome.errors.push(
        `could not build ${entry.output} from ${entry.source}:\n${result.stderr.trimEnd()}`,
      );
      continue;
    }

    outcome.built.push(entry.output);
    if (report) {
      const why = !haveOutput
        ? "it was missing"
        : foreign
          ? "the existing one was built for a different platform"
          : "it was older than its source";
      report(`Built ${entry.output} from ${entry.source} (${why}).`);
    }
  }

  return outcome;
}
