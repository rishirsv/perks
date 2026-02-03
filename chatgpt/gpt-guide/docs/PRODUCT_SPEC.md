# Presentation Builder: Product Spec & Implementation Plan

## Executive Summary

A presentation builder that combines structured slide layouts with AI-assisted content creation, designed for technical masterclasses and executive training materials. The system captures the full workflow from ideation through polished deliverable, with an emphasis on maintaining information density and professional tone.

---

## Part 1: Product Spec

### 1.1 Problem Statement

Creating high-quality technical presentations requires:
- **Structure**: Consistent layouts that support information-dense content
- **Writing**: Professional tone calibrated to audience expertise
- **Iteration**: Multiple revision passes with external review
- **Design**: Visual identity that meets enterprise standards

Current tools (PowerPoint, Google Slides, Keynote) handle layout but provide no assistance with content quality, tone calibration, or structured writing workflows.

### 1.2 Target Users

**Primary**: Knowledge workers creating training materials, masterclasses, or technical guides for professional audiences (consultants, engineers, analysts).

**User Profile**:
- Comfortable with markdown
- Has domain expertise but may struggle with structure/pacing
- Needs to produce materials that meet enterprise quality standards
- Values information density over flashy animations

### 1.3 Core Workflows

#### Workflow 1: Outline Creation
```
User provides: Topic + audience + key points
System produces: Structured outline with suggested slide types
User refines: Reorder, add/remove sections, adjust depth
```

#### Workflow 2: Content Enrichment
```
User provides: Bullet-point outline per slide
Agent produces: Expanded content with:
  - Intro paragraphs (slide-intro style)
  - Expanded bullets where needed
  - Code examples with annotations
  - Callouts and tips
User refines: Edit, accept/reject suggestions
```

#### Workflow 3: External Review (Oracle Pattern)
```
System bundles: Content + review prompt + context
User sends to: External AI (ChatGPT Pro, Claude, etc.)
External returns: Revised content with [REVISED] markers
System integrates: Diff view, selective accept/reject
```

#### Workflow 4: Design Iteration
```
User previews: Live browser preview
System captures: Screenshots at multiple breakpoints
User/Agent reviews: Identify spacing, typography, hierarchy issues
System applies: CSS refinements
Loop until: Quality threshold met
```

---

## Part 2: Content Architecture

### 2.1 Slide Types

| Type | Purpose | Layout | Example |
|------|---------|--------|---------|
| `title` | Opening slide | Centered, badge + title + subtitle + author | Page 1 |
| `section` | Section divider | Large heading, topic pills | Page 10 |
| `standard` | Main content | H2 + intro + body content | Most pages |
| `full-example` | Code walkthrough | Two-column with annotations | Page 8 |
| `comparison` | Side-by-side | VS layout with headers | Page 3 |
| `checklist` | Summary/recap | Multi-column checklist + takeaways | Page 18 |
| `antipatterns` | Gallery grid | 3x3 card grid | Page 16 |

### 2.2 Content Components

#### Intro Paragraph (`.slide-intro`)
- 2-3 sentences maximum
- Authoritative tone, no hedging
- Defines technical terms inline on first use
- Sets context for why this topic matters

**Pattern**: `[Core claim]. [Supporting detail or implication]. [What this enables/prevents].`

**Example**:
```
Production GPTs fail less from "bad writing" and more from unclear scope.
Role boundaries define what the GPT does and doesn't do; guardrails are
targeted constraints that eliminate specific recurring misbehaviors after
you observe them in testing.
```

#### Card Grid (`.card-grid`)
- 2-4 cards per row
- Each card: icon + title + stat badge + bullet list + tag
- Color-coded by category (primary, accent, green, red)

#### Code Block (`.code-block`)
- Header with label + copy button
- Syntax highlighting for common languages
- Annotations using `hl-comment`, `hl-highlight`, `hl-warning` classes

#### Callout (`.callout`)
- Types: tip, warning, example, principle
- Icon + bold label + content
- Single callout per slide maximum

