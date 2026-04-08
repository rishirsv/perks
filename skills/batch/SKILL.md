---
name: batch
description: "Coordinate broad, parallelizable implementation work from a saved or in-chat plan by turning it into a durable execution plan, decomposing it into dependency-aware units and batches, spawning workers only for ready units, and serially tracking resumable progress through one canonical execution tracker. Use only when explicitly asked to batch large work that mixes parallel and sequential execution."
---

# Batch

Orchestrate a large change with one canonical exec plan that acts as both implementation plan and execution authority.

Use this skill after a formal plan already exists, or immediately after Plan mode produced a plan in chat that has not yet been saved to disk.

Do not use this skill for small or mostly linear work where one agent can execute the plan directly without coordination overhead.

## User Instruction

Use the user's current request as the instruction input.

Treat these as valid intake sources:

- the current in-chat plan from Plan mode
- a saved exec plan path
- a feature slug that maps to an exec plan
- a broad request or accepted backlog slice such as items from `WORK-TRACKER.md`

`WORK-TRACKER.md` is intake and prioritization memory. The exec plan is execution memory. Do not create a second parallel tracker by default.

## Core Model

Use one canonical execution artifact:

- `docs/exec-plans/active/<feature-slug>-plan.md`

That file must contain both:

- the implementation plan
- the live execution tracker for this batch run

Do not create a separate `progress.md` by default.

Do not let parallel workers edit the canonical exec plan. The coordinator owns that file and updates it serially.

## Phase 1: Resolve, Save, And Batch The Plan

Call the `update_plan` tool now to enter planning workflow, then:

1. Resolve the source plan.
   - If the conversation already contains a current formal plan from Plan mode, treat that plan as the source of truth.
   - Otherwise, if the user gives a plan path, use it.
   - Otherwise, if the user gives a feature slug, resolve `docs/exec-plans/active/<feature-slug>-plan.md`, then `docs/exec-plans/completed/<feature-slug>-plan.md` only to inspect history if needed.
   - Otherwise, if the user gives a broad request or backlog slice, create a batch-ready execution plan first and save it to the canonical active-plan path.

2. Save the plan to disk before batching when it is not already saved.
   - Write to `docs/exec-plans/active/<feature-slug>-plan.md`.
   - If the plan exists only in chat, derive the feature slug from the plan title or other clear plan context when possible.
   - If the file already exists, update it in place instead of creating a parallel file.
   - Preserve completed checkboxes and any existing execution-tracker state unless the plan is clearly being reset.

3. Research the scope against the repo.
   - Launch one or more Explore agents to find the files, patterns, commands, and validation paths the work touches.
   - Understand which parts of the plan can be done independently and which parts must be sequenced.

4. Convert the implementation plan into execution units.
   - Break the work into self-contained units that are atomic, mergeable, and concrete enough for one worker to own.
   - Prefer 5-30 units depending on scope.
   - Each unit must include:
     - stable unit id
     - title
     - scope
     - file or directory anchors when discoverable
     - acceptance criteria
     - validation path
     - direct dependencies

5. Build the dependency graph and execution batches.
   - Explicitly identify which units are sequential prerequisites and which can run in parallel.
   - Group units into batches or waves where every unit in a batch is safe to run alongside the others.
   - Do not place a unit in a batch if it depends on another unit in that same batch.

6. Determine the verification recipe.
   - Figure out how workers can verify their unit end-to-end, not just with isolated unit tests.
   - Prefer an existing integration, e2e, browser, CLI, or service boot path when available.
   - If no reasonable e2e path exists, say so explicitly and fall back to the thinnest meaningful validation.

7. Write the batch-ready exec plan.
   - Update the same canonical exec plan file with the execution sections defined below.
   - Present the plan for approval before spawning workers.

## Phase 2: Spawn Ready Workers

After the user approves the batched plan:

1. Read the canonical exec plan and treat its `## Execution Tracker` as the execution authority.
2. Identify all `ready` units whose dependencies are already `completed`.
3. Spawn one worker per ready unit in parallel using `spawn_agent`.
4. Give each worker a fully self-contained prompt with:
   - the overall goal
   - the exec plan path
   - the exact unit it owns
   - the unit's dependencies and acceptance criteria
   - validation expectations
   - a rule that the worker must not edit the shared exec plan
