# scripts/

Place command-line helper scripts for local workflow tasks in this folder.

- `run_report_pipeline.sh`
  - Runs `preflight` then executes the pipeline with source reports from `reports/` and outputs into `extracted/`.
  - Supports strict catalog-backed extraction defaults (`--verbatim-mode strict`, `--evidence-profile full`).
- `mark_reviewed.sh`
  - Thin wrapper for `ts_report_writer.pipeline mark-reviewed` using the cleaned layout paths.
  - Enforces a QA gate pass (`qa/gates.json`) before allowing `status=pass`.
- `extract_source_text.py`
  - Exports source-text artifacts for manual source-to-extraction QA.
  - For PPT/PPTX: extracts slide XML text.
  - For PDF: exports page-level text.
  - Optional fallback:
    - `--ocr-slides` renders selected PPT/PPTX slides to PNG and runs OCR.
    - `--ocr-pages` renders selected PDF pages to PNG and runs OCR.
  - OCR output is appended under `[OCR_EXTRACTED_TEXT]`.
  - OCR artifacts are persisted under `source-text/ocr/` (`images/*.png`, `ocr-run.json`).
- `qa_provenance.py`
  - Verifies each extracted markdown content line has an exact match in source-text artifacts.
  - Produces `provenance.json` and `provenance.md` under a report QA directory.
  - Fails if unmatched lines exist, if OCR marker appears in final markdown, or if a line is backed only by OCR (unless override is passed).
- `qa_gates.py`
  - Runs fail-closed quality gates using render trace + selected catalog + section map + section accounting + review notes.
  - Produces `gates.json` and `gates.md` under `extracted/verification/<report-id>/qa/`.
  - Fails on missing trace references, forbidden-class leakage, OCR policy violations, markdown/trace mismatches, section completeness mismatches, or incomplete manual checklist.

## Typical flow with source-text QA

```bash
./scripts/run_report_pipeline.sh --max-reports 5 --verbatim-mode strict --evidence-profile full --fail-closed
./.venv/bin/python scripts/extract_source_text.py \
  --source reports/Project\ Ascend\ -\ Report.pptx \
  --out-dir extracted/verification/project-ascend-report/source-text \
  --verbatim-mode strict
./.venv/bin/python scripts/extract_source_text.py \
  --source reports/Project\ Ascend\ -\ Report.pptx \
  --out-dir extracted/verification/project-ascend-report/source-text \
  --ocr-slides 16,17,22
./.venv/bin/python scripts/extract_source_text.py \
  --source reports/Project\ Cinema\ Report.pdf \
  --out-dir extracted/verification/project-cinema-report/source-text \
  --ocr-pages 16,17,22
./.venv/bin/python scripts/qa_provenance.py \
  --markdown extracted/project-ascend-report.md \
  --source-manifest extracted/verification/project-ascend-report/source-text/manifest.json \
  --out-dir extracted/verification/project-ascend-report/qa
./.venv/bin/python scripts/qa_gates.py \
  --report-id project-ascend-report
# complete extracted/verification/project-ascend-report/review-notes.md checklist first
./scripts/mark_reviewed.sh project-ascend-report rishi pass
```

```bash
./scripts/mark_reviewed.sh project-ascend-report rishi needs_revision "Fixed appendix heading in montage review"
```

## Required fail-closed gates before `pass`

- `provenance_exact_match`
- `markdown_trace_sync`
- `section_completeness`
- `executive_summary_cleanup`
- `cleanup_quality`
