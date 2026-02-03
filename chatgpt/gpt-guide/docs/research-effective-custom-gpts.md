# Research: How to Create Effective Custom GPTs

## Research Questions

- What design principles make custom GPTs effective for specialized domains?
- How should knowledge files be structured and organized for optimal retrieval?
- What progressive disclosure patterns improve user experience and output quality?
- How do workflow gates and validation protocols ensure reliable outputs?
- What prompt engineering techniques enforce consistent behavior?
- How should output formats be specified for different use cases?
- What anti-patterns should be avoided when building custom GPTs?

## Summary

Analysis of 8 production custom GPTs (FDD Red Line, FDD Researcher, KDN Tasks, Lingo, Meeting Intelligence, MetaPrompt, TS Copywriter, TS Letters) reveals consistent architectural patterns that distinguish effective GPTs from basic implementations. The most successful GPTs combine **rigid workflow gates** with **flexible content**, use **progressive disclosure** to manage complexity, employ **template-driven outputs** for consistency, and enforce quality through **multi-point validation protocols**. Knowledge architecture favors fewer, larger consolidated files over many small ones, and the most sophisticated GPTs use **mode detection** to automatically route user requests without requiring manual selection.

---

## Key Principles

### 1. Progressive Disclosure

**Definition**: Reveal information and options incrementally based on context and user needs, rather than overwhelming users upfront.

**Patterns Observed**:

| GPT | Progressive Disclosure Pattern |
|-----|-------------------------------|
| **FDD Researcher** | Two-phase model: Document extraction (Phase 1) → Web research only after user says "go" (Phase 2) |
| **Lingo** | Auto-apply default scope → Show table → Let user request changes (no menus upfront) |
| **TS Letters** | Menu → Field collection → Confirmation → Validation → Visual preview → Delivery |
| **MetaPrompt** | Auto-route to Essential/Standard/Research template based on task complexity |
| **Meeting Intelligence** | BLUF (Key Takeaways) → Detailed Notes → Control Tables → Insights |
| **KDN Tasks** | Classify request type → Build task packets → Draft email → Validate |

**Best Practices**:
- **Don't ask what you can infer**: Lingo applies default scope automatically rather than presenting options
- **Gate expensive operations**: FDD Researcher blocks web browsing until explicit "go" signal
- **Layer information density**: Meeting Intelligence puts executive summary first, evidence second, reference tables third
- **Use semantic triggers**: KDN Tasks detects "draft" keyword to switch modes without asking

---

### 2. Template-Driven Architecture

**Definition**: Use pre-defined structural templates for outputs while allowing content flexibility within sections.

**Patterns Observed**:

| GPT | Template Strategy |
|-----|------------------|
| **MetaPrompt** | 3 templates (Essential 80-150 words, Standard 120-220 words, Research 180-350 words) with automatic routing |
| **Meeting Intelligence** | FDD Template vs General Business Template, each with modular section blocks |
| **TS Letters** | DOCX templates with `{{placeholder}}` replacement only—no legal text modification |
| **Lingo** | Clone & Replace: all styling baked into PPTX template, only cell content changes |
| **KDN Tasks** | Standard Email vs Initiation Email templates with consistent formatting |

**Best Practices**:
- **Separate structure from content**: Templates define headings/sections; GPT fills content
- **Bake brand standards into templates**: Fonts, colors, spacing pre-set (Lingo KPMG template)
- **Use templates as guardrails**: TS Letters prevents legal text modification by design
- **Route automatically**: MetaPrompt detects task complexity and selects template without asking

---

### 3. Knowledge Architecture

**Definition**: How knowledge files are structured, sized, and organized for retrieval.

**Key Finding**: Consolidated, well-structured files outperform many small files.

**Patterns Observed**:

