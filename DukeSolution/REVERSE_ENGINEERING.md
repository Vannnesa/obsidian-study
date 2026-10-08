# REVERSE_ENGINEERING.md

How the initial templates, expected outputs and grading configs in this
repository were recovered from a single asset: a **completed** student working
directory. No bare repository, no original templates, no grader sources, no
`FAILED` reference output.

---

## 1. What we started from, and what was missing

| Asset | Status at the start |
|---|---|
| `DukeSolution/` — 42 assignment directories, 447 files | **present**, 100% complete |
| Original empty templates | **absent** |
| Teacher grader sources (`squares_test.c`, `test-deck.c`, …) | **absent** |
| Teacher grader *objects* (`squares_test.o`, `deck-c4.o`, …) | **present** — 58 of them |
| A `FAILED` `grade.txt` exemplar | **absent** |
| Bare git repository (`/git-homework`) | **absent** |
| Reference expected outputs | **partial** — a few `ans_*.txt`, `answer.txt` |

So the recovery had three inputs: the **READMEs** (what the student was asked
to do), the **completed sources** (one known-good solution), and the
**58 teacher object files** plus the **42 historical `grade.txt` files** (what
the grader actually did).

The historical `grade.txt` files are the single most valuable artifact: they
are a transcript of the original grader's behaviour, listing every test case
it ran and every line it printed. All 42 were copied to
`re/original-grade-txt/` before anything else was touched, and
`tools/restore-originals.sh` puts them back.

---

## 2. Platform reality check

Everything below was verified empirically before any design decision was made.

### 2.1 The teacher's `.o` files cannot be used

```
$ file 05_squares/squares_test.o
ELF 64-bit LSB relocatable, x86-64 ... GCC: (Ubuntu 9.3.0-17ubuntu1~20.04)
$ clang -Wall -std=gnu99 squares.c squares_test.o -o sq
ld: unknown file type in 'squares_test.o'
```

All 58 `.o` files and every committed executable are **Linux x86-64 ELF**,
produced on Ubuntu 20.04 with gcc 9.3.0. This machine is macOS 26 on arm64.
There is no Docker, podman, Lima, Colima, OrbStack or QEMU installed, and
Rosetta on macOS cannot execute Linux ELF binaries (`Permission denied`).

**Consequence:** the original `gcc … squares.c squares_test.o` step is
impossible here. Every teacher driver had to be recovered as C source.

### 2.2 valgrind does not exist on this platform

Valgrind has never supported Apple Silicon, and is not installable. Six
assignments (`28_fix_vg_encr`, `29_outname`, `30_sort_lines`, `31_minesweeper`,
`32_kvs`, `33_counts` — plus parts of `34_put_together`) were graded with it.

**Consequence.** The replacement took two attempts, because the obvious
substitute does not work either:

- **LeakSanitizer does not exist on macOS.** Setting
  `ASAN_OPTIONS=detect_leaks=1` makes the process abort with exit status 99 and
  the message `AddressSanitizer: detect_leaks is not supported on this
  platform`. This was discovered by test, not assumed.
- **Apple's `leaks` cannot inspect an ASan binary**, because ASan installs its
  own malloc: `leaks` reports *"it may be using a malloc replacement library
  without the required support"*.

So `type: "memory_check"` builds the program **twice** and requires both passes
to be clean:

| pass | build | catches |
|---|---|---|
| 1 | `-fsanitize=address -fno-omit-frame-pointer -g` | out-of-bounds, use-after-free, double-free |
| 2 | plain, run under `leaks --atExit --` | leaked allocations |

Two builds cost roughly a second per assignment and recover both defect
classes. The report keeps the original wording
(`- Valgrind was clean (no errors, no memory leaks)` / `valgrind was clean`) so
output stays comparable, and each config's `notes` records the substitution.

