#!/usr/bin/env bash
# Hands-on demo: a complete student run in a throwaway workspace.
#   ./tools/demo.sh              uses 00_hello  (fast, text file)
#   ./tools/demo.sh 05_squares   compiles + 147 cases
set -euo pipefail
PKG="$(cd "$(dirname "$0")/.." && pwd)"
export PATH="/opt/homebrew/bin:$PATH"
export GRADE_PACKAGE="$PKG"
ID="${1:-00_hello}"
WS="$(mktemp -d "${TMPDIR:-/tmp}/grade-ws-XXXXXX")"
trap 'rm -rf "$WS"' EXIT
cd "$PKG"

echo "══ 1. grade init — create a workspace OUTSIDE the package ══"
bun src/index.ts init "$WS" --id "$ID"

echo
echo "══ 2. Grade it untouched — you should FAIL ══"
cd "$WS/$ID" || { echo "init did not produce $ID/"; exit 1; }
bun "$PKG/src/index.ts" || true

echo
echo "══ 3. Write the solution ══"
test -d "$PKG/data/reference/$ID" && cp "$PKG/data/reference/$ID"/* . || true
echo "(copied the packaged reference in — that is what you would type yourself)"

echo
echo "══ 4. Grade again ══"
bun "$PKG/src/index.ts"

echo
echo "══ 5. What you got ══"
echo "-- grade.txt --"; head -6 grade.txt
echo "-- answer/ --"; find answer -type f | sed 's|^|   |'
echo "-- diff.txt --"; head -6 answer/diff.txt

echo
echo "══ 6. Progress ══"
cd "$WS" && bun "$PKG/src/index.ts" status | tail -3
