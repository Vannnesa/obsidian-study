#!/usr/bin/env python3
"""
snapshot_reference.py -- build `reference/<id>/`, the source-only answer key.

The completed working directories under the project root are the only copy of
the reference solution we have, and they also contain build artefacts
(`*.o`, linked executables, `vgcore.*`, `grade.txt`). This script copies just
the human-authored sources into `reference/<id>/` so that:

  * `answer/reference/` and `answer/diff.txt` have something to compare against;
  * the answer key survives a student deleting or mangling their own copy;
  * the snapshot stays small and reviewable.

Run from the project root.  Existing reference/<id>/ trees are replaced.
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]

# Copies only files a human would have written.
SOURCE_SUFFIXES = {".c", ".h", ".txt", ".sh", ".md", ".mk", ".py"}
ALWAYS = {"README", "Makefile", "makefile", "GNUmakefile"}

# Never copied: build products, grader output, crash dumps, editor debris.
NEVER_SUFFIXES = {".o", ".a", ".out", ".dSYM", ".dylib", ".so"}
NEVER_PREFIXES = ("vgcore.", "core.", ".")
NEVER_NAMES = {"grade.txt", ".DS_Store"}

# Executables that happen to have no suffix.
KNOWN_BINARIES = {
    "hello", "squares", "rectangle", "retirement", "test", "test-debug",
    "arrayMax", "maxSeq", "test-subseq", "numToBits", "rotate-matrix",
    "breaker", "breaker-debug", "rotateMatrix", "rotateMatrix-debug",
    "outname_test", "encrypt", "sortLines", "minesweeper", "kv_test",
    "counts_test", "count_values", "poker", "test-deck", "test-eval",
    "test_future_input", "game", "reverse", "test-power",
}


def keep(path: Path) -> bool:
    name = path.name
    if name in NEVER_NAMES or name in KNOWN_BINARIES:
        return False
    if name.startswith(NEVER_PREFIXES):
        return False
    if path.suffix in NEVER_SUFFIXES:
        return False
    if name in ALWAYS:
        return True
    return path.suffix in SOURCE_SUFFIXES


def is_skip_dir(name: str) -> bool:
    return name in {"answer", "node_modules", ".git"} or name.startswith(".")


def snapshot(assignment: Path, dest: Path) -> int:
    count = 0
    for entry in sorted(assignment.rglob("*")):
        if not entry.is_file():
            continue
        rel = entry.relative_to(assignment)
        if any(is_skip_dir(p) for p in rel.parts):
            continue
        if not keep(entry):
            continue
        target = dest / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(entry, target)
        count += 1
    return count


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("ids", nargs="*")
    ap.add_argument("--out", default=str(REPO / "data" / "reference"))
    args = ap.parse_args()

    out = Path(args.out)
    ids = args.ids or sorted(
        p.stem for p in (REPO / "data" / "configs").glob("*.json")
    )
    total = 0
    for i in ids:
        src = REPO / "upstream" / i
        if not src.is_dir():
            print(f"  skip {i}: no such directory")
            continue
        dest = out / i
        if dest.exists():
            shutil.rmtree(dest)
        n = snapshot(src, dest)
        total += n
        print(f"  {i:<26} {n:>3} files")
    print(f"\n{len(ids)} assignment(s), {total} files -> {out.relative_to(REPO)}/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
