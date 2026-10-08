/**
 * Process execution and byte-accurate comparison.
 *
 * Rules enforced here (see REVERSE_ENGINEERING.md):
 *   - every child process has a wall-clock timeout and is force-killed;
 *   - build products live in a temp directory that is always removed;
 *   - output comparison is byte-for-byte on Buffers, never on Strings, because
 *     student C programs legitimately emit non-UTF-8 bytes;
 *   - cases run strictly serially, so peak memory stays flat.
 */

import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

export interface RunOptions {
  cwd?: string;
  env?: Record<string, string>;
  stdinFile?: string;
  stdin?: string;
  timeoutMs?: number;
  /** Cap on retained stdout bytes; the tail is kept when exceeded. */
  maxCaptureBytes?: number;
}

export interface RunResult {
  exitCode: number | null;
  stdout: Uint8Array;
  stderr: string;
  timedOut: boolean;
  durationMs: number;
  /** True when stdout exceeded `maxCaptureBytes` and was truncated. */
  truncated: boolean;
}

const DEFAULT_TIMEOUT_MS = 5000;
const DEFAULT_MAX_CAPTURE = 8 * 1024 * 1024;

/**
 * Read a stream fully, keeping at most `limit` bytes (the head).
 * Returning a bounded buffer keeps a runaway printf loop from exhausting RAM.
 */
async function readCapped(
  stream: ReadableStream<Uint8Array> | null,
  limit: number,
): Promise<{ bytes: Uint8Array; truncated: boolean }> {
  if (!stream) return { bytes: new Uint8Array(0), truncated: false };
  const chunks: Uint8Array[] = [];
  let total = 0;
  let truncated = false;
  const reader = stream.getReader();
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (!value) continue;
      const remaining = limit - total;
      if (remaining <= 0) {
        truncated = true;
        break;
      }
      if (value.byteLength > remaining) {
        chunks.push(value.subarray(0, remaining));
        total += remaining;
        truncated = true;
        break;
      }
      chunks.push(value);
      total += value.byteLength;
    }
  } finally {
    // Releasing the lock lets the child be torn down without a pending read.
    try {
      await reader.cancel();
    } catch {
      /* already closed */
    }
  }
  const out = new Uint8Array(total);
  let off = 0;
  for (const c of chunks) {
    out.set(c, off);
    off += c.byteLength;
  }
  return { bytes: out, truncated };
}

/**
 * Spawn `cmd`, capture output, and guarantee the child dies.
 *
 * On timeout the child gets SIGTERM, and SIGKILL shortly after if it is still
 * alive; the timer is always cleared so no handle keeps the process awake.
 */
export async function runWithTimeout(
  cmd: string[],
  opts: RunOptions = {},
): Promise<RunResult> {
  const timeoutMs = opts.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxCapture = opts.maxCaptureBytes ?? DEFAULT_MAX_CAPTURE;
  const started = performance.now();

  const env = { ...process.env, ...(opts.env ?? {}) } as Record<string, string>;

  let stdinOption: unknown = "ignore";
  if (opts.stdinFile) {
    stdinOption = Bun.file(opts.stdinFile);
  } else if (opts.stdin !== undefined) {
    stdinOption = new TextEncoder().encode(opts.stdin);
  }

  const proc = Bun.spawn(cmd, {
    cwd: opts.cwd,
    env,
    stdin: stdinOption as never,
    stdout: "pipe",
    stderr: "pipe",
  });

  let timedOut = false;
  let killTimer: ReturnType<typeof setTimeout> | undefined;
  const timer = setTimeout(() => {
    timedOut = true;
    try {
      proc.kill();
    } catch {
      /* already gone */
    }
    // Escalate if the child ignores SIGTERM.
    killTimer = setTimeout(() => {
      try {
        proc.kill(9);
      } catch {
        /* already gone */
      }
    }, 250);
    // Do not let the escalation timer hold the event loop open.
    killTimer.unref?.();
  }, timeoutMs);

  try {
    const [stdout, stderrText, exitCode] = await Promise.all([
      readCapped(proc.stdout as ReadableStream<Uint8Array>, maxCapture),
      readCapped(proc.stderr as ReadableStream<Uint8Array>, 256 * 1024),
      proc.exited,
    ]);
    return {
      exitCode,
      stdout: stdout.bytes,
      stderr: new TextDecoder("utf-8", { fatal: false }).decode(stderrText.bytes),
      timedOut,
      durationMs: performance.now() - started,
      truncated: stdout.truncated,
    };
  } finally {
    clearTimeout(timer);
    if (killTimer) clearTimeout(killTimer);
  }
}

