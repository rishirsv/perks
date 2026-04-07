---
name: create-pr
description: Create a GitHub pull request for the current branch using `gh`. Use when asked to create or open a PR, publish a branch, open a draft PR, request reviewers, or turn completed branch work into a concise reviewer-friendly pull request. Inspect branch and git state first, ensure the branch is ready and pushable, write a short high-signal PR title and body, create the PR with explicit `gh` flags, and optionally add `@codex review` after creation when the user asks for it.
---

# Create PR

Publish the current branch as a clean, reviewer-friendly pull request.

## Fast path

Move quickly when the branch is already ready:

1. Inspect git state, branch, remote, and GitHub auth.
2. Confirm the current branch is suitable for a PR.
3. Draft a concise title and body from the actual diff.
4. Create the PR with explicit `gh` arguments.
5. Optionally add reviewers, labels, draft state, checks watching, or `@codex review`.
6. Report the PR URL, number, and any follow-up state.

## Preflight

Start with the smallest useful checks:

```bash
git status --short
git status -sb
git branch --show-current
git log --oneline -10
git diff --stat
git diff --staged --stat
gh auth status
```

Inspect more closely when needed:

```bash
git diff
git diff --staged
git remote -v
```

## Readiness rules

- Prefer opening a PR from a committed branch with a clean or intentionally understood worktree.
- If there are uncommitted changes, stop and use `$commit` first unless the user explicitly asked for end-to-end publication and the next step is unambiguous.
- If the current branch is already a focused feature branch or worktree branch, reuse it.
- If the current branch is the default branch, detached, or clearly unsuitable for a PR, create a branch first only when the intended branch name is obvious.
- If branch naming is ambiguous, ask one concise question instead of guessing.

## Branch strategy

Use the lightest safe path:

1. Keep the current branch when it is already siloed and suitable.
2. If needed, create a feature branch with a clear slug:

```bash
git switch -c project/short-description
```

3. Prefer short, readable names such as:
   - `capital/add-hero-animations`
   - `ai-tools/create-pr-skill`
   - `app/fix-login-redirect`

Do not rename or rewrite branch history unless asked.

## PR body rules

Write the PR for reviewers, not for project archaeology.

- Keep the title specific and short.
- Explain why the change exists before diving into mechanics.
- Summarize the important changes, not every file.
- Include validation that was actually run.
- Link issues when relevant using normal issue references or closing keywords.
- Add screenshots or Mermaid diagrams only when they materially reduce reviewer effort.
- Do not paste research links, GitHub docs links, or process notes into the PR body unless the user explicitly asks for them.
- Do not paste raw terminal transcripts, giant diffs, or long changelogs into the PR.

## Recommended PR structure

Use only the sections that add value, and omit empty ones.

```md
## Why

[Why this change exists]

## What Changed

- [Primary change]
- [Secondary change]

## Validation

- [Test, check, or manual flow actually run]

## Linked Issues

- Closes #123

## Reviewer Notes

- [Optional hotspot, migration note, or risk area]

## Artifacts

- [Optional screenshot, diagram, or before/after note]
```

For small PRs, a shorter body is better:

```md
## Why

[One short paragraph]

## What Changed

- [Key change]

## Validation

- [What was verified]
```

## Template handling

- Check for an existing repository PR template before inventing your own structure.
- Common locations are:
  - `.github/pull_request_template.md`
  - `docs/pull_request_template.md`
  - `pull_request_template.md`
- If a template exists, use it as the starting point and fill only the sections supported by the actual change.
- If no template exists, use the recommended structure above.

## CLI strategy

Prefer explicit non-interactive commands over prompts.

Primary creation shape:

```bash
gh pr create --title "your title" --body-file /tmp/pr-body.md
```

Common variants:

```bash
gh pr create --base main --title "your title" --body-file /tmp/pr-body.md
gh pr create --draft --title "your title" --body-file /tmp/pr-body.md
gh pr create --reviewer user1,org/team --title "your title" --body-file /tmp/pr-body.md
gh pr edit <pr> --add-reviewer user1 --add-label enhancement
gh pr checks <pr> --watch
gh pr ready <pr>
gh pr comment <pr> --body "@codex review"
```

Avoid relying on `gh pr create --fill` unless the user explicitly wants commit-derived text.

Do not use `gh pr create --dry-run` as a harmless preview step, because it may still push git changes.

## Post-create actions

Support small follow-up steps when the user wants them:

- add reviewers
- add labels
- mark as draft
- mark draft ready for review
- watch required checks
- comment with `@codex review`

Treat `@codex review` as opt-in. Add it only when the user explicitly asks, when a skill argument clearly requests it, or when the repo convention is already established.

## Create flow

Follow this order:

1. Inspect git state, branch state, and GitHub auth.
2. Confirm whether the current branch is PR-ready or needs a new branch first.
3. Check for an existing PR template.
4. Draft a concise title and body from the actual change.
5. Create the PR with explicit `gh pr create` flags.
6. Capture the PR URL and number.
7. Apply any requested post-create actions.
8. Report:
   - PR title and URL
   - base and head branch
   - draft or ready state
   - reviewers or labels added
   - validation mentioned in the PR
   - whether `@codex review` was added

## Safety rules

- Never push unrelated work.
- Never include unreviewed research links in the PR body by default.
- Never dump every changed file into the PR description just because the diff is large.
- Never silently create a broad PR from a mixed worktree.
- Never merge, rebase, or clean up the branch unless asked.
- If there is already an open PR for the branch, update or inspect it instead of blindly creating another.
- If repository state, permissions, or remote selection are unclear, ask one concise question.

## Failure handling

- If `gh auth status` is not healthy, stop and report the auth problem.
- If branch push state is unclear, inspect before creating the PR.
- If `gh pr create` fails, reuse the drafted title/body rather than rewriting from scratch.
- If an existing PR already matches the branch, return that PR and use `gh pr edit` only when needed.
- If checks watching is requested and a check fails, report the failure instead of pretending the PR is ready.
