---
name: gh-review
description: "Work with GitHub pull request review backlog in the current repository. Use when the user asks to summarize open PRs, review a PR with Codex, collect PR review comments, turn recent PR feedback into TECH-DEBT.md entries, address review comments from open, merged, or closed PRs, or merge open PRs safely using gh CLI."
---

# GH Review

Use the current git repository as the target. Do not assume a fixed repo, branch naming scheme, or tracker path.

This skill extends the upstream `gh-address-comments` idea from one open PR on the current branch into a repo-level review backlog workflow.

## Preflight

Require GitHub CLI:

```bash
gh --version
gh auth status
git status -sb
gh repo view --json nameWithOwner,url
```

If `gh auth status` fails, ask the user to authenticate with `gh auth login` and stop.

Set the skill script path from the installed skill:

```bash
GH_REVIEW_SCRIPT="${CODEX_HOME:-$HOME/.codex}/plugins/cache/perks/perks/0.1.0/skills/gh-review/scripts/gh_review_collect.py"
```

When working in this repo source copy, use:

```bash
GH_REVIEW_SCRIPT="/Users/rishi/Code/perks/plugins/perks/skills/gh-review/scripts/gh_review_collect.py"
```

## Mode Selection

Infer the mode from the user's words:

- Default or unclear: list open PRs and summarize them.
- "review", "review it", or a PR number/URL with review intent: resolve the PR, open or prepare a fresh Codex review context, and run a normal code review.
- "tech debt", "debt tracker", "tracker", "backlog", or "last week": collect review comments from recent PRs and update the requested tracker.
- "address", "fix", "work through", or "handle comments": collect comments, update the tracker first, then begin implementing the highest-value items.
- "merge", "merge PRs", "merge all open PRs", or "ship PRs": plan and execute safe PR merges without deleting branches.

If multiple modes apply, use the stronger action in this order: merge PRs, address comments, update tracker, review PR, summarize PRs.

## Summarize Open PRs

Run:

```bash
python3 "$GH_REVIEW_SCRIPT" open-prs --format markdown
```

Summarize:

- PR number, title, state, draft status, branch, author, updated date, and URL.
- Review decision and comment count when available.
- Apparent next step: review needed, comments need attention, CI/merge state unknown, or ready-looking.

Do not modify files in this mode.

## Review A PR With Codex

Resolve the PR from explicit number/URL, or from the user's selected open PR.

Run:

```bash
gh pr view <number-or-url> --json number,title,url,headRefName,baseRefName,author,state,isDraft,body
gh pr diff <number-or-url>
```

Then start a fresh review context when the environment supports opening a new Codex chat/thread. Pass the PR URL, branch, base branch, and repo path. If no new-chat tool exists, perform the review in the current chat and say that the environment did not expose a new-chat action.

Review stance:

- Read repo review guidance first: `*review*.md`, `AGENTS.md`, `.codex/`, and relevant docs.
- Compare the PR branch against its merge base.
- Lead with findings, ordered by severity, with file and line references.
- Do not implement fixes during review mode unless the user asks to address them.

## Collect Review Comments Into Debt

Default time window is 7 days. Use a longer or shorter window when the user asks.

Run one of:

```bash
python3 "$GH_REVIEW_SCRIPT" comments --since-days 7 --format markdown
python3 "$GH_REVIEW_SCRIPT" comments --since-days 14 --format json
python3 "$GH_REVIEW_SCRIPT" comments --pr 123 --format markdown
```

The script collects top-level PR comments, review bodies, and inline review-thread comments from open, merged, and closed PRs. It prints source URLs and tags resolved/outdated threads so they can be triaged instead of silently dropped.

Classify comments before editing a tracker:

- Actionable defect or regression risk.
- Architecture, ownership, maintainability, or verification debt.
- Follow-up polish or cleanup.
- Question or clarification.
- Already handled, obsolete, praise, or not debt.

## Update Tracker

