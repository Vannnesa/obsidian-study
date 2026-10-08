/**
 * `answer/` -- the learning aid produced when an assignment passes.
 *
 * Layout inside the assignment directory:
 *
 *   answer/
 *     user_code/   the student's own files, copied verbatim
 *     reference/   the reference solution (from `reference/<id>/`)
 *     diff.txt     unified diff, user_code vs reference, per file
 *
 * The reference tree is a source-only snapshot: object files, executables,
 * `grade.txt` and core dumps are never copied, so the snapshot stays small and
 * readable.
 */

import { copyFile, mkdir, readdir, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { unifiedDiff } from "./diff.ts";

/** Files worth copying as "the student's code". */
const SOURCE_EXT = /\.(c|h|txt|sh|md|mk)$/i;
const ALWAYS_COPY = new Set(["README", "Makefile", "makefile", "GNUmakefile"]);
/** Artefacts that must never be copied into the snapshot. */
const NEVER_COPY = /\.(o|out|dSYM)$|^grade\.txt$|^vgcore\.|^(answer|reference)$/;

export function isSourceFile(name: string): boolean {
  if (NEVER_COPY.test(name)) return false;
  if (ALWAYS_COPY.has(name)) return true;
  return SOURCE_EXT.test(name);
}

/** Recursively collect source-ish files, relative to `dir`. */
export async function collectSources(dir: string, prefix = ""): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(path.join(dir, prefix), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const rel = prefix ? path.join(prefix, e.name) : e.name;
    if (e.isDirectory()) {
      if (e.name === "answer" || e.name === "node_modules" || e.name.startsWith(".")) continue;
      out.push(...(await collectSources(dir, rel)));
      continue;
    }
    if (!e.isFile()) continue;
    if (isSourceFile(e.name)) out.push(rel);
  }
  return out.sort();
}

async function copyInto(from: string, to: string): Promise<void> {
  await mkdir(path.dirname(to), { recursive: true });
  await copyFile(from, to);
}

export interface AnswerOptions {
  /** Source files the assignment cares about; extra files are still copied. */
  focus?: string[];
  /** Overwrite an existing `answer/` directory. */
  force?: boolean;
}

export interface AnswerOutcome {
  dir: string;
  userFiles: string[];
  referenceAvailable: boolean;
  diffFile: string | null;
}

/**
 * Create `answer/` for the assignment in `assignmentDir`.
 * `referenceDir` is `<root>/reference/<id>`; when absent only the user's code
 * is snapshotted and `diff.txt` records that no reference exists.
 */
export async function writeAnswerDir(
  assignmentDir: string,
  referenceDir: string,
  opts: AnswerOptions = {},
): Promise<AnswerOutcome> {
  const dir = path.join(assignmentDir, "answer");
  if (existsSync(dir)) {
    if (!opts.force) {
      await rm(dir, { recursive: true, force: true });
    } else {
      await rm(dir, { recursive: true, force: true });
    }
  }
  await mkdir(dir, { recursive: true });

  const hasReference = existsSync(referenceDir) && (await stat(referenceDir)).isDirectory();
  const userFiles = await collectSources(assignmentDir);

  for (const rel of userFiles) {
    await copyInto(path.join(assignmentDir, rel), path.join(dir, "user_code", rel));
  }

  let diffFile: string | null = null;
  if (hasReference) {
    const refFiles = await collectSources(referenceDir);
    for (const rel of refFiles) {
      await copyInto(path.join(referenceDir, rel), path.join(dir, "reference", rel));
    }

    const sections: string[] = [
      "# diff between your code and the reference solution",
      "#",
      "# `-` lines are the reference; `+` lines are yours.",
      "",
    ];
    const union = [...new Set([...userFiles, ...refFiles])].sort();
    let anyDiff = false;
    for (const rel of union) {
      const mine = path.join(assignmentDir, rel);
      const theirs = path.join(referenceDir, rel);
      const mineExists = existsSync(mine);
      const theirsExists = existsSync(theirs);
      if (!mineExists && !theirsExists) continue;
      const a = theirsExists ? await Bun.file(theirs).text() : "";
      const b = mineExists ? await Bun.file(mine).text() : "";
      if (a === b) continue;
      anyDiff = true;
      sections.push(
        "=".repeat(70),
        `File: ${rel}`,
        "=".repeat(70),
        unifiedDiff(a, b, {
          fromLabel: theirsExists ? `reference/${rel}` : `/dev/null`,
          toLabel: mineExists ? `user_code/${rel}` : `/dev/null`,
        }),
        "",
      );
    }
    if (!anyDiff) sections.push("Your code is identical to the reference solution. Well done.", "");
    diffFile = path.join(dir, "diff.txt");
    await writeFile(diffFile, sections.join("\n"));
  } else {
    diffFile = path.join(dir, "diff.txt");
    await writeFile(
      diffFile,
      [
        "# diff between your code and the reference solution",
        "",
        `No reference solution is available for this assignment`,
        `(expected a populated directory at ${path.relative(assignmentDir, referenceDir) || referenceDir}).`,
        "",
        "Your submitted files have still been copied into user_code/ for your records.",
        "",
      ].join("\n"),
    );
  }

  return { dir, userFiles, referenceAvailable: hasReference, diffFile };
}
