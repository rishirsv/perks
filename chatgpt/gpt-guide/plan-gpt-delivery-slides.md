# Plan: GPT Delivery Slides

## Overview

Create client delivery slides for each GPT in the same format as the "AI Client Delivery Blueprint Slide - Project Planner GPT.pptx" template. The template is a 2-slide PowerPoint with a consistent structure across both slides.

## Template Structure Analysis

The existing template follows this layout:

### Slide 1 - Main Information Slide
| Section | Content Type |
|---------|-------------|
| **Title** | GPT Name (bold, KPMG Bold font) |
| **Subtitle** | Catchy tagline |
| **The problem** (bordered box) | 1 paragraph describing the pain point |
| **The solution** (bordered box) | Contains 3 sub-sections: |
| → What it is | 1-2 sentences describing the tool |
| → How it works | Multi-sentence workflow explanation |
| → Who it's for | 1 sentence target audience |
| **How you will benefit** (right side, bordered) | 4 bullet points of value propositions |
| **Watch a Demo** (right side, small box) | Placeholder for demo video/link |
| **Interested?** (right side, bordered) | Links: Example outputs, Get this GPT, Rate this GPT, Questions contact |
| **Builder attribution** (bottom) | Photo + "Built by [Name] \| Click to recognize" |

### Slide 2
Appears to be a second example or variant of the same structure for a different GPT (TS Copywriter example shown).

---

## GPTs to Create Slides For

### Active (Ready to Build)

| # | Name | Folder | Logo Path |
|---|------|--------|-----------|
| 1 | **FDD Researcher** | `fdd-researcher` | `fdd-researcher/dist/fdd-researcher-icon.png` |
| 2 | **KDN Task Writer** | `kdn-tasks` | `kdn-tasks/dist/kdn_logo.png` |
| 3 | **Lingo** | `lingo` | `lingo/dist/lingo_logo.png` |
| 4 | **MetaPrompt** | `meta-prompt` | `meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg` |
| 5 | **Meeting Intelligence** | `meeting-intelligence` | `meeting-intelligence/dist/meeting-intelligence-logo.png` |

### Roadmap (Tag as "Coming Soon")

| # | Name | Folder | Logo Path |
|---|------|--------|-----------|
| 6 | **SPA Assistant** | `spa-assistant` | `ai-tools-showcase/workspace/icon-spa.png` |
| 7 | **Data Book Analyst** | `databook-analyst` | `ai-tools-showcase/workspace/icon-dba.png` |

---

## Slide Content Drafts

### 1. FDD Researcher

**Title:** FDD Researcher

**Logo:** `fdd-researcher/dist/fdd-researcher-icon.png`

**Subtitle:** From sparse kickoff docs to structured research brief

**The problem:**
Before the data room opens, FDD teams typically have only a CIM, a teaser, and maybe some preliminary financials. Associates manually piece together company and industry context from scattered sources while the clock ticks toward the first client call. This prep work is critical, but it's time-consuming and varies widely in quality across deals.

**What it is:**
A research assistant that transforms sparse kickoff materials into a scan-friendly brief with company overview, industry context, and a prioritized diligence playbook.

**How it works:**
Upload your kickoff documents (CIM, VDD reports, teasers, financials). FDD Researcher extracts company-specific facts, then presents a research plan for your approval. Once approved, it conducts web research to fill in industry context and unknowns. The output is a structured Kickoff Brief with key findings, data requests, and management questions—clearly labeled by source ([DOC] vs [WEB]). Review and validate before distribution.

**Who it's for:**
FDD associates and teams preparing for financial due diligence engagements.

**Benefits:**
- Compress hours of manual research into minutes
- Consistent, structured briefs across all deals
- Clear separation of document facts vs. web research
- Industry-specific modules (SaaS, Healthcare, Industrials, and more)

**Builder:** Rishi Sharma

---

### 2. KDN Task Writer

**Title:** KDN Task Writer

**Logo:** `kdn-tasks/dist/kdn_logo.png`

**Subtitle:** From voice notes to execution-ready task packets

**The problem:**
Tasking overnight FDD work is a daily ritual. Associates juggle free-form dictations, file uploads, and shifting priorities—often resulting in ambiguous instructions and back-and-forth questions that delay execution. When tasks aren't clear, quality suffers and rework follows.

**What it is:**
A task standardization tool that converts free-form instructions and file uploads into precise, execution-ready task packets with send-ready initiation emails.

**How it works:**
Provide your dictation or notes along with relevant files (Excel, Word, PDF). KDN Task Writer produces a formatted initiation email with project defaults and folder links, plus per-workstream task packets with explicit inputs, numbered steps, acceptance checks, and deliverable naming conventions. Clarifying questions are only asked when truly needed.

