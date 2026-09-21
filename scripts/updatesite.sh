#!/usr/bin/env bash

# Publishes the Klock Holding Co. website to GitHub.
#
# This wrapper runs the full release pipeline in edit/publish.command, which:
#   1. prepares the pinned Node.js runtime and installs all packages
#   2. regenerates optimized photos and runs the complete validation suite
#   3. commits every change in the repository (git add -A)
#   4. synchronizes with GitHub and pushes main, deploying the live site
#
# Usage:
#   ./scripts/updatesite.sh           # validate, commit everything, and push
#   ./scripts/updatesite.sh --check   # validate only; nothing is committed

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(cd -- "$SCRIPT_DIR/.." && pwd)"
PUBLISHER="$REPO_DIR/edit/publish.command"

if [[ ! -x "$PUBLISHER" ]]; then
  echo "ERROR: could not find the publisher at $PUBLISHER" >&2
  echo "Move this script back inside the website repository and try again." >&2
  exit 1
fi

exec "$PUBLISHER" "$@"
