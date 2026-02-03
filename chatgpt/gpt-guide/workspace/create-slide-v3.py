#!/usr/bin/env python3
"""
Create GPT delivery slides by duplicating template and replacing content.
V3: Handle Unicode curly quotes/apostrophes properly.
"""

import os
import shutil
import zipfile
import re
import sys

TEMPLATE_PATH = "/Users/rishi/Code/chatgpt/gpt-guide/AI Client Delivery Blueprint Slide - Project Planner GPT.pptx"
OUTPUT_DIR = "/Users/rishi/Code/chatgpt/gpt-guide/slides"
WORKSPACE = "/Users/rishi/Code/chatgpt/gpt-guide/workspace"

# GPT content definitions
GPTS = {
    "fdd-researcher": {
        "title": "FDD Researcher",
        "subtitle": "From sparse kickoff docs to structured research brief",
        "problem": "Before the data room opens, FDD teams typically have only a CIM, a teaser, and maybe some preliminary financials. Associates manually piece together company and industry context from scattered sources while the clock ticks toward the first client call. This prep work is critical, but it's time-consuming and varies widely in quality across deals.",
        "what_it_is": "A research assistant that transforms sparse kickoff materials into a scan-friendly brief with company overview, industry context, and a prioritized diligence playbook.",
        "how_it_works_main": "Upload your kickoff documents (CIM, VDD reports, teasers, financials). FDD Researcher extracts company-specific facts, then presents a research plan for your approval. Once approved, it conducts web research to fill in industry context and unknowns. The output is a structured Kickoff Brief with key findings, data requests, and management questions—clearly labeled by source ([DOC] vs [WEB]). Review and validate before distribution.",
        "who_its_for": "FDD associates and teams preparing for financial due diligence engagements.",
        "benefits": [
            "Compress hours of manual research into minutes",
            "Consistent, structured briefs across all deals",
            "Clear separation of document facts vs. web research",
            "Industry-specific modules (SaaS, Healthcare, Industrials, and more)"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/fdd-researcher/dist/fdd-researcher-icon.png",
    },
    "kdn-task-writer": {
        "title": "KDN Task Writer",
        "subtitle": "From voice notes to execution-ready task packets",
        "problem": "Tasking overnight FDD work is a daily ritual. Associates juggle free-form dictations, file uploads, and shifting priorities—often resulting in ambiguous instructions and back-and-forth questions that delay execution. When tasks aren't clear, quality suffers and rework follows.",
        "what_it_is": "A task standardization tool that converts free-form instructions and file uploads into precise, execution-ready task packets with send-ready initiation emails.",
        "how_it_works_main": "Provide your dictation or notes along with relevant files (Excel, Word, PDF). KDN Task Writer produces a formatted initiation email with project defaults and folder links, plus per-workstream task packets with explicit inputs, numbered steps, acceptance checks, and deliverable naming conventions. Clarifying questions are only asked when truly needed.",
        "who_its_for": "FDD associates tasking overnight work and KDN overnight associates executing tasks.",
        "benefits": [
            "Every task packet includes clear inputs, steps, and acceptance criteria",
            "Send-ready emails with standardized folder conventions",
            "Explicit checks catch issues before they become rework",
            "Less time writing instructions, more time on analysis"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/kdn-tasks/dist/kdn_logo.png",
    },
    "lingo": {
        "title": "Lingo",
        "subtitle": "Glossary slides, branded and formatted in seconds",
        "problem": "Deal teams frequently need glossary slides for proposals and client presentations. Building these manually—ensuring consistent formatting, KPMG branding, and proper pagination—is tedious. Terms and definitions change mid-project, and suddenly you're rebuilding slides from scratch.",
        "what_it_is": "A glossary generator that converts term/definition lists into polished, KPMG-branded PowerPoint decks.",
        "how_it_works_main": "Provide your terms and definitions in any structured format (Excel, CSV, or a bulleted list). Lingo applies KPMG-branded templates, handles pagination automatically to avoid text clipping, and produces a polished deck. Update your source list and regenerate instantly.",
        "who_its_for": "Deal teams needing branded glossary decks for proposals, reports, and client presentations.",
        "benefits": [
            "No more manual slide building",
            "KPMG colors, fonts, and formatting applied automatically",
            "Long definitions handled gracefully without clipping",
            "Regenerate in seconds when terms change"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/lingo/dist/lingo_logo.png",
    },
    "metaprompt": {
        "title": "MetaPrompt",
        "subtitle": "Turn any task into an optimized prompt",
        "problem": "Getting consistent, high-quality outputs from AI tools requires well-crafted prompts—but most people aren't prompt engineers. Teams iterate on prompts that are too vague, too verbose, or missing key constraints, leading to inconsistent results and frustration.",
        "what_it_is": "A prompt optimization tool that transforms free-form task descriptions into concise, structured prompts ready for downstream AI models.",
        "how_it_works_main": "Describe what you want to accomplish. MetaPrompt analyzes your task, selects the appropriate template (Essential, Standard, or Research), and produces an optimized prompt with role definition, constraints, output format, and examples—all within strict word budgets. It never executes the task itself; it only delivers the prompt for you to use.",
        "who_its_for": "Anyone building prompts for AI tools, from prompt engineers to teams experimenting with ChatGPT.",
        "benefits": [
            "Best practices baked in automatically",
            "Three template levels for different task complexities",
            "Strict word budgets keep prompts lean and effective",
            "Spend less time tweaking, more time using"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg",
    },
    "meeting-intelligence": {
        "title": "Meeting Intelligence",
        "subtitle": "From transcript to structured notes, nothing invented",
        "problem": "Meeting transcripts capture everything, but extracting the signal from the noise takes time. Associates review recordings, pull out key figures and decisions, then format notes for the team. Important details get lost, and note quality varies wildly.",
        "what_it_is": "A note-taking tool that converts meeting transcripts into comprehensive, template-structured notes—everything grounded in the source material, nothing invented.",
        "how_it_works_main": "Upload your transcript (any format). Meeting Intelligence classifies the meeting type (FDD or General Business) and applies the appropriate template. It extracts all material information—figures, policies, risks, decisions, follow-ups—and produces scan-friendly notes scaled to transcript length. Small talk and logistics are filtered out.",
        "who_its_for": "FDD teams, deal managers, and anyone needing thorough, searchable meeting records.",
        "benefits": [
            "No material detail left behind",
            "Consistent format across all meetings",
            "Zero invented numbers or unstated assumptions",
            "Note length scales with transcript complexity"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/meeting-intelligence/dist/meeting-intelligence-logo.png",
    },
    "spa-assistant": {
        "title": "SPA Assistant",
        "subtitle": "SPA review with scored issues and counsel questions",
        "problem": "Reviewing Share Purchase Agreements is complex and high-stakes. Legal and deal teams must identify economically material terms and potential issues across hundreds of pages under tight deadlines. Missing a key definition or clause interaction can have significant financial consequences.",
        "what_it_is": "A legal review assistant that analyzes SPAs and produces structured issue registers with impact scoring, counsel questions, and tactical response options.",
        "how_it_works_main": "Upload your SPA and specify your perspective (buyer, seller, or neutral). SPA Assistant performs a definitions-led review, identifying economically material terms and cross-references. It produces an issue register grouped by category with Impact/Likelihood/Recoverability scoring. Each issue includes clause references, plain-English explanations, and suggested counsel language.",
        "who_its_for": "M&A lawyers, in-house counsel, and deal teams reviewing acquisition agreements.",
        "benefits": [
            "Systematic issue identification across the full agreement",
            "Scored priorities help focus on what matters most",
            "Plain English explanations alongside counsel-ready language",
            "Buyer, seller, or neutral analysis modes"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-spa.png",
    },
    "data-book-analyst": {
        "title": "Data Book Analyst",
        "subtitle": "From raw data room exports to analysis-ready databooks",
        "problem": "FDD teams wrestle with messy data room exports—inconsistent formatting, missing headers, broken references. Converting this raw data into KPMG-standard databooks with proper analyses is tedious and pulls associates away from actual analysis work.",
        "what_it_is": "A databook builder that converts raw data room exports into normalized KPMG databooks with standard analyses and embedded questions.",
        "how_it_works_main": "Upload your data room files (Excel, CSV). In Plan Mode, Data Book Analyst produces a wireframe showing tab layout, source-to-target mapping, and execution checklist—no output until you approve. Say 'Proceed' to execute. It generates your databook with standard analyses (P&L trending, sales & margin cuts, payroll/headcount), inline validation checks, and flagged questions where issues exist.",
        "who_its_for": "FDD associates and seniors preparing databooks for analysis and presentation.",
        "benefits": [
            "Plan review before any execution",
            "P&L, sales, and payroll analysis modules included",
            "Questions and flags embedded where issues exist",
            "KPMG formatting standards applied automatically"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-dba.png",
    }
}

def escape_xml(text):
    """Escape special XML characters."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    return text

def normalize_quotes(text):
    """Normalize curly quotes/apostrophes to straight ones for matching."""
    # Curly double quotes
    text = text.replace('"', '"').replace('"', '"')
    # Curly single quotes/apostrophes
    text = text.replace(''', "'").replace(''', "'")
    # En-dash and em-dash to regular hyphen
    text = text.replace('–', '-').replace('—', '-')
    return text

def create_slide(gpt_key, gpt_data):
    """Create a slide for the given GPT."""
    print(f"Creating slide for {gpt_data['title']}...")

    # Create working directory
    work_dir = os.path.join(WORKSPACE, gpt_key)
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)

    # Unpack template
    with zipfile.ZipFile(TEMPLATE_PATH, 'r') as zip_ref:
        zip_ref.extractall(work_dir)

    # Read slide1.xml
    slide1_path = os.path.join(work_dir, "ppt", "slides", "slide1.xml")
    with open(slide1_path, 'r', encoding='utf-8') as f:
        slide_xml = f.read()

    # === REPLACEMENTS ===
    # We'll use regex to find <a:t>...</a:t> elements and replace their content

    def replace_text_block(xml, pattern_text, new_text):
        """Replace text content within a:t tags, handling curly quotes."""
        # Escape for regex
        pattern_normalized = normalize_quotes(pattern_text)
        new_text_escaped = escape_xml(new_text)

        def replacer(match):
            original = match.group(1)
            original_normalized = normalize_quotes(original)
            if pattern_normalized in original_normalized:
                # Replace the matching portion
                return f'<a:t>{new_text_escaped}</a:t>'
            return match.group(0)

        # Find all a:t elements and check if they match
        result = re.sub(r'<a:t>([^<]*)</a:t>', replacer, xml)
        return result

    # Title
    slide_xml = replace_text_block(slide_xml, "Project Planner Agent", gpt_data["title"])

    # Subtitle (with curly quotes in original)
    slide_xml = replace_text_block(slide_xml, 'From SOW to "so organized" in seconds', gpt_data["subtitle"])

    # Problem text (with curly apostrophe and en-dash)
    old_problem = "At KPMG, we're constantly setting up new engagements and projects, and almost every one of them needs a project plan in Excel. Building those plans can be tedious, manual, and time-consuming. Searching for old templates, copy-pasting across files, double-checking that formatting and dates remain intact - all while the clock is ticking and your team is waiting to get started."
    slide_xml = replace_text_block(slide_xml, old_problem, gpt_data["problem"])

    # What it is (with curly quotes)
    old_what = 'An AI-powered "Project Planner" that turns high-level engagement documents - like SoWs, kick-off notes, and overview slides - into detailed, structured project plans that you can instantly export to a clean, standardized Excel file.'
    slide_xml = replace_text_block(slide_xml, old_what, gpt_data["what_it_is"])

    # How it works - this is split across multiple a:t elements, so replace the main chunk
    old_how_main = "Upload your SoW (or similar document) that outlines scope, workstreams, and deliverables. Tell the Agent your project start and end dates, plus any timing constraints or milestones you already know. Project Planner will generate a detailed table that breaks the work into phases, tasks, and timelines. If you want to tweak the structure before finalizing, type"
    slide_xml = replace_text_block(slide_xml, old_how_main, gpt_data["how_it_works_main"])

    # Clear out the other "How it works" fragments
    slide_xml = replace_text_block(slide_xml, '"Use the canvas tool"', "")
    slide_xml = replace_text_block(slide_xml, "so you can edit the output.  When everything looks right, type", "")
    slide_xml = replace_text_block(slide_xml, "Export to Excel", "")
    slide_xml = replace_text_block(slide_xml, '" to get a polished project plan you can share with your team or client. Be sure to review and validate the plan before distribution - final ownership and accountability for the output remains with you.', "")

    # Who it's for
    old_who = "Any KPMG professional responsible for creating or managing project plans."
    slide_xml = replace_text_block(slide_xml, old_who, gpt_data["who_its_for"])

    # Benefits
    old_benefits = [
        "Time savings you can feel immediately - a task that once took 2-4 hours drops to 5-10 minutes.",
        "Higher quality project plans with less effort - automatically generate clean, consistent, client-ready plans every time.",
        "Accelerate your engagement kick-offs - project plans become available within minutes of signing off an SOW, allowing teams to start faster.",
        "Less administrative work - more time for analysis and strategy."
    ]
    for i, old_benefit in enumerate(old_benefits):
        if i < len(gpt_data["benefits"]):
            slide_xml = replace_text_block(slide_xml, old_benefit, gpt_data["benefits"][i])

    # Builder name
    slide_xml = replace_text_block(slide_xml, "Zack Mindel", gpt_data["builder"])
    slide_xml = slide_xml.replace("send a recognition to Zack", f"send a recognition to {gpt_data['builder'].split()[0]}")

    # Write modified slide1.xml
    with open(slide1_path, 'w', encoding='utf-8') as f:
        f.write(slide_xml)

    # Copy logo to media folder
    if gpt_data.get("logo_path") and os.path.exists(gpt_data["logo_path"]):
        media_dir = os.path.join(work_dir, "ppt", "media")
        logo_ext = os.path.splitext(gpt_data["logo_path"])[1]
        logo_dest = os.path.join(media_dir, f"gpt_logo{logo_ext}")
        shutil.copy2(gpt_data["logo_path"], logo_dest)

    # Remove slide2
    for path in [
        os.path.join(work_dir, "ppt", "slides", "slide2.xml"),
        os.path.join(work_dir, "ppt", "slides", "_rels", "slide2.xml.rels"),
        os.path.join(work_dir, "ppt", "notesSlides", "notesSlide2.xml"),
        os.path.join(work_dir, "ppt", "notesSlides", "_rels", "notesSlide2.xml.rels"),
    ]:
        if os.path.exists(path):
            os.remove(path)

    # Update presentation.xml
    pres_path = os.path.join(work_dir, "ppt", "presentation.xml")
    with open(pres_path, 'r', encoding='utf-8') as f:
        pres_xml = f.read()
    pres_xml = re.sub(r'<p:sldId[^>]*r:id="rId3"[^>]*/>', '', pres_xml)
    with open(pres_path, 'w', encoding='utf-8') as f:
        f.write(pres_xml)

    # Update [Content_Types].xml
    ct_path = os.path.join(work_dir, "[Content_Types].xml")
    with open(ct_path, 'r', encoding='utf-8') as f:
        ct_xml = f.read()
    ct_xml = re.sub(r'<Override[^>]*PartName="/ppt/slides/slide2\.xml"[^>]*/>', '', ct_xml)
    ct_xml = re.sub(r'<Override[^>]*PartName="/ppt/notesSlides/notesSlide2\.xml"[^>]*/>', '', ct_xml)
    with open(ct_path, 'w', encoding='utf-8') as f:
        f.write(ct_xml)

    # Update presentation.xml.rels
    rels_path = os.path.join(work_dir, "ppt", "_rels", "presentation.xml.rels")
    with open(rels_path, 'r', encoding='utf-8') as f:
        rels_xml = f.read()
    rels_xml = re.sub(r'<Relationship[^>]*Target="slides/slide2\.xml"[^>]*/>', '', rels_xml)
    with open(rels_path, 'w', encoding='utf-8') as f:
        f.write(rels_xml)

    # Create output file
    output_filename = f"AI Client Delivery Slide - {gpt_data['title']}.pptx"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(work_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)

    print(f"  Created: {output_filename}")
    return output_path

def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    if len(sys.argv) > 1:
        gpt_key = sys.argv[1]
        if gpt_key in GPTS:
            create_slide(gpt_key, GPTS[gpt_key])
        else:
            print(f"Unknown GPT: {gpt_key}")
            sys.exit(1)
    else:
        for gpt_key, gpt_data in GPTS.items():
            create_slide(gpt_key, gpt_data)

    print("\nDone!")

if __name__ == "__main__":
    main()
