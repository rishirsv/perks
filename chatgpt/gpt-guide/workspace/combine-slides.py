#!/usr/bin/env python3
"""
Combine all GPT slides into a single presentation.
Creates proper XML relationships to avoid repair errors.
"""

import os
import shutil
import zipfile
import re
from xml.etree import ElementTree as ET

TEMPLATE_PATH = "/Users/rishi/Code/chatgpt/gpt-guide/AI Client Delivery Blueprint Slide - Project Planner GPT.pptx"
OUTPUT_DIR = "/Users/rishi/Code/chatgpt/gpt-guide/slides"
WORKSPACE = "/Users/rishi/Code/chatgpt/gpt-guide/workspace"
OUTPUT_FILE = "/Users/rishi/Code/chatgpt/gpt-guide/slides/AI Client Delivery Slides - All GPTs.pptx"

# Namespaces used in OOXML
NS = {
    'a': 'http://schemas.openxmlformats.org/drawingml/2006/main',
    'r': 'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
    'p': 'http://schemas.openxmlformats.org/presentationml/2006/main',
    'ct': 'http://schemas.openxmlformats.org/package/2006/content-types',
    'rel': 'http://schemas.openxmlformats.org/package/2006/relationships',
}

# Register namespaces to avoid ns0, ns1 prefixes
for prefix, uri in NS.items():
    ET.register_namespace(prefix, uri)
ET.register_namespace('', 'http://schemas.openxmlformats.org/package/2006/content-types')

# GPT slide content - same as before
GPTS = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    {
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
]

def escape_xml(text):
    """Escape special XML characters."""
    text = text.replace("&", "&amp;")
    text = text.replace("<", "&lt;")
    text = text.replace(">", "&gt;")
    text = text.replace('"', "&quot;")
    return text

def replace_slide_content(xml_content, gpt_data):
    """Replace template content with GPT-specific content."""
    xml = xml_content

    # Title
    xml = xml.replace(
        '<a:t>Project Planner Agent</a:t>',
        f'<a:t>{escape_xml(gpt_data["title"])}</a:t>'
    )

    # Subtitle (curly quotes)
    xml = xml.replace(
        '<a:t>From SOW to \u201cso organized\u201d in seconds</a:t>',
        f'<a:t>{escape_xml(gpt_data["subtitle"])}</a:t>'
    )

    # Problem
    old_problem = "At KPMG, we\u2019re constantly setting up new engagements and projects, and almost every one of them needs a project plan in Excel. Building those plans can be tedious, manual, and time-consuming. Searching for old templates, copy-pasting across files, double-checking that formatting and dates remain intact \u2013 all while the clock is ticking and your team is waiting to get started."
    xml = xml.replace(
        f'<a:t>{old_problem}</a:t>',
        f'<a:t>{escape_xml(gpt_data["problem"])}</a:t>'
    )

    # What it is
    old_what = "An AI-powered \u201cProject Planner\u201d that turns high-level engagement documents - like SoWs, kick-off notes, and overview slides - into detailed, structured project plans that you can instantly export to a clean, standardized Excel file."
    xml = xml.replace(
        f'<a:t>{old_what}</a:t>',
        f'<a:t>{escape_xml(gpt_data["what_it_is"])}</a:t>'
    )

    # How it works (main part)
    old_how_main = 'Upload your SoW (or similar document) that outlines scope, workstreams, and deliverables. Tell the Agent your project start and end dates, plus any timing constraints or milestones you already know. Project Planner will generate a detailed table that breaks the work into phases, tasks, and timelines. If you want to tweak the structure before finalizing, type '
    xml = xml.replace(
        f'<a:t>{old_how_main}</a:t>',
        f'<a:t>{escape_xml(gpt_data["how_it_works"])}</a:t>'
    )

    # Clear fragments
    xml = xml.replace('<a:t>\u201cUse the canvas tool\u201d </a:t>', '<a:t></a:t>')
    xml = xml.replace('<a:t>so you can edit the output.  When everything looks right, type \u201c</a:t>', '<a:t></a:t>')
    xml = xml.replace('<a:t>Export to Excel</a:t>', '<a:t></a:t>')
    old_how_end = "\u201d to get a polished project plan you can share with your team or client. Be sure to review and validate the plan before distribution \u2013 final ownership and accountability for the output remains with you. "
    xml = xml.replace(f'<a:t>{old_how_end}</a:t>', '<a:t></a:t>')

    # Who it's for
    xml = xml.replace(
        '<a:t>Any KPMG professional responsible for creating or managing project plans.</a:t>',
        f'<a:t>{escape_xml(gpt_data["who_its_for"])}</a:t>'
    )

    # Benefits
    old_benefits = [
        "Time savings you can feel immediately \u2013 a task that once took 2-4 hours drops to 5-10 minutes.",
        "Higher quality project plans with less effort \u2013 automatically generate clean, consistent, client-ready plans every time. ",
        "Accelerate your engagement kick-offs \u2013 project plans become available within minutes of signing off an SOW, allowing teams to start faster. ",
        "Less administrative work - more time for analysis and strategy."
    ]
    for i, old in enumerate(old_benefits):
        if i < len(gpt_data["benefits"]):
            xml = xml.replace(f'<a:t>{old}</a:t>', f'<a:t>{escape_xml(gpt_data["benefits"][i])}</a:t>')

    # Builder
    xml = xml.replace('<a:t>Zack Mindel </a:t>', f'<a:t>{escape_xml(gpt_data["builder"])} </a:t>')
    xml = xml.replace('send a recognition to Zack', f'send a recognition to {gpt_data["builder"].split()[0]}')

    return xml

