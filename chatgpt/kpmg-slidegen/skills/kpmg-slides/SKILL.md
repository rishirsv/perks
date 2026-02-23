---
name: kpmg-slides
description: Create high-density diligence deck content and generate KPMG SlideGen presentations with QA artifacts. Use when converting meeting notes, analyses, or outlines into deckSpec JSON, mapping content to supported slide layouts/slots, running the generator, and iterating on revisions until quality checks pass.
---

# KPMG Slides

## Overview

Use this skill to run a strict, repeatable workflow from content drafting to PPTX output. Produce dense executive narrative, map content to valid slots, run generation with visual checks enabled, then summarize QA and next edits.

## Workflow

1. Frame the request and decision objective.
   Confirm audience, decision needed, and whether context already exists in-thread.
   If context is thin, produce a concise outline first, then draft slide content.
2. Build a slide map and slot plan.
   Select supported slide types only, then ensure each required slot is planned before writing optional slots.
   Keep titles short and decision-oriented, and enforce per-layout constraints.
3. Write or revise `deckSpec`.
   Use `references/deckspec-schema.md` for slot-level rules and `references/deck-authoring.md` for writing standards.
   Prefer clear business claims with quantified support and explicit caveats.
4. Generate artifacts using the canonical runner.
   Run `scripts/run_kpmg_slides.sh --in <deckspec.json>`.
   This always runs visual postprocess and writes deterministic artifacts.
5. Review QA and iterate.
   Summarize pass/fail, blocking issues, advisory issues, and concrete fixes.
   If the deck auto-splits or shows overlap warnings, tighten copy and regenerate.

## Output Contract

Return the following in your final response:

1. DeckSpec path used.
2. Generated PPTX path.
3. QA JSON path.
4. Preview directory and montage path (when postprocess succeeds).
5. Postprocess status from QA (preview, montage, overflow visual).
6. Executive summary of key QA findings and recommended edits.

## Writing Standards

1. Write in prose when useful and bullets when they are better for scanning.
2. Use executive tone with complete, decision-relevant sentences.
3. Keep each bullet concise but substantive, avoiding filler and repetition.
4. Use subheaders inside narrative slides to improve readability under dense content.
5. Include source/note fields where layouts support them.

## Commands

### Canonical run

```bash
skills/kpmg-slides/scripts/run_kpmg_slides.sh --in decks/lorem-comprehensive.deckSpec.json
```

### Optional custom output directory

```bash
skills/kpmg-slides/scripts/run_kpmg_slides.sh --in decks/lorem-comprehensive.deckSpec.json --out-dir outputs/custom-run
```

## References

1. `references/deckspec-schema.md`: Supported slide types, required slots, and constraints.
2. `references/deck-authoring.md`: Narrative architecture, density heuristics, and revision loop guidance.
