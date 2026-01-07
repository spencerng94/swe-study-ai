# Frontend JavaScript Fundamentals - Design Document

## UI Layout Proposal

### Structure
- **Header Section**: Title, description, and metadata (13 concepts, ~5 min each)
- **Collapsible Concept Cards**: Each concept is a card that expands/collapses
  - Numbered badge (1-13) for visual ordering
  - Title
  - Chevron icon for expand/collapse state
- **Expanded Content** (7 sections per concept):
  1. **Definition** (with checkmark icon) - One clear sentence
  2. **Why Interviewers Care** (with lightbulb icon) - Blue info box
  3. **Mental Model** (with heading) - Gray background box with plain English
  4. **Code Example** (with code icon) - Syntax-highlighted code blocks
  5. **Live UI Example** - Interactive demo with inputs/buttons
  6. **Interview Question** (with message icon) - Yellow highlight box
  7. **Strong Answer** (with heading) - Green highlight box

### Design Principles
- **Scannable**: Clear visual hierarchy, icons for quick recognition
- **Interactive**: Live examples reinforce learning
- **Focused**: No walls of text, each section is digestible
- **Professional**: Matches Salesforce Lightning Design System

## Concept Order & Reasoning

### Phase 1: JavaScript Foundations (Concepts 1-5)
1. **Pure vs Impure Functions** ✅ (IMPLEMENTED)
   - Foundation for understanding React patterns
   - Easy entry point, builds confidence

2. **Immutability**
   - Directly follows from pure functions
   - Core to React's philosophy

3. **Referential Equality**
   - Needed to understand why immutability matters
   - Critical for React optimization

4. **Closures**
   - Fundamental JS concept used everywhere
   - Needed before React hooks

5. **JavaScript Event Loop**
   - Critical for async understanding
   - Explains Promise vs setTimeout behavior

### Phase 2: React Basics (Concepts 6-7)
6. **Props vs State**
   - Core React concept, must understand early

7. **Controlled vs Uncontrolled Components**
   - Common React pattern, builds on props/state

### Phase 3: React Hooks (Concepts 8-10)
8. **useState vs useRef**
   - Hook comparison, practical decision-making

9. **useEffect Common Pitfalls**
   - Most misunderstood hook, needs dedicated focus

10. **Derived State**
    - Common React pattern, prevents anti-patterns

### Phase 4: React Internals (Concepts 11-12)
11. **Why React Re-renders**
    - Core understanding of React's rendering model

12. **Memoization (useMemo / useCallback)**
    - Performance optimization, builds on re-render understanding

### Phase 5: Browser/DOM (Concept 13)
13. **Event Delegation**
    - DOM/browser concept, rounds out frontend knowledge

## Implementation Status

✅ **Concept 1: Pure vs Impure Functions** - Fully implemented as reference pattern
- All 7 sections complete
- Interactive live example with input fields and call history
- Code examples showing both correct and incorrect usage
- Interview question and strong answer included

## Next Steps

The remaining 12 concepts should follow the exact same pattern established in Concept 1. Each will have:
- Same 7-section structure
- Interactive live example
- Production-quality code
- Interview-focused content
