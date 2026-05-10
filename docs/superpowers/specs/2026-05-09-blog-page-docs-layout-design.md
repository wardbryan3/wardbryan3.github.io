# Blog Page Redesign: Docs-Style Layout

## Overview

Redesign all blog pages (index and individual posts) with a documentation-style three-column layout. Fix the left sidebar width, add an auto-generated table of contents, move the terminal into the document flow with height constrained between header and footer, and persist terminal state across page navigation via sessionStorage.

## Goals

- Three-column docs layout: left nav | content | right TOC
- Left sidebar narrowed to ~200px (from current 240-260px)
- Auto-generated TOC sidebar from h2/h3 headings (on individual post pages)
- Terminal moves from fixed/overlaid positioning into the document flow (pushes content)
- Terminal height constrained between header/nav and footer (not full viewport)
- Terminal state (command history, output lines) persists across page navigation
- Same layout applied to blog index page (minus per-post TOC)
- Responsive: right columns collapse on smaller screens

## Layout Structure

```
+------------------------------------------------------------------+
|  Nav (full width, ~48px)                                         |
+----------+-------------------+----------+------------------------+
| Left     | Content           | TOC      | Terminal               |
| sidebar  |                   | (auto    | (collapsible,          |
| ~200px   | 1fr               | from     | pushes content)        |
|          |                   | h2/h3)   | ~320px                 |
| Posts    |                   | ~180px   |                        |
| list     |                   |          |                        |
+----------+-------------------+----------+------------------------+
|  Footer (full width)                                              |
+------------------------------------------------------------------+
```

Grid definition: `200px 1fr auto auto`

- The terminal is part of the CSS Grid layout (not fixed position)
- When terminal is collapsed, content + TOC expand to fill available space
- TOC column width auto-sizes based on content
- Terminal column has a fixed minimum width when expanded

## Component Changes

### 1. `BlogPost.astro` — New Layout

Replace the current flex layout with a CSS Grid that includes four columns:
- **Left sidebar:** Existing `BlogSidebar`, width changed from 240-260px to 200px
- **Content area:** Blog post article, same content as now
- **TOC sidebar:** New auto-generated table of contents from h2/h3 headings
- **Terminal:** No longer rendered by `BaseLayout` — instead rendered here as part of the grid

Props: add `headings` or a way to generate TOC from content.

### 2. `BlogSidebar.astro` — Width Fix

- Change `min-width: 240px; max-width: 260px` to `min-width: 200px; max-width: 200px`
- Keep existing styling otherwise

### 3. TOC Component (New)

Create `src/components/TableOfContents.astro` (or `.jsx` for interactivity):
- Takes an array of headings: `{ id, text, level }[]`
- Renders a nested list of links
- Active heading highlight on scroll (client JS needed)
- Styled to match docs theme: small font, muted text, accent for active

For the static version (no JS), render all heading links. For the interactive version:
- Use `IntersectionObserver` to track which heading is in view
- Highlight active heading in the TOC
- Smooth scroll on click

### 4. `Terminal.jsx` — Layout Mode

Add a new layout mode between the current `side=false` (floating window) and `side=true` (fixed sidebar):
- **`side="fixed"`** — current behavior (fixed position, full viewport height) — keep for non-blog pages
- **`side="flow"`** — new mode for blog pages — positioned in document flow via CSS Grid, height constrained by parent container
- Or simpler: use a new prop like `flow={true}` or `inLayout={true}`

In `flow` mode:
- No `position: fixed`, no absolute positioning
- Renders as a regular block element
- Height fills parent container (grid area)
- Minimize/collapse behavior uses width transition instead of translateX
- No titlebar, no resize handle, no drag
- Has a minimize button and Ctrl+K shortcut
- No Tux art or fastfetch animation (same as current sidebar mode)

### 5. `BaseLayout.astro` — No Longer Renders Terminal

Since the terminal becomes part of the page layout (not a global fixed element), `BaseLayout` should stop rendering it on blog pages. BlogPost will include it directly in the grid.

For non-blog pages (projects, etc.), keep the current `side={true}` fixed sidebar behavior.

### 6. Terminal State Persistence

**Current:** All state is local React state — resets on every page navigation.

**Change:** Add `sessionStorage` persistence:

