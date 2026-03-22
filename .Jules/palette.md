
## 2024-05-20 - Enhanced Interactive Map Accessibility
**Learning:** Found multiple interactive custom elements (`<div>`) used as toggle buttons (for graph nodes and legends) without proper semantic HTML or screen reader support. This is a common pattern in complex visualization libraries or custom map UI components.
**Action:** Always replace interactive `onClick` `<div>` or `<span>` elements with semantic `<button>` elements and apply CSS resets (`background: 'transparent', border: 'none', padding: 0`) to maintain visual design while ensuring native keyboard accessibility and correct ARIA states (`aria-expanded`, `aria-label`).
