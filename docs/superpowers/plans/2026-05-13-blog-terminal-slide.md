# Blog Terminal Slide-Out Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken blog terminal collapse so the entire terminal column slides off-screen right with a smooth translateX animation, with a toggle button always visible on the viewport right edge.

**Architecture:** Move terminal from CSS grid column to `position: fixed`. The terminal uses `translateX` for slide animation. Toggle button is `position: fixed` on the right viewport edge, independent of the terminal. `overflow-x: hidden` on body prevents scrollbar when terminal is off-screen.

**Tech Stack:** React (Terminal.jsx), CSS (global.css), Astro (blog page layouts)

---

### Task 1: Update CSS — Replace flow collapse with fixed-position slide-out

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Replace `.terminal-flow` base styles** (around line 567)

Change from `position: relative` with width transition to `position: fixed` with transform transition:

```css
.terminal-flow {
  position: fixed;
  right: 0;
  top: 48px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
  background: var(--surface);
  opacity: 0.9;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  width: 320px;
  height: calc(100vh - 48px - 60px);
  overflow: hidden;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 0;
  font-family: var(--font-mono);
  z-index: 10;
}
```

- [ ] **Replace `.terminal-flow.terminal-collapsed`** (around line 584)

Change from `width: 32px` to `translateX(100%)`:

```css
.terminal-flow.terminal-collapsed {
  transform: translateX(100%);
}
```

- [ ] **Replace `.terminal-flow-minimize` with `.terminal-flow-toggle`** (around line 602)

Remove old `.terminal-flow-minimize`, `.terminal-flow-minimize:hover`, and `.terminal-flow.terminal-collapsed .terminal-flow-minimize` blocks (lines ~602-628). Add new toggle button styles:

```css
.terminal-flow-toggle {
  position: fixed;
  right: 0;
  top: calc(48px + 0.5rem);
  z-index: 100;
  background: transparent;
  border: 1px solid var(--border);
  border-right: none;
  border-radius: 4px 0 0 4px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: calc(0.7rem * var(--os-font-mult, 1));
  padding: 0.15rem 0.4rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
  line-height: 1;
}

.terminal-flow-toggle:hover {
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}
```

- [ ] **Add `overflow-x: hidden` to body** (around line 21)

```css
body {
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.7;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}
```

- [ ] **Update responsive breakpoints**

At `<=1024px` media query, hide the toggle button. At `<=768px`, make terminal non-fixed again:

In the `@media (max-width: 1024px)` section (blog index + blog post), add:
```css
.terminal-flow-toggle {
  display: none;
}
```

In the `@media (max-width: 768px)` section (around line 660), override `.terminal-flow` styles:
```css
.terminal-flow {
  position: relative;
  width: 100%;
  border-left: none;
  flex: 1;
  min-height: 0;
  transform: none;
  height: auto;
}
```

- [ ] **Run `npm run build` to verify CSS changes compile** (astro check + build)

### Task 2: Update Terminal.jsx — Rewrite flow mode rendering

**Files:**
- Modify: `src/terminal/Terminal.jsx` (lines 412-431)

- [ ] **Replace the flow mode render block** (lines 412-431)

The button moves outside the terminal div, becomes a sibling. Icon and class names change:

Replace:
```jsx
  if (flow) {
    return (
      <div className={`terminal-window terminal-flow${effectiveCollapsed ? ' terminal-collapsed' : ''}`}>
        {!isMobile && (
          <button
            className="terminal-minimize terminal-flow-minimize"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
            title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
          >
            {collapsed ? '>' : '<'}
          </button>
        )}
        {!effectiveCollapsed && (
          <div className="terminal-flow-body">
            {terminalBody}
          </div>
        )}
      </div>
    );
  }
```

With:
```jsx
  if (flow) {
    return (
      <>
        {!isMobile && (
          <button
            className="terminal-flow-toggle"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
            title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
          >
            {collapsed ? '<' : '>'}
          </button>
        )}
        <div className={`terminal-window terminal-flow${effectiveCollapsed ? ' terminal-collapsed' : ''}`}>
          {!effectiveCollapsed && (
            <div className="terminal-flow-body">
              {terminalBody}
            </div>
          )}
        </div>
      </>
    );
  }
```

