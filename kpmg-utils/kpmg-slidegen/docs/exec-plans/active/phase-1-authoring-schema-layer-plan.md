# Phase 1 Authoring + Schema Layer Plan

## Phase Outcomes (Non-Technical)

### Phase 1: Safe authoring foundation
We create a repo-only place to define future slide building blocks and layout instances without changing how the generator renders decks today.

### Phase 2: Shared structure contracts
We define machine-readable schemas for primitives, layout instances, onboarding cases, and compare scorecards so future tooling can scale layout authoring consistently.

### Phase 3: Clear architecture boundaries
We document how repo-only authoring inputs turn into the existing runtime package and what must stay out of the portable skill bundle for now.

## Implementation Checklist

- [x] 1.0 Add repo-only authoring scaffolding
  - [x] 1.1 Create `templates-src/kpmg-diligence/layouts/`
  - [x] 1.2 Create `templates-src/kpmg-diligence/primitives/`
  - [x] 1.3 Create `generator/builders/primitives/`
  - [x] 1.4 Create `onboarding/cases/`
  - [x] 1.5 Create `scripts/codegen/`
  - [x] 1.6 Validation for 1.0 (confirmed runtime/template imports were not changed)

- [x] 2.0 Add Phase 1 schemas
  - [x] 2.1 Add primitive schema
  - [x] 2.2 Add layout instance schema
  - [x] 2.3 Add onboarding case schema
  - [x] 2.4 Add compare scorecard schema
  - [x] 2.5 Validation for 2.0 (schema files parse cleanly as JSON)

- [x] 3.0 Document architecture boundaries
  - [x] 3.1 Define primitive
  - [x] 3.2 Define layout instance
  - [x] 3.3 Define onboarding case
  - [x] 3.4 Define generated runtime aggregate
  - [x] 3.5 Define portable skill bundle

- [x] 4.0 Add placeholder scripts for later phases
  - [x] 4.1 Add codegen placeholder scripts to `package.json`
  - [x] 4.2 Validation for 4.0 (package JSON stays valid)

## Validation Notes

- `node -e` JSON parsing check passed for all new schema files and `package.json`.
- `npm run -s test:contracts` passed.
- `npm run -s test:structure` is currently blocked in this workspace because `pptxgenjs` is not installed, so that lane could not be completed here.
