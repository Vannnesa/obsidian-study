#!/usr/bin/env python3
"""
gen_expected.py -- generate `configs/expected/<id>/` fixtures.

The original course graded by running a reference build once per test case and
comparing stdout. This script performs that same step at reverse-engineering
time: it builds the reference sources (plus a reconstructed driver) and stores
each case's output as a fixture.

Storing fixtures rather than shipping the reference at grade time means the
grader never needs the answer key, and a student cannot accidentally (or
deliberately) change what "correct" means.

Case sources
------------
--args-file      one case per line, arguments separated by whitespace
--grade-txt      a historical grade.txt; cases are read from lines matching
                 --prefix (default "Testing ./"), exactly as the original
                 grader printed them
--cases          literal arguments, repeatable

Usage
-----
    python3 tools/re/gen_expected.py \
        --id 05_squares \
        --source 05_squares/squares.c \
        --driver drivers/05_squares/squares_test.c \
        --grade-txt 05_squares/grade.txt \
        --verify 3_5_8_2:05_squares/ans_3_5_8_2.txt \
        --verify 5_2_4_6:05_squares/ans_5_2_4_6.txt
"""

from __future__ import annotations

import argparse
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]


def parse_cases(args) -> list[list[str]]:
    cases: list[list[str]] = []
    if args.args_file:
        for line in Path(args.args_file).read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            cases.append(line.split())
    if args.grade_txt:
        prefix = args.prefix
        for raw in Path(args.grade_txt).read_text(errors="replace").splitlines():
            if not raw.startswith(prefix):
                continue
            rest = raw[len(prefix):].strip()
            # Strip the program name when the prefix ends at "./"
            if prefix.endswith("./"):
                parts = rest.split()
                parts = parts[1:] if parts else []
            else:
                parts = rest.split()
            if parts:
                cases.append(parts)
    for c in args.cases or []:
        cases.append(c.split())
    # de-duplicate, preserving order
    seen = set()
    out = []
    for c in cases:
        key = tuple(c)
        if key in seen:
            continue
        seen.add(key)
        out.append(c)
    return out


def name_for(case: list[str], fmt: str) -> str:
    if fmt == "join-underscore":
        return "_".join(case)
    if fmt == "join-space":
        return " ".join(case)
    return "-".join(case)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--id", required=True)
    ap.add_argument("--source", action="append", default=[], help="reference source, repeatable")
    ap.add_argument("--driver", help="reconstructed driver C file")
    ap.add_argument("--link", action="append", default=[], help="extra object/archive to link")
    ap.add_argument("--flags", default="-Wall -std=gnu99")
    ap.add_argument("--args-file")
    ap.add_argument("--grade-txt")
    ap.add_argument("--prefix", default="Testing ./")
    ap.add_argument("--cases", action="append")
    ap.add_argument("--out")
    ap.add_argument("--name-format", default="join-underscore",
                    choices=["join-underscore", "join-space", "join-dash"])
    ap.add_argument("--verify", action="append", default=[],
                    help="NAME:PATH -- assert generated output equals PATH")
    ap.add_argument("--stdin-dir", help="directory holding per-case stdin files")
    ap.add_argument("--limit", type=int, default=0, help="keep at most N cases (0 = all)")
    ap.add_argument("--json", action="store_true", help="emit the config `tests` array")
    args = ap.parse_args()

    cases = parse_cases(args)
    if not cases:
        print("no cases found", file=sys.stderr)
        return 1
    if args.limit:
        cases = cases[: args.limit]

    outdir = Path(args.out) if args.out else REPO / "data" / "configs" / "expected" / args.id
    outdir.mkdir(parents=True, exist_ok=True)

    tmp = Path(tempfile.mkdtemp(prefix="genexp-"))
    try:
        exe = tmp / "prog"
        cmd = ["cc", *args.flags.split(), "-o", str(exe)]
        cmd += [str(REPO / s) for s in args.source]
        if args.driver:
            cmd.append(str(REPO / args.driver))
        cmd += [str(REPO / l) for l in args.link]
        res = subprocess.run(cmd, capture_output=True, text=True)
        if res.returncode != 0:
            print("compile failed:\n" + res.stderr, file=sys.stderr)
            return 1

        manifest = []
        written = 0
        for case in cases:
            stdin_data = None
            if args.stdin_dir:
                cand = Path(args.stdin_dir) / name_for(case, args.name_format)
                if cand.exists():
                    stdin_data = cand.read_bytes()
            r = subprocess.run(
                [str(exe), *case],
                capture_output=True,
                input=stdin_data,
                timeout=30,
                cwd=str(REPO),
            )
            name = name_for(case, args.name_format)
            dest = outdir / f"{name}.txt"
            dest.write_bytes(r.stdout)
            manifest.append({"args": case, "expectedFile": f"expected/{args.id}/{name}.txt"})
            written += 1

        print(f"wrote {written} fixtures to {outdir.relative_to(REPO)}")

        ok = True
        for spec in args.verify:
            name, path = spec.split(":", 1)
            generated = (outdir / f"{name}.txt").read_bytes()
            reference = (REPO / path).read_bytes()
            if generated == reference:
                print(f"  VERIFIED {name} == {path}")
            else:
                ok = False
                print(f"  MISMATCH {name} != {path}", file=sys.stderr)
        if args.json:
            import json
            print(json.dumps(manifest, indent=2))
        return 0 if ok else 1
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    raise SystemExit(main())
