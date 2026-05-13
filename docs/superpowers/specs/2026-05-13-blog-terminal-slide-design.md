# Blog Terminal Slide-Out

## Problem

The blog terminal (flow mode) has a broken collapse: clicking `<` hides the terminal body but leaves a 32px column, and there's no way to restore it. The terminal column occupies grid space even when visually collapsed.

## Design

Terminal slides off-screen to the right using CSS `translateX`, controlled by a fixed-position toggle button on the right viewport edge.

### Layout changes

- Remove `.terminal-column` from both blog page grids (`blog/index.astro` and `BlogPost.astro`)
- Blog index grid: `grid-template-columns: 200px 1fr` (was `200px 1fr 320px`)
- Blog post grid: `grid-template-columns: 200px 1fr auto` (was `200px 1fr auto auto` — removed the terminal column, TOC stays)
- The terminal renders as `position: fixed; right: 0; top: 48px;` (flow mode), overlaying content

### Slide behavior

- `transform: translateX(0)` → visible
- `transform: translateX(100%)` → collapsed (slides fully off-screen right)
- CSS transition: `transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)`
- `overflow-x: hidden` on `body` and `.blog-docs-layout` to prevent horizontal scroll
- When collapsed, the fixed terminal is off-screen and the content column fills the freed space

### Toggle button

- `position: fixed; right: 0; top: calc(48px + 0.5rem); z-index: 100`
- Always rendered at >1024px widths
- Icon: `<` when terminal is collapsed (click to open/drawer slides in), `>` when terminal is visible (click to close/drawer slides out)
- Same styling as current `.terminal-flow-minimize` — transparent bg, 1px border, accent color
- The button sits overlay-right on the terminal border when visible; when hidden it's at the same fixed position on the viewport edge

### State management

- Collapse state lives in `Terminal.jsx` as `collapsed` state (already exists and works in flow mode)
- No zustand store changes needed

### Responsive

- At <=1024px: both terminal and toggle button are `display: none` (same as today's media query for the column)
- Mobile (<=768px): unchanged — terminal fills viewport

### Files to modify

1. `src/terminal/Terminal.jsx` — rewrite flow mode rendering to use fixed positioning + translateX slide
2. `src/styles/global.css` — update `.terminal-flow` styles (remove width transition, add transform transition); add fixed button styles; add `overflow-x: hidden` to body
3. `src/pages/blog/index.astro` — remove `.terminal-column` wrapper, adjust grid, remove terminal-column styles, update media query
4. `src/layouts/BlogPost.astro` — remove `.terminal-column` wrapper, adjust grid, remove terminal-column styles, update media query
