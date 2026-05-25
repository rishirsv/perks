---
name: refining-architecture
description: "Use when scanning a repo, area, screen, or scoped file list to find and record actionable architecture, reuse, quality, efficiency, or verification debt in the repo-native tracker, without editing the code that has the problem; not for fixing the current diff (use $simplify), removing fallback or compatibility code (use $hard-cut), or assessing agent-readiness and feedback loops (use $harness-engineering)."
---

# Refining Architecture

Find architecture and code-quality improvement opportunities, then record them in the repo-native tracker. This skill writes tracker entries; it does not edit the code that has the problem.

## Contract

- Analyze and record findings; do not edit the code that has the problem.
- Use parallel review workers as the default review engine.
- Prefer actionable, evidence-backed entries over broad architecture essays.
- Preserve the target repo's existing tracker format when one exists.
- Merge into existing related tracker entries instead of duplicating them.
- If a finding is speculative, mark it as speculative and explain what evidence would confirm it.
- If a finding contradicts an existing architecture decision, record it only when the friction is real enough to justify revisiting that decision.

If during the scan the user asks for an implementation pass on a recorded finding, stop, hand off to `$simplify` (for diff-scope fixes) or `$hard-cut` (for removing fallback or compatibility code), and resume tracking afterward.

## Inputs And Outputs

Use these inputs:

- The user's requested scope, when provided.
- Current git state and recent diffs.
- Relevant code, tests, validation commands, docs, architecture decisions, domain glossaries, and existing tracker entries.
- Evidence gathered from repo inspection, commands, subagents, or source links.

Produce these outputs:

- Updates to the repo-native tracker. If no tracker exists, ask the user where to record findings before scanning — do not create one unprompted.
- A concise chat summary of what was scanned, what changed in the tracker, the top recommendation, and any intentionally skipped areas.

## Architecture Vocabulary

Use this vocabulary consistently in architecture findings:

- **Module**: anything with an interface and an implementation: function, class, package, screen, workflow, or slice.
- **Interface**: everything a caller must know to use the module correctly: types, invariants, ordering constraints, error modes, configuration, and performance characteristics.
- **Implementation**: the code inside a module.
- **Depth**: leverage at the interface. A **deep** module gives callers a lot of behavior behind a small interface. A **shallow** module has an interface nearly as complex as its implementation.
- **Seam**: where an interface lives; a place behavior can be altered without editing in place.
- **Adapter**: a concrete thing satisfying an interface at a seam.
- **Leverage**: what callers get from depth: more capability per unit of interface they must learn.
- **Locality**: what maintainers get from depth: change, bugs, knowledge, and verification concentrated in one place.

Core principles:

- **Depth is a property of the interface, not the implementation.** A module can have internal seams inside its implementation; callers should not need to know them.
- **Deletion test**: imagine deleting the module. If complexity vanishes, it was a pass-through. If complexity reappears across many callers, it was earning its keep.
- **The interface is the test surface.** If tests must reach past the interface to cover important behavior, the module may be the wrong shape.
- **One adapter means a hypothetical seam. Two adapters means a real seam.** Do not introduce a seam unless something actually varies across it.

## Scope Selection

Use the current repository as the target unless the user gives a different path.

If the user names a scope, honor it:

- "Review this screen" means scan the screen, its model/state/data path, adjacent tests, and nearby shared modules.
- "Review this area of the repo" means scan that directory/module plus callers and tests needed to understand the interface.
- "Review this logic" means scan the named flow, its entry points, outputs, invariants, and verification surface.
- A file list means stay focused on those files and directly related callers/helpers.

For a general scan, map first, then inspect 2-4 high-signal slices:

1. Recent git changes or recently modified files.
2. Core modules, workflows, screens, packages, or runtime surfaces.
3. Existing architecture docs, ADRs, domain glossaries, plans, or tracker files.
4. Tests, validation commands, CI config, and known verification gaps.

## Workflow

### Phase 1: Identify Scope And Evidence

Inspect the repo before scanning:

```bash
git status -sb
git diff --stat
rg --files
```

Run `git diff` or `git diff HEAD` if there are staged changes to see what changed. If there are no git changes, review the most recently modified files that the user mentioned or that are relevant to the requested scope.

Read only the docs and code needed to understand the requested scope. Build just enough map for the scan:

- Entry points, user-facing surfaces, or runtime paths.
- Core modules and the interfaces other code depends on.
- Important data flow, state ownership, persistence, network, or external adapters.
- Tests and validation commands that should prove behavior.
- Architecture docs, ADRs, domain glossaries, and existing tracker entries when they exist.

