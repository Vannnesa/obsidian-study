#!/usr/bin/env python3
"""
verify.py -- grade every configured assignment in a scratch copy and compare
the produced grade.txt against the original 2024 artifact.

Nothing in the working tree is modified: each assignment is copied to a temp
directory and graded there with `--dir`.

    python3 tools/verify.py                # all configs that have a directory
    python3 tools/verify.py 05_squares ... # a subset
    python3 tools/verify.py --diff         # show the first differing lines

Exit status is non-zero if any assignment fails to reproduce its original
verdict.
"""

from __future__ import annotations

import argparse
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ORIGINALS = REPO / "re" / "original-grade-txt"


def original_verdict(assignment: str) -> str | None:
    f = ORIGINALS / f"{assignment}.grade.txt"
    if not f.exists():
        return None
    m = re.search(r"^Overall Grade: (\S+)\s*$", f.read_text(errors="replace"), re.M)
    return m.group(1) if m else None


def original_body(assignment: str) -> list[str] | None:
    f = ORIGINALS / f"{assignment}.grade.txt"
    if not f.exists():
        return None
    lines = f.read_text(errors="replace").split("\n")
    return lines[1:] if lines else lines


def configured_ids() -> list[str]:
    return sorted(p.stem for p in (REPO / "data" / "configs").glob("*.json"))


FLATTENED_LINK = re.compile(r"^\s*(\.\.?/[^\n]*?)\s*$")


def flattened_link(path: Path) -> str | None:
    """Capstone directories store git symlinks as a file holding a relative path."""
    try:
        text = path.read_text(errors="strict")
    except (UnicodeDecodeError, OSError):
        return None
    if len(text) > 1024 or len(text.strip().split("\n")) != 1:
        return None
    m = FLATTENED_LINK.match(text)
    return m.group(1) if m else None


def bring_link_targets(orig_dir: Path, copy_dir: Path) -> list[str]:
    """
    Copy in whatever the flattened symlinks point at.

    The capstone directories link across siblings (`c3prj2_eval/deck.c` ->
    `../c3prj1_deck/deck.c`), so a copy of the assignment alone cannot resolve
    them.  Follow every link, including links that point at other links, and
    copy the real file from the same relative position in the checkout.
    """
    added: list[str] = []
    for _ in range(200):
        progress = False
        for path in sorted(copy_dir.rglob("*")):
            if not path.is_file():
                continue
            link = flattened_link(path)
            if not link:
                continue
            dest = Path(os.path.normpath(path.parent / link))
            if dest.exists():
                continue
            rel = os.path.relpath(dest, copy_dir)
            source = Path(os.path.normpath(orig_dir / rel))
            if not source.exists():
                continue
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source, dest)
            added.append(rel)
            progress = True
        if not progress:
            break
    return added


