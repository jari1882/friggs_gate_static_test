# TODOS

**Author:** Rod Rishel  
**Purpose:** Ongoing documentation of technical debt, refactoring opportunities, and architectural improvements

---

## Entry #1: Styling Architecture Review
**Date:** June 16, 2025  
**Category:** Frontend Architecture  
**Context:** Styling system audit and improvement recommendations

## Current State Assessment

Our codebase has extensive one-off customization patterns that indicate opportunities for systematic refinement. The styling approach mixes multiple methodologies without clear governance.

## Areas for Future Refinement

### 1. **Color Token Consolidation** (High Priority)
- **Issue**: Hardcoded RGB values scattered throughout components
- **Examples**: `rgb(58, 58, 61)`, `rgb(78,78,81)` appear 8+ times
- **Refactor**: Create centralized color tokens in Chakra theme
- **Impact**: Easier theme switching, consistent brand colors

### 2. **Spacing System Standardization** (Medium Priority)  
- **Issue**: Magic numbers for margins/padding (`marginTop={"10px"}`, `paddingBottom={"10px"}`)
- **Refactor**: Use Chakra's spacing scale or Tailwind spacing utilities
- **Impact**: Consistent rhythm, easier responsive design

### 3. **Component State Styling** (Medium Priority)
- **Issue**: Complex conditional styling logic in components
- **Examples**: Feedback color management, highlighted state toggles
- **Refactor**: Move state-based styling to Chakra variants or custom hooks
- **Impact**: Cleaner component code, reusable patterns

### 4. **Layout Utility Consolidation** (Low Priority)
- **Issue**: Repeated complex className combinations
- **Examples**: `"flex flex-col items-center p-8 rounded grow max-h-full"`
- **Refactor**: Create reusable layout components or CSS classes
- **Impact**: Reduced duplication, faster development

## Technical Debt Notes

The current one-off customization pattern suggests rapid prototyping phase. While functional, it creates maintenance overhead and inconsistent user experience. Consider this refactor when:

1. Adding new major features requiring consistent theming
2. Implementing dark/light mode toggle
3. Expanding component library
4. Onboarding new developers

## Recommended Approach

Incremental refactor rather than big-bang rewrite. Start with color tokens as they have highest impact and lowest risk.

---
*Note: This assessment reflects current codebase state as of June 2025. Patterns may evolve with development priorities.*