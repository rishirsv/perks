# Implementation Prompt: AI Tools Visual Showcase

## Context

We need a 2-slide PowerPoint presentation showcasing KPMG Transaction Services AI tools for a Management Committee meeting. The presentation should be generated programmatically using Python.

---

## Requirements

### Slide 1: Released AI Tools

Create a visually appealing 2x2 grid showing 4 released tools. Each tool card should include:
- The tool's icon/logo
- Tool name as the heading
- 1-2 sentence description

**Tools and their details:**

| Tool | Icon Location | Description |
|------|---------------|-------------|
| **KDN Tasks** | `/Users/rishi/Code/chatgpt/kdn-tasks/kdn_logo.png` | Drafts clear, actionable email instructions for KDN offshore execution teams. Handles any task—from IS/BS roll-forwards and AR/AP schedules to GL breakdowns and QoE support work. |
| **Meeting Intelligence** | `/Users/rishi/Code/chatgpt/meeting-intelligence/dist/meeting-intelligence-logo.png` | Transforms meeting transcripts into comprehensive, template-structured notes for FDD and General Business meetings. All content is transcript-grounded with zero invention. |
| **MetaPrompt** | `/Users/rishi/Code/chatgpt/meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg` | Optimizes user tasks into refined AI prompts using structured templates, ensuring consistent quality for downstream model execution. |
| **TS Copywriter** | `/Users/rishi/Code/chatgpt/ts-copywriter/archive/ts-copywriter-icon.png` | Rewrites, drafts, and polishes financial due diligence report content with Big 4 partner-level expertise, applying strict style guidelines and data-anchored language. |

### Slide 2: AI Tools Roadmap

Create a grid layout with status badges showing tools in development and planned tools.

**In Development (3 tools):**

| Tool | Description |
|------|-------------|
| **TS Letters** | Automates generation of Transaction Services due diligence letters (Client Release, Third Party Access, Factual Accuracy) by filling DOCX templates with deal-specific data. |
| **SPA Assistant** | AI assistant for Sale and Purchase Agreement analysis and support. |
| **FDD Researcher** | Pre-data-room kickoff brief generator that creates comprehensive business overviews of the target company, with industry-specific playbooks and data request templates. |

**Planned / New Ideas (2 tools):**

| Tool | Description |
|------|-------------|
| **Databook Associate** | Generates Excel schedules in Transaction Services according to KPMG brand standards. Processes a variety of data room schedules including leases, trial balances, aging schedules, and GL breakdowns. |
| **Quality Control Assistant** | Performs QC analysis on Transaction Services databooks and reports through automated consistency checks across deliverables. |

**Note:** These 5 roadmap tools do NOT have icons. Create placeholder icons using KPMG Blue circles with the tool's initials (e.g., "TSL" for TS Letters, "SPA" for SPA Assistant, "FDD" for FDD Researcher, "DBA" for Databook Associate, "QCA" for Quality Control Assistant).

---

## KPMG Brand Guidelines

### Colors
- **KPMG Blue (Primary):** `#00338D` - Use for headings, tool titles, placeholder icon backgrounds
- **Medium Blue:** `#005EB8`
- **Light Blue:** `#0091DA` - Can use for "In Development" status badges
- **Green:** `#00A3A1` - Use for "Released" status badges
- **Purple:** `#6D2077` - Use for "Planned" status badges

### Typography
- **Font:** Arial throughout (this is the KPMG standard for PowerPoint)
- **Tool titles:** Arial 14pt Bold, KPMG Blue
- **Descriptions:** Arial 10pt, Black
- **Status badges:** Arial 9pt Bold, White text on colored background

### General Style
- Clean white backgrounds
- Professional, minimalist design
- Icons should be consistent in size (~80x80px or similar)

---

## Technical Implementation

### Location
Create all files in: `/Users/rishi/Code/chatgpt/ai-tools-showcase/`

### Recommended Approach
Use `python-pptx` library (already used elsewhere in this repo at `/Users/rishi/Code/chatgpt/kpmg-pptx/`).

### Script Structure
Create `generate_showcase.py` with:

1. **Constants** - Colors, fonts, dimensions
2. **Helper functions:**
   - `create_placeholder_icon(initials, output_path)` - Generates a KPMG Blue circle with white initials using PIL/Pillow
   - `add_tool_card(slide, x, y, icon_path, title, description)` - Adds a tool card at specified position
   - `add_status_badge(slide, x, y, text, color)` - Adds a rounded status badge
3. **Slide builders:**
   - `build_released_tools_slide(prs)` - Creates Slide 1
   - `build_roadmap_slide(prs)` - Creates Slide 2
4. **Main function** - Orchestrates generation and saves output

### Output
Save generated file to: `/Users/rishi/Code/chatgpt/ai-tools-showcase/output/ai-tools-showcase.pptx`

---

## Dependencies

```
python-pptx
Pillow
```

These should already be available in the environment (used by other tools in this repo).

---

## Verification Checklist

After running the script:
- [ ] Output file exists at `output/ai-tools-showcase.pptx`
- [ ] Slide 1 shows all 4 released tools with their actual icons
- [ ] Slide 2 shows all 5 roadmap tools with placeholder icons
- [ ] Status badges display correctly ("In Development" vs "Planned")
- [ ] All text is readable and properly formatted
- [ ] KPMG Blue color is applied correctly to headings
- [ ] Icons are consistently sized
- [ ] File opens correctly in PowerPoint/Keynote

---

## Reference Files

For additional context on KPMG branding and existing PPTX generation patterns, see:
- `/Users/rishi/Code/chatgpt/kpmg-pptx/docs/branding_kpmg.md` - Full KPMG brand guidelines
- `/Users/rishi/Code/chatgpt/kpmg-pptx/core/glossary_generator.py` - Example of python-pptx usage in this repo
- `/Users/rishi/Code/chatgpt/kpmg-pptx/core/formatting.py` - Text formatting utilities
