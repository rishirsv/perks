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

if [[ "${status}" == "pass" ]]; then
  qa_json="${PROJECT_ROOT}/extracted/verification/${report_id}/qa/gates.json"
  if [[ ! -f "${qa_json}" ]]; then
    echo "Cannot mark pass: missing QA gate file at ${qa_json}"
    echo "Run scripts/qa_gates.py first."
    exit 1
  fi

  qa_status="$("${PYTHON_BIN}" -c 'import json,sys; print(json.load(open(sys.argv[1]))["status"])' "${qa_json}")"
  if [[ "${qa_status}" != "pass" ]]; then
    echo "Cannot mark pass: QA gate status is '${qa_status}', expected 'pass'."
    echo "Review ${qa_json} and resolve failing gates."
    exit 1
  fi
fi

"${PYTHON_BIN}" -m ts_report_writer.pipeline mark-reviewed \
  --report-id "${report_id}" \
  --reviewer "${reviewer}" \
  --status "${status}" \
  ${notes:+--notes "${notes}"}