Use domain vocabulary from the repo when it exists. For example, if a repo calls a concept "Order intake," use that name instead of an implementation class name.

#### Behavior Lock

Activate this phase when the user explicitly asks to deslop, clean up generated code, perform a deep cleanup review, or passes a scoped file list.

1. Identify behavior that must not change in the target files.
2. Check whether existing tests cover that behavior.
3. If critical behavior is untested, record the narrowest regression test needed before editing.
4. Skip this phase for routine scans where changes are small and well-tested.

### Phase 2: Locate The Tracker

Find the output target in this order:

1. Use the tracker path named by the user.
2. Use an existing repo-native tracker or backlog. Read `AGENTS.md`, `README.md`, docs indexes, and the root for tracker files (names vary by repo, e.g., `WORK-TRACKER.md`, `TECH-DEBT.md`, `docs/TECH-DEBT.md`, `docs/tech-debt.md`, `BACKLOG.md`).
3. If no tracker exists, **ask the user** where to record findings and which filename matches their convention. Do not create a tracker unprompted. Only when the user confirms a path, create the file and seed it with a short maintenance note (entries need evidence, location, why it matters, suggested fix, verification; merge related findings; update status as work moves).

### Phase 3: Launch Three Review Agents In Parallel

Spawn subagents to launch all three worker agents concurrently in a single message. Pass each agent the full diff or scoped evidence packet so it has the complete context.

Each worker must:

- Use available skills, plugins, repo guidance, and repo review guidance when they apply to the scanned code.
- Consider the architecture vocabulary and core principles above.
- Return tracker-ready findings with evidence, representative files, recommendation strength, and verification expectations.
- Return no implementation patches.

If subagents are unavailable, run the same three reviews yourself as separate passes before aggregating findings.

#### Agent 1: Reuse, Structure, And Architecture Review

For each change or scoped area:

1. **Search for existing utilities and helpers** that could replace newly written code. Use `rg` to find similar patterns elsewhere in the codebase. Common locations are utility directories, shared modules, and files adjacent to the changed ones.
2. **Flag any new function that duplicates existing functionality.** Suggest the existing function to use instead.
3. **Flag any inline logic that could use an existing utility**: hand-rolled string manipulation, manual path handling, custom environment checks, ad-hoc type guards, and similar patterns are common candidates.
4. **Look for structural simplifications** that preserve behavior while deleting branches, modes, helper layers, special cases, or concepts.
5. **Flag refactors that move complexity around without reducing it.** Prefer reframing the model, ownership boundary, or default flow so less code is needed.
6. **Flag feature-specific logic added to shared or unrelated paths.** Push logic toward the canonical package, module, helper, or abstraction that already owns the concept.
7. **Flag new ad-hoc conditionals and one-off flags** that make an existing flow harder to reason about. Prefer a clearer model, dispatcher, policy object, or focused helper.
8. **Flag shallow modules** where the interface is nearly as complex as the implementation.
9. **Apply the deletion test** to suspected pass-through modules: if deleting the module makes complexity vanish, it was not earning its keep; if complexity reappears across many callers, it may be worth deepening.
10. **Flag leaky seams** where callers must know implementation details.
11. **Flag concepts spread across many files** when one deeper module could improve locality.
12. **Flag interfaces that make tests reach into internals** instead of exercising behavior through the public seam.
13. **Flag seams with only one adapter** unless the variation is imminent and concrete.

Favor findings where reuse or simplification also improves module depth, leverage, or locality.

#### Agent 2: Code Quality Review

Review the same changes or scoped area for quality problems and drafted-code patterns:

1. **Redundant state**: state that duplicates existing state, cached values that could be derived, observers/effects that could be direct calls.
2. **Parameter sprawl**: adding new parameters or booleans to a function instead of generalizing or restructuring existing ownership.
3. **Copy-paste with slight variation**: near-duplicate code blocks that should be unified with a shared abstraction or a simpler single flow.
4. **Leaky abstractions**: exposing internal details that should be encapsulated, or breaking existing abstraction seams.
5. **Stringly-typed code**: using raw strings where constants, enums, string unions, or branded types already exist in the codebase.
6. **Needless abstraction**: pass-through wrappers, single-use helper layers, identity helpers, speculative indirection, or generic mechanisms that hide a simple data shape.
7. **Over-defensive code**: try/catch around code that cannot throw, null checks on values that are never null, fallback defaults that can never trigger, and broad "just in case" guards that hide invariants.
8. **Verbose naming**: names that restate the type or context (`userDataObject`, `handleOnClickEvent`), or names padded with unnecessary qualifiers.
9. **Dead code / debug leftovers**: unused imports, unreachable branches, stale feature flags, `console.log` statements, commented-out code blocks, and abandoned TODO scaffolding.
10. **Unnecessary comments and narration**: comments that restate obvious code, explain what changed instead of why it must exist, or sound like implementation notes from a draft.
11. **Cast-heavy or loose contracts**: `any`, `unknown`, forced casts, unnecessary optionality, or ad-hoc object shapes used to bypass clear type seams.
12. **Boilerplate scaffolding**: placeholder helpers, generic adapters, empty extension points, or configuration surfaces that were added because they seem reusable but are not needed by the current design.
13. **Inconsistent local style**: code that ignores the surrounding file's naming, error handling, import organization, testing pattern, or module shape in a way that makes the change look pasted in.

