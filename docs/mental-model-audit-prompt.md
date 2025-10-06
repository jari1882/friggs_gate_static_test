# Mental Model Audit Prompt for ChatGPT/Claude

## Objective
Systematically verify that `friggs_gate/docs/mental-model.md` accurately reflects the working codebase in `friggs_gate/`. Identify ALL inconsistencies, missing features, aspirational content, and outdated information.

## Instructions

You are conducting a **line-by-line audit** of the mental model documentation against the actual codebase. For every claim made in the mental model, you must verify it exists and behaves as described.

### Phase 1: File & Path Verification

**For each file mentioned in the mental model:**

1. **Check existence**: Does the file exist at the exact path specified?
2. **Check completeness**: Are all functions/components mentioned actually present?
3. **Document aspirational references**: If mentioned but doesn't exist, mark as `[ASPIRATIONAL]`

**Specific files to verify:**
- `app/components/ChatWindow.tsx`
- `app/components/StructuredInput.tsx`
- `app/components/StructuredOutputDock.tsx`
- `app/components/ThemeToggle.tsx`
- `app/components/FontSelector.tsx`
- `app/components/MemorySlider.tsx`
- `app/components/ChatMessageBubble.tsx`
- `app/components/EmptyState.tsx`
- `app/components/AutoResizeTextarea.tsx`
- `app/hooks/useFriggState.ts`
- `app/hooks/useWorkspaceCoordinator.ts`
- `app/hooks/useWebSocket.ts`
- `app/services/responseInterpreter.ts` ⚠️ **VERIFY THIS EXISTS**
- `app/services/connectionService.ts`
- `app/utils/constants.tsx`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `tailwind.config.ts`
- `package.json`
- `.env.example`

**For each file that exists:**
- Read the actual implementation
- Compare line numbers referenced in mental model to actual code
- Verify function names match (e.g., `sendMessage()`, `detectAgents()`, `mapAgentsToActions()`)

**Output format:**
```
FILE: app/services/responseInterpreter.ts
STATUS: ❌ DOES NOT EXIST
MENTAL MODEL REFERENCES: Lines 17, 321, 333-346, 584, 641
RECOMMENDATION: Mark as [ASPIRATIONAL - PLANNED FEATURE] or remove
```

### Phase 2: Architecture Pattern Verification

**For each architectural claim, verify:**

#### 2.1 Component Hierarchy (Mental Model lines 80-95)
- [ ] ChatWindow is sole child of page.tsx?
- [ ] Header strip exists with exact components listed?
- [ ] Three-panel layout (left/center/right) in flex-row?
- [ ] Conditional rendering of panels matches description?
- [ ] Message container uses flex-col-reverse?

**Compare mental model diagram to actual JSX structure in ChatWindow.tsx**

#### 2.2 State Management Split (Lines 204-280)
- [ ] useFriggState contains exactly what's listed?
- [ ] useWorkspaceCoordinator contains exactly what's listed?
- [ ] Any properties in code NOT mentioned in mental model?
- [ ] Any properties in mental model NOT in code?
- [ ] Is there duplication (e.g., panel minimization state)?

**Specific checks:**
```typescript
// Mental model claims (line 218-232)
interface FriggState {
  isDarkMode: boolean;
  selectedFont: string;
  structuredInputWidth: number;
  isStructuredInputMinimized: boolean;  // ⚠️ CHECK IF THIS EXISTS IN FRIGG STATE
  // ... verify ALL properties
}
```

Compare to actual implementation in `app/hooks/useFriggState.ts`

#### 2.3 WebSocket Communication (Lines 283-346)
- [ ] Does `useWebSocket.ts` match described pattern?
- [ ] Is there a "5 radio frequencies" pattern or is it simpler?
- [ ] Does responseInterpreter.ts exist and handle agent detection?
- [ ] Are there intelligence signals/UI control instructions?
- [ ] Or is it just simple request-response?

**Compare mental model "Intelligence Stream" to actual WebSocket implementation**

#### 2.4 Styling System (Lines 351-396)
- [ ] Is there ONLY globals.css + Tailwind (no component CSS)?
- [ ] Are Google Fonts imported in globals.css line 1?
- [ ] Viewport setup at lines 7-21 in globals.css?
- [ ] Custom scrollbar styles at lines 48-71?
- [ ] No CSS-in-JS libraries used?

### Phase 3: Feature-by-Feature Verification

**For each feature described, verify it works as documented:**

#### 3.1 Panel Resizing (Lines 155-166, 184-193)
- [ ] Can left panel resize from 200px min to 60% screen max?
- [ ] Can right panel resize similarly?
- [ ] Resize handle at exact position described?
- [ ] Hover states on resize handle?
- [ ] useResizeObserver tracking chat area width?

**Check actual resize logic in StructuredInput.tsx and StructuredOutputDock.tsx**

#### 3.2 Panel Minimization (Lines 157, 185)
- [ ] Do panels collapse to 12px strips?
- [ ] Toggle button shows correct chevron?
- [ ] Content hidden when minimized?
- [ ] Which store manages minimization state (FriggState or WorkspaceCoordinator)?

