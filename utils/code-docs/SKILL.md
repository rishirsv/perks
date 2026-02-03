---
name: code-docs
description: Create or update project documentation using the assets in this skill.
---

# Code Docs

## Objective

Create or update structured repo documentation.

Activate this skill when:

- The user explicitly says "Use Code Docs ...", or
- The user directly asks to create/update one of the supported docs by name/path (e.g., "Update `AGENTS.md`", "Write `architecture.md`"), or
- The user asks to update one of this skill's asset files (anything under `assets/`).
- The user asks to codify a solved problem into a solution doc, or update the project roadmap.

## Rules

- You are only permitted to update documentation files in markdown format.
- You are not permitted to modify source code, tests, configuration, or dependencies.
- When updating a document, prefer the existing structure and patterns of the document unless the user asks for a rewrite.
- When creating a new document, start from the matching asset in `assets/`.
- If the user asks to write a document not in the assets folder, propose a sensible structure and ask if they want it saved as a new asset under `assets/` for future use.
- Only update documentation, do not add metadata, preamble, or other blocks to the document.
- When using assets, follow the asset's instructions exactly unless the user provides other instructions.

## Assets

Use the matching starter asset from `assets/` as the initial structure, then adapt it to the target repo. Asset frontmatter is asset metadata; do not copy it into project docs.

Path guidance:

- Paths below are common conventions, not requirements - follow the repo's existing docs structure.
- If the repo does not use `docs/`, default to `docs/` unless the repo clearly uses a different convention.

| Document                    | Asset                                    | Suggested path                              |
| --------------------------- | ---------------------------------------- | ------------------------------------------- |
| README                      | `assets/README_template.md`              | `README.md`                                 |
| Repo guidelines             | `assets/AGENTS_template.md`              | `AGENTS.md`                                 |
| Architecture                | `assets/ARCHITECTURE_template.md`        | `docs/ARCHITECTURE.md`                      |
| Design guidelines           | `assets/DESIGN_template.md`              | `docs/DESIGN.md`                            |
| Roadmap                     | `assets/ROADMAP_template.md`             | `docs/ROADMAP.md`                           |
| Solution doc (codify)       | `assets/solution_template.md`            | `docs/solutions/<solution-slug>.md`         |
| Issue doc (single or batch) | `assets/issue_template.md`               | `docs/issues/<issue-slug>.md`               |
| Feature walkthrough         | `assets/feature-walkthrough_template.md` | `docs/<slug>/feature-walkthrough-<slug>.md` |

## Defaults (be autonomous)

- If the user names a file path, use it.
- If the user names a doc type (README/ARCHITECTURE/ROADMAP/etc.) but not a path, use the Suggested path above.
- If the repo already has a convention for doc locations/names, follow the repo.
- Ask questions only when there are multiple competing conventions in-repo (e.g., both `doc/` and `docs/` are actively used).

## Repo discovery (before drafting)

Before writing/updating docs, inspect the repo enough to avoid guessing:

- Docs conventions: `README.md`, `AGENTS.md`, `docs/` (or equivalent).
- How to run/test/build: package scripts (e.g., `package.json`, `Makefile`, `justfile`, `pyproject.toml`, `Cargo.toml`, etc.).
- Architecture anchors:
  - Entry points (main/server/app), routing, and composition roots
  - Module/package boundaries and dependency direction
  - Data stores (ORM config, migrations, schema files)
  - External services (SDK clients, env vars, integration wrappers)
  - Deployment signals (Docker, IaC, CI workflows)

## Workflow

1. **Select target**
   - Prefer the user-provided path.
   - Otherwise use the Suggested path for that doc type.
   - If multiple docs are requested, do them in the order mentioned.

2. **Read existing docs (if any)**
   - If the target doc exists, preserve its structure and tone.
   - If adjacent docs exist, match conventions (naming, links, folder structure).

3. **Select an asset (or create a new structure)**
   - Start from the matching asset in `assets/` whenever possible.
   - If the user asks for a doc not covered by assets, propose a structure and offer saving a new asset under `assets/`.

4. **Draft/update the doc**
   - Keep edits minimal and aligned with existing patterns unless the user asked for a rewrite.
   - Do not add extra metadata/preambles beyond what the doc already uses.
   - Make the doc scannable: headings first, short paragraphs, concrete bullets.

5. **Verification + save summary**
   - If the doc instructs actions, include commands/URLs and expected results.
   - End with a short list of files created/updated (paths only).

### AGENTS.md

Keep it short and operational:

- Scope (in/out)
- High-level repo map
- Commands (install/dev/test/lint/build)
- Workflow conventions (only if the repo uses them)
- Verification (commands + expected results)

### Solution docs (Codify)

When the user asks to "codify" a solved problem into a durable solution doc:

- Default to a kebab-case `<solution-slug>` derived from the title if the user didn’t provide one.
- Default location: `docs/solutions/<solution-slug>.md` (or follow the repo's docs conventions).
- Avoid duplicates: search existing solution docs for the error message / key phrase. If a similar doc exists, ask whether to update it or create a new doc and cross-link.
- Use `assets/solution_template.md` as the starting point and fill in: symptoms, root cause, fix, why it works, prevention, references.
- End with a Save Summary listing the created/updated file.

### Roadmap docs

When the user asks to create or update a roadmap:

- Default location: `docs/ROADMAP.md` (or follow the repo's docs conventions).
- Use `assets/ROADMAP_template.md` as the starting point for new roadmaps (or when the user asks for a rewrite).
- Keep it lightweight and easy to revise:
  - No charts, no sequencing, no ownership metadata.
  - No implementation details, task lists, or step-by-step plans.
  - Write features as `### Feature: …` sections with a **Description** of 3–4 sentences or bullets.
  - If a supporting doc is important, add a short inline link inside the feature description (avoid link dumps).
  - Add an `## Implemented Features` section below `## Feature Roadmap`:
    - Use the same `### Feature: …` + **Description** format.
    - Treat it as a lightweight changelog: keep newest implemented items at the top.
    - When a roadmap feature ships, move it from `## Feature Roadmap` to `## Implemented Features`.
    - Include a **Where implemented** bullet list per feature with 1–3 concrete anchors (e.g., primary route/screen, key entry points).
- End with a Save Summary listing the created/updated file.

### Issue docs

When the user asks to create an issue doc (or you identify a clear issue while drafting other docs):

- If you identify a clear issue while working on another doc, call it out and ask if the user wants an issue doc created (don't create one without confirmation).
- Default to a kebab-case slug derived from the title if the user didn’t provide one.
- Prefer one issue per file unless the user explicitly wants a grouped batch doc (use the batch format included in `assets/issue_template.md`).

### Create Design Guidelines

Use `assets/DESIGN_template.md` to document:

- Color patterns & psychology
- Typography system & hierarchy
- Layout principles & spacing
- Component styling standards
- Accessibility considerations
- Design highlights & rationale

## Writing style

- Headings-first: make the doc scannable; keep paragraphs short.
- Prefer `## Description` near the top for a simple, user-oriented explanation.
- Concrete anchors: prefer file paths, commands, and named entry points over generic prose.
- Minimal tokens: avoid repetition and filler; don't restate rules in multiple sections.
- Visuals: use small tables and mermaid diagrams when they improve scanability.
