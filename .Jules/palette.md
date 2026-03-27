
## 2024-05-20 - Enhanced Interactive Map Accessibility
**Learning:** Found multiple interactive custom elements (`<div>`) used as toggle buttons (for graph nodes and legends) without proper semantic HTML or screen reader support. This is a common pattern in complex visualization libraries or custom map UI components.
**Action:** Always replace interactive `onClick` `<div>` or `<span>` elements with semantic `<button>` elements and apply CSS resets (`background: 'transparent', border: 'none', padding: 0`) to maintain visual design while ensuring native keyboard accessibility and correct ARIA states (`aria-expanded`, `aria-label`).

## 2024-05-21 - Accessible Loading States
**Learning:** React applications often swap components or display loading messages (e.g., "Loading Schedule...", "Initializing tactical tree...") during data fetching. Screen readers may not announce these changes if they aren't explicitly flagged.
**Action:** Always add `role="status"` and `aria-live="polite"` to loading indicator elements (spinners, text messages) so that screen readers announce them to users relying on assistive technology, improving visibility of background processes.
## 2023-11-09 - SVGs in React Applications Must Explicitly Convey or Hide Their Meaning
**Learning:** Found that many inline `<svg>` elements used for crucial status icons (active, completed, paused) lacked attributes that screen readers use to identify meaning (`role="img"`, `<title>`, and `aria-label`). Without these, screen readers either ignore them or read out confusing node structure. Conversely, decorative icons (like toggle chevrons and branding logos) without `aria-hidden="true"` can introduce unnecessary "noise" for screen reader users.
**Action:** Always categorize `<svg>` elements as either 'meaningful' or 'decorative'. For meaningful SVGs, explicitly set `role="img"`, provide an `aria-label`, and use a `<title>` tag. For purely decorative ones, strictly apply `aria-hidden="true"`.