def run_one(assignment: str, show_diff: bool) -> dict:
    src = REPO / "upstream" / assignment
    if not src.is_dir():
        return {"id": assignment, "status": "no-dir", "note": "assignment directory missing"}

    tmp = Path(tempfile.mkdtemp(prefix=f"verify-{assignment}-"))
    try:
        # Grade the copy from a directory named after the assignment inside the
        # scratch root, so that capstone links such as `../c3prj1_deck/deck.c`
        # resolve *inside* the scratch tree and everything is cleaned up.
        tmp = tmp / assignment
        shutil.copytree(src, tmp, dirs_exist_ok=True)
        bring_link_targets(src, tmp)
        # A stale grade.txt must not be mistaken for this run's output.
        (tmp / "grade.txt").unlink(missing_ok=True)
        (tmp / "answer").exists() and shutil.rmtree(tmp / "answer", ignore_errors=True)

        proc = subprocess.run(
            ["bun", str(REPO / "src" / "index.ts"),
             "--dir", str(tmp), "--id", assignment,
             "--no-answer", "--no-scaffold", "--quiet"],
            capture_output=True, text=True, cwd=str(REPO), timeout=900,
            env={**os.environ, "GRADE_PACKAGE": str(REPO)},
        )
        grade = tmp / "grade.txt"
        if not grade.exists():
            return {
                "id": assignment, "status": "no-output",
                "note": (proc.stderr or proc.stdout).strip().split("\n")[-1][:200],
            }
        body = grade.read_text(errors="replace").split("\n")
        verdict = None
        m = re.search(r"^Overall Grade: (\S+)\s*$", "\n".join(body), re.M)
        if m:
            verdict = m.group(1)

        want = original_verdict(assignment)
        result = {"id": assignment, "verdict": verdict, "original": want}

        # A config declaring itself ungradable here is an honest divergence from
        # the 2024 result, not a tool defect. Surface it distinctly.
        cfg_path = REPO / "data" / "configs" / f"{assignment}.json"
        if cfg_path.exists() and json.loads(cfg_path.read_text()).get("type") == "unsupported":
            result["status"] = "ungraded"
            return result

        if want is None:
            result["status"] = "unverified"  # no original artifact to compare against
        elif verdict == want:
            result["status"] = "match"
            mine = body[1:]
            theirs = original_body(assignment) or []
            if mine != theirs:
                # Same verdict but a different report: worth knowing about,
                # it usually means extra cases or a reordered checklist.
                only_mine = [l for l in mine if l not in theirs]
                only_theirs = [l for l in theirs if l not in mine]
                result["status"] = "match-verdict"
                result["extra_lines"] = len(only_mine)
                result["missing_lines"] = len(only_theirs)
                if show_diff:
                    result["diff_sample"] = (only_mine[:4], only_theirs[:4])
        else:
            result["status"] = "MISMATCH"
        return result
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--diff", action="store_true")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--markdown", action="store_true",
                    help="emit a Markdown coverage table for REVERSE_ENGINEERING.md")
    args = ap.parse_args()

    ids = args.ids or configured_ids()
    rows = []
    for i in ids:
        r = run_one(i, args.diff)
        rows.append(r)
        if not args.json:
            mark = {
                "match": "OK  ",
                "match-verdict": "OK~ ",
                "unverified": "?   ",
                "ungraded": "n/a ",
                "MISMATCH": "FAIL",
                "no-dir": "SKIP",
                "no-output": "FAIL",
            }.get(r["status"], "??  ")
            detail = r.get("verdict") or r.get("note", "")
            extra = ""
            if r["status"] == "match-verdict":
                extra = f"  (+{r.get('extra_lines',0)}/-{r.get('missing_lines',0)} lines vs original)"
            print(f"{mark} {r['id']:<26} {r['status']:<14} {detail}{extra}")
            if args.diff and r.get("diff_sample"):
                mine, theirs = r["diff_sample"]
                for l in mine:
                    print(f"        only mine : {l[:100]}")
                for l in theirs:
                    print(f"        only orig : {l[:100]}")

    if args.markdown:
        print()
        print("| assignment | strategy | 2024 verdict | reproduced | lines vs original |")
        print("|---|---|---|---|---|")
        for r in rows:
            cfg = REPO / "data" / "configs" / f"{r['id']}.json"
            kind = json.loads(cfg.read_text()).get("type", "?") if cfg.exists() else "?"
            status = {
                "match": "**exact**",
                "match-verdict": "verdict + wording",
                "unverified": "not verifiable",
                "ungraded": "not gradable here",
                "MISMATCH": "**MISMATCH**",
                "no-dir": "no directory",
                "no-output": "**no output**",
            }.get(r["status"], r["status"])
            delta = ""
            if r["status"] == "match-verdict":
                delta = f"+{r.get('extra_lines', 0)} / -{r.get('missing_lines', 0)}"
            elif r["status"] == "unverified":
                delta = "no 2024 artifact"
            print(f"| `{r['id']}` | `{kind}` | {r.get('original') or '—'} | {status} | {delta} |")

    if args.json:
        print(json.dumps(rows, indent=2))

    bad = [r for r in rows if r["status"] in ("MISMATCH", "no-output")]
    ungraded = [r for r in rows if r["status"] == "ungraded"]
    print()
    print(f"{len(rows)} assignment(s): "
          f"{sum(1 for r in rows if r['status'].startswith('match'))} reproduced, "
          f"{len(ungraded)} declared ungradable here, "
          f"{sum(1 for r in rows if r['status']=='unverified')} without an original artifact, "
          f"{len(bad)} failing")
    return 1 if bad else 0


if __name__ == "__main__":
    raise SystemExit(main())
