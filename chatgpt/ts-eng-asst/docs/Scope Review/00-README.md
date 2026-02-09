# Scope Review Workflow

This folder is generated from `dist/scope-library.json`.

## How To Review

1. Review files group by group.
2. Keep `ACTION_KEEP` for anything to retain.
3. Change `ACTION_KEEP` to `ACTION_DELETE` for anything you want removed.
4. Ignore `REC_*` if you disagree; it is only an assistant recommendation.

## Marker Definitions

- `ACTION_KEEP`: reviewer keeps item (default)
- `ACTION_DELETE`: reviewer approves deletion
- `REC_KEEP`: assistant recommends keeping
- `REC_DELETE`: assistant recommends deletion

## Scan Command (for next step)

```bash
rg -n "ACTION_DELETE" "docs/Scope Review"
```

The deletion pass should only remove rows marked `ACTION_DELETE`.
