# Frigg's Gate Architecture

This document provides a comprehensive overview of the Frigg's Gate system architecture, including system diagrams, technology stack information, and component relationships.

## System Overview

Frigg's Gate is the central interface to the Life Nervous System (LNS) — a production-grade cognitive architecture that converts human intent into structured insight through semantically routed execution pipelines.

## High-Level Architecture

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

## Frontend Architecture (Frigg's Gate)

### Technology Stack

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| **Framework** | Next.js | 13.5.4 | App Router, SSR, React Server Components |
| **Runtime** | React | 18.2.0 | Virtual DOM, Component System, Concurrent Features |
| **Language** | TypeScript | 5.1.6 | Type Safety, Developer Experience |
| **Styling** | Tailwind CSS | 3.3.3 | Utility-First CSS Framework |
| **UI Components** | Chakra UI | 2.8.1 | Design System, Accessible Components |
| **CSS-in-JS** | Emotion | 11.11.0 | Dynamic Styling, Theme Support |
| **Package Manager** | Yarn | 1.22.19 | Dependency Management, Workspaces |

### Component Architecture

```
app/
├── layout.tsx (Root Layout)
│   ├── HTML Shell & Metadata
│   ├── Global Styles (globals.css)
│   ├── Dark Theme Configuration
│   └── Font Setup
│
├── page.tsx (Home Page)
│   ├── ChakraProvider (Theme Context)
│   ├── ToastContainer (Notifications) 
│   └── ChatWindow (Main Interface)
│
└── components/
    ├── ChatWindow.tsx
    │   ├── LLM Model Selector
    │   ├── Message History Container
    │   ├── User Input Interface
    │   └── Streaming Response Handler
    │
    ├── ChatMessageBubble.tsx
    │   ├── Message Content Rendering
    │   ├── Markdown Processing (Marked)
    │   ├── Code Syntax Highlighting (Highlight.js)
    │   └── XSS Protection (DOMPurify)
    │
    ├── SourceBubble.tsx
    │   ├── Citation Display
    │   ├── Source Link Management
    │   └── Reference Tracking
    │
    ├── AutoResizeTextarea.tsx
    │   ├── Dynamic Height Adjustment
    │   ├── Input State Management
    │   └── Keyboard Event Handling
    │
    ├── EmptyState.tsx
    │   ├── Onboarding Suggestions
    │   ├── Quick Action Buttons
    │   └── User Guidance
    │
    └── InlineCitation.tsx
        ├── Reference Numbering
        ├── Source Attribution
        └── Citation Linking
```

### Data Flow Architecture

```
User Input → ChatWindow State → API Request → Bifröst Backend
     ↑                                              ↓
     └── UI Update ← Response Processing ← Streaming Response
```

**Detailed Flow:**

1. **User Interaction**: User types in `AutoResizeTextarea`
2. **State Management**: `ChatWindow` updates local state
3. **API Request**: HTTP POST to `/ask/invoke` endpoint
4. **Backend Processing**: Bifröst routes to appropriate Cypher
5. **Streaming Response**: Real-time data streams back
6. **Content Processing**: Markdown parsing, citation extraction
7. **UI Rendering**: `ChatMessageBubble` displays formatted content
8. **Citation Handling**: `SourceBubble` shows references

## Backend Architecture (Bifröst)

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Orchestration** | LangGraph | Agent workflow management |
| **API Framework** | LangServe + FastAPI | HTTP API endpoints |
| **Language** | Python | Backend runtime |
| **Expression Language** | LCEL | LangChain pipelines |
| **Tracing** | LangSmith | Execution monitoring |
| **High Performance** | Rust | Performance-critical operations |

### Cognitive Architecture

```
Request → Input Validation → Semantic Router → Cypher Selection → Response
    ↓                                                    ↑
Session Context → Memory Management → Tool Invocation → Result Assembly
```

### Cypher Agents

Each Cypher is an independently callable agent for specific computations:

