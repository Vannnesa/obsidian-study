/**
 * `grade rebuild <id>` — put an assignment back to its starting state.
 *
 * Two situations, one command:
 *
 *   run from the assignment folder   refresh it in place
 *   run from the workspace root      create or overwrite the folder
 *
 * Overwriting throws away whatever the student has written, so the plan is
 * always computed and shown first, and nothing is touched without confirmation.
 * Anything not supplied by the template — extra files the student added — is
 * left alone and reported, because deleting work this command did not create
 * would be a surprise.
 */

import { cp, mkdir, readdir, rm, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { ConfigError, compareAssignmentIds, listAssignmentIds } from "./config.ts";
import { templateFor } from "./paths.ts";
import { buildProvidedObjects } from "./workspace.ts";

export class RebuildError extends Error {}

// ---------------------------------------------------------------------------
// resolving the short id the user typed
// ---------------------------------------------------------------------------

/**
 * Turn `01`, `1`, `01_apple` or `c2prj1` into a real assignment id.
 *
 * The short numeric form is the common case — nobody wants to type
 * `34_put_together` — so a bare number is padded to two digits and matched
 * against the leading number of each id.
 */
export function resolveId(input: string, ids: readonly string[]): string {
  const raw = input.trim();
  if (raw === "") throw new RebuildError("no assignment given");

  if (ids.includes(raw)) return raw;

  let needle = raw;
  if (/^\d+$/.test(raw)) needle = raw.padStart(2, "0");

  const numeric = /^\d+$/.test(raw);
  const matches = ids.filter((id) =>
    numeric ? id.startsWith(`${needle}_`) : id.startsWith(needle),
  );

  if (matches.length === 1) return matches[0]!;
  if (matches.length === 0) {
    const known = [...ids].sort(compareAssignmentIds).join(", ");
    throw new RebuildError(`no assignment matches "${input}".\nKnown ids: ${known}`);
  }
  throw new RebuildError(
    `"${input}" is ambiguous, it matches: ${matches.join(", ")}`,
  );
}

export async function allIds(root: string): Promise<string[]> {
  return (await listAssignmentIds(root)).sort(compareAssignmentIds);
}

// ---------------------------------------------------------------------------
// planning
// ---------------------------------------------------------------------------

export type FileState = "same" | "differs" | "new";

export interface PlannedFile {
  /** Path relative to the assignment directory. */
  rel: string;
  state: FileState;
}

export interface RebuildPlan {
  id: string;
  /** Absolute path of the folder that would be written. */
  target: string;
  /** True when the folder already exists. */
  exists: boolean;
  /** True when the command was run from inside the folder itself. */
  inPlace: boolean;
  /** Template files, and how each compares with what is there now. */
  files: PlannedFile[];
  /** Generated artifacts of ours that would be removed. */
  removed: string[];
  /** Files present that the template does not contain, left untouched. */
  untouched: string[];
}

/** Artifacts this tool produces, which a rebuild clears out. */
const OUR_ARTIFACTS = ["grade.txt", "answer", ".grade"];

async function readIfExists(file: string): Promise<Uint8Array | null> {
  if (!existsSync(file)) return null;
  try {
    if (!(await stat(file)).isFile()) return null;
    return new Uint8Array(await Bun.file(file).arrayBuffer());
  } catch {
    return null;
  }
}

function bytesEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  for (let i = 0; i < a.byteLength; i++) if (a[i] !== b[i]) return false;
  return true;
}

