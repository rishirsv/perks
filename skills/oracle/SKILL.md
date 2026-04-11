---
name: oracle
description: "Prepare an external-model bundle with `prompt.md` plus repo context artifacts for expert review or GPT-5.x Pro web planning. Use only when the user explicitly asks to package repo context for an external model."
---

# Oracle

Prepare an external-model bundle for either:
- a second-opinion review, diagnosis, or recommendation
- an `ultraplan` planning pass in ChatGPT on the web using GPT-5.x Pro

**Produces artifacts:**
- `prompt.md`: paste as the message
- `context.zip`: zipped repo slice with `MANIFEST.md`
- `context.txt` in `ultraplan` mode: a single web-friendly text bundle containing the manifest plus selected file contents

**Good fits:** debugging, code review, architecture validation, research, prompt critique, careful second opinions on risky changes, or high-confidence implementation planning.

## Activation Rule

Activate this skill only when the user explicitly asks to prepare, package, or upload a second-opinion bundle for an external model or reviewer.

Do not auto-activate for:
- ordinary mentions of Oracle the company or database
- generic requests for a second opinion with no request to package repo context
- ordinary mentions of ChatGPT Pro that are not asking for a repo-context bundle

## Bundle Modes

Choose one mode before assembling artifacts:

- `review` (default): package repo context for review, diagnosis, critique, or recommendation
- `ultraplan`: package repo context for ChatGPT on the web to study the codebase and produce a planning-only implementation plan

## Output Location

Write artifacts to `<project_root>/.agents/oracle/<feature-slug>/`.

## Prompting Principles

Prompt the downstream model like an operator, not a collaborator.

- Keep one clear task per bundle. Split unrelated asks into separate runs.
- Tell the model what "done" looks like instead of hoping it infers the goal.
- Use compact XML-style prompt blocks for stable structure.
- Prefer a better prompt contract over longer prose or "think harder" wording.
- Ground claims in the uploaded context artifact; if something is inferred, have the model label it.
- Do not invite questions. Tell the model to proceed with assumptions and list unknowns.
- In `ultraplan` mode, keep the bundle self-contained. Do not rely on web-side memory or tools beyond the uploaded context and pasted prompt.

Default prompt shape:
- `<task>`: the concrete job, relevant repo context, and expected end state
- `<structured_output_contract>` or `<compact_output_contract>`: exact answer shape and brevity
- `<default_follow_through_policy>`: what to do by default instead of asking routine questions
- `<verification_loop>` or `<completeness_contract>`: add for debugging, implementation, or high-risk reasoning
- `<grounding_rules>` or `<citation_rules>`: add for reviews, research, or anything that could drift into unsupported claims

Reusable blocks live in [reference/prompt-blocks.md](reference/prompt-blocks.md).
Common failure modes live in [reference/prompt-antipatterns.md](reference/prompt-antipatterns.md).
Ready-to-paste templates live in [reference/prompt-templates.md](reference/prompt-templates.md).
Custom assembly guidance lives in [reference/custom-prompt-guide.md](reference/custom-prompt-guide.md).

## Workflow

1. Understand the user's real question and choose `review` or `ultraplan`.
2. Reduce it to one clear downstream task.
3. Pick the downstream role.
4. Select the smallest file set that can support a grounded answer.
5. Choose the smallest prompt recipe that fits and add only the blocks that matter.
6. Write `prompt.md`.
7. Create the context artifact(s).
8. Tell the user exactly what to paste, upload, and verify locally.

## Instructions

### 0) Choose the bundle mode

Use `ultraplan` mode when the external model's job is to create a high-confidence implementation plan.

In `ultraplan` mode:
- planning only; do not ask the downstream model to write code
- require a final `## Approved Plan` section so the result is easy to paste back into local planning docs
- require phase outcomes and an implementation checklist
- tell the downstream model to proceed with assumptions and list unknowns instead of asking routine questions
- avoid fallback solutions unless the task explicitly requires them
- keep the bundle self-contained; do not rely on project memory, apps, or canvas-like features being available

### 1) Choose the downstream role

Pick one from `reference/prompt-templates.md#role-values` and use it as `{ROLE}` in `prompt.md`:

| Task Type | Role |
|-----------|------|
| Code review | a staff engineer doing a careful code review for correctness and maintainability |
| Debugging | a senior engineer debugging a tricky issue with limited context |
| Architecture | a principal engineer reviewing system design |
| Security | a security engineer threat-modeling and reviewing deployment hardening |
| Performance | a performance engineer identifying bottlenecks and optimization opportunities |
| Data/SQL | a database engineer reviewing correctness and performance |
| UI/UX | an expert UI/UX designer doing a rigorous visual and interaction review |
| Prompting | a prompt engineer improving Codex or GPT-5.4 prompts for reliability and clarity |
| Planning | a principal engineer creating a high-confidence implementation plan for a complex change in an unfamiliar codebase |

