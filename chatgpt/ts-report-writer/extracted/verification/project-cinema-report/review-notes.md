# Verification Notes: project-cinema-report

- Source file: `Project Cinema Report.pdf`
- Reviewer: `autopilot-agent`
- Review status: `pass`
- Review date: `2026-02-13`

## Checklist

- [x] Reviewed full montage PNGs against extracted markdown
- [x] Confirmed body text is captured appropriately
- [x] Confirmed table text is excluded
- [x] Confirmed image-derived text is excluded
- [x] Confirmed legal/footer/navigation noise is excluded
- [x] Completed source-to-extraction coverage map
- [x] Ran `scripts/qa_provenance.py` and reviewed results
- [x] Ran `scripts/qa_gates.py` and confirmed all gates passed

## Notes

- Source-text references reviewed: `page-006`, `page-007`, `page-012`, `page-020`, `page-028`, `page-033`, `page-037`, `page-044`, `page-050` with key phrases from business profile, QoE adjustments, NWC considerations, and litigation context.
- Montage reconciliation evidence (page-level):
  - `montage/page-006.png` vs `page-006.txt`: verified retained bullets beginning `Group. Furthermore, the Company is a partner in Scene+, Canada’s largest` and `As of March 31, 2024, the Company owned, leased, or had a joint venture interest in`.
  - `montage/page-012.png` vs `page-012.txt`: verified retained bullets including `The Company’s financial statements are prepared under International Financial Reporting Standards (IFRS)` and `CPP increases which drove food service revenues as well.`
  - `montage/page-020.png` vs `page-020.txt`: verified retained bullets including `The Quality of Earnings (“QofE”) analysis has been prepared based on the Company’s quarterly publicly available financials.`
  - `montage/page-033.png` vs `page-033.txt`: verified retained bullets including `The average net working capital reported for the TTM Mar-24 is ($256.7 million).`
  - `montage/page-037.png` vs `page-037.txt`: verified retained bullets including `Pro forma adjustments: Adjustments made to normalize the impact of additional QofE adjustments identified during diligence to reflect previously non-existing items.`
  - `montage/page-044.png` vs `page-044.txt`: verified retained bullets including `The advent of online streaming services has disrupted the conventional cinema industry as a whole, a shift that was further accelerated by the COVID-19 pandemic.`
  - `montage/page-050.png` vs `page-050.txt`: verified retained bullets including `The Company commenced an action against Cineworld as a result of Cineworld’s repudiation of the Arrangement Agreement.` and `On December 14, 2021, the Court released its Decision.`
- Section placement decision: all retained body-text lines reconcile to the extracted `# Executive Summary` block in the current strict rendering; remaining canonical sections are marked `Not present in source report` in markdown and dispositioned `not_present` in `section-map.json`.
- Source-text mismatch count: `0`.
- OCR evidence reviewed: `OCR not used`; no OCR artifacts required for this report (`ocr_used=false`).
- Provenance QA result: `pass` (`extracted/verification/project-cinema-report/qa/provenance.json`).
- Gate QA result: `pass` (`extracted/verification/project-cinema-report/qa/gates.json`).
- Final decision: `pass`.