| GPT | Knowledge Strategy |
|-----|-------------------|
| **FDD Researcher** | Single ~200KB `industry-modules-complete.md` with 10 modules (clear headers enable semantic search) |
| **FDD Red Line** | Single `rules.yaml` configuration driving all pattern matching |
| **TS Copywriter** | 302-line KnowledgeBase.txt with tagged samples (QoE_RR, NWC_GeneralIntro, etc.) |
| **KDN Tasks** | 10 real email threads + comprehensive task catalogue as reference |
| **Meeting Intelligence** | 4-6 focused files <3-4k tokens each (thin brainstem approach) |

**File Types and Purposes**:

1. **System Prompt** (~8k chars max): Core behaviors, non-negotiables, workflow skeleton
2. **Template Files**: Output structure definitions with section guidance
3. **Reference/Schema Files**: Variable definitions, pattern libraries, terminology
4. **Sample Collections**: Real examples showing good/bad patterns

**Best Practices**:
- **Consolidate over fragment**: FDD Researcher's single industry file vs 10 separate files
- **Use clear section headers**: Enables semantic search within large files
- **Include metadata**: KnowledgeBase entries tagged with keywords for retrieval
- **Separate concerns**: Schema (what fields) vs Logic (how to fill) vs Templates (output structure)

---

### 4. Validation Gates & Quality Protocols

**Definition**: Checkpoints that verify completeness and correctness before proceeding.

**Patterns Observed**:

| GPT | Validation Approach |
|-----|---------------------|
| **TS Letters** | All-or-nothing: blocks generation until ALL required fields have values |
| **TS Copywriter** | 8-point validation protocol before output (anchored claims, no passive voice, etc.) |
| **Meeting Intelligence** | Flight Check: 5-question self-review before final output |
| **FDD Red Line** | Remove duplicates → Verify page numbers → Mark invalid → Re-number → Sort → Warn on over-flagging |
| **MetaPrompt** | Internal 7-step analysis workflow (understand → select → extract → decide → build → compress → output) |

**TS Copywriter's 8-Point Protocol**:
1. Every claim anchored to number/source
2. No passive voice without clear subject
3. No assurance/opinion language
4. Consistent standard term usage
5. No Must_Avoid words
6. All Word_Substitutions applied
7. No qualitative judgments
8. Paragraph structure compliance

**Meeting Intelligence Flight Check**:
- Have I captured ~95% of important numbers?
- Can each bullet be justified by transcript statement?
- Any adjectives outside quotes/Insights? Remove.
- Does each follow-up have owner or "Owner not specified"?
- Did I capture questions that were dodged/unanswered?

**Best Practices**:
- **Make gates non-negotiable**: TS Letters won't generate without all fields
- **Create explicit checklists**: TS Copywriter's 8 points, Meeting Intelligence's 5 questions
- **Validate at multiple stages**: Before output, after output, before delivery

---

### 5. Mode Detection & Routing

**Definition**: Automatically detect user intent and route to appropriate behavior without manual selection.

**Patterns Observed**:

| GPT | Mode Detection |
|-----|----------------|
| **TS Copywriter** | Keyword "draft" (case-insensitive) triggers Draft Mode vs default Rewrite Mode |
| **MetaPrompt** | Artifact type + complexity → Essential/Standard/Research template |
| **KDN Tasks** | Request type detection: Initiation vs Nightly vs Restructure vs Polish vs Document Analysis |
| **Meeting Intelligence** | Trigger words (due diligence, QoE, CFO) → FDD Template; (internal sync, planning) → General Business |
| **Lingo** | Document Analysis mode triggers: "review and suggest", "what can KDN do with this" |

**Routing Decision Trees**:

**MetaPrompt Template Selection**:
```
IF single deliverable (JSON, CSV, short answer) → Essential
ELIF multi-section document → Standard
ELIF external research + citations needed → Research
```

**Meeting Intelligence Type Selection**:
```
IF contains (due diligence, QoE, CFO, EBITDA, deal topics) → FDD Template
ELIF contains (internal sync, planning, project, team) → General Business
ELSE → Ask user to pick
```

