
## 2024-05-20 - Enhanced Interactive Map Accessibility
**Learning:** Found multiple interactive custom elements (`<div>`) used as toggle buttons (for graph nodes and legends) without proper semantic HTML or screen reader support. This is a common pattern in complex visualization libraries or custom map UI components.
**Action:** Always replace interactive `onClick` `<div>` or `<span>` elements with semantic `<button>` elements and apply CSS resets (`background: 'transparent', border: 'none', padding: 0`) to maintain visual design while ensuring native keyboard accessibility and correct ARIA states (`aria-expanded`, `aria-label`).

## 2024-05-21 - Accessible Loading States
**Learning:** React applications often swap components or display loading messages (e.g., "Loading Schedule...", "Initializing tactical tree...") during data fetching. Screen readers may not announce these changes if they aren't explicitly flagged.
**Action:** Always add `role="status"` and `aria-live="polite"` to loading indicator elements (spinners, text messages) so that screen readers announce them to users relying on assistive technology, improving visibility of background processes.

## 2024-05-22 - SVG Accessibility Enhancements
**Learning:** Purely decorative SVGs, even when part of interactive elements like buttons, can cause screen readers to announce redundant or confusing information if not explicitly hidden. Conversely, standalone meaningful SVGs (like status indicators) need specific attributes to be properly announced by assistive technologies.
**Action:** Always add `aria-hidden="true"` to decorative SVGs. For meaningful SVGs that lack text equivalents, ensure they have `role="img"`, an explicit `aria-label`, and a nested `<title>` element to provide context to screen readers.
