# `data/configs/<id>.json` — schema contract

One JSON file per assignment. **All assignment-specific knowledge lives here**;
`src/` contains none. Anything not expressible in this schema is a bug in the
schema, not a reason to special-case code.

Every config is validated by `bun run src/index.ts --check-configs`. A config
must pass that before it is considered done.

---

## Common fields

| field | type | meaning |
|---|---|---|
| `id` | string | **Required.** Must equal the `data/configs/<id>.json` filename and the assignment directory name. |
| `title` | string | One-line description. |
| `type` | enum | **Required.** `file_compare` \| `compile_and_run` \| `predict_output` \| `source_check` \| `test_identify` \| `memory_check` \| `unsupported` |
| `next` | string \| null | Assignment unlocked on a pass. `null` = end of course. |
| `timeoutMs` | number | Per-child-process wall clock. Default `5000`. |
| `successVerdict` | `"PASSED"` \| `"A"` | The verdict word the original printed on success. **Do not hand-write this** — `python3 tools/apply_verdicts.py` stamps it from `re/original-grade-txt/`. It is not derivable from the strategy: `11_read_ptr1` ended in `PASSED` while `13_read_arr1`, the same family, ended in `A`. Defaults to `PASSED`. |
| `reportStyle` | see below | Which report dialect the original grader used. |
| `compileMessage` | string | Printed as the **first** line, before `header`. Use for `Attempting to compile rectangle.c` (`06_rect`), or `Attempting to compile:` (`29`/`32`/`33`). |
| `showCompileCommands` | bool | Echo compiler invocations into `grade.txt`. The original did this only for the Makefile assignments. Default `false`. |
| `echoStdout` | bool | Echo each case's captured stdout into the report before its verdict. Use where the driver prints its own table (`07_retirement`) or statistics block. |
| `notes` | string | Reverse-engineering provenance. **Required** when `type` is `unsupported`. |
| `header` | string | Verbatim first line, e.g. `Trying to compile your code and link with squares_test.o`. |
| `passMessage` | string | Verbatim line on a full pass, e.g. `You got all cases right`. |

### Report dialects

| `reportStyle` | Shape |
|---|---|
| `squares` (default) | `Testing ./squares 1 0 0 1` / `PASSED` / ` - Correct` |
| `testcase` | `####…####` / `testcase1:` / `testcase1 passed` |
| `inline` | `Testing max(-999, 123) ... Correct` (one line; `... Incorrect` on failure) |
| `running` | `Running testcase 1` / `Your file matched the expected output` / `testcase1 passed` |
| `identify-star` | `**Testing broken implementation N **` / `-----` |

`running` numbers cases 1, 2, 3…  The 2024 `20_rot_matrix` transcript printed
`testcase 1` in all three blocks; that counter bug is deliberately **not**
reproduced. Record the discrepancy in `notes`.

## `type: file_compare`

The student authors a file with exact, known content.

| field | meaning |
|---|---|
| `file` | **Required.** Path relative to the assignment dir. |
| `expectedFile` \| `expected` | **Required (one of).** `expectedFile` is relative to `data/configs/`; `expected` is an inline string. |
| `successMessage` | Overrides `Your file matched the expected output`. |

Comparison is **byte-exact including the trailing newline**. Prefer `expected`
for short known content (e.g. `"hello\n"`) so the fixture is visible in the
config itself.

## `type: compile_and_run` / `memory_check`

| field | meaning |
|---|---|
| `source` | **Required.** Primary student source, relative to the assignment dir. |
| `build` | Build specification, see below. |
| `tests` | **Required, non-empty.** Array of cases, see below. |

`memory_check` exists because valgrind is unavailable on macOS/arm64. It builds
the program **twice** and requires both passes to be clean:

| pass | build | catches |
|---|---|---|
| 1 | `-fsanitize=address -fno-omit-frame-pointer -g` | out-of-bounds access, use-after-free, double-free |
| 2 | plain, run under Apple's `leaks --atExit --` | leaked allocations |

