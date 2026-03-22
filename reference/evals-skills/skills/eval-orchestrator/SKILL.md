---
name: eval-orchestrator
description: "Orchestrate the full eval workflow before execution. Use when the user says: set up evals, walk me through the eval process, build an eval plan, run error analysis, generate synthetic data, write a judge prompt, validate an evaluator, build a review interface, audit evals, evaluate RAG, optimize a skill with autoresearch, or run eval orchestration with Codex exec. Supports two modes: project and skill-optimization. Do NOT use when the eval setup is already complete and you only need the mutation loop; use autoresearch for that."
---

# Eval Workflow Orchestrator

Route the user through the full eval workflow, then hand off to `autoresearch` only when the setup is complete.

Read [references/routing-matrix.md](references/routing-matrix.md) before making routing decisions. Read [references/config-template.toml](references/config-template.toml) only when the user wants to launch this flow with `codex exec`.

## Core Job

Take vague requests like "help me set up evals" or "optimize this skill" and turn them into a concrete workflow with the right downstream skills, the right order, and a complete handoff contract.

Use this skill as the top-level entrypoint for:

- `build`, `review`, or `interface` -> `build-review-interface`
- `error analysis` -> `error-analysis`
- `eval` or `audit` -> `eval-audit`
- `evaluation` or `rag` -> `evaluate-rag`
- `generate synthetic data` -> `generate-synthetic-data`
- `skill` or `audit` -> `skill-audit`
- `validate evaluator` -> `validate-evaluator`
- `write judge prompt` -> `write-judge-prompt`
- `autoresearch` -> execution phase only, after setup is complete

## Step 1: Classify The Engagement

Always classify the request into exactly one mode before doing anything else:

### `project` mode

Use when the user is setting up or repairing a broader eval workflow for a product, pipeline, or RAG system.

### `skill-optimization` mode

Use when the user wants to improve a skill prompt and needs the eval harness plus the autoresearch loop.

Do not mix the two. Pick one mode, follow its fixed path, and only switch if the user explicitly changes the goal.

## Step 2: Follow The Fixed Decision Tree

### `project` mode

Run this order:

1. Intake
2. Existing-artifact check
3. `eval-audit` if the stack is inherited, unclear, or already has eval infrastructure
4. `generate-synthetic-data` if traces are missing or too sparse
5. `error-analysis`
6. Choose evaluator path:
   - `evaluate-rag` for RAG retrieval/generation evaluation
   - code-based checks for objective criteria
   - `write-judge-prompt` for subjective criteria
7. `validate-evaluator` when an LLM judge is used
8. `build-review-interface` when human review UI is needed
9. Optional `autoresearch`, but only after the eval harness exists and the handoff contract is complete

### `skill-optimization` mode

Run this order:

1. Target skill intake
2. `skill-audit`
3. Gather test inputs and binary evals
4. Choose objective checks vs judge path
5. `validate-evaluator` if an LLM judge is used
6. Establish the baseline
7. Hand off to `autoresearch`

Do not jump straight into mutation. The whole point of this skill is to make the setup explicit first.

## Step 3: Produce The Autoresearch Handoff Contract

Before invoking `autoresearch`, produce all of the following:

- Exact target path to the skill `SKILL.md`
- 3-5 test inputs or scenarios
- 3-6 binary evals, each with question, pass condition, and fail condition
- Runs per experiment
- Run interval
- Budget cap, or explicit no-cap decision
- Version name for the optimized copy
- Any evaluator artifacts needed for scoring

If even one of those fields is missing, do not hand off yet.

## Step 4: Codex Exec Integration

When the user wants command-line execution, use `scripts/codex_exec_runner.py`.

The runner is config-first:

1. Read the TOML config
2. Apply CLI overrides
3. Materialize a run directory with the resolved config, generated prompt, command, and logs
4. Launch `codex exec` with native CLI flags for model, profile, and reasoning effort
5. Let Codex follow this skill and then `autoresearch` when the handoff contract is complete

Use the runner when the user says things like:

- "run this with Codex exec"
- "use my Codex subscription"
- "let me set model and thinking effort"
- "make this runnable from the command line"

## Output

This skill should leave the user with one of two outcomes:

- A completed eval setup with clear next steps and referenced downstream skills
- A complete autoresearch handoff and an execution path through `codex exec`

## Anti-Patterns

- Starting `autoresearch` before the eval harness exists
- Mixing `project` and `skill-optimization` into one vague workflow
- Using `write-judge-prompt` for checks that code can do deterministically
- Treating `eval-audit` as mandatory for every project instead of using it when the stack is inherited or unclear
- Asking the user to know the internal skill names before routing them
