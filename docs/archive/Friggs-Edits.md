# 🛠️ Frigg's Gate Development Guide: Where and How to Make Changes

This guide provides a practical roadmap for modifying the Frigg's Gate codebase. Think of it as your **GPS for development** - it tells you exactly which files to edit for different types of changes.

---

## 🎯 Quick Reference: Common Changes

| Want to Change... | Edit This File | Section/Function |
|-------------------|---------------|------------------|
| Chat UI behavior | `app/components/ChatWindow.tsx` | `sendMessage()`, JSX layout |
| Left panel forms | `app/components/StructuredInput.tsx` | Form state, validation |
| Right panel display | `app/components/StructuredOutputDock.tsx` | Content rendering |
| Global styles | `app/globals.css` | Any CSS rule |
| UI state management | `app/hooks/useFriggState.ts` | Store properties |
| Workspace logic | `app/hooks/useWorkspaceCoordinator.ts` | Tool coordination |
| Backend response handling | `app/services/responseInterpreter.ts` | Agent detection patterns |
| App-wide constants | `app/utils/constants.tsx` | Configuration values |
| Theme/font controls | `app/components/ThemeToggle.tsx` or `FontSelector.tsx` | Component logic |
| API communication | `app/components/ChatWindow.tsx` | `sendMessage()` function, payload structure |
| Backend intelligence signals | `app/services/responseInterpreter.ts` | `detectAgents()`, `mapAgentsToActions()` |
| Panel rendering order | `app/components/ChatWindow.tsx` | Main flex container JSX |
| Layout boundaries/constraints | Individual components | `useResizeObserver`, min/max width logic |
| Build/dev scripts | `package.json` | `scripts` section |
| Environment config | `.env.example` | Variable definitions |

---

## 📁 File Structure Mental Map

```
friggs-gate/
├── app/                          # All application code lives here
│   ├── components/              # UI building blocks
│   ├── hooks/                   # State management & custom logic  
│   ├── services/               # Business logic & API handling
│   ├── utils/                  # Shared utilities & constants
│   ├── globals.css            # Global styles (viewport, fonts, scrollbars)
│   ├── layout.tsx             # HTML scaffold & providers
│   └── page.tsx               # Entry point (renders ChatWindow)
├── docs/                        # Documentation & guides
├── public/                     # Static assets (favicon, images)  
└── [config files]             # Next.js, Tailwind, TypeScript setup
```

---

## 🧩 Component Editing Guide

### 🎪 ChatWindow.tsx - The Master Controller

**Location**: `app/components/ChatWindow.tsx`

**What it controls**: Everything you see in the app

**Common edits**:
- **Add new message handling**: Modify `sendMessage()` function around line 120
- **Change layout structure**: Edit the JSX return statement (bottom half of file)
- **Modify API calls**: Update the fetch request in `sendMessage()`
- **Add new panel**: Insert new component in the main flex container

**Key sections**:
```typescript
// Message state management
const [messages, setMessages] = useState<Message[]>([]);

// API communication  
const sendMessage = async (message: string) => {
  // Edit here for new backend interactions
};

// Layout JSX
return (
  <div className="flex flex-col h-screen">
    {/* Header */}
    {/* Main content with 3 columns */}
  </div>
);
```

### 🔧 StructuredInput.tsx - Left Panel Forms

**Location**: `app/components/StructuredInput.tsx`

**What it controls**: All form inputs and tool selection

**Common edits**:
- **Add new tool type**: Add to `ToolType` type and `toolComponents` object
- **Modify existing forms**: Edit `QuickQuoteForm` or `LifeExpectancyForm` components
- **Change validation**: Update validation functions for each tool
- **Add form fields**: Extend form state objects

**Key sections**:
```typescript
// Tool type definitions
type ToolType = 'QuickQuote' | 'LifeExpectancy';  // Add new tools here

// Form components
const QuickQuoteForm = () => {
  // Add new fields here
};

// Tool mapping
const toolComponents = {
  QuickQuote: QuickQuoteForm,
  LifeExpectancy: LifeExpectancyForm,
  // Add new tool components here
};

// Validation logic  
const validateQuickQuote = (data: QuickQuoteData) => {
  // Add validation rules here
};
```

