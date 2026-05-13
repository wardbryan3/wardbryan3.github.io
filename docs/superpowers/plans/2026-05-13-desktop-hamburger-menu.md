# Desktop Hamburger Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a slide-in hamburger menu on desktop with nav links and theme picker, fix cross-page theme persistence.

**Architecture:** A React component (`NavMenu.jsx`) renders the hamburger button and slide-in panel. An inline `<script>` in `BaseLayout.astro`'s `<head>` reads localStorage and sets `data-theme` before paint, fixing the bug where blog/projects pages never apply the saved theme. Desktop-only (>768px); mobile nav untouched.

**Tech Stack:** React, Zustand (osStore), Astro

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/layouts/BaseLayout.astro` | Modify | Add inline `<script>` in `<head>` for theme init |
| `src/components/Nav.astro` | Modify | Add `<NavMenu client:load />`, hide inline nav-links on desktop |
| `src/components/NavMenu.jsx` | **Create** | React component: hamburger button + slide-in panel + nav links + theme grid |
| `src/styles/global.css` | Modify | Add styles: panel, backdrop, hamburger button, theme grid |

---

### Task 1: Theme initialization script in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add inline script to `<head>`**

Insert this `<script>` block right before `</head>` in `src/layouts/BaseLayout.astro`:

```astro
<script is:inline>
  (function () {
    try {
      var saved = JSON.parse(localStorage.getItem('portfolio-os-settings'));
      if (saved && saved.theme) {
        document.documentElement.setAttribute('data-theme', saved.theme);
      }
    } catch (e) {}
  })();
</script>
```

`is:inline` ensures Astro outputs the script as-is (no bundling, no module wrapping), so it runs synchronously during HTML parsing before the first paint.

- [ ] **Step 2: Verify with build**

Run: `npm run build`
Expected: Build succeeds with no errors. The inline script appears in the HTML output before `</head>` on all pages (blog, projects, home, etc.).

---

### Task 2: Create NavMenu.jsx component

**Files:**
- Create: `src/components/NavMenu.jsx`

- [ ] **Step 1: Create the component**

Write `/home/b/Development/personal/website/src/components/NavMenu.jsx`:

```jsx
import { useState, useEffect } from 'react';
import { useOSStore } from '../stores/osStore';

const THEMES = [
  'system', 'tokyonight', 'everforest', 'ayu', 'catppuccin',
  'catppuccin-macchiato', 'gruvbox', 'kanagawa', 'nord', 'matrix', 'one-dark',
];

