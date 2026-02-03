# Plan: Upgrade `code-docs`

## Goal
Make `utils/code-docs` more autonomous, clearer for non-technical readers, and more visual by default (tables + mermaid), while keeping roadmap/issue docs lightweight and keeping architecture glossary-free.

## Decisions
- Use `## Description` and write simply (avoid meta labels).
- No “stop and ask triggers” sections; prefer safe defaults.
- Canonical doc paths in templates: `docs/ARCHITECTURE.md`, `docs/DESIGN.md`, `docs/ROADMAP.md`.
- Architecture doc is direct + opinionated; includes forbidden patterns; no glossary.
- Roadmap stays lightweight; no now/next/later.
- Issue stays simple.

## Work items
- [x] Fix broken references and casing across `SKILL.md` + templates.
- [x] Make `SKILL.md` autonomy-first and repo-analysis-first.
- [x] Upgrade templates:
  - [x] README
  - [x] AGENTS
  - [x] ARCHITECTURE
  - [x] DESIGN
  - [x] ROADMAP
  - [x] ISSUE
  - [x] SOLUTION
  - [x] FEATURE WALKTHROUGH
- [x] Validate: no missing asset references; consistent doc paths; no “plain-language meta labels” in templates/skill.
