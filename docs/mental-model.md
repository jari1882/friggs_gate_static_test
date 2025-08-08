# 🧠 Frigg's Gate Mental Model: How to Think About the System

This document provides the conceptual frameworks and thinking patterns you need to understand and work with Frigg's Gate effectively. It connects high-level concepts to actual code locations so you know both HOW to think about changes and WHERE to implement them.

---

## 🎯 Core Mental Model: Dispatch and Coordination System

Think of Frigg's Gate as a **sophisticated 911 dispatch center** that receives requests, determines what resources are needed, coordinates multiple specialized responders, and manages real-time communication flows.

### The Dispatch Center: `app/components/ChatWindow.tsx`
This is your **primary traffic controller**. Every user action, backend response, and UI state change flows through here. When you need to understand "what happens when...", start at ChatWindow.

**Mental Pattern**: If you're lost, trace back to ChatWindow. It's the conductor of the orchestra.

---

## 🔄 The Dual Radio System: State Management

The system operates two completely separate "radio systems" that handle different types of information:

### 📻 Radio System 1: `app/hooks/useFriggState.ts` (The Persistent Channel)
**Think of this as**: Your personal settings radio that remembers everything across sessions
- **What lives here**: Panel sizes, theme preferences, font choices, layout preferences
- **Mental pattern**: "Will the user want this remembered next time they open the app?"
- **Storage**: localStorage (survives browser restarts)

### 📻 Radio System 2: `app/hooks/useWorkspaceCoordinator.ts` (The Dynamic Channel)  
**Think of this as**: The active work session radio that changes based on what's happening now
- **What lives here**: Current tool selection, panel visibility, dynamic content, workspace behavior
- **Mental pattern**: "Does this change based on the current conversation or task?"
- **Storage**: Memory only (resets each session)

**Key Insight**: Never mix these channels. User preferences stay persistent, dynamic workspace behavior stays in memory.

---

## 🌐 Real-Time Intelligence Bridge: WebSocket Communication

### The Communication Hub: `app/hooks/useWebSocket.ts`
**Think of this as**: A smart phone system that automatically reconnects when calls drop
- **Pattern**: Always goes through this hook, never create direct WebSocket connections
- **Behavior**: Auto-connects, auto-reconnects (5 attempts, 3-second delays)
- **Mental model**: Treat it like a resilient communication channel, not a fragile connection

### The Translator: `app/services/responseInterpreter.ts`
**Think of this as**: A dispatcher who listens to backend radio chatter and decides what UI teams to activate
- **Pattern**: Backend says "I detected insurance interest" → Translator says "Open QuickQuote panel"
- **Location**: This is where you add new intelligence patterns without touching UI code

**Mental Pattern**: Backend signals → Interpreter → UI actions. Don't bypass the interpreter.

---

## 🎭 The Panel Theater System

Think of the interface as a **theater with three stages** that can be shown, hidden, or resized based on the performance needs:

### Left Stage: `app/components/StructuredInput.tsx`
**Mental model**: The **preparation area** where users get ready to provide structured information
- **Always present** but can minimize to a thin strip
- **Behavior**: Changes tools based on what the conversation suggests
- **Pattern**: "What does the user need to input based on what we're discussing?"

### Center Stage: `app/components/ChatWindow.tsx` (Chat Area)
**Mental model**: The **main performance space** where conversation happens
- **Always visible** unless squeezed out by panels
- **Responsive**: Shows drag indicators when too narrow
- **Pattern**: This is the primary interaction space—protect it

### Right Stage: `app/components/StructuredOutputDock.tsx`
**Mental model**: The **results display area** that appears when there's something to show
- **Conditional presence**: Only appears when there's content to display
- **Pattern**: "Do we have results, calculations, or outputs to show?"

**Key Theater Rule**: The center stage (chat) is sacred—if it gets too narrow, the whole experience breaks down.

---

## 📡 Information Flow Patterns

Think of the system as having **5 distinct information radio frequencies**:

### 🟡 Frequency 1: User Input Events (`ChatWindow.tsx` → WebSocket)
**What travels**: Chat messages, button clicks, form submissions
**Mental pattern**: "What did the user just do?"

### 🟢 Frequency 2: Context Snapshots (`ChatWindow.tsx` → WebSocket)
**What travels**: Where the user is in the interface, what's currently selected
**Mental pattern**: "Where is the user right now in their journey?"

### 🧠 Frequency 3: Intelligence Stream (WebSocket → `ResponseInterpreter` → UI)
**What travels**: AI responses, UI control instructions, panel activation signals
**Mental pattern**: "What should the interface do based on the AI's understanding?"

