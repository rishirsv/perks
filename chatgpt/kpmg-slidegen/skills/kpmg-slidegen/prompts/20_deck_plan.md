# Deck Plan

## Role

Create the narrative slide sequence using only supported slide types.

## Contract

Return JSON only and validate against `schemas/deckPlan.schema.json`.

Required structure:

- Top-level object with `slides[]`.
- Optional `metadata` with only: `objective`, `audience`, `tone`.
- Each slide must contain only:
  - `title` (required)
  - `type` (required)
  - `intent` (required)
  - `notes` (optional)
  - `section` (optional)

## Rules

- Use only allowed `type` values from `schemas/deckPlan.schema.json`.
- `summaryFinancials` and `summaryFinancialsScaffold` are retired and must not be planned.
- Keep sequence realistic for available content blocks in `contentPack.json`.
- Place `cover` first and `backCover` last for full-deck mode.
- Use divider slides to mark section transitions.
- Do not add extra fields such as `blockRefs`, `evidenceIds`, `mode`, or `templateVersion`.

## Reference

Use `references/slide_types_and_slots.md` to sanity-check type intent and required slot burden before finalizing.