Tie quality findings back to architecture when possible: explain whether the problem weakens locality, expands an interface, leaks an implementation detail, or hides a useful invariant.

#### Agent 3: Efficiency And Verification Review

Review the same changes or scoped area for efficiency and confidence:

1. **Unnecessary work**: redundant computations, repeated file reads, duplicate network/API calls, N+1 patterns.
2. **Missed concurrency**: independent operations run sequentially when they could run in parallel.
3. **Hot-path bloat**: new blocking work added to startup or per-request/per-render hot paths.
4. **Unnecessary existence checks**: pre-checking file/resource existence before operating: operate directly and handle the error.
5. **Memory**: unbounded data structures, missing cleanup, event listener leaks, retained references.
6. **Overly broad operations**: reading entire files when only a portion is needed, loading all items when filtering for one.
7. **Verification gaps**: important behavior that lacks a focused test, manual check, or validation command.
8. **Awkward test surfaces**: tests that must reach past the interface or mock internals because the module shape lacks depth or locality.

Tie efficiency and verification findings back to architecture when possible: the strongest entries explain which module, interface, or seam should own the improvement.

### Phase 4: Aggregate And Triage Findings

Wait for all three agents to complete. Aggregate their findings before editing the tracker. Prefer deleting complexity over rearranging it when describing the suggested improvement.

If a finding is a false positive or not worth recording, note it in the chat summary and move on. Do not argue with the finding.

Do not treat code as healthy merely because tests pass if it leaves obvious needless indirection, weak locality, loose contracts, or a more tangled local design. If a structural cleanup is valid but too large to handle safely in a single implementation pass, record a short follow-up entry with the exact scope.

Record only findings that are actionable enough to guide later work. Prefer findings with one or more of:

- Repeated friction across callers, tests, or workflows.
- Clear locality or leverage gain.
- Duplicated logic that should move behind one interface.
- A shared module absorbing feature-specific complexity.
- A validation gap that makes future changes risky.
- Drafted-code scaffolding, pass-through layers, or over-defensive code that obscures the intended model.
- Hot-path, memory, concurrency, or broad-operation efficiency risk.

Skip or explicitly downgrade:

- Pure preferences without evidence.
- Refactors that only move complexity around.
- One-off polish that belongs in an ordinary code review.
- Findings already represented by a current tracker item.

Use recommendation strength values:

- `Strong`: clear evidence, meaningful locality/leverage or risk reduction, bounded next step.
- `Worth exploring`: plausible improvement, enough evidence to investigate.
- `Speculative`: weak evidence; record only if useful for future exploration.

### Phase 5: Update The Tracker

Preserve the current tracker style. If there is no style, use this fallback entry shape:

```markdown
### <short title>

- Recommendation: Strong | Worth exploring | Speculative
- Source: <scan date, user request, PR/comment URL, command, or other evidence>
- Where: <file/module/area>
- Finding: <what is causing friction>
- Why it matters: <risk, maintenance cost, locality/leverage loss, or user impact>
- Suggested improvement: <bounded architecture or cleanup direction>
- Verification: <focused check, test, review, or manual proof expected after implementation>
```

Avoid dumping raw review notes into the tracker. Preserve the evidence and summarize the actionable debt.

After updating the tracker, run tracker quality gates:

- Verify entries are minimal and scoped; no unrelated tracker churn crept in.
- Verify every new entry has evidence, location, why it matters, suggested improvement, and verification.
- Run a relevant non-mutating validation command only if needed to confirm evidence or identify the expected verification.
- Do not run broad test, lint, or typecheck commands just to prove no code changed.

### Phase 6: Report Back

Summarize:

- Tracker path updated or created.
- Number of entries added, merged, skipped, or downgraded.
- Top recommendation and why it is first.
- Areas scanned and areas intentionally left unscanned.

Do not claim fixes were made. This skill records improvement opportunities.
