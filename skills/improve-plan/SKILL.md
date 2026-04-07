---
name: improve-plan
description: "Strengthen an existing execution plan into a decision-complete, execution-ready replacement using repo evidence, current conventions, and targeted clarification only when the codebase cannot answer."
---

# Improve Plan

Take an existing plan as a seed draft and drive it to an execution-ready replacement.

Treat the input plan as a starting point, not as text to preserve. This is a second-pass planning workflow, not light copyediting.

Stay in planning mode:

- Do not implement code.
- Use read-only exploration first.
- Edit only the plan artifact when the task calls for saving the improved plan.

## Inputs

- A current in-progress plan the user is reviewing
- Or a saved exec plan path
- Or a feature slug that maps to a plan in `docs/exec-plans/active/` or `docs/exec-plans/completed/`
- Optional surrounding context from repo docs, code, prior decisions, or user feedback

## Plan selection

Resolve the target plan in this order:

1. If the user is actively discussing a current plan, improve that plan directly.
2. If the user gives a plan path, use it.
3. If the user gives a feature slug, resolve:
   - `docs/exec-plans/active/<feature-slug>-plan.md`
   - then `docs/exec-plans/completed/<feature-slug>-plan.md`
4. If no selector is given, use the most recently modified active exec plan.

If no target plan can be found, stop and say exactly what was searched.

## Core standards

- Prefer concrete codebase evidence over abstract design opinions.
- If a question can be answered by reading code, docs, tests, scripts, or adjacent implementations, explore instead of asking.
- Rewrite the plan as one clean replacement, not an addendum.
- Preserve completed checkboxes when improving an existing saved plan unless the plan is clearly wrong and needs a reset.
- Keep the improved plan aligned with repo conventions, naming, architecture, and validation habits.
- Remove filler, duplicated steps, and project-specific noise that does not help implementation.
- Prefer durable behavior-level guidance over brittle file-by-file micromanagement.
- Do not spend user attention on questions the repo can answer.
- Do not exit with a draft that still requires another agent to guess what the planner meant.

## Workflow

Drive the plan through these states in order:

1. `draft detected`
2. `gaps identified`
3. `repo evidence gathered`
4. `plan rewritten`
5. `ready`, `batch-ready`, or `blocked on one decision`

Do not skip a state just because the draft sounds polished.

### 1. Read and classify the draft

Read the current plan first and determine whether it is:

- a rough draft
- partially complete but under-specified
- almost implementation-ready
- structurally wrong and in need of a full rewrite

Then identify the main weaknesses:

- vague or generic work items
- contradictions or sequencing problems
- missing scope boundaries
- missing user-facing outcome
- missing validation path
- missing reuse guidance
- missing decisions, assumptions, or risks
- missing parallelization boundaries when the work is broad

### 2. Run a gap audit

Before rewriting, explicitly audit the draft against execution-readiness:

- what the plan says users get
- what is in scope and out of scope
- what implementation order is implied
- what files, modules, routes, commands, or contracts are named
- what existing code or patterns should be reused
- what verification is promised and whether the repo supports it
- what still depends on a user decision

If a branch is weak, walk it to the end before moving on. Do not hide missing thinking behind broad bullets like "implement the feature" or "update the UI."

### 3. Gather evidence from the repo

Inspect only the sources needed to close the gaps:

- `AGENTS.md`, `README.md`, architecture or workflow docs
- neighboring features or similar implementations
- tests, scripts, commands, and validation docs
- existing plan/spec templates or saved plans when they help with format

Update the plan as you learn. Do not wait until the end to reflect discoveries.

When the plan depends on unstable external guidance such as current library behavior, APIs, or best practices, research that only when needed and say that it was externally verified.

### 4. Apply critical feedback

Do not simply polish the draft. Challenge it.

Surface:

- hidden complexity
- risky assumptions
- missing failure modes
- weak validation
- over-broad scope
- premature splitting
- places where the plan sounds thorough but is not executable

Prefer a smaller, cleaner, more defensible plan over a bloated one. If the draft is trying to preserve every idea, narrow it to the recommended path.

### 5. Rewrite the plan

Produce a full replacement plan that another engineer or agent can execute cold.

Prefer this structure when the repo does not require another template:

- short `Summary`
- `Scope`
- `Phase Outcomes` with plain-English outcomes
- `Implementation Checklist` with checkbox hierarchy
- `Verification`
- `Decisions / Assumptions / Risks` when material
- `Reuse Notes` when existing code or patterns should be followed

When rewriting:

- make the summary shorter and clearer
- keep only the recommended approach, not a menu of alternatives
- turn vague bullets into concrete tasks and validations
- name real validation commands or manual flows when available
- name concrete files, modules, routes, docs, contracts, or commands where that specificity removes ambiguity
- point to existing code or utilities to reuse when they materially shape implementation
- keep one canonical plan instead of layered revisions

Do not optimize for sounding comprehensive. Optimize for reducing implementation ambiguity.

### 6. Decide execution shape

Classify the improved plan as one of:

- `ready for normal implementation`
- `better suited for batch / parallel execution`
- `still blocked on one user decision`

Only classify as batch-ready when:

- independent units can be defined cleanly
- shared verification can be reused across units
- the units do not require constant cross-edit coordination

Otherwise keep the plan as one implementation flow.

### 7. Ask only the smallest necessary question

Ask the user a question only when the unresolved item materially changes:

- user-facing behavior
- architecture
- scope
- implementation ordering
- validation strategy

If blocked, ask one focused question and explain exactly which part of the plan depends on it.

Do not ask for approval in plain text. If the surrounding workflow has a dedicated approval step, leave the plan in its strongest state and use that mechanism.

## What good output looks like

Your response should:

1. State which plan you improved.
2. Summarize the key gaps or contradictions you found.
3. Provide the improved plan as a full replacement.
4. State the readiness classification.
5. If blocked, ask the smallest possible follow-up question.

The improved plan should feel like a promoted artifact, not an edited note dump.

## Failure shields

- Do not append a loose notes section instead of rewriting the plan.
- Do not preserve bad structure just because it already exists.
- Do not ask the user questions the repo can answer.
- Do not leave validation generic when the repo exposes real commands or flows.
- Do not over-specify irrelevant details to create the illusion of rigor.
- Do not split work into parallel units unless the boundaries are real.
- Do not silently drop completed checkboxes from an existing saved plan.
- Do not stop at "better wording" if the underlying plan is still weak.
- Do not let a polished but underspecified draft pass as ready.

## Goal

Leave the user with a stronger canonical plan that is ready to implement without extra interpretation.
