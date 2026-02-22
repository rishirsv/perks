## Role

You are a principal engineer reviewing system design for an AI skill that builds financial diligence databooks from trial balance and lease inputs.

## Context

I am uploading `context.zip` containing repository files. Treat those files as authoritative.

Rules:
- Start by reading `context/MANIFEST.md` and use it as the index to the bundle.
- Use only what you can support from the provided files.
- For every concrete claim, cite file paths from the bundle.
- Do not ask questions; proceed with clearly labeled assumptions where necessary.
- Do not apply brevity constraints or response length limits. Provide complete, end-to-end detail needed to make an architectural decision.

## Task

Review the current `databook-analyst` skill architecture and provide a full architecture assessment plus re-architecture proposals.

### Primary goals

1. Explain the current architecture in depth.
2. Evaluate what is working well and what is over-complex, brittle, or hard to scale.
3. Propose 2 to 3 re-architected alternatives that are simpler, more effective, and better aligned to the skill's goals.
4. For each proposed alternative, define what the skill/file structure should be and what each file should contain.

### Current system scope to analyze

Analyze the skill contract, playbooks, formatting rules, Python runners, tests, and current documentation for:

- Plan Mode vs Execute Mode contract and handoff.
- Process-TB pipeline flow (ingest, mapping, trend build, workbook build, QC).
- Process-lease flow and maturity level.
- Data contracts/schemas and sign/units policy.
- Formatting and workbook rendering policy.
- Validation/QC architecture and where checks are enforced.
- Coupling between model-driven logic and deterministic runners.

### What to optimize for in the redesign

- Lower cognitive load for maintainers.
- Simpler and clearer boundaries between:
  - orchestration,
  - domain logic,
  - data contracts,
  - workbook rendering,
  - QC/rule evaluation.
- Easier module expansion beyond Process-TB and Process-lease.
- Better testability (unit + integration).
- Better reliability and debuggability.
- Clear contract between LLM decisions and deterministic execution.

## Required output format

### 1) Current Architecture Overview

Provide:
- A concise but complete explanation of how the system currently works.
- A component diagram (Mermaid).
- At least one sequence diagram (Mermaid) for request execution through Process-TB.
- A data flow diagram (Mermaid) showing key artifacts and transformations.

### 2) Current Architecture Review

Provide:
- Strengths (what should be preserved).
- Weaknesses/risks (complexity, coupling, fragility, scalability concerns).
- Bottlenecks to adding new modules.
- Testing and operational gaps.

For each key issue include:
- Why it matters.
- Impact if left unchanged.
- Relevant evidence with cited file paths.

### 3) Re-Architecture Alternatives (2 to 3)

For each alternative, include all sections below.

#### A. Architectural concept
- One-paragraph summary.
- Design principles and boundary definitions.

#### B. Diagrams
- Component diagram (Mermaid).
- Execution flow/sequence diagram (Mermaid).

#### C. Skill/package structure
- A concrete folder tree of the proposed structure.
- Indicate which existing files are retained, moved, split, or removed.

#### D. File-level contents
For each important file in the alternative, provide:
- File path.
- Purpose.
- What the file contains (sections/classes/functions/contracts).
- Representative content outline (not full implementation, but specific enough to build from).

#### E. Operational model
- How Plan Mode and Execute Mode map into the new architecture.
- How data contracts are defined and validated.
- How formatting policy is applied.
- How QC rules are registered/executed.
- How errors and assumptions are surfaced to users.

#### F. Migration path
- Phase-by-phase migration from current architecture.
- Backward compatibility strategy.
- Test strategy per phase.

#### G. Trade-offs
- Pros.
- Cons.
- Risks.
- Best-fit scenarios.

### 4) Comparative Recommendation

Provide:
- A side-by-side comparison table of the alternatives.
- Recommended target architecture.
- Why that recommendation is best for this project now.
- First 30/60/90 day implementation roadmap.

### 5) Deliverable Addendum

Include:
- Suggested updated `SKILL.md` structure.
- Suggested updated `references/` structure.
- Suggested updated `scripts/` structure.
- Suggested testing pyramid and exact test file organization.
- Suggested documentation map (README + architecture docs + runbooks).

## Constraints and preferences

- No word limits or brevity limits.
- Prefer clarity and completeness over shortness.
- Keep recommendations practical for a small team iterating quickly.
- Avoid adding infrastructure that is unnecessary for current scale.
- Keep solutions implementable in Python + markdown-driven skill orchestration.
