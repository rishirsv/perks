# Research: PR skill

## Research Questions

- What should the PR skill be named so it is easy to trigger and still leaves room for future GitHub skills?
- What scope should the PR skill own, especially now that `commit` exists as a separate skill?
- What does current GitHub guidance support for good pull requests: templates, linked issues, reviewers, diagrams, screenshots, and concise structure?
- Which `gh` CLI commands and flags should the skill rely on for a fast, non-interactive workflow?
- How should optional `@codex review` behavior fit into the skill without making it too opinionated?

## Summary

The best default name is `create-pr`, with `github-pr` as the strongest broader alternative. `create-pr` matches the existing prompt name in this repo, stays aligned with the new `commit` skill, and keeps the skill’s purpose crisp: turn a committed branch into a well-formed pull request. `github-pr` becomes better only if you want the skill to own a wider lifecycle beyond creation, such as later edits, check monitoring, or draft-to-ready transitions as first-class capabilities.

The scope should stay centered on PR publication, not general GitHub administration. The skill should inspect branch and auth state, ensure the branch is pushable, prepare a concise PR title and body, create the PR, optionally add reviewers/labels/assignees/draft state, and optionally post `@codex review` afterward. It should support small post-create refinements like `gh pr edit`, `gh pr checks`, and `gh pr ready`, but it should not absorb merge management, conflict resolution, review-response workflows, or broad project-board automation by default.

GitHub’s official docs support the building blocks needed for strong PRs: repository pull request templates, linked issues via keywords, requested reviewers, attached media, and Mermaid diagrams directly in pull request Markdown. The strongest practical pattern is a short PR body with sections for problem, change, validation, and reviewer guidance, plus screenshots or diagrams only when they materially reduce reviewer effort. The “Files changed” tab already gives exhaustive diff coverage, so the skill should summarize key files or reviewer hotspots only when that context is useful.

## Recommendations

1. Use `create-pr` unless you already know the skill will become a broader PR management tool. It is the best fit for the current repo because it matches [prompts/create-pr.md](/Users/rishi/Code/ai-tools/prompts/create-pr.md), pairs cleanly with [skills/commit/SKILL.md](/Users/rishi/Code/ai-tools/skills/commit/SKILL.md), and keeps invocation intent obvious.
2. Make the skill responsible for “publish this branch as a good PR,” not for every PR-related action on GitHub. Include preflight checks, structured PR writing, creation, optional reviewer assignment, optional draft mode, optional `@codex review`, and lightweight follow-up actions (`edit`, `view`, `checks`, `ready`). Leave merging and larger review-management workflows for a later skill or explicit user request.
3. Prefer `gh pr create --title ... --body-file ...` over relying on `--fill` by default. Official CLI docs show `--fill` and templates are available, but a skill-generated body is usually higher quality and more consistent for reviewer communication than raw commit-derived text.

## Comparison

| Name | Fit | Strengths | Trade-offs |
| --- | --- | --- | --- |
| `create-pr` | Recommended | Verb-led, matches existing prompt, clearly distinct from `commit`, easy to trigger | Slightly narrow if you later expand into lots of post-create PR management |
| `github-pr` | Good alternative | Broader umbrella, leaves room for create/edit/check/ready flows | Less action-oriented, slightly fuzzier trigger surface |
| `gh-pr` | Acceptable but not preferred | Signals CLI-centric workflow | Too tool-branded and less future-proof if you later mix GitHub connector tools |
| `pull-request` | Descriptive | Very explicit | Clunkier to invoke and less consistent with other short skill names |
| `publish-pr` | Interesting niche option | Emphasizes the end-to-end branch-to-PR handoff | Less standard wording; people are more likely to ask for “create PR” than “publish PR” |

## Key Points / Options

### Option 1: `create-pr` with focused publication scope

This is the cleanest shape for the next skill. It starts from the assumption that branch work already exists, checks whether a PR can be opened safely, writes a strong PR body, creates the PR, and optionally adds the most useful post-create actions. That fits the current prompt exactly and avoids a blurry boundary with the new `commit` skill.

This option also matches the safest side-effect model. If there are uncommitted changes, the skill can stop and recommend using `$commit` first, or explicitly perform that step only when the user asked for it. That keeps commit authorship and PR publication as separate responsibilities while still allowing a smooth handoff between the two skills.

### Option 2: `github-pr` as a broader workflow skill

