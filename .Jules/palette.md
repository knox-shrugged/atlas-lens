## 2024-03-23 - SVG Accessibility in React Graph
**Learning:** Purely visual status indicators (like colored circle SVGs on graph nodes) are completely ignored by screen readers if they lack semantic attributes. Decorative SVGs in legends can also create redundant noise.
**Action:** For meaningful SVGs (like status indicators), always add `role="img"`, an `aria-label`, and a nested `<title>`. For decorative SVGs, always add `aria-hidden="true"` to hide them from assistive technologies.
