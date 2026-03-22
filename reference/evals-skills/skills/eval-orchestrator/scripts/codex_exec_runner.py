#!/usr/bin/env python3
"""Config-first runner for eval orchestration and autoresearch via `codex exec`."""

from __future__ import annotations

import argparse
import ast
import os
import shlex
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Any


SCRIPT_DIR = Path(__file__).resolve().parent
SKILL_DIR = SCRIPT_DIR.parent
AUTORESEARCH_DIR = SKILL_DIR.parent / "autoresearch"
DEFAULT_CONFIG: dict[str, Any] = {
    "workflow": {
        "mode": "project",
        "working_root": None,
        "run_root": ".codex-eval-runs",
        "run_autoresearch": False,
    },
    "inputs": {
        "target_skill": None,
        "test_inputs": [],
        "binary_evals": [],
        "context_notes": [],
        "evaluator_artifacts": [],
        "has_traces": True,
        "has_inherited_eval_stack": False,
        "is_rag": False,
        "human_review_needed": False,
    },
    "autoresearch": {
        "runs_per_experiment": 5,
        "run_interval_seconds": 120,
        "budget_cap": None,
        "version_name": None,
    },
    "codex": {
        "model": None,
        "reasoning_effort": None,
        "profile": None,
        "extra_config": [],
    },
}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Run the eval orchestrator through codex exec with a config file plus CLI overrides."
    )
    parser.add_argument("--config", help="Path to a TOML config file.")
    parser.add_argument("--mode", choices=["project", "skill-optimization"])
    parser.add_argument("--target-skill", help="Path to the target SKILL.md.")
    parser.add_argument("--model", help="Codex model override.")
    parser.add_argument("--reasoning-effort", help="Codex model reasoning effort override.")
    parser.add_argument("--profile", help="Codex profile override.")
    parser.add_argument("--runs-per-experiment", type=int, help="Autoresearch runs per experiment.")
    parser.add_argument("--run-interval-seconds", type=int, help="Autoresearch interval between experiments.")
    parser.add_argument("--budget-cap", type=int, help="Autoresearch budget cap.")
    parser.add_argument("--version-name", help="Name for the optimized skill copy.")
    parser.add_argument(
        "--codex-config",
        action="append",
        default=[],
        metavar="KEY=VALUE",
        help="Additional native codex config override. Repeat for multiple values.",
    )
    parser.add_argument("--dry-run", action="store_true", help="Print the generated command and prompt without executing.")
    return parser.parse_args()


def deep_copy(value: Any) -> Any:
    if isinstance(value, dict):
        return {key: deep_copy(item) for key, item in value.items()}
    if isinstance(value, list):
        return [deep_copy(item) for item in value]
    return value


def deep_merge(base: dict[str, Any], override: dict[str, Any]) -> dict[str, Any]:
    merged = deep_copy(base)
    for key, value in override.items():
        if isinstance(value, dict) and isinstance(merged.get(key), dict):
            merged[key] = deep_merge(merged[key], value)
        else:
            merged[key] = deep_copy(value)
    return merged


def load_config(config_path: Path | None) -> dict[str, Any]:
    if config_path is None:
        return deep_copy(DEFAULT_CONFIG)
    loaded = parse_toml_config(config_path.read_text(encoding="utf-8"))
    return deep_merge(DEFAULT_CONFIG, loaded)


