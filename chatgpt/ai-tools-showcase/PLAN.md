# AI Tools Visual Showcase - Implementation Plan

## Overview
Create a Python-generated PPTX presentation showcasing KPMG Transaction Services AI tools for the Management Committee meeting.

## Output
- **File:** `ai-tools-showcase.pptx` (generated via Python script)
- **Location:** `/Users/rishi/Code/chatgpt/ai-tools-showcase/`
- **Slides:** 2 total

---

## Slide 1: Released AI Tools

**Layout:** 2x2 grid of tool cards

| Tool | Icon Path | Description |
|------|-----------|-------------|
| **KDN Tasks** | `kdn-tasks/kdn_logo.png` | Drafts clear, actionable email instructions for KDN offshore execution teams. Handles any task—from IS/BS roll-forwards and AR/AP schedules to GL breakdowns and QoE support work. |
| **Meeting Intelligence** | `meeting-intelligence/dist/meeting-intelligence-logo.png` | Transforms meeting transcripts into comprehensive, template-structured notes for FDD and General Business meetings. All content is transcript-grounded with zero invention. |
| **MetaPrompt** | `meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg` | Optimizes user tasks into refined AI prompts using structured templates, ensuring consistent quality for downstream model execution. |
| **TS Copywriter** | `ts-copywriter/archive/ts-copywriter-icon.png` | Rewrites, drafts, and polishes financial due diligence report content with Big 4 partner-level expertise, applying strict style guidelines and data-anchored language. |

---

## Slide 2: AI Tools Roadmap

**Layout:** Grid with status badges (5 items)

### In Development
| Tool | Description |
|------|-------------|
| **TS Letters** | Automates generation of Transaction Services due diligence letters (Client Release, Third Party Access, Factual Accuracy) by filling DOCX templates with deal-specific data. |
| **SPA Assistant** | AI assistant for Sale and Purchase Agreement analysis and support. |
| **FDD Researcher** | Pre-data-room kickoff brief generator that creates comprehensive business overviews of the target company, with industry-specific playbooks and data request templates. |

### Planned (New Ideas)
| Tool | Description |
|------|-------------|
| **Databook Associate** | Generates Excel schedules in Transaction Services according to KPMG brand standards. Processes a variety of data room schedules including leases, trial balances, aging schedules, and GL breakdowns. |
| **Quality Control Assistant** | Performs QC analysis on Transaction Services databooks and reports through automated consistency checks across deliverables. |

**Placeholder Icons:** KPMG Blue circles with tool initials (e.g., "TSL", "SPA", "FDD", "DBA", "QCA")

---

## Technical Implementation

### Files to Create
```
/Users/rishi/Code/chatgpt/ai-tools-showcase/
├── generate_showcase.py      # Main generation script
├── output/
│   └── ai-tools-showcase.pptx
```

### Python Script Structure (`generate_showcase.py`)

1. **Imports:** `python-pptx`, `PIL` for image processing
2. **Constants:**
   - KPMG Blue: `#00338D`
   - Medium Blue: `#005EB8`
   - Green (for "Released"): `#00A3A1`
   - Purple (for "Planned"): `#6D2077`
   - Font: Arial
3. **Functions:**
   - `create_tool_card()` - Creates a card with icon, title, description
   - `create_placeholder_icon()` - Generates initials-in-circle placeholder
   - `create_status_badge()` - Creates "Released" / "In Development" / "Planned" badge
   - `build_released_slide()` - Assembles Slide 1
   - `build_roadmap_slide()` - Assembles Slide 2
   - `main()` - Orchestrates generation

### Card Design
- **Dimensions:** ~4.5" x 3" per card (2 columns)
- **Icon:** 80x80px in top-left or centered
- **Title:** Arial 14pt Bold, KPMG Blue
- **Description:** Arial 10pt, Black, 2-3 sentences max
- **Status Badge:** Rounded rectangle with white text

### KPMG Branding (from `kpmg-pptx/docs/branding_kpmg.md`)
- Primary: `#00338D` (KPMG Blue)
- Accents: `#0091DA` (Light Blue), `#00A3A1` (Green), `#6D2077` (Purple)
- Font: Arial throughout
- Clean white backgrounds

---

## Verification

1. **Run the script:**
   ```bash
   cd /Users/rishi/Code/chatgpt/ai-tools-showcase
   python generate_showcase.py
   ```

2. **Check output:**
   - Open `output/ai-tools-showcase.pptx` in PowerPoint
   - Verify all 4 released tools appear with icons on Slide 1
   - Verify all 5 roadmap tools appear with status badges on Slide 2
   - Confirm KPMG branding (colors, fonts) is applied correctly

3. **Export to PDF:**
   - User can export from PowerPoint for PDF version

---

## Dependencies
- `python-pptx` (already used in `kpmg-pptx/` infrastructure)
- `Pillow` (for image processing/placeholder generation)
