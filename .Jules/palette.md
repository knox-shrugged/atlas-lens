
## 2024-05-20 - Enhanced Interactive Map Accessibility
**Learning:** Found multiple interactive custom elements (`<div>`) used as toggle buttons (for graph nodes and legends) without proper semantic HTML or screen reader support. This is a common pattern in complex visualization libraries or custom map UI components.
**Action:** Always replace interactive `onClick` `<div>` or `<span>` elements with semantic `<button>` elements and apply CSS resets (`background: 'transparent', border: 'none', padding: 0`) to maintain visual design while ensuring native keyboard accessibility and correct ARIA states (`aria-expanded`, `aria-label`).

## 2024-05-21 - Accessible Loading States
**Learning:** React applications often swap components or display loading messages (e.g., "Loading Schedule...", "Initializing tactical tree...") during data fetching. Screen readers may not announce these changes if they aren't explicitly flagged.
**Action:** Always add `role="status"` and `aria-live="polite"` to loading indicator elements (spinners, text messages) so that screen readers announce them to users relying on assistive technology, improving visibility of background processes.

## 2025-03-23 - SVG Accessibility and Global Focus States
**Learning:** Found multiple SVGs across the application acting as either meaningful content (status indicators in graph nodes) or purely decorative elements (icons inside labeled buttons, structural icons) lacking proper semantic labeling. Also noticed a lack of consistent, accessible keyboard focus indicators across interactive components.
**Action:** For meaningful SVGs conveying critical state (like 'Active' or 'Paused'), always add `role="img"`, a descriptive `aria-label`, and a nested `<title>` tag for hover tooltips. For decorative SVGs, explicitly add `aria-hidden="true"` to prevent redundant screen reader announcements. Additionally, ensure a global `*:focus-visible` CSS rule is implemented to guarantee keyboard users have a clear visual indication of their current focus context without impacting mouse users.