#### 3.3 Tool Forms (Lines 119-151, 568-586)
- [ ] QuickQuote form has exact fields listed?
- [ ] LifeExpectancy form has exact fields listed?
- [ ] Validation functions exist as described?
- [ ] Auto-focus on first input when tool selected?
- [ ] Enter key submits form?

**Verify ToolType union matches**: `'QuickQuote' | 'LifeExpectancy'`

#### 3.4 Theme System (Lines 19, 423)
- [ ] ThemeToggle component exists and imported?
- [ ] FontSelector component exists and imported?
- [ ] Font options match mental model list (lines 77-89)?
- [ ] Dark mode toggles correctly?

**Check which components are actually rendered in ChatWindow.tsx header**

#### 3.5 Memory System (Lines 38, 42, 204, 237-239, 427-432)
- [ ] MemorySlider component rendered in header?
- [ ] 15 memory slots as described?
- [ ] selectMemory action exists?
- [ ] Memory state persists in useFriggState?

#### 3.6 Empty State (Lines 585-601, 59, 318)
- [ ] EmptyState component with suggestion buttons?
- [ ] showEmptyStateButtons boolean exists?
- [ ] hideEmptyStateButtons() function exists?
- [ ] Buttons hidden after first message?

### Phase 4: Quick Reference Table Verification (Lines 7-25)

**Verify EACH row in the table:**

| Want to Change... | Edit This File | Verify Exists | Verify Section/Function Exists |
|-------------------|---------------|---------------|-------------------------------|
| Chat UI behavior | ChatWindow.tsx | ✓/✗ | sendMessage()? JSX layout? |
| Left panel forms | StructuredInput.tsx | ✓/✗ | Form state? Validation? |
| Right panel display | StructuredOutputDock.tsx | ✓/✗ | Content rendering? |
| Global styles | globals.css | ✓/✗ | Any CSS rule? |
| UI state management | useFriggState.ts | ✓/✗ | Store properties? |
| Workspace logic | useWorkspaceCoordinator.ts | ✓/✗ | Tool coordination? |
| Backend response handling | responseInterpreter.ts | ✓/✗ | Agent detection patterns? ⚠️ |
| App-wide constants | utils/constants.tsx | ✓/✗ | Configuration values? |
| Theme/font controls | ThemeToggle.tsx or FontSelector.tsx | ✓/✗ | Component logic? |
| API communication | ChatWindow.tsx | ✓/✗ | sendMessage()? payload structure? |

### Phase 5: Code Examples Verification (Lines 98-353)

**For each code snippet in mental model:**
1. Find the actual file
2. Locate the referenced section
3. Compare code structure to mental model example
4. Note any differences in:
   - Variable names
   - Function signatures
   - Type definitions
   - Implementation details

**Example check:**
```typescript
// Mental model shows (line 100):
const [messages, setMessages] = useState<Message[]>([]);

// Verify in ChatWindow.tsx line ~66:
// Does this exact line exist?
// Is Message type imported correctly?
```

### Phase 6: Development Workflow Verification (Lines 444-546)

- [ ] `yarn dev` command starts dev server?
- [ ] Hot reload works as described?
- [ ] Build/start/lint commands in package.json?
- [ ] Essential dependencies listed are installed? (lines 432-441)
- [ ] DOMPurify and marked packages installed?
- [ ] Zustand for state management?

### Phase 7: Configuration Files (Lines 399-430)

- [ ] tailwind.config.ts exists and accessible?
- [ ] package.json has scripts listed (lines 420-429)?
- [ ] .env.example exists?
- [ ] NEXT_PUBLIC_API_BASE_URL documented?

### Phase 8: Undocumented Features Scan

**Search codebase for features NOT mentioned in mental model:**
- [ ] Check `app/config/` directory - is it documented?
- [ ] List all components in `app/components/` - any missing from mental model?
- [ ] List all hooks in `app/hooks/` - any missing?
- [ ] List all services in `app/services/` - any missing?
- [ ] Check for PDF/image/file handling features
- [ ] Check for command system (`/pdf`, `/spreadsheet`, etc.)

### Phase 9: Aspirational vs. Reality Classification

**For each inconsistency found, classify:**

