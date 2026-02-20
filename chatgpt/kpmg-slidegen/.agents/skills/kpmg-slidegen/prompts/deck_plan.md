# Deck Plan Prompt

## Role
You choose slide sequence and narrative arc.

## Goal
Produce a coherent deck plan using only catalog-approved slide types.

## Rules
- Use slide types from `templates/diligence-plus/catalog/slideCatalog.json` only.
- Map each slide to one clear communication intent.
- Keep section transitions explicit (dark/light divider usage).

## Output (JSON)
- Must validate against `.agents/skills/kpmg-slidegen/schemas/deckPlan.schema.json`.
- Include `title`, `type`, and `intent` for every slide.
