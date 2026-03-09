---
status: active
last-reviewed: 2026-03-09
review-cycle-days: 14
source-of-truth: onboarding scripts under scripts/onboarding plus current repo onboarding docs
verification-state: verified
---

# Layout Onboarding Workflow

This document describes the complete repo-only workflow for turning a reference
slide from any supported PowerPoint template into a canonical layout that can be
rendered, compared, reviewed, and promoted into the generator.

## What This Workflow Achieves

Each onboarding run moves a single layout through four practical outcomes:

1. Capture a trustworthy reference from a source `.pptx`.
2. Build a deterministic candidate layout and slide builder.
3. Compare the candidate against the reference with repeatable QA and image
   diffing.
4. Promote only after deterministic gates pass and a human approves the
   remaining visual delta.

## Repo Boundaries

Keep the following in the repo only:

- Source `.pptx` files
- Draft onboarding workspaces
- Geometry seeds
- Candidate outputs and visual diffs
- Agent prompts and review notes
- Onboarding scripts and policies

Do not sync draft onboarding assets into `skills/kpmg-slides/`.

## Current Template Model

The onboarding flow now persists a `templateName` in each layout workspace.
That means:

- `init-layout.mjs` can start a draft for any template name.
- `render-candidate.mjs` and `promote-layout.mjs` read the chosen template from
  `source.json` instead of assuming `kpmg-diligence`.
- Promotion writes the canonical layout contract into
  `templates/<template-name>/package/layouts.json`.

Important constraint:

- Rendering and promotion still require a real template package and a viable
  base family. A brand-new template folder can hold source files immediately,
  but it cannot render candidates until its package and family/builder strategy
  exist.

## Directory Model

Stable draft inputs live under:

```text
onboarding/layouts/<layout-id>/
```

Generated artifacts live under:

```text
outputs/onboarding/<layout-id>/
```

Typical draft workspace:

```text
onboarding/layouts/<layout-id>/
  source.json
  candidate.layout.json
  candidate.builder.js
  candidate.deckSpec.json
  seed/
    geometry.seed.json
```

Typical output workspace:

```text
outputs/onboarding/<layout-id>/
  candidate/
    deck.pptx
    qa.json
    preview/slide-1.png
    montage.png
  compare/
    reference.png
    candidate.png
    diff.png
    diff.json
    scorecard.json
```

## Phase 1: Prepare The Source

Goal:
Create a stable source location for the PowerPoint you want to learn from and
pick a unique `layout-id`.

Recommended inputs:

- `--source-pptx`: absolute or repo-relative path to the source `.pptx`
- `--slide`: 1-based slide number to extract
- `--layout-id`: camelCase identifier for the new layout
- `--template`: template family name such as `kpmg-diligence` or `kpmg-mc`
- `--family`: existing slide family to clone behavior from, if known

Suggested prep checklist:

- Store the source PPTX under the matching template workspace when possible.
- Choose a `layout-id` that is specific, stable, and not already in use.
- Pick the closest existing family if the new layout is an adaptation of an
  existing behavioral type.

## Phase 2: Initialize The Draft

Goal:
Capture the reference slide and scaffold the minimum files needed for iteration.

Command:

```bash
node scripts/onboarding/init-layout.mjs \
  --source-pptx templates/kpmg-mc/source/kpmg-mc-slide-template.pptx \
  --slide 1 \
  --layout-id mcBusinessOverview \
  --template kpmg-mc \
  --family businessOverview \
  --extract-seed
```

What this does:

1. Creates `onboarding/layouts/<layout-id>/`.
2. Captures the reference slide as `outputs/onboarding/<layout-id>/compare/reference.png`.
3. Writes `source.json` with source metadata, template selection, approval
   state, and artifact pointers.
4. Scaffolds:
   - `candidate.layout.json`
   - `candidate.builder.js`
   - `candidate.deckSpec.json`
5. Optionally extracts `seed/geometry.seed.json` from the source PPTX XML.

Notes:

- If `--family` is omitted, the scaffold is draft-only and will not render until
  a base family is set in `source.json`.
