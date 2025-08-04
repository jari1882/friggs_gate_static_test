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
1
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

### Agent Activation System
The backend operates using specialized agents (called "Cyphers") that understand different domains:

**Quick Quote Agent**: Handles questions about life insurance pricing. When activated, it can process requests about coverage amounts, premium calculations, and policy options. The frontend detects this agent through keywords like "quote", "insurance", and "coverage" in the response.

**Life Expectancy Agent**: Manages actuarial analysis and insurance illustrations. It responds to questions about mortality calculations, health factors, and risk assessment. The frontend identifies this agent through phrases containing "life expectancy" or "illustration".

**Underwriter Educator**: Provides guidance on risk assessment and underwriting principles. This agent helps explain insurance concepts, regulations, and best practices.

**System Information Agent**: Responds to questions about Frigg's Gate itself and the Life Nervous System architecture. It provides help and documentation.

### Coordination Flow
Here's how the intelligence coordination actually works:

**Request Analysis**: When your message reaches the backend, it analyzes the content to determine intent. Questions about "getting a quote for life insurance" would trigger the Quick Quote Agent. Questions about "life expectancy for a 45-year-old" would activate the Life Expectancy Agent.

**Response Generation**: The activated agent generates a response that includes both conversational content (the actual answer) and implicit signals. These signals are embedded in the response text - not as separate metadata fields, but as natural language that the frontend can detect.

**Frontend Detection**: When the response comes back, the ResponseInterpreter scans the text for agent activation patterns. It's looking for specific combinations of words that indicate which tools should be available.

**UI Adaptation**: Based on the detected agents, the frontend automatically adjusts the interface. If a quote agent was detected, the structured input panel slides out with the Quick Quote form pre-selected. The user can then fill out the form to get specific results.

**The Gap**: Currently, there's a disconnect between the conversation and the structured tools. The conversation can trigger tool activation, but the tools generate their own placeholder results rather than sending data back to the backend. This suggests the system is designed for future integration where structured forms can enhance or continue the conversation.

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

---

*This mental model focuses on system architecture and component relationships. For user-facing documentation and setup instructions, see README.md.*