**Best Practices**:
- **Detect, don't ask**: Infer mode from content when possible
- **Use explicit triggers**: Keywords or phrases that reliably indicate intent
- **Provide fallback**: If ambiguous, ask user to choose (but only then)

---

### 6. Anti-Patterns & Guardrails

**Definition**: Explicit prohibitions and substitutions that prevent common failure modes.

**TS Copywriter MUST_AVOID Categories**:

| Category | Banned Words | Replacement |
|----------|--------------|-------------|
| Assurance Terms | ensure, accurate, fair, reasonable | results in, creates |
| Vague Magnitude | significant, substantial, material | [exact $$ or %] |
| Purpose Statements | in order to, designed to | [direct statement] |
| Process Descriptions | we analyzed, we reviewed | the data shows |
| Opinion Language | we believe, appears to be | the data indicates |

**KDN Tasks Anti-Patterns**:
- Vague file references ("the databook" without name)
- Fabricated file names or thresholds
- Invented substeps not requested
- Multiple sentences per substep
- Boilerplate closers ("Please let me know if questions")
- Internal reasoning ("Based on my analysis...")

**Meeting Intelligence Prohibitions**:
- Dialogue reconstruction ("When asked X, response was Y")
- Transitional statements ("moving on to...")
- Speaker attribution in notes (state facts directly)
- Inventing company-specific facts (only general industry context in Insights)

**FDD Researcher Non-Negotiables**:
- NO web browsing until user says "go"
- NEVER invent company-specific facts (use "Unknown")
- SEPARATE [DOC] and [WEB] sources—never mix in same bullet

**Best Practices**:
- **Create explicit ban lists**: Categories of words/phrases to never use
- **Provide substitutions**: Tell GPT what TO say, not just what NOT to say
- **Use negative examples**: Show BAD pattern alongside GOOD pattern
- **Make constraints non-negotiable**: Call them "Critical Rules" or "Non-Negotiables"

---

### 7. Output Specification Patterns

**Definition**: How to precisely define expected output format and structure.

**Common Elements**:

1. **Section Structure**: Explicit headings with guidance
   ```
   ## <Topic Name>
   ### Key Takeaways (2-4 bullets, omit if none)
   ### Meeting Notes (Detailed bullets)
   ### Insights (Industry context, omit if none)
   ```

2. **Table Schemas**: Column definitions with examples
   ```
   | ID | Page | Category | Priority | Comment |
   |----|------|----------|----------|---------|
   | 001 | 3 | Placeholders | H | "[TBD]" found in header |
   ```

3. **Formatting Rules**: Exact patterns for data types
   - Currency: `$XM` or `$Xk` (e.g., "$2.1M")
   - Dates: ISO 8601 (`YYYY-MM-DD`)
   - File names: italics (`*filename.xlsx*`)
   - Tab names: single quotes (`'IS|Combined'`)
   - Cell references: backticks (`` `Combined BS!C28` ``)

4. **Length Constraints**: Word/page budgets
   - MetaPrompt Essential: 80-150 words
   - MetaPrompt Standard: 120-220 words (hard cap at 220)
   - Meeting Intelligence: `<4k words → 2-3 pages; 4-12k → 3-6 pages; >12k → 6-10 pages`

5. **Sorting & Tie-Breakers**: How to order lists
   - FDD Red Line: Sort by page ascending, then priority (H → M → L)
   - Specify what to do if fewer than N items exist

**Best Practices**:
- **Centralize format rules**: One Output Format block, not scattered constraints
- **Show examples**: Concrete samples > abstract descriptions
- **Specify edge cases**: Empty states, tie-breakers, overflow handling
- **Define minimum quality**: "Every bullet must be a complete sentence"

---

### 8. Hybrid Determinism Pattern

**Definition**: Combine deterministic code (Python, regex) for mechanical tasks with GPT for interpretation.