async function listRelative(dir: string, prefix = ""): Promise<string[]> {
  const out: string[] = [];
  let entries;
  try {
    entries = await readdir(path.join(dir, prefix), { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const rel = prefix ? path.join(prefix, e.name) : e.name;
    if (e.isDirectory()) out.push(...(await listRelative(dir, rel)));
    else if (e.isFile()) out.push(rel);
  }
  return out.sort();
}

/**
 * Work out what a rebuild would do, without changing anything.
 *
 * Called before the confirmation prompt so the student sees exactly which of
 * their files are about to be replaced.
 */
export async function planRebuild(
  root: string,
  id: string,
  cwd: string,
  workspace: string,
): Promise<RebuildPlan> {
  const template = templateFor(root, id);
  if (!existsSync(template)) {
    throw new RebuildError(`the package has no template for "${id}" (expected data/templates/${id}/)`);
  }

  // Where the command was run decides whether this is a refresh or a creation.
  const resolvedCwd = path.resolve(cwd);
  const inPlace = path.basename(resolvedCwd) === id;
  const target = inPlace ? resolvedCwd : path.join(path.resolve(workspace), id);
  const exists = existsSync(target);

  const files: PlannedFile[] = [];
  if (exists) {
    for (const rel of await listRelative(template)) {
      const have = await readIfExists(path.join(target, rel));
      const want = await readIfExists(path.join(template, rel));
      if (have === null) files.push({ rel, state: "new" });
      else if (want !== null && bytesEqual(have, want)) files.push({ rel, state: "same" });
      else files.push({ rel, state: "differs" });
    }
  } else {
    for (const rel of await listRelative(template)) files.push({ rel, state: "new" });
  }

  const removed: string[] = [];
  const untouched: string[] = [];
  if (exists) {
    for (const name of OUR_ARTIFACTS) {
      if (existsSync(path.join(target, name))) removed.push(name);
    }
    const templateSet = new Set(await listRelative(template));
    for (const rel of await listRelative(target)) {
      const top = rel.split(path.sep)[0]!;
      if (templateSet.has(rel)) continue;
      if (OUR_ARTIFACTS.includes(top)) continue;
      // Build products we generate ourselves are neither kept nor listed as
      // the student's work.
      if (rel.endsWith(".o")) continue;
      untouched.push(rel);
    }
  }

  return { id, target, exists, inPlace, files, removed, untouched };
}

/** Files a rebuild would overwrite with different content. */
export function lossyFiles(plan: RebuildPlan): PlannedFile[] {
  return plan.files.filter((f) => f.state === "differs");
}

// ---------------------------------------------------------------------------
// applying
// ---------------------------------------------------------------------------

export interface RebuildOutcome {
  plan: RebuildPlan;
  written: number;
  removed: string[];
}

export async function applyRebuild(root: string, plan: RebuildPlan): Promise<RebuildOutcome> {
  const template = templateFor(root, plan.id);

  await mkdir(plan.target, { recursive: true });
  // Copy file by file rather than replacing the directory, so anything the
  // student added inside survives.
  for (const rel of await listRelative(template)) {
    const from = path.join(template, rel);
    const to = path.join(plan.target, rel);
    await mkdir(path.dirname(to), { recursive: true });
    await cp(from, to);
  }

  for (const name of plan.removed) {
    await rm(path.join(plan.target, name), { recursive: true, force: true });
  }

  // Rebuild the object files the assignment expects, for this platform.
  await buildProvidedObjects(plan.target, plan.id);

  return { plan, written: plan.files.length, removed: plan.removed };
}

// ---------------------------------------------------------------------------
// confirmation
// ---------------------------------------------------------------------------

/**
 * Ask before destroying anything.
 *
 * Reads a single line from stdin, so it behaves the same whether it is typed
 * at a terminal or piped in. Only `y` proceeds: an empty answer, `n`, or EOF
 * all cancel, which is the safe default for a destructive command.
 */
export async function askYesNo(question: string): Promise<boolean> {
  process.stdout.write(question);
  const reader = Bun.stdin.stream().getReader();
  const decoder = new TextDecoder();
  let buf = "";
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const nl = buf.indexOf("\n");
      if (nl >= 0) {
        buf = buf.slice(0, nl);
        break;
      }
    }
  } finally {
    await reader.cancel().catch(() => {});
  }
  const answer = buf.trim().toLowerCase();
  if (answer !== "y") process.stdout.write("Cancelled. Nothing was changed.\n");
  return answer === "y";
}

/** Render the plan for the terminal. */
export function describePlan(plan: RebuildPlan): string[] {
  const lines: string[] = [];
  const where = plan.inPlace ? "this folder" : plan.target;
  lines.push(
    plan.exists
      ? `${plan.id}: refresh ${where}`
      : `${plan.id}: create ${where}`,
  );

  const lossy = lossyFiles(plan);
  const missing = plan.files.filter((f) => f.state === "new");
  if (lossy.length > 0) {
    lines.push("", `These files differ from the starting template and would be overwritten:`);
    for (const f of lossy) lines.push(`  ${f.rel}`);
  }
  if (missing.length > 0 && plan.exists) {
    lines.push("", `These are missing and would be restored:`);
    for (const f of missing) lines.push(`  ${f.rel}`);
  }
  if (plan.removed.length > 0) {
    lines.push("", `These generated files would be deleted:`);
    for (const r of plan.removed) lines.push(`  ${r}`);
  }
  if (plan.untouched.length > 0) {
    lines.push("", `These are not part of the assignment and would be left alone:`);
    for (const u of plan.untouched) lines.push(`  ${u}`);
  }
  if (lossy.length === 0 && missing.length === 0 && plan.removed.length === 0) {
    lines.push("", "Already matches the starting template; nothing to lose.");
  }
  return lines;
}
