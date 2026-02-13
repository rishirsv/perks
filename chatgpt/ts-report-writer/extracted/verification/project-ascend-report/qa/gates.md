# QA Gates

- `STATUS`: needs_revision
- `REPORT_ID`: project-ascend-report
- `GENERATED_AT`: 2026-02-13T18:03:24.059909+00:00

## Gate Results

- `provenance_exact_match`: `pass` (Provenance QA must pass with zero unmatched and zero OCR-only lines.)
- `provenance_trace_integrity`: `pass` (Every markdown trace row maps to a catalog line_id.)
- `forbidden_class_leakage`: `pass` (No forbidden class lines are present in rendered output.)
- `ocr_primary_policy`: `pass` (OCR-backed lines are blocked unless --allow-ocr-primary is enabled.)
- `ocr_marker_absent`: `pass` (Final markdown must not include OCR marker blocks.)
- `section_disposition_complete`: `pass` (All canonical sections must have a disposition in section-map.)
- `manual_checklist_complete`: `fail` (Review notes checklist and placeholders must be completed.)

## Issues

- `manual_checklist`: unchecked_checklist_items_present
- `manual_checklist`: placeholder_present:<required>
- `manual_checklist`: placeholder_present:<add findings here>
- `manual_checklist`: placeholder_present:<pass|needs_revision|blocked>
- `manual_checklist`: placeholder_present:<YYYY-MM-DD>

## Summary

- `TRACE_LINES`: 673
- `MISSING_TRACE_REFERENCES`: 0
- `OCR_TRACE_LINES`: 0
- `FORBIDDEN_CLASS_LINES`: 0
- `MANUAL_CHECK_ISSUES`: 5
- `PROVENANCE_UNMATCHED`: 0