This option is better if you already know you want one skill to handle create, edit, view, checks, ready/draft state, and maybe later merge preparation. The CLI surface supports that direction well: `gh pr create`, `edit`, `view`, `checks`, `ready`, `status`, and `comment` are all standard commands, and the local environment already has `gh` authenticated.

The trade-off is trigger ambiguity. A broad name like `github-pr` increases the chance that the skill becomes a catch-all for actions that deserve more careful boundaries. It also makes it easier to accidentally expand into review management and merging before you want that complexity.

### Option 3: Keep the scope narrow but allow small post-create refinements

This is the best operational compromise. The skill’s primary job is still “open a good PR,” but it may also fix obvious metadata after creation and optionally monitor checks. In practice that means supporting `gh pr edit`, `gh pr view`, `gh pr checks --watch`, `gh pr ready`, and `gh pr comment` after the PR exists.

This keeps the main intent sharp while avoiding a second skill for tiny follow-up steps. It also fits how `gh` is actually used in practice: creation is one command, but a polished PR often needs one or two immediate cleanup actions afterward.

## Sourced Facts

- GitHub Docs says that when you add a pull request template, contributors “automatically see the template's contents in the pull request body,” and that PR templates can live in the repository root, `docs`, or `.github` on the default branch. Source: [About issue and pull request templates](https://docs.github.com/en/enterprise-cloud%40latest/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates?apiVersion=2022-11-28).
- GitHub Docs says you can link a PR to an issue using keywords such as `closes`, `fixes`, or `resolves`, and that merge closes the linked issue when the PR targets the repository’s default branch. Source: [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).
- GitHub Docs says pull requests support Mermaid, geoJSON, topoJSON, and ASCII STL diagrams in Markdown, and that Mermaid diagrams work via fenced code blocks with the `mermaid` language identifier. Source: [Creating diagrams](https://docs.github.com/en/enterprise-cloud%40latest/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams?apiVersion=2022-11-28).
- GitHub Docs says reviewers can be requested after PR creation, including specific people and teams with the needed repository access. Source: [Requesting a pull request review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review).
- The local `gh` CLI on this machine is version `2.86.0` dated `2026-01-21`. `gh pr create` supports `--title`, `--body`, `--body-file`, `--draft`, `--reviewer`, `--template`, `--fill`, `--base`, `--head`, and `--dry-run`; `gh pr comment` supports `--body`; `gh pr edit` supports title/body/reviewer/label changes; `gh pr checks` supports `--watch`; and `gh pr ready` marks a draft PR ready. Source: local CLI help from `gh --version`, `gh pr create --help`, `gh pr comment --help`, `gh pr edit --help`, `gh pr checks --help`, and `gh pr ready --help`, run on April 5, 2026.
- `gh pr create --dry-run` may still push git changes according to the local help output. Source: local `gh pr create --help` run on April 5, 2026.
- `gh pr create` can prompt for pushing or forking when the current branch is not fully pushed; `--head` is the flag for explicitly controlling head branch behavior. Source: local `gh pr create --help` run on April 5, 2026.
- GitHub’s docs navigation and formatting docs confirm that advanced Markdown features used in PRs also include task lists, collapsed sections, and attached files. Source: [Creating diagrams](https://docs.github.com/en/enterprise-cloud%40latest/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams?apiVersion=2022-11-28) and the linked advanced-formatting docs family.

## Inference

The skill should not manually summarize every changed file in the PR body. GitHub already provides a dedicated “Files changed” view, so repeating the full list adds noise and goes stale. A better pattern is to include a “Key files” or “Reviewer hotspots” section only when it directs attention to a risky migration, a central architectural seam, or a non-obvious generated file.

Similarly, diagrams and screenshots should be conditional, not mandatory. GitHub makes them easy to include, but they are only worth the extra body length when reviewers would otherwise need to reconstruct a flow or visualize a UI change from the diff alone. For most small PRs, “Why / What / Validation / Linked issue” is enough. For UI, workflow, schema, or system-boundary changes, screenshots or Mermaid diagrams are worth it.

Because `commit` now exists separately, the PR skill should not quietly absorb commit-writing as normal behavior. The clean model is: if the branch is already committed and ready, create the PR; if not, either stop and ask the user to use `$commit`, or explicitly invoke that prerequisite only when the request clearly asks for end-to-end publication.

`@codex review` should be optional and default-off. It is a repo- or team-specific workflow choice, not a universal GitHub best practice. It also creates an external side effect after PR creation, so the skill should only post it when the user asked for it, when a skill argument or flag is set, or when a repository convention clearly calls for it.

## Risks & Considerations

- **Over-scoping the skill**: If the skill owns creation, editing, reviewing, merging, and branch cleanup, it will become hard to trigger safely and harder to keep concise. Mitigation: define the primary job as PR publication plus immediate polish only.
- **Weak PR bodies from `--fill`**: Commit subjects are often too terse or too implementation-centered to make good reviewer summaries. Mitigation: generate a body explicitly and use `--body-file`, with `--fill` as fallback only.
- **Unclear branch state**: `gh pr create` can trigger push or fork behavior when the branch is not fully pushed, and `--dry-run` is not side-effect free. Mitigation: inspect branch/remote state first and avoid using `--dry-run` as a harmless preview mechanism.
- **Noisy PR templates**: A template can improve consistency, but overly long default sections encourage low-signal PR descriptions. Mitigation: keep the skill’s body structure short and treat template sections as optional when empty.
- **Media with sensitive information**: Screenshots, logs, and diagrams can accidentally include customer data, credentials, or internal URLs. Mitigation: sanitize before upload and make media additive, not mandatory.

## Codebase Patterns

- [prompts/create-pr.md](/Users/rishi/Code/ai-tools/prompts/create-pr.md): The current prompt assumes a branch may need to be created, a commit may need to happen first, and `@codex review` is always posted after PR creation. This is a useful seed, but it is broader and more opinionated than the eventual skill should be.
- [skills/commit/SKILL.md](/Users/rishi/Code/ai-tools/skills/commit/SKILL.md): The new commit skill already establishes the repo pattern of tight scope, explicit safety rules, and a fast-path workflow. The PR skill should mirror that shape instead of becoming a long GitHub handbook.
- [README.md](/Users/rishi/Code/ai-tools/README.md): The repo documents a `docs/` convention, so saving research and future planning artifacts under `docs/` fits the local structure even though the directory needed to be created in practice.
- Local environment: `gh auth status` shows an authenticated GitHub CLI session with `repo` scope, which is enough for standard PR creation and editing. Project-related automation may still need `gh auth refresh -s project` based on CLI help.

## Implementation Outline

1. Choose the name and trigger surface. Prefer `create-pr` unless you want a broader umbrella skill now. Write frontmatter that explicitly triggers on “create a PR,” “open a pull request,” “publish this branch,” and similar phrasing.
2. Define the scope in three phases: preflight, create, and optional polish. Preflight should inspect git status, branch, remote, and auth state. Create should generate title/body and run `gh pr create`. Optional polish should cover `edit`, `comment`, `checks`, and `ready`.
3. Bake in a concise PR body structure. Recommended default sections: `Why`, `What Changed`, `Validation`, `Linked Issues`, and optionally `Reviewer Notes` or `Artifacts`. Only include `Artifacts` when screenshots, logs, or diagrams materially help.
4. Prefer explicit CLI arguments over interactive prompts. Use `gh pr create --title ... --body-file ...`, add `--reviewer`, `--label`, `--draft`, or `--base` when the request calls for them, and capture the resulting URL or number for follow-up actions.
5. Make `@codex review` an opt-in switch. Support a flag or argument such as `REVIEW=codex` or `CODEx_REVIEW=true`, or trigger it only when the user explicitly asks. Implement it as a separate `gh pr comment <pr> --body "@codex review"` step after successful creation.
6. Forward-test the skill on at least two cases: a clean branch with explicit title/body input, and a partially specified branch where the skill must infer a good PR description from the diff without overexplaining.

## Sources

- [About issue and pull request templates](https://docs.github.com/en/enterprise-cloud%40latest/communities/using-templates-to-encourage-useful-issues-and-pull-requests/about-issue-and-pull-request-templates?apiVersion=2022-11-28)
- [Linking a pull request to an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue)
- [Requesting a pull request review](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/requesting-a-pull-request-review)
- [Creating diagrams](https://docs.github.com/en/enterprise-cloud%40latest/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams?apiVersion=2022-11-28)
- [GitHub CLI manual](https://cli.github.com/manual)
- Local `gh` CLI help on April 5, 2026: `gh --version`, `gh auth status`, `gh pr create --help`, `gh pr comment --help`, `gh pr edit --help`, `gh pr checks --help`, `gh pr ready --help`, `gh pr status --help`, and `gh pr view --help`