def parse_toml_config(text: str) -> dict[str, Any]:
    config: dict[str, Any] = {}
    current_table: dict[str, Any] | None = None

    lines = text.splitlines()
    i = 0
    while i < len(lines):
        raw = lines[i]
        stripped = raw.strip()
        i += 1
        if not stripped or stripped.startswith("#"):
            continue

        if stripped.startswith("[[") and stripped.endswith("]]"):
            path = stripped[2:-2].strip().split(".")
            parent = ensure_table(config, path[:-1])
            bucket = parent.setdefault(path[-1], [])
            if not isinstance(bucket, list):
                raise ValueError(f"Expected list for array-of-tables: {'.'.join(path)}")
            entry: dict[str, Any] = {}
            bucket.append(entry)
            current_table = entry
            continue

        if stripped.startswith("[") and stripped.endswith("]"):
            path = stripped[1:-1].strip().split(".")
            current_table = ensure_table(config, path)
            continue

        if "=" not in stripped or current_table is None:
            raise ValueError(f"Unsupported TOML line: {raw}")

        key, value = stripped.split("=", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith("[") and not balanced_brackets(value):
            collected = [value]
            while i < len(lines):
                continuation = lines[i].strip()
                i += 1
                collected.append(continuation)
                if balanced_brackets("\n".join(collected)):
                    break
            value = "\n".join(collected)
        current_table[key] = parse_toml_value(value)

    return config


def ensure_table(config: dict[str, Any], path: list[str]) -> dict[str, Any]:
    cursor = config
    for part in path:
        child = cursor.setdefault(part, {})
        if not isinstance(child, dict):
            raise ValueError(f"Expected table for {part}")
        cursor = child
    return cursor


def balanced_brackets(value: str) -> bool:
    depth = 0
    in_string = False
    escaped = False
    for char in value:
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue
        if char == '"':
            in_string = True
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
    return depth == 0 and not in_string


def parse_toml_value(value: str) -> Any:
    value = value.strip()
    if value.startswith('"') and value.endswith('"'):
        return ast.literal_eval(value)
    if value in {"true", "false"}:
        return value == "true"
    if value.startswith("[") and value.endswith("]"):
        python_value = value.replace("true", "True").replace("false", "False")
        return ast.literal_eval(python_value)
    try:
        return int(value)
    except ValueError:
        return value


def resolve_path(value: str | None, base_dir: Path) -> str | None:
    if not value:
        return value
    path = Path(value).expanduser()
    if not path.is_absolute():
        path = (base_dir / path).resolve()
    return str(path)


def apply_overrides(config: dict[str, Any], args: argparse.Namespace, base_dir: Path) -> dict[str, Any]:
    if args.mode:
        config["workflow"]["mode"] = args.mode
    if args.target_skill:
        config["inputs"]["target_skill"] = args.target_skill
    if args.model:
        config["codex"]["model"] = args.model
    if args.reasoning_effort:
        config["codex"]["reasoning_effort"] = args.reasoning_effort
    if args.profile:
        config["codex"]["profile"] = args.profile
    if args.runs_per_experiment is not None:
        config["autoresearch"]["runs_per_experiment"] = args.runs_per_experiment
    if args.run_interval_seconds is not None:
        config["autoresearch"]["run_interval_seconds"] = args.run_interval_seconds
    if args.budget_cap is not None:
        config["autoresearch"]["budget_cap"] = args.budget_cap
    if args.version_name:
        config["autoresearch"]["version_name"] = args.version_name
    if args.codex_config:
        extras = list(config["codex"].get("extra_config", []))
        extras.extend(args.codex_config)
        config["codex"]["extra_config"] = extras

    working_root = resolve_path(config["workflow"].get("working_root"), base_dir)
    config["workflow"]["working_root"] = working_root
    run_root = config["workflow"].get("run_root")
    if run_root:
        run_root_path = Path(run_root).expanduser()
        if not run_root_path.is_absolute():
            anchor = Path(working_root) if working_root else base_dir
            run_root_path = (anchor / run_root_path).resolve()
        config["workflow"]["run_root"] = str(run_root_path)
    config["inputs"]["target_skill"] = resolve_path(config["inputs"].get("target_skill"), base_dir)

    artifacts = []
    for item in config["inputs"].get("evaluator_artifacts", []):
        artifacts.append(resolve_path(item, base_dir) if isinstance(item, str) else item)
    config["inputs"]["evaluator_artifacts"] = artifacts

    mode = config["workflow"]["mode"]
    if mode == "skill-optimization" and not config["workflow"].get("run_autoresearch"):
        config["workflow"]["run_autoresearch"] = True
    return config


def slugify(value: str) -> str:
    clean = []
    for char in value.lower():
        if char.isalnum():
            clean.append(char)
        elif char in {"-", "_", " "}:
            clean.append("-")
    slug = "".join(clean).strip("-")
    while "--" in slug:
        slug = slug.replace("--", "-")
    return slug or "run"


def toml_literal(value: Any) -> str:
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, int):
        return str(value)
    if isinstance(value, float):
        return repr(value)
    if isinstance(value, str):
        escaped = value.replace("\\", "\\\\").replace('"', '\\"')
        return f'"{escaped}"'
    if isinstance(value, list):
        return "[{}]".format(", ".join(toml_literal(item) for item in value))
    raise TypeError(f"Unsupported TOML literal: {type(value)!r}")


