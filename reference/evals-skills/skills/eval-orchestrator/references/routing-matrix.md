# Routing Matrix

Read this file before deciding which workflow path to run.

## Friendly Alias Map

| User phrasing | Canonical skill |
| --- | --- |
| build / review / interface | `build-review-interface` |
| error analysis | `error-analysis` |
| eval / audit | `eval-audit` |
| evaluation / rag | `evaluate-rag` |
| generate synthetic data | `generate-synthetic-data` |
| skill / audit | `skill-audit` |
| validate evaluator | `validate-evaluator` |
| write judge prompt | `write-judge-prompt` |
| autoresearch | `autoresearch` |

## Mode Selection

Pick exactly one mode:

- `project`
  Use for product, pipeline, or RAG eval setup and improvement.
- `skill-optimization`
  Use for improving a specific skill prompt with an eval harness plus autoresearch.

## Project Mode Prerequisites

Collect or infer:

- Whether eval artifacts already exist
- Whether traces exist and are representative
- Whether the system is RAG-based
- Whether the key criteria are objective or subjective
- Whether humans need a browser review interface
- Whether the user wants setup only or setup plus autoresearch

## Project Mode Routing

### Path A: Inherited or unclear eval stack

Use `eval-audit` first when the user already has traces, judges, dashboards, configs, or scripts and wants to understand what is broken or missing.

### Path B: No traces or sparse traces

Use `generate-synthetic-data` before `error-analysis` when real traces do not exist or are too thin to reveal failure patterns.

### Path C: Error analysis

Use `error-analysis` after traces exist. This is the required grounding step before judge design.

### Path D: Evaluator path choice

- Use `evaluate-rag` when the system is RAG-based and retrieval must be evaluated separately from generation.
- Use code-based checks when the criterion is objective: schema conformance, keyword presence, execution success, constraint checks.
- Use `write-judge-prompt` when the criterion requires interpretation and code cannot reliably decide.

### Path E: Judge validation

Use `validate-evaluator` whenever an LLM judge is introduced.

### Path F: Human review UI

Use `build-review-interface` when reviewers need to inspect traces in a browser rather than a spreadsheet or script.

### Path G: Optional autoresearch

Only use `autoresearch` after the eval harness exists and the handoff contract is complete.

## Skill-Optimization Mode Prerequisites

Collect or infer:

- Exact path to the target `SKILL.md`
- Whether the target skill already has references worth reading
- 3-5 test inputs
- 3-6 binary evals
- Whether any eval requires an LLM judge
- Runs per experiment, run interval, budget cap, and version name

## Skill-Optimization Routing

1. Run `skill-audit` on the target skill first.
2. Gather or refine the test inputs and binary evals.
3. Decide whether each eval is code-based or judge-based.
4. Use `validate-evaluator` if a judge is used.
5. Establish the baseline.
6. Hand off to `autoresearch`.

## Autoresearch Handoff Contract

The handoff is complete only when all fields below exist:

- `target_skill_path`
- `test_inputs`
- `binary_evals`
- `runs_per_experiment`
- `run_interval_seconds`
- `budget_cap` or `no_cap`
- `version_name`
- `evaluator_artifacts`

If any field is missing, stop and finish setup before invoking `autoresearch`.

## When Not To Use Each Branch

- Do not use `eval-audit` when there is no eval infrastructure yet.
- Do not use `write-judge-prompt` when code can score the criterion deterministically.
- Do not use `validate-evaluator` for purely code-based checks.
- Do not use `build-review-interface` before deciding what reviewers need to judge.
- Do not use `autoresearch` as the first step in a brand-new eval project.
