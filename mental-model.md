# Frigg's Gate System Architecture: A Technical Mental Model

This document provides a behind-the-scenes overview of how the Frigg's Gate codebase is structured and how its components work together. It's designed for developers, code reviewers, and contributors who need to understand the system architecture without diving into implementation details.

Think of this as a technical blueprint that shows you what each part does and how the pieces connect.

## The Big Picture: Dispatch and Coordination System

Frigg's Gate operates like a sophisticated **dispatch and coordination system**—similar to a 911 emergency center that receives requests, determines what resources are needed, coordinates multiple specialized responders, and manages communication flows.

The system has three main operational layers:
- **Frontend Coordination Layer**: Manages user interface state and component orchestration
- **Communication Layer**: Handles message routing and API communication  
- **Backend Intelligence Layer**: Processes requests using specialized agents and returns structured responses

## Frontend Architecture: Component Coordination

### Core Orchestration (`ChatWindow.tsx`)

The `ChatWindow` component is the **primary traffic controller** for the entire application. Here's what it actually does:

**Message Management**: It maintains an array of message objects, each with an ID, content, role (user/assistant), and optional metadata like run IDs and sources. When you send a message, it immediately adds your message to this array and sets a loading state.

**API Communication**: When you submit a message, ChatWindow builds a structured payload containing your question, chat history, metadata about the caller, session info with user ID and conversation ID, and streaming preferences. It sends this to the backend's `/ask/invoke` endpoint and handles the response.

**Response Processing**: Here's where it gets interesting - when the backend responds, ChatWindow doesn't just display the message. It passes the response to a `ResponseInterpreter` that analyzes the content for signals about which UI components should activate. If the response mentions insurance quotes, panels slide out automatically.

**State Coordination**: ChatWindow pulls from two different state stores and coordinates between them. It reads theme preferences from `useFriggState` and workspace behavior from `useWorkspaceCoordinator`. When the backend indicates a tool should activate, ChatWindow triggers the workspace coordinator to show the appropriate panels.

**Real-time Updates**: The component supports streaming responses, updating the UI as content arrives from the backend rather than waiting for completion. It also handles error states, retries, and provides user feedback through toast notifications.

This isn't just a chat interface - it's the coordination hub that connects user input, backend intelligence, state management, and dynamic UI behavior.

### State Management: Dual-System Architecture

The frontend splits state management into two specialized stores that handle different types of data:

#### Global System State (`useFriggState.ts`)
This store handles **persistent user preferences** that should survive across sessions:

**Layout Control**: It tracks exact pixel widths for resizable panels (like `structuredInputWidth: 300`), whether panels are minimized, and which panels should be open by default. When you resize a panel, this store remembers that setting.

**Theme Management**: It stores the current theme (light/dark mode) and font selection. When you switch themes, it updates a `isDarkMode` boolean that triggers CSS class changes throughout the app. Font changes update the document's font-family style directly.

**Memory System**: It maintains an array of conversation memories like `['Conversation 1 - 10/31', 'Conversation 2 - Today']` and tracks which one is currently selected. This is designed for future session management features.

#### Workspace State (`useWorkspaceCoordinator.ts`)  
This store manages **dynamic behavior** that changes based on what's happening in the current session:

**Panel Activation Logic**: It tracks which panels should be minimized (`isStructuredInputMinimized: true` by default) and what tool is currently selected (`selectedTool: 'QuickQuote' | 'LifeExpectancy' | null`). When the backend signals that a tool should activate, this store updates these flags.

**Content Management**: It holds the actual content for the structured output panel in `structuredOutputContent` and manages form validation messages. When tools generate results, this content gets updated.

**Backend Response Processing**: The key function here is `processBackendResponse()` which takes raw backend responses, runs them through the ResponseInterpreter, and executes the resulting UI actions. This is how backend intelligence drives frontend behavior.

**The Split Matters**: User preferences stay consistent while the workspace adapts. You can have your preferred theme and panel sizes while the system still dynamically shows different tools based on your conversation. The two stores communicate through the components that use both, but they handle fundamentally different concerns.

### Dynamic Interface Components

#### Left Panel: Structured Input System
The **StructuredInput** component is a complete form management system that changes based on context:

**Tool Selection**: The panel has a dropdown where you can manually select between "Quick Quote" and "Life Expectancy Calculator", but more importantly, the backend can automatically set this selection through the workspace coordinator when it detects what you're asking about.

**Form Management**: Each tool type loads a completely different form with its own state. The Quick Quote form manages `age`, `gender`, `smoker`, and `coverageAmount` fields. The Life Expectancy form tracks `age`, `gender`, `healthConditions`, `lifestyle`, and a checkbox for image generation. These are stored in separate state objects within the component.

**Validation Logic**: Each form has its own validation function. The Quick Quote validator checks that all required fields are filled. The Life Expectancy validator ensures age, gender, and lifestyle are provided (health conditions are optional). When validation fails, error messages appear in a red banner.

**Result Generation**: When you submit a valid form, it doesn't send data to the backend - instead, it immediately generates placeholder result text and tells the workspace coordinator to open the structured output panel with that content. This creates the appearance of processing without actual backend communication.

**Physical Behavior**: The panel can be resized by dragging the right edge, minimized to a 12-pixel-wide strip with just a toggle button, or hidden entirely. Resize boundaries are enforced to prevent the panel from taking over the entire screen.

#### Right Panel: Structured Output Display
The **StructuredOutputDock** is much simpler but serves as the results display:

**Content Display**: It shows whatever text content is stored in `structuredOutputContent` from the workspace coordinator. This content is formatted as plain text with line breaks preserved.

**Panel Behavior**: Like the input panel, it can be resized (by dragging the left edge), minimized, or hidden. It only appears when the workspace coordinator indicates there's content to show.

**Future-Ready**: The component is designed to handle rich content, charts, or interactive results, but currently just displays formatted text.

#### Message Processing Pipeline
The conversation area handles messages through several layers:

**ChatMessageBubble Rendering**: Each message object gets rendered with role-based styling (user messages vs assistant responses), timestamps, and unique IDs. Assistant messages support rich formatting through marked.js parsing.

**Citation Processing**: When backend responses include citations (referenced as `[1]`, `[2]`, etc.), the system extracts source information and renders inline citation links. Hovering over citations highlights the corresponding source bubble below the message.

**Content Security**: All user-generated and backend content runs through DOMPurify before rendering to prevent XSS attacks while preserving formatting like code blocks and lists.

**Real-time Streaming**: As backend responses arrive, the message content updates in real-time. The system tracks whether a message is complete to show loading indicators appropriately.

## Communication Layer: Request/Response Coordination

### API Integration Architecture

The communication between frontend and backend follows a specific protocol:

#### Request Processing (`sendMessage` function in ChatWindow)
When you send a message, here's exactly what happens:

**Payload Construction**: The system builds a structured JSON object with your question, complete chat history as an array of human/AI message pairs, metadata including caller identification and timestamp, session information with a user ID and conversation ID, and streaming preferences (currently disabled).

**API Call**: The request goes to `http://localhost:8000/ask/invoke` (or whatever `apiBaseUrl` is set to) as a POST request with the full payload. The system waits for the response rather than streaming.

**Error Handling**: If the request fails (network error, server error, etc.), the system removes the user's message from the chat, displays an error message to the user, and restores their input so they can try again.

**Response Processing**: When a successful response comes back, the system extracts the `answer` field from `data.output.answer`, parses it through marked.js for formatting, and adds it to the message array. It also saves the conversation to chat history for context in future requests.

#### Backend Response Interpretation (`responseInterpreter.ts`)
This component is the **intelligence bridge** between backend responses and UI behavior:

**Content Analysis**: The ResponseInterpreter looks for specific keywords and phrases in the backend's response text. If it finds words like "quote" + "insurance" or "life expectancy" + "illustration", it flags those as agent activations.

**Action Mapping**: Each detected agent gets mapped to a specific UI action. The "quick-quote-agent" maps to opening the structured input panel with the QuickQuote tool selected. The "life-insurance-illustration-agent" maps to opening the LifeExpectancy tool.

**State Updates**: The interpreter generates action objects that the workspace coordinator can execute. These actions directly update the workspace state to show appropriate panels and select tools.

**Extensibility**: New backend agents can be added by updating the agent detection patterns and action mappings without changing any UI components. The translation layer handles all the coordination.