const THEME_LABELS = {
  system: 'system',
  tokyonight: 'tokyo',
  everforest: 'ever',
  ayu: 'ayu',
  catppuccin: 'cat',
  'catppuccin-macchiato': 'mac',
  gruvbox: 'gruv',
  kanagawa: 'kana',
  nord: 'nord',
  matrix: 'mtx',
  'one-dark': '1dark',
};

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const theme = useOSStore((s) => s.theme);
  const setTheme = useOSStore((s) => s.setTheme);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const isActive = (path) => {
    const p = window.location.pathname;
    return p === path || (path !== '/' && p.startsWith(path + '/'));
  };

  return (
    <>
      <button
        class="hamburger-btn"
        aria-label="Open navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
      {open && <div class="nav-backdrop" onClick={() => setOpen(false)} />}
      <div class={`nav-panel ${open ? 'nav-panel--open' : ''}`}>
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Navigation</span>
          <div class="nav-panel-links">
            <a
              href="/"
              class={`nav-panel-link ${isActive('/') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Home
            </a>
            <a
              href="/blog"
              class={`nav-panel-link ${isActive('/blog') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Blog
            </a>
            <a
              href="/projects"
              class={`nav-panel-link ${isActive('/projects') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Projects
            </a>
          </div>
        </div>
        <div class="nav-panel-divider"></div>
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Theme</span>
          <div class="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t}
                class={`theme-btn ${theme === t ? 'theme-btn--active' : ''}`}
                onClick={() => setTheme(t)}
              >
                {THEME_LABELS[t] || t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
```

Key behaviors:
- Escape key closes the panel
- Backdrop click closes the panel
- Nav link click closes the panel and navigates via `<a>` (native navigation)
- Theme selection applies immediately (via `setTheme` which sets `data-theme` + saves localStorage)
- Active nav link has `--active` class for accent styling

---

### Task 3: Update Nav.astro to use NavMenu on desktop

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Add NavMenu import and render**

Add the import at the top of the frontmatter:

```astro
import NavMenu from './NavMenu.jsx';
```

In the template, add `<NavMenu client:load />` inside the existing `.nav-actions` div, after the mobile `.nav-toggle` button:

```astro
<div class="nav-actions">
  <button class="nav-toggle" aria-label="Toggle navigation menu" data-toggle>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
  </button>
  <NavMenu client:load />
</div>
```

The `.nav-toggle` stays for mobile (shown ≤640px). `NavMenu` renders its own `.hamburger-btn` which is visible on desktop only (≥769px via CSS).

- [ ] **Step 2: Hide inline nav links on desktop**

Add a new media query at the bottom of the `<style>` block, after the existing `@media (max-width: 640px)` block:

```css
@media (min-width: 769px) {
  .nav-links {
    display: none;
  }
}
```

This hides the inline Home/Blog/Projects links on desktop (>768px) since they're now in the hamburger panel.

---

### Task 4: Add CSS styles to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Read current global.css to find appropriate insertion point**

Run: `cat src/styles/global.css | head -40`

- [ ] **Step 2: Append hamburger menu styles**

Add these styles at the end of `/home/b/Development/personal/website/src/styles/global.css`:

```css
/* Desktop Hamburger Menu */
.hamburger-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 110;
}

.hamburger-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 1px;
  transition: background 0.2s;
}

.hamburger-btn:hover .hamburger-bar {
  background: var(--accent);
}

@media (min-width: 769px) {
  .hamburger-btn {
    display: flex;
  }
}

.nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 105;
}

.nav-panel {
  position: fixed;
  top: 52px;
  right: 0;
  width: 240px;
  height: calc(100vh - 52px - 54px);
  background: var(--surface);
  border-left: 1px solid var(--border);
  z-index: 110;
  transform: translateX(100%);
  transition: transform 0.2s ease;
  overflow-y: auto;
  padding: 1rem 0;
}

.nav-panel--open {
  transform: translateX(0);
}

.nav-panel-section {
  padding: 0 1rem;
  margin-bottom: 0.5rem;
}

.nav-panel-heading {
  display: block;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  padding: 0 0.5rem;
}

.nav-panel-links {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-panel-link {
  display: block;
  padding: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text);
  text-decoration: none;
  border-radius: 4px;
  transition: color 0.2s, background 0.2s;
}

.nav-panel-link:hover {
  background: var(--surface-hover);
  color: var(--accent);
}

.nav-panel-link--active {
  color: var(--accent);
  background: var(--surface-hover);
}

.nav-panel-divider {
  height: 1px;
  background: var(--border);
  margin: 0.75rem 1rem;
}

.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.theme-btn {
  padding: 0.4rem 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--text);
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
}

.theme-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.theme-btn--active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
  font-weight: 500;
}
```

---

### Task 5: Build and verify

**Files:** N/A (build step)

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: Build succeeds with no TypeScript errors and no runtime errors. Check that `astro check` does not complain about the new `.jsx` file.

- [ ] **Step 2: Verify theme init script in output**

Check the built HTML for a blog page to confirm the inline script is present:

```bash
grep -A3 'portfolio-os-settings' dist/blog/index.html
```

Expected: Shows the inline `<script>` block with the theme initialization code.

- [ ] **Step 3: Verify hamburger HTML in output**

```bash
grep -c 'hamburger-btn' dist/blog/index.html
```

Expected: Output is `1` (the hamburger button renders in the HTML).

---

### Task 6: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add src/layouts/BaseLayout.astro src/components/Nav.astro src/components/NavMenu.jsx src/styles/global.css
git commit -m "feat: add desktop hamburger menu with theme picker"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Slide-in panel from right | Task 4 (CSS), Task 2 (component) |
| Nav links (Home, Blog, Projects) | Task 2 |
| Theme picker in hamburger | Task 2 (THEMES grid) |
| Cross-page theme persistence fix | Task 1 (inline script) |
| Desktop only, mobile untouched | Task 3 (769px breakpoint), Task 4 (769px hamburger visibility) |
| React component using osStore | Task 2 |