**FDD Red Line Architecture**:
```
Python-Owned (Deterministic)          GPT-Owned (Interpretive)
─────────────────────────────         ────────────────────────
• Placeholder pattern matching        • Visual alignment review
• Grammar checks (repeated words)     • Layout judgment (cramped/overlaps)
• Cross-reference validation          • Text-to-table consistency
• Terminology consistency             • Tone, readability assessment
• Metric extraction + comparison      • Logical contradiction detection
```

**Benefits**:
- Deterministic checks are fast, cheap, and consistent
- GPT handles nuance, visual judgment, and interpretation
- Expensive operations (PNG rendering) reserved for flagged pages only

**Best Practices**:
- **Python for patterns**: Regex, string matching, validation
- **GPT for judgment**: Interpretation, visual review, ambiguity resolution
- **Smart selection**: Use heuristics to decide what needs GPT review
- **Budget expensive ops**: FDD Red Line caps PNG rendering at 50% of pages

---

### 9. Source Attribution & Traceability

**Definition**: Clear separation and citation of information sources.

**FDD Researcher Source Separation**:
- `[DOC]` + anchor (filename/page) for document-grounded facts
- `[WEB]` + numeric citation for web-derived claims
- **Never mix** [DOC] and [WEB] in same bullet

**Meeting Intelligence Attribution**:
- Transcript facts: stated directly, no attribution needed
- Insights: prefixed with `**Insights:**` and clearly marked as general industry context
- Verbatim quotes: preserved exactly for critical statements

**FDD Red Line Dual ID System**:
- `row_id`: Sequential (001, 002...) for human readability
- `stable_id`: Hash-based for traceability across regenerations

**Best Practices**:
- **Separate observation from interpretation**: Use distinct markers
- **Preserve verbatim when critical**: Exact quotes for policies, numbers, "one-time" claims
- **Create evidence trails**: Each claim traceable to source document + location
- **Mark uncertainty**: Use `[?]` or explicit "Unknown" rather than guessing

---

### 10. User Experience Patterns

**Definition**: Interaction design choices that improve usability.

**"Lemonade Stand" UX (TS Letters)**:
- Simple numbered menu instead of open-ended conversation
- User selects by number or name
- Reduces confusion, ensures consistent workflow

**Auto-Start (Lingo)**:
- Automatically process uploaded documents without asking permission
- Apply default scope without menus
- Show result, let user request changes

**Demo Mode (TS Letters)**:
- Type "demo" to auto-generate realistic fake data
- Allows testing without real deal information
- Useful for training and development

**Confirmation Gates (Multiple GPTs)**:
- Display collected values before generation
- Ask "Is this correct?" before committing
- Allow edits before final output

**Visual Verification (TS Letters, Lingo)**:
- Render PDF/PNG preview before download
- User visually confirms formatting
- Catches rendering issues early

**Best Practices**:
- **Reduce friction**: Auto-start, default-first, no unnecessary questions
- **Provide escape hatches**: Demo mode, edit before confirm, visual preview
- **Use structured choices**: Numbered menus > open-ended prompts for known options
- **Show before commit**: Preview output, confirm values, then generate

---

## Recommendations

### For System Prompt Design

1. **Keep it thin** (~8k chars): Core behaviors, non-negotiables, workflow skeleton only
2. **Push details to knowledge files**: Templates, samples, schemas in separate files
3. **Declare non-negotiables explicitly**: "CRITICAL", "NON-NEGOTIABLE", "NEVER"
4. **Include anti-patterns**: Show what NOT to do alongside what TO do
5. **Define mode routing logic**: Decision tree for automatic behavior selection

### For Knowledge Architecture

1. **Consolidate files**: Fewer large files > many small fragments
2. **Use clear section headers**: Enables semantic search within documents
3. **Tag samples with metadata**: Keywords, categories for retrieval
4. **Separate schema from logic**: Variable definitions vs processing rules
5. **Include real examples**: Actual good/bad outputs from production use

### For Output Quality