Key changes:
- Button wrapped in `<>` fragment (sibling to terminal div, not child)
- Class: `terminal-minimize terminal-flow-minimize` → `terminal-flow-toggle`
- Icon: swapped — `collapsed ? '>' : '<'` → `collapsed ? '<' : '>'`
  - When collapsed: `<` means "click to open (slides in from right)"
  - When visible: `>` means "click to close (slides out to right)"

- [ ] **Run `npm run build` to verify JSX compiles**

### Task 3: Update blog index page — Remove terminal column from grid

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] **Remove `.terminal-column` wrapper** (lines 63-74)

Remove the `<div class="terminal-column">` wrapping the `<Terminal>` component. Render Terminal directly in the layout div:

Replace:
```astro
    <div class="terminal-column">
      <Terminal
        page="/blog"
        projectCount={0}
        postCount={sortedPosts.length}
        searchData={searchData}
        dirs={dirs}
        flow={true}
        defaultOpen={true}
        client:load
      />
    </div>
```

With:
```astro
      <Terminal
        page="/blog"
        projectCount={0}
        postCount={sortedPosts.length}
        searchData={searchData}
        dirs={dirs}
        flow={true}
        defaultOpen={true}
        client:load
      />
```

- [ ] **Update grid and remove terminal-column styles** (lines ~79-228)

Change grid from `200px 1fr 320px` to `200px 1fr`:

```css
.blog-docs-layout {
  display: grid;
  grid-template-columns: 200px 1fr;
  min-height: calc(100vh - 48px - 60px);
  max-width: 100%;
}
```

Remove the `.terminal-column` block (lines ~175-186) and its `:global` overrides (lines ~183-200).

Update the 1024px media query — remove `.terminal-column` reference and grid change (grid is already `200px 1fr` at all sizes now):

Replace:
```css
@media (max-width: 1024px) {
  .blog-docs-layout {
    grid-template-columns: 200px 1fr;
  }
  .terminal-column {
    display: none;
  }
}
```

With:
```css
@media (max-width: 1024px) {
  .blog-docs-layout {
    grid-template-columns: 200px 1fr;
  }
}
```

- [ ] **Run `npm run build` to verify**

### Task 4: Update blog post layout — Remove terminal column from grid

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Remove `.terminal-column` wrapper** (lines 100-111)

Remove the `<div class="terminal-column">` wrapping the `<Terminal>` component. Render Terminal directly:

Replace:
```astro
    <div class="terminal-column">
      <Terminal
        page={terminalPage || '/blog'}
        projectCount={0}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
        flow={true}
        defaultOpen={true}
        client:load
      />
    </div>
```

With:
```astro
      <Terminal
        page={terminalPage || '/blog'}
        projectCount={0}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
        flow={true}
        defaultOpen={true}
        client:load
      />
```

- [ ] **Update grid and remove terminal-column styles** (lines ~129-322)

Change grid from `200px 1fr auto auto` to `200px 1fr auto`:

```css
.blog-docs-layout {
  display: grid;
  grid-template-columns: 200px 1fr auto;
  min-height: calc(100vh - 48px - 60px);
  max-width: 100%;
}
```

Remove the `.terminal-column` block (lines ~263-278).

Update the 1024px media query — remove `.terminal-column` reference:

Replace:
```css
@media (max-width: 1024px) {
  .blog-docs-layout {
    grid-template-columns: 200px 1fr;
  }
  .toc-column {
    display: none;
  }
  .terminal-column {
    display: none;
  }
}
```

With:
```css
@media (max-width: 1024px) {
  .blog-docs-layout {
    grid-template-columns: 200px 1fr;
  }
  .toc-column {
    display: none;
  }
}
```

- [ ] **Run `npm run build` to verify**

### Task 5: Visual verification

**No files changed.**

- [ ] **Run `npm run dev` and test manually**

Start the dev server, navigate to `/blog` and a blog post page:
1. Verify the terminal renders at the right side with a fixed position
2. Click the `<` toggle button → terminal slides off-screen right, button remains visible
3. Click the `>` toggle button (now visible at right edge) → terminal slides back in
4. Verify no horizontal scrollbar appears in either state
5. Verify content column expands when terminal is hidden (no empty 320px gap)
6. Resize to <=1024px → verify terminal and toggle button are both hidden
7. Resize to <=768px → verify terminal fills viewport normally

### Task 6: Clean up old styles

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Remove `.terminal-flow .term-input`** at line ~630

This rule was specific to flow mode input. Remove it (the `.term-input` base styles elsewhere still apply).

- [ ] **Run `npm run build` to confirm no breakage**
