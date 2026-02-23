---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 14
source-of-truth: docs/refactor-implementation-plan.md
verification-state: verified
---

# Refactor Implementation Checklist

- [x] 1.0 Strict and postprocess simplification
  - [x] 1.1 Remove legacy strict overflow script fallback and use one visual-overflow strict path
  - [x] 1.2 Move strict and postprocess logic into dedicated `generator/app/*` modules
  - [x] 1.3 Keep QA strict status backward-compatible (`status`, `mode`, `skipped`, `reason`)

- [x] 2.0 Validation and rendering cleanup
  - [x] 2.1 Remove duplicate validation pass by passing a precomputed validation result into render flow
  - [x] 2.2 Require essential template assets for cover/back-cover slides with clear failure messages

- [x] 3.0 Builder cleanup and simplification
  - [x] 3.1 Remove embedded builder harness entrypoints from production files
  - [x] 3.2 Replace harnesses with explicit script-based dev commands under `scripts/dev/`
  - [x] 3.3 Remove unused two-column baseline export path

- [x] 4.0 Visual validation and stress input
  - [x] 4.1 Add `decks/lorem-comprehensive.deckSpec.json` covering all supported slide types
  - [x] 4.2 Add `scripts/validate-visual.mjs` for temp-folder generation + PNG + montage + overflow checks

- [x] 5.0 Repo hygiene and docs
  - [x] 5.1 Add minimal `package.json` scripts for generate/smoke/postprocess/visual validation/dev harnesses
  - [x] 5.2 Add `.gitignore` for local noise and generated runtime artifacts
  - [x] 5.3 Resolve README/ARCHITECTURE source-of-truth wording conflict

- [x] 6.0 Verification
  - [x] 6.1 Run smoke generation script
  - [x] 6.2 Run postprocess flow script
  - [x] 6.3 Run visual validation script
  - [x] 6.4 Validate lorem deck generation via CLI