**Physical Panel Behavior**:
- **Resizable**: Drag right edge to resize (200px min, 60% screen max)
- **Minimizable**: Click toggle to collapse to 12px-wide strip
- **Auto-focus**: When tool is selected, first input gets focus
- **Responsive**: Hides content when chat area gets too narrow

**Form State Pattern**:
Each tool manages its own form state separately - don't share state between different tools

### 📤 StructuredOutputDock.tsx - Right Panel Display

**Location**: `app/components/StructuredOutputDock.tsx`

**What it controls**: Results and output display

**Common edits**:
- **Change output formatting**: Modify the content rendering JSX
- **Add interactive elements**: Insert buttons, links, or other UI elements
- **Handle different content types**: Add conditional rendering based on content format

**Physical Panel Behavior**:
- **Conditional rendering**: Only appears when `isStructuredOutputOpen || !isStructuredOutputMinimized`
- **Resizable**: Drag left edge to resize (similar constraints to left panel)
- **Minimizable**: Collapses to 12px-wide strip on the right
- **Content source**: Displays `structuredOutputContent` from workspace coordinator

**Content Rendering**:
- Currently displays plain text with preserved line breaks
- Future-ready for rich content, charts, interactive results
- Content is set by form submissions or other UI actions

---

## 🗄️ State Management Editing Guide

### 🌐 useFriggState.ts - Persistent User Preferences

**Location**: `app/hooks/useFriggState.ts`

**What it stores**: Settings that survive browser sessions (uses localStorage)

**Common edits**:
- **Add new theme option**: Extend theme state and toggle logic
- **Save new user preference**: Add property to store interface
- **Modify panel width defaults**: Change initial width values
- **Add new persistent UI setting**: Extend interface and actions

**Key sections**:
```typescript
interface FriggState {
  // Add new persistent settings here
  isDarkMode: boolean;
  selectedFont: string;
  structuredInputWidth: number;  // Panel pixel widths
  isStructuredInputMinimized: boolean;  // Panel states
  // Add your new persistent state here
}

// Actions to modify state
const actions = {
  // Add new setter functions here
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setStructuredInputWidth: (width: number) => set({ structuredInputWidth: width }),
};
```

**What gets persisted**:
- Layout control (exact pixel widths for resizable panels)
- Theme management (light/dark mode, font selection)
- Panel minimization states
- User interface preferences

**What does NOT get persisted**: Tool selections, current conversations, temporary UI states

### ⚡ useWorkspaceCoordinator.ts - Dynamic Session Logic

**Location**: `app/hooks/useWorkspaceCoordinator.ts`  

**What it manages**: UI behavior that changes during conversations (NOT persisted)

**Common edits**:
- **Add new tool type**: Extend `selectedTool` type union
- **Modify panel activation**: Update panel visibility logic
- **Add content management**: Extend `structuredOutputContent` handling
- **Handle form validation**: Add new validation message types

**Key sections**:
```typescript
interface WorkspaceState {
  // Add new dynamic state properties
  selectedTool: 'QuickQuote' | 'LifeExpectancy' | null;  // Add your new tool here
  isStructuredInputMinimized: boolean;
  isStructuredOutputOpen: boolean;
  structuredOutputContent: string;  // What shows in right panel
}

// Actions for updating workspace
const actions = {
  setSelectedTool: (tool: SelectedTool) => set({ selectedTool: tool }),
  setStructuredOutputContent: (content: string) => set({ structuredOutputContent: content }),
};
```

**What this handles**:
- Panel activation logic (which panels are shown/hidden)
- Current tool selection (QuickQuote, LifeExpectancy, etc.)
- Structured output panel content
- Form validation states
- Session-specific UI behavior

**State Split Logic**: User preferences stay in `useFriggState`, dynamic workspace behavior stays here

---

## 🔄 Backend Integration Editing Guide

### 🧠 responseInterpreter.ts - Intelligence Bridge

**Location**: `app/services/responseInterpreter.ts`

**What it does**: Translates backend responses into UI actions

