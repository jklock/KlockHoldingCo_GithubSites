#!/usr/bin/env bash

# Prepares the site for local review.
#
#   1. converts new, changed, or removed originals in photos-originals/ into the
#      optimized WebP assets under src/assets/
#   2. stops the managed Astro dev server
#   3. starts a strict local preview at http://127.0.0.1:4321/
#
# Review the site there, then publish it with ./scripts/updatesite.sh

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_DIR"

npm run photos:prepare

./node_modules/.bin/astro dev stop >/dev/null 2>&1 || true

if lsof -nP -iTCP:4321 -sTCP:LISTEN >/dev/null 2>&1; then
  echo "Port 4321 is in use by a server this script cannot stop. Stop that server, then run ./scripts/prepare.sh again." >&2
  exit 1
fi

echo "Photos prepared. Starting the local site at http://127.0.0.1:4321/"
echo "Review your changes there, then publish with ./scripts/updatesite.sh"
exec npm run dev -- --host 127.0.0.1 --port 4321 --strictPort
