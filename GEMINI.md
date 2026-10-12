# MathDuo AI Workspace Rules

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
- **Single Source of Action**: Only place the "Explain" button in the bottom navigation footer. Never put duplicate "Gia sư AI" buttons inside the results banner to avoid clutter.
- **Explain Drawer**:
  - Side drawer sliding in from the right edge with wide dimensions (`w-full sm:w-[480px] md:w-[540px] lg:w-[580px]`).
  - **No-Blur Backdrop**: Do NOT apply `backdrop-blur` on the drawer overlay or drawer header; keep the math exercise on the left crisp and clearly readable so students can cross-reference the problem while chatting with the AI.
  - **Side-by-Side Co-Viewing**: On desktop viewports (`xl:` and above), smoothly translate QuizCard to the left (`xl:-translate-x-52 2xl:-translate-x-64`) when the drawer opens to prevent overlap.
  - **Desktop Scroll Freedom**: Only lock `body.overflow` on mobile viewports (`< 640px`); allow desktop/tablet viewports to scroll freely so students can inspect any part of the problem.
  - Automatically initialize with a context-aware welcome message tailored to the student's submission.
  - Support bidirectional KaTeX rendering and deterministic message IDs.

## 4. Elementary Math Pedagogy & UI Ergonomics
- **Target Audience**: Elementary school students (Grades 1 to 5).
- **Spacious Card & Typography**:
  - Quiz Card width expanded to `max-w-4xl` / `max-w-5xl`.
  - Question titles scaled to `text-xl md:text-2xl font-semibold leading-relaxed`.
  - Option buttons with generous padding (`p-4 md:p-5`), large text (`text-base md:text-lg`), and prominent rounded badges (`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl`).
- **Clean Chat Input**:
  - Auto-resizing textarea with `resize-none overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden outline-none` up to 120px max height without clipping content or showing ugly native scrollbars.
  - Child-friendly typography: `text-sm sm:text-base` to prevent iOS mobile auto-zoom and keep font comfortably readable.
  - Short, child-friendly placeholders (`"Hỏi Cú Vàng (ví dụ: 'Vì sao lại như vậy nè?')..."`).
  - Conceal complex technical KaTeX markdown disclaimers from children; provide simple key tips instead.
  - Quick math snippets and suggestion chip bars with horizontal scrollbar suppression (`[scrollbar-width:none] [&::-webkit-scrollbar]:hidden`).
- **Persona Tone**: Warm, patient, encouraging, using respectful and friendly Vietnamese forms of address ("Thầy/Cô - Em" or "Cú Vàng - Bạn nhỏ").
- **Concrete Visual Explanations**: Explain mathematical core principles through real-life tangible metaphors (sharing candies 🍬, counting pencils ✏️, pizza slices 🍕, apples 🍎, or tally sticks). Avoid abstract university-level formulas.
- **Encouragement Loop**: Always praise effort and curiosity regardless of whether the answer was correct or incorrect.
- **Storytelling Flow**: When asked "vì sao lại vậy", explain step-by-step from scratch like telling an engaging, joyful story.

## 5. Gemini AI Integration via `@google/genai`
- **SDK**: Use official `@google/genai` package (`import { GoogleGenAI } from "@google/genai"`).
- **Initialization**: `const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });`
- **Model**: `gemini-2.5-flash` (or configurable via `process.env.GEMINI_MODEL`).
- **API Method**: `ai.models.generateContent({ model, contents, config: { systemInstruction, temperature: 0.7 } })`.
- **Conversation Turn Safety**:
  - Ensure the first turn in `contents` has `role: 'user'` to avoid API 400 turn sequence errors when initializing chats.
  - Strictly normalize turns with `buildGeminiContents`: merge consecutive turns with the same role into multiple parts to maintain `user` ⇄ `model` alternation, and guarantee the conversation ends on a `user` turn before generation.
- **Graceful Fallback**:
  - If `GEMINI_API_KEY` is missing or the external API call fails, seamlessly fall back to `generateLocalAIResponse` with explicit offline status indicators (`status: 'no_api_key'` or `'api_error'`).
  - The fallback engine must be 100% context-aware across all question IDs (`q1` through `q4`) for visual analogies, rapid calculation tricks, and similar practice exercises.

