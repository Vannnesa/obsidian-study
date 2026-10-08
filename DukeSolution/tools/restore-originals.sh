#!/usr/bin/env bash
# Restore every assignment's grade.txt to the pristine 2024 artifact.
# Grading writes grade.txt in place, so this undoes any in-place test runs.
set -euo pipefail
cd "$(dirname "$0")/.."
n=0
for f in re/original-grade-txt/*.grade.txt; do
  id="$(basename "$f" .grade.txt)"
  [ -d "upstream/$id" ] || continue
  cp -p "$f" "upstream/$id/grade.txt"
  n=$((n+1))
done
echo "restored $n grade.txt files from re/original-grade-txt/"