**Category A: MISSING (File/feature doesn't exist)**
- Mark as `[ASPIRATIONAL - PLANNED]` if it's a future feature
- Mark as `[OBSOLETE - REMOVE]` if it's outdated documentation

**Category B: PARTIAL (File exists but behavior differs)**
- Mark as `[INACCURATE - UPDATE NEEDED]`
- Provide exact diff between documented and actual

**Category C: OUTDATED (Feature was changed/refactored)**
- Mark as `[OUTDATED - REFACTORED]`
- Document what changed and when

**Category D: UNDOCUMENTED (Exists in code, missing from mental model)**
- Mark as `[UNDOCUMENTED - ADD TO MENTAL MODEL]`

## Output Format

Produce a structured report with the following sections:

### Executive Summary
- Total inconsistencies found: X
- Critical issues (missing files): X
- Accuracy score: X%
- Recommended actions: Priority list

### Detailed Findings

#### 1. Missing Files
```
FILE: app/services/responseInterpreter.ts
REFERENCED AT: mental-model.md lines 17, 321, 333-346, 584, 641
STATUS: Does not exist
CLASSIFICATION: [ASPIRATIONAL - PLANNED] or [OBSOLETE - REMOVE]?
RECOMMENDATION: Add disclaimer or remove references
IMPACT: HIGH - Developers will search for non-existent file
```

#### 2. Inaccurate Descriptions
```
FEATURE: Panel minimization state management
MENTAL MODEL CLAIMS: Lives in useFriggState (line 222-223)
ACTUAL REALITY: Duplicated in both useFriggState AND useWorkspaceCoordinator
DISCREPANCY: Mental model doesn't explain the duplication pattern
CLASSIFICATION: [INACCURATE - UPDATE NEEDED]
RECOMMENDATION: Explain why state exists in both stores
IMPACT: MEDIUM - May cause confusion about which store to use
```

#### 3. Undocumented Features
```
FEATURE: Config directory centralization
LOCATION: app/config/content.ts, theme.ts, commands.ts, fonts.ts
MENTAL MODEL: No mention
CLASSIFICATION: [UNDOCUMENTED - ADD TO MENTAL MODEL]
RECOMMENDATION: Add section explaining config centralization pattern
IMPACT: LOW - Pattern is discoverable but should be documented
```

#### 4. Aspirational Content
```
FEATURE: Agent detection and responseInterpreter
MENTAL MODEL CLAIMS: "Intelligence Bridge" with detectAgents(), mapAgentsToActions()
ACTUAL REALITY: Simple WebSocket request-response, no agent system
CLASSIFICATION: [ASPIRATIONAL - MARK AS FUTURE FEATURE]
RECOMMENDATION: Add "[PLANNED]" prefix and move to "Future Features" section
IMPACT: HIGH - Developers expect functionality that doesn't exist
```

### Recommended Edits

For each finding, provide:
1. **Exact line numbers** in mental-model.md to edit
2. **Suggested replacement text** or disclaimer to add
3. **Priority level** (Critical/High/Medium/Low)

**Example:**
```markdown
EDIT #1 - Priority: CRITICAL
Location: mental-model.md line 17
Current text: "Backend response handling | `app/services/responseInterpreter.ts` | Agent detection patterns"
Suggested change: "Backend response handling | `app/services/responseInterpreter.ts` | **[PLANNED]** Agent detection patterns"
OR: Remove this row entirely if not planned

EDIT #2 - Priority: HIGH
Location: mental-model.md lines 283-346 (entire WebSocket section)
Current text: Describes complex "5 radio frequencies" pattern
Suggested change: Rewrite to reflect actual connectionService.ts implementation:
---
## 🌐 WebSocket Communication Mental Model

### The Communication Hub: `app/hooks/useWebSocket.ts`
Uses `WebSocketConnectionService` from `app/services/connectionService.ts` for simple request-response:
- Send text message → receive text response
- Auto-reconnect on disconnect (5 attempts, 3s delay)
- Connection status monitoring

**[PLANNED] Future Intelligence Features:**
- Agent detection via responseInterpreter.ts
- UI control signals
- Multi-frequency communication patterns
---
```

## Success Criteria

Your audit is complete when you can answer "YES" to:

- [ ] Every file reference verified (exists or marked aspirational)
- [ ] Every function/component mentioned verified in actual code
- [ ] Every code example spot-checked against real implementation
- [ ] Every architectural claim validated or corrected
- [ ] All undocumented features catalogued
- [ ] Clear classification for each inconsistency
- [ ] Specific line-by-line edit recommendations provided
- [ ] Priority levels assigned to all fixes

## Special Focus Areas

Pay extra attention to:

1. **app/services/responseInterpreter.ts** - Does NOT exist, heavily referenced
2. **State duplication** - Panel minimization in two stores
3. **WebSocket architecture** - Simpler than documented
4. **FontSelector** - Exists but not used
5. **Config directory** - Not documented
6. **Command system** - (/pdf, /spreadsheet, /png) - Not documented
7. **Memory system** - Underdocumented

## Tools & Approach

1. Start with file tree: `find friggs_gate/app -type f -name "*.ts" -o -name "*.tsx" | grep -v node_modules`
2. For each mental model file reference, use `ls -la` to verify existence
3. Use `grep` to search for function names mentioned in mental model
4. Read full file contents to verify behavior matches description
5. Create diff between documented and actual for mismatches

## Final Deliverable

A comprehensive markdown report that can be used to:
1. Update mental-model.md with corrections
2. Add `[ASPIRATIONAL]` or `[PLANNED]` tags where appropriate
3. Document undiscovered features
4. Create a "Future Features" section for planned work
5. Ensure developers can trust the mental model as a reliable guide

Begin the audit now. Work systematically through each phase. Document EVERYTHING you find.
