# 🧭 Frigg's Gate Conceptual Guide

*The Dimensional Gateway Interface to the Life Nervous System*

# Table of Contents


---

# 1. System Architecture Overview

The Life Nervous System (LNS) is a **full-stack, production-grade intelligence platform** designed to deliver structured cognition, dynamic tool invocation, and seamless user interaction across both web and CLI interfaces. Frigg’s Gate functions as the **dimensional gateway** — the singular portal through which all human intent flows into LNS and returns as structured insight.

At its core, this is an operational cognitive architecture spanning from natural language input to backend orchestration, tool execution, and intelligent data retrieval.

---

## 🌐 1.1 Request Initiation (Client Interfaces)

**Initiators:**
- **Frigg’s Gate (Web UI)**: Primary interface for human users  
- **GateTester (CLI)**: Python-based CLI for structured interaction and debugging  
- **API Clients**: External programs or services invoking LNS logic via structured JSON

**Role:**  
Each initiator formats and sends JSON payloads containing user queries, session metadata, and conversation context — triggering the cognitive lifecycle of a request.

---

## 🖼 1.2 Frigg’s Gate (Frontend Interface Layer)

**Tech Stack:**  
- React + TypeScript (Next.js)  
- Tailwind CSS + Chakra UI

**Role:**  
The visual and interactive shell of the LNS. It transforms user input into structured requests and renders streamed, cited, and semantically routed responses.

**Key Traits:**  
- Lightweight state management  
- Real-time streaming display  
- Markdown and citation rendering  
- Planned support for voice input and component-based prompt composition

**Runtime Environment:**  
Frigg’s Gate operates atop a Node.js runtime. Whether deployed locally, in Docker, or on Vercel, Node.js powers the Next.js server components, API endpoints, and SSR logic — making it the execution layer behind all server-side interaction and interface hydration.


---

## 👁 1.3 GateTester (CLI Chat Simulator)

**Tech Stack:**  
- Python

**Role:**  
Simulates Frigg’s Gate behavior in a terminal context for rapid testing, inspection, and developer access.

**Key Traits:**  
- Structured payload generation  
- Auto-populated metadata (caller, timestamp, session)  
- Direct interaction with Bifröst for agent evaluation

---

## 🌀 1.4 Bifröst (Cognitive Orchestration Layer)

**Tech Stack:**  
- LangGraph / LangServe / FastAPI (Python)  
- LangChain Expression Language (LCEL), LangSmith (task tracing and debugging)

**Role:**  
The semantic router and orchestration graph behind LNS. Bifröst receives structured inputs, interprets them contextually, and dynamically invokes downstream agents — known as **Cyphers**.

**Key Traits:**  
- Flow control and error branching via LangGraph  
- Context-aware Cypher invocation  
- Multi-agent workflows with memory, chaining, and session continuity

---

## ⚙️ 1.5 Cyphers (Tooling and Execution Modules)

**Tech Stack:**  
- Python (logic and orchestration)  
- Rust (performance-critical operations)

**Examples:**  
- Quote calculation  
- Ledger table parsing  
- Life expectancy modeling  
- Illustration projection engine

**Role:**  
Individually callable units of structured intelligence, triggered by Bifröst depending on user intent, payload context, and system memory.

---

## 🧠 1.6 Intelligence & Data Layer

**Datastores:**  
- **SQLite** (current default)  
- **PostgreSQL / DuckDB / MotherDuck** (under evaluation)  
- **Chroma** (remote vector search for semantic retrieval)  
- **NEOR4** (custom graph knowledge store)

**Functions:**  
- Embedding-based document retrieval  
- Hybrid search (tabular + vector)  
- Structured knowledge graph lookup  
- Persistent session memory and state caching

---

## 📤 1.7 Response System

**Formats:**  
- Markdown (rendered in Frigg’s Gate)  
- JSON (for API clients and tool results)  
- Tracebacks / logs (for debugging)

**Delivery Targets:**  
- Frigg’s Gate (for real-time user rendering)  
- GateTester (terminal output)  
- External clients (via HTTP API)

---

## 🌐 1.8 Network & Delivery

**Environments:**  
- `localhost:8000`: Default local development  
- `0.0.0.0:8000`: Open port testing  
- Vercel / Docker: Production deployment targets

**External Dependencies:**  
- Chroma (remote embedding index)  
- Cloud-based LLMs  
- Persistent stores (remote SQLite or Postgres variants)

**Forward Path:**  
The stack is evolving toward low-latency, bidirectional flows via React Server Components or direct server-bound action layers — minimizing client-server roundtrips and enabling next-gen conversational tooling.

# The 6 Categories Every Web Page Needs to Render

If you walked up to a web developer and said:

> “There are six categories of information the browser needs to render any web page,”

—they’d say, *“Who are you, and why are you telling me something completely correct?”*  
Then probably squint and add, *“Are you some kind of rendering psycho?”*

And you’d say: *“Maybe. But Chrome agrees with me — here’s how it works.”*

- Chrome parses **HTML** to build the DOM — the structured skeleton of the page.  
- It parses **CSS** next, building a CSSOM that controls what everything should look like.  
- It runs **JavaScript** to attach behavior, modify content, and react to interaction.  
- It fetches **data payloads** to populate the UI with dynamic, real-world content.  
- It loads **assets** like images, fonts, and icons to make the page feel complete.  
- And finally, it runs **bootstrapping code** to wire everything up and bring the app to life.

This is that list — explained not just as what they are, but what they *do*, *why they matter*, and *how they fit* into the system.

---

## 1. HTML Structure

HTML is the **skeleton** of every page. It defines the elements — text blocks, inputs, buttons, images — and the relationships between them (nesting, grouping, flow).

Without HTML, the browser has no frame to render, no targets to style, and no content to interact with.

HTML defines the **Document Object Model** — the **DOM** — which is the tree-like structure the browser builds in memory to represent the page.

Each HTML tag becomes a **node** in this tree:
- `<div>` → element node  
- Text inside → text node  
- Nested tags → branches  

The DOM is what everything else talks to:
- **CSS** targets DOM elements to style them  
- **JavaScript** reads and modifies the DOM to add behavior or update content  

The browser constructs the DOM from the HTML source, even if the HTML is badly written — it auto-corrects to make the DOM usable.

