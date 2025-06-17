# Repository Specification

## Overview
Friggs Gate is a modern chat application built with Next.js and React, featuring real-time messaging capabilities with advanced text processing and AI integration.

## Repository Structure

```
friggs-gate/
├── docs/                           # Documentation
│   ├── bifrost_api_contract.md     # API contract documentation
│   ├── friggs-gate.md              # Main project documentation
│   ├── friggs_gate_ux_guide.md     # UX guidelines
│   ├── front-end-mental-model.md   # Frontend architecture model
│   └── scratch.md                  # Development notes
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
    └── [config files]             # Various configuration files
```

## Tech Stack

### Core Framework
- **Next.js 13.5.4** - React framework with App Router
- **React 18.2.0** - UI library
- **TypeScript 5.1.6** - Type safety

### UI & Styling
- **Chakra UI 2.8.1** - Component library
- **Tailwind CSS 3.3.3** - Utility-first CSS
- **Framer Motion 10.16.4** - Animation library
- **Emotion** - CSS-in-JS styling

### AI & Language Processing
- **LangChain Core 0.1.27** - LLM framework
- **LangSmith 0.0.41** - LLM observability
- **Marked 7.0.2** - Markdown parser
- **Highlight.js 11.8.0** - Syntax highlighting
- **DOMPurify 3.0.8** - HTML sanitization

### Data & State Management
- **GraphQL 16.8.1** - Query language
- **Weaviate TypeScript Client 1.5.0** - Vector database client

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Yarn 1.22.19** - Package manager

### Additional Libraries
- **React Toastify** - Notifications
- **React Textarea Autosize** - Auto-resizing text areas
- **Emojisplosion** - Emoji animations
- **UUID** - Unique identifier generation

## Key Features
- Real-time chat interface with message bubbles
- Markdown rendering with syntax highlighting
- Auto-resizing text areas
- Citation and source referencing
- Feedback system
- Empty state handling
- Responsive design with Tailwind CSS

## Development Commands
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier

## Configuration
- **TypeScript**: Strict mode enabled with path mapping
- **Next.js**: Standard configuration with App Router
- **Tailwind**: Custom gradient configurations
- **Deployment**: Vercel-ready configuration