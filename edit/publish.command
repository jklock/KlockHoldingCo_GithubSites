#!/bin/zsh

set -euo pipefail

SCRIPT_DIR="${0:A:h}"
REPO_DIR="${SCRIPT_DIR:h}"
CHECK_ONLY=false

if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=true
fi

fail() {
  print -u2 "ERROR: $1"
  exit 1
}

step() {
  print "\n==> $1"
}

trap 'print -u2 "\nPublish stopped. Fix the error above, then run this script again."' ZERR

cd "$REPO_DIR"

step "Checking required tools"
command -v git >/dev/null 2>&1 || fail "Git is not installed."
command -v curl >/dev/null 2>&1 || fail "curl is not installed."
command -v tar >/dev/null 2>&1 || fail "tar is not installed."
command -v shasum >/dev/null 2>&1 || fail "shasum is not installed."

NODE_VERSION="$(tr -d '[:space:]' < "$REPO_DIR/.node-version")"
case "$(uname -s)" in
  Darwin) NODE_OS=darwin ;;
  Linux) NODE_OS=linux ;;
  *) fail "This publishing script supports macOS and Linux." ;;
esac

case "$(uname -m)" in
  arm64|aarch64) NODE_ARCH=arm64 ;;
  x86_64) NODE_ARCH=x64 ;;
  *) fail "This computer's processor architecture is not supported." ;;
esac

NODE_PACKAGE="node-v${NODE_VERSION}-${NODE_OS}-${NODE_ARCH}"
NODE_ROOT="$REPO_DIR/.site-tools"
NODE_DIR="$NODE_ROOT/$NODE_PACKAGE"

if [[ ! -x "$NODE_DIR/bin/node" ]]; then
  step "Downloading the website's pinned Node.js runtime"
  mkdir -p "$NODE_ROOT"
  NODE_ARCHIVE="$NODE_ROOT/${NODE_PACKAGE}.tar.gz"
  NODE_CHECKSUMS="$NODE_ROOT/SHASUMS256.txt"
  NODE_BASE_URL="https://nodejs.org/dist/v${NODE_VERSION}"

  curl --fail --location --retry 3 "$NODE_BASE_URL/${NODE_PACKAGE}.tar.gz" --output "$NODE_ARCHIVE"
  curl --fail --location --retry 3 "$NODE_BASE_URL/SHASUMS256.txt" --output "$NODE_CHECKSUMS"

  EXPECTED_SHA="$(awk -v file="${NODE_PACKAGE}.tar.gz" '$2 == file { print $1 }' "$NODE_CHECKSUMS")"
  ACTUAL_SHA="$(shasum -a 256 "$NODE_ARCHIVE" | awk '{ print $1 }')"
  [[ -n "$EXPECTED_SHA" && "$ACTUAL_SHA" == "$EXPECTED_SHA" ]] || fail "The downloaded Node.js checksum did not match."

  tar -xzf "$NODE_ARCHIVE" -C "$NODE_ROOT"
  rm -f "$NODE_ARCHIVE" "$NODE_CHECKSUMS"
fi

export PATH="$NODE_DIR/bin:$PATH"
command -v node >/dev/null 2>&1 || fail "The local Node.js runtime could not be prepared."
command -v npm >/dev/null 2>&1 || fail "The local npm runtime could not be prepared."
print "Using Node.js $(node --version) and npm $(npm --version)."

[[ "$(git branch --show-current)" == "main" ]] || fail "Switch this repository to the main branch first."
git remote get-url origin >/dev/null 2>&1 || fail "The GitHub origin remote is not configured."

step "Installing required website packages"
npm_config_engine_strict=true npm install --no-audit --no-fund

step "Preparing optimized website photos"
npm run photos:prepare

step "Validating the complete website"
npm test
npm run format:check
git diff --check

if $CHECK_ONLY; then
  print "\nChecks passed. No commit or push was performed."
  exit 0
fi

step "Preparing all site changes for GitHub"
git add -A

if git diff --cached --quiet; then
  print "\nNo changes were found. GitHub is already up to date."
  exit 0
fi

COMMIT_TIME="$(date '+%Y-%m-%d %H:%M')"
git commit -m "content: publish site edits ${COMMIT_TIME}"

step "Synchronizing with GitHub"
git pull --rebase origin main

step "Publishing to GitHub"
git push origin main

print "\nPublished successfully. GitHub Pages will deploy the validated update automatically."
print "Actions: https://github.com/jklock/KlockHoldingCo_GithubSites/actions"