> HTML defines the **page structure** — the DOM is what the browser **renders** and **scripts act upon**.

If there’s no HTML, there’s no DOM. And without the DOM, the page literally doesn’t exist.

In the LNS stack, HTML is not written manually — it is dynamically generated by React components (via Next.js) during server-side or client-side rendering.


---

## 🎨 2. CSS Styling

CSS (Cascading Style Sheets) defines the **visual appearance** of the DOM.  
It tells the browser **how each element should look**, without changing what the element *is*.

CSS controls:
- **Color** (text, background, borders)
- **Layout** (positioning, alignment, spacing)
- **Typography** (fonts, size, weight, line height)
- **Responsive behavior** (via media queries)
- **Visual effects** (hover states, transitions, animations)

CSS rules are applied by the browser's **rendering engine** after the DOM is built.  
They can come from:
- External `.css` files
- `<style>` blocks in HTML
- Inline `style=""` attributes
- JS-driven systems (e.g. Emotion, Tailwind, Chakra)

> CSS doesn't add or remove content — it defines **what the content should *look* like**.

Without CSS, a web page still functions, but it looks unstyled, inaccessible, and unprofessional.



### Four Layers of Styling

In modern UI systems, CSS isn't written as one giant stylesheet. It's layered — from global defaults down to one-off overrides. In your stack (Tailwind + Chakra + Emotion), those layers are clearly defined.



#### 🧠 1. Foundational Styling

Foundational styling sets the **default look and behavior** of the entire app before any individual components are styled. It creates the baseline visual system: fonts, spacing, background colors, link behavior, and layout rules.

These are the **core baseline pieces** every interface needs:

- Global font (family, size, weight)
- Base background color
- Text color defaults
- Link styling (color, underline, hover)
- Universal layout rules (e.g. box-sizing, height defaults)
- Theme tokens (spacing, color, typography scales)


##### 📦 Where These Come From in Your Stack

| Foundational Element                      | Comes From                                                           |
|-------------------------------------------|----------------------------------------------------------------------|
| Font family, size, weight                 | `globals.css` + Chakra theme via `ChakraProvider`                   |
| Base background color                     | `globals.css`, Chakra theme, or inline styles                       |
| Text color defaults                       | Chakra color tokens + Tailwind classes                              |
| Link behavior                             | `globals.css` overrides for `a` tags                                |
| Layout rules (`box-sizing`, height)       | Tailwind utilities + base CSS setup                                 |
| Theme tokens (color, spacing, font sizes) | Chakra theme configuration                                          |

> **Mental model:** Foundational styles define the "starting point" for how things look. Every component inherits from this.



#### 🧱 2. Layout & Positioning

Layout defines **how elements are arranged** in space — how they flow, align, nest, and respond to different screen sizes.

These are the layout concerns every UI must handle:

- Flex and grid structures
- Widths, heights, constraints
- Padding, margins, gaps
- Responsive stacking and alignment
- Full-page height or sectional layout



##### 📦 Where These Come From in Your Stack

| Layout Concern                           | Comes From                                                             |
|------------------------------------------|------------------------------------------------------------------------|
| Flex/grid positioning                    | Tailwind (`flex`, `grid`, `justify-between`)                          |
| Spacing (padding, margin, gap)           | Tailwind (`p-4`, `gap-6`) + Chakra props (`p`, `m`)                   |
| Widths and heights                       | Tailwind (`w-full`, `h-screen`) + Chakra (`w`, `h`, `minW`, `maxH`)   |
| Alignment                                | Tailwind (`items-center`) + Chakra (`align`, `justify`)              |
| Section/container nesting                | Chakra `Box`, `Flex`, `Stack`, `Container` components                 |

> **Mental model:** Layout is **structure**. It controls where things go and how they behave in space — not what they look like.


#### 🎨 3. Component Appearance

Appearance defines the **reusable visual identity** of UI components — color, shape, shadows, and states like hover or focus. This layer makes buttons look like buttons and cards look like cards.

Key appearance elements:

- Background and text color
- Borders, shadows, radius
- Font size, weight, casing
- Internal padding
- Visual variants (e.g. solid, outline)
- State styles (hover, active, disabled)



##### 📦 Where These Come From in Your Stack

| Appearance Feature                       | Comes From                                                                |
|------------------------------------------|---------------------------------------------------------------------------|
| Color (bg, text)                         | Chakra props (`bg`, `color`, `colorScheme`) + Tailwind (`bg-`, `text-`)  |
| Borders and radius                       | Chakra props (`border`, `borderRadius`) + Tailwind (`rounded-lg`)        |
| Typography                               | Chakra (`fontSize`, `fontWeight`, `textTransform`) + Tailwind utilities  |
| Padding inside components                | Chakra (`px`, `py`, `p`) + Tailwind (`p-4`)                               |
| Visual variants                          | Chakra `variant` prop on Button, Input, etc.                             |
| State styling                            | Chakra internal states + Tailwind classes like `hover:bg-blue-600`       |

> **Mental model:** Appearance makes components **recognizable and consistent**. It's not layout — it's visual branding.



#### 🎯 4. One-Off Customization

One-off styles are **specific, localized tweaks** — for unique cases that don't generalize. These are exceptions, not reusable patterns.

Use cases:

- Temporary overrides
- Conditional styling logic
- Visual edge cases
- Dev-only or experimental visuals
- Per-page exceptions



##### 📦 Where These Come From in Your Stack

| Customization Type                       | Comes From                                                               |
|------------------------------------------|---------------------------------------------------------------------------|
| Inline tweaks                            | JSX `style={{ ... }}`                                                   |
| Unique class combinations                | Tailwind `className="..."` used once                                    |
| Conditional logic                        | Chakra dynamic props (`color={isActive ? 'green' : 'gray'}`)            |
| Prototype visuals                        | Hardcoded styles or temporary overrides                                 |
| Page-specific design                     | Tailwind or Chakra styles scoped to file or route                       |

> **Mental model:** One-off styling is **surgical**. It's precise, local, and intentionally isolated from global systems.



### ✅ Summary

CSS is more than decoration — it's a layered system that defines how content is visually expressed. In your stack:

