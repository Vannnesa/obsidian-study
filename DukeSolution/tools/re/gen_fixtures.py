#!/usr/bin/env python3
"""
gen_fixtures.py -- generate `configs/expected/<id>/` for a compile_and_run /
memory_check config by running the *recorded 2024 solution* through the same
build the grading tool uses.

Why this exists next to `gen_expected.py`
-----------------------------------------
`gen_expected.py` builds the reference sources straight out of the checkout
with absolute paths.  That is enough for the early assignments, where every
source lives in one directory, but it cannot handle the capstone directories:

  * many `.c`/`.h` files there are *flattened git symlinks* -- a regular file
    whose entire content is a relative path such as `../c3prj1_deck/deck.c`.
    `src/build.ts` materialises them into a scratch tree before compiling, and
    a grader driver that includes "cards.h" only compiles against the
    materialised tree;
  * the driver's test cases address fixtures inside the assignment directory
    (`list1a.txt`, `provided-tests/test01.txt`, ...), so the reference program
    has to run with the assignment directory as its working directory, which
    `gen_expected.py` cannot do.

This script therefore reproduces `src/build.ts`'s staging step (including the
clang flag normalisation) and then runs each case exactly as the grading tool
will: same argv, same stdin, same cwd.

Usage
-----
    python3 tools/re/gen_fixtures.py c4prj2_input
    python3 tools/re/gen_fixtures.py c3prj2_eval --print-config
    python3 tools/re/gen_fixtures.py 34_put_together --case 'kvs1.txt list1a.txt list1b.txt'

With no --case, every case of the config is regenerated.  Fixtures are named
after the case label (slugified) or, when there is no label, after the argv
joined with `_`, which is the convention SCHEMA.md documents.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
FLATTENED_LINK = re.compile(r"^\s*(\.\.?/[^\n]*?)\s*$")


def read_flattened_link(path: Path) -> str | None:
    """A file whose whole content is a single relative path is a git symlink."""
    try:
        text = path.read_text()
    except (UnicodeDecodeError, OSError):
        return None
    if len(text) > 1024:
        return None
    if len(text.strip().split("\n")) != 1:
        return None
    m = FLATTENED_LINK.match(text)
    return m.group(1) if m else None


def link_content(target: Path, depth: int = 0) -> bytes:
    """Content of `target`, following a chain of flattened symlinks."""
    if depth > 40:
        raise SystemExit(f"flattened symlink chain too deep at {target}")
    nested = read_flattened_link(target)
    if nested:
        nxt = (target.parent / nested).resolve()
        if not nxt.exists():
            raise SystemExit(f"{target} points at missing target {nested}")
        return link_content(nxt, depth + 1)
    return target.read_bytes()


def materialize(src: Path, dest: Path) -> None:
    """
    Copy `src` to `dest`, replacing flattened symlinks with their target's
    content -- the same staging step src/build.ts performs before compiling.
    """
    dest.mkdir(parents=True, exist_ok=True)
    for entry in sorted(src.iterdir()):
        if entry.is_dir():
            if entry.name in ("answer", "node_modules"):
                continue
            materialize(entry, dest / entry.name)
            continue
        if not entry.is_file():
            continue
        link = read_flattened_link(entry)
        if link:
            target = (entry.parent / link).resolve()
            if not target.exists():
                raise SystemExit(f"{entry} points at missing target {link}")
            (dest / entry.name).write_bytes(link_content(target))
            continue
        shutil.copyfile(entry, dest / entry.name)


def normalize_flags(flags: list[str]) -> list[str]:
    """Mirror src/build.ts normalizeFlags() for clang."""
    out = ["-pedantic" if f == "--pedantic" else f for f in flags]
    if "-Werror" in out:
        out += ["-Wno-unused-command-line-argument", "-Wno-error=unused-but-set-variable"]
    return out


def slug(case: dict, index: int) -> str:
    if case.get("label"):
        s = re.sub(r"[^A-Za-z0-9]+", "_", case["label"]).strip("_")
        if s:
            return s
    args = case.get("args") or []
    if args:
        return re.sub(r"[^A-Za-z0-9]+", "_", "_".join(args)).strip("_")
    return f"case{index + 1}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("id")
    ap.add_argument("--config", help="config path (default configs/<id>.json)")
    ap.add_argument("--out", help="output directory (default configs/expected/<id>)")
    ap.add_argument("--case", action="append", default=[],
                    help="only (re)generate cases whose argv matches this string")
    ap.add_argument("--compiler", default="cc")
    ap.add_argument("--keep", action="store_true", help="keep the staging directory")
    ap.add_argument("--print-config", action="store_true",
                    help="print the tests array with expectedFile filled in")
    args = ap.parse_args()

    cfg_path = Path(args.config) if args.config else REPO / "data" / "configs" / f"{args.id}.json"
    cfg = json.loads(cfg_path.read_text())
    assignment = REPO / args.id
    if not assignment.is_dir():
        raise SystemExit(f"no assignment directory {assignment}")

    build = cfg.get("build") or {}
    sources = build.get("sources") or [cfg["source"]]
    driver = build.get("driver")
    flags = normalize_flags(list(build.get("flags") or []))
    out_dir = Path(args.out) if args.out else REPO / "data" / "configs" / "expected" / args.id
    out_dir.mkdir(parents=True, exist_ok=True)

    tmp = Path(tempfile.mkdtemp(prefix=f"genfix-{args.id}-"))
    stage = tmp / "src"
    materialize(assignment, stage)

    exe = tmp / "prog"
    cmd = [args.compiler, *flags, "-o", str(exe)]
    cmd += [str(stage / Path(s).name) for s in sources]
    if driver:
        drv = REPO / driver
        if not drv.exists():
            raise SystemExit(f"driver not found: {drv}")
        shutil.copyfile(drv, stage / "__driver.c")
        cmd.append(str(stage / "__driver.c"))
    res = subprocess.run(cmd, capture_output=True, text=True, cwd=str(stage))
    if res.returncode != 0:
        print("compile failed:\n" + res.stdout + res.stderr, file=sys.stderr)
        if args.keep:
            print(f"staging kept at {stage}", file=sys.stderr)
        return 1

    manifest = []
    wanted = args.case
    written = 0
    for i, case in enumerate(cfg.get("tests") or []):
        args_list = case.get("args") or []
        if wanted and " ".join(args_list) not in wanted:
            manifest.append({"args": args_list, "label": case.get("label"),
                             "expectedFile": case.get("expectedFile")})
            continue
        stdin_data = None
        if case.get("stdinFile"):
            stdin_data = (stage / case["stdinFile"]).read_bytes()
        elif case.get("stdin") is not None:
            stdin_data = case["stdin"].encode()
        r = subprocess.run([str(exe), *args_list], capture_output=True,
                           input=stdin_data, timeout=600, cwd=str(stage))
        if case.get("expected") is not None and not case.get("expectedFile"):
            # Inline expectation: check it instead of writing a fixture.
            ok = r.stdout.decode(errors="replace") == case["expected"]
            print(f"  {slug(case, i):<40} exit={r.returncode} inline-expected "
                  f"{'OK' if ok else 'MISMATCH'}")
            if not ok:
                print("    config expected:\n" + repr(case["expected"]))
                print("    program printed:\n" + repr(r.stdout.decode(errors='replace')))
            manifest.append({"args": args_list, "label": case.get("label"),
                             "inline": "ok" if ok else "MISMATCH",
                             "stderr": r.stderr.decode(errors="replace")[:400]})
            written += 1
            continue
        name = case.get("expectedFile") or f"expected/{args.id}/{slug(case, i)}.txt"
        dest = REPO / "data" / "configs" / name if not Path(name).is_absolute() else Path(name)
        dest = dest if dest.suffix == ".txt" else Path(str(dest) + ".txt")
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(r.stdout)
        rel = dest.relative_to(REPO / "data" / "configs")
        manifest.append({"args": args_list, "label": case.get("label"),
                         "expectedFile": str(rel), "exit": r.returncode,
                         "stderr": r.stderr.decode(errors="replace")[:400]})
        written += 1
        print(f"  {slug(case, i):<40} exit={r.returncode} -> {rel}")

    print(f"\nwrote {written} fixture(s) for {args.id}")
    if args.print_config:
        print(json.dumps(manifest, indent=2))
    if args.keep:
        print(f"staging kept at {stage}")
    else:
        shutil.rmtree(tmp, ignore_errors=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