Two builds are required because **LeakSanitizer does not exist on macOS**
(`ASAN_OPTIONS=detect_leaks=1` aborts with exit 99 and *"detect_leaks is not
supported on this platform"*), and `leaks` cannot inspect an ASan binary since
ASan installs its own malloc. On success the report keeps the original wording
(`  - Valgrind was clean (no errors, no memory leaks)` / `valgrind was clean`).

Neither engine reports uninitialised reads, which valgrind did. Say so in
`notes` on every `memory_check` config.

### `build`

| field | meaning |
|---|---|
| `driver` | Reconstructed driver C file, **relative to the project root** (normally `data/drivers/<id>/<name>.c`). |
| `sources` | Sources to compile, relative to the assignment dir. Defaults to `[source]`. |
| `output` | Executable name. Defaults to the assignment id. |
| `flags` | Compiler flags. Write them as the original README does (`--pedantic`, `-Werror`); `src/build.ts` normalises them for clang. |
| `separateCompile` | Compile each source to its own `.o`, then link. Used to reproduce the original's reported command list. |
| `make` | `{ "args": ["poker","OTHERFLAGS=-O3"], "cleanFirst": true }` — drive the build through `make` instead of the compiler. |
| `linkObjects` | Extra `.o`/`.a` to link, relative to the assignment dir. |
| `resolveSymlinks` | Default `true`. Set `false` only if expansion is undesirable. |
| `compiler` | Default `cc` (or `$CC`). |
| `buildDir` | Build in this directory instead of a scratch dir. Avoid: it pollutes the assignment. |

### `selfTest`

Runs the student's source a second time **without** the grader driver and
compares its output, reproducing the original's two-stage report:

```
Your file matched the expected output
Removing your main() and replacing it with our own to run more tests...
```

| field | meaning |
|---|---|
| `expectedFile` \| `expected` | What the standalone program should print. |
| `successMessage` | Defaults to `Your file matched the expected output`. |
| `replaceMessage` | Printed after the self-test, before the driver-linked cases. |

Silently skipped when the source has no `main` and therefore cannot link on its
own — the normal case for `05_squares`. Applies to `compile_and_run` only.

### `tests[]`

| field | meaning |
|---|---|
| `args` | `argv[1..]`. |
| `stdinFile` | File piped to stdin, relative to the assignment dir. |
| `stdin` | Literal stdin (ignored when `stdinFile` is set). |
| `expectedFile` | Expected stdout, **relative to `data/configs/`**, e.g. `expected/05_squares/1_0_0_1.txt`. Preferred. |
| `expected` | Inline expected stdout. Only for very short output. |
| `expectedExit` | Expected exit status. Default 0. |
| `expectFailure` | `true` inverts the check: a non-zero exit is success. |
| `label` | Overrides the displayed case name. |
| `env` | Extra environment variables. |
| `message` | Success line for this case, printed before the verdict. The original varied this per assignment: `28_fix_vg_encr` prints `your output was correct` (lowercase) while `29`–`33` print `Your output is correct`. |
| `failureMessage` | Failure line, where the original used custom wording. |

**Fixture naming convention:** arguments joined with `_`, e.g.
`configs/expected/05_squares/3_5_8_2.txt`. Generate fixtures with
`tools/re/gen_expected.py` rather than by hand.

## `type: predict_output`

The student reads a provided program, works out its output, and writes it down.
Two checks are reported, matching the original:

1. `Your file matched the expected output` — the student's file vs the actual run.
2. `Your output matched what we expected` — the actual run vs the teacher's copy.

| field | meaning |
|---|---|
| `program` | **Required.** The provided program, relative to the assignment dir. |
| `file` | **Required.** The student's prediction file. |
| `expectedFile` \| `expected` | The teacher's stored copy of the program's output. |
| `build.flags` | Defaults to `-std=gnu99 -pedantic -Wall -O3`. |

## `type: source_check`

| field | meaning |
|---|---|
| `source` | **Required.** |
| `requiredPatterns` | `[{ "label", "pattern" }]` — regexes that must match. `label` is printed first; on success the report adds `Found on line L, column C `. |
| `forbiddenPatterns` | Same shape; matching one fails the assignment (`Checking for no iteration (do, while, for)`). |
| `requireMain` | Also check for `int main(void)`. |
| `build.flags` | Used for the `-fsyntax-only` pass only. |

Patterns are matched against the source **with comments and string literals
blanked out**, so prose in a comment cannot satisfy a declaration check.
Offsets are preserved, so reported line/column numbers are real.

## `type: test_identify`

The student writes a harness that must reject every broken implementation and
accept the correct one. Contract: **exit 0 = "looks correct", non-zero = "bug found"**.

| field | meaning |
|---|---|
| `studentTest` | **Required.** The student's harness. |
| `subjects` | **Required.** `[{ "name", "source", "broken": bool, "extraSources"?, "flags"? }]` |
| `reportStyle` | `identify-star` → `**Testing broken implementation N **`; anything else → `Checking <name>` / `Your tests identified the problem with <name>`. |

## `type: unsupported`

Never fakes a pass, and never falsely accuses either. Reports
`Overall Grade: NOT GRADED` and exits with status **3** — distinct from both
`PASSED` (0) and `FAILED` (1) — because *"we cannot check this here"* is not the
same as *"the student got it wrong"*. `tools/verify.py` reports such configs as
`n/a` rather than as a mismatch. Requires `notes` naming the exact missing
artifact and why the assignment cannot be graded honestly.

Never use this to avoid work, and never reduce an assignment to a partial check
merely to make a verdict match the 2024 transcript. Use it when an artifact the
grader depended on genuinely does not exist in this workspace.

---

## Reverse-engineering provenance

Every config should carry `notes` recording **where its numbers came from** —
which `grade.txt` lines, which `data/templates/`, which reconstructed driver, and
which part is inference rather than observation. `REVERSE_ENGINEERING.md`
documents the global method; the per-assignment `notes` record the specifics.

Three confidence levels are used in `notes`:

- **observed** — taken verbatim from an artifact that exists (`grade.txt`
  lines, `ans_*.txt`, README instructions, a provided fixture).
- **recovered** — reconstructed from the teacher's `.o` by ELF reverse
  engineering, and validated against at least one independent artifact.
- **inferred** — reasoned from the README and the report structure but not
  directly observed. Always flagged, never silently assumed.