- **Tailwind** handles utility-first layout and structure.
- **Chakra** manages theme-based appearance and component consistency.
- **Emotion** enables dynamic, scoped, CSS-in-JS logic.
- **Globals.css** defines core behavior defaults (font, box-sizing, spacing).

> These tools work together to let you build UIs that are fast to prototype, visually consistent, and deeply composa

---


## 🚀 JavaScript Logic: The Behavioral Layer

JavaScript is the **behavioral layer** of web applications. It brings pages to life by listening for user input, fetching data, updating the DOM, and handling business logic. It runs inside the browser's **JavaScript engine** (e.g. V8 in Chrome) and transforms static documents into interactive applications.

> JavaScript defines **what happens** when something changes, clicks, or loads.



### Four Layers of JavaScript Logic

In modern applications, JavaScript operates across four distinct layers — from low-level browser interactions up to high-level business intelligence. Each layer connects directly to how browsers render web pages, handling everything from DOM manipulation to data orchestration.

#### 🔧 1. DOM Interaction Layer

The DOM interaction layer handles **direct communication with browser APIs** and raw DOM manipulation. This is where JavaScript interacts with the **actual rendered page** — the HTML structure and loaded assets — responding to user input and invoking built-in browser capabilities.

##### Core Browser Interactions

These are the low-level operations where JavaScript interfaces directly with the browser's runtime environment. While frameworks like React wrap and abstract much of this, your components still ultimately rely on these primitives to create dynamic, interactive behavior.

- **Event listeners** – capture user input like clicks, key presses, scrolling, or window resizing. React wraps these with `onClick`, `onChange`, etc., but under the hood it's still `addEventListener`

- **DOM API** – element selection and traversal. JavaScript doesn't interact with HTML directly — it uses the DOM API to access and manipulate the document. React typically handles this via its virtual DOM, but manual refs (`useRef`) or portal logic often require direct DOM access

- **Attribute and content manipulation** – update what elements say and how they behave by modifying text, classes, IDs, and data attributes. In React, this happens via props and state — but it compiles down to direct DOM changes

- **Browser API access** – the browser exposes system-level capabilities for storage, networking, and navigation. You typically use these through React effects or utility functions, not directly:
  - `localStorage`, `sessionStorage` – persist user data between visits or reloads
  - `fetch()` – request or submit data over HTTP
  - `history.pushState`, `location` – update the URL or handle routing without full reloads

- **Performance measurements** – capture metrics like render time, load duration, or layout shifts using the Performance API. React tools may surface some of this, but custom tracking hooks often go directly to the source

- **Media controls** – manipulate `<audio>`, `<video>`, or `<canvas>` content. React handles structure, but playback, drawing, and timing still rely on direct API calls

- **Asset loading** – JavaScript can dynamically create and insert tags like `<img>`, `<link>`, and `<script>` to load images, fonts, and scripts when needed. Frameworks like React offer lazy loading to delay this until a component or asset is actually required. However, it's still the browser that performs the actual network requests and handles rendering once the asset is requested

> **Mental model:** The DOM layer is where JavaScript **touches reality** — actual browser APIs, rendered elements, and loaded assets.



#### 🎭 2. Component Logic Layer

Component logic defines **how individual UI pieces behave** — their internal state, computed values, and local interactions. This layer encapsulates the JavaScript behavior within components, making them modular, reusable, and self-contained.

##### Component Concerns

- **Local state management** – track values that change over time within the component
- **Props validation and defaults** – receive, validate, and provide fallback behavior for parent-provided inputs
- **Computed/derived values** – create values based on existing state or props
- **Event handler methods** – define internal functions that respond to user actions
- **Side effects and cleanups** – manage lifecycle-sensitive behavior like subscriptions or timeouts
- **Conditional rendering logic** – decide when to show/hide parts of the UI based on internal conditions

> **Mental model:** Component logic is **encapsulated behavior**. Each component manages its own mini-universe of state and actions.



#### 🌐 3. Application State Layer

Application state manages shared, dynamic data that flows across your app. It keeps multiple parts of the UI in sync by holding information that persists beyond individual components and survives navigation.

**What kind of data lives here?**
- User authentication – identity, permissions
- Navigation – current route or view
- Server cache – fetched API data, real-time updates
- Global UI – modals, theme, loading states
- Form state – filters, multi-step progress
- System status – online/offline, sync, errors

🧠 **Mental Model: Single Source of Truth**
Think of application state as a shared control center. It holds important app-wide information in one place, allowing all components to read from or update it as needed.

🔁 **How It Works (React)**
Application state lives in memory using React's `useState`, `useReducer`, Context, or libraries like Redux. Components subscribe to just the parts they need, and React re-renders them automatically when that data changes—no manual DOM updates.

🧭 **Analogy**
A shared dashboard in a control room: every component watches it to know what's happening, and when the dashboard updates, they all respond immediately.



#### 🏭 4. Business Logic Layer

Business logic contains domain-specific rules and workflows that orchestrate your application's intelligence. This layer handles the bootstrapping code and complex decision-making that makes your app more than just a collection of UI components.

In our architecture, **JavaScript retains the ability to perform all of these functions**, but **we strategically offload as much cognitive work as possible to the Bifröst backend**. This keeps the frontend responsive, maintainable, and focused on delegation rather than decision-making.

**JavaScript Can Still Handle:**
- **Data validation rules** – ensuring input integrity before making Cypher calls
- **Calculation engines** – lightweight or fallback computations (e.g., totals, client-side logic)
- **Workflow orchestration** – UI-level sequencing, optimistic updates, or retry logic
- **API integration logic** – transforming Cypher inputs/outputs, managing fetch states
- **Format transformations** – local formatting for display (e.g., currency, i18n)
- **Permission/access rules** – enforcing role gates or feature flags before invoking backend

**Backend Delegation:** Whenever feasible, we push heavy logic (reasoning, decision trees, chaining, data processing) to **Bifröst Cyphers**, treating frontend logic as a routing and formatting layer that invokes structured cognition downstream.

**Mental model:** JavaScript remains capable of executing business logic, but in LNS, it acts as a **facilitator and interpreter** — shaping and interpreting requests to/from Cyphers, rather than owning the complexity itself.


### Technical Context

#### Language to CPU Execution

