# 🚪 Frigg's Gate – Life Nervous System Frontend

> **Status**: ✅ Development Ready: Complete · 🎯 Production Integration Phase · 🧠 Agent Ready · 🔄 Active Development

**Agent-optimized frontend interface** to the Life Nervous System (LNS) with Next.js architecture and structured workspace coordination. **Pointer-based documentation** - follow references rather than duplicating implementation details.

---

## 1. 🎯 Purpose

Web-based cognitive interface providing structured input/output workspace for LNS interaction. Features real-time streaming, citation tracking, and multi-panel workspace coordination for agent-driven workflows.

**Start with**: `yarn dev` then open [http://localhost:3000](http://localhost:3000).

---

## 2. 🧠 Architecture Summary

### Core Systems
- **Chat Interface**: `app/components/ChatWindow.tsx` - Primary user interaction orchestration
- **Workspace Coordination**: Structured input panels, output dock, resizable layout system  
- **State Management**: Zustand-based persistent user preferences + session workspace state
- **Backend Integration**: API communication with 🌀 Bifröst cognitive orchestration engine

### Structure
- **`/app/`**: Next.js 13 App Router architecture (components, hooks, services, utils)
- **`/docs/`**: Agent-optimized development guides and mental models
- **`/public/`**: Static assets and branding

### Quality
- **Agent-Ready**: Complete mental model documentation for rapid agent onboarding
- **Production Architecture**: Next.js 13.5.4, TypeScript 5.1.6, Tailwind CSS 3.3.3
- **Security Hardened**: DOMPurify XSS protection, CSP headers, input validation
- **Performance Optimized**: SSR, code splitting, streaming responses

---

## 3. 📚 Documentation

- **README.md**: Agent-optimized navigation hub (this file)
- **docs/mental-model.md**: Complete development guide with behavior-first editing approach

---

## 4. 🚀 Quick Start

**Environment**: Requires Node.js and Yarn

```bash
# Install dependencies
yarn install

# Development server
yarn dev

# Production build
yarn build && yarn start
```

---

## 5. 🔑 Key Entry Points

| Purpose | File |
|---------|------|
| **Master Controller** | **`app/components/ChatWindow.tsx`** (Primary interface orchestration) |
| **Structured Input** | **`app/components/StructuredInput.tsx`** (Left panel forms) |
| **Output Display** | **`app/components/StructuredOutputDock.tsx`** (Right panel results) |
| **State Management** | **`app/hooks/useFriggState.ts`** (Persistent preferences) |
| **Workspace Logic** | **`app/hooks/useWorkspaceCoordinator.ts`** (Dynamic session state) |
| **Backend Integration** | **`app/services/responseInterpreter.ts`** (Intelligence bridge) |
| **Global Styles** | **`app/globals.css`** (Foundation styling) |
| Configuration | `package.json`, `tailwind.config.ts`, `next.config.js` |

---

## 6. 📁 Directory Map

```
FRIGGS-GATE/ (LNS Frontend)
├── app/                           # Next.js App Router
│   ├── components/                # UI building blocks
│   │   ├── ChatWindow.tsx         # Master interface controller
│   │   ├── StructuredInput.tsx    # Left panel workspace forms
│   │   ├── StructuredOutputDock.tsx  # Right panel results display
│   │   ├── ChatMessageBubble.tsx  # Individual message rendering
│   │   └── [theme, input, citation components]
│   ├── hooks/                     # State management
│   │   ├── useFriggState.ts       # Persistent user preferences
│   │   └── useWorkspaceCoordinator.ts  # Dynamic workspace state
│   ├── services/                  # Business logic
│   │   └── responseInterpreter.ts # Backend intelligence bridge
│   ├── utils/                     # Shared utilities
│   ├── globals.css                # Foundation styles
│   ├── layout.tsx                 # Root layout + providers
│   └── page.tsx                   # Entry point (renders ChatWindow)
├── docs/                          # Agent development guides
│   └── mental-model.md            # Complete editing roadmap
├── public/                        # Static assets
└── [config files]                 # Next.js, Tailwind, TypeScript
```

---

## 7. 🤖 Agent Implementation Guidelines

- **Master Controller**: Use `ChatWindow.tsx` for conversation orchestration and API communication
- **Workspace Panels**: Extend `StructuredInput.tsx` for new tools, `StructuredOutputDock.tsx` for results
- **State Management**: Use `useFriggState` for persistent settings, `useWorkspaceCoordinator` for session state
- **Styling**: Tailwind utility classes only (no separate CSS files)
- **Mental Model**: See `docs/mental-model.md` for behavior-first editing approach

---

## 8. 🌐 Backend Integration

**API Endpoint**: `POST http://localhost:8000/ask/invoke`

**Payload Structure**:
```json
{
  "input": {
    "version": "1.0", 
    "question": "user question",
    "chat_history": [],
    "metadata": { "caller": "frontend_app" }
  }
}
```

**Intelligence Bridge**: `responseInterpreter.ts` translates backend responses into UI actions and workspace coordination.

---

## 9. 🔧 Development Commands

| Command | Purpose |
|---------|---------|
| `yarn dev` | Development server (port 3000) |
| `yarn build` | Production build |
| `yarn lint` | ESLint validation |
| `yarn format` | Prettier code formatting |