**Common edits**:
- **Add new agent detection**: Insert new keyword patterns
- **Map new UI actions**: Add action types and handlers
- **Modify existing patterns**: Update regex or keyword matching

**Key sections**:
```typescript
// Add new agent detection patterns
const detectAgents = (response: string) => {
  if (response.includes('new keyword')) {
    return ['new-agent'];
  }
};

// Map agents to UI actions
const mapAgentsToActions = (agents: string[]) => {
  if (agents.includes('new-agent')) {
    return [{ type: 'OPEN_NEW_PANEL' }];
  }
};
```

---

## 🎨 Styling and Visual Changes

### 🌍 globals.css - Foundation Styles

**Location**: `app/globals.css`

**What to edit here**:
- **Viewport setup**: Lines 7-21 (html, body, #__next)
- **Font imports**: Line 1 (Google Fonts URL)
- **Base element styles**: Lines 23-46 (inputs, links, paragraphs, etc.)
- **Custom scrollbars**: Lines 48-71 (scrollbar styling)

**Don't edit here**: Component-specific styles (use Tailwind classes instead)

### 🎭 Component Styling - Two-Layer System

Frigg's Gate uses a **minimal, utility-first approach** with just two styling layers:

| Layer | Purpose | Implementation |
|-------|---------|----------------|
| **Global Foundation** | Viewport setup, fonts, base elements | `app/globals.css` (72 lines) |
| **Component Styling** | All layout, positioning, appearance | Tailwind utility classes in JSX |

**Key Characteristics**:
- **No component-specific CSS files** - everything styled inline via Tailwind classes
- **No CSS-in-JS libraries** - pure Tailwind + minimal global CSS
- **Co-location** - styles live directly with components in `className` attributes

**Common patterns**:
```jsx
// Layout containers
<div className="flex flex-col h-screen">

// Panels with flex behavior
<div className="flex-shrink-0 border-r">

// Responsive text
<span className="text-sm text-gray-600 dark:text-gray-300">

// Interactive elements
<button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded">
```

**What NOT to do**:
- Create separate `.css` files for components
- Use CSS-in-JS solutions
- Add styles to `globals.css` (except for foundational elements)

---

## 📋 Configuration Files

### ⚙️ tailwind.config.ts - Styling Configuration

**Location**: `tailwind.config.ts`

**When to edit**:
- Adding custom colors, fonts, or spacing values
- Extending Tailwind's default theme
- Adding custom utility classes

### 📦 package.json - Dependencies & Scripts

**Location**: `package.json`

**When to edit**:
- Adding new npm packages
- Updating scripts or build commands
- Modifying project metadata

**Key scripts for development**:
```json
{
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build production assets  
    "start": "next start",       // Run production server
    "lint": "next lint",         // Lint with ESLint
    "format": "prettier --write ."  // Format code with Prettier
  }
}
```

**Essential dependencies for development**:
- `next@13.5.4` - Framework and server
- `react@18.2.0` - UI library 
- `typescript@5.1.6` - Type safety
- `@chakra-ui/react@^2.8.1` - Component library
- `tailwindcss@3.3.3` - Utility-first styling
- `dompurify@^3.0.8` - XSS protection (REQUIRED for user content)
- `marked@^7.0.2` - Markdown parsing
- `zustand` - State management

---

## 🚀 Development Workflow

### 1. **UI Changes** (Most Common)
```
1. Identify component in app/components/
2. Edit JSX and add Tailwind classes
3. Test in browser
4. No restart needed (hot reload)
```

### 2. **State Changes**
```
1. Update store interface in hooks/
2. Add/modify actions
3. Update components that use the state
4. Browser will automatically refresh
```

### 3. **New Features**
```
1. Create new component in components/
2. Add to parent component (usually ChatWindow)
3. Add any state management needed
4. Update responseInterpreter if backend-triggered
```

### 4. **Environment & Security Setup**
```
1. Copy .env.example to .env.local
2. Set NEXT_PUBLIC_API_BASE_URL (defaults to http://localhost:8000)
3. Ensure DOMPurify is used for all user-generated content
4. Follow TypeScript strict mode requirements
```

### 5. **Panel Layout Changes**
```
1. Identify target panel (left StructuredInput, right StructuredOutputDock)
2. Modify resize constraints in component (min/max width logic)
3. Update useResizeObserver logic if needed
4. Test responsive behavior at different screen sizes
```

---

## ⚠️ Important Rules

### ✅ Do This:
- **Edit existing files** rather than creating new ones when possible
- **Use Tailwind classes** for all styling (no new CSS files)
- **Test changes immediately** using the dev server
- **Follow existing patterns** in the codebase

### ❌ Don't Do This:
- **Create separate CSS files** for components (use Tailwind classes in JSX)
- **Modify node_modules** or config files without good reason  
- **Break the single-page app structure** (everything renders through ChatWindow)
- **Add dependencies** without understanding why they're needed
- **Skip DOMPurify** for user-generated content (security requirement)
- **Mix persistent and session state** (use correct store for each type)
- **Create CSS-in-JS** solutions (stick to Tailwind + minimal globals)

---

## 🎯 Quick Start for Common Tasks

### Adding a New Chat Feature
1. **ChatWindow.tsx**: Add button or input element
2. **ChatWindow.tsx**: Handle the action in a new function  
3. **useFriggState.ts**: Add any persistent settings needed
4. Test and iterate

### Creating a New Tool/Form
1. **StructuredInput.tsx**: Add new tool type to `ToolType` union type
2. **StructuredInput.tsx**: Create new form component (follow `QuickQuoteForm` pattern)
3. **StructuredInput.tsx**: Add to `toolComponents` object mapping
4. **StructuredInput.tsx**: Add validation function (follow `validateQuickQuote` pattern)
5. **useWorkspaceCoordinator.ts**: Add tool to `selectedTool` type union
6. **responseInterpreter.ts**: Add detection pattern if triggered by chat responses

### Modifying Visual Appearance  
1. **globals.css**: For app-wide changes (fonts, colors, base elements)
2. **Component files**: Add/modify Tailwind classes in className attributes
3. **tailwind.config.ts**: For custom design tokens (if needed)

---

## 🎯 The Golden Rule: Behavior-First Development

**Start with the behavior you want to change, then trace it back to the responsible component.**

### 7 Key Behavior Groupings

| Behavior Type | Primary Files | Common Changes |
|---------------|---------------|----------------|
| **💬 Conversation** | `ChatWindow.tsx` | Message handling, API calls, chat flow |
| **🎛️ UI State** | `useFriggState.ts`, components | Panels, themes, layout coordination |
| **📝 Forms & Input** | `StructuredInput.tsx` | Tool forms, validation, user input |
| **📤 Data Display** | `StructuredOutputDock.tsx`, `ChatMessageBubble.tsx` | Results, content rendering |
| **🧠 Intelligence** | `responseInterpreter.ts`, `useWorkspaceCoordinator.ts` | AI signals, automation |
| **🎨 Visual & Theme** | Component styling, `globals.css` | Appearance, animations, accessibility |
| **⚙️ System** | `layout.tsx`, `page.tsx`, `useWebSocket.ts` | Setup, connections, performance |

### Quick Behavior Mapping

**"I want users to be able to..."**
- **Send different types of messages** → Conversation behavior → `ChatWindow.tsx`
- **Customize the interface** → UI State behavior → `useFriggState.ts` 
- **Fill out new forms** → Forms & Input behavior → `StructuredInput.tsx`
- **See results differently** → Data Display behavior → `StructuredOutputDock.tsx`
- **Have the UI respond to AI** → Intelligence behavior → `responseInterpreter.ts`
- **Change how things look** → Visual & Theme behavior → Component styling
- **Fix app performance** → System behavior → `layout.tsx`, hooks

## 🏁 Summary

**Remember**: Frigg's Gate uses a **behavior-driven, component-based architecture**. Most changes happen in:

- **`ChatWindow.tsx`** - Conversation orchestration
- **State hook files** - UI state and workspace coordination  
- **Individual components** - Specific UI behaviors
- **`responseInterpreter.ts`** - Intelligence coordination

**The golden rule**: Identify the behavior type first, then edit the corresponding primary file. This approach ensures you're working in the right place from the start.

Happy coding! 🚀