**Who it's for:**
FDD associates tasking overnight work and KDN overnight associates executing tasks.

**Benefits:**
- Every task packet includes clear inputs, steps, and acceptance criteria
- Send-ready emails with standardized folder conventions
- Explicit checks catch issues before they become rework
- Less time writing instructions, more time on analysis

**Builder:** Rishi Sharma

---

### 3. Lingo

**Title:** Lingo

**Logo:** `lingo/dist/lingo_logo.png`

**Subtitle:** Glossary slides, branded and formatted in seconds

**The problem:**
Deal teams frequently need glossary slides for proposals and client presentations. Building these manually—ensuring consistent formatting, KPMG branding, and proper pagination—is tedious. Terms and definitions change mid-project, and suddenly you're rebuilding slides from scratch.

**What it is:**
A glossary generator that converts term/definition lists into polished, KPMG-branded PowerPoint decks.

**How it works:**
Provide your terms and definitions in any structured format (Excel, CSV, or a bulleted list). Lingo applies KPMG-branded templates, handles pagination automatically to avoid text clipping, and produces a polished deck. Update your source list and regenerate instantly.

**Who it's for:**
Deal teams needing branded glossary decks for proposals, reports, and client presentations.

**Benefits:**
- No more manual slide building
- KPMG colors, fonts, and formatting applied automatically
- Long definitions handled gracefully without clipping
- Regenerate in seconds when terms change

**Builder:** Rishi Sharma

---

### 4. MetaPrompt

**Title:** MetaPrompt

**Logo:** `meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg`

**Subtitle:** Turn any task into an optimized prompt

**The problem:**
Getting consistent, high-quality outputs from AI tools requires well-crafted prompts—but most people aren't prompt engineers. Teams iterate on prompts that are too vague, too verbose, or missing key constraints, leading to inconsistent results and frustration.

**What it is:**
A prompt optimization tool that transforms free-form task descriptions into concise, structured prompts ready for downstream AI models.

**How it works:**
Describe what you want to accomplish. MetaPrompt analyzes your task, selects the appropriate template (Essential, Standard, or Research), and produces an optimized prompt with role definition, constraints, output format, and examples—all within strict word budgets. It never executes the task itself; it only delivers the prompt for you to use.

**Who it's for:**
Anyone building prompts for AI tools, from prompt engineers to teams experimenting with ChatGPT.

**Benefits:**
- Best practices baked in automatically
- Three template levels for different task complexities
- Strict word budgets keep prompts lean and effective
- Spend less time tweaking, more time using

**Builder:** Rishi Sharma

---

### 5. Meeting Intelligence

**Title:** Meeting Intelligence

**Logo:** `meeting-intelligence/dist/meeting-intelligence-logo.png`

**Subtitle:** From transcript to structured notes, nothing invented

**The problem:**
Meeting transcripts capture everything, but extracting the signal from the noise takes time. Associates review recordings, pull out key figures and decisions, then format notes for the team. Important details get lost, and note quality varies wildly.

**What it is:**
A note-taking tool that converts meeting transcripts into comprehensive, template-structured notes—everything grounded in the source material, nothing invented.

**How it works:**
Upload your transcript (any format). Meeting Intelligence classifies the meeting type (FDD or General Business) and applies the appropriate template. It extracts all material information—figures, policies, risks, decisions, follow-ups—and produces scan-friendly notes scaled to transcript length. Small talk and logistics are filtered out.

**Who it's for:**
FDD teams, deal managers, and anyone needing thorough, searchable meeting records.

**Benefits:**
- No material detail left behind
- Consistent format across all meetings
- Zero invented numbers or unstated assumptions
- Note length scales with transcript complexity

**Builder:** Rishi Sharma

---

### 6. SPA Assistant (ROADMAP)

**Title:** SPA Assistant

**Logo:** `ai-tools-showcase/workspace/icon-spa.png`

**Subtitle:** SPA review with scored issues and counsel questions

**The problem:**
Reviewing Share Purchase Agreements is complex and high-stakes. Legal and deal teams must identify economically material terms and potential issues across hundreds of pages under tight deadlines. Missing a key definition or clause interaction can have significant financial consequences.

**What it is:**
A legal review assistant that analyzes SPAs and produces structured issue registers with impact scoring, counsel questions, and tactical response options.

**How it works:**
Upload your SPA and specify your perspective (buyer, seller, or neutral). SPA Assistant performs a definitions-led review, identifying economically material terms and cross-references. It produces an issue register grouped by category with Impact/Likelihood/Recoverability scoring. Each issue includes clause references, plain-English explanations, and suggested counsel language.

