# Frigg's Gate

![Build Status](https://img.shields.io/github/actions/workflow/status/jari1882/friggs-gate/ci.yml?branch=main)
![Version](https://img.shields.io/github/package-json/v/jari1882/friggs-gate/frontend)
![License](https://img.shields.io/github/license/jari1882/friggs-gate)

**Frigg's Gate** is the central interface to the Life Nervous System (LNS) — a mythically-coded, multiverse-inspired orchestration layer that governs access to knowledge, tools, and cognitive processes. It serves as the dimensional gateway through which structured intelligence flows, and through which all external interfaces must pass.

## System Overview

Frigg's Gate is composed of:
- **Frigg's Gate Frontend** - Web-based user interface built with Next.js
- **GateTester** - Python-based frontend simulation/testing utility  
- **🌀 Bifröst** - LangGraph backend that evolves into the intelligent interface to all LNS utilities

Over time, **Bifröst** will emerge as a full cognitive architecture — managing routing, memory, data handling, and dynamic invocation of functional agents known as **Cyphers**.

## Architecture

LNS is a production-grade cognitive architecture that converts human intent into structured insight through semantically routed execution pipelines. It spans UI input, agent orchestration, tool invocation, memory, and streaming output — enabling real-time cognition across web, CLI, and API clients.

```
┌─────────────────────────────────────────────────────────────────┐
│                    Life Nervous System (LNS)                   │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Frigg's Gate  │  │   GateTester    │  │   API Clients   │  │
│  │  (Web Frontend) │  │  (CLI Tester)   │  │  (External)     │  │
│  │                 │  │                 │  │                 │  │
│  │  Next.js        │  │  Python         │  │  JSON/HTTP      │  │
│  │  React          │  │  Terminal       │  │  REST API       │  │
│  │  TypeScript     │  │  CLI Interface  │  │  Integration    │  │
│  └─────────┬───────┘  └─────────┬───────┘  └─────────┬───────┘  │
│            │                    │                    │          │
│            └────────────────────┼────────────────────┘          │
│                                 │                               │
├─────────────────────────────────┼─────────────────────────────────┤
│            ┌────────────────────┴────────────────────┐          │
│            │           🌀 Bifröst Backend            │          │
│            │     (Cognitive Orchestration Engine)     │          │
│            │                                         │          │
│            │  ┌─────────────────────────────────────┐ │          │
│            │  │        LangGraph + LangServe        │ │          │
│            │  │         FastAPI + Python            │ │          │
│            │  │         LangSmith Tracing           │ │          │
│            │  └─────────────────────────────────────┘ │          │
│            │                    │                     │          │
│            │  ┌─────────────────┴───────────────────┐ │          │
│            │  │         Cyphers (Agents)            │ │          │
│            │  │                                     │ │          │
│            │  │  • Quick Quote                      │ │          │
│            │  │  • Life Expectancy + Illustration   │ │          │
│            │  │  • Underwriter Educator             │ │          │
│            │  │  • About Frigg and LNS              │ │          │
│            │  └─────────────────────────────────────┘ │          │
│            └─────────────────┬───────────────────────┘          │
├──────────────────────────────┼──────────────────────────────────┤
│            ┌─────────────────┴───────────────────┐              │
│            │        Intelligence & Data Layer     │              │
│            │                                     │              │
│            │  ┌─────────────┐  ┌─────────────────┐ │              │
│            │  │   Local     │  │     Remote      │ │              │
│            │  │   Storage   │  │    Storage      │ │              │
│            │  │             │  │                 │ │              │
│            │  │  SQLite     │  │  PostgreSQL     │ │              │
│            │  │  (Default)  │  │  DuckDB         │ │              │
│            │  │             │  │  MotherDuck     │ │              │
│            │  └─────────────┘  └─────────────────┘ │              │
│            │                                     │              │
│            │  ┌─────────────┐  ┌─────────────────┐ │              │
│            │  │   Vector    │  │     Graph       │ │              │
│            │  │   Search    │  │   Knowledge     │ │              │
│            │  │             │  │                 │ │              │
│            │  │   Chroma    │  │    NEOR4        │ │              │
│            │  │  (Remote)   │  │  (Graph DB)     │ │              │
│            │  └─────────────┘  └─────────────────┘ │              │
│            └─────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Components

- **Frontend**: Next.js (React + TypeScript) with Tailwind + Chakra UI
- **Backend**: Python with LangGraph + LangServe + FastAPI
- **Data Layer**: SQLite (default), PostgreSQL/DuckDB/MotherDuck (testing), Chroma (vector search)
- **Intelligence**: LLM integration with streaming responses and citations

### Detailed Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js | 13.5.4 | App Router, SSR, React Server Components |
| **Runtime** | React | 18.2.0 | Virtual DOM, Component System, Concurrent Features |
| **Language** | TypeScript | 5.1.6 | Type Safety, Developer Experience |
| **Styling** | Tailwind CSS | 3.3.3 | Utility-First CSS Framework |
| **UI Components** | Chakra UI | 2.8.1 | Design System, Accessible Components |
| **CSS-in-JS** | Emotion | 11.11.0 | Dynamic Styling, Theme Support |
| **Package Manager** | Yarn | 1.22.19 | Dependency Management, Workspaces |

### Component Organization

**File Structure:**
```
├── app/
│   ├── layout.tsx          # Root layout with global providers
│   ├── page.tsx            # Main chat interface entry point
│   ├── globals.css         # Global styling and theme definitions
│   ├── components/
│   │   ├── ChatWindow.tsx           # Primary interface orchestration
│   │   ├── ChatMessageBubble.tsx    # Individual message rendering
│   │   ├── EmptyState.tsx          # Welcome screen and action cards
│   │   ├── AutoResizeTextarea.tsx   # Dynamic input component
│   │   ├── InlineCitation.tsx      # Source reference display
│   │   └── SourceBubble.tsx        # Source information cards
│   ├── hooks/
│   │   └── useFriggState.ts        # State management
│   └── utils/
│       ├── constants.tsx           # Configuration and API endpoints
│       └── sendFeedback.tsx        # User interaction tracking
├── public/
│   ├── brain-favicon.ico           # Application branding
│   └── images/                     # Static assets and icons
├── package.json                    # Dependencies and scripts
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

**Component Hierarchy:**
```
App (layout.tsx)
├── ChakraProvider (styling context)
├── Page (page.tsx)
    └── ChatWindow (main interface)
        ├── EmptyState (initial welcome)
        │   └── ActionCards (quick actions)
        ├── MessageList (conversation history)
        │   └── ChatMessageBubble (individual messages)
        │       ├── InlineCitation (source references)
        │       └── SourceBubble (source details)
        └── InputArea
            └── AutoResizeTextarea (user input)
```

### Backend Architecture (Bifröst)

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Orchestration** | LangGraph | Agent workflow management |
| **API Framework** | LangServe + FastAPI | HTTP API endpoints |
| **Language** | Python | Backend runtime |
| **Expression Language** | LCEL | LangChain pipelines |
| **Tracing** | LangSmith | Execution monitoring |
| **High Performance** | Rust | Performance-critical operations |

**Cypher Agents:**
- **Quick Quote**: Insurance pricing calculations
- **Life Expectancy + Basic Illustration**: Actuarial analysis
- **Underwriter Educator**: Risk assessment guidance  
- **About Frigg and LNS**: System information and help

## Installation

### Prerequisites

- Node.js (for frontend)
- Yarn package manager
- Python (for backend services)

### Frontend Setup

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Start the development server:
   ```bash
   yarn dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linting
- `yarn format` - Format code with Prettier

### Testing Changes

Before committing, test your changes:
```bash
yarn lint
yarn build
```

## Usage

### Basic Chat Interface

1. Open Frigg's Gate in your browser
2. Select your preferred LLM model from the dropdown
3. Type your question in the input field
4. Press Enter or click the send button
5. View the streaming response with citations and sources

### API Integration

**Main Endpoint:**
- **Base URL**: `http://localhost:8000` (development)
- **Endpoint**: `POST /ask/invoke`
- **Purpose**: Submit questions to the 🌀 Bifröst cognitive orchestration engine

### API Contract

**Request Format:**
```json
{
  "input": {
    "version": "1.0",
    "question": "user question",
    "chat_history": [],
    "metadata": {
      "caller": "frontend_app",
      "purpose": "query_type",
      "timestamp": "2025-06-06T13:45:00Z"
    },
    "session": {
      "user_id": "user-id",
      "context": {}
    },
    "stream": false
  }
}
```

The frontend communicates with the Bifröst backend via structured JSON payloads. For detailed API documentation including request/response schemas, authentication, and error handling, see [`docs/API.md`](docs/API.md).

## Features

- **Real-time Streaming**: Live response streaming from LLM providers
- **Citation System**: Automatic source tracking and inline citations
- **Multiple Models**: Support for various LLM providers
- **Responsive Design**: Mobile-friendly interface with dark theme
- **Error Handling**: Comprehensive error reporting and user feedback
- **Session Management**: Persistent conversation history

### Security Features

- **XSS Protection**: DOMPurify for user content sanitization
- **HTTPS Enforcement**: TLS encryption for all communications
- **Content Security Policy**: Restrictive CSP headers
- **Input Validation**: Client-side validation before API calls
- **Secure Communication**: Encrypted transmission of all data

### Performance Features

- **Server-Side Rendering**: Next.js SSR for fast initial loads
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Browser caching for static assets
- **Streaming Responses**: Real-time response streaming for LLM interactions

## Development

### Tech Stack

- **Frontend**: Next.js 13.5.4, React 18.2.0, TypeScript 5.1.6
- **Styling**: Tailwind CSS 3.3.3, Chakra UI 2.8.1, Emotion 11.11.0
- **Enhanced UX**: React Toastify, Framer Motion, Marked, Highlight.js
- **Package Manager**: Yarn 1.22.19

### Deployment Architecture

**Development:**
```
Local Machine
├── Frontend: next dev (Port 3000)
├── Backend: uvicorn (Port 8000)  
└── Database: SQLite (Local file)
```

**Production:**
```
Vercel Platform
├── Frontend: Static + Serverless Functions
├── Backend: Docker Container or Serverless
└── Database: PostgreSQL/DuckDB (Cloud)
```


## Documentation

- [`docs/API.md`](docs/API.md) - Complete API documentation and contracts
- [`docs/friggs_gate_frontend_guide.md`](docs/friggs_gate_frontend_guide.md) - Comprehensive frontend implementation guide

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test them (see Testing Changes section above)
4. Commit with a clear message: `git commit -m "Add: your feature description"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## License

See `LICENSE` file for details.

---

*Frigg's Gate serves as the mythical bridge between human intent and structured intelligence, enabling seamless interaction with the Life Nervous System's cognitive architecture.*