When you write JavaScript, it flows through a layered system:

1. **JavaScript Source** → Your `.js` files
2. **V8 Runtime** → Object model, types, memory, host APIs  
3. **JIT Compilation** → Bytecode compiled to native machine code during runtime
4. **CPU Execution** → Direct machine code execution for performance

This differs from interpreted languages like Python, where code runs through a virtual machine. JavaScript's Just-In-Time compilation makes it exceptionally fast for interactive applications.

#### From Scripts to Systems: JavaScript Evolution

##### The Early Days
Originally, JavaScript was basic. You'd drop a single `<script>` tag into a page. All logic lived in one file. Everything was global. That was manageable for short scripts — buttons, alerts, forms.

But that approach doesn't scale to modern applications. As complexity grew, the language evolved.

##### The ES6 Breakthrough
ES6 (ECMAScript 2015) was a pivotal upgrade. It didn't replace JavaScript — it is JavaScript, just modernized.

ES6 added essential tools for building real applications:
- `let` and `const` for block-scoped variables
- Arrow functions for cleaner function syntax
- `async/await` for asynchronous flows
- And crucially: **modules**

##### Modules: JavaScript With Structure
Modules introduced file-level isolation and dependency management. Instead of dumping logic into a giant global namespace, you now split your logic into self-contained files:

- Each file has its own scope
- Dependencies are declared via `import` and `export`
- Only what's explicitly shared is exposed

This gave JavaScript the architectural spine that large systems require.

While modern browsers can run ES6 modules directly using `<script type="module">`, that's not how production systems like LNS actually deliver JavaScript. Instead, **Next.js handles bundling and optimization automatically**, using either Turbopack or Webpack depending on the version. These tools are built into the framework and compile your modular code into a fast, production-ready bundle. So while native module support helps form a mental model of how `import`/`export` works, you don't ship raw modules — **the framework abstracts that away under the hood**.

---

## 4. Data Payloads

A web page without content is just a shell. Data payloads provide the **actual information** that fills in the interface: chat messages, blog posts, search results, etc.

They can come from:
- APIs (fetched via `fetch()` or `XMLHttpRequest`)
- Server-rendered JSON blobs embedded in HTML
- Client-side storage (e.g. `localStorage` or cache)

Data is usually structured (e.g. JSON), and is injected into components via JavaScript.

> Data answers the question: **“What should this UI display?”**

---

## 5. Assets

Assets are **non-code resources** that the browser loads to render the page completely:
- Images (`<img>`)
- Fonts (`@font-face`, Google Fonts)
- Icons (`.svg`, `.ico`)
- Videos/audio
- PDFs, documents, downloadable files

They’re not functional by themselves, but without them, a page looks incomplete or broken. A profile page with a missing avatar or broken font feels wrong, even if it works.

> Assets make the page **feel finished, branded, and visual**.

---

## 6. Runtime Bootstrapping

This is the part that connects the dots — where the browser initializes the app and prepares it to run as an interactive experience.

It includes:
- **Hydration** (React/Vue/etc.): binding static HTML to live components
- **Routing**: setting up the correct page state
- **App init logic**: configuring state, context, services
- **Code execution hooks**: `window.onload`, `DOMContentLoaded`, framework entry points

No matter how good your code is, if bootstrapping doesn’t happen, the app doesn’t run.

> Bootstrapping is the **ignition system** — it turns a rendered page into a live, interactive application.

---

Together, these six are not just things the browser *can* use — they are the **minimum complete set** required to deliver a functional, styled, data-driven, interactive experience.









<<needs taken care of >>
✅ Your Deployment Plan – Frigg’s Gate
Frontend (Frigg’s Gate UI)
Built with: React + Next.js → requires Node.js server

Currently runs: Locally (via Node.js)

Production plan: Deploy on Vercel

Vercel handles Node.js server as a service

No manual server management

Ideal for frontend DX

Backend (Python API)
Built with: FastAPI / Flask / etc.

Currently runs: Locally or separately

Production plan: Deploy on Google Cloud Run

Autoscaling, HTTP endpoint

Region-aligned with Vercel to minimize latency

🌐 Communication
Frontend makes HTTP API calls to the backend

Auth, payloads, and streaming managed via API contract

Use env vars like NEXT_PUBLIC_API_URL to configure base URL

🧭 Other Options (Briefly)
If you ever need:

More control: Use Cloud Run for both frontend + backend

Simpler build: Export Frigg’s Gate as static if SSR is dropped (not likely)

More unified deploy: Dockerize both services and run together (more ops)

But none of those beat the simplicity of Vercel + Google Cloud Run for your use case.

You're on exactly the right track.


# 2. 🖼  Frigg’s Gate (Frontend Interface Layer)

## 2.1 Runtime: Node.js Architecture and Event-Driven Model

**Node.js** is a runtime environment built on Chrome’s V8 JavaScript engine, ideal for Frigg's Gate's real-time needs. Created by Ryan Dahl in 2009, it was later developed by Joyent, which helped grow its early adoption.

In 2015, governance concerns led to the Node.js Foundation under the Linux Foundation, uniting major players like IBM, Microsoft, and PayPal. In 2019, it merged with the JS Foundation to form the **OpenJS Foundation**, which now oversees Node.js and many key JavaScript projects, backed by companies such as Google, Microsoft, and Meta.

**Why Node.js for Frigg's Gate:**

Node.js excels at building fast and efficient applications through its unique architectural approach and other considerations:

**Single-threaded Operations**: Node.js uses one primary thread to handle all tasks, making it lightweight and memory-efficient. Instead of creating multiple threads for different operations, this approach reduces overhead and complexity.

**Non-blocking I/O**: The runtime doesn't wait for operations like API calls or file reads to complete before moving to other tasks. This is crucial for Frigg's Gate's real-time chat interface, where multiple user interactions can occur simultaneously.

**Event-driven Architecture**: The event loop manages tasks efficiently, picking up completed operations and processing them in the correct order. This ensures smooth handling of streaming responses from Bifröst without blocking the user interface.

**Performance Benefits for Frigg's Gate:**
- Handles multiple concurrent chat sessions without performance degradation
- Manages real-time streaming responses from the backend efficiently
- Supports rapid development iteration with fast server restart times
- Enables seamless integration with the vast npm ecosystem for extending functionality

