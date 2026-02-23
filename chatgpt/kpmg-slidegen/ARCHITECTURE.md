---
owner: kpmg-slidegen maintainers
status: active
last-reviewed: 2026-02-23
review-cycle-days: 30
source-of-truth: ARCHITECTURE.md
verification-state: partially-verified
---

# Architecture

Minimal architecture map for how `deckSpec` input becomes `.pptx` + QA output.

## 1) Repository Shape

```mermaid
flowchart TD
  R[kpmg-slidegen]
  R --> D[decks]
  R --> G[generator]
  R --> T[templates]
  R --> O[outputs]
  R --> S[samples]
  R --> RE[references]

  G --> GB[builders]
  G --> GH[helpers]
  G --> GR[runtime]
  G --> GS[strict]
```

## 2) Runtime Pipeline

```mermaid
flowchart LR
  IN[deckSpec JSON] --> CLI[generator/index.js]
  CLI --> TP[loadTemplatePackage]
  CLI --> VAL[validateDeckSpecWithTemplate]
  VAL --> REN[renderDeck]
  REN --> PAG[paginateDeckSpec]
  PAG --> BLD[builders/*]
  BLD --> PPTX[PptxGenJS writeFile]
  CLI --> OVL[checkDeckOverlaps]
  CLI --> PP[optional postprocess adapter]
  CLI --> QA[qa.json]
  PPTX --> OUT[deck.pptx]
  PP --> PREV[preview pngs]
  PP --> MON[montage png]
  PP --> VOV[visual overflow diagnostics]
```

## 3) Render Sequence

```mermaid
sequenceDiagram
  participant User
  participant CLI as index.js
  participant Template as template-package
  participant Render as render-deck
  participant Paginate as paginate
  participant Builder as builders/*
  participant Strict as strict/overlap

  User->>CLI: run with --in --out --qa-out
  CLI->>Template: load tokens/layouts/assets manifest
  CLI->>Render: validate + render request
  Render->>Paginate: split dense slides
  Paginate-->>Render: paginated slide list
  Render->>Builder: dispatch by slide type
  Builder-->>CLI: slide elements
  CLI->>Strict: overlap analysis
  CLI-->>User: write .pptx and qa.json
```

## 4) Module Dependency View

```mermaid
graph TD
  IDX[generator/index.js] --> RD[generator/runtime/render-deck.js]
  IDX --> TP[generator/runtime/template-package.js]
  IDX --> DIAG[generator/runtime/diagnostics.js]
  IDX --> OVR[generator/strict/overlap.js]
  IDX --> PPA[generator/postprocess/slides-adapter.js]

  RD --> PAG[generator/runtime/paginate.js]
  RD --> B1[builders/cover-slide.js]
  RD --> B2[builders/contents-slide.js]
  RD --> B3[builders/one-column-text.js]
  RD --> B4[builders/two-column-text.js]
  RD --> B5[builders/analysis-*.js]
  RD --> B6[builders/back-cover-slide.js]

  B1 --> H[generator/helpers/*]
  B2 --> H
  B3 --> H
  B4 --> H
  B5 --> H
  B6 --> H
```

## 5) Data Contracts

```mermaid
classDiagram
  class DeckSpec {
    +meta
    +slides[]
  }

  class SlideSpec {
    +type
    +slot fields
  }

  class TemplateLayouts {
    +types
    +slots
    +masters
  }

  class QaReport {
    +valid
    +errors[]
    +warnings[]
    +missingSlots[]
    +overlapSummary
    +postprocess
    +summary
  }

  DeckSpec --> SlideSpec
  SlideSpec --> TemplateLayouts
  DeckSpec --> QaReport
```

- `DeckSpec`: The full input JSON for one presentation run. It contains deck-level info and the ordered list of slides.
- `SlideSpec`: One slide definition inside `DeckSpec`. It tells the generator which slide `type` to render and provides that type's content fields.
- `TemplateLayouts`: The template rules loaded from `layouts.json` (what slide types exist, what slots are required, and where content should go).
- `QaReport`: The final JSON quality report produced after generation, including validation results, warnings, missing slots, and overlap checks.

## Operational Notes
- Add new slide types by updating `templates/.../layouts.json`, then mapping in `generator/runtime/render-deck.js`.
- Keep QA stable: if report shape changes, update consumers in lockstep.
- Keep template assets resolved through `template-package.js` rather than hardcoded paths.