- **Quick Quote**: Insurance pricing calculations
- **Life Expectancy + Basic Illustration**: Actuarial analysis
- **Underwriter Educator**: Risk assessment guidance  
- **About Frigg and LNS**: System information and help

## Data Layer Architecture

### Storage Strategy

```
┌─────────────────────────────────────────────────────┐
│                   Data Layer                        │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Structured │  │   Vector    │  │    Graph    │  │
│  │    Data     │  │   Search    │  │  Knowledge  │  │
│  │             │  │             │  │             │  │
│  │  SQLite     │  │   Chroma    │  │   NEOR4     │  │
│  │  PostgreSQL │  │  Embeddings │  │ Relationships│  │
│  │  DuckDB     │  │  Similarity │  │  Entities   │  │
│  └─────────────┘  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Data Types

- **Structured Data**: User sessions, conversation history, system logs
- **Vector Data**: Document embeddings, semantic search indices  
- **Graph Data**: Knowledge relationships, entity connections
- **Cache Data**: Response caching, session state

## Network Architecture

### Development Environment

```
Browser (localhost:3000) → Next.js Dev Server → Bifröst (localhost:8000)
```

### Production Environment

```
Browser → CDN/Load Balancer → Vercel/Docker → Bifröst API → External Services
                                  ↓
                            Frontend Assets
                            (HTML/CSS/JS)
```

### API Contract

**Endpoint**: `POST /ask/invoke`

**Request Format**:
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

## Security Architecture

### Frontend Security

- **XSS Protection**: DOMPurify for user content sanitization
- **HTTPS Enforcement**: TLS encryption for all communications
- **Content Security Policy**: Restrictive CSP headers
- **Input Validation**: Client-side validation before API calls

### Backend Security

- **Input Validation**: Pydantic models for payload validation
- **Authentication**: Session-based user identification
- **Rate Limiting**: API request throttling
- **Error Handling**: Secure error responses without data leakage

## Performance Architecture

### Frontend Optimization

- **Server-Side Rendering**: Next.js SSR for fast initial loads
- **Code Splitting**: Dynamic imports for reduced bundle size
- **Image Optimization**: Next.js automatic image optimization
- **Caching**: Browser caching for static assets

### Backend Optimization

- **Streaming**: Real-time response streaming for LLM interactions
- **Connection Pooling**: Database connection management
- **Caching**: Response caching for repeated queries
- **Concurrent Processing**: Async/await patterns for I/O operations

## Deployment Architecture

### Development

```
Local Machine
├── Frontend: next dev (Port 3000)
├── Backend: uvicorn (Port 8000)  
└── Database: SQLite (Local file)
```

### Production

```
Vercel Platform
├── Frontend: Static + Serverless Functions
├── Backend: Docker Container or Serverless
└── Database: PostgreSQL/DuckDB (Cloud)
```

## Monitoring & Observability

### Frontend Monitoring

- **Error Tracking**: Client-side error capture
- **Performance Metrics**: Core Web Vitals monitoring
- **User Analytics**: Interaction tracking
- **Console Logging**: Development debugging

### Backend Monitoring

- **LangSmith Tracing**: LLM execution tracking
- **API Metrics**: Request/response monitoring
- **Error Logging**: Structured error reporting
- **Performance Profiling**: Execution time analysis

## Future Architecture Considerations

### Scalability

- **Microservices**: Break down Cyphers into independent services
- **Load Balancing**: Distribute traffic across multiple instances
- **Database Sharding**: Scale data layer horizontally
- **CDN Integration**: Global content delivery

### Enhanced Capabilities

- **Real-time Collaboration**: Multi-user session support
- **Mobile Applications**: React Native or native mobile apps
- **Voice Interface**: Speech-to-text and text-to-speech integration
- **Advanced Analytics**: ML-powered usage insights

---

This architecture document serves as the definitive reference for understanding the technical foundations of Frigg's Gate and its role within the broader Life Nervous System ecosystem.