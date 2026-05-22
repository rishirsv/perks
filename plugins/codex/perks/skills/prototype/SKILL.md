---
name: prototype
description: Build prototypes and visual reference artifacts to answer design, UI, state, business-logic, or data-shape questions before committing to production code. Use when the user wants to prototype, sanity-check a state model or data model, generate imagegen UI mockups, make A/B/C interface option boards or contact sheets, explore radically different UI directions, create a throwaway route with switchable variants, refine a selected mock into a full-resolution implementation reference, or says "prototype this", "let me play with it", "mock this", "show a few options", or "try a few designs".
---

# Prototype

A prototype is work that answers a question before production implementation. The question decides the shape.

Some prototypes are intentionally throwaway, especially logic prototypes and route-variant code. Others are durable reference artifacts: imagegen boards, contact sheets, selected full-resolution mockups, or visual references that guide the final UI build.

## Pick A Branch

Identify the question being answered from the prompt, surrounding code, design docs, screenshots, or by asking only when the core question itself is unclear. Then load the relevant branch file.

- **"Does this logic, state model, or data shape feel right?"** -> [LOGIC.md](LOGIC.md). Build a tiny interactive terminal app that pushes the model through cases that are hard to reason about on paper.
- **"What should this look like, and what reference should guide the build?"** -> [UI.md](UI.md). Generate imagegen mockups, option boards, contact sheets, selected full-resolution reference mocks, and/or several radically different UI variations on a route, switchable via `?variant=`.

The two branches produce different artifacts. If the question is genuinely ambiguous and the user is not reachable, default to whichever branch better matches the surrounding code: backend module -> logic; page, component, screenshot, or flow -> UI. State the assumption at the top of the prototype.

## Rules That Apply To Both

1. **Mark the artifact's role.** Code prototypes should be clearly throwaway. Imagegen boards and selected reference mockups should be clearly labeled as design references, not implementation truth.
2. **One command or one artifact to inspect.** If code is involved, the user must be able to start it without thinking. If imagegen is involved, the output must be directly viewable and tied to the decision it answers.
3. **No persistence by default.** State lives in memory. Persistence is the thing the prototype is checking, not something it should depend on. If the question explicitly involves persistence, use a scratch DB or local file with a clear `PROTOTYPE - wipe me` name.
4. **Skip production polish for code prototypes.** No tests, no broad error handling, no abstractions, no migration paths. The point is to learn something fast and delete or absorb it. Visual reference artifacts can be polished enough to guide implementation.
5. **Surface the state or decision.** After every action in logic prototypes, print the relevant state. For UI prototypes and mockups, make the compared options, preserved constraints, and decision question visible.
6. **Delete, absorb, or retain as reference when done.** When prototype code has answered its question, delete it or fold the validated decision into real code under normal production constraints. When a visual artifact is selected as the implementation reference, keep it with the decision record or feature context.

## When Done

The answer is the main thing worth keeping from a prototype. For visual work, the selected reference image may also be worth keeping.

Capture it somewhere durable: commit message, ADR, issue, product note, design note, or a `NOTES.md` next to the prototype. Include the question it answered, the selected direction, why it won, and any reference image that should guide implementation.

If the user is around, that capture can be a quick conversation. If not, leave a placeholder so they or a later agent can fill in the verdict before deleting the prototype.