def format_table(lines: list[str], prefix: str, data: dict[str, Any]) -> None:
    lines.append(f"[{prefix}]")
    for key, value in data.items():
        if value is None:
            continue
        if isinstance(value, dict):
            continue
        if isinstance(value, list) and value and all(isinstance(item, dict) for item in value):
            continue
        lines.append(f"{key} = {toml_literal(value)}")
    lines.append("")


def format_toml(config: dict[str, Any]) -> str:
    lines: list[str] = []
    for table_name in ["workflow", "inputs", "autoresearch", "codex"]:
        format_table(lines, table_name, config[table_name])
        if table_name == "inputs":
            for item in config["inputs"].get("binary_evals", []):
                lines.append("[[inputs.binary_evals]]")
                for key, value in item.items():
                    if value is None:
                        continue
                    lines.append(f"{key} = {toml_literal(value)}")
                lines.append("")
    return "\n".join(lines).strip() + "\n"


def build_prompt(config: dict[str, Any], run_dir: Path) -> str:
    mode = config["workflow"]["mode"]
    target_skill = config["inputs"].get("target_skill") or "(missing)"
    run_autoresearch = config["workflow"].get("run_autoresearch", False)
    read_paths = [
        str(SKILL_DIR / "SKILL.md"),
        str(SKILL_DIR / "references" / "routing-matrix.md"),
    ]
    if run_autoresearch or mode == "skill-optimization":
        read_paths.append(str(AUTORESEARCH_DIR / "SKILL.md"))
    if config["inputs"].get("target_skill"):
        read_paths.append(str(Path(config["inputs"]["target_skill"])))

    instructions = [
        "# Eval Workflow Orchestrator Run",
        "",
        "Read these files first:",
    ]
    instructions.extend(f"- `{path}`" for path in read_paths)
    instructions.extend(
        [
            "",
            "Follow the local skill files exactly.",
            f"- Force the workflow mode to `{mode}`.",
            "- Use the fixed routing sequence from the orchestrator instead of inventing a new order.",
            "- Treat the resolved config below as already-confirmed user input.",
            "- Do not ask for any field that is already present in the resolved config.",
            "- If a required field is still missing, stop and report exactly which field is missing.",
        ]
    )
    if run_autoresearch:
        instructions.extend(
            [
                "- Continue into `autoresearch` once the handoff contract is complete.",
                "- Preserve the standard autoresearch artifact names and folder layout.",
                "- Do not overwrite the original target SKILL.md.",
            ]
        )
    else:
        instructions.append("- Stop after the setup walkthrough and explicit handoff summary. Do not start autoresearch.")
    instructions.extend(
        [
            f"- Put command-line artifacts in `{run_dir}` when you need a stable reference for this run.",
            f"- The target skill for this run is `{target_skill}`.",
            "",
            "Resolved config:",
            "```toml",
            format_toml(config).rstrip(),
            "```",
        ]
    )
    return "\n".join(instructions) + "\n"


def ensure_codex_available() -> None:
    if shutil.which("codex") is None:
        raise SystemExit("`codex` was not found on PATH. Install or log in to Codex before using this runner.")


def build_run_dir(config: dict[str, Any]) -> Path:
    run_root = Path(config["workflow"]["run_root"] or ".codex-eval-runs")
    run_root.mkdir(parents=True, exist_ok=True)
    target = config["inputs"].get("target_skill")
    skill_part = slugify(Path(target).parent.name) if target else "no-target"
    stamp = datetime.now().astimezone().strftime("%Y%m%d-%H%M%S")
    run_dir = run_root / f"{stamp}-{slugify(config['workflow']['mode'])}-{skill_part}"
    run_dir.mkdir(parents=True, exist_ok=False)
    return run_dir


