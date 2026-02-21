# Plan: Canonical KPMG SlideGen Skill Bundle

## Goal
Create a canonical, self-contained `skills/kpmg-slidegen/` bundle and sync it into harness locations without contract drift.

## Non-technical outcomes by phase
- Phase 1: One stable source folder exists for all future skill edits.
- Phase 2: Skill metadata and UI metadata comply with skill-authoring standards.
- Phase 3: Stage prompts match real schema contracts and avoid stale skeleton drift.
- Phase 4: Schemas and references are portable and generated from canonical contracts.
- Phase 5: Deterministic scripts make run creation, validation, rendering, and sync repeatable.
- Phase 6: Harness copy and docs references point at the new structure.

## Task list
- [x] 1.0 Create canonical folder and baseline files
- [x] 1.1 Bootstrap canonical skill folder under `skills/kpmg-slidegen/`
- [x] 1.2 Add this plan file in `docs/canonical-skill-bundle/`
- [x] 1.3 Validation for 1.0 (folder tree exists)

- [x] 2.0 Refactor metadata and skill body
- [x] 2.1 Replace `SKILL.md` with compliant frontmatter (`name`, `description` only)
- [x] 2.2 Rewrite `agents/openai.yaml` with `interface:` root and quoted strings
- [x] 2.3 Validation for 2.0 (quick validate passes)

- [x] 3.0 Refactor prompts to schema-first contracts
- [x] 3.1 Add ordered prompts `00` to `40`
- [x] 3.2 Remove stale references to `templates/diligence-plus/catalog/slideCatalog.json`
- [x] 3.3 Align prompt outputs with `contentPack/deckPlan/deckSpec/qaReport` contracts
- [x] 3.4 Validation for 3.0 (prompt files exist and reference bundled schemas)

- [x] 4.0 Make schemas and references self-contained
- [x] 4.1 Copy canonical schema files into `skills/kpmg-slidegen/schemas/`
- [x] 4.2 Add references docs (`template_contract`, `qa_repair_playbook`, `troubleshooting`)
- [x] 4.3 Generate `references/slide_types_and_slots.md` from schema
- [x] 4.4 Validation for 4.0 (no external `$ref` in bundle schemas)

- [x] 5.0 Add deterministic wrapper scripts
- [x] 5.1 Add `new_run_dir.js`
- [x] 5.2 Add `validate_json.js`
- [x] 5.3 Add `render_strict.js` (strict wrapper without strict_overflow dependency)
- [x] 5.4 Add `contract_sync_check.sh`
- [x] 5.5 Add `sync_bundle_from_repo.sh`
- [x] 5.6 Validation for 5.0 (scripts execute and print expected outputs)

- [x] 6.0 Sync and align harness/docs
- [x] 6.1 Sync canonical bundle into `.agents/skills/kpmg-slidegen/`
- [x] 6.2 Update `docs/README.md` paths to canonical prompt names and locations
- [x] 6.3 Validation for 6.0 (docs references resolve, harness folder mirrors canonical)
