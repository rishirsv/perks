# AGENTS.md

This repo is Rishi's source workspace for the Perks skills and generated Codex/Claude plugin packages.

## Layout

- `skills/`: canonical Perks skills. Edit these first.
- `skill-workbench/`: WIP/imported skills that are not active Perks plugin skills.
- `plugins/codex/perks/`: generated Codex plugin package.
- `plugins/claude/perks/`: generated Claude plugin package.
- `.agents/plugins/marketplace.json`: Codex marketplace for this repo.
- `.claude-plugin/marketplace.json` and `marketplace.json`: Claude marketplace for this repo.
- `.codex/config.toml`: repo-local Codex config.
- `.codex/agents/loader.toml`: active Codex helper agent for Perks sync discipline.
- `scripts/sync-plugins.sh`: canonical sync script.

## Rules

- When work changes anything under `skills/`, run `scripts/sync-plugins.sh` before committing.
- The sync script must be the path that copies skills into both plugin packages and refreshes local Codex/Claude registrations and caches.
- Do not hand-edit generated copies under `plugins/codex/perks/skills/` or `plugins/claude/perks/skills/`; edit `skills/` and run the script.
- Keep WIP or imported material in `skill-workbench/` until it should become an active Perks skill.
- Put repo-specific Codex settings in `.codex/config.toml`.
- Keep Codex instructions in `AGENTS.md`; do not move them into `.codex/`.
- Update `~/.codex/config.toml` only for intentionally global settings, and ask first.
- Never commit secrets, tokens, or credentials.