### 2) Select files conservatively

Include the **smallest** set that can support a confident answer:

1. Start with README, architecture notes, conventions, or docs that define expected behavior.
2. Include the primary feature folder or the smallest complete slice of code involved.
3. Add the concrete files mentioned by the user: errors, stack traces, endpoints, functions, configs, or prompt files.
4. Add nearby dependencies only when they change the answer: callers, callees, shared types, config, validation, error handling.
5. Do one final check: "Would missing this file materially change the expert's conclusion?" If not, leave it out.

Never include secrets such as `.env` files, credentials, tokens, or raw private keys. Redact if a value is required for understanding.

### 3) Write `prompt.md`

Start from the smallest template in [reference/prompt-templates.md](reference/prompt-templates.md). For `ultraplan` mode, start from the Ultraplan template. If none fit, assemble a custom prompt using [reference/custom-prompt-guide.md](reference/custom-prompt-guide.md).

Prompt-writing rules:
- Assume the model knows nothing beyond the uploaded context artifact.
- In `review` mode, tell it to read `context/MANIFEST.md` first.
- In `ultraplan` mode, tell it to read the manifest section at the top of `context.txt` first.
- Use XML blocks consistently so the prompt has stable internal structure.
- Add only the blocks that matter for this task; do not dump every possible rule into every prompt.
- Require file-path citations for concrete claims.
- Prefer explicit output contracts over vague instructions.
- Do not ask the downstream model to ask questions; have it proceed with assumptions and list unknowns.
- In `ultraplan` mode, require a plan that can be used directly in this repo's plan docs: phase outcomes, implementation checklist, and validation steps.

Block-selection defaults:
- Use `task` in every prompt.
- Add `structured_output_contract` when the response needs sections or numbered outputs.
- Add `compact_output_contract` when short prose is better than a rigid schema.
- Add `default_follow_through_policy` when the model should keep going without routine clarification.
- Add `verification_loop` for correctness-sensitive tasks.
- Add `completeness_contract` when the task should not stop at the first plausible answer.
- Add `grounding_rules` for code review, diagnosis, and repo-based reasoning.
- Add `citation_rules` for research or quoted source material.
- Add `action_safety` when asking for fix plans or change recommendations.
- Add `dig_deeper_nudge` for adversarial review or regression hunting.

### 4) Create context artifacts

Use the installed skill path so the workflow works from any local repo:

```bash
ORACLE_SKILL_DIR="${ORACLE_SKILL_DIR:-$HOME/.codex/skills/oracle}"
if [ ! -d "$ORACLE_SKILL_DIR" ]; then
  ORACLE_SKILL_DIR="$HOME/.claude/skills/oracle"
fi

REPO_ROOT="$(pwd)" "$ORACLE_SKILL_DIR/scripts/oracle.sh" \
  --out ".agents/oracle/<slug>/context.zip" \
  --text-out ".agents/oracle/<slug>/context.txt" \
  --task "Summary of what downstream model should do" \
  --entry "path/to/folder::Main feature folder"
```

Direct Python form:

```bash
REPO_ROOT="$(pwd)" python3 "$ORACLE_SKILL_DIR/scripts/build-context-zip.py" \
  --repo-root "$REPO_ROOT" \
  --out ".agents/oracle/<slug>/context.zip" \
  --text-out ".agents/oracle/<slug>/context.txt" \
  --task "Summary" \
  --constraint "Key constraint" \
  --verify "Command to validate locally" \
  --entry "path/to/folder::Reason" \
  --entry "path/to/file.ts::Reason"
```

Useful options:
- `--entries-from <file>`: read entries from a file with one `PATH::REASON` per line
- `--dry-run`: preview the manifest without writing the zip
- `--estimate-tokens`: estimate bundle size before hand-off
- `--text-out <file>`: also write a single text bundle for ChatGPT web uploads

### 5) Keep the bundle small

Run `--estimate-tokens` before hand-off when the bundle might be large.

If the estimate is big or the scope feels mushy:
- remove fixtures, snapshots, generated files, and unrelated tests
- narrow to the feature slice plus direct dependencies
- split unrelated questions into separate Oracle bundles instead of one overloaded prompt

Smaller, sharper bundles usually produce better answers than giant uploads with a vague task.

### 6) Hand-off

Tell the user:
- in `review` mode: upload `context.zip` and paste `prompt.md`
- in `ultraplan` mode:
  - open a fresh ChatGPT web chat or fresh project chat
  - select `GPT-5.x Pro` and the highest available thinking setting
  - upload `context.txt`
  - paste `prompt.md`
  - treat the result as a planning draft, then verify locally before implementation
- if using a project, still upload `context.txt` and paste the full prompt; do not assume project memory alone contains enough context
