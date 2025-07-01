# Frigg's Gate

**Frigg's Gate** is the central interface to the Life Nervous System (LNS) — a mythically-coded, multiverse-inspired orchestration layer that governs access to knowledge, tools, and cognitive processes. It serves as the dimensional gateway through which structured intelligence flows, and through which all external interfaces must pass.

## System Overview

Frigg's Gate is composed of:
- **Frigg's Gate Frontend** - Web-based user interface built with Next.js
- **GateTester** - Python-based frontend simulation/testing utility  
- **🌀 Bifröst** - LangGraph backend that evolves into the intelligent interface to all LNS utilities

Over time, **Bifröst** will emerge as a full cognitive architecture — managing routing, memory, data handling, and dynamic invocation of functional agents known as **Cyphers**.

## Architecture

LNS is a production-grade cognitive architecture that converts human intent into structured insight through semantically routed execution pipelines. It spans UI input, agent orchestration, tool invocation, memory, and streaming output — enabling real-time cognition across web, CLI, and API clients.

### Key Components

- **Frontend**: Next.js (React + TypeScript) with Tailwind + Chakra UI
- **Backend**: Python with LangGraph + LangServe + FastAPI
- **Data Layer**: SQLite (default), PostgreSQL/DuckDB/MotherDuck (testing), Chroma (vector search)
- **Intelligence**: LLM integration with streaming responses and citations

## Installation

### Prerequisites

- Node.js (for frontend)
- Yarn package manager
- Python (for backend services)

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Start the development server:
   ```bash
   yarn dev
   ```

4. Open your browser to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn start` - Start production server
- `yarn lint` - Run linting
- `yarn format` - Format code with Prettier

## Usage

### Basic Chat Interface

1. Open Frigg's Gate in your browser
2. Select your preferred LLM model from the dropdown
3. Type your question in the input field
4. Press Enter or click the send button
5. View the streaming response with citations and sources

### API Integration

The frontend communicates with the Bifröst backend via the `/ask/invoke` endpoint. See `docs/bifrost_api_contract.md` for detailed API specifications.

Example payload:
```json
{
  "input": {
    "version": "1.0",
    "question": "How much would a policy cost for a 40-year-old?",
    "chat_history": [],
    "metadata": {
      "caller": "frontend_app",
      "purpose": "quote_request",
      "timestamp": "2025-06-06T13:45:00Z"
    },
    "session": {
      "user_id": "user-456",
      "context": {}
    },
    "stream": false
  }
}
```

## Features

- **Real-time Streaming**: Live response streaming from LLM providers
- **Citation System**: Automatic source tracking and inline citations
- **Multiple Models**: Support for various LLM providers
- **Responsive Design**: Mobile-friendly interface with dark theme
- **Error Handling**: Comprehensive error reporting and user feedback
- **Session Management**: Persistent conversation history

## Development

### Tech Stack

- **Frontend**: Next.js 13.5.4, React 18.2.0, TypeScript 5.1.6
- **Styling**: Tailwind CSS 3.3.3, Chakra UI 2.8.1, Emotion 11.11.0
- **Enhanced UX**: React Toastify, Framer Motion, Marked, Highlight.js
- **Package Manager**: Yarn 1.22.19

### Project Structure

```
frontend/
├── app/
│   ├── components/          # React components
│   │   ├── ChatWindow.tsx   # Main chat interface
│   │   ├── ChatMessageBubble.tsx
│   │   ├── AutoResizeTextarea.tsx
│   │   └── ...
│   ├── utils/              # Utility functions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
└── package.json           # Dependencies and scripts
```

### Component Architecture

```
page.tsx (Home)
├── ChakraProvider (UI theme context)
│   ├── ToastContainer (notifications)
│   └── ChatWindow (main app shell)
│       ├── LLM Selector (model switching)
│       ├── EmptyState (suggestion boxes)
│       ├── ChatMessageBubble[] (conversation history)
│       ├── SourceBubble (citations)
│       ├── AutoResizeTextarea (input)
│       └── InlineCitation (references)
```

## Documentation

- `docs/friggs_gate_frontend_guide.md` - Comprehensive frontend architecture guide
- `docs/bifrost_api_contract.md` - Backend API specification
- `docs/repository-specification.md` - Project specifications
- `UI-PANEL-REDESIGN.md` - UI design documentation

## Contributing

Please read `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## License

See `LICENSE` file for details.

---

*Frigg's Gate serves as the mythical bridge between human intent and structured intelligence, enabling seamless interaction with the Life Nervous System's cognitive architecture.*