**Who it's for:**
M&A lawyers, in-house counsel, and deal teams reviewing acquisition agreements.

**Benefits:**
- Systematic issue identification across the full agreement
- Scored priorities help focus on what matters most
- Plain English explanations alongside counsel-ready language
- Buyer, seller, or neutral analysis modes

**Builder:** Rishi Sharma

**Status:** ROADMAP - Coming Soon

---

### 7. Data Book Analyst (ROADMAP)

**Title:** Data Book Analyst

**Logo:** `ai-tools-showcase/workspace/icon-dba.png`

**Subtitle:** From raw data room exports to analysis-ready databooks

**The problem:**
FDD teams wrestle with messy data room exports—inconsistent formatting, missing headers, broken references. Converting this raw data into KPMG-standard databooks with proper analyses is tedious and pulls associates away from actual analysis work.

**What it is:**
A databook builder that converts raw data room exports into normalized KPMG databooks with standard analyses and embedded questions.

**How it works:**
Upload your data room files (Excel, CSV). In Plan Mode, Data Book Analyst produces a wireframe showing tab layout, source-to-target mapping, and execution checklist—no output until you approve. Say "Proceed" to execute. It generates your databook with standard analyses (P&L trending, sales & margin cuts, payroll/headcount), inline validation checks, and flagged questions where issues exist.

**Who it's for:**
FDD associates and seniors preparing databooks for analysis and presentation.

**Benefits:**
- Plan review before any execution
- P&L, sales, and payroll analysis modules included
- Questions and flags embedded where issues exist
- KPMG formatting standards applied automatically

**Builder:** Rishi Sharma

**Status:** ROADMAP - Coming Soon

---

## Implementation Tasks

### Phase 1: Setup
1. [ ] Use the existing template PPTX as the base
2. [ ] Create a working copy for each GPT
3. [ ] Determine approach: Edit existing OOXML vs. html2pptx generation

### Phase 2: Create Active Slides
4. [ ] FDD Researcher slide
5. [ ] KDN Task Writer slide
6. [ ] Lingo slide
7. [ ] MetaPrompt slide
8. [ ] Meeting Intelligence slide

### Phase 3: Create Roadmap Slides
9. [ ] SPA Assistant slide (with "Coming Soon" badge)
10. [ ] Data Book Analyst slide (with "Coming Soon" badge)

### Phase 4: Finalize
11. [ ] Combine all slides into a single deck (optional)
12. [ ] Review formatting consistency
13. [ ] Add demo videos/links where available
14. [ ] Update builder photos and recognition links

---

## Technical Notes

### Recommended Approach
Given the template complexity (KPMG styling, precise positioning, grouped elements), the recommended approach is:

1. **Duplicate the template** for each GPT using file copy
2. **Unpack → Edit XML → Repack** workflow to replace text content
3. Keep all styling, positioning, and grouping intact

### Files to Edit
- `ppt/slides/slide1.xml` - Main content slide
- `ppt/slides/slide2.xml` - (if using second slide)
- `ppt/media/` - Builder photos and GPT logos

### Logo Placement
The logo should be placed in the "Watch a Demo" box area (upper right), replacing or alongside the demo placeholder. This provides visual branding for each GPT.

**Logo files to copy into `ppt/media/`:**
| GPT | Source Logo |
|-----|-------------|
| FDD Researcher | `/Users/rishi/Code/chatgpt/fdd-researcher/dist/fdd-researcher-icon.png` |
| KDN Task Writer | `/Users/rishi/Code/chatgpt/kdn-tasks/dist/kdn_logo.png` |
| Lingo | `/Users/rishi/Code/chatgpt/lingo/dist/lingo_logo.png` |
| MetaPrompt | `/Users/rishi/Code/chatgpt/meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg` |
| Meeting Intelligence | `/Users/rishi/Code/chatgpt/meeting-intelligence/dist/meeting-intelligence-logo.png` |
| SPA Assistant | `/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-spa.png` |
| Data Book Analyst | `/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-dba.png` |

### Key XML Elements to Replace
- Title: `<a:t>Project Planner Agent</a:t>` → GPT name (without "Agent")
- Subtitle: `<a:t>From SOW to...</a:t>` → New tagline
- Problem section text
- Solution section (What/How/Who)
- Benefits bullet points
- Builder name and links

---

## Output Location

All generated slides should be saved to:
`/Users/rishi/Code/chatgpt/gpt-guide/slides/`

With naming convention:
`AI Client Delivery Slide - [GPT Name].pptx`
