# TS Engagement Assistant — Conditional Section Removal (Phase 1: Independence Considerations)

## Summary
Implement deterministic removal of the **Independence Considerations** section when it does not apply (non‑assurance client), matching the guidance in the “Unmodified templates”. This reduces strict/incorrect SEC-status gating and improves generation reliability.

This phase focuses on **one removable section** and the minimal supporting changes required across:
- schema (`el-placeholder-schema.json`)
- templates (`*.docx`)
- generator (`el-generate.py`)
- system prompt (`ts-engagement-assistant.md`)

---

## Why this is the next 2–3 things to fix

### P0 — Generation reliability (biggest blocker)
- **Failure:** “Analysis errored” / wrong generator invocation (`from el_generate import …`, positional vs flags).
- **Fix:** Force one canonical execution pattern in the system prompt (subprocess to `el-generate.py`) and keep the generator tolerant of positional invocations, with a single, clear fallback path.

### P0 — Independence section handling is too strict + conceptually wrong for “non‑audit / non‑SEC”
- **Failure:** Users who say “not audited / not SEC” are forced into `CHOICE_SEC_STATUS`, producing either frustration (“too strict”) or a legally-wrong “closest match”.
- **Fix:** Add a yes/no question that determines whether the Independence Considerations section applies; if **No**, delete the entire section during generation.

### P1 — “TBD / N/A” strictness (reduce frustration)
- **Failure:** Strict gating on required fields causes loops; users want to proceed with `TBD`/`N/A`.
- **Fix:** Treat `TBD`/`N/A` as acceptable values generally, but keep a tiny “legal risk” must-ask set (implemented later, after Phase 1).

---

## Ground truth (Unmodified templates)
From `chatgpt/ts-sow/reference/Unmodified templates/*.docx`:
- The Independence section is described as **mandatory if the client/target are assurance clients** and should be **deleted if not applicable**.
- The unmodified templates contain bracketed guidance + bracketed option text; the dist templates currently use `{{CHOICE_SEC_STATUS}}`, making the section feel “always required”.

Phase 1 makes “delete if not applicable” deterministic.

---

## Scope (single issue)
Implement **conditional removal** of the “Independence Considerations” section in both templates during generation.

### User-facing behavior
- Ask one question (plain language):
  - “Are Client (and for sellside: Client or Target) an assurance/audit client of KPMG (or affiliate/related entity)?”
- If **No**:
  - Remove Independence Considerations heading + its paragraphs from the generated `.docx`
  - Do **not** ask for `CHOICE_SEC_STATUS`
- If **Yes**:
  - Ask for `CHOICE_SEC_STATUS` (exact option)
  - Include the section as normal

---

## Interfaces / schema changes

### Add a new key
- **Key:** `CHOICE_INDEPENDENCE_APPLIES`
- **Type:** `choice`
- **Options:** `yes`, `no`
- **Applies to:** `buyside`, `sellside`
- **Required:** `true`
- **Location:** schema group 7 (Relationship Disclosures)

### Conditional requirement
- `CHOICE_SEC_STATUS` becomes conditionally required:
  - required only if `CHOICE_INDEPENDENCE_APPLIES=yes`
  - ignored (and may be absent) if `CHOICE_INDEPENDENCE_APPLIES=no`

---

## Template change strategy

### Approach A (preferred): explicit block markers
Wrap the Independence Considerations block with two standalone-marker paragraphs:
- `{{BLOCK_INDEPENDENCE_START}}`
- `{{BLOCK_INDEPENDENCE_END}}`

Rules:
- If section applies: delete **only** the marker paragraphs.
- If section does not apply: delete marker paragraphs **and everything between them**.

Why:
- Deterministic, does not depend on fragile heading matching.
- Generalizes to other removable sections later.

Fallback (if markers missing): delete from “Independence Considerations” heading to (but not including) the next heading “Management’s Responsibilities”.

---

## Generator changes (`el-generate.py`)
Add a pre-processing step **before placeholder extraction**:
1. Read `CHOICE_INDEPENDENCE_APPLIES`.
2. If `no`: remove the Independence block (between markers).
3. If `yes`: remove only the marker lines.
4. Proceed with placeholder extraction → derive/default → replacement → “no `{{…}}` remain”.

Update gating:
- Remove `CHOICE_SEC_STATUS` from global must-ask.
- Enforce `CHOICE_SEC_STATUS` only when `CHOICE_INDEPENDENCE_APPLIES=yes` and the template still contains `{{CHOICE_SEC_STATUS}}`.

---

## Prompt changes (`ts-engagement-assistant.md`)
- Add a Terms-stage question for `CHOICE_INDEPENDENCE_APPLIES` (yes/no).
- If `no`: skip SEC status question and Canvas field entirely.
- If `yes`: ask for SEC status from the allowed list.
- Add a strict rule: **never import generator modules**; always run via subprocess call to `el-generate.py`.

---

## “10 minutes from our people” checkpoint
Before rolling out broadly:
- Confirm with the internal owner (risk/independence) that removing the entire Independence section is correct whenever the answer is “not an assurance/audit client of KPMG (and not affiliate/related entity)”.
- Confirm sellside scope: Client vs Client-or-Target.

---

## Implementation checklist
- [ ] 1.0 Confirm policy (10 minutes)
  - [ ] 1.1 Confirm “when to delete independence section” for buyside/sellside
  - [ ] 1.2 Confirm sellside scope: Client vs Client/Target
- [ ] 2.0 Add schema toggle
  - [ ] 2.1 Add `CHOICE_INDEPENDENCE_APPLIES`
  - [ ] 2.2 Document conditional `CHOICE_SEC_STATUS`
- [ ] 3.0 Add template block markers (dist templates)
  - [ ] 3.1 Insert `{{BLOCK_INDEPENDENCE_START}}` / `{{BLOCK_INDEPENDENCE_END}}` around the Independence section in both templates
- [ ] 4.0 Generator block deletion
  - [ ] 4.1 Implement marker-based delete utility (with heading-based fallback)
  - [ ] 4.2 Apply it before placeholder extraction
  - [ ] 4.3 Conditional SEC-status gating when applicable
- [ ] 5.0 Prompt update
  - [ ] 5.1 Ask independence applicability question in Terms
  - [ ] 5.2 Skip SEC status if `no`
  - [ ] 5.3 Canonical Code Interpreter invocation (subprocess; no imports)
- [ ] 6.0 Validation
  - [ ] 6.1 Buyside: `no` → section removed
  - [ ] 6.2 Buyside: `yes` + SEC status → section present
  - [ ] 6.3 Sellside: same two cases
  - [ ] 6.4 Confirm no remaining `{{…}}` tokens

---

## Test scenarios (acceptance)
1) **Non-assurance client**
- Inputs: minimal required fields; set `CHOICE_INDEPENDENCE_APPLIES=no`; omit `CHOICE_SEC_STATUS`
- Expected: generation succeeds; Independence section is absent.

2) **Assurance client**
- Inputs: `CHOICE_INDEPENDENCE_APPLIES=yes` and valid `CHOICE_SEC_STATUS`
- Expected: section present; reads “Client is <status> of KPMG…”.

3) **User says “not audited / not SEC”**
- Expected: assistant asks applicability yes/no; does not force “closest” SEC status option.

---

## Assumptions / defaults
- `CHOICE_INDEPENDENCE_APPLIES` cannot be `TBD`/`N/A`. If user tries, the assistant asks a follow-up: “yes or no?”.
- Broader acceptance of `TBD`/`N/A` for other fields is a follow-on (Phase 2).