def build_command(config: dict[str, Any], run_dir: Path) -> list[str]:
    working_root = config["workflow"].get("working_root") or os.getcwd()
    last_message = run_dir / "final-message.txt"
    command = [
        "codex",
        "exec",
        "-C",
        str(working_root),
        "--color",
        "never",
        "-o",
        str(last_message),
    ]
    if not is_git_repo(Path(working_root)):
        command.append("--skip-git-repo-check")
    model = config["codex"].get("model")
    if model:
        command.extend(["-m", str(model)])
    profile = config["codex"].get("profile")
    if profile:
        command.extend(["-p", str(profile)])
    effort = config["codex"].get("reasoning_effort")
    if effort:
        command.extend(["-c", f'model_reasoning_effort="{effort}"'])
    for item in config["codex"].get("extra_config", []):
        command.extend(["-c", str(item)])
    command.append("-")
    return command


def is_git_repo(path: Path) -> bool:
    result = subprocess.run(
        ["git", "-C", str(path), "rev-parse", "--show-toplevel"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        check=False,
    )
    return result.returncode == 0


def write_run_bundle(config: dict[str, Any], run_dir: Path, command: list[str], prompt: str) -> None:
    (run_dir / "resolved-config.toml").write_text(format_toml(config), encoding="utf-8")
    (run_dir / "prompt.md").write_text(prompt, encoding="utf-8")
    prompt_path = run_dir / "prompt.md"
    command_text = (
        "#!/bin/sh\nset -e\n"
        + " ".join(shlex.quote(part) for part in command[:-1])
        + " - < "
        + shlex.quote(str(prompt_path))
        + "\n"
    )
    command_file = run_dir / "command.sh"
    command_file.write_text(command_text, encoding="utf-8")
    command_file.chmod(0o755)


def expected_autoresearch_dir(config: dict[str, Any]) -> Path | None:
    target = config["inputs"].get("target_skill")
    if not target:
        return None
    skill_dir = Path(target).resolve().parent
    return skill_dir / f"autoresearch-{skill_dir.name}"


def link_output(src: Path, dst: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    if dst.exists() or dst.is_symlink():
        dst.unlink()
    try:
        dst.symlink_to(src)
    except OSError:
        shutil.copy2(src, dst)


def link_artifacts(config: dict[str, Any], run_dir: Path) -> None:
    output_dir = expected_autoresearch_dir(config)
    if output_dir is None or not output_dir.exists():
        return
    artifacts_dir = run_dir / "artifacts"
    for name in ["results.tsv", "results.json", "changelog.md", "SKILL.md.baseline", "dashboard.html"]:
        candidate = output_dir / name
        if candidate.exists():
            link_output(candidate, artifacts_dir / name)
    version_name = config["autoresearch"].get("version_name")
    if version_name:
        candidate = output_dir / f"{version_name}.md"
        if candidate.exists():
            link_output(candidate, artifacts_dir / candidate.name)


def run_command(command: list[str], prompt_path: Path, log_path: Path) -> int:
    with prompt_path.open("r", encoding="utf-8") as stdin_handle, log_path.open("w", encoding="utf-8") as log_handle:
        process = subprocess.Popen(
            command,
            stdin=stdin_handle,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
        )
        assert process.stdout is not None
        for line in process.stdout:
            sys.stdout.write(line)
            log_handle.write(line)
        return process.wait()


def main() -> int:
    args = parse_args()
    config_path = Path(args.config).expanduser().resolve() if args.config else None
    base_dir = config_path.parent if config_path else Path.cwd()
    config = load_config(config_path)
    config = apply_overrides(config, args, base_dir)

    ensure_codex_available()
    run_dir = build_run_dir(config)
    prompt = build_prompt(config, run_dir)
    command = build_command(config, run_dir)
    write_run_bundle(config, run_dir, command, prompt)

    print(f"Run directory: {run_dir}")
    print(f"Resolved config: {run_dir / 'resolved-config.toml'}")
    print(f"Prompt bundle: {run_dir / 'prompt.md'}")
    print(f"Command file: {run_dir / 'command.sh'}")

    if args.dry_run:
        print("\nDry-run command:")
        print(" ".join(shlex.quote(part) for part in command[:-1]) + " - < " + shlex.quote(str(run_dir / "prompt.md")))
        return 0

    exit_code = run_command(command, run_dir / "prompt.md", run_dir / "codex-exec.log")
    link_artifacts(config, run_dir)
    if exit_code == 0:
        print(f"\nFinal message: {run_dir / 'final-message.txt'}")
        if (run_dir / "artifacts").exists():
            print(f"Linked artifacts: {run_dir / 'artifacts'}")
    return exit_code


if __name__ == "__main__":
    raise SystemExit(main())