#### Comparison Layout (`.comparison-grid`)
- Two columns with VS divider
- Colored headers
- Blockquote for key differentiator
- Bullet lists for details
- "Best for" summary at bottom

#### Pattern Cards (`.pattern-card`)
- Header with title + subtitle
- Body with description + code example
- "Use when" footer

#### Anti-Pattern Cards (`.antipattern-card`)
- Problem title
- Description
- "Bad" example
- "Fix" with explanation

### 2.3 Visual Hierarchy

```
H1: Title slides, section dividers (Instrument Serif, 3-4rem)
H2: Page titles (Instrument Serif, 2-2.5rem)
H3: Card/section headers (Inter, 1.25-1.5rem, semi-bold)
H4: Subheaders within content (Inter, 1rem, semi-bold)

Body: Inter, 1rem, regular
Code: Berkeley Mono, 0.875rem
Intro: Instrument Serif, 1.1rem (lighter weight)
```

---

## Part 3: Writing Style System

### 3.1 Audience Calibration

The system must understand WHO the audience is to calibrate explanations:

```yaml
audience_profile:
  domain_expertise: "finance, M&A, due diligence"
  technical_level: "beginner to AI/GPT concepts"

explain_these_terms:
  - context window
  - tokens
  - system prompt
  - guardrails
  - progressive disclosure
  - deterministic

do_not_explain:
  - FDD, QoE, EBITDA
  - working capital
  - due diligence
  - redlines, databooks
```

### 3.2 Tone Guidelines

**Target**: McKinsey training document meets Stripe technical documentation

**Do**:
- Use active voice
- State claims directly
- Define terms inline on first use
- Trust reader's domain expertise

**Don't**:
- "Let's explore..." / "You might be wondering..."
- "Simply put..." / "In other words..."
- Excessive signposting
- Hedging and qualifiers
- Explaining concepts the audience knows

### 3.3 Inline Definition Pattern

When introducing a technical term, define it parenthetically:

```
the **context window** (the model's working memory, roughly 200K tokens)
```

```
add **guardrails** (hard rules to prevent recurring failure modes)
```

One definition per term, on first use. Don't repeat.

### 3.4 Intro Paragraph Rules

1. Maximum 2-3 sentences
2. First sentence: core claim or framing
3. No "In this section..." meta-commentary
4. Technical terms defined inline
5. End with implication or action orientation

### 3.5 Bullet Expansion Rules

Expand bullets when:
- Meaning is ambiguous without context
- A beginner to the technical domain would misunderstand
- References a concept not yet introduced

Keep bullets brief when:
- Audience has domain expertise for this point
- Intentionally scannable/reference format
- Inside code blocks or templates

---

## Part 4: Agent Integration

### 4.1 Oracle Pattern (External Review)

The Oracle pattern bundles content with a specialized review prompt for external AI review.

#### Bundle Structure
```
.agents/oracle/{task-name}/
├── prompt.md      # Review instructions
├── content.md     # Content to review
└── context.zip    # Bundled for upload
```

#### Prompt Template (Writing Review)
```markdown
# Expert Technical Writer Review Request

## Your Role
You are an expert technical writer who specializes in executive
education materials for professional services firms.

## Audience Profile
**Primary audience:** [Role] professionals ([Levels])

**What they already know:**
- [Domain expertise items]

**What they're learning:**
- [New concepts being introduced]

## Document Context
This is a [format] used in [context]. The format is:
- [Structural constraints]
- [Design considerations]

## Your Task
Review the attached content and improve with these goals:
1. Explain [new domain] concepts clearly
2. Do NOT explain [known domain] concepts
3. [Specific improvements needed]

## Output Format
- Same structure as original
- Mark changes with [REVISED]
- Stay within ~10% of original length

## Quality Checklist
- [ ] [Verification item 1]
- [ ] [Verification item 2]
```

