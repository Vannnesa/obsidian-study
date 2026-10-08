/**
 * `source_check` -- verify that the student's source declares what the
 * assignment asked for.
 *
 * Assignments: 02_code1, 03_code2, 07_retirement, 23_power_rec.
 *
 * The original grader printed a checklist and the line/column where each
 * declaration was found, for example:
 *
 *   Checking code1.c for legal syntax
 *   Checking for int max (int num1, int num2)
 *   Found on line 3, column 1
 *
 * Only declaration *shape* is checked here, never behaviour -- behaviour is
 * the job of `compile_and_run`. `forbiddenPatterns` covers the negative
 * checks ("Checking for no iteration (do, while, for)").
 */

import { existsSync } from "node:fs";
import path from "node:path";
import { runWithTimeout } from "../runner.ts";
import { runCases } from "./compile-and-run.ts";
import type { CaseResult, RequiredPattern } from "../types.ts";
import type { Strategy, StrategyContext } from "./index.ts";

/** Byte offset -> 1-based line and column. */
function lineColumn(text: string, index: number): { line: number; column: number } {
  let line = 1;
  let lastNewline = -1;
  for (let i = 0; i < index; i++) {
    if (text.charCodeAt(i) === 10) {
      line++;
      lastNewline = i;
    }
  }
  return { line, column: index - lastNewline };
}

export async function sourceCheck(ctx: StrategyContext): Promise<CaseResult[]> {
  const { config, assignmentDir } = ctx;
  const source = path.resolve(assignmentDir, config.source!);

  if (!existsSync(source)) {
    const lines = [`Your file ${config.source} was not found`];
    lines.forEach(ctx.report);
    return [{ label: config.source!, passed: false, reason: "source missing", lines }];
  }

  const text = await Bun.file(source).text();
  // The original prepended headers before checking, so pattern offsets are
  // measured against the same text it saw.
  const prepend = config.prependLines ?? [];
  const probeText = prepend.length > 0 ? prepend.join("\n") + "\n" + text : text;
  const results: CaseResult[] = [];

  // ---- legal syntax --------------------------------------------------------
  // 02_code1/03_code2 print `Checking code1.c for legal syntax`; 07_retirement
  // and 23_power_rec instead print `Attempting to compile retirement.c`. Honour
  // an explicit `compileMessage` and fall back to the checking wording.
  ctx.report(config.compileMessage ?? `Checking ${config.source} for legal syntax`);
  const syntax = await runWithTimeout(
    [config.build?.compiler ?? "cc", "-std=gnu99", "-fsyntax-only", source],
    { cwd: assignmentDir, timeoutMs: 30_000 },
  );
  if (syntax.exitCode !== 0) {
    // Implicit declarations of printf/scanf were a warning under the original
    // gcc 9 defaults; only treat other diagnostics as fatal.
    const fatal = syntax.stderr
      .split("\n")
      .filter((l) => /error:/.test(l) && !/implicit-function-declaration|implicit declaration/.test(l));
    if (fatal.length > 0) {
      const lines = ["Your code does not have legal syntax", ...fatal];
      lines.forEach(ctx.report);
      return [{ label: "syntax", passed: false, reason: "syntax error", lines }];
    }
  }

  // ---- required declarations ----------------------------------------------
  for (const pattern of config.requiredPatterns ?? []) {
    results.push(checkPattern(ctx, probeText, pattern, true));
  }

  // ---- forbidden constructs -------------------------------------------------
  for (const pattern of config.forbiddenPatterns ?? []) {
    results.push(checkPattern(ctx, probeText, pattern, false));
  }

  if (config.requireMain) {
    const outcome = checkPattern(
      ctx,
      probeText,
      { label: "Checking for int main(void)", pattern: String.raw`\bint\s+main\s*\(\s*(void)?\s*\)` },
      true,
    );
    results.push(outcome);
  }

  // ---- behaviour -----------------------------------------------------------
  // The original grader did not stop at the checklist: for 02_code1, 03_code2,
  // 07_retirement and 23_power_rec it went on to link its own main and run the
  // student's functions against many cases. A checklist-only pass would let a
  // declaration-shaped but functionally wrong submission through, so when the
  // config carries `tests` we run them against the same report.
  if (config.tests && config.tests.length > 0) {
    if (config.header) ctx.report(config.header);
    results.push(...(await runCases(ctx)));
  }

  return results;
}

function checkPattern(
  ctx: StrategyContext,
  text: string,
  pattern: RequiredPattern,
  mustExist: boolean,
): CaseResult {
  ctx.report(pattern.label);
  const re = new RegExp(pattern.pattern, "m");
  const match = re.exec(stripComments(text));

  if (mustExist) {
    if (match) {
      const { line, column } = lineColumn(text, match.index);
      ctx.report(`Found on line ${line}, column ${column} `);
      return { label: pattern.label, passed: true, lines: [`Found on line ${line}, column ${column} `] };
    }
    const lines = [`Did not find ${pattern.label.replace(/^Checking for /, "")}`];
    lines.forEach(ctx.report);
    return { label: pattern.label, passed: false, reason: "declaration missing", lines };
  }

  if (!match) {
    ctx.report(" - satisfied");
    return { label: pattern.label, passed: true, lines: [" - satisfied"] };
  }
  const { line, column } = lineColumn(text, match.index);
  const lines = [`Found a forbidden construct on line ${line}, column ${column}`];
  lines.forEach(ctx.report);
  return { label: pattern.label, passed: false, reason: "forbidden construct present", lines };
}

/**
 * Blank out comments and string literals so a pattern cannot be satisfied by
 * prose in a README-style comment. Offsets are preserved so reported line
 * numbers still refer to the original file.
 */
export function stripComments(text: string): string {
  const out = text.split("");
  let i = 0;
  type State = "code" | "line" | "block" | "str" | "chr";
  let state: State = "code";
  while (i < text.length) {
    const c = text[i]!;
    const n = text[i + 1];
    if (state === "code") {
      if (c === "/" && n === "/") {
        state = "line";
        out[i] = " ";
        i++;
        continue;
      }
      if (c === "/" && n === "*") {
        state = "block";
        out[i] = " ";
        i++;
        continue;
      }
      if (c === '"') state = "str";
      else if (c === "'") state = "chr";
    } else if (state === "line") {
      if (c === "\n") state = "code";
      else out[i] = " ";
    } else if (state === "block") {
      if (c === "*" && n === "/") {
        out[i] = " ";
        out[i + 1] = " ";
        i += 2;
        state = "code";
        continue;
      }
      if (c !== "\n") out[i] = " ";
    } else if (state === "str") {
      if (c === "\\") {
        out[i] = " ";
        out[i + 1] = " ";
        i += 2;
        continue;
      }
      if (c === '"') state = "code";
      else out[i] = " ";
    } else if (state === "chr") {
      if (c === "\\") {
        out[i] = " ";
        out[i + 1] = " ";
        i += 2;
        continue;
      }
      if (c === "'") state = "code";
      else out[i] = " ";
    }
    i++;
  }
  return out.join("");
}

export const sourceCheckStrategy: Strategy = {
  id: "source_check",
  run: sourceCheck,
};