The key insight is that the backend response doesn't just contain an answer - it contains signals about what the frontend should do next.

## Backend Integration: Intelligence Coordination

### Coordination Flow
Here's how the intelligence coordination actually works:

**Request Analysis**: When your message reaches the backend, it processes the content and generates an appropriate response.

**Response Generation**: The backend generates responses that may include implicit signals about which UI tools should be available, embedded naturally in the response content.

**Frontend Detection**: When the response comes back, the ResponseInterpreter scans the text for UI activation patterns and determines which tools should be shown.

**UI Adaptation**: Based on the detected patterns, the frontend automatically adjusts the interface to show relevant tools and panels.

**Current State**: The conversation can trigger tool activation, but the tools generate their own results rather than integrating back with the backend. This suggests the system is designed for future integration where structured forms can enhance the conversation flow.

## Data Flow Architecture

### Request Flow
```
User Input → ChatWindow → API Request → Backend Agents → Response Processing
```

### Response Flow  
```
Backend Response → ResponseInterpreter → WorkspaceCoordinator → UI Updates
```

### State Synchronization
```
User Actions → Multiple State Stores → Component Re-renders → UI Updates
```

## Information Flow Categories

The system operates through five distinct information flow channels that coordinate between frontend and backend:

### 🟡 1. User Input Events (frontend → backend)
**Purpose**: Tells the backend what the user just did.

**Includes**:
- Chat input ("How much is coverage for 77005?")
- Button presses ("Next", "Edit", "Start over") 
- Form submissions (`{ zip_code: "77005" }`)
- Interaction metadata (`clicked_on: "QuoteCard"`)
- Slash commands (`/submit`, `/edit step 3`)

**Backend uses these to**:
- Parse for meaning (via deterministic logic or mini-agent)
- Advance flows
- Trigger LLM responses or wizard state

### 🟢 2. Client Context Snapshot (frontend → backend)
**Purpose**: Tells the backend where the user is in the interface and flow.

**Includes**:
- Current flow mode: "chat", "wizard", "form"
- UI anchors: Which panel or step is active
- Viewport/scroll state (optional)
- Client fingerprint / session ID
- Quote ID or interaction ID (thread-local state)

**Backend uses these to**:
- Route correctly
- Rehydrate state
- Personalize LLM prompts with current status

### 🧠 3. LLM Streaming Output + Control Directives (backend → frontend)
**Purpose**: The primary payload from backend. The stream that drives the UI.

**Includes**:
- Streamed markdown / plain text messages
- Inline render tokens (`<<start:QuoteCard>>`)
- Embedded form schemas
- `openPanel`, `setFocus`, `highlightElement`, etc.
- Chat card instructions, editable summaries, modals
- Expected next input state (`expecting: zip_code`)

**This is the "switchboard instruction stream"** — the full set of levers the frontend responds to in real time.

### 📟 4. Post-Stream UI Control Envelope (backend → frontend)
**Purpose**: Wrap-up instructions after the LLM stream completes.

**Includes**:
- Follow-up UI actions (e.g. open wizard step, transition state)
- Set focus, scroll to a step, enable a button
- `expecting: zip_code` or other hints for structured UI to prepare
- Mini-agent hints (backend internal)

**This is the "finalization layer"** — a second phase of UI control after the stream completes.

### 📊 5. Analytics / Telemetry (optional) (frontend → backend or logs)
**Purpose**: Insight into usage, not needed for UX logic.

**Includes**:
- Time spent on steps
- Which buttons users clicked
- Errors or drop-offs

### Hybrid Control Pattern

The system implements **bi-directional, dual-authority control** where both user and backend can control UI elements:

| Actor | Can initiate open/close? | Example |
|-------|-------------------------|---------|
| User | ✅ yes | User clicks a tab, toggles form on left |
| Backend | ✅ yes | Backend says: "Time to collect zip code" |

**Core Rules**:
- If user opens panel manually → frontend notifies backend (optional)
- If backend instructs to open panel → frontend obeys
- If user closes panel manually → state remembered temporarily, but doesn't override future backend requests

**The Switchboard** consists of categories 3 and 4 — these are the channels through which the backend controls the frontend UI behavior.

