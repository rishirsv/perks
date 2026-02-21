# Template Contract

## Canonical anchors

- Runtime slot source-of-truth: `templates/kpmg-diligence/package/layouts.json`
- Runtime tokens source: `templates/kpmg-diligence/package/tokens.json`
- Generator default template name: `kpmg-diligence`
- Contract parity target: Diligence+ template v2.1

## Contract layering

1. `templates/kpmg-diligence/package/layouts.json` defines runtime slot geometry and required slots.
2. `schemas/deckPlan.schema.json` defines model-facing slide type planning contract.
3. `schemas/deckSpec.schema.json` defines renderable payload contract and min-items constraints.
4. `generator/scripts/check-slot-contract-sync.js` guards drift between layouts and schemas.

## Operating rule

When template contracts change, run in this order:

1. `scripts/contract_sync_check.sh`
2. `scripts/sync_bundle_from_repo.sh`
3. Re-run generation/QA on representative decks.
