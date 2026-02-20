# Plan – kpmg contract validation research

## Overview
1.0 Review the existing schemas, renderer contracts, and runtime helpers so we understand what data is already accepted, validated, and reported on during deck generation.
2.0 Analyze how those rules surface strengths or gaps around required slots, density scoring, and repair hooks to spot missing expectations or validation blind spots.
3.0 Summarize what we learned and recommend schema or QA additions that strengthen strict validation, density checks, and repair guidance.

## Task List
- [x] 1.0 Map schema fields and runtime contracts (ensures we can reference the current rules).
  - [ ] 1.1 Capture how density/repair hooks are emitted in renderer/runtime flow.
- [ ] 2.0 Identify strengths, missing fields, and QA observability gaps (high level review of contracts vs runtime behaviors).
  - [ ] 2.1 Note where slot validation covers/checks each field and where it falls short.
  - [ ] 2.2 Track QA hooks that already run (density, overlap, pagination, repairs).
- [ ] 3.0 Propose schema/QA additions aligned to strict validation, density targets, and repair hooks.
  - [ ] 3.1 Recommend specific fields to add or tighten with validation logic.
  - [ ] 3.2 Suggest QA hooks or diagnostics to capture missing data, sparse slides, or repair opportunities.