- On mount, check `sessionStorage` for saved terminal state
- Restore `outputLines` and `history` if available
- On each new `outputLines` change, save to `sessionStorage`
- On `clear` command, clear both the display and sessionStorage
- Key: `'terminal-state-v1'` or similar

State to persist:
```js
{
  outputLines: { type: 'input'|'output', text?, content? }[],
  history: string[],
}
```

The `content` field contains React elements which can't be serialized. Take one of these approaches:

**Recommended approach:** Re-execute commands from history on mount.
- Save only the text of each input command to sessionStorage
- On page load, replay the inputs through the command registry to regenerate output
- This avoids serializing JSX and handles the case where commands may produce different output on different pages

**Simpler fallback:** Just save `outputLines` with a `type` and `text` field (for inputs), and for outputs save a plain-text description. Skip JSX outputs (like the `top` command display).

**Simplest approach (recommended for now):** Save command history strings, and on mount, render them as input-only entries (no re-execution). This means the terminal shows what you typed before but the output area is fresh. The user can re-run commands if needed.

### 7. Blog Index Page (`/blog`)

Currently renders the latest post. Keep this behavior, but apply the new layout:
- Left sidebar: blog post list
- Content: latest post or post listing
- Right TOC: Not applicable (no single article) — show nothing or a placeholder
- Terminal: in flow mode

Alternative: instead of showing the latest post, show a listing of all posts in the content area. Let's keep showing the latest post for now.

### 8. Blog Post Pages (`/blog/[...slug]`)

Same layout as index but:
- Content: the individual blog post
- TOC: auto-generated from post headings
- Terminal: in flow mode

## CSS Changes

### Grid Layout

Add a CSS Grid layout class for blog pages:

```css
.blog-docs-layout {
  display: grid;
  grid-template-columns: 200px 1fr auto auto;
  grid-template-rows: 1fr;
  min-height: calc(100vh - 48px - 60px); /* viewport - nav - footer */
}
```

### Terminal Flow Mode

Replace the fixed-position sidebar styles with flow-mode styles:

```css
.terminal-flow {
  /* No position: fixed */
  /* Part of the grid */
  width: 320px;
  border-left: 1px solid var(--border);
  background: var(--surface);
  display: flex;
  flex-direction: column;
  transition: width 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  overflow: hidden;
}

.terminal-flow.terminal-collapsed {
  width: 32px;
}
```

### TOC Styles

```css
.toc-sidebar {
  width: 180px;
  border-left: 1px solid var(--border);
  padding: 1.5rem 1rem;
  overflow-y: auto;
}
```

### Responsive Breakpoints

- At 1024px: terminal collapses to a narrow tab
- At 768px: TOC collapses, moves inline below article header
- At 640px: left sidebar collapses, hamburger menu or full-width content

## Responsive Behavior

| Breakpoint | Left Sidebar | TOC | Terminal |
|---|---|---|---|
| >1200px | Shown | Shown | Shown |
| 1024-1200px | Shown | Shown | Collapsed (tab) |
| 768-1024px | Shown | Collapsed (moved inline) | Collapsed (tab) |
| <768px | Collapsed | Inline | Minimized tab |

## Files to Modify

1. `src/styles/global.css` — Add grid layout classes, TOC styles, terminal flow styles
2. `src/layouts/BaseLayout.astro` — Add RSS autodiscovery link in <head>; remove terminal rendering for blog pages (add prop to skip)
3. `src/layouts/BlogPost.astro` — Replace flex layout with CSS Grid, add TOC, add terminal
4. `src/components/BlogSidebar.astro` — Narrow width from 240-260px to 200px
5. `src/terminal/Terminal.jsx` — Add `flow` mode, add sessionStorage persistence
6. `src/pages/blog/index.astro` — Pass headings data (empty for index)
7. `src/pages/blog/[...slug].astro` — Pass headings data from MDX content
8. `src/layouts/ProjectPage.astro` — Keep current behavior (fixed sidebar terminal)

## Files to Create

1. `src/components/TableOfContents.astro` — TOC sidebar component
2. `src/components/TableOfContents.jsx` — Interactive TOC with scroll tracking (optional)

## Non-Goals

- Changing the homepage terminal
- Changing project pages layout
- Adding search functionality to the blog
- Server-side rendering of terminal state
- Any changes to the Nav or Footer components