Locate the target tracker:

1. Use the document named by the user.
2. Otherwise prefer an existing `TECH-DEBT.md`.
3. If absent, search `docs/TECH-DEBT.md`, `WORK-TRACKER.md`, and `docs/`.
4. Ask before creating a new tracker unless the user explicitly requested one.

Preserve the tracker format. Merge into existing related items instead of duplicating.

Each added item should include:

- Source PR and comment URL.
- Short title.
- Where the issue lives.
- What the reviewer noticed.
- Why it matters.
- Simplest useful fix.
- Verification.

Keep comments from merged or closed PRs as debt/backlog entries, not as live PR-resolution tasks.

## Address Comments

Always update the tracker first, then implement in priority order.

Priority order:

1. Correctness, data loss, security, or user-visible regressions.
2. Verification gaps that block confidence in recent work.
3. Architecture or ownership debt that will make the next change harder.
4. Small cleanup that is safe and unblocks a larger item.
5. Cosmetic or preference-only comments.

For each selected item:

1. Read the source comment and nearby code.
2. Check whether the PR branch still exists and whether the feedback is already obsolete on the default branch.
3. Implement the smallest durable fix in the current repo.
4. Run focused verification.
5. Update the tracker entry status or completion note.

Do not resolve or hide comments on already merged/closed PRs unless the user explicitly asks.

## Merge Open PRs

When the user asks to merge open PRs, treat it as an operations workflow, not a blind batch command.

First inspect:

```bash
python3 "$GH_REVIEW_SCRIPT" open-prs --format markdown
gh pr list --state open --json number,title,url,headRefName,baseRefName,isDraft,mergeable,reviewDecision,statusCheckRollup,updatedAt
git status -sb
git branch --show-current
git remote -v
```

Create a safe merge order:

- Skip draft PRs unless the user explicitly includes drafts.
- Prefer PRs with passing required checks, no merge conflicts, and approving/neutral review state.
- Merge dependency or foundation PRs before PRs that build on them.
- Merge older low-risk PRs before newer dependent PRs when no dependency signal exists.
- Re-check the open PR list after every merge because later PRs may change mergeability.
- If two PRs touch the same files or tracker docs, merge one, update/rebase the next, then re-run checks before merging it.

For each PR:

1. Fetch review comments first if the PR has unresolved or important feedback:

   ```bash
   python3 "$GH_REVIEW_SCRIPT" comments --pr <number> --format markdown
   ```

2. If comments should become follow-up debt, update the tracker before merging.
3. Use the repo's preferred merge method if documented. Otherwise choose:
   - `gh pr merge <number> --squash` for ordinary feature/fix PRs.
   - `gh pr merge <number> --merge` when preserving multiple commits matters.
   - `gh pr merge <number> --rebase` only when the repo convention clearly prefers linear commit replay.
4. Do not pass `--delete-branch`. Do not delete local or remote branches after merge.
5. If GitHub reports the PR branch is out of date, update it with the least surprising repo-native path:
   - Prefer `gh pr checkout <number>`, `git fetch origin`, then `git rebase origin/<base>` for a normal feature branch when conflicts are manageable.
   - Use `git merge origin/<base>` instead when the repo avoids rebasing shared PR branches or when preserving branch history is safer.
   - Push the updated PR branch, wait for checks if applicable, then merge.
6. If conflicts are non-trivial, stop merging that PR, report the blocker, and continue only with independent PRs that are still safe.

After the merge wave:

- Leave branches intact.
- Confirm `gh pr list --state open`.
- Confirm the local worktree is clean or explain any intentional tracker changes.
- Report merged PRs, skipped PRs, preserved branches, tracker updates, and any follow-up comments/debt.

## Commit Hygiene

Preserve unrelated work. If the worktree is dirty, isolate only the files needed for the selected review-debt item. Do not delete branches unless the user asks.

When the user asks to publish the fixes, use the repo's normal commit/PR workflow.
