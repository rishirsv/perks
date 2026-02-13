#!/usr/bin/env bash
set -euo pipefail

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

"${PYTHON_BIN}" -m ts_report_writer.pipeline \
  preflight

"${PYTHON_BIN}" -m ts_report_writer.pipeline run \
  --reports-dir "${PROJECT_ROOT}/reports" \
  "$@"