**What is still not covered:** neither engine reports *uninitialised reads*
(that was MSan's job, and valgrind did catch them), and `leaks` reports
"0 leaks for 0 total leaked bytes" on a clean run, which the parser must treat
as success rather than as a finding.

### 2.3 34 files are flattened git symlinks

In the capstone directories, many files are regular text files whose entire
content is a relative path:

```
$ cat c4prj3_finish/cards.c
../c2prj1_cards/cards.c
```

These were git mode `120000` symlinks that got checked out as plain files at
some point. The dependency graph is:

```
c2prj1_cards   cards.c, cards.h                    (real)
c3prj1_deck    deck.c, deck.h                      (real) + cards.* → c2prj1_cards
c3prj2_eval    eval.c, eval.h                      (real) + deck.*, cards.*
c4prj1_deck    main.c                              (real) + deck.*, eval.*, cards.*
c4prj2_input   future.*, input.*, main.c           (real) + deck.*, eval.*, cards.*
c4prj3_finish  main.c                              (real) + everything above
```

`src/build.ts` expands these into real content in a staging directory before
compiling (`materializeTree`), with cycle detection. Templates reproduce them
as the same one-line pointer file, which is the format the original repository
used.

### 2.4 Everything compiles, once you know the flags

A compile sweep of all 66 `.c` files with `clang -std=gnu99` initially failed on
29. Two causes, both now handled:

- the 34 flattened symlinks above (a `.c` file containing a path is not C);
- `02_code1/code1.c` calls `printf` with no `#include <stdio.h>`. Under the
  original gcc 9 that was a warning; under clang it is an error. `source-check.ts`
  tolerates implicit-declaration diagnostics for exactly this reason.

`--pedantic` is accepted by clang, and `normalizeFlags()` rewrites it to
`-pedantic` and relaxes the clang-only warnings that gcc 9 did not have, so a
single config works on both toolchains.

---

## 3. Method: recovering a driver from a `.o` file

`squares_test.o` is the clearest worked example; the same procedure applies to
`read-matrix.o`, `outname_test.o`, `kv_test.o`, `counts_test.o`,
`test-deck.o`, `test-eval.o`, `deck-c4.o`, `eval-c4.o`, `future.o` and
`input.o`.

`tools/re/elfdump.py` mines each object and writes a Markdown report plus a JSON
sidecar to `re/elf/`. It extracts four things and ties them together:

1. **Symbol table** — which functions the driver defines and which it imports.
   For `squares_test.o`: defines `getInt` (237 bytes) and `main` (184 bytes),
   and imports `squares`, `strtol`, `fprintf`, `fwrite`, `exit`, `stderr`.
   That immediately establishes the contract: the student supplies `squares`,
   the driver supplies `main`.
2. **`.rodata` string literals** — the exact `printf` formats and messages:
   ```
   "'%s' does not seem to be (enitrely) a number\n"
   "%s is too big of a number!\n"
   "%s is negative.  Please use only numbers >=0\n"
   "Usage ./squares size1 x_offset, y_offset, size2\n"
   ```
   Note the preserved typos (`enitrely`) and the double space in the
   negative-number message.
3. **Relocations** — in an unlinked object every call and RIP-relative
   reference is zeroed and described by a relocation instead. Re-attaching
   relocations to the instruction that owns each offset, and resolving
   section symbols (whose `st_name` is 0, so the section name must be recovered
   from `st_shndx`), is what makes the disassembly readable:
   ```asm
        51:  leaq  (%rip), %rsi
   ;   .rodata -> "'%s' does not seem to be (enitrely) a number\n"
   ```
   `R_X86_64_PC32` displacements are measured from the end of the instruction,
   so the addend carries a −4 bias that must be corrected before indexing
   `.rodata`.
4. **DWARF**, where present — 28 objects carry it, including several grader
   drivers. This yields the compilation unit, function signatures with
   parameter names, local variables, struct/typedef layouts and source line
   numbers.

### 3.1 Worked example: `getInt`

```asm
 movl  $0xa, %edx            ; base 10
 callq strtol
 movzbl (%rax), %eax         ; *endptr
 testb %al, %al
 je    .ok
 ... fprintf(stderr, "'%s' does not seem to be (enitrely) a number\n", str); exit(1)
.ok:
 movl  $0x80000000, %eax
 cmpq  %rax, -0x10(%rbp)     ; val vs 2147483648
 jl    .not_too_big
 ... fprintf(stderr, "%s is too big of a number!\n", str); exit(1)
.not_too_big:
 cmpq  $0x0, -0x10(%rbp)
 jns   .not_negative
 ... fprintf(stderr, "%s is negative.  Please use only numbers >=0\n", str); exit(1)
```

That transcribes directly to `strtol` → three guarded diagnostics → `exit(1)`.
The `cmpq $0x80000000 … jl` pair is exactly how gcc compiles `val > INT_MAX`,
which is why the recovered source reads `if (val > INT_MAX)`.

### 3.2 Worked example: `main`

`cmpl $0x5, argc` → `je` past the usage branch, `fwrite(usage, 1, 48, stderr)`
and `movl $0x1, %eax`, then four `getInt` calls **in reverse argument order**
(the x86-64 calling convention evaluates arguments right-to-left), then a
single call to `squares`. Recovered as:

```c
int main(int argc, char ** argv) {
  if (argc != 5) {
    fprintf(stderr, "Usage ./squares size1 x_offset, y_offset, size2\n");
    return 1;
  }
  squares(getInt(argv[1]), getInt(argv[2]), getInt(argv[3]), getInt(argv[4]));
  return 0;
}
```

The `48` in `fwrite(usage, 1, 48, stderr)` independently confirms the usage
string: `"Usage ./squares size1 x_offset, y_offset, size2\n"` is exactly 48
bytes including the newline.

### 3.3 How the reconstruction was validated

Recovering a driver is only credible if it can be checked against something
that already existed. Three checks were available and all three pass:

1. **Byte-exact output match.** `05_squares` ships three teacher-produced
   answer files for `./squares 3 5 8 2`, `5 2 4 6` and `9 2 3 4`. The
   reconstructed driver reproduces all three byte-for-byte.
2. **Whole-report match.** Grading `05_squares` with the reconstructed driver
   reproduces the 2024 `grade.txt` byte-for-byte, apart from the timestamp and
   the three extra practice cases deliberately added (see §5.2).
3. **Internal consistency.** The usage string's length is confirmed twice —
   once as a string literal, once as the `fwrite` size argument.

This is the difference between *recovered* and *inferred* in the confidence
scale below. A driver recovered from an object and validated against an
independent artifact is **recovered**; a driver written from a README because
the object is missing is **inferred**, and says so.

---

## 4. Assignment taxonomy

Seven strategies cover all 42 assignments. The mapping is declared per
assignment in `data/configs/<id>.json`; `src/` holds no assignment-specific logic.

| Strategy | What it does | Assignments |
|---|---|---|
| `file_compare` | student-authored file vs known bytes | `00_hello`, `01_apple` |
| `compile_and_run` | build (optionally with a driver), run with argv/stdin, diff stdout | `04_compile`, `05_squares`, `06_rect`, `07_retirement`, `10_gdb`, `14_array_max`, `16_subseq`, `18_reverse_str`, `19_bits_arr`, `20_rot_matrix`, `23_power_rec`, `25_break_encr`, `27_matrix_input`, `34_put_together`, capstone |
| `predict_output` | compile a provided program, check the student's `answer.txt` against both the real run and the teacher's copy | `11_read_ptr1`, `12_read_ptr2`, `13_read_arr1`, `17_read_arr2`, `21_read_rec1`, `24_read_arr3` |
| `source_check` | required/forbidden declaration patterns + `-fsyntax-only` | `02_code1`, `03_code2`, `07_retirement`, `23_power_rec` |
| `test_identify` | student's harness must reject every broken variant and accept the correct one | `08_testing`, `09_testing2`, `15_tests_subseq`, `22_tests_power`, `26_tests_matrix_input`, `c2prj2_testing` |
| `memory_check` | `compile_and_run` + ASan/LSan verdict | `28_fix_vg_encr`, `29_outname`, `30_sort_lines`, `31_minesweeper`, `32_kvs`, `33_counts` |
| `unsupported` | recognised but not honestly gradable here; reports why and fails | any assignment where a required artifact is missing |

### 4.1 Report dialects

The original grader used two distinct report styles, and both are preserved:

- **`squares` style** — `Testing ./squares 1 0 0 1` / `PASSED` / ` - Correct`,
  ending with `You got all cases right`.
- **`testcase` style** — a `####…####` separator, `testcase1:`, then
  `testcase1 passed`, as in `06_rect`, `14_array_max`, `20_rot_matrix`.

A third dialect appears in the `test_identify` family
(`**Testing broken implementation N **` / `-----`), selected via
`reportStyle: "identify-star"`.

### 4.2 Verdict vocabulary

Most assignments end with `Overall Grade: PASSED`. Many others end with
`Overall Grade: A`. Reading all 42 originals, the letter grade correlates with
the checklist/testcase dialects rather than with difficulty, so
`squares`-style configs produce `PASSED` and the rest produce `A` on success.
`FAILED` is used for every unsuccessful outcome. No `FAILED` example existed to
copy, so its wording is inferred from the success-path template plus the
per-case `Expected:` / `Got:` structure — it is flagged as **inferred** here
and in the affected configs.

---

## 5. Findings that contradict the initial brief

### 5.1 `05_squares` has 144 graded cases, not 108

The brief states 108 argument groups. The actual 2024 `grade.txt` contains
**144 distinct `Testing ./squares …` cases**. All 144 are configured.
`configs/expected/05_squares/` holds 147 fixtures: the 144 graded cases plus
the 3 practice cases from `ans_3_5_8_2.txt`, `ans_5_2_4_6.txt` and
`ans_9_2_3_4.txt` that the README tells students to diff against by hand.

Adding those 3 (they are genuinely useful and were explicitly requested) is the
only reason `grade.txt` for `05_squares` is 446 lines instead of the original
437. `tools/verify.py` reports this as `match-verdict` and prints the delta.

### 5.2 The `ans_*` files are practice aids, not graded cases

The README says "We have also provided 3 files which show the correct output
for three inputs … Use `diff`". They are not in the graded set. Both facts are
now recorded rather than conflated.

### 5.3 File-comparison is byte-exact, trailing newline included

`00_hello/hello.txt` is exactly `hello\n` (6 bytes) and `01_apple/fruit.txt` is
exactly `apple\n`. The README states "(we generally end files with a newline)".
`file_compare` therefore compares bytes, and the failure report calls out the
missing-final-newline case specifically, because that is the most likely
mistake.

---

## 5.4 The success verdict is a property of the assignment, not the strategy

The original ended some reports with `Overall Grade: PASSED` and others with
`Overall Grade: A`. The first implementation guessed the verdict from the
strategy type, on the theory that the letter marked the heavier assignments.
Reading all 42 transcripts shows that is wrong:

| assignment | strategy | verdict |
|---|---|---|
| `08_testing` | `test_identify` | **A** |
| `09_testing2` | `test_identify` | **PASSED** |
| `11_read_ptr1`, `12_read_ptr2` | `predict_output` | **PASSED** |
| `13_read_arr1`, `17_read_arr2`, `21_read_rec1`, `24_read_arr3` | `predict_output` | **A** |
| `c2prj1_cards` | `compile_and_run` | **PASSED** |
| `c3prj1_deck` | `compile_and_run` | **A** |

Identical strategies produce different verdicts, so the value is not derivable
from the type. It is now read straight out of `re/original-grade-txt/<id>.grade.txt`
by `tools/apply_verdicts.py`, which stamps `successVerdict` into every config.
Guessing was replaced with observing.

## 5.5 The teacher's broken implementations are gone

Five of the six `test_identify` assignments cannot be graded as intended,
because the programs the student was supposed to catch are not in this
workspace. They lived on the 2024 grading VM under `/usr/local/l2p`, as the
READMEs and `run_all.sh` files still say:

| assignment | missing artifact |
|---|---|
| `09_testing2` | `/usr/local/l2p/match5/correct-match5`, `match5-000` … `match5-296` |
| `15_tests_subseq` | `/usr/local/l2p/subseq/subseq1` … `subseq11.o` (and the correct `subseq.o`) |
| `22_tests_power` | `/usr/local/l2p/power/power1` … `power11.o` |
| `26_tests_matrix_input` | `/usr/local/l2p/rot_matrix/rotateMatrix1` … `rotateMatrix8` |
| `c2prj2_testing` | `/usr/local/l2p/poker/test-eval-0000` … `test-eval-0022` |

A search of the whole workspace and the parent directory found no copies, no
symlinks and no leftovers. Only `08_testing` still has its implementations
(`isPrime-correct`, `isPrime-broken1..4` — Linux ELF, recoverable by the method
in §3).

The "don't do the assignment" half of the grader cannot be reproduced without
the programs it was testing against, and inventing stand-ins would be
fabrication. Those assignments are therefore marked honestly: reduced to the
part that *can* be checked where a real check survives, and `unsupported`
where none does.

## 5.6 `NOT GRADED` — a third verdict

The original had two outcomes, but reverse engineering surfaced a third
situation it never faced: *this assignment cannot be checked here.* Reporting
`FAILED` would tell a student their work is wrong when it has not been
examined; reporting `PASSED` would let them believe they are finished. So
`type: "unsupported"` writes `Overall Grade: NOT GRADED` and exits with status
**3**, distinct from `PASSED` (0) and `FAILED` (1), and `tools/verify.py`
reports such configs as `n/a` rather than as a verification failure. This is a
deliberate extension to the original's vocabulary, made to keep the tool's
claims true.

## 6. Confidence scale

Every config's `notes` field labels its own provenance:

| Label | Meaning | Example |
|---|---|---|
| **observed** | taken verbatim from an artifact that exists | the 144 case list from `upstream/05_squares/grade.txt`; `hello\n` from `hello.txt` |
| **recovered** | reconstructed from a teacher `.o` and validated against an independent artifact | `data/drivers/05_squares/squares_test.c`, validated against all three `ans_*.txt` and the full historical `grade.txt` |
| **inferred** | reasoned from README + report structure, not directly observed | `FAILED` wording; any driver whose teacher object is absent from the workspace |

The rule applied throughout: **never let an inference look like an
observation.** Where an artifact needed to grade an assignment faithfully is
missing, the assignment is marked `unsupported` with the missing artifact named
rather than being silently approximated.

---

## 7. Open questions

These are genuine unknowns, listed rather than guessed at.

1. **`FAILED` output wording.** No failed `grade.txt` was ever available. The
   format used here follows the success template and the per-case structure
   implied by the `PASSED` blocks, and is marked **inferred** everywhere it
   appears. If a real failed transcript ever turns up, the strategies'
   failure branches in `src/strategies/*.ts` are the only places to change.

2. **Drivers with no surviving object.** Several assignments linked a grader
   `main` that is not present in the workspace (notably `14_array_max`,
   `16_subseq`, `18_reverse_str`, `19_bits_arr`). Their drivers here are
   reconstructed from the README contract plus the observable lines in the
   historical `grade.txt` (for example `array size:0 was Correct`). The
   *behaviour* is faithful; the original driver's internal structure is not
   recoverable and is not claimed.

3. **Stochastic grading in the capstone.** `c3prj1_deck` reports shuffle
   statistics (`Least common hand: 0.131800%`, `Perfectly even is: 0.138888%`)
   and `c4prj3_finish` runs Monte Carlo simulations. Neither can be compared
   exactly. These are graded on their deterministic components only, and the
   omitted statistical checks are named in the relevant `notes`.

4. **Exact `-Werror` warning sets.** The original used gcc 9.3.0. clang 21
   reports additional warnings, so `normalizeFlags()` relaxes the clang-only
   ones. A student who passes here would very likely pass on the original
   toolchain, but the converse is not guaranteed.

5. **`grade.txt` as an input.** The tool overwrites `grade.txt` in place, as
   the original did. Since the 42 committed `grade.txt` files are irreplaceable
   evidence, they were snapshotted to `re/original-grade-txt/` first and
   `tools/restore-originals.sh` restores them. Verification runs
   (`tools/verify.py`) always grade a temp copy so the working tree is never
   touched.

6. **Uninitialised reads are no longer checked.** valgrind caught them; the
   ASan + `leaks` pair does not. A student could pass a `memory_check`
   assignment here with a program that valgrind would have flagged. This is a
   real reduction in coverage, not a cosmetic difference, and it is recorded in
   every `memory_check` config's `notes`.

7. **`10_gdb` deliverable.** Its `grade.txt` says only `Your file matched the
   expected output` and it ships both `game.c` and `input.txt`. What the
   student was actually asked to submit is determined from its README; see that
   config's `notes` for the reasoning and the confidence level assigned.

---

## 9. Coverage

Every config is graded against the 2024 `grade.txt` by `tools/verify.py`, which
copies the assignment to a scratch directory and compares both the verdict and
the report body. **37 of 42 reproduce the original verdict; 17 of those are
byte-identical apart from the timestamp; 5 are declared ungradable here; 0
fail.** Regenerate this table with `python3 tools/verify.py --markdown`.

| assignment | strategy | 2024 verdict | reproduced | lines vs original |
|---|---|---|---|---|
| `00_hello` | `file_compare` | PASSED | **exact** |  |
| `01_apple` | `file_compare` | PASSED | **exact** |  |
| `02_code1` | `source_check` | A | **exact** |  |
| `03_code2` | `source_check` | A | **exact** |  |
| `04_compile` | `compile_and_run` | PASSED | **exact** |  |
| `05_squares` | `compile_and_run` | PASSED | verdict + wording | +3 / -0 |
| `06_rect` | `compile_and_run` | A | **exact** |  |
| `07_retirement` | `source_check` | A | verdict + wording | +3 / -0 |
| `08_testing` | `compile_and_run` | A | **exact** |  |
| `09_testing2` | `unsupported` | PASSED | not gradable here |  |
| `10_gdb` | `file_compare` | PASSED | **exact** |  |
| `11_read_ptr1` | `predict_output` | PASSED | **exact** |  |
| `12_read_ptr2` | `predict_output` | PASSED | **exact** |  |
| `13_read_arr1` | `predict_output` | A | **exact** |  |
| `14_array_max` | `compile_and_run` | A | verdict + wording | +1 / -0 |
| `15_tests_subseq` | `unsupported` | PASSED | not gradable here |  |
| `16_subseq` | `compile_and_run` | A | verdict + wording | +1 / -1 |
| `17_read_arr2` | `predict_output` | A | **exact** |  |
| `18_reverse_str` | `compile_and_run` | A | verdict + wording | +3 / -1 |
| `19_bits_arr` | `compile_and_run` | A | verdict + wording | +2 / -0 |
| `20_rot_matrix` | `compile_and_run` | A | verdict + wording | +4 / -0 |
| `21_read_rec1` | `predict_output` | A | **exact** |  |
| `22_tests_power` | `unsupported` | PASSED | not gradable here |  |
| `23_power_rec` | `source_check` | A | verdict + wording | +1 / -0 |
| `24_read_arr3` | `predict_output` | A | **exact** |  |
| `25_break_encr` | `compile_and_run` | A | verdict + wording | +1 / -1 |
| `26_tests_matrix_input` | `unsupported` | PASSED | not gradable here |  |
| `27_matrix_input` | `compile_and_run` | A | verdict + wording | +17 / -16 |
| `28_fix_vg_encr` | `memory_check` | A | verdict + wording | +0 / -0 |
| `29_outname` | `memory_check` | A | **exact** |  |
| `30_sort_lines` | `memory_check` | A | **exact** |  |
| `31_minesweeper` | `memory_check` | A | **exact** |  |
| `32_kvs` | `memory_check` | A | **exact** |  |
| `33_counts` | `memory_check` | A | **exact** |  |
| `34_put_together` | `memory_check` | A | verdict + wording | +6 / -18 |
| `c2prj1_cards` | `compile_and_run` | PASSED | verdict + wording | +12 / -15 |
| `c2prj2_testing` | `unsupported` | PASSED | not gradable here |  |
| `c3prj1_deck` | `compile_and_run` | A | verdict + wording | +4 / -7 |
| `c3prj2_eval` | `compile_and_run` | A | verdict + wording | +25 / -35 |
| `c4prj1_deck` | `memory_check` | A | verdict + wording | +12 / -16 |
| `c4prj2_input` | `compile_and_run` | A | verdict + wording | +8 / -11 |
| `c4prj3_finish` | `compile_and_run` | A | verdict + wording | +56 / -58 |

42 assignment(s): 37 reproduced, 5 declared ungradable here, 0 without an original artifact, 0 failing

`exact` means the report body matches the 2024 artifact line for line.
`verdict + wording` means the same `Overall Grade` and the same case outcomes,
with a small number of lines that differ structurally — an extra `testcase1:`
marker, a case-numbering offset the original inherited from a shared counter, or
a `####` separator around an echoed table. None of those differences change
whether the assignment passes.

`not gradable here` is the `unsupported` verdict: the teacher programs those
assignments test against lived in `/usr/local/l2p` on the 2024 grading VM and
did not survive into this workspace (see §5.5). The tool says so and exits 3
rather than pretending.

### Known gaps

| assignment | gap |
|---|---|
| `05_squares` | +3 lines: the three `ans_*.txt` practice cases are graded, not just stored (see §5.1). |
| `16_subseq` | Cases are numbered 1–4; the original's counter was inherited from `14_array_max` and read 2–5. |
| `18_reverse_str` | One line: the driver's `nullptr` output had no trailing newline in 2024, so it ran into the next separator. We end the line. |
| `20_rot_matrix` | +4 lines: the 2024 grader printed `testcase 1` in all three blocks. That counter bug is not reproduced. |
| `27_matrix_input` | The first case prints no `####` separator in the original; we emit one for every case. |
| `c4prj3_finish` | The Monte Carlo simulations are stochastic and cannot be compared exactly; only deterministic components are graded. |

## 7.5 Package versus workspace

The repository is an **index**, not a working directory. Nothing here is
written at run time.

| | |
|---|---|
| **package** | this checkout. `data/configs/`, `data/templates/`, `data/drivers/`, `data/reference/`. Read-only. |
| **workspace** | anywhere else, created by `grade init`. Holds the assignment directories, the generated `grade.txt` / `answer/`, and `.grade/state.json`. |

The original course drew the same line: `/git-homework` was the bare repository
the daemon read from, and the student's home directory was the workspace.
Keeping them apart matters more here than it did there, because this index is
also the open-source distribution — two people cloning it must not share
progress, and grading must never write into the answer key.

`src/paths.ts` owns the split. `packageRoot()` derives from the module's own
location (overridable with `GRADE_PACKAGE`), so the tool works from any working
directory.

Consequences worth noting:

- **Progress is per-workspace.** `.grade/state.json` records `current` and
  `completed`; `grade init` refuses to create a workspace inside the package.
- **The 42 completed upstream directories are not used at run time.** They moved
  to `upstream/`, which is gitignored because it carries Linux ELF objects,
  linked binaries and `vgcore.*` dumps. Their source-only content is what
  `data/reference/` holds, and their historical `grade.txt` files are preserved
  in `re/original-grade-txt/`.
- **Verification grades a scratch copy.** `tools/verify.py` copies
  `upstream/<id>` to a temp directory and runs the tool with `--dir`, so the
  evidence is never disturbed.

## 8. Reproducing this work

```bash
# 1. mine every teacher object into readable reports
python3 tools/re/elfdump.py                 # -> re/elf/*.md + *.json

# 2. restore the 2024 grade.txt artifacts if anything overwrote them
./tools/restore-originals.sh

# 3. regenerate an expected-output fixture set from a reference solution
python3 tools/re/gen_expected.py --help    # cases read from argv / historic grade.txt
python3 tools/re/gen_fixtures.py --help    # cases read from the config itself

# 4. validate every config
bun run src/index.ts check

# 5. grade every assignment in a scratch copy and diff against the original
python3 tools/verify.py
```

Two fixture generators exist, and the split is deliberate:

- **`gen_expected.py`** takes a list of argument vectors (from `--args-file`, a
  historic `grade.txt`, or literal `--cases`) and builds one reference program.
  Use it when the cases are a simple product of arguments, as in `05_squares`.
- **`gen_fixtures.py`** drives the cases declared in a config — including
  per-case `stdinFile`, `cwd` and inline `expected` — and stages flattened git
  symlinks the way `src/build.ts` does. Use it for the capstone directories,
  whose sources only resolve once those links are expanded.

`gen_expected.py` can also *verify* fixtures against artifacts that already
exist (`--verify NAME:PATH`), which is how the `05_squares` reconstruction was
confirmed against all three teacher `ans_*.txt` files.

## 9. What is deliberately not done

Recorded here so the gaps are not mistaken for oversights:

| gap | why |
|---|---|
| 14 assignments have fewer than 5 configured cases | Their historic `grade.txt` records exactly that many. The counts were checked one-by-one against the 2024 transcripts. Padding to 5 would mean inventing tests the course never ran — `04_compile`, whose program takes no input, has exactly one meaningful case. |
| 5 assignments are `unsupported` | The teacher programs they test against lived in `/usr/local/l2p` and did not survive (§5.5). |
| Uninitialised reads are unchecked | No engine on macOS reports them; valgrind did (§2.2, §7.6). |
| `leaks` misses some leaks | Measured on `28_fix_vg_encr`: it catches the `getline` buffer leak but not the 14-byte `outFileName` leak, because the pointer is still on the exiting stack (§2.2). |
| Shuffle and Monte Carlo statistics are not compared numerically | `c3prj1_deck` and `c4prj3_finish` are stochastic. Their deterministic parts are graded, and `c3prj1_deck`'s shuffle is graded by a chi-square assertion rather than by reproducing the 2024 percentages. |
| `c4prj3_finish` `test14` is excluded | It exposes a genuine bug in the recorded reference solution (partial 3-way ties are miscounted). Grading it would fail the only working solution available. Recorded in that config's `notes`. |
| A few report bodies differ by a handful of lines | Mostly `testcaseN:` markers and case numbering the original inherited from a shared counter (§9 coverage table). No difference changes whether an assignment passes. |

See `SCHEMA.md` for the config contract and `README.md` for usage.