- If `--family` is provided, the selected template package must already exist so
  the scaffold can clone the base contract.

## Phase 3: Tighten The Draft

Goal:
Edit the scaffold so the candidate uses the right geometry, content shape, and
builder behavior before rendering.

Files to inspect:

- `onboarding/layouts/<layout-id>/source.json`
- `onboarding/layouts/<layout-id>/seed/geometry.seed.json`
- `onboarding/layouts/<layout-id>/candidate.layout.json`
- `onboarding/layouts/<layout-id>/candidate.builder.js`
- `onboarding/layouts/<layout-id>/candidate.deckSpec.json`

What each file is for:

- `source.json`: source-of-truth for `templateName`, base `family`, source
  slide, status, and artifact links.
- `candidate.layout.json`: draft geometry and slot contract overlay for the new
  canonical type.
- `candidate.builder.js`: runtime slide builder for the draft layout.
- `candidate.deckSpec.json`: one-slide fixture used to render the candidate.
- `geometry.seed.json`: optional coordinate hints extracted from the source
  slide.

Typical edits:

- Refine geometry boxes and anchors in `candidate.layout.json`.
- Keep inherited behavior in the builder when the layout is only a geometric
  variant.
- Adjust test content in `candidate.deckSpec.json` so it exercises the layout
  honestly.
- For custom layouts that do not fit the base family geometry contract, store
  custom box trees under `geometry.typography` and set
  `candidate.layout.json > registry.requiredGeometry` /
  `registry.optionalGeometry` so the draft and promotion flows use the intended
  geometry contract instead of the inherited base family keys.

Builder hygiene rules for every candidate import:

- Prefer canonical theme/token helpers before introducing new font or color
  literals.
- Prefer existing theme-helper font resolution instead of builder-local
  `fontFace` literals.
- Prefer master/footer chrome and footer-safe geometry instead of stamping
  footer screenshots into the slide body.
- Prefer template asset resolution helpers instead of repo-root path stitching
  inside candidate builders.
- Treat builder-local hex palettes as a workflow failure unless the palette is
  first added as a small canonical primitive in the existing theme surfaces.
- Review `candidate/preview/slide-1.png` yourself before asking for approval and
  fix obvious layout defects first.

## Phase 4: Render The Candidate

Goal:
Produce a deterministic candidate deck and QA report.

Command:

```bash
node scripts/onboarding/render-candidate.mjs \
  --layout-id mcBusinessOverview
```

Optional montage:

```bash
node scripts/onboarding/render-candidate.mjs \
  --layout-id mcBusinessOverview \
  --with-montage
```

What this does:

1. Loads `source.json` and reads `templateName`.
2. Loads the chosen template package.
3. Overlays the draft layout into the template package in memory.
4. Loads the draft builder.
5. Renders `candidate/deck.pptx`.
6. Writes `candidate/qa.json`.
7. Writes `candidate/preview/slide-1.png`.
8. Optionally writes `candidate/montage.png`.

Blocking condition:

- Rendering stops if `source.json` has no `family`.
- Rendering stops if the template package for `templateName` is incomplete.
- Rendering stops if QA contains blocking checks.

## Phase 5: Compare Against The Reference

Goal:
Measure whether the candidate is visually close enough to the source slide.

Command:

```bash
node scripts/onboarding/compare-candidate.mjs \
  --layout-id mcBusinessOverview
```

What this does:

1. Normalizes the rendered preview to the comparison canvas.
2. Writes `compare/candidate.png`.
3. Produces `compare/diff.png`.
4. Produces `compare/diff.json`.
5. Produces `compare/scorecard.json`.

Interpretation order:

1. Fix deterministic render or QA failures first.
2. Fix size and geometry mismatches second.
3. Leave cosmetic polish until the scorecard is close.

## Phase 6: Review And Iterate

Goal:
Use deterministic evidence first, then human or agent review, until the draft is
ready for approval.

Review order:

1. `candidate/qa.json`
2. `compare/scorecard.json`
3. `compare/diff.json`
4. `compare/reference.png`
5. `compare/candidate.png`
6. `compare/diff.png`

Useful questions:

1. Is the candidate overflowing or missing required geometry?
2. Are the biggest deltas structural or cosmetic?
3. Is the chosen base family still the best fit?
4. Can the mismatch be fixed in geometry only, or does the builder/fixture need
   to change?

Repeat the edit/render/compare loop until the deterministic results are clean
and the remaining visual differences are acceptable.

## Phase 7: Promote

Goal:
Turn the approved draft into a canonical generator layout.

Command:

```bash
node scripts/onboarding/promote-layout.mjs \
  --layout-id mcBusinessOverview \
  --approved-by "Your Name" \
  --approval-notes "Residual visual differences reviewed and accepted."
```

Promotion prerequisites:

1. `reference.png` exists.
2. Candidate render succeeds.
3. `candidate/qa.json` exists with zero blocking checks.
4. Candidate and reference images can be compared on the fixed canvas.
5. `compare/scorecard.json` exists and `pass` is `true`.
6. A human decides the remaining delta is acceptable.

Promotion effects:

1. Copies the builder into `generator/builders/onboarded/`.
2. Adds the layout to the onboarded registry.
3. Writes the layout contract to `templates/<template-name>/package/layouts.json`.
4. Adds reference-parity fixture coverage.
5. Updates the all-layouts golden fixture.
6. Updates root schema and reference docs.
7. Marks the draft as approved in `source.json`.

## One-Command End-To-End Loop

Use the wrapper script when you want init, render, and compare in sequence:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --source-pptx templates/kpmg-mc/source/kpmg-mc-slide-template.pptx \
  --slide 1 \
  --layout-id mcBusinessOverview \
  --template kpmg-mc \
  --family businessOverview \
  --extract-seed
```

Stop after a phase:

```bash
node scripts/onboarding/run-layout-onboarding.mjs \
  --source-pptx templates/kpmg-mc/source/kpmg-mc-slide-template.pptx \
  --slide 1 \
  --layout-id mcBusinessOverview \
  --template kpmg-mc \
  --family businessOverview \
  --extract-seed \
  --stop-after init
```

## Validation Checklist

Use this checklist before promotion:

- `source.json` points at the correct `templateName` and slide number.
- `candidate.layout.json` reflects the intended geometry.
- `candidate.builder.js` uses the right behavior for the layout family.
- `candidate.deckSpec.json` exercises the layout honestly.
- `candidate/qa.json` has no blocking checks.
- `compare/scorecard.json` passes.
- Remaining differences in `diff.png` are cosmetic, not structural.
- Approval metadata is ready to be recorded.

## Recommended Human Review Questions

1. Does the slide preserve the visual hierarchy of the source?
2. Are all text regions, callouts, and media blocks anchored correctly?
3. Did we inherit behavior from the best base family?
4. Is the output robust enough to be reused as a canonical layout rather than a
   one-off?

## Common Failure Modes

### Missing base family

Symptom:
`render-candidate.mjs` fails because `source.json` has no `family`.

Fix:
Set a valid base family in `source.json`, then regenerate the draft builder if
needed.

### Missing template package

Symptom:
Render or promotion fails while loading the selected template package.

Fix:
Create the template package files first:

- `templates/<template-name>/package/layouts.json`
- `templates/<template-name>/package/tokens.json`
- `templates/<template-name>/package/pagination-policy.json`
- `templates/<template-name>/package/assets/manifest.json`

### Good render, poor visual parity

Symptom:
QA passes but the compare scorecard fails.

Fix:
Prioritize geometry and spacing corrections before editing filler content.

### Cosmetic uncertainty

Symptom:
The scorecard passes or is near-pass, but approval is unclear.

Fix:
Use side-by-side review of `reference.png`, `candidate.png`, and `diff.png` and
require a human decision before promotion.

## Verification Method

This document is verified against:

- `scripts/onboarding/init-layout.mjs`
- `scripts/onboarding/render-candidate.mjs`
- `scripts/onboarding/compare-candidate.mjs`
- `scripts/onboarding/run-layout-onboarding.mjs`
- `scripts/onboarding/promote-layout.mjs`
- `scripts/onboarding/lib.mjs`
