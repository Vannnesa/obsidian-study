/**
 * Line diff, implemented directly rather than pulling in a dependency.
 *
 * Uses the classic Myers O(ND) greedy algorithm over lines, with a hard cap on
 * the edit distance so that two unrelated multi-megabyte files cannot blow up
 * time or memory. When the cap is exceeded the two sides are reported as a
 * wholesale replacement, which is still an honest answer.
 */

const MAX_D = 4000;

export type DiffOp =
  | { kind: "same"; line: string }
  | { kind: "del"; line: string }
  | { kind: "add"; line: string };

export function splitLines(text: string): string[] {
  // Keep the trailing newline semantics visible: a file ending in "\n"
  // produces a final empty element, which must not be reported as a diff.
  const lines = text.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  return lines;
}

/**
 * Produce the shortest edit script between two sequences of lines.
 * Returns null when the edit distance exceeds `MAX_D`.
 */
export function diffLines(a: string[], b: string[]): DiffOp[] | null {
  const n = a.length;
  const m = b.length;
  const max = Math.min(MAX_D, n + m);
  const offset = max;
  const v = new Int32Array(2 * max + 2);
  const trace: Int32Array[] = [];

  let found = false;
  for (let d = 0; d <= max; d++) {
    const snapshot = v.slice();
    trace.push(snapshot);
    for (let k = -d; k <= d; k += 2) {
      let x: number;
      if (k === -d || (k !== d && v[offset + k - 1]! < v[offset + k + 1]!)) {
        x = v[offset + k + 1]!;
      } else {
        x = v[offset + k - 1]! + 1;
      }
      let y = x - k;
      while (x < n && y < m && a[x] === b[y]) {
        x++;
        y++;
      }
      v[offset + k] = x;
      if (x >= n && y >= m) {
        found = true;
        break;
      }
    }
    if (found) break;
  }
  if (!found) return null;

  // Walk the trace backwards to recover the path.
  const ops: DiffOp[] = [];
  let x = n;
  let y = m;
  for (let d = trace.length - 1; d >= 0; d--) {
    const vd = trace[d]!;
    const k = x - y;
    let prevK: number;
    if (k === -d || (k !== d && vd[offset + k - 1]! < vd[offset + k + 1]!)) {
      prevK = k + 1;
    } else {
      prevK = k - 1;
    }
    const prevX = d === 0 ? 0 : vd[offset + prevK]!;
    const prevY = d === 0 ? 0 : prevX - prevK;
    while (x > prevX && y > prevY) {
      ops.push({ kind: "same", line: a[x - 1]! });
      x--;
      y--;
    }
    if (d > 0) {
      if (x > prevX) {
        ops.push({ kind: "del", line: a[x - 1]! });
        x--;
      } else if (y > prevY) {
        ops.push({ kind: "add", line: b[y - 1]! });
        y--;
      }
    }
  }
  ops.reverse();
  return ops;
}

export interface UnifiedOptions {
  fromLabel: string;
  toLabel: string;
  context?: number;
}

/** Render a unified diff. Falls back to delete-all/add-all past the cap. */
export function unifiedDiff(
  before: string,
  after: string,
  opts: UnifiedOptions,
): string {
  const a = splitLines(before);
  const b = splitLines(after);
  const ops = diffLines(a, b);

  const header = [`--- ${opts.fromLabel}`, `+++ ${opts.toLabel}`];
  if (!ops) {
    return [
      ...header,
      `@@ ${a.length} lines replaced by ${b.length} lines (diff too large to render) @@`,
      ...a.map((l) => `-${l}`),
      ...b.map((l) => `+${l}`),
    ].join("\n");
  }
  if (ops.every((o) => o.kind === "same")) {
    return [...header, "(files are identical)"].join("\n");
  }

  const context = opts.context ?? 3;
  const out: string[] = [...header];

  // Group hunks separated by more than 2*context unchanged lines.
  const keep: boolean[] = new Array(ops.length).fill(false);
  ops.forEach((op, i) => {
    if (op.kind === "same") return;
    for (let j = Math.max(0, i - context); j <= Math.min(ops.length - 1, i + context); j++) {
      keep[j] = true;
    }
  });

  let oldLine = 1;
  let newLine = 1;
  let i = 0;
  while (i < ops.length) {
    if (!keep[i]) {
      const op = ops[i]!;
      if (op.kind !== "add") oldLine++;
      if (op.kind !== "del") newLine++;
      i++;
      continue;
    }
    const start = i;
    let end = i;
    while (end < ops.length && keep[end]) end++;

    let oldCount = 0;
    let newCount = 0;
    for (let j = start; j < end; j++) {
      const op = ops[j]!;
      if (op.kind !== "add") oldCount++;
      if (op.kind !== "del") newCount++;
    }
    out.push(`@@ -${oldLine},${oldCount} +${newLine},${newCount} @@`);
    for (let j = start; j < end; j++) {
      const op = ops[j]!;
      if (op.kind === "same") {
        out.push(` ${op.line}`);
        oldLine++;
        newLine++;
      } else if (op.kind === "del") {
        out.push(`-${op.line}`);
        oldLine++;
      } else {
        out.push(`+${op.line}`);
        newLine++;
      }
    }
    i = end;
  }
  return out.join("\n");
}
