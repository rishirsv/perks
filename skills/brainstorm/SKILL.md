---
name: brainstorm
description: "Structured, repo-aware conversation to explore an idea, plan, or task until nothing important remains ambiguous. Optionally writes a feature spec for large features. Use only when the user explicitly invokes `brainstorm`/`$brainstorm`. Do not auto-activate."
---

# Brainstorm

Turn a rough idea, plan, or task into a shared understanding through structured, repo-aware conversation. For large features, optionally produce a decision-complete spec.

Stay in brainstorm mode:

- Do not implement code or modify product code.
- You may read the repository and create or update documentation.

## Core behavior

- Start with repository context. Read relevant docs, specs, plans, and adjacent code before asking questions.
- If a question can be answered by exploring the codebase, explore instead of asking.
- Interview the user relentlessly until the design is decision-complete.
- Walk the design tree in dependency order, resolving one branch at a time.
- For every unresolved decision, provide a recommended answer or default.
- Prefer the smallest sensible scope. Push non-essential ideas out of the first version.
- Ask one focused question at a time, or a small batch of tightly related questions.
- Prefer multiple-choice, yes/no, or constrained options.
- When there is uncertainty, state the assumption you would otherwise make.

## Workflow

### 1. Establish context

- Read project guidance first: `AGENTS.md`, `README.md`, relevant docs, existing specs/plans.
- Inspect nearby code and existing behavior before proposing flows.
- If a relevant spec already exists, plan to update it rather than duplicate.

### 2. Run a dependency-ordered interview

Start with the highest-leverage unknowns. Ask only what is still unknown after repo exploration.

Walk down the design tree in roughly this order:

1. Problem and user
2. Trigger and entry point
3. Core flow
4. State, data, and system behavior
5. Constraints and non-goals
6. Edge cases, failure modes, and permissions
7. Success criteria and verification

After each answer, restate the decision and carry its implications forward.

Keep going until you can describe the solution without guessing.

### 3. Summarize shared understanding

When enough is known to proceed, provide a concise summary:

- **Goal**: what we are trying to accomplish
- **Scope in/out**: what is included and explicitly excluded
- **Dependencies**: what this relies on
- **Constraints**: hard limits and requirements
- **Open risks**: anything still uncertain

### 4. Write a spec (large features only)

Write a spec only when:

- The user explicitly asks for one, OR
- The scope is clearly a large, multi-component feature

If writing a spec:

- Default to `docs/product-specs/<feature-slug>-spec.md` or follow repo convention.
- If a relevant spec exists, update it instead of creating a duplicate.

Mandatory sections: `TL;DR`, `Scope`, `What We Are Building`, `Requirements`, `Acceptance Criteria`.

Optional sections (include only when they materially improve clarity): `User Stories`, `How It Works`, `Context`, `Assumptions`, `Open Questions`, `Risk And Failure Analysis`, `Rollout And Rollback`, `Verification`.

Ground decisions in repo evidence. If something could not be verified in the codebase, say so explicitly.

### 5. Finish cleanly

- If a spec was written: share the path, give a short recap, call out open questions.
- If no spec: confirm the shared understanding is complete and ready to act on.

## Output format during interview

1. State the current branch you are exploring.
2. Ask the next best question.
3. When a branch is fully resolved, summarize the decision in one sentence and move to the next branch.

## Anti-patterns

- Do not ask questions the repo can answer with a quick read.
- Do not dump a long questionnaire up front.
- Do not write a spec before critical branches are resolved.
- Do not drift into implementation.
- Do not preserve every idea by default; simplify and narrow scope.
