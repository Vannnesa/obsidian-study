/**
 * `scaffold` -- hand the student the next assignment.
 *
 * After a pass, the next assignment's skeleton is copied out of
 * `templates/<next>/` into a sibling directory of the one being graded, which
 * mirrors what the original daemon did after `git pull`.
 *
 * Safety rules:
 *   - an existing directory is never overwritten; the student is told instead;
 *   - the template must exist, otherwise the failure is reported rather than
 *     silently producing an empty folder.
 */

import { cp, mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { templateFor } from "./paths.ts";

export interface ScaffoldOutcome {
  created: boolean;
  dir: string;
  reason?: string;
  /** Files written, relative to the new directory. */
  files: string[];
}

async function listFiles(dir: string, prefix = ""): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = prefix ? path.join(prefix, e.name) : e.name;
    if (e.isDirectory()) out.push(...(await listFiles(dir, rel)));
    else if (e.isFile()) out.push(rel);
  }
  return out.sort();
}

/**
 * Copy `templates/<nextId>/` to `<parentOf(assignmentDir)>/<nextId>/`.
 * Returns what happened without throwing for the ordinary "already there" case.
 */
export async function scaffoldNext(
  root: string,
  assignmentDir: string,
  nextId: string,
): Promise<ScaffoldOutcome> {
  const target = path.join(path.dirname(assignmentDir), nextId);

  if (existsSync(target)) {
    return {
      created: false,
      dir: target,
      reason: `${nextId}/ already exists, so it was left untouched`,
      files: [],
    };
  }

  const template = templateFor(root, nextId);
  if (!existsSync(template) || !(await stat(template)).isDirectory()) {
    return {
      created: false,
      dir: target,
      reason: `no template found at templates/${nextId}/`,
      files: [],
    };
  }

  await mkdir(target, { recursive: true });
  await cp(template, target, { recursive: true });
  return { created: true, dir: target, files: await listFiles(target) };
}

/**
 * Non-destructive variant used when the student wants to restart: copy the
 * template of `id` into a fresh directory next to the assignment.
 */
export async function scaffoldAssignment(
  root: string,
  parentDir: string,
  id: string,
  targetName = id,
): Promise<ScaffoldOutcome> {
  const target = path.join(parentDir, targetName);
  if (existsSync(target)) {
    return { created: false, dir: target, reason: `${targetName}/ already exists`, files: [] };
  }
  const template = templateFor(root, id);
  if (!existsSync(template)) {
    return { created: false, dir: target, reason: `no template at templates/${id}/`, files: [] };
  }
  await mkdir(target, { recursive: true });
  await cp(template, target, { recursive: true });
  return { created: true, dir: target, files: await listFiles(target) };
}
