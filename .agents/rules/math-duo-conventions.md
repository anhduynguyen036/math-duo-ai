# MathDuo AI Architectural & UI Standards

## 1. Theme Management (Dark / Light Mode)
- **Class Trigger**: Apply `dark` on `document.documentElement` (`<html class="dark">`).
- **Persistence**: Store preference under localStorage key `'math-duo-theme'`.
- **State Synchronization**: Use `useSyncExternalStore` with a `MutationObserver` on `attributeFilter: ['class']` to read and subscribe to theme changes without cascading render cycles or React 19 warnings.
- **Ambient Background**: Maintain `.ambient-grid-background` with dual radial glow (top violet `#8b5cf6`, bottom-right emerald/teal `#14b8a6`) and subtle dot grid across both themes.

## 2. KaTeX Mathematical Formulas
- **Tokenizer**: Use the hardened delimiter regex `(\$\$[\s\S]*?\$\$|\$(?:[^\$\n]|\\\$)+?\$)/g` to distinguish block math (`$$...$$`) from inline math (`$...$`).
- **Color Inheritance**: All `.katex` and `.katex-display` rules must set `color: inherit;` so mathematical symbols automatically match their parent typography (badges, buttons, chat bubbles).
- **Semantics**: Do not nest block-level elements (`<div>`) inside `<button>`; use `<span>` with `block` or `inline-block` for formulas inside button controls.

## 3. Quiz State & Explain Flow
- **Gating**: The "Explain" button must remain completely unmounted (`isSubmitted === false`) prior to submission.
- **Post-Submission**: Fade in smoothly using `.animate-fade-in` (`isSubmitted === true`).
- **Explain Drawer**:
  - Side drawer sliding in from the right edge with a blurred backdrop.
  - Automatically initialize with a context-aware welcome message tailored to the student's submission.
  - Support bidirectional KaTeX rendering and deterministic message IDs.