### 📟 Frequency 4: Connection Status (`useWebSocket.ts` → UI Components)
**What travels**: Connected/disconnected states, error conditions
**Mental pattern**: "Is the communication channel healthy?"

### 📊 Frequency 5: State Synchronization (Stores → Components)
**What travels**: UI state changes, preference updates
**Mental pattern**: "What UI elements need to update based on state changes?"

---

## 🎯 Behavior-First Thinking: The 7 UI Behaviors

When you want to change something, think in terms of **behavior types** first, then find the responsible code:

### 💬 Conversation Behavior
**What it handles**: Message flow, chat history, input processing
**Where it lives**: `ChatWindow.tsx`
**Mental pattern**: "How do messages move through the system?"

### 🎛️ UI State Behavior  
**What it handles**: Panel positions, theme changes, persistent preferences
**Where it lives**: `useFriggState.ts` + components
**Mental pattern**: "What should the interface remember about how the user likes things?"

### 📝 Forms & Input Behavior
**What it handles**: Structured data entry, validation, tool selection
**Where it lives**: `StructuredInput.tsx`
**Mental pattern**: "How do we collect specific information from users?"

### 📤 Data Display Behavior
**What it handles**: Results presentation, content formatting, output rendering
**Where it lives**: `StructuredOutputDock.tsx`, `ChatMessageBubble.tsx`
**Mental pattern**: "How do we show information back to users?"

### 🧠 Intelligence Behavior
**What it handles**: AI signal interpretation, automatic UI responses
**Where it lives**: `responseInterpreter.ts`, `useWorkspaceCoordinator.ts`
**Mental pattern**: "How does the AI tell the UI what to do?"

### 🎨 Visual & Theme Behavior
**What it handles**: Appearance, animations, styling
**Where it lives**: Component styling, `globals.css`
**Mental pattern**: "How should things look and feel?"

### ⚙️ System Behavior
**What it handles**: Connections, performance, setup
**Where it lives**: `layout.tsx`, `page.tsx`, hooks
**Mental pattern**: "How does the underlying system stay healthy?"

---

## 🧭 Navigation Mental Maps

### "I want to change how users..."
- **...send messages** → Conversation behavior → `ChatWindow.tsx`
- **...customize appearance** → UI State behavior → `useFriggState.ts`
- **...fill out forms** → Forms & Input behavior → `StructuredInput.tsx`
- **...see results** → Data Display behavior → `StructuredOutputDock.tsx`
- **...get AI assistance** → Intelligence behavior → `responseInterpreter.ts`

### "I want to understand how..."
- **...the interface coordinates** → Study the dispatch center (`ChatWindow.tsx`)
- **...real-time communication works** → Follow the communication hub (`useWebSocket.ts`)
- **...backend signals drive UI** → Trace the intelligence bridge (`responseInterpreter.ts`)
- **...state stays synchronized** → Examine the dual radio system (both state hooks)

---

## 🔄 Change Impact Thinking

When making changes, think through these **ripple effects**:

### WebSocket Changes
- **Primary impact**: `useWebSocket.ts`
- **Secondary impact**: `ChatWindow.tsx` (message handling)
- **Tertiary impact**: Error handling throughout UI

### State Changes  
- **Persistent state**: Check what needs localStorage persistence
- **Session state**: Consider what resets between conversations
- **Cross-component**: Verify all components using the state update correctly

### Panel Changes
- **Layout impact**: How does this affect responsive behavior?
- **Content impact**: What gets displayed in the panel?
- **Coordination impact**: How do other panels need to react?

### Intelligence Changes
- **Pattern impact**: What new backend signals need detection?
- **UI impact**: What interface changes should result?
- **State impact**: What workspace coordination changes?

---

## 🎯 Golden Rules for Mental Navigation

1. **Start with behavior, find the location**: Think "what kind of change is this?" then locate the responsible code
2. **Follow the dispatch pattern**: When lost, trace back to ChatWindow
3. **Respect the dual radio system**: Persistent vs session state separation is sacred
4. **Use the intelligence bridge**: Backend signals flow through responseInterpreter
5. **Protect the center stage**: Chat area must remain functional and accessible
6. **Think in theater stages**: Left preparation, center interaction, right results
7. **Follow the communication hub**: WebSocket goes through useWebSocket hook only

---

*This mental model provides the thinking framework. For technical implementation details, see `docs/frontend-guide.md`. For setup instructions, see `docs/installation-guide.md`.*