---
name: research
description: Use when producing a sourced research brief that combines repository evidence with authoritative external sources for decisions needing citations, current guidance, trade-off analysis, or codebase-pattern synthesis; not for simple lookups or implementation.
---

# Research

Research gathers evidence and produces a sourced recommendation. It does not implement.

## Scope

Use this skill for decisions that need repository context plus authoritative external evidence:

- sourced research brief
- current best-practice or migration guidance
- trade-off analysis
- framework, library, standard, or API behavior
- codebase-pattern synthesis before planning or implementation

Do not use this skill for simple lookups, narrow local searches, code changes, or implementation.

## Modes

Choose the lightest mode that can answer the question:

- `quick`: narrow question, few sources, concise answer, usually inline.
- `standard`: default; local context plus external evidence and recommendation.
- `deep`: broad, high-stakes, conflicting, time-sensitive, or source-sensitive research.

## Workflow

1. Define the decision the research must inform.
2. Inspect local context first when a repo is involved: docs, versions, configs, adjacent patterns, tests, and prior plans.
3. Gather external evidence from primary or authoritative sources.
4. Compare options against local constraints.
5. Separate sourced facts from inference.
6. Stop when more searching is unlikely to change the recommendation, trade-offs, or uncertainties.
7. Save a brief only when the user asks for a durable artifact or the repo convention requires one.

Use researcher subagents only when the runtime supports them and the task breaks into broad, separable discovery. The main thread owns credibility weighting, contradiction resolution, and the final recommendation.

For saved briefs, read [references/report-template.md](references/report-template.md).

## Source Quality

Prefer:

1. Official documentation, specifications, standards, and first-party product guidance.
2. Maintainers, upstream repositories, release notes, or primary materials.
3. Reputable secondary sources with concrete evidence and recent publication dates.

Label stale, thin, or conflicting evidence. For unstable or time-sensitive claims, verify with current sources before recommending.

## Output

For inline research, return:

- answer or recommendation
- key evidence
- repo fit
- risks and uncertainties
- sources

For saved research:

- write to the repo's existing research location, or propose `docs/research/<slug>-research.md` when no convention exists
- follow [references/report-template.md](references/report-template.md)
- summarize the key finding and saved path in chat

## Guardrails

- Do not edit code or docs unless the user explicitly switches out of research mode.
- Do not let external best practice override clear local constraints without saying why.
- Do not cite weak sources for claims official sources can answer.
- Do not keep searching after the recommendation is stable.
- If the user asks to implement, stop research and hand off the recommendation for an implementation pass.