## Key Technical Patterns

### Separation of Concerns
- **Presentation logic**: Handled by individual components
- **State management**: Centralized in Zustand stores  
- **Business logic**: Delegated to backend agents
- **Coordination logic**: Managed by specialized coordinator components

### Dynamic Adaptation
- **Context-sensitive UI**: Interface adapts based on backend intelligence
- **Progressive disclosure**: Only show tools and options when relevant
- **Stateful coordination**: System remembers context across interactions

### Extensibility Design
- **Agent mapping**: New backend agents can be added without changing core frontend code
- **Component modularity**: UI components can be independently developed and integrated
- **State isolation**: Different concerns are managed by separate state systems

## Critical Dependencies and Integration Points

### External Dependencies
- **Next.js framework**: Provides app structure, routing, and server-side capabilities
- **Chakra UI**: Component library for consistent UI elements
- **Zustand**: State management for both global and workspace state
- **DOMPurify**: Security layer for rendering user-generated content

### Internal Integration Points
- **State synchronization** between `useFriggState` and `useWorkspaceCoordinator`
- **Message processing** coordination between `ChatWindow` and `ResponseInterpreter`  
- **Panel management** coordination between workspace state and layout components
- **API communication** between frontend requests and backend agent responses

## For Developers and Code Reviewers

Understanding this architecture helps with:

### Making Changes
- **UI modifications**: Focus on individual components, knowing how they integrate with state systems
- **New features**: Understand which state system manages different types of functionality  
- **Backend integration**: Use the ResponseInterpreter pattern for new agent types
- **Layout changes**: Work with the dual-panel system and workspace coordination

### Code Organization
- **Component hierarchy**: ChatWindow orchestrates, specialized components handle specific concerns
- **State management**: Two stores with clear separation of concerns
- **API integration**: Centralized in ChatWindow with interpretation layer for responses
- **Dynamic behavior**: Coordinated through workspace state and response interpretation

This system is designed to be **intelligent and adaptive** while maintaining **clear separation between different types of functionality**. The key insight is that the frontend doesn't just display information—it actively coordinates between user input, backend intelligence, and dynamic interface adaptation.

## Visual Architecture: Component Rendering and Layout Hierarchy

The Frigg's Gate interface follows a **layered rendering system** where components are drawn in a specific order, with ChatWindow serving as the foundational layer that subsequent components overlay upon.

### Foundation Layer: Page Structure (`page.tsx` → `layout.tsx`)

The rendering begins at the **root level** with Next.js's layout system:

**Root Layout (`layout.tsx`)**: Establishes the foundational HTML structure with `h-full` classes that ensure the entire viewport is utilized. The body contains a single flex column container with a white background that serves as the canvas for all subsequent components.

**Home Page (`page.tsx`)**: Creates the primary application container through a ChakraProvider wrapper that enables UI component theming. The key structure is a `h-screen overflow-hidden` div that prevents any scrolling at the page level—all scrolling is handled by individual components.

**Component Instantiation**: The page creates a unique `conversationId` and passes it to ChatWindow, making ChatWindow the **sole child component** of the page level. This means ChatWindow is responsible for rendering the entire interface.

### Primary Layer: ChatWindow Foundation

ChatWindow operates as the **master layout controller** and is drawn first as the background layer:

**Container Structure**: The component renders as a `flex flex-col h-screen` container that spans the full viewport height. This creates a vertical layout with a fixed header and flexible content area. The entire container has theme-aware background colors and smooth transitions.

**Header Strip**: A `flex-shrink-0` header section is drawn first, containing the "Frigg's Gate" title, theme controls (FontSelector, ThemeToggle), and the MemorySlider. This header has a fixed height and sits at the top of the screen with a bottom border.

**Main Content Container**: Below the header, a `flex flex-row flex-1 min-h-0` container is created. This is the **primary workspace** where all dynamic content renders. The flex-row layout creates three horizontal zones for left panel, center chat, and right panel.

### Panel Layer System: Dynamic Overlays

Within the main content container, components render in a **left-to-right, priority-based order**:

#### Left Panel: StructuredInput
**Rendering Logic**: The StructuredInput component is **always rendered first** in the flex-row layout, giving it the leftmost position. Its rendering behavior depends on the minimization state:

