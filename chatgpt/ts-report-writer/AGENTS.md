# Repository Guidelines

## Scope and Output
- This repository is a report-writer workflow for diligence reports in `reports/`.
- Produce one markdown extraction per report in `extracted/`.
- Extraction text must be **verbatim** from source report body text.
- Do not summarize, paraphrase, normalize wording, or rewrite tone.
- Keep workflow helper scripts in `scripts/` (new workspace layout).

## Suggested Commands (clean layout)
- Preflight:
  - `./.venv/bin/python -m ts_report_writer.pipeline preflight`
- Run extraction:
  - `./.venv/bin/python -m ts_report_writer.pipeline run --reports-dir reports`
- Mark manual review:
  - `./.venv/bin/python -m ts_report_writer.pipeline mark-reviewed --report-id <report-id> --reviewer "<reviewer>" --status pass`

## Canonical Extraction Workflow
1. Process reports sequentially (one report at a time).
2. Keep `reports/` as source-only input directory:
   - Source-only report files (`.pdf`, `.ppt`, `.pptx`) should live only in `reports/`.
   - Move outputs, manifests, verification artifacts, and temporary files to `extracted/`.
3. Convert source formats:
   - `PPT/PPTX -> PDF` first (LibreOffice headless).
   - `PDF -> text` (page-by-page extraction).
   - Convert source report PDF into PNG montage pages for visual verification.
4. Extract source-text artifacts for source-to-extraction reconciliation:
   - For `.pptx/.ppt`, export slide XML text to `extracted/verification/<report-id>/source-text/pptx/`.
   - For `.pdf`, export page-level text to `extracted/verification/<report-id>/source-text/pdf/`.
   - Use `./.venv/bin/python scripts/extract_source_text.py --source <path-to-report> --out-dir extracted/verification/<report-id>/source-text`.
   - If a slide contains text that is missed in XML (e.g. images, flattened text), run OCR on selected slides:
     - `./.venv/bin/python scripts/extract_source_text.py --source <path-to-report> --out-dir ... --ocr-slides 16,17,22`
     - OCR output is appended in that slide’s text artifact under `"[OCR_EXTRACTED_TEXT]"`.
5. Extract only report body text:
   - Exclude table text and chart/table numeric grids.
   - Exclude footer/header noise, legal boilerplate, disclaimers, and navigation pages unless required for section context.
   - Exclude image OCR from final extraction text; do not convert images to text in the main markdown output.
   - Use OCR only as a targeted source-text fallback (`--ocr-slides`) when validating problematic slides.
   - For `Net Working Capital` and `Net Debt`, capture both overview and adjustment detail explicitly where source text appears.
   - If adjustment detail exists only in tables/charts and is excluded, preserve surrounding explanatory lines and add:
     `Table- or chart-based adjustment details were excluded per extraction policy.`
   - Immediately after extraction, review the montage images and source text artifacts, then clean the extracted markdown to correct discrepancies.
6. Map content into canonical sections in `docs/report-mining/verbatim-report-extraction-template.md`.
   - If section names differ, place content into the closest matching canonical section.
   - If a section has no non-table body text, write `Not present in source report`.
7. Appendices format is required:
   - `## Appendix 1: <Appendix Name>`
   - `## Appendix 2: <Appendix Name>`
   - `## Appendix 3: <Appendix Name>`
   - Continue numbering for all appendix sections found.

## Verification (Manual, Required)
- Convert each processed report to PNG montage pages for visual QA (if not already generated during extraction).
- Generate and review `source-text` artifacts (XML-based for PPT/PPTX, page text for PDF).
- Manually compare montage content and source-text artifacts to extracted markdown.
- Confirm all captured text is verbatim and all excluded content rules were followed.
- For each section and subsection, check line-level provenance against source references.
- Any omission, summary rewrite, or paraphrase in extracted text requires `needs_revision`.
- Record outcome in `extracted/verification/<report-id>/review-notes.md` and status in manifest.

Verification notes should include:
- `Source-text references reviewed` (slide/page IDs and key phrases validated).
- `Source-text mismatch count` (number of missing/shortened/paraphrased items).
- `Final decision` (`pass`, `needs_revision`, or `blocked`).

## Tracking and Hygiene
- Update `extracted/manifests/tracker.md` and per-report manifest JSON after each report.
- Use statuses: `pass`, `needs_revision`, or `blocked`.
- Keep folder structure clean: delete temporary extraction artifacts in `extracted/tmp/` after verification.
- Skip benchmarking packs when requested by user.
- If a report file is encrypted/unloadable (`CDFV2 Encrypted`), mark `blocked` and continue to next report.
