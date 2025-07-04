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

## Browser Request Lifecycle: From URL to Rendered Interface

Understanding how web requests flow from user input to rendered interface is fundamental to Frigg's Gate's architecture. This section details the complete lifecycle from when a user types a URL to when they see the interactive chat interface.

### Step 1: DNS Resolution and Secure Connection

When a user navigates to Frigg's Gate:

1. **DNS Resolution**: The browser resolves the domain name to an IP address
2. **TLS Handshake**: A secure HTTPS connection is established 
3. **Certificate Validation**: The browser verifies the server's identity
4. **Encrypted Channel**: All subsequent communication is encrypted

### Step 2: HTTP Request and Server Response

The browser sends an HTTP request that includes:
- Request headers (User-Agent, Accept types, etc.)
- Any authentication tokens or session data
- Referrer information and browser capabilities

### Step 3: Next.js Server-Side Rendering

Frigg's Gate's Next.js server processes the request by:

1. **Route Matching**: Mapping the URL to the appropriate page component
2. **Component Execution**: Running React components server-side
3. **Data Fetching**: Loading any initial data required for the page
4. **HTML Generation**: Rendering the complete HTML document
5. **Asset Bundling**: Including CSS, JavaScript, and other resources

### Step 4: The Six Essential Web Categories

Every web page, including Frigg's Gate, requires six fundamental categories of resources:

#### 1. HTML Structure
- Defines the document skeleton and semantic structure
- Creates the DOM tree that other technologies manipulate
- Provides accessibility landmarks and navigation structure

#### 2. CSS Styling  
- **Foundational Styling**: Global fonts, colors, and theme defaults
- **Layout & Positioning**: Flexbox, grid, spacing, and responsive design
- **Component Appearance**: Visual identity, states, and interactions
- **One-Off Customization**: Specific tweaks and unique styling needs

#### 3. JavaScript Logic
- **DOM Interaction**: Event handling and browser API access
- **Component Logic**: Local state management and user interactions  
- **Application State**: Global data flow and cross-component communication
- **Business Logic**: Domain-specific rules and cognitive orchestration

#### 4. Data Payloads
- Initial page data embedded in HTML
- API responses from Bifröst backend
- Real-time streaming content from LLM interactions
- Session and user preference data

#### 5. Assets
- Images, icons, and visual media
- Fonts and typography resources
- Audio/video content when applicable
- Downloadable files and documents

#### 6. Runtime Bootstrapping
- React hydration process
- Event listener attachment
- State initialization and context setup
- Service worker registration (if applicable)

### Step 5: Client-Side Hydration

Once the HTML reaches the browser:

1. **Parse HTML**: The browser builds the initial DOM structure
2. **Load Resources**: CSS and JavaScript files are fetched and processed
3. **React Hydration**: JavaScript "wakes up" the static HTML
4. **Event Binding**: User interactions become functional
5. **State Initialization**: The application becomes fully interactive

## Styling Architecture

Frigg's Gate employs a sophisticated multi-layered styling approach that combines three complementary technologies:

### Technology Stack Integration

| Technology | Purpose | Usage Pattern |
|------------|---------|---------------|
| **Tailwind CSS** | Utility-first layout and structure | `className="flex p-4 bg-gray-800"` |
| **Chakra UI** | Component system with design tokens | `<Box bg="gray.800" p={4}>` |
| **Emotion** | CSS-in-JS for dynamic styling | Runtime style generation |

### Four Layers of Styling

#### Layer 1: Foundational Styling
Establishes the baseline visual system:
- Global font families and typography scales
- Base color palette and theme tokens
- Default spacing and layout rules
- Universal component behaviors

#### Layer 2: Layout & Positioning  
Controls spatial relationships:
- Flexbox and grid structures for complex layouts
- Responsive breakpoints and mobile-first design
- Container constraints and content flow
- Alignment and distribution patterns

#### Layer 3: Component Appearance
Defines visual identity:
- Color schemes and visual variants
- Interactive states (hover, focus, disabled)
- Shadows, borders, and visual depth
- Typography hierarchy and text treatment

#### Layer 4: One-Off Customization
Handles specific exceptions:
- Conditional styling based on application state
- Temporary overrides for special cases
- Prototype and experimental visual treatments
- Page-specific design requirements

## Security and Content Processing

Frigg's Gate implements multiple layers of security to protect against common web vulnerabilities:

### Content Sanitization
- **DOMPurify**: Sanitizes all user-generated HTML content
- **Input Validation**: Validates and sanitizes form inputs before processing
- **XSS Prevention**: Prevents script injection through content filtering

### Secure Communication
- **HTTPS Enforcement**: All communication encrypted in transit
- **CSRF Protection**: Cross-site request forgery prevention
- **Content Security Policy**: Restricts resource loading to trusted sources

### Markdown and Code Processing
- **Marked.js**: Safely processes markdown content from LLM responses
- **Highlight.js**: Provides syntax highlighting for code blocks
- **Content Isolation**: User content is processed in isolated contexts

---

This architecture document serves as the definitive reference for understanding the technical foundations of Frigg's Gate and its role within the broader Life Nervous System ecosystem.