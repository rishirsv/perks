# Troubleshooting

## Schema validation fails

- Run `node skills/kpmg-slidegen/scripts/validate_json.js --in <artifact> --kind <contentPack|deckPlan|deckSpec|qaReport>`.
- Confirm prompt output includes only allowed keys.
- For deck plan/spec, verify slide types are from bundled schemas.

## DeckSpec validates but render fails

- Re-run with `node skills/kpmg-slidegen/scripts/render_strict.js --in <deckSpec.json>`.
- Confirm `metadata.footer` fields are present when sparse mode is off.
- Check for invalid slot payload types (table/chart/text arrays).

## Severe overlaps in QA

- Reduce bullet count or text length in crowded slots.
- Split into continuation slides instead of forcing dense content.
- Prefer using a slide type that matches content shape.

## Contract drift suspected

- Run `skills/kpmg-slidegen/scripts/contract_sync_check.sh`.
- If drift exists, update canonical schemas/contracts and then run `skills/kpmg-slidegen/scripts/sync_bundle_from_repo.sh`.

## Harness copy is stale

- Run `skills/kpmg-slidegen/scripts/sync_bundle_from_repo.sh`.
- Confirm `.agents/skills/kpmg-slidegen/` now mirrors `skills/kpmg-slidegen/`.
