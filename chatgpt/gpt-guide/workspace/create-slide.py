#!/usr/bin/env python3
"""
Create GPT delivery slides by duplicating template and replacing content.
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
        "how_it_works": "Upload your kickoff documents (CIM, VDD reports, teasers, financials). FDD Researcher extracts company-specific facts, then presents a research plan for your approval. Once approved, it conducts web research to fill in industry context and unknowns. The output is a structured Kickoff Brief with key findings, data requests, and management questions—clearly labeled by source ([DOC] vs [WEB]). Review and validate before distribution.",
        "who_its_for": "FDD associates and teams preparing for financial due diligence engagements.",
        "benefits": [
            "Compress hours of manual research into minutes",
            "Consistent, structured briefs across all deals",
            "Clear separation of document facts vs. web research",
            "Industry-specific modules (SaaS, Healthcare, Industrials, and more)"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/fdd-researcher/dist/fdd-researcher-icon.png",
        "roadmap": False
    },
    "kdn-task-writer": {
        "title": "KDN Task Writer",
        "subtitle": "From voice notes to execution-ready task packets",
        "problem": "Tasking overnight FDD work is a daily ritual. Associates juggle free-form dictations, file uploads, and shifting priorities—often resulting in ambiguous instructions and back-and-forth questions that delay execution. When tasks aren't clear, quality suffers and rework follows.",
        "what_it_is": "A task standardization tool that converts free-form instructions and file uploads into precise, execution-ready task packets with send-ready initiation emails.",
        "how_it_works": "Provide your dictation or notes along with relevant files (Excel, Word, PDF). KDN Task Writer produces a formatted initiation email with project defaults and folder links, plus per-workstream task packets with explicit inputs, numbered steps, acceptance checks, and deliverable naming conventions. Clarifying questions are only asked when truly needed.",
        "who_its_for": "FDD associates tasking overnight work and KDN overnight associates executing tasks.",
        "benefits": [
            "Every task packet includes clear inputs, steps, and acceptance criteria",
            "Send-ready emails with standardized folder conventions",
            "Explicit checks catch issues before they become rework",
            "Less time writing instructions, more time on analysis"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/kdn-tasks/dist/kdn_logo.png",
        "roadmap": False
    },
    "lingo": {
        "title": "Lingo",
        "subtitle": "Glossary slides, branded and formatted in seconds",
        "problem": "Deal teams frequently need glossary slides for proposals and client presentations. Building these manually—ensuring consistent formatting, KPMG branding, and proper pagination—is tedious. Terms and definitions change mid-project, and suddenly you're rebuilding slides from scratch.",
        "what_it_is": "A glossary generator that converts term/definition lists into polished, KPMG-branded PowerPoint decks.",
        "how_it_works": "Provide your terms and definitions in any structured format (Excel, CSV, or a bulleted list). Lingo applies KPMG-branded templates, handles pagination automatically to avoid text clipping, and produces a polished deck. Update your source list and regenerate instantly.",
        "who_its_for": "Deal teams needing branded glossary decks for proposals, reports, and client presentations.",
        "benefits": [
            "No more manual slide building",
            "KPMG colors, fonts, and formatting applied automatically",
            "Long definitions handled gracefully without clipping",
            "Regenerate in seconds when terms change"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/lingo/dist/lingo_logo.png",
        "roadmap": False
    },
    "metaprompt": {
        "title": "MetaPrompt",
        "subtitle": "Turn any task into an optimized prompt",
        "problem": "Getting consistent, high-quality outputs from AI tools requires well-crafted prompts—but most people aren't prompt engineers. Teams iterate on prompts that are too vague, too verbose, or missing key constraints, leading to inconsistent results and frustration.",
        "what_it_is": "A prompt optimization tool that transforms free-form task descriptions into concise, structured prompts ready for downstream AI models.",
        "how_it_works": "Describe what you want to accomplish. MetaPrompt analyzes your task, selects the appropriate template (Essential, Standard, or Research), and produces an optimized prompt with role definition, constraints, output format, and examples—all within strict word budgets. It never executes the task itself; it only delivers the prompt for you to use.",
        "who_its_for": "Anyone building prompts for AI tools, from prompt engineers to teams experimenting with ChatGPT.",
        "benefits": [
            "Best practices baked in automatically",
            "Three template levels for different task complexities",
            "Strict word budgets keep prompts lean and effective",
            "Spend less time tweaking, more time using"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/meta-prompt/Generated Image November 23, 2025 - 1_09PM.jpeg",
        "roadmap": False
    },
    "meeting-intelligence": {
        "title": "Meeting Intelligence",
        "subtitle": "From transcript to structured notes, nothing invented",
        "problem": "Meeting transcripts capture everything, but extracting the signal from the noise takes time. Associates review recordings, pull out key figures and decisions, then format notes for the team. Important details get lost, and note quality varies wildly.",
        "what_it_is": "A note-taking tool that converts meeting transcripts into comprehensive, template-structured notes—everything grounded in the source material, nothing invented.",
        "how_it_works": "Upload your transcript (any format). Meeting Intelligence classifies the meeting type (FDD or General Business) and applies the appropriate template. It extracts all material information—figures, policies, risks, decisions, follow-ups—and produces scan-friendly notes scaled to transcript length. Small talk and logistics are filtered out.",
        "who_its_for": "FDD teams, deal managers, and anyone needing thorough, searchable meeting records.",
        "benefits": [
            "No material detail left behind",
            "Consistent format across all meetings",
            "Zero invented numbers or unstated assumptions",
            "Note length scales with transcript complexity"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/meeting-intelligence/dist/meeting-intelligence-logo.png",
        "roadmap": False
    },
    "spa-assistant": {
        "title": "SPA Assistant",
        "subtitle": "SPA review with scored issues and counsel questions",
        "problem": "Reviewing Share Purchase Agreements is complex and high-stakes. Legal and deal teams must identify economically material terms and potential issues across hundreds of pages under tight deadlines. Missing a key definition or clause interaction can have significant financial consequences.",
        "what_it_is": "A legal review assistant that analyzes SPAs and produces structured issue registers with impact scoring, counsel questions, and tactical response options.",
        "how_it_works": "Upload your SPA and specify your perspective (buyer, seller, or neutral). SPA Assistant performs a definitions-led review, identifying economically material terms and cross-references. It produces an issue register grouped by category with Impact/Likelihood/Recoverability scoring. Each issue includes clause references, plain-English explanations, and suggested counsel language.",
        "who_its_for": "M&A lawyers, in-house counsel, and deal teams reviewing acquisition agreements.",
        "benefits": [
            "Systematic issue identification across the full agreement",
            "Scored priorities help focus on what matters most",
            "Plain English explanations alongside counsel-ready language",
            "Buyer, seller, or neutral analysis modes"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-spa.png",
        "roadmap": True
    },
    "data-book-analyst": {
        "title": "Data Book Analyst",
        "subtitle": "From raw data room exports to analysis-ready databooks",
        "problem": "FDD teams wrestle with messy data room exports—inconsistent formatting, missing headers, broken references. Converting this raw data into KPMG-standard databooks with proper analyses is tedious and pulls associates away from actual analysis work.",
        "what_it_is": "A databook builder that converts raw data room exports into normalized KPMG databooks with standard analyses and embedded questions.",
        "how_it_works": "Upload your data room files (Excel, CSV). In Plan Mode, Data Book Analyst produces a wireframe showing tab layout, source-to-target mapping, and execution checklist—no output until you approve. Say 'Proceed' to execute. It generates your databook with standard analyses (P&L trending, sales & margin cuts, payroll/headcount), inline validation checks, and flagged questions where issues exist.",
        "who_its_for": "FDD associates and seniors preparing databooks for analysis and presentation.",
        "benefits": [
            "Plan review before any execution",
            "P&L, sales, and payroll analysis modules included",
            "Questions and flags embedded where issues exist",
            "KPMG formatting standards applied automatically"
        ],
        "builder": "Rishi Sharma",
        "logo_path": "/Users/rishi/Code/chatgpt/ai-tools-showcase/workspace/icon-dba.png",
        "roadmap": True
    }
}

def escape_xml(text):
    """Escape special XML characters."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    text = text.replace("'", "&apos;")
    return text