5. Only the coordinator updates the canonical exec plan.

Use `agent_type: "worker"` unless a more specific worker type fits.

## Worker Prompt Template

Use this shared template with placeholders filled in:

```text
You are implementing one unit from a batched execution plan.

## Context
- Exec plan: [plan path]
- Overall goal: [goal]
- Unit ID: [unit id]
- Unit title: [title]
- Scope: [scope]
- File anchors: [paths]
- Depends on: [unit ids or None]
- Acceptance criteria: [criteria]
- Validation: [validation recipe]

## Instructions
1. Read the exec plan and the files relevant to your unit
2. Implement only this unit's scope
3. Keep the work atomic and committable
4. Run validation when feasible
5. Do not edit the shared exec plan or a shared tracker file
6. Return a structured terminal payload containing:
   - Unit ID
   - Status: completed, blocked, or failed
   - Files changed
   - Validation performed or deferred
   - Commit SHA if you created a commit
   - One concise blocker reason if blocked or failed
   - Any units this completion appears to unblock
7. Stop when this unit is done; do not continue into another unit
```

## Phase 3: Coordinate, Track, And Resume

After launching workers:

1. Render a short chat status table for the user.
2. As workers finish, serially update the canonical exec plan's `## Execution Tracker` and `## Run Log`.
3. After each completion, recompute which units are now `ready`.
4. Launch the next wave only when its dependencies are satisfied.
5. If the run is interrupted, use the canonical exec plan to resume instead of rebuilding the batch from scratch.

## Exec Plan Contract

The canonical exec plan remains:

- `docs/exec-plans/active/<feature-slug>-plan.md`

When batching a plan, make sure this file includes these sections:

1. The normal implementation-plan content already required by the repo
2. `## Execution Strategy`
   - explain what is parallelizable, what is sequential, and why
3. `## Work Units`
   - one subsection or table row per unit with id, title, scope, acceptance criteria, validation, and dependencies
4. `## Dependency Index`
   - table: `Unit | Depends on | Unlocks | Notes`
5. `## Execution Batches`
   - `### Batch N` sections listing which units are safe to run together and why
6. `## Execution Tracker`
   - table: `Unit | Title | Batch | Depends on | Status | Owner | Validation | Commit | Blocker | Last Updated`
7. `## Run Log`
   - append-only log of launches, completions, blockers, retries, and resume notes
8. `## Resume Notes`
   - one short section describing what should happen next if the run resumes later

## Status Rules

Use one execution status model:

- `pending`
- `ready`
- `in_progress`
- `blocked`
- `failed`
- `completed`
- `skipped`

Rules:

- `pending`: not yet eligible to start because dependencies are unfinished
- `ready`: eligible to start now
- `in_progress`: currently assigned to a worker
- `blocked`: stopped by a dependency, conflict, or environment issue
- `failed`: attempted and ended unsuccessfully
- `completed`: finished and validated to the degree promised
- `skipped`: intentionally not executed in this run

Always record a blocker reason for `blocked` and `failed`.
Always record `Last Updated`.

## Coordination Rules

- The coordinator owns the canonical exec plan.
- Workers do not edit the shared plan.
- Workers own one unit only.
- Spawn only units that are actually `ready`.
- Recompute readiness after every terminal worker update.
- Do not launch a later batch early just because there is idle capacity.
- If one unit reveals that the underlying plan is wrong or stale, stop and tell the user the plan needs revision instead of papering over the mismatch.

## Output Expectations

In chat:

- Keep progress updates brief and user-facing.
- Show which units are running, completed, blocked, or newly ready.
- End with a concise summary of how many units completed and what remains.

On disk:

- Keep the canonical exec plan current enough that another agent can resume from it without re-discovery.

## Guardrails

- Do not create a second default tracker file when the canonical exec plan can hold the execution state.
- Do not treat GitHub issues as the only intake shape. The input may come from any accepted backlog or planning source.
- Do not let multiple workers race on the same shared tracker.
- Do not spawn every unit at once.
- Do not lose completed work when re-batching an existing active plan.
- Do not create per-unit note files by default. Only create extra artifacts when a blocker or long-running investigation genuinely needs one.
