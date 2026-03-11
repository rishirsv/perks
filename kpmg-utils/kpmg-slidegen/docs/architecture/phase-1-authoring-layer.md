# Phase 1 Authoring Layer Architecture

## Goal

Phase 1 adds a repo-only authoring layer and schema layer that can scale slide layout creation without changing the current runtime contract.

## Terms

### Primitive

A primitive is a reusable rendering building block. It defines which builder module will eventually render it, which geometry keys it expects, which slot schema it aligns to, and which default pagination and compare policies apply.

Phase 1 location:
- `templates-src/kpmg-diligence/primitives/`
- `generator/builders/primitives/`

### Layout Instance

A layout instance is the user-facing slide type definition that points at one primitive version and supplies concrete geometry for that specific layout. This keeps `slide.type` as the external API while reducing one-builder-per-layout sprawl.

Phase 1 location:
- `templates-src/kpmg-diligence/layouts/`

### Onboarding Case

An onboarding case is the repo-only workspace for converting one source slide into a candidate layout definition and candidate deck spec, with deterministic review artifacts alongside it.

Phase 1 location:
- `onboarding/cases/<case-id>/`

### Generated Runtime Aggregate

The generated runtime aggregate is the future compiled output that preserves the current runtime shape. It will be produced from repo-only authoring inputs and written back into the existing runtime/template surfaces the generator already reads:

- `templates/kpmg-diligence/package/layouts.json`
- `generator/runtime/onboarded-registry.index.json`
- `generator/runtime/onboarded-registry.generated.js`

Phase 1 does not generate these files yet. Their contract stays unchanged.

### Portable Skill Bundle

The portable skill bundle is the distributable under `skills/kpmg-slides/`. It should continue to receive only the existing runtime-ready template tree and generator assets. Repo-only authoring fragments under `templates-src/` and `onboarding/cases/` must stay out of the bundle until a later phase explicitly changes that boundary.

## Boundary Rule

Author by fragments in repo-only sources, then generate the current runtime package shape. Do not point runtime imports at `templates-src/` in Phase 1.
