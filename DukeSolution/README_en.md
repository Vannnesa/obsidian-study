# git-homework

[中文](README.md) | English

A local grader for the Duke *Introductory C Programming* specialization on
Coursera. You get one assignment at a time, write it, run `grade`, and the next
one appears once you pass. It all runs on your machine. There is no server, no
daemon, and nothing to push.

The assignments, their test data and the reference solutions live in this repo.
The original course pulled assignments from a bare git repository and graded
them with a background daemon; this does the same job over ordinary files.

## Install

You need [Bun](https://bun.sh) and a C compiler.

```bash
git clone <this repo> ~/DukeSolution
cd ~/DukeSolution
bun src/index.ts install
```

That writes a launcher into the first writable directory on your `PATH` and
tells you where it went. If the directory it picked isn't on your `PATH`, it
prints the line to add to your shell config.

You don't have to run `bun install`. The tool has no dependencies, so a fresh
clone works as-is. Install the dev dependencies only if you want to typecheck.

## Use

```console
$ cd ~
$ grade init
Workspace ready: /Users/you/duke-homework

Your first assignment is 00_hello/:
  README
  hello.txt

$ cd ~/duke-homework/00_hello
$ grade
Your file did not match the expected output
Your file is 0 bytes; the expected file is 6 bytes
Expected:
hello

Got:

Overall Grade: FAILED
```

Do what the assignment's README says, then run `grade` again:

```
Overall Grade: PASSED
Your code is in answer/user_code/; the reference is in answer/reference/.
Read answer/diff.txt to see how your solution differs.

Your next assignment is ready: 01_apple/
```

`grade init` works in the directory you're standing in. When that's your home
directory it uses `~/duke-homework` instead, since scattering 42 assignment
folders through `~` is not useful. Pass a path to choose somewhere else.

### Commands

```
grade                 grade the assignment you're in
grade init [dir]      set up a workspace and hand out the first assignment
grade status          what's finished, what's current, what's still locked
grade list            every assignment and how it's graded
grade new <id>        copy one assignment into the workspace
grade check           validate the configs
grade install         put grade on your PATH
grade uninstall       remove it
grade doctor          check that everything needed is present
```

`grade` works from inside an assignment, from the workspace root, or from a
subdirectory of either. Progress is kept in `.grade/state.json` in the
workspace, which is what `grade status` reads.

### Passing and failing

A pass writes `grade.txt` in the assignment directory, creates `answer/` with
your files, the reference solution and a diff between them, and drops the next
assignment in beside it.

A failure writes only `grade.txt`. It names the test that failed and puts what
was expected next to what you produced. Nothing is unlocked.

Exit codes: `0` pass, `1` fail, `3` the assignment can't be checked on this
machine, `2` a usage or configuration problem.

## What gets checked

Most assignments are compiled and run, and their output is compared byte for
byte against stored expected output. Your source code isn't compared to
anything, so a different implementation passes as long as it behaves the same.

Three assignments compare a file you wrote: `00_hello`, `01_apple` and
`10_gdb`. All three ask for a plain data file with known contents, so comparing
bytes is the whole point.

Five assignments can't be graded here and report `NOT GRADED`. They test student
code against collections of deliberately broken programs that lived in
`/usr/local/l2p` on the course's grading machine, and none of those programs
survived into the snapshot this repo was built from. The tool says so instead of
guessing. `REVERSE_ENGINEERING.md` has the details.

## Platform notes

macOS and Linux work. Windows needs a gcc-compatible compiler on `PATH`; MSVC's
`cl` won't work, because the assignments are written against gcc flags.

Don't delete `.gitattributes`. It turns off line-ending conversion. Without it,
a Windows checkout rewrites every fixture's LF as CRLF and every comparison
fails, with `Expected` and `Got` looking identical in the report.

Memory-checking assignments run under AddressSanitizer. On Linux they also run
under valgrind, which is what the course used. On macOS there is no valgrind and
no LeakSanitizer, so the tool runs Apple's `leaks` as a second pass. Uninitialised
reads go undetected on macOS, and `leaks` misses some leaks. The reports keep the
original's `- Valgrind was clean` wording, so read that line with the caveat in
mind.

The teacher's original `.o` files are Linux x86-64 binaries and can't be linked
on macOS at all. Every grader driver was reconstructed from them as C source,
which is what `data/drivers/` contains.

If something isn't working:

```console
$ grade doctor
  ok    package          /Users/you/DukeSolution
  ok    bun              /opt/homebrew/bin/bun
  ok    C compiler       /usr/bin/cc
  ok    grade on PATH    /opt/homebrew/bin/grade
  ok    leak checker     /usr/bin/leaks (ASan + leaks)
  ok    line endings     .gitattributes present (no EOL conversion)
```

## Layout

```
data/configs/     one JSON per assignment, describing how it's graded
data/templates/   what each assignment looks like when you start it
data/drivers/     reconstructed grader drivers, in C
data/reference/   source-only answer key
src/              the tool
re/               evidence from the reverse engineering
tools/            reverse-engineering and verification scripts
upstream/         the original completed assignments (not in git; large)
```

## Development

```bash
bun test tests/          # 62 unit and end-to-end tests
bun run check            # validate every config
bunx tsc --noEmit        # typecheck

./tools/check.sh         # all of the above, plus corpus integrity
./tools/check.sh --full  # re-grade all 42 assignments against the 2024 results
./tools/demo.sh 05_squares
```

## Licence

MIT. See `LICENSE`.

The assignment texts, templates and reference solutions under `data/` and
`upstream/` come from the Duke University Coursera course and are included for
study.
