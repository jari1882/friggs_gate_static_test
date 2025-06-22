# Friggs Gate repository-specification.md

This technical specification is designed for code generation agents — LLMs wrapped in cognitive architecture that autonomously write, modify, and maintain code within software projects. This document provides the comprehensive context needed for such agents to generate code that seamlessly integrates with the existing Friggs Gate codebase while maintaining architectural integrity, following established conventions, and preserving security requirements.


## Overview
Friggs Gate is a modern chat application built with Next.js and React, integrating real-time messaging, LLM agent orchestration, and rich text rendering. It includes a fully responsive UI, secure markdown handling, and structured backend communication for agent-based interactions. The application features a "life-nervous-system" chat interface. 

---

## Repository Structure

```
friggs-gate/
├── docs/                           # Documentation
│   ├── bifrost_api_contract.md     # API contract documentation
│   ├── friggs_gate_frontend_guide.md # Frontend implementation guide
│   ├── jacksons email notes.md     # Email correspondence notes
│   ├── repository-specification.md # This specification document
│   ├── scratchpad.md               # Development notes
│   ├── six-categories-example.html # Example HTML file
│   ├── technical-debt-log.md       # Technical debt tracking
│   └── test.md                     # Test documentation
└── frontend/                       # Next.js application
    ├── app/                        # App Router (Next.js 13+)
    │   ├── components/             # React components
    │   │   ├── AutoResizeTextarea.tsx
    │   │   ├── ChatMessageBubble.tsx
    │   │   ├── ChatWindow.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── InlineCitation.tsx
    │   │   └── SourceBubble.tsx
    │   ├── utils/                  # Utility functions
    │   │   ├── constants.tsx
    │   │   └── sendFeedback.tsx
    │   ├── globals.css             # Global styles
    │   ├── layout.tsx              # Root layout
    │   └── page.tsx                # Home page
    ├── public/                     # Static assets
    │   ├── favicon.ico
    │   └── images/
    │       └── github-mark.svg
    ├── .env.example                # Environment variables template
    ├── .eslintrc.json              # ESLint configuration
    ├── .gitignore                  # Git ignore patterns
    ├── .prettierrc                 # Prettier configuration
    ├── .yarnrc.yml                 # Yarn configuration
    ├── next.config.js              # Next.js configuration
    ├── package.json                # Dependencies and scripts
    ├── postcss.config.js           # PostCSS configuration
    ├── tailwind.config.ts          # Tailwind CSS configuration
    ├── tsconfig.json               # TypeScript configuration
    ├── vercel.json                 # Vercel deployment configuration
    └── yarn.lock                   # Yarn lock file
```

---

## Core Framework & Runtime

- **Framework:** Next.js 13.5.4 with App Router
- **UI Library:** React 18.2.0
- **Language:** TypeScript 5.1.6 (strict mode enabled)
- **Deployment:** Next.js server on Node.js
- **Environment Variables:** 
  - `NEXT_PUBLIC_API_BASE_URL` (defaults to "http://localhost:8000" if not set)
  - Optional: LangChain tracing variables (`LANGCHAIN_TRACING_V2`, `LANGCHAIN_ENDPOINT`, `LANGCHAIN_API_KEY`, `LANGCHAIN_PROJECT`)
  - Optional: OpenAI API key (`OPENAI_API_KEY`)
  - Optional: Weaviate configuration (`WEAVIATE_HOST`, `WEAVIATE_API_KEY`, `WEAVIATE_INDEX_NAME`)

---

## Build & Dev Commands

- `yarn dev` – Start development server (next dev)
- `yarn build` – Build production assets (next build)
- `yarn start` – Run production server (next start)
- `yarn lint` – Lint with ESLint (next lint)
- `yarn format` – Format code with Prettier (prettier --write .)

---

## External API Contract (Bifrost)

Defined in `bifrost_api_contract.md`. The frontend communicates with the backend via a single structured REST endpoint:

- **Endpoint:** `POST /ask/invoke`
- **Payload Structure:**
  ```json
  {
    "input": {
      "version": "1.0",
      "question": "user's message",
      "chat_history": [{"human": "...", "ai": "..."}],
      "metadata": {
        "caller": "frontend_app",
        "purpose": "chat_request",
        "timestamp": "ISO string"
      },
      "session": {
        "user_id": "user-randomstring",
        "context": {
          "conversation_id": "uuid",
          "llm": "selected_model_name"
        }
      },
      "stream": false
    }
  }
  ```
- **Response Structure:**
  ```json
  {
    "output": {
      "status": "success|failed",
      "answer": "markdown formatted response",
      "run_id": "unique_run_identifier",
      "error": "error message if failed" 
    }
  }
  ```

---

## Component Architecture & Data Flow

- **State Management:** Uses React `useState` for local state
- **No Global State:** Prop drilling is used to pass data between components
- **Primary Container:** `ChatWindow.tsx` maintains:
  - Array of chat messages (`Message[]`)
  - Chat history (`{human: string, ai: string}[]`)
  - Current input value
  - Loading states
  - Selected LLM model
- **Data Flow:** Chat messages are passed from `ChatWindow` to child components like `ChatMessageBubble` and `SourceBubble`
- **Component Hierarchy:**
  - Root: `page.tsx` (wraps everything in `ChakraProvider`)
  - Top-level: `ChatWindow` (main container)
  - UI Components: `AutoResizeTextarea`, `EmptyState`, `ChatMessageBubble`, `InlineCitation`, `SourceBubble`
  - Base layout: `layout.tsx` (immutable, uses Montserrat font)