#### Integration Flow
1. User triggers review: `/oracle writing-review`
2. System generates bundle from current content
3. User uploads to external AI
4. User pastes response back
5. System shows diff, user accepts/rejects changes

### 4.2 Content Enrichment Agent

Expands outline bullets into full slide content.

#### Input
```yaml
slide:
  type: standard
  title: "Role Boundaries & Guardrails"
  bullets:
    - Role boundaries define scope
    - Guardrails correct misbehaviors
    - Show wrong/right examples
```

#### Agent Behavior
1. Generate intro paragraph (2-3 sentences, authoritative)
2. Expand bullets where needed (per expansion rules)
3. Suggest appropriate callout if relevant
4. Identify technical terms needing inline definitions
5. Flag any bullets that seem incomplete

#### Output
```yaml
slide:
  type: standard
  title: "Role Boundaries & Guardrails"
  intro: "Production GPTs fail less from \"bad writing\" and more from unclear scope..."
  content:
    - type: split-panel
      left:
        header: "Role Boundaries"
        items: [...]
      right:
        header: "Guardrails Pattern"
        items: [...]
  callout:
    type: warning
    content: "..."
```

### 4.3 Design Review Agent

Reviews rendered output for visual issues.

#### Input
- Screenshot of rendered slide
- Current CSS
- Design system rules

#### Checks
- Spacing consistency (margins, padding)
- Typography hierarchy
- Visual balance
- Responsive behavior
- Color contrast

#### Output
- List of issues with severity
- Suggested CSS fixes
- Before/after comparison

---

## Part 5: Design System

### 5.1 Color Palette (KPMG-inspired)

```css
:root {
  /* Primary */
  --kpmg-blue: #00338D;
  --kpmg-medium-blue: #005EB8;
  --kpmg-light-blue: #0091DA;

  /* Accent */
  --kpmg-violet: #483698;
  --kpmg-purple: #470A68;
  --kpmg-green: #00A3A1;

  /* Semantic */
  --color-orange: #E87722;
  --color-red: #C8102E;

  /* Neutral */
  --bg-dark: #0a0a0f;
  --bg-card: #12121a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0b0;
}
```

### 5.2 Typography

```css
/* Display (titles, intros) */
font-family: 'Instrument Serif', serif;

/* Body (bullets, descriptions) */
font-family: 'Inter', sans-serif;

/* Code (examples, templates) */
font-family: 'Berkeley Mono', monospace;
```

### 5.3 Spacing Scale

```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
--space-3xl: 4rem;     /* 64px */
```

### 5.4 Component Tokens

```css
/* Cards */
--card-radius: 12px;
--card-padding: 1.5rem;
--card-shadow: 0 4px 20px rgba(0,0,0,0.3);

/* Code blocks */
--code-bg: #1a1a2e;
--code-radius: 8px;
--code-padding: 1rem 1.25rem;

/* Callouts */
--callout-radius: 8px;
--callout-padding: 1rem 1.25rem;
--callout-border-width: 3px;
```

---

## Part 6: Technical Architecture

### 6.1 Data Model

```typescript
interface Presentation {
  id: string;
  title: string;
  author: string;
  audience: AudienceProfile;
  slides: Slide[];
  designSystem: DesignSystem;
  createdAt: Date;
  updatedAt: Date;
}

interface Slide {
  id: string;
  type: SlideType;
  title: string;
  intro?: string;
  content: ContentBlock[];
  notes?: string; // Speaker notes
}

type SlideType =
  | 'title'
  | 'section'
  | 'standard'
  | 'comparison'
  | 'full-example'
  | 'checklist'
  | 'antipatterns';

interface ContentBlock {
  type: 'card-grid' | 'code-block' | 'callout' | 'comparison'
      | 'pattern-grid' | 'bullet-list' | 'split-panel';
  data: Record<string, any>;
}

interface AudienceProfile {
  domainExpertise: string[];
  technicalLevel: 'beginner' | 'intermediate' | 'advanced';
  explainTerms: string[];
  doNotExplain: string[];
}
```

