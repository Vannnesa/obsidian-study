/**
 * Two roots, deliberately separate.
 *
 *   package root   where the tool and its index live (this checkout).
 *                  Read-only at run time: `data/configs`, `data/templates`,
 *                  `data/drivers`, `data/reference`.
 *
 *   workspace      wherever the student is working. Arbitrary, and never
 *                  inside the package. Holds the assignment directories, the
 *                  generated `grade.txt` / `answer/`, and `.grade/state.json`.
 *
 * The original course kept these separate too: `/git-homework` was the bare
 * repository the daemon read from, and the student's home directory was the
 * workspace. Conflating them would mean grading inside the answer key.
 */

import { existsSync } from "node:fs";
import path from "node:path";

/** Environment overrides, useful when the package is not where it was cloned. */
export const ENV_PACKAGE = "GRADE_PACKAGE";
export const ENV_WORKSPACE = "GRADE_WORKSPACE";

/** Name of the per-workspace state directory. */
export const STATE_DIR = ".grade";
export const STATE_FILE = "state.json";

/**
 * The directory containing `data/`.
 *
 * Derived from this module's own location rather than the working directory,
 * so the tool works from any cwd and the workspace can live anywhere.
 */
export function packageRoot(): string {
  const override = process.env[ENV_PACKAGE];
  if (override) return path.resolve(override);

  // Normal case: <root>/src/paths.ts -> <root>.
  const url = import.meta.url;
  if (!url.includes("/$bunfs/")) {
    const candidate = path.resolve(path.dirname(Bun.fileURLToPath(url)), "..");
    if (existsSync(path.join(candidate, "data"))) return candidate;
  }

  // Compiled with `bun build --compile`: import.meta.url points inside the
  // binary's virtual filesystem, so fall back to where the executable sits.
  const exeDir = path.dirname(process.execPath);
  for (const candidate of [exeDir, path.resolve(exeDir, "..")]) {
    if (existsSync(path.join(candidate, "data"))) return candidate;
  }
  return exeDir;
}

export function dataDir(root: string = packageRoot()): string {
  return path.join(root, "data");
}

export function configsDir(root: string = packageRoot()): string {
  return path.join(dataDir(root), "configs");
}

export function templatesDir(root: string = packageRoot()): string {
  return path.join(dataDir(root), "templates");
}

export function driversDir(root: string = packageRoot()): string {
  return path.join(dataDir(root), "drivers");
}

export function referenceDir(root: string = packageRoot()): string {
  return path.join(dataDir(root), "reference");
}

/** Absolute path of `configs/<id>.json`. */
export function configFile(root: string, id: string): string {
  return path.join(configsDir(root), `${id}.json`);
}

/**
 * Resolve a config-relative path (`expectedFile`) against `data/configs/`.
 * Configs store `expected/<id>/<case>.txt`, so no config needed rewriting when
 * the index moved under `data/`.
 */
export function resolveExpected(root: string, rel: string): string {
  return path.isAbsolute(rel) ? rel : path.join(configsDir(root), rel);
}

/**
 * Resolve a `build.driver` path. Configs store `drivers/<id>/<file>.c`,
 * relative to `data/`.
 */
export function resolveDriver(root: string, rel: string): string {
  return path.isAbsolute(rel) ? rel : path.join(dataDir(root), rel);
}

/** The reference (answer-key) snapshot for an assignment. */
export function referenceFor(root: string, id: string): string {
  return path.join(referenceDir(root), id);
}

/** Directory holding an assignment's initial skeleton. */
export function templateFor(root: string, id: string): string {
  return path.join(templatesDir(root), id);
}

/**
 * Locate the workspace: an explicit directory, `$GRADE_WORKSPACE`, or the
 * nearest ancestor of `start` that looks like one (has `.grade/`, or already
 * contains at least one assignment directory named after a known config).
 */
export function findWorkspace(start: string, knownIds: readonly string[]): string | null {
  let dir = path.resolve(start);
  for (;;) {
    if (existsSync(path.join(dir, STATE_DIR, STATE_FILE))) return dir;
    if (knownIds.some((id) => existsSync(path.join(dir, id)))) return dir;
    const parent = path.dirname(dir);
    if (parent === dir) return null;
    dir = parent;
  }
}

export function stateFile(workspace: string): string {
  return path.join(workspace, STATE_DIR, STATE_FILE);
}

export function isInside(child: string, parent: string): boolean {
  const rel = path.relative(path.resolve(parent), path.resolve(child));
  return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}
