#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
START_DIR="$(cd "${SCRIPT_DIR}/../.." && pwd)"

find_repo_root() {
  local current="$1"
  while true; do
    if [[ -f "$current/generator/scripts/check-slot-contract-sync.js" ]]; then
      printf '%s\n' "$current"
      return 0
    fi
    local parent
    parent="$(dirname "$current")"
    if [[ "$parent" == "$current" ]]; then
      return 1
    fi
    current="$parent"
  done
}

REPO_ROOT="$(find_repo_root "$START_DIR")" || {
  echo "Unable to find repo root with generator/scripts/check-slot-contract-sync.js" >&2
  exit 2
}

cd "$REPO_ROOT"
node generator/scripts/check-slot-contract-sync.js