### 6.2 Rendering Pipeline

```
Content (YAML/JSON)
    ↓
Template Engine (select slide type template)
    ↓
Component Renderer (render content blocks)
    ↓
HTML Output
    ↓
CSS Design System
    ↓
Live Preview
```

### 6.3 Agent Integration Points

```
┌─────────────────────────────────────────────────────────┐
│                    Presentation Builder                  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│  │ Outline  │───▶│ Enrich   │───▶│ Review   │          │
│  │ Agent    │    │ Agent    │    │ (Oracle) │          │
│  └──────────┘    └──────────┘    └──────────┘          │
│       │               │               │                 │
│       ▼               ▼               ▼                 │
│  ┌──────────────────────────────────────────┐          │
│  │           Content Store (slides.json)     │          │
│  └──────────────────────────────────────────┘          │
│                       │                                 │
│                       ▼                                 │
│  ┌──────────────────────────────────────────┐          │
│  │              Render Engine                │          │
│  │  (HTML templates + CSS design system)     │          │
│  └──────────────────────────────────────────┘          │
│                       │                                 │
│                       ▼                                 │
│  ┌──────────────────────────────────────────┐          │
│  │              Live Preview                 │          │
│  │     (Browser + Design Review Agent)       │          │
│  └──────────────────────────────────────────┘          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Part 7: Implementation Plan

### Phase 1: Content Format & Templates (Week 1)

**Goal**: Define content schema and create slide type templates

**Tasks**:
1. Define YAML/JSON schema for presentations
2. Create HTML templates for each slide type:
   - [ ] title
   - [ ] section
   - [ ] standard
   - [ ] comparison
   - [ ] full-example
   - [ ] checklist
   - [ ] antipatterns
3. Create component templates:
   - [ ] card-grid
   - [ ] code-block
   - [ ] callout
   - [ ] pattern-card
   - [ ] split-panel
4. Port existing CSS design system
5. Build simple template engine (content → HTML)

**Deliverable**: Can render a presentation from JSON/YAML

### Phase 2: Editor & Preview (Week 2)

**Goal**: Basic editing interface with live preview

**Tasks**:
1. Create split-pane editor (content | preview)
2. YAML/markdown editor with syntax highlighting
3. Live reload on content changes
4. Slide navigation in preview
5. Responsive preview (desktop/tablet/mobile toggles)
6. Export to static HTML

**Deliverable**: Can create and edit presentations visually

### Phase 3: Outline Agent (Week 3)

**Goal**: AI-assisted outline creation

**Tasks**:
1. Define outline agent prompt template
2. Input: topic + audience + key points
3. Output: structured outline with slide types
4. Integration with Claude API
5. Outline editing UI (drag/drop reorder)
6. Convert outline to presentation skeleton

**Deliverable**: Can generate presentation outline from description

### Phase 4: Content Enrichment Agent (Week 4)

**Goal**: AI-assisted content expansion

**Tasks**:
1. Define enrichment agent prompt
2. Audience profile integration
3. Intro paragraph generation
4. Bullet expansion with inline definitions
5. Code example annotation
6. Callout suggestions
7. Diff view for accepting/rejecting changes

**Deliverable**: Can expand outline bullets to full content

### Phase 5: Oracle Integration (Week 5)

**Goal**: External AI review workflow

**Tasks**:
1. Bundle generator (prompt + content → zip)
2. Prompt template library (writing review, technical review, etc.)
3. Response parser (extract [REVISED] sections)
4. Diff integration UI
5. Selective accept/reject
6. Version history

**Deliverable**: Can send content for external review and integrate feedback

### Phase 6: Design Review (Week 6)

**Goal**: Automated visual QA

**Tasks**:
1. Screenshot capture at multiple breakpoints
2. Design review agent prompt
3. Issue detection (spacing, typography, hierarchy)
4. CSS fix suggestions
5. Before/after comparison
6. Design system validation

**Deliverable**: Automated visual quality checks

### Phase 7: Polish & Launch (Week 7-8)

**Goal**: Production-ready application

**Tasks**:
1. Presentation management (create, list, delete)
2. Template library (pre-built slide sequences)
3. Export formats (HTML, PDF)
4. Keyboard shortcuts
5. Documentation
6. Testing & bug fixes

**Deliverable**: Shippable v1.0

---

## Part 8: File Structure

```
presentation-builder/
├── app/
│   ├── components/
│   │   ├── editor/
│   │   │   ├── ContentEditor.tsx
│   │   │   ├── OutlinePanel.tsx
│   │   │   └── PreviewPane.tsx
│   │   ├── slides/
│   │   │   ├── TitleSlide.tsx
│   │   │   ├── StandardSlide.tsx
│   │   │   ├── ComparisonSlide.tsx
│   │   │   └── ...
│   │   └── blocks/
│   │       ├── CardGrid.tsx
│   │       ├── CodeBlock.tsx
│   │       ├── Callout.tsx
│   │       └── ...
│   ├── agents/
│   │   ├── outline.ts
│   │   ├── enrich.ts
│   │   ├── review.ts
│   │   └── design.ts
│   ├── lib/
│   │   ├── schema.ts
│   │   ├── renderer.ts
│   │   └── export.ts
│   └── styles/
│       ├── design-system.css
│       └── slide-types.css
├── templates/
│   ├── prompts/
│   │   ├── outline-agent.md
│   │   ├── enrich-agent.md
│   │   ├── oracle-writing-review.md
│   │   └── design-review.md
│   └── presentations/
│       ├── technical-masterclass.yaml
│       └── executive-briefing.yaml
├── docs/
│   ├── writing-style-guide.md
│   ├── slide-types.md
│   └── design-system.md
└── examples/
    └── gpt-guide/
        ├── content.yaml
        └── output/
