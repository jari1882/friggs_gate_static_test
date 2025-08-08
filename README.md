# 🚪 Frigg's Gate – Life Nervous System Frontend

> **Status**: ✅ Production Ready · 🔄 WebSocket Integration Active · 🧠 Agent Optimized

**Agent-optimized frontend** for LNS with dynamic panels and WebSocket backend integration.

**Start**: `yarn dev` → `localhost:3000`

---

## 🗂️ File Structure

```
app/
├── components/ChatWindow.tsx          # Master orchestrator - ALL UI flows
├── hooks/useWebSocket.ts              # WebSocket communication + auto-reconnect  
├── hooks/useFriggState.ts             # Persistent state (localStorage)
├── hooks/useWorkspaceCoordinator.ts   # Session state (memory)
├── services/responseInterpreter.ts   # Backend signals → UI actions
├── components/StructuredInput.tsx     # Left panel forms
├── components/StructuredOutputDock.tsx # Right panel results
└── types/workspace.ts                 # TypeScript definitions
```

---

## 🔄 Quick Actions

| Task | File | Function/Location |
|------|------|------------------|
| Chat behavior | `ChatWindow.tsx` | `sendMessage()` line 129 |
| WebSocket logic | `useWebSocket.ts` | `connect()`, `sendMessage()` |
| Add form tool | `StructuredInput.tsx` | `ToolType` union, `toolComponents` |
| Panel display | `StructuredOutputDock.tsx` | Content rendering JSX |
| Persistent settings | `useFriggState.ts` | Interface + actions |
| Session state | `useWorkspaceCoordinator.ts` | WorkspaceState interface |
| Backend signals | `responseInterpreter.ts` | `detectAgentsFromContent()` |
| Styling | Individual components | Tailwind `className` |

---

## 🔌 WebSocket Integration

**Endpoint**: `ws://localhost:8001/ws` (env: `NEXT_PUBLIC_WS_BASE_URL`)

**Message Format**:
```typescript
{
  question: string,
  chat_history: Array<{human: string, ai: string}>,
  metadata: { caller: "frontend_app", purpose: "chat_request", timestamp: ISO },
  session: { user_id: string, context: { conversation_id: UUID, llm: string }},
  stream: boolean
}
```

**Response Format**:
```typescript
{
  status: 'success' | 'error',
  output?: { answer: string, run_id?: string, agent?: string },
  message?: string
}
```

**Connection**: Auto-connect, auto-reconnect (5 attempts, 3s delay)

---

## 🧠 State Architecture

```
useFriggState.ts (Persistent - localStorage)     useWorkspaceCoordinator.ts (Session - memory)
├── Panel widths/positions                        ├── Current tool selection
├── Theme settings                                ├── Panel visibility  
└── User preferences                              └── Dynamic content
```

**Flow**: User Action → Store Update → Component Re-render → WebSocket Response → ResponseInterpreter → UI Update

---

## 🎨 Component Hierarchy

```
ChatWindow (Master)
├── Header (title, theme controls)
├── StructuredInput (Left panel - conditional)
├── Chat Area (Messages + input)
└── StructuredOutputDock (Right panel - conditional)
```

---

## ⚙️ Configuration

**Tech Stack**: Next.js 13.5.4, React 18.2.0, TypeScript 5.1.6, Tailwind 3.3.3, Zustand

**Environment**: `NEXT_PUBLIC_WS_BASE_URL=ws://localhost:8001`

**Scripts**: `yarn dev`, `yarn build`, `yarn start`

---

## ⚠️ Constraints

- **WebSocket only** - no REST API calls
- **ChatWindow orchestrates** - don't bypass
- **useWebSocket hook** - don't create direct connections  
- **Tailwind styling** - no separate CSS files
- **TypeScript strict mode** - required
- **DOMPurify** - required for user content
- **Two-store state** - persistent vs session separation

---

## 📚 Documentation

- **docs/mental-model.md** - Conceptual understanding
- **docs/installation-guide.md** - Setup instructions  
- **docs/frontend-guide.md** - Technical deep dive