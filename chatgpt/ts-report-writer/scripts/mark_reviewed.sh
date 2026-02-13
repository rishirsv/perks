#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <report-id> <reviewer> <status> [notes]"
  echo "status: pass | needs_revision | blocked"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENV_PYTHON="${PROJECT_ROOT}/.venv/bin/python"
PYTHON_BIN="${VENV_PYTHON}"

if [[ ! -x "${PYTHON_BIN}" ]]; then
  PYTHON_BIN="$(command -v python3 || true)"
fi

if [[ -z "${PYTHON_BIN}" ]]; then
  echo "Python executable not found. Activate your venv or install dependencies."
  exit 1
fi

report_id="$1"
reviewer="$2"
status="$3"
notes="${4:-}"

"${PYTHON_BIN}" -m ts_report_writer.pipeline mark-reviewed \
  --report-id "${report_id}" \
  --reviewer "${reviewer}" \
  --status "${status}" \
  ${notes:+--notes "${notes}"}
