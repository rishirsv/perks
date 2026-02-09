# Proposed Deletions: Business Overview (Revised, Redundancy-Only)

This revised file follows your rule:
- Keep unique industry signal.
- Propose deletion only for content that is non-unique and creates duplicate output against common skeleton.

Status update: `eyecare.business_overview.scope.047` and `eyecare.business_overview.scope.048` were applied and removed from `dist/scope-library.json`.

## Deletion candidates (High confidence, redundancy-only)

These are the clearest "double output" cases in `business_overview`.

| Row (review file) | Path | Scope ID | Why delete |
|---|---|---|---|
| 47 | `eyecare.business_overview.scope.047` | `scope.047` | Largely repeats common accounting/business setup language; minimal eyecare-specific differentiation. |
| 48 | `eyecare.business_overview.scope.048` | `scope.048` | Generic financial-performance/accounting framing that overlaps common baseline and duplicates output. |

## Keep (do not delete for now)

These contain material industry-specific signal and should be retained.

- `aerospace.business_overview.scope.488`
- `aerospace.business_overview.scope.489`
- `aerospace.business_overview.scope.490`
- `banking.business_overview.scope.510`
- `banking.business_overview.scope.511`
- `banking.business_overview.scope.512`
- `building.business_overview.scope.472`
- `building.business_overview.scope.473`
- `building.business_overview.scope.474`
- `healthcare.business_overview.scope.073`
- `hvac.business_overview.scope.122`
- `insurance.business_overview.scope.525`
- `insurance.business_overview.scope.526`
- `insurance.business_overview.scope.527`
- `manufacturing.business_overview.scope.221`
- `manufacturing.business_overview.scope.222`
- `manufacturing.business_overview.scope.223`
- `prof_services.business_overview.scope.301`
- `retail.business_overview.scope.459`
- `retail.business_overview.scope.460`
- `retail.business_overview.scope.461`
- `service.business_overview.scope.345`
- `supermarket.business_overview.scope.357`
- `supermarket.business_overview.scope.358`
- `supermarket.business_overview.scope.359`
- `tech.business_overview.scope.390`
- `tech.business_overview.scope.391`
- `tech.business_overview.scope.392`
- `tech.business_overview.scope.393`
- `telecomm.business_overview.scope.498`
- `telecomm.business_overview.scope.499`
- `telecomm.business_overview.scope.500`

## Reclassify-not-delete candidates (optional next pass)

These may be misclassified under `business_overview`, but they still contain useful content.
If desired, move them to `accounting_overview` (or equivalent) rather than deleting.

- `service.business_overview.scope.345`
- `supermarket.business_overview.scope.357`
- `supermarket.business_overview.scope.358`
- `supermarket.business_overview.scope.359`

## Source references

- Review file rows: `docs/Scope Review/01-core-financial.md`
- Canonical content: `dist/scope-library.json`