**Local Development Advantages:**
Node.js enables Frigg's Gate to run entirely locally, with the browser serving as the interface to a locally-running backend. This setup provides:
- Complete data privacy and security
- No dependency on external hosting during development
- Real-time debugging and development capabilities
- Seamless integration with local development tools




## 2.2 Language: TypeScript Compilation and Type Safety

**TypeScript** enhances JavaScript by adding static typing and modern language features, providing crucial benefits for Frigg's Gate's complex component architecture.

**Type Safety Benefits:**
TypeScript's compile-time type checking prevents runtime errors that could disrupt user conversations. For example, message payload structures are strictly typed, ensuring consistent communication with the Bifröst backend:

```typescript
interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  sources?: SourceReference[];
  metadata?: MessageMetadata;
}
```

**Developer Experience Enhancements:**
- **Intelligent Autocompletion**: IDE support provides accurate suggestions for component props and API responses
- **Refactoring Safety**: Large-scale code changes are validated at compile time
- **Documentation Integration**: Type definitions serve as living documentation for component interfaces

**Code Organization Benefits:**
TypeScript's interfaces and generics enable clear contracts between components, making the codebase more maintainable as Frigg's Gate evolves. This is particularly important for the modular component architecture that supports different interaction modes.

**Compilation Process:**
During development, TypeScript code is compiled to JavaScript in real-time, enabling immediate feedback. The final browser-executed code is optimized JavaScript, ensuring maximum runtime performance.

## 2.3 Framework: React + Next.js App Router Paradigm

**React** provides the component-based architecture that models Frigg's Gate's modular interface design. **Next.js App Router** adds powerful routing, rendering, and optimization capabilities.

**React Component Architecture:**
React's declarative approach perfectly matches Frigg's Gate's need for dynamic, state-driven interfaces. Components like `ChatWindow` and `ChatMessageBubble` can respond to changing conversation state while maintaining predictable behavior.

**Next.js App Router Benefits:**
- **File-based Routing**: URL structure matches the file system, making navigation intuitive
- **Server Components**: Optimal performance through selective server-side rendering
- **Streaming**: Progressive page loading that enhances perceived performance
- **Automatic Code Splitting**: Only necessary JavaScript is loaded for each route

**Real-time Capabilities:**
The combination enables Frigg's Gate to handle streaming responses from Bifröst, updating the interface progressively as new content arrives. This creates the smooth, conversational experience central to the gateway metaphor.

**Scalability Considerations:**
As Frigg's Gate evolves to support multiple interaction modes (structured, unstructured, hybrid), React's component model and Next.js's routing capabilities provide the foundation for seamless feature expansion.

## 2.4 Styling: Tailwind CSS + Chakra UI Integration

**Tailwind CSS** provides utility-first styling that enables rapid interface development, while **Chakra UI** contributes pre-built components that maintain consistency and accessibility.

**Tailwind CSS Advantages:**
- **Utility-First Approach**: Styles are applied directly in components, reducing context switching
- **Responsive Design**: Built-in breakpoint system ensures Frigg's Gate works across devices
- **Customization**: Extensive configuration options allow alignment with LNS branding
- **Performance**: Unused styles are automatically purged from production builds

**Chakra UI Integration:**
- **Accessibility**: Components include ARIA attributes and keyboard navigation by default
- **Theme Consistency**: Centralized design system ensures visual coherence
- **Component Library**: Pre-built elements like buttons and modals accelerate development
- **Dark Theme Support**: Native dark mode capabilities align with Frigg's Gate's aesthetic

**Visual Hierarchy:**
The combination creates a sophisticated visual language that supports the mythical gateway concept while maintaining professional usability. Dark themes with carefully chosen accent colors reinforce the system's advanced, mystical character.

## 2.5 Build Toolchain and Dependency Management

**Yarn Package Manager** handles dependency resolution and installation, providing faster and more reliable builds than npm. The lock file ensures consistent dependency versions across development environments.

**Build Process Components:**
- **TypeScript Compiler**: Converts TypeScript to optimized JavaScript
- **Next.js Build System**: Handles bundling, optimization, and asset management
- **PostCSS Processing**: Transforms and optimizes CSS, including Tailwind compilation
- **ESLint Integration**: Enforces code quality and consistency standards

**Development Workflow:**
The development server provides hot reloading, enabling immediate feedback during interface development. Changes to components or styles are reflected instantly in the browser, accelerating the iteration cycle.

**Production Optimization:**
Build processes include automatic optimization through tree shaking, code splitting, and asset compression. This ensures Frigg's Gate loads quickly and performs efficiently in production environments.

---

# 3. Application Architecture

## 3.1 Next.js App Router Structure and File Organization

Frigg's Gate leverages Next.js App Router's file-based routing system to create an intuitive project structure that mirrors the user experience:

```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with global providers
│   ├── page.tsx            # Main chat interface entry point
│   ├── globals.css         # Global styling and theme definitions
│   └── components/
│       ├── ChatWindow.tsx           # Primary interface orchestration
│       ├── ChatMessageBubble.tsx    # Individual message rendering
│       ├── EmptyState.tsx          # Welcome screen and action cards
│       ├── AutoResizeTextarea.tsx   # Dynamic input component
│       ├── InlineCitation.tsx      # Source reference display
│       └── SourceBubble.tsx        # Source information cards
├── utils/
│   ├── constants.tsx       # Configuration and API endpoints
│   └── sendFeedback.tsx    # User interaction tracking
└── public/
    ├── favicon.ico         # Application branding
    └── images/             # Static assets and icons
```

**Architectural Principles:**

**Colocated Functionality**: Related components, utilities, and styles are organized together, reducing cognitive overhead during development and maintenance.

**Clear Separation of Concerns**: The structure distinguishes between layout (`layout.tsx`), routing (`page.tsx`), UI components (`components/`), business logic (`utils/`), and static assets (`public/`).

**Scalable Organization**: As Frigg's Gate evolves to support multiple interaction modes, the structure can accommodate new routes and component hierarchies without requiring major reorganization.

## 3.2 Component Hierarchy and Modular Design

Frigg's Gate's component architecture follows a hierarchical pattern that mirrors the user experience flow:

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