---

## UI & Styling Guidelines

- **Styling Priority:** Chakra UI components take precedence over Tailwind
- **Wrapper:** `ChakraProvider` wraps the app in `page.tsx`
- **Layout & Spacing:** Tailwind used for structural layout and responsive design
- **Theme:** Dark theme by default with background `rgb(38, 38, 41)`
- **Typography:** Montserrat font from Google Fonts
- **Colors:** White text on dark backgrounds, blue accent for interactive elements
- **Patterns:** Reusable Chakra component definitions and consistent spacing via Tailwind utility classes

---

## Security & Content Processing

- **HTML Sanitization:** `DOMPurify@3.0.8` is mandatory for all user-rendered content
- **Markdown Parsing:** `marked@7.0.2` for Markdown support
- **Code Highlighting:** `highlight.js@11.8.0` for syntax rendering
- **Input Validation:** Ensures well-structured payloads and sanitized input before rendering

---

## Operational Constraints

- `layout.tsx` must not be modified (contains immutable Montserrat font and dark theme setup)
- Chakra UI wrapper (`ChakraProvider`) must be preserved in `page.tsx`
- TypeScript strict mode must remain enabled
- API contract structure (`POST /ask/invoke`) must remain exact
- Code organization: components in `app/components`, utils in `app/utils`, pages at app root
- File naming: PascalCase for React components (e.g., `ChatWindow.tsx`)
- Export style: named exports for components, default export for pages
- ESLint config: extends "next/core-web-vitals"
- Prettier config: `{"endOfLine": "lf"}`

---

## Complete Dependency List (Yarn)

### UI & Styling
- `@chakra-ui/react@^2.8.1`
- `@chakra-ui/icons@^2.1.0`
- `@emotion/react@^11.11.1`
- `@emotion/styled@^11.11.0`
- `tailwindcss@3.3.3`
- `framer-motion@^10.16.4`

### AI & Language Processing
- `@langchain/core@^0.1.27`
- `langsmith@^0.0.41`

### Content Parsing & Security
- `marked@^7.0.2`
- `dompurify@^3.0.8`
- `highlight.js@^11.8.0`

### Core Framework & Runtime
- `next@13.5.4`
- `react@18.2.0`
- `react-dom@18.2.0`
- `typescript@5.1.6`

### Build & Development Tools
- `eslint@8.46.0`
- `eslint-config-next@13.4.13`
- `postcss@8.4.31`
- `autoprefixer@10.4.14`

### TypeScript Type Definitions
- `@types/node@20.4.9`
- `@types/react@18.2.20`
- `@types/react-dom@18.2.7`
- `@types/dompurify@^3.0.5`
- `@types/marked@^5.0.1`

### UI Utilities
- `react-textarea-autosize@^8.5.3`
- `react-toastify@^9.1.3`
- `emojisplosion@^2.6.1`
- `graphql@^16.8.1`

### Development Dependencies
- `prettier@^3.0.3`
- `typescript@5.1.6` (also in production)
- `weaviate-ts-client@^1.5.0`

> Package manager: yarn@1.22.19 with nodeLinker: node-modules configuration

---

## Enhancement Candidates

### 1. Define an Execution Contract for Codegen Agents
**Issue:** There’s currently no section describing what the agent is allowed to generate or modify. This is fine while humans drive the process, but as automation increases, an explicit contract will be necessary.

**Fix:** Add a section like:
```md
## Agent Execution Boundaries

- Agents may create or modify files under `app/components` and `app/utils`.
- Must not alter `layout.tsx`, config files, or global styles.
- All generated code must use Chakra UI primitives, TypeScript strict mode, and kebab-case file naming.
```



### 2. Provide an Example API Payload (When Stable)
**Issue:** There is no example payload shown in the spec. Since the payload is still evolving, it’s tracked in `bifrost_api_contract.md`.

**Fix (when stable):** Once the schema settles, inline a representative `POST /ask/invoke` payload with chat history, agent request, session metadata, etc.



### 3. Exclude Backend LLM Logic
**Clarification:** The backend agent orchestration (Bifrost and LangChain flows) should not be documented here. This repository only includes the frontend application.



### 4. Add Session Model Definition (Once Finalized)
**Issue:** There’s no documentation of how session or chat state is handled. This makes it difficult for agents to reason about persistence or message continuity.

**Fix (when backend storage is defined):**
```md
## Session Model

- UI stores messages in `useState` (no global state).
- Session data is ephemeral unless persisted by a future backend update.
- A `session_id` is passed with every API request, but no client storage is used.
```



### 5. Include Example Chakra+Tailwind Component
**Issue:** The spec describes styling rules, but lacks a concrete example. Codegen agents benefit significantly from a canonical component sample.

**Fix:**
```tsx
export function ChatMessageBubble({ content }: { content: string }) {
  return (
    <Box
      bg="gray.700"
      p={4}
      rounded="2xl"
      className="mb-2 max-w-xl"
    >
      <Text color="white">{content}</Text>
    </Box>
  );
}
```
This shows Chakra layout props, Tailwind for spacing, and type-safe prop handling.
