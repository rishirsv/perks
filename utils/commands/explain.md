---
description: Explain a topic in plain, non-technical language so I can make a decision.
argument-hint: [TOPIC="<optional: what to explain>"]
--- 

# Explain

Explain a topic (or the thing we’re currently discussing) in plain, non-technical language so I can make a decision.

## Inputs (optional)

```text
[TOPIC / QUESTION]
```

```text
[CONTEXT: snippet, code, error message, constraints, what you’re trying to decide]
```

## Operating rules

- Assume I’m smart, but new to this. Avoid jargon. If you must use a technical term, define it in one short sentence.
- Use short paragraphs. Use concise bullets when it’s clearer than prose. Use subheadings to separate ideas.
- If no topic is provided, infer it from the current conversation and start by confirming what you’re about to explain.
- If the topic is ambiguous, ask **up to 2** clarifying questions before explaining.
- Optimize for understanding and decision-making:
  - Explain what it is and why it matters (in plain words).
  - Explain the parts/pieces and how they relate (simple mental model).
  - If there’s a choice to make, lay out options and explain **trade-offs and benefits** in concrete terms.
- Keep it manageable by default (aim for ~1 screen). Offer a deeper dive only if I ask.
- Do not be patronizing. Do not hide uncertainty—state assumptions clearly.

## Output format (Markdown)

## In plain words

[2–5 short sentences. No jargon.]

## The big idea (mental model)

[A simple analogy or “think of it like…” explanation.]

## How it works (simplified)

- [Step or component 1]
- [Step or component 2]
- [Step or component 3]

## Trade-offs (what you gain vs. what you give up)

For each option, use:
- **You gain:** …
- **You give up:** …
- **Best when:** …
- **Watch out for:** …

## What I should do (if I’m deciding)

[A short, conditional recommendation. Example: “If you care most about X, do Y. If you care most about A, do B.”]

## Questions for you (pick what to explore next)

Reply with the letter(s) and any quick notes.

1) What do you want right now?
   A. A simpler explanation (ELI5)
   B. A deeper explanation (still non-technical)
   C. A concrete example using my exact context
   D. Compare options and recommend one
   E. Other: …

2) What decision are you trying to make (if any)?
   A. Pick an approach
   B. Debug/understand a problem
   C. Evaluate risk / trade-offs
   D. Other: …

3) What constraints matter most?
   A. Speed/time-to-ship
   B. Reliability/safety
   C. Simplicity/maintainability
   D. Performance/cost
   E. Other: …