```

---

## Part 9: Success Metrics

### Quality Metrics
- Intro paragraphs ≤ 3 sentences
- Technical terms defined on first use
- No unexplained jargon for target audience
- Consistent visual hierarchy across slides

### Efficiency Metrics
- Outline to first draft: < 30 minutes
- Review cycle: < 15 minutes per iteration
- Design issues caught automatically: > 80%

### User Satisfaction
- Output requires < 20% manual editing
- Reusable for future presentations
- Meets enterprise quality standards

---

## Appendix A: Reference Implementation

The current GPT Guide presentation serves as the reference implementation:

- **Location**: `/Users/rishi/Code/chatgpt/gpt-guide/`
- **Files**: `index.html`, `styles.css`, `app.js`
- **Slides**: 18 pages covering GPT architecture patterns
- **Design**: KPMG-inspired dark theme with blue accents

This spec was derived from building that presentation through iterative refinement with AI assistance.

---

## Appendix B: Prompt Templates

### Writing Review Prompt (Oracle)

See: `.agents/oracle/gpt-guide-writing-review/prompt-v2.md`

Key elements:
1. Audience profile (what they know vs. learning)
2. Document context (format constraints)
3. Specific improvement goals
4. Anti-patterns to avoid (glossary boxes, callouts)
5. Output format requirements
6. Quality checklist

### Enrichment Agent Prompt

```markdown
# Content Enrichment Agent

## Your Role
You expand bullet-point outlines into polished slide content while
maintaining information density and professional tone.

## Audience
{audience_profile}

## For Each Slide
1. Write an intro paragraph (2-3 sentences, authoritative)
2. Expand telegraphic bullets into clear sentences where needed
3. Define technical terms inline on first use
4. Suggest callout if the slide needs one
5. Do NOT add filler, padding, or excessive explanation

## Style
- Active voice
- No hedging
- Trust reader's domain expertise
- Concrete over abstract

## Output
Return the enriched content in the same YAML structure.
Mark expanded sections with # ENRICHED comment.
```
