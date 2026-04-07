---
description: Improve an existing exec plan as a second-pass planning run so it becomes decision-complete, execution-ready, and tightly aligned with repo conventions before implementation.
argument-hint: [PLAN="<optional: exec plan path or feature slug>"]
---

# Improve Plan

Your job is to take an existing exec plan as a seed draft and improve it until it is decision-complete, internally consistent, and ready to implement without extra interpretation.

Treat this like an advanced second-pass planning workflow, not light copyediting. The existing plan is a starting point, not a final answer.

## Inputs

```text
[PLAN PATH / FEATURE SLUG]
```

```text
[CONTEXT: repo, code, docs, constraints, prior decisions]
```

## Operating rules

- If we are currently discussing a plan with the user, improve that current plan directly.
- Otherwise, find the relevant exec plan in `docs/exec-plans/active/` or `docs/exec-plans/completed/`.
- If no plan path is given, use the most recently modified active exec plan.
- Treat the current plan as a seed draft to refine, not a document to preserve blindly.
- Rewrite and strengthen the plan instead of appending a loose addendum.
- Keep the improved plan as one clean replacement plan.
- If a question can be answered by exploring the codebase, inspect the codebase instead of asking.
- Use repo docs, existing patterns, neighboring implementations, and the plan template to tighten the plan before asking me anything.
- Use read-only exploration first. Do not assume the existing plan is correct until you verify it against code and docs.
- Walk each decision branch to the end, one dependency at a time.
- Ask targeted questions only when the repo cannot answer them.
- Remove project-specific noise unless it is truly necessary to implement the work.
- Keep the plan aligned with the application's common conventions, naming, and architecture.
- Prefer concrete codebase evidence over abstract design opinions.
- If the task appears cross-cutting, ambiguous, or parallelizable, improve the plan so it can support batch execution or deeper planning without being rewritten again.
- Prefer the repo's exec-plan structure:
  - short Summary
  - clear Phase Outcomes with non-technical outcomes
  - checklist or implementation checklist with checkbox hierarchy
  - verification notes or verification steps
  - assumptions, decisions, or risks when they materially affect implementation
- Preserve completed checkboxes when improving an existing saved exec plan unless the plan is clearly wrong and needs a full reset.

## Working method

Follow this loop until the plan is strong:

1. Read the current plan and identify uncertainty, vagueness, contradictions, and missing implementation anchors.
2. Explore the repo to answer as many of those gaps as possible from code, docs, neighboring features, tests, scripts, and conventions.
3. Rewrite the plan immediately as you learn, rather than saving all changes for the end.
4. Repeat until the plan is ready to execute or only one truly user-dependent decision remains.

When the repo supports it, improve the plan using multiple perspectives:

- existing implementation and reuse paths
- user-facing behavior and scope boundaries
- verification and rollout safety
- opportunities to split independent work cleanly

## Improvement checklist

When reviewing the plan, check whether it clearly answers:

- Which exact user-facing outcome the work should create
- What changes for users and why
- What is in scope and out of scope
- What phases or milestones the work should follow
- What the implementation checklist should be
- What exact commands, scripts, tests, or manual flows verify the work
- What decisions were made and why
- What risks remain and how to contain or reverse them safely
- Which assumptions still need to be made explicit
- Whether the plan names concrete files, modules, routes, docs, commands, or contracts where that specificity materially helps
- What existing code, utilities, or patterns should be reused, with file paths where useful
- Whether the implementation order is correct
- Whether this work should stay as one implementation flow or be split into independent units for batch/parallel execution

## Quality bar

The improved plan should be better than a normal first draft:

- tighter
- more evidence-backed
- less repetitive
- more explicit about reuse
- more explicit about verification
- more ready for immediate execution

Do not settle for generic plan language like "implement the feature" or "update the UI". Name the actual work.

## Output format

1. State which plan you are improving.
2. Summarize the key gaps, contradictions, or missing decisions you found.
3. Provide the improved plan as a full replacement, not a patchwork addendum.
4. State whether the plan is now:
   - ready for normal implementation
   - better suited for batch / parallel execution
   - still blocked on one user decision
5. If something is still blocked, ask the smallest possible question and explain exactly which part of the plan depends on it.

## Rewrite guidance

When you rewrite the plan:

- make the Summary shorter and clearer
- treat the existing plan as a draft to upgrade, not prose to preserve
- turn vague work into concrete checklist items and verification steps
- group work into phases with plain-English outcomes
- add verification that matches the repo's real scripts, tests, manual flows, or tooling
- include explicit reuse guidance when existing utilities or patterns should be leaned on
- tighten file or module references where they help another agent move quickly
- remove steps that are unnecessary, duplicated, or out of order
- make the plan durable enough that another engineer or agent can execute it without re-planning
- remove filler, repetition, and project-specific branding noise
- keep the plan compact, but not underspecified
- prefer durable behavior-level guidance over brittle file-by-file micromanagement
- keep the output easy for another engineer or agent to execute immediately

## Execution-readiness checks

Before finalizing, make sure the improved plan:

- can be executed without asking "what did the planner mean here?"
- names the validation path early enough that implementation will not stall later
- is explicit about assumptions and decisions that affect architecture or user behavior
- does not hide important complexity behind a single checklist bullet
- does not over-specify irrelevant details just to look thorough

## Escalation guidance

If the plan reveals that the work is unusually broad, risky, or parallelizable, improve it so it is ready for a stronger execution workflow:

- split work into independent units where appropriate
- make verification reusable across units
- preserve one canonical replacement plan
- note whether a deeper planning pass or batch workflow would produce a better implementation outcome

## Goal

Leave me with a plan that is ready to implement without extra interpretation and strong enough to serve as the canonical execution artifact.
