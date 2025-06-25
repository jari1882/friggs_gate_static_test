# Cognitive UX Guide

## 📘 Project: Cognitive UX Engineer – Conceptual Guide and Evaluation

### 🧭 Objective

Conduct a deep evaluation of **Cognitive UX Engineering** as a conceptual discipline, focused specifically on how user experience (UX) design principles evolve when interfacing with cognitive systems—especially those powered by LLMs and structured intelligence.

This project’s outcome will be a Markdown document (`/docs/cognitive-UX-guide.md` in the `friggs-gate-frontend` repo) that articulates a clear, layered mental model of the field, progressively diving into research, patterns, system examples, and principles. It is not a product requirement doc—it is a **thinking document** meant to clarify what this emerging discipline could be and how it relates to Frigg and LNS.

---

### 🎯 Scope & Deliverables

#### 📄 Primary Deliverable
A conceptual guide titled `cognitive-UX-guide.md` with the following attributes:
- **Language-agnostic** (except where specific tech examples help illuminate the concept)
- Structured from **high-level abstraction** → **deep technical content**
- Merges **academic**, **commercial**, and **emergent** sources
- Illustrates examples and comparative approaches (e.g. prompt workflows vs. embedded cognition vs. invisible UI strategies)

#### 🧱 Structural Outline (starting point, flexible)
1. **Introduction**
   - Define "Cognitive UX"
   - Distinction from traditional UX and from Cognitive Systems alone
2. **Why This Discipline Matters Now**
   - Context: rise of LLMs, structured reasoning systems, interactive agents
   - UX as the bottleneck for cognitive systems adoption
3. **Mental Model**
   - How cognitive systems interpret/act vs. how users perceive/steer
   - Concepts like: intent resolution, model legibility, epistemic friction, cognitive scaffolding
4. **Current State of the Field**
   - Survey of practices and paradigms (e.g. agentic UX, dynamic affordances, adaptive explanations)
   - Frontend patterns emerging (React/LLM bridges, declarative prompt builders, memory/feedback UI)
5. **Deep Dive: Frigg Context**
   - Bifrost backend: cognitive intelligence layer
   - Frigg’s Gate: where that layer becomes usable
   - Limitations of current UI exposure
6. **Comparative Approaches**
   - Not focused on who is doing it, but *how* it's being done (frameworks, middleware patterns, interaction models)
   - Annotated examples across commercial, open source, and academic work
7. **Research Threads**
   - Academic fields to reference: Human-AI Interaction, Explainable AI (XAI), Cognitive Load Theory, Distributed Cognition, Activity Theory
   - Applied resources: Anthropic’s Constitutional UX patterns, OpenAI’s Function Calling scaffolds, etc.
8. **Future Trajectory**
   - Where the field could go
   - How LNS could participate or internalize it

---

### 🧠 Conceptual Boundaries

- Focus **specifically** on **Cognitive UX Engineering**—not on cognitive system architecture in isolation.
- The lens is *how a user interfaces with intelligence*, not how intelligence is built.
- Related but downstream from LNS’s structured intelligence and semantic layers—this is about **exposure, interaction, and understanding**.
- UX patterns should be evaluated **independently of stack**, but examples can be drawn from React/Python/LLM architectures (like ours).

---

### 🔨 Platform Context

- Frontend: React (`friggs-gate-frontend`)
- Backend: Python (`bifrost`) exposing structured and generative cognitive APIs via LLMs
- LLM activation via stubbed command layer (current constraint)

---

### ✅ Success Criteria

- A working `.md` file that can serve as a **shared mental model** for the team
- Useful for onboarding, future prototyping, and strategic design alignment
- Feeds into broader understanding of how LNS will present cognitive power to users through design, not just through infra

---

## ✅ Rubicon Evaluation Criteria

| Criteria                 | Below Rubicon                | At Rubicon                         | Beyond Rubicon                   |
|:-------------------------|:-----------------------------|:-----------------------------------|:---------------------------------|
| Conceptual Clarity       | Vague or poorly defined      | Clear definition and framing       | Insightful, reframes the field   |
| Depth of Research        | Surface-level sources only   | Academic + commercial mix          | Uncovers non-obvious links       |
| Structural Rigor         | Disorganized or shallow      | Clear top-down structure           | Elegant scaffolding, extensible  |
| Relevance to Frigg / LNS | Detached from current stack  | Tied to Frigg/Bifrost model        | Directly informs upcoming design |
| Pattern Identification   | Scattered list, no synthesis | Explains patterns with clarity     | Frameworks or archetypes defined |
| Illustrative Examples    | Few or unclear examples      | Clarifying and relevant examples   | Examples that generate insight   |
| Original Thinking        | Mostly derivative            | Coherent and internally consistent | Novel constructs or language     |