1. **Create validation protocols**: Multi-point checklists before output
2. **Specify format precisely**: Tables, headings, formatting conventions
3. **Define minimum quality bars**: "Every bullet must be complete sentence"
4. **Add sorting and edge case rules**: Tie-breakers, empty state handling
5. **Use visual verification**: Preview outputs before delivery

### For User Experience

1. **Detect intent, don't ask**: Use keywords/patterns to infer mode
2. **Apply defaults first**: Show result, let user modify (not menu upfront)
3. **Gate expensive operations**: Require explicit trigger for costly actions
4. **Provide confirmation points**: Show values before committing
5. **Support testing modes**: Demo data, preview, dry-run options

---

## GPT Complexity Spectrum

| Complexity | Example GPTs | Characteristics |
|------------|--------------|-----------------|
| **Simple** | TS Letters | Single workflow, placeholder replacement, strict validation |
| **Moderate** | Lingo, KDN Tasks | Template-driven, mode detection, domain-specific rules |
| **Complex** | MetaPrompt, TS Copywriter | Multiple templates, sophisticated routing, extensive anti-patterns |
| **Hybrid** | FDD Red Line, FDD Researcher | Python + GPT, multi-phase workflows, external tools |
| **Expert** | Meeting Intelligence | Zero-inference policy, flight-check validation, layered disclosure |

---

## Sources

- FDD Red Line implementation: `/Users/rishi/Code/chatgpt/fdd-redline/`
- FDD Researcher implementation: `/Users/rishi/Code/chatgpt/fdd-researcher/`
- KDN Tasks implementation: `/Users/rishi/Code/chatgpt/kdn-tasks/`
- Lingo implementation: `/Users/rishi/Code/chatgpt/lingo/`
- Meeting Intelligence implementation: `/Users/rishi/Code/chatgpt/meeting-intelligence/`
- MetaPrompt implementation: `/Users/rishi/Code/chatgpt/meta-prompt/`
- TS Copywriter implementation: `/Users/rishi/Code/chatgpt/ts-copywriter/`
- TS Letters implementation: `/Users/rishi/Code/chatgpt/ts-letters/`

---

## Appendix: GPT-by-GPT Summary

### FDD Red Line
- **Purpose**: Red-pen review of FDD report decks
- **Key Innovation**: Hybrid Python + GPT with smart page selection
- **Notable Pattern**: YAML-driven configuration, dual ID system, 50% page budget cap

### FDD Researcher
- **Purpose**: FDD kickoff briefs from sparse documents
- **Key Innovation**: Two-phase "go" gate, [DOC]/[WEB] source separation
- **Notable Pattern**: 10 industry modules, 8k word briefs, value driver trees

### KDN Tasks
- **Purpose**: Offshore tasking email generation
- **Key Innovation**: LOW verbosity principle, asynchronous-first design
- **Notable Pattern**: 8 reusable task patterns, 4-phase workflow

### Lingo
- **Purpose**: Document → glossary slides
- **Key Innovation**: Auto-start, no menus, Clone & Replace template strategy
- **Notable Pattern**: Height-based pagination (v3), 20-35 terms/slide adaptive

### Meeting Intelligence
- **Purpose**: Transcripts → structured notes
- **Key Innovation**: Zero-inference policy, flight-check validation
- **Notable Pattern**: BLUF layered disclosure, [Insights] separation

### MetaPrompt
- **Purpose**: Task → optimized prompt
- **Key Innovation**: 3-template routing with word budgets
- **Notable Pattern**: Instruction-only stance, constraint centralization

### TS Copywriter
- **Purpose**: FDD content rewriting/drafting
- **Key Innovation**: MUST_AVOID lists, word substitutions
- **Notable Pattern**: 8-point validation protocol, 3 writing modes

### TS Letters
- **Purpose**: Legal letter generation
- **Key Innovation**: Placeholder-only modification, validation gates
- **Notable Pattern**: Lemonade stand UX, visual verification, demo mode
