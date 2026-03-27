
## 2024-05-20 - Enhanced Interactive Map Accessibility
**Learning:** Found multiple interactive custom elements (`<div>`) used as toggle buttons (for graph nodes and legends) without proper semantic HTML or screen reader support. This is a common pattern in complex visualization libraries or custom map UI components.
**Action:** Always replace interactive `onClick` `<div>` or `<span>` elements with semantic `<button>` elements and apply CSS resets (`background: 'transparent', border: 'none', padding: 0`) to maintain visual design while ensuring native keyboard accessibility and correct ARIA states (`aria-expanded`, `aria-label`).

## 2024-05-21 - Accessible Loading States
**Learning:** React applications often swap components or display loading messages (e.g., "Loading Schedule...", "Initializing tactical tree...") during data fetching. Screen readers may not announce these changes if they aren't explicitly flagged.
**Action:** Always add `role="status"` and `aria-live="polite"` to loading indicator elements (spinners, text messages) so that screen readers announce them to users relying on assistive technology, improving visibility of background processes.
## 2024-05-28 - Meaningful vs Decorative SVGs
**Learning:** React SVG icons need explicit accessibility context. Icons alone are either invisible to screen readers or announce redundantly. Status indicators (meaningful) require `role="img"`, `aria-label`, and a `<title>` tag for correct screen reader announcement, while purely decorative icons (like toggle chevrons or icons with adjacent visible text labels) must have `aria-hidden="true"` to reduce noise.
**Action:** When adding or auditing SVGs in UI components, consciously evaluate if the SVG provides unique information or is purely visual. Apply the correct ARIA attributes based on this classification to ensure a clean and informative screen reader experience.