- **Expanded State**: Renders as a flexible-width panel (default 300px) with `flex-shrink-0` to prevent compression. The panel includes a right-edge resize handle that overlays the panel content.
- **Minimized State**: Renders as a fixed 12px-wide strip with only a toggle button visible. The minimized panel maintains its position but yields space to the chat area.

**Physical Boundaries**: The panel enforces minimum (200px) and maximum (60% of screen width) constraints through resize logic. A right border and shadow create visual separation from the chat area.

#### Center Area: Main Chat Interface
**Positioning Logic**: The chat area uses `flex-1` to consume all available space between the left and right panels. As panels minimize or expand, the chat area automatically adjusts its width while maintaining a minimum 200px width for readability.

**Content Rendering**: Within the chat area, three sub-layers render vertically:
1. **Question Header**: A centered title asking "What can the Life Nervous System Help You With?"
2. **Message Container**: A `flex flex-col-reverse` scrollable area where messages render from bottom to top
3. **Input Area**: A fixed-height input section with the textarea and send button

**Dynamic Adaptation**: When the calculated width drops below 200px (due to panel expansion), the entire chat content hides and is replaced with a minimization message.

#### Right Panel: StructuredOutputDock  
**Conditional Rendering**: Unlike the left panel, the StructuredOutputDock only renders when `isStructuredOutputOpen || !isStructuredOutputMinimized` evaluates to true. When these conditions aren't met, the component returns `null` and doesn't affect the layout.

**Overlay Behavior**: When active, it renders as the rightmost element with `flex-shrink-0` positioning. Like the left panel, it has expanded (flexible width) and minimized (12px strip) states with similar resize handles and boundaries.

### Z-Index and Overlay Hierarchy

The system uses **positional flow rather than z-index stacking** for most layouts, but specific elements have overlay behavior:

**Resize Handles**: Both panels include `absolute` positioned resize handles (`top-0 right-0` for left panel, `top-0 left-0` for right panel) that overlay their respective panel content. These handles have hover states and cursor changes.

**Toast Notifications**: The ToastContainer (from react-toastify) renders at the ChakraProvider level, making it appear above all other content with its own z-index system.

**Dropdown Overlays**: Form dropdowns and theme selectors use Chakra UI's built-in portal system to render above other content when opened.

### Responsive Layout Logic

The layout system implements **progressive disclosure** based on available space:

**Panel Interaction**: When both panels are expanded and consume too much horizontal space, the center chat area triggers its "insufficient width" state and displays a message encouraging panel minimization.

**Automatic Adjustments**: The `useResizeObserver` effect in ChatWindow continuously monitors the main chat area width and updates components accordingly. This ensures the interface remains functional regardless of panel states.

**Animation Coordination**: All panel state changes include `transition-colors duration-200` classes for smooth visual transitions. Panel resize operations are handled through direct style width updates for performance.

### Component Rendering Order and Dependencies

The actual rendering sequence follows this pattern:

1. **Next.js Layout System** establishes viewport containers
2. **ChakraProvider** wraps the component tree for theme support  
3. **ChatWindow** renders as the foundational layout controller
4. **Header Components** (title, controls, memory slider) render first within ChatWindow
5. **Left Panel** renders first in the main content flex-row container
6. **Chat Area** renders second and consumes remaining horizontal space
7. **Right Panel** renders conditionally as the final element
8. **Overlay Elements** (resize handles, toasts) render above their parent components

### Layout State Management

The visual architecture coordinates with two state systems:

**Persistent Layout State (`useFriggState`)**: Manages panel widths, minimization preferences, and theme settings that survive across sessions. These states directly control component rendering and styling.

**Dynamic Workspace State (`useWorkspaceCoordinator`)**: Controls conditional rendering of panels and their content based on backend intelligence signals. This state determines when panels appear and what tools they display.

The **key architectural insight** is that ChatWindow serves as both the **visual foundation** and the **coordination hub**—it doesn't just display content, it orchestrates the entire interface layout while maintaining responsive behavior and smooth transitions between different panel configurations.

---

*This mental model focuses on system architecture and component relationships. For user-facing documentation and setup instructions, see README.md.*