def main():
    print("Creating combined presentation...")

    # Create working directory
    work_dir = os.path.join(WORKSPACE, "combined")
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)
    os.makedirs(work_dir)

    # Unpack template
    with zipfile.ZipFile(TEMPLATE_PATH, 'r') as zip_ref:
        zip_ref.extractall(work_dir)

    # Read template slide1.xml as the base
    slide1_path = os.path.join(work_dir, "ppt", "slides", "slide1.xml")
    with open(slide1_path, 'r', encoding='utf-8') as f:
        template_slide = f.read()

    # Read slide1 rels
    slide1_rels_path = os.path.join(work_dir, "ppt", "slides", "_rels", "slide1.xml.rels")
    with open(slide1_rels_path, 'r', encoding='utf-8') as f:
        template_rels = f.read()

    # Remove original slide2 (we'll create all new slides)
    for path in [
        os.path.join(work_dir, "ppt", "slides", "slide2.xml"),
        os.path.join(work_dir, "ppt", "slides", "_rels", "slide2.xml.rels"),
        os.path.join(work_dir, "ppt", "notesSlides", "notesSlide2.xml"),
        os.path.join(work_dir, "ppt", "notesSlides", "_rels", "notesSlide2.xml.rels"),
    ]:
        if os.path.exists(path):
            os.remove(path)

    # Create slides for each GPT
    # Slide 1 will be FDD Researcher (replace original slide1)
    # Slides 2-7 will be the other GPTs

    slide_ids = []

    for i, gpt in enumerate(GPTS):
        slide_num = i + 1
        print(f"  Creating slide {slide_num}: {gpt['title']}")

        # Generate unique slide ID (starting from 256 to avoid conflicts)
        slide_id = 256 + i
        slide_ids.append(slide_id)

        # Create slide content
        slide_content = replace_slide_content(template_slide, gpt)

        # Update creation ID in the slide (make it unique)
        slide_content = re.sub(
            r'id="\{[A-F0-9-]+\}"',
            f'id="{{SLIDE{slide_num:03d}-{slide_id:04d}-0000-0000-000000000000}}"',
            slide_content,
            count=1
        )

        # Write slide file
        slide_path = os.path.join(work_dir, "ppt", "slides", f"slide{slide_num}.xml")
        with open(slide_path, 'w', encoding='utf-8') as f:
            f.write(slide_content)

        # Create slide rels file (copy from template and adjust)
        rels_content = template_rels
        rels_path = os.path.join(work_dir, "ppt", "slides", "_rels", f"slide{slide_num}.xml.rels")
        with open(rels_path, 'w', encoding='utf-8') as f:
            f.write(rels_content)

    # First, read presentation.xml.rels to find highest rId
    pres_rels_path = os.path.join(work_dir, "ppt", "_rels", "presentation.xml.rels")
    with open(pres_rels_path, 'r', encoding='utf-8') as f:
        pres_rels_content = f.read()

    # Remove existing slide relationships from rels
    pres_rels_content = re.sub(r'<Relationship[^>]*Target="slides/slide\d+\.xml"[^>]*/>', '', pres_rels_content)

    # Find highest existing rId
    existing_ids = re.findall(r'Id="rId(\d+)"', pres_rels_content)
    max_id = max(int(x) for x in existing_ids) if existing_ids else 0

    # Create slide relationship IDs starting from max_id + 1
    slide_rids = [f"rId{max_id + i + 1}" for i in range(len(GPTS))]

    # Update presentation.xml with all slides
    pres_path = os.path.join(work_dir, "ppt", "presentation.xml")
    with open(pres_path, 'r', encoding='utf-8') as f:
        pres_content = f.read()

    # Remove existing slide ID list
    pres_content = re.sub(r'<p:sldIdLst>.*?</p:sldIdLst>', '', pres_content, flags=re.DOTALL)

    # Create new slide ID list with correct rIds
    slide_id_entries = []
    for i, slide_id in enumerate(slide_ids):
        slide_id_entries.append(f'<p:sldId id="{slide_id}" r:id="{slide_rids[i]}"/>')

    slide_id_list = f'<p:sldIdLst>{"".join(slide_id_entries)}</p:sldIdLst>'

    # Insert after sldMasterIdLst
    pres_content = re.sub(
        r'(</p:sldMasterIdLst>)',
        f'\\1{slide_id_list}',
        pres_content
    )

    with open(pres_path, 'w', encoding='utf-8') as f:
        f.write(pres_content)

    # Add new slide relationships to rels file
    new_rels = []
    for i in range(len(GPTS)):
        new_rels.append(f'<Relationship Id="{slide_rids[i]}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/slide" Target="slides/slide{i + 1}.xml"/>')

    # Insert before closing tag
    pres_rels_content = pres_rels_content.replace('</Relationships>', ''.join(new_rels) + '</Relationships>')

    with open(pres_rels_path, 'w', encoding='utf-8') as f:
        f.write(pres_rels_content)

    # Update [Content_Types].xml
    ct_path = os.path.join(work_dir, "[Content_Types].xml")
    with open(ct_path, 'r', encoding='utf-8') as f:
        ct_content = f.read()

    # Remove existing slide overrides
    ct_content = re.sub(r'<Override[^>]*PartName="/ppt/slides/slide\d+\.xml"[^>]*/>', '', ct_content)
    ct_content = re.sub(r'<Override[^>]*PartName="/ppt/notesSlides/notesSlide\d+\.xml"[^>]*/>', '', ct_content)

    # Add new slide overrides
    new_overrides = []
    for i in range(len(GPTS)):
        new_overrides.append(f'<Override PartName="/ppt/slides/slide{i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>')

    ct_content = ct_content.replace('</Types>', ''.join(new_overrides) + '</Types>')

    with open(ct_path, 'w', encoding='utf-8') as f:
        f.write(ct_content)

    # Remove notes slides (they can cause issues)
    notes_dir = os.path.join(work_dir, "ppt", "notesSlides")
    if os.path.exists(notes_dir):
        shutil.rmtree(notes_dir)

    # Update slide rels to remove notes references
    for i in range(len(GPTS)):
        rels_path = os.path.join(work_dir, "ppt", "slides", "_rels", f"slide{i + 1}.xml.rels")
        if os.path.exists(rels_path):
            with open(rels_path, 'r', encoding='utf-8') as f:
                rels = f.read()
            rels = re.sub(r'<Relationship[^>]*notesSlide[^>]*/>', '', rels)
            with open(rels_path, 'w', encoding='utf-8') as f:
                f.write(rels)

    # Pack the final presentation
    print(f"  Packing: {OUTPUT_FILE}")
    with zipfile.ZipFile(OUTPUT_FILE, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(work_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, work_dir)
                zipf.write(file_path, arcname)

    print(f"\nDone! Created: {OUTPUT_FILE}")
    print(f"Total slides: {len(GPTS)}")

if __name__ == "__main__":
    main()
