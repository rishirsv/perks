# Perks

Personal Codex perks marketplace and reusable agent skills.

## Structure

- `skills/`: loose reusable skills while drafting or before plugin packaging.
- `plugins/`: installable Codex plugins, including packaged plugin agents.
- `.agents/plugins/marketplace.json`: repo-scoped Codex marketplace catalog.
- `.codex/config.toml`: repo-local Codex config that registers this marketplace.
- `configs/`: reusable agent and prompt configuration.
- `references/`: external examples, archived candidate skills, and source material.
- `TODO.md`: improvement backlog for future skill rebuilds.

## Marketplace Files

- `.agents/plugins/marketplace.json` is the canonical Codex marketplace. It points at `plugins/perks` using an OpenAI-supported repo marketplace layout.
- `.claude-plugin/marketplace.json` is compatibility metadata for Claude-style plugin tooling. Do not treat it as a second Codex source of truth.
- `plugins/perks/.codex-plugin/plugin.json` is the plugin manifest. `plugins/perks/.claude-plugin/plugin.json` is a symlink to it so Claude-compatible package metadata does not drift.

## Local Marketplace

This repo exposes a local Codex marketplace named `perks`.

Current plugin:

- `plugins/perks`: starter Codex plugin that bundles the `perks` skill.
- `plugins/perks/.codex/agents`: Codex subagents packaged with the Perks plugin.

Bundled skills:

- `agent-browser`: live browser and Electron automation through Vercel Agent Browser.
- `clarify`: explicit requirement clarification before implementation.
- `commit`: safe focused git commits.
- `docs-gardener`: canonical docs maintenance, consolidation, and drift repair.
- `explain`: plain-language explanations of code, diffs, configs, errors, and system flows.
- `harness-engineering`: deep repo assessment for agent-readiness and harness opportunities.
- `handoff`: concise continuation briefs.
- `hard-cut`: one canonical implementation, no legacy compatibility paths.
- `idea`: grill and refine serious ideas before planning or implementation.
- `oracle`: repo-context packages for external review or planning.
- `research`: explicit sourced research with repo context and primary-source guidance.
- `perks`: guidance for this plugin repo.
- `simplify`: post-implementation cleanup for clarity, reuse, quality, and efficiency.
- `tech-debt`: explicit architecture debt review that updates `TECH-DEBT.md`.
- `yeet`: CLI-first commit, push, and draft PR flow.

After opening this repo in Codex, restart Codex so it detects `.agents/plugins/marketplace.json`. Then open the plugin directory, choose the `Perks` marketplace, and install `Perks`.

Codex installs a selected plugin into its plugin cache and loads that installed copy. For local plugins, the installed version is `local`.

## References

Reference folders are not installed as active skills. They exist to guide future skill rebuilds and KPMG/deck work:

- `references/oai/`: OAI artifact package, OAI skills, and presentation references.
- `references/candidates/`: archived skills to mine while rebuilding coding and design workflows.
- `references/system/`: installed system skills kept as design references.
- `references/anthropic/`: Anthropic knowledge-work and financial-services plugin examples.

## Repo Codex Config

This repo keeps its Codex config in `.codex/config.toml`.

That file registers `.agents/plugins/marketplace.json` as the `perks` marketplace and enables `perks@perks` for this repo. User-specific secrets, auth, and machine-wide defaults should stay in `~/.codex/config.toml`.