def replace_text_in_xml(xml_content, old_text, new_text):
    """Replace text while preserving XML structure."""
    # Escape the new text for XML
    new_text_escaped = escape_xml(new_text)
    # The old text in XML might already be escaped
    old_text_escaped = escape_xml(old_text)

    # Try both escaped and unescaped versions
    xml_content = xml_content.replace(old_text, new_text_escaped)
    if old_text != old_text_escaped:
        xml_content = xml_content.replace(old_text_escaped, new_text_escaped)

    return xml_content

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

    # Replace title
    slide_xml = slide_xml.replace("Project Planner Agent", gpt_data["title"])

    # Replace subtitle
    slide_xml = slide_xml.replace('From SOW to "so organized" in seconds', gpt_data["subtitle"])
    slide_xml = slide_xml.replace("From SOW to &quot;so organized&quot; in seconds", gpt_data["subtitle"])

    # Replace problem text (this is the long paragraph in the problem box)
    old_problem = "At KPMG, we're constantly setting up new engagements and projects, and almost every one of them needs a project plan in Excel. Building those plans can be tedious, manual, and time-consuming. Searching for old templates, copy-pasting across files, double-checking that formatting and dates remain intact – all while the clock is ticking and your team is waiting to get started."
    slide_xml = replace_text_in_xml(slide_xml, old_problem, gpt_data["problem"])

    # Replace "What it is" text
    old_what = 'An AI-powered "Project Planner" that turns high-level engagement documents - like SoWs, kick-off notes, and overview slides - into detailed, structured project plans that you can instantly export to a clean, standardized Excel file.'
    slide_xml = replace_text_in_xml(slide_xml, old_what, gpt_data["what_it_is"])

    # Replace "How it works" text
    old_how = 'Upload your SoW (or similar document) that outlines scope, workstreams, and deliverables. Tell the Agent your project start and end dates, plus any timing constraints or milestones you already know. Project Planner will generate a detailed table that breaks the work into phases, tasks, and timelines. If you want to tweak the structure before finalizing, type "Use the canvas tool" so you can edit the output.  When everything looks right, type "Export to Excel" to get a polished project plan you can share with your team or client. Be sure to review and validate the plan before distribution – final ownership and accountability for the output remains with you.'
    slide_xml = replace_text_in_xml(slide_xml, old_how, gpt_data["how_it_works"])

    # Replace "Who it's for" text
    old_who = "Any KPMG professional responsible for creating or managing project plans."
    slide_xml = replace_text_in_xml(slide_xml, old_who, gpt_data["who_its_for"])

    # Replace benefits (4 bullet points)
    old_benefits = [
        "Time savings you can feel immediately – a task that once took 2-4 hours drops to 5-10 minutes.",
        "Higher quality project plans with less effort – automatically generate clean, consistent, client-ready plans every time.",
        "Accelerate your engagement kick-offs – project plans become available within minutes of signing off an SOW, allowing teams to start faster.",
        "Less administrative work - more time for analysis and strategy."
    ]

    for i, old_benefit in enumerate(old_benefits):
        if i < len(gpt_data["benefits"]):
            slide_xml = replace_text_in_xml(slide_xml, old_benefit, gpt_data["benefits"][i])

    # Replace builder name
    slide_xml = slide_xml.replace("Zack Mindel", gpt_data["builder"])

    # Write modified slide1.xml
    with open(slide1_path, 'w', encoding='utf-8') as f:
        f.write(slide_xml)

    # Copy logo to media folder if it exists
    if gpt_data.get("logo_path") and os.path.exists(gpt_data["logo_path"]):
        media_dir = os.path.join(work_dir, "ppt", "media")
        logo_ext = os.path.splitext(gpt_data["logo_path"])[1]
        logo_dest = os.path.join(media_dir, f"gpt_logo{logo_ext}")
        shutil.copy2(gpt_data["logo_path"], logo_dest)
        print(f"  Copied logo to {logo_dest}")

    # Remove slide2 (we only need one slide per GPT)
    slide2_path = os.path.join(work_dir, "ppt", "slides", "slide2.xml")
    slide2_rels_path = os.path.join(work_dir, "ppt", "slides", "_rels", "slide2.xml.rels")
    notes2_path = os.path.join(work_dir, "ppt", "notesSlides", "notesSlide2.xml")
    notes2_rels_path = os.path.join(work_dir, "ppt", "notesSlides", "_rels", "notesSlide2.xml.rels")

    # Update presentation.xml to remove slide2 reference
    pres_path = os.path.join(work_dir, "ppt", "presentation.xml")
    with open(pres_path, 'r', encoding='utf-8') as f:
        pres_xml = f.read()

    # Remove the second slide reference (rId3 typically)
    # Pattern: <p:sldId id="..." r:id="rId3"/>
    pres_xml = re.sub(r'<p:sldId[^>]*r:id="rId3"[^>]*/>', '', pres_xml)

    with open(pres_path, 'w', encoding='utf-8') as f:
        f.write(pres_xml)

    # Update [Content_Types].xml to remove slide2 reference
    content_types_path = os.path.join(work_dir, "[Content_Types].xml")
    with open(content_types_path, 'r', encoding='utf-8') as f:
        ct_xml = f.read()

    ct_xml = re.sub(r'<Override[^>]*PartName="/ppt/slides/slide2\.xml"[^>]*/>', '', ct_xml)
    ct_xml = re.sub(r'<Override[^>]*PartName="/ppt/notesSlides/notesSlide2\.xml"[^>]*/>', '', ct_xml)

    with open(content_types_path, 'w', encoding='utf-8') as f:
        f.write(ct_xml)

    # Update presentation.xml.rels to remove slide2 reference
    pres_rels_path = os.path.join(work_dir, "ppt", "_rels", "presentation.xml.rels")
    with open(pres_rels_path, 'r', encoding='utf-8') as f:
        pres_rels_xml = f.read()

    pres_rels_xml = re.sub(r'<Relationship[^>]*Target="slides/slide2\.xml"[^>]*/>', '', pres_rels_xml)

    with open(pres_rels_path, 'w', encoding='utf-8') as f:
        f.write(pres_rels_xml)

    # Delete the slide2 files
    for path in [slide2_path, slide2_rels_path, notes2_path, notes2_rels_path]:
        if os.path.exists(path):
            os.remove(path)

    # Create output filename
    output_filename = f"AI Client Delivery Slide - {gpt_data['title']}.pptx"
    output_path = os.path.join(OUTPUT_DIR, output_filename)

    # Repack into PPTX
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(work_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)

    print(f"  Created: {output_path}")
    return output_path

def main():
    # Create output directory if needed
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Process specific GPT if provided as argument
    if len(sys.argv) > 1:
        gpt_key = sys.argv[1]
        if gpt_key in GPTS:
            create_slide(gpt_key, GPTS[gpt_key])
        else:
            print(f"Unknown GPT: {gpt_key}")
            print(f"Available: {', '.join(GPTS.keys())}")
            sys.exit(1)
    else:
        # Process all GPTs
        for gpt_key, gpt_data in GPTS.items():
            create_slide(gpt_key, gpt_data)

    print("\nDone!")

if __name__ == "__main__":
    main()
