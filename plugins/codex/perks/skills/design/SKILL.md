---
name: design
description: Use when doing explicit UI, product, brand, visual-system, UX critique, screenshot-led polish, design-doc, taste-distillation, or design-hardening work. Not for backend-only tasks, generic styling chores, ordinary copyediting, or throwaway prototypes.
---

# Design

Design handles high-craft UI, product, brand, visual-system, UX critique, polish, hardening, design docs, and taste distillation. Match the work to the surface: product UI should earn user trust quickly; brand surfaces need a point of view.

## Scope

Use this skill for explicit design work:

- create or redesign a UI surface
- critique UX or visual quality
- polish a rendered surface
- harden UI states, accessibility, layout, and copy
- initialize or refresh `docs/DESIGN.md`
- distill screenshots, references, or existing UI into `taste.md` or `TASTE.md`
- translate visual references into implementation guidance

Do not use this skill for backend-only work, generic code cleanup, ordinary copyediting, or throwaway prototypes.

## Start

1. Read the request literally: edit when asked to edit; stay read-only when asked to review.
2. Load `docs/DESIGN.md` first when present.
3. Check for `taste.md` or `TASTE.md`.
4. Gather only relevant context: screenshots, previews, components, tokens, assets, brand docs, product specs, active plans, and existing routes.
5. Classify the work as `product`, `brand`, or mixed.
6. Choose one lane and load only the needed reference.
7. Inspect rendered output whenever tools allow it.

## Lane Selection

- `init`: create or refresh `docs/DESIGN.md`; read [references/init.md](references/init.md).
- `distill`: extract visual rules from screenshots, references, generated mockups, or surface families; read [references/distill.md](references/distill.md).
- `craft`: create or substantially redesign a surface in the real stack; read [references/craft.md](references/craft.md).
- `audit`: critique or audit without editing; read [references/audit.md](references/audit.md).
- `polish`: improve an existing functional surface through visual passes; read [references/polish.md](references/polish.md).
- `harden`: make an existing surface survive real data, failure states, accessibility, devices, and localization; read [references/harden.md](references/harden.md).

For typography, color, layout, imagery, motion, brand landing pages, product micro-polish, and design-system discipline, read [references/lenses.md](references/lenses.md) only when that axis matters.

For visible UI text, labels, alt text, empty states, errors, notifications, and accessibility copy, read [references/ui-copy.md](references/ui-copy.md).

## Product Or Brand

Product surfaces are app UIs, dashboards, settings, tools, data tables, forms, authenticated screens, and repeated workflows. Design serves task completion and category trust.

Brand surfaces are landing pages, marketing pages, campaign pages, portfolios, showcases, and public narrative surfaces. Design is part of the deliverable and must carry a memorable point of view.

Mixed surfaces should follow the current task. A product can have a brand-led welcome screen; a marketing site can contain product UI examples.

## Visual Evidence

Use the strongest available way to see the UI:

1. Native app, simulator, device, preview, or screenshot tooling.
2. Browser, Agent Browser, or in-app browser for web or local targets.
3. Project-native screenshot, snapshot, or preview tooling.
4. Existing screenshots or user-provided images.
5. Static code review only when rendering is unavailable.

If rendering is unavailable, say what could not be verified.

## Quality Contract

End every design task with:

- intent
- primary user state
- evidence inspected
- changes made or findings
- checks run, including viewports and states where relevant
- accessibility checks where relevant
- unresolved risk

For audits, lead with findings ordered by severity. For implementation lanes, lead with what changed and what was verified.

## Guardrails

- Do not invent a new product direction during polish.
- Do not let generated mockups override product semantics, accessibility, platform conventions, or real content.
- Do not ship uninspected UI when rendering is available.
- Do not expose implementation leakage in user-facing copy.
- Preserve useful local design doctrine; move deeper reasoning into the appropriate reference rather than deleting it.
