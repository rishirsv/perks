# scripts/

Place command-line helper scripts for local workflow tasks in this folder.

- `run_report_pipeline.sh`
  - Runs `preflight` then executes the pipeline with source reports from `reports/` and outputs into `extracted/`.
- `mark_reviewed.sh`
  - Thin wrapper for `ts_report_writer.pipeline mark-reviewed` using the cleaned layout paths.
- `extract_source_text.py`
  - Exports source-text artifacts for manual source-to-extraction QA.
  - For PPT/PPTX: extracts slide XML text.
  - For PDF: exports page-level text.
  - Optional fallback: `--ocr-slides` renders selected PPT/PPTX slides to PNG and runs OCR, appending OCR output under `[OCR_EXTRACTED_TEXT]`.

## Typical flow with source-text QA

```bash
./scripts/run_report_pipeline.sh --max-reports 5
./.venv/bin/python scripts/extract_source_text.py \
  --source reports/Project\ Ascend\ -\ Report.pptx \
  --out-dir extracted/verification/project-ascend-report/source-text
./.venv/bin/python scripts/extract_source_text.py \
  --source reports/Project\ Ascend\ -\ Report.pptx \
  --out-dir extracted/verification/project-ascend-report/source-text \
  --ocr-slides 16,17,22
./scripts/mark_reviewed.sh project-ascend-report rishi pass
```

```bash
./scripts/mark_reviewed.sh project-ascend-report rishi needs_revision "Fixed appendix heading in montage review"
```