**Design Patterns:**

**Container-Presentation Pattern**: Components like `ChatWindow` handle state and logic, while presentational components like `ChatMessageBubble` focus on rendering and user interaction.

**Composition Over Inheritance**: Complex interfaces are built by composing smaller, focused components rather than creating monolithic structures.

**Props-Based Communication**: Components communicate through well-defined prop interfaces, enabling easy testing and reusability.

**State Co-location**: Component state is managed as close to its usage as possible, reducing unnecessary prop drilling and improving performance.

## 3.3 State Management Patterns and Data Flow

Frigg's Gate employs a **centralized state management** approach within the `ChatWindow` component, with specific patterns for different types of state:

**Conversation State:**
```typescript
const [messages, setMessages] = useState<ChatMessage[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [currentModel, setCurrentModel] = useState<string>('gpt-4');
```

**UI State:**
```typescript
const [inputValue, setInputValue] = useState('');
const [showSources, setShowSources] = useState(true);
const [feedbackState, setFeedbackState] = useState<FeedbackState>({});
```

**Data Flow Patterns:**

**Unidirectional Data Flow**: State changes flow down through props, while events bubble up through callback functions. This predictable pattern makes debugging and testing straightforward.

**Event-Driven Updates**: User actions trigger state updates that cascade through the component tree, ensuring the interface stays synchronized with the current conversation state.

**Optimistic Updates**: The interface updates immediately for user actions (like sending a message), with error handling for failed operations.

**State Persistence**: Critical state like conversation history is maintained across component re-renders, with future architecture supporting persistence across sessions.

## 3.4 API Integration Layer with Bifröst Backend

The integration layer abstracts backend communication behind a clean interface, enabling easy testing and future backend evolution:

**API Constants and Configuration:**
```typescript
// utils/constants.tsx
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
```

**Communication Protocol:**
Frigg's Gate communicates with Bifröst using structured JSON payloads:

```typescript
interface BifrostRequest {
  question: string;
  chat_history: ChatMessage[];
  metadata: {
    caller: string;
    purpose: string;
    timestamp: string;
  };
  session: {
    user_id: string;
    context: Record<string, any>;
  };
  stream: boolean;
}
```

**Streaming Response Handling:**
The frontend supports real-time streaming responses from Bifröst, updating the interface progressively as content arrives:

```typescript
const handleStream = async (response: Response) => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    // Update interface with partial response
    updateMessageContent(chunk);
  }
};
```

**Error Handling Strategy:**
Robust error handling ensures graceful degradation when backend services are unavailable:
- Connection timeouts with user-friendly messages
- Retry mechanisms for transient failures
- Fallback responses for critical errors
- Error logging for debugging and monitoring

## 3.5 Configuration and Environment Management

Frigg's Gate uses environment-based configuration to support different deployment contexts:

**Environment Variables:**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000  # Development
NEXT_PUBLIC_API_BASE_URL=https://api.lns.prod   # Production
```

**Configuration Layers:**

**Build-time Configuration**: TypeScript compilation settings, build optimization parameters, and static asset handling configured in `next.config.js` and `tsconfig.json`.

**Runtime Configuration**: API endpoints, feature flags, and deployment-specific settings managed through environment variables.

**Development Tools**: ESLint rules, Prettier formatting, and PostCSS processing configured for consistent code quality across team members.

**Deployment Configuration**: Vercel-specific settings in `vercel.json` control deployment behavior, including automatic deployment controls and build optimization.

---

# 4. Core Components Deep Dive

## 4.1 ChatWindow: Main Interface Orchestration

`ChatWindow` serves as the **central orchestrator** for all user interactions within Frigg's Gate. This component manages conversation state, coordinates with the Bifröst backend, and provides the foundation for the gateway experience.

**Primary Responsibilities:**

**State Management**: Maintains conversation history, user input state, loading indicators, and model selection. The component serves as the single source of truth for conversation state.

**Backend Integration**: Handles all communication with Bifröst, including request formatting, response parsing, and streaming message updates.

**User Experience Coordination**: Manages the flow between different interface states (empty, loading, conversing) and coordinates component interactions.

**Key Features:**

**Multi-Model Support**: Users can select from different AI models (GPT-4, Claude, etc.) for varied interaction styles and capabilities.

**Streaming Response Handling**: Real-time display of AI responses as they generate, creating a natural conversational flow.

**Session Management**: Maintains conversation context and supports future session persistence across browser sessions.

**Error Recovery**: Graceful handling of network issues, backend errors, and invalid inputs with appropriate user feedback.

**Technical Implementation Details:**

**Component Structure**: The `ChatWindow` uses React hooks for state management and effect handling, with clearly defined interfaces for props and state objects.

**Performance Optimization**: Implements proper key usage for list rendering, debounced input handling, and efficient re-rendering patterns.

**Accessibility Features**: Keyboard navigation support, screen reader compatibility, and proper ARIA labeling for assistive technologies.

## 4.2 ChatMessageBubble: Message Rendering and Interaction

`ChatMessageBubble` handles the display and interaction for individual messages within the conversation. This component supports rich content rendering, source citations, and user feedback mechanisms.

**Message Types and Rendering:**

**User Messages**: Clean, right-aligned bubbles with subtle styling that distinguishes user input from AI responses.

**AI Responses**: Left-aligned bubbles with rich content support, including markdown rendering, code syntax highlighting, and embedded source citations.

**System Messages**: Special styling for system notifications, errors, and status updates.

**Interactive Features:**

**Citation Integration**: Seamlessly embeds `InlineCitation` components within message text, providing immediate access to source information.

**Feedback Mechanisms**: Thumbs up/down buttons with animated responses and comment collection for continuous system improvement.

**Copy Functionality**: One-click copying of message content with visual feedback confirmation.

**Source Expansion**: Toggle display of associated `SourceBubble` components for detailed source information.

**Content Processing:**

**Markdown Support**: Full markdown rendering including headers, lists, code blocks, and emphasis.

**Code Highlighting**: Syntax highlighting for multiple programming languages with copy-to-clipboard functionality.

**URL Detection**: Automatic link detection and formatting with appropriate security measures.

**Citation Parsing**: Intelligent extraction and formatting of source references within AI responses.

## 4.3 EmptyState: Initial Interface and Action Cards

`EmptyState` provides users with an inviting entry point to Frigg's Gate, featuring contextual action cards that showcase key capabilities and guide initial interactions.

**Welcome Experience:**

**Brand Introduction**: Clear explanation of Frigg's Gate's role as the gateway to the Life Nervous System.

**Capability Overview**: Visual representation of key system capabilities through interactive action cards.

**Getting Started Guidance**: Intuitive pathways for users to begin their first interaction.

**Action Cards:**

**Run Illustrations**: Quick access to visual generation capabilities with example prompts and expected outputs.

**Get Quotes**: Direct connection to pricing and quotation tools with sample queries.

**Explore SIM-KB**: Gateway to knowledge base exploration with suggested search topics.

**Learn About Frigg**: Meta-information about the system itself and its capabilities.

**Interactive Design:**

**Hover Effects**: Subtle animations that provide feedback and encourage exploration.

**Progressive Disclosure**: Action cards reveal additional information on interaction without overwhelming the initial view.

**Contextual Help**: Each card includes brief descriptions and example use cases.

**Responsive Layout**: Cards adapt to different screen sizes while maintaining visual hierarchy and usability.

## 4.4 Input System: AutoResizeTextarea and User Input Handling

The input system provides a sophisticated interface for user communication, supporting both brief queries and extended requests with intelligent resizing and formatting.

**AutoResizeTextarea Features:**

**Dynamic Sizing**: Automatically expands as users type longer messages, maintaining comfortable text entry without manual resizing.

**Minimum and Maximum Heights**: Ensures consistent interface layout while accommodating various input lengths.

**Scroll Management**: Intelligent scrolling behavior that keeps content visible during typing.

**Placeholder Intelligence**: Contextual placeholder text that suggests appropriate interactions based on current state.

**Input Processing:**

**Real-time Validation**: Immediate feedback for input formatting, length limits, and content appropriateness.

**Command Recognition**: Future support for special commands and shortcuts for power users.

**Paste Handling**: Intelligent processing of pasted content, including formatting preservation and content sanitization.

**Draft Persistence**: Maintains user input across interface interactions and potential page refreshes.

**User Experience Enhancements:**

**Keyboard Shortcuts**: Support for common shortcuts like Ctrl+Enter for message submission.

**Voice Input Integration**: Future support for voice-to-text input capabilities.

**Multiple Input Modes**: Planned support for structured input modes alongside natural language interaction.

## 4.5 Citation System: InlineCitation and SourceBubble

The citation system provides transparent access to source information, supporting Frigg's Gate's commitment to verifiable, traceable responses.

**InlineCitation Component:**

**Numbered References**: Clean, numbered citation markers that integrate seamlessly with response text.

**Hover Previews**: Quick preview of source information without disrupting reading flow.

**Click Navigation**: Direct access to full source information and external links.

**Visual Integration**: Styling that complements message content without creating visual noise.

**SourceBubble Component:**

**Rich Source Information**: Displays title, URL, excerpt, and relevance information for each source.

**External Link Handling**: Secure link opening with appropriate target and security attributes.

**Interaction Tracking**: Monitors user engagement with sources for system improvement.

**Contextual Display**: Appears when users interact with citations or request source details.

**Information Architecture:**

**Source Relevance Scoring**: Visual indicators of source quality and relevance to the user's query.

**Content Categorization**: Different styling and icons for different types of sources (academic, news, documentation, etc.).

**Accessibility Features**: Screen reader support and keyboard navigation for source exploration.

**Performance Optimization**: Lazy loading of source previews and efficient caching of source metadata.

## 4.6 Feedback Mechanisms and User Interaction Tracking

Frigg's Gate implements comprehensive feedback collection to continuously improve system performance and user experience.

**Explicit Feedback Collection:**

**Message Rating**: Simple thumbs up/down feedback for individual AI responses.

**Comment Collection**: Optional text feedback for detailed user input on system performance.

**Feature Requests**: Structured collection of user suggestions for system improvements.

**Bug Reporting**: Integrated error reporting with automatic context collection.

**Implicit Feedback Tracking:**

**Interaction Patterns**: Monitoring of user behavior patterns, including click-through rates on sources and action card usage.

**Session Analytics**: Collection of session length, message frequency, and interaction depth.

**Performance Metrics**: Client-side performance monitoring including load times and response latencies.

**Usage Analytics**: Understanding of feature adoption and user workflow patterns.

**Privacy and Transparency:**

**Data Minimization**: Collection of only necessary data for system improvement.

**User Control**: Clear options for users to control data collection and feedback sharing.

**Transparency**: Open communication about what data is collected and how it's used.

**Secure Transmission**: Encrypted transmission of all feedback data to backend systems.

---

# 5. Data Flow and Communication

## 5.1 Frontend-Backend Communication Protocols

Frigg's Gate implements a sophisticated communication layer that enables seamless interaction with the Bifröst backend while maintaining responsive user experience.

**Request Architecture:**

The frontend structures all backend requests using a standardized payload format:

```typescript
interface BifrostRequest {
  question: string;           // User's natural language input
  chat_history: ChatMessage[]; // Conversation context
  metadata: {
    caller: string;           // Source identification (e.g., "friggs-gate-frontend")
    purpose: string;          // Request type (e.g., "user_query", "follow_up")
    timestamp: string;        // ISO 8601 timestamp
  };
  session: {
    user_id: string;          // User identification
    context: Record<string, any>; // Session-specific state
  };
  stream: boolean;            // Enable streaming responses
}
```

**HTTP Protocol Management:**

**RESTful Endpoints**: Primary communication through `/ask/invoke` endpoint with standardized HTTP methods.

**Content Negotiation**: Proper headers for JSON payload transmission and response format specification.

**Timeout Handling**: Configurable timeouts with graceful degradation for long-running operations.

**Retry Logic**: Exponential backoff retry mechanism for transient network failures.

**Authentication Integration**: Token-based authentication with automatic renewal and secure storage.

**CORS Configuration**: Proper cross-origin resource sharing settings for development and production environments.

## 5.2 Message State Management and Conversation Flow

The conversation state represents the core of user interaction within Frigg's Gate, requiring sophisticated state management patterns.

**Message State Structure:**

```typescript
interface ChatMessage {
  id: string;                 // Unique message identifier
  content: string;            // Message text content
  role: 'user' | 'assistant'; // Message author
  timestamp: string;          // Creation time
  sources?: SourceReference[]; // Associated citations
  metadata?: {
    model: string;            // AI model used
    processing_time: number;  // Response generation time
    confidence: number;       // Response confidence score
  };
  status: 'pending' | 'complete' | 'error'; // Processing state
}
```

**State Management Patterns:**

**Immutable Updates**: All message state changes create new state objects, enabling reliable re-rendering and debugging.

**Optimistic Updates**: User messages appear immediately with pending status, providing responsive interaction feedback.

**Progressive Enhancement**: Streaming responses update existing message objects incrementally, maintaining smooth conversation flow.

**Error Recovery**: Failed messages maintain error state with retry options, preserving conversation context.

**Context Management:**

**Conversation History**: Maintains full conversation context for backend submission, enabling context-aware responses.

**Context Pruning**: Intelligent trimming of old conversation history to manage payload size while preserving relevant context.

**Session Persistence**: Conversation state persists across component re-renders with planned support for cross-session persistence.

## 5.3 Real-time Updates and Streaming Responses

Frigg's Gate provides real-time streaming capabilities that create natural conversational flow and immediate user feedback.

**Streaming Implementation:**

**Server-Sent Events**: Utilizes browser-native streaming capabilities for efficient real-time communication.

**Incremental Updates**: Processes partial responses as they arrive, updating the interface progressively.

**Error Handling**: Robust error detection and recovery during streaming operations.

**Connection Management**: Automatic reconnection for dropped connections with state preservation.

**Technical Implementation:**

```typescript
const handleStreamingResponse = async (response: Response) => {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = JSON.parse(line.slice(6));
          updateMessageContent(data);
        }
      }
    }
  } catch (error) {
    handleStreamingError(error);
  }
};
```

**User Experience Benefits:**

**Immediate Feedback**: Users see responses beginning immediately, reducing perceived latency.

**Progress Indication**: Visual indicators show response generation progress, managing user expectations.

**Cancellation Support**: Users can interrupt long-running responses if needed.

**Graceful Degradation**: Fallback to non-streaming mode if streaming fails or is unsupported.

## 5.4 Error Handling and Fallback Mechanisms

Comprehensive error handling ensures Frigg's Gate remains functional and user-friendly even when backend services experience issues.

**Error Classification:**

**Network Errors**: Connection timeouts, DNS failures, and connectivity issues.

**Server Errors**: Backend service failures, overload conditions, and maintenance periods.

**Client Errors**: Invalid requests, authentication failures, and malformed data.

**Application Errors**: Component failures, state corruption, and unexpected conditions.

**Fallback Strategies:**

**Graceful Degradation**: Core functionality remains available even when advanced features fail.

**Cached Responses**: Previously successful responses cached for immediate availability during outages.

**Offline Mode**: Basic interface functionality maintained when backend services are unavailable.

**Alternative Endpoints**: Fallback to secondary service endpoints for critical operations.

**User Communication:**

**Clear Error Messages**: User-friendly explanations of issues without technical jargon.

**Recovery Instructions**: Specific guidance for users to resolve issues when possible.

**Status Updates**: Real-time communication about service status and expected resolution times.

**Support Integration**: Direct access to help resources and support channels from error states.

## 5.5 Feedback Data Collection and Transmission

Frigg's Gate implements comprehensive feedback collection to enable continuous system improvement while respecting user privacy.

**Feedback Data Types:**

**Explicit Feedback**: Direct user ratings, comments, and feature requests.

**Interaction Analytics**: User behavior patterns, feature usage, and workflow analysis.

**Performance Metrics**: Response times, error rates, and system performance indicators.

**Quality Metrics**: Response accuracy, source relevance, and user satisfaction indicators.

**Collection Implementation:**

```typescript
interface FeedbackData {
  type: 'rating' | 'comment' | 'interaction' | 'performance';
  timestamp: string;
  session_id: string;
  message_id?: string;
  data: {
    rating?: number;
    comment?: string;
    interaction_type?: string;
    performance_metric?: number;
  };
  metadata: {
    user_agent: string;
    screen_resolution: string;
    connection_type: string;
  };
}
```

**Privacy Protection:**

**Data Minimization**: Collection limited to essential improvement metrics.

**User Consent**: Clear opt-in mechanisms for analytics and feedback collection.

**Anonymization**: Personal identifiers removed or hashed before transmission.

**Retention Policies**: Automatic deletion of feedback data after defined retention periods.

**Transmission Security:**

**Encryption**: All feedback data encrypted during transmission using TLS 1.3.

**Batching**: Efficient transmission through batched requests to minimize network overhead.

**Retry Logic**: Reliable delivery with exponential backoff retry mechanisms.

**Queue Management**: Client-side queuing for offline scenarios with synchronized transmission when connectivity returns.

---

# 6. Styling and Visual Architecture

## 6.1 Tailwind CSS Utility-First Approach

Frigg's Gate leverages Tailwind CSS's utility-first methodology to create a maintainable, consistent, and performance-optimized styling system that supports the mythical gateway aesthetic.

**Utility-First Benefits:**

**Rapid Development**: Styles applied directly in components eliminate context switching between files and reduce cognitive overhead during development.

**Consistency**: Predefined spacing, sizing, and color scales ensure visual consistency across all interface elements.

**Performance**: Unused styles are automatically purged from production builds, resulting in minimal CSS bundle sizes.

**Customization**: Extensive configuration options enable alignment with Life Nervous System branding and visual identity.

**Tailwind Configuration for Frigg's Gate:**

```typescript
// tailwind.config.ts
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        frigg: {
          primary: '#1a1b3a',    // Deep mystical blue
          secondary: '#2d3561',  // Lighter mystical blue
          accent: '#4f46e5',     // Gateway portal accent
          surface: '#111827',    // Dark surface
          border: '#374151',     // Subtle borders
        },
        bifrost: {
          gradient: ['#8b5cf6', '#06b6d4'], // Rainbow bridge colors
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'], // Clean, modern typography
      },
      animation: {
        'pulse-slow': '



