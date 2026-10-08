#!/usr/bin/env bash
# One-shot health check for the grade tool.
#
#   ./tools/check.sh          fast checks (~10s): tests + config validation
#   ./tools/check.sh --full   also re-grades all 42 assignments in scratch
#                             copies and diffs against the 2024 grade.txt (~2min)
#
# Nothing in the working tree is modified.
set -uo pipefail
cd "$(dirname "$0")/.."
export PATH="/opt/homebrew/bin:$PATH"
fail=0

echo "── 1/3  unit + end-to-end tests ─────────────────────────────"
bun test tests/ 2>&1 | tail -4 || fail=1

echo
echo "── 2/3  every config validates ──────────────────────────────"
bun run src/index.ts check 2>&1 | tail -3 || fail=1

echo
echo "── 3/3  reference corpus is intact ──────────────────────────"
bad=0
for f in re/original-grade-txt/*.grade.txt; do
  id="$(basename "$f" .grade.txt)"
  cmp -s "$f" "upstream/$id/grade.txt" || { echo "  CHANGED: upstream/$id/grade.txt"; bad=1; }
done
if [ "$bad" -eq 0 ]; then
  echo "  42/42 original grade.txt byte-identical"
else
  echo "  run ./tools/restore-originals.sh to restore them"
  fail=1
fi

if [ "${1:-}" = "--full" ]; then
  echo
  echo "── full: re-grading all 42 assignments vs the 2024 transcripts ──"
  python3 tools/verify.py || fail=1
fi

echo
[ "$fail" -eq 0 ] && echo "ALL CHECKS PASSED" || echo "SOMETHING FAILED"
exit "$fail"