/** Byte-for-byte equality. Never compare decoded strings. */
export function buffersEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.byteLength !== b.byteLength) return false;
  for (let i = 0; i < a.byteLength; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

const STREAM_THRESHOLD = 1 << 20; // 1 MiB

/**
 * Compare two files, streaming when either is large so neither is held in
 * memory in full.
 */
export async function filesEqual(a: string, b: string): Promise<boolean> {
  const [sa, sb] = await Promise.all([stat(a), stat(b)]);
  if (!sa.isFile() || !sb.isFile()) return false;
  if (sa.size !== sb.size) return false;
  if (sa.size <= STREAM_THRESHOLD) {
    return buffersEqual(
      new Uint8Array(await Bun.file(a).arrayBuffer()),
      new Uint8Array(await Bun.file(b).arrayBuffer()),
    );
  }
  const [ra, rb] = [
    (Bun.file(a).stream() as ReadableStream<Uint8Array>).getReader(),
    (Bun.file(b).stream() as ReadableStream<Uint8Array>).getReader(),
  ];
  try {
    for (;;) {
      const [ca, cb] = await Promise.all([ra.read(), rb.read()]);
      if (ca.done || cb.done) return ca.done === cb.done;
      if (!buffersEqual(ca.value!, cb.value!)) return false;
    }
  } finally {
    await Promise.allSettled([ra.cancel(), rb.cancel()]);
  }
}

/** Read a file as bytes, bounded. */
export async function readBytes(file: string, limit = DEFAULT_MAX_CAPTURE): Promise<Uint8Array> {
  const size = (await stat(file)).size;
  if (size <= limit) return new Uint8Array(await Bun.file(file).arrayBuffer());
  const buf = new Uint8Array(limit);
  const fh = await Bun.file(file).slice(0, limit).arrayBuffer();
  buf.set(new Uint8Array(fh));
  return buf;
}

/**
 * Render a byte buffer as text for `grade.txt`, making trailing whitespace
 * and tabs visible so a diff is actionable.
 */
export function showBytes(bytes: Uint8Array, limit = 4000): string {
  const slice = bytes.byteLength > limit ? bytes.subarray(0, limit) : bytes;
  const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  const body = text.replace(/\t/g, "\\t").replace(/[ \t]+$/gm, (m) => "·".repeat(m.length));
  if (bytes.byteLength > limit) {
    return `${body}\n... (${bytes.byteLength - limit} more bytes omitted)`;
  }
  return body;
}

/**
 * Decode a buffer verbatim for echoing into the report.
 *
 * Distinct from `showBytes`, which is for *diagnosing* a mismatch: that one caps
 * at 4 KB and renders trailing blanks as `·`. Echoing a program's own output
 * must not do either, or a 23 KB driver table gets truncated mid-row — which is
 * exactly what `07_retirement` prints.
 */
export function echoBytes(bytes: Uint8Array, limit = 1 << 20): string {
  const slice = bytes.byteLength > limit ? bytes.subarray(0, limit) : bytes;
  const text = new TextDecoder("utf-8", { fatal: false }).decode(slice);
  if (bytes.byteLength > limit) {
    return `${text}\n... (${bytes.byteLength - limit} more bytes omitted)`;
  }
  return text;
}

/**
 * Fold CRLF to LF.
 *
 * Needed because a text file authored on Windows, or a C program whose stdio
 * runs in text mode there, produces `\r\n` where the assignment expects `\n`.
 * The difference is an artefact of the platform, not a mistake in the answer,
 * so it is detected and reported instead of being shown as an
 * identical-looking Expected/Got pair.
 */
export function foldNewlines(bytes: Uint8Array): Uint8Array {
  const out = new Uint8Array(bytes.byteLength);
  let n = 0;
  for (let i = 0; i < bytes.byteLength; i++) {
    const b = bytes[i]!;
    if (b === 0x0d && bytes[i + 1] === 0x0a) continue; // drop the CR of a CRLF
    out[n++] = b;
  }
  return out.subarray(0, n);
}

/** Count carriage returns that are immediately followed by a line feed. */
export function countCrlf(bytes: Uint8Array): number {
  let n = 0;
  for (let i = 0; i < bytes.byteLength - 1; i++) {
    if (bytes[i] === 0x0d && bytes[i + 1] === 0x0a) n++;
  }
  return n;
}

/**
 * Describe a newline-only difference, or null when the buffers differ in some
 * other way too. Returns a sentence suitable for `grade.txt`.
 */
export function describeNewlineDiff(actual: Uint8Array, expected: Uint8Array): string | null {
  if (!buffersEqual(foldNewlines(actual), foldNewlines(expected))) return null;

  const actualCrlf = countCrlf(actual);
  const expectedCrlf = countCrlf(expected);
  if (actualCrlf > expectedCrlf) {
    return (
      `Your file uses Windows line endings (CRLF) on ${actualCrlf} line(s); ` +
      `this assignment expects Unix line endings (LF). ` +
      `Re-save it with LF endings, or run the file through \`dos2unix\`.`
    );
  }
  if (expectedCrlf > actualCrlf) {
    return (
      `The expected output uses CRLF line endings but yours uses LF. ` +
      `This is unexpected — please report it, as the packaged fixtures should be LF.`
    );
  }
  return "Your file differs from the expected output only in its line endings.";
}

/** First differing line between two buffers, for compact failure reports. */
export function firstDifference(
  actual: Uint8Array,
  expected: Uint8Array,
): { line: number; actualLine: string; expectedLine: string } | null {
  const dec = new TextDecoder("utf-8", { fatal: false });
  const a = dec.decode(actual).split("\n");
  const e = dec.decode(expected).split("\n");
  const n = Math.max(a.length, e.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== e[i]) {
      return {
        line: i + 1,
        actualLine: a[i] ?? "<missing>",
        expectedLine: e[i] ?? "<missing>",
      };
    }
  }
  return null;
}

/**
 * Create a scratch directory that the caller must remove.
 * Paired with `withTempDir` in practice; exposed for manual control.
 */
export async function makeTempDir(prefix = "grade-"): Promise<string> {
  return mkdtemp(path.join(tmpdir(), prefix));
}

/** Run `fn` with a temp directory, removing it even when `fn` throws. */
export async function withTempDir<T>(
  fn: (dir: string) => Promise<T>,
  prefix = "grade-",
): Promise<T> {
  const dir = await makeTempDir(prefix);
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

/** True when the executable exists on PATH. */
export function which(tool: string): string | null {
  const found = Bun.which(tool);
  return found ?? null;
}
