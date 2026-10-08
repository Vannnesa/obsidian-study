#!/usr/bin/env python3
"""
apply_verdicts.py -- stamp `successVerdict` into every config from the
historical grade.txt.

The verdict word (`PASSED` vs `A`) is a per-assignment property of the original
grader, not something derivable from the strategy: `08_testing` ended in `A`
while `09_testing2` — the same strategy — ended in `PASSED`. Rather than have
each config guess, this reads the observed value straight out of
`re/original-grade-txt/<id>.grade.txt` and writes it into the config.

Idempotent. Safe to re-run after adding configs.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ORIGINALS = REPO / "re" / "original-grade-txt"


def observed_verdict(assignment: str) -> str | None:
    f = ORIGINALS / f"{assignment}.grade.txt"
    if not f.exists():
        return None
    m = re.search(r"^Overall Grade: (\S+)\s*$", f.read_text(errors="replace"), re.M)
    return m.group(1) if m else None


def main() -> int:
    changed = 0
    skipped: list[str] = []
    for cfg_path in sorted((REPO / "data" / "configs").glob("*.json")):
        assignment = cfg_path.stem
        verdict = observed_verdict(assignment)
        if verdict is None:
            skipped.append(assignment)
            continue
        # Only PASSED / A are meaningful as a success verdict; a historical
        # FAILED would mean the reference solution itself did not pass.
        if verdict not in ("PASSED", "A"):
            skipped.append(f"{assignment} (historical verdict {verdict})")
            continue
        config = json.loads(cfg_path.read_text())
        if config.get("successVerdict") == verdict:
            continue
        config["successVerdict"] = verdict
        cfg_path.write_text(json.dumps(config, indent=2) + "\n")
        changed += 1
        print(f"  {assignment:<26} successVerdict = {verdict}")

    print(f"\n{changed} config(s) updated")
    if skipped:
        print(f"{len(skipped)} without an observed verdict: {', '.join(skipped)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
