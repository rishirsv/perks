#!/usr/bin/env python3
"""Convenience wrapper that launches the orchestrator runner in skill-optimization mode."""

from __future__ import annotations

import os
import sys
from pathlib import Path


def main() -> None:
    orchestrator = Path(__file__).resolve().parents[2] / "eval-orchestrator" / "scripts" / "codex_exec_runner.py"
    args = sys.argv[1:]
    if "--mode" not in args:
        args = ["--mode", "skill-optimization", *args]
    os.execv(sys.executable, [sys.executable, str(orchestrator), *args])


if __name__ == "__main__":
    main()
