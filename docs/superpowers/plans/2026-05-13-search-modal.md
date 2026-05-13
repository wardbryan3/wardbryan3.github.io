# Search Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a search icon button next to the hamburger menu that opens a centered modal with live search across all blog posts and projects.

**Architecture:** A build-time JSON endpoint (`search-index.json.js`) generates the search index using the same `getCollection` calls as existing pages. A React `SearchModal` component fetches it on mount, filters by title + tags as the user types, and presents results grouped by type. The search button and modal are desktop-only (>=769px).

**Tech Stack:** React, Astro (SSG endpoint), CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|---------------|
| `src/pages/search-index.json.js` | **Create** | Build-time JSON endpoint with all blog posts + projects |
| `src/components/SearchModal.jsx` | **Create** | React component: search icon + modal overlay + live search |
| `src/components/Nav.astro` | Modify | Add `<SearchModal client:load />` in `.nav-actions` |
| `src/styles/global.css` | Modify | Add search modal styles |

---

### Task 1: Build-time search index endpoint

**Files:**
- Create: `src/pages/search-index.json.js`

- [ ] **Step 1: Create the endpoint**

Write `/home/b/Development/personal/website/src/pages/search-index.json.js`:

```js
import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const projects = await getCollection('projects');

  const searchData = [
    ...posts.map((p) => ({
      title: p.data.title,
      slug: p.slug,
      path: `/blog/${p.slug}`,
      type: 'blog',
      tags: p.data.tags || [],
      date: p.data.date.getTime(),
    })),
    ...projects.map((p) => ({
      title: p.data.title,
      slug: p.slug,
      path: `/projects/${p.slug}`,
      type: 'projects',
      tags: p.data.tags || [],
      date: p.data.date.getTime(),
    })),
  ];

  return new Response(JSON.stringify(searchData), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

This follows the same pattern as `src/pages/rss.xml.js`. The response contains the exact same data structure as the `searchData` prop used by the terminal.

- [ ] **Step 2: Verify the endpoint builds**

```bash
npm run build
```

Expected: Build succeeds. Check that `dist/search-index.json` exists:

```bash
cat dist/search-index.json | head -c 200
```

Expected: Shows JSON array with blog posts and projects.

---

### Task 2: Create SearchModal component

**Files:**
- Create: `src/components/SearchModal.jsx`

- [ ] **Step 1: Write the component**

Write `/home/b/Development/personal/website/src/components/SearchModal.jsx`:

```jsx
import { useState, useEffect, useRef, useCallback } from 'react';

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIdx(0);
    }
  }, [open]);

  const results = (data || []).filter((item) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const blogResults = results.filter((r) => r.type === 'blog');
  const projectResults = results.filter((r) => r.type === 'projects');
  const totalResults = blogResults.length + projectResults.length;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && totalResults > 0) {
        const all = [...blogResults, ...projectResults];
        const selected = all[selectedIdx];
        if (selected) {
          window.location.href = selected.path;
        }
      }
    },
    [blogResults, projectResults, selectedIdx, totalResults]
  );

  const icon = open ? (
    <span class="search-icon">&#128269;</span>
  ) : (
    <span class="search-icon">&#128269;</span>
  );

  return (
    <>
      <button
        class="search-btn"
        aria-label={open ? 'Close search' : 'Open search'}
        onClick={() => setOpen((v) => !v)}
      >
        {icon}
      </button>
      {open && <div class="search-backdrop" onClick={() => setOpen(false)} />}
      <div
        class={`search-modal ${open ? 'search-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div class="search-input-wrap">
          <span class="search-input-icon">&#128269;</span>
          <input
            ref={inputRef}
            class="search-input"
            type="text"
            placeholder="Search posts and projects..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span class="search-esc-hint">ESC</span>
        </div>
        {query && totalResults === 0 && (
          <div class="search-empty">No results found</div>
        )}
        {blogResults.length > 0 && (
          <div class="search-group">
            <div class="search-group-heading">Blog Posts</div>
            {blogResults.map((item, i) => (
              <a
                key={item.path}
                href={item.path}
                class={`search-result ${selectedIdx === i ? 'search-result--active' : ''}`}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <span class="search-result-dot search-result-dot--blog"></span>
                <div class="search-result-body">
                  <div class="search-result-title">{item.title}</div>
                  {item.tags.length > 0 && (
                    <div class="search-result-tags">{item.tags.join(', ')}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
        {projectResults.length > 0 && (
          <div class="search-group">
            <div class="search-group-heading">Projects</div>
            {projectResults.map((item, i) => (
              <a
                key={item.path}
                href={item.path}
                class={`search-result ${selectedIdx === blogResults.length + i ? 'search-result--active' : ''}`}
                onMouseEnter={() => setSelectedIdx(blogResults.length + i)}
              >
                <span class="search-result-dot search-result-dot--project"></span>
                <div class="search-result-body">
                  <div class="search-result-title">{item.title}</div>
                  {item.tags.length > 0 && (
                    <div class="search-result-tags">{item.tags.join(', ')}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
```

Key behaviors:
- Fetches `/search-index.json` once on mount, caches in `dataRef`
- Cmd+K / Ctrl+K global toggle
- Escape closes
- Arrow keys + Enter for keyboard navigation
- Click result navigates
- Filters by title + tags (same logic as terminal's `grep`)
- Results grouped into Blog Posts and Projects sections
- Blog dot uses `var(--accent)`, project dot uses `var(--primary)`

---

### Task 3: Integrate into Nav.astro

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Add SearchModal import**

```astro
import SearchModal from './SearchModal.jsx';
```

- [ ] **Step 2: Add SearchModal in .nav-actions**

Place it before NavMenu (left of the hamburger):

```astro
<div class="nav-actions">
  <button class="nav-toggle" aria-label="Toggle navigation menu" data-toggle>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
    <span class="nav-toggle-bar"></span>
  </button>
  <SearchModal client:load />
  <NavMenu currentPath={currentPath} client:load />
</div>
```

The order inside `flex` `.nav-actions` is: mobile toggle | search icon | hamburger icon.

---

### Task 4: Add CSS styles to global.css

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append search modal styles**

Add these styles at the end of `/home/b/Development/personal/website/src/styles/global.css`:

```css
/* Search Modal */
.search-btn {
  display: none;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  z-index: 110;
  color: var(--text);
  font-size: 1rem;
  line-height: 1;
  transition: color 0.2s;
}

.search-btn:hover {
  color: var(--accent);
}

@media (min-width: 769px) {
  .search-btn {
    display: flex;
  }
}

.search-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 200;
}

.search-modal {
  position: fixed;
  top: 60px;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  width: 520px;
  max-width: calc(100vw - 2rem);
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 8px;
  z-index: 210;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;
  overflow: hidden;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.4);
}

.search-modal--open {
  opacity: 1;
  pointer-events: auto;
  transform: translateX(-50%) translateY(0);
}

.search-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid var(--border);
}

.search-input-icon {
  color: var(--text-muted);
  font-size: 1rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 0.85rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
  opacity: 0.6;
}

.search-esc-hint {
  background: var(--border);
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 0.6rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
  flex-shrink: 0;
}

.search-empty {
  padding: 2rem 1rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}

.search-group {
  padding: 6px 0;
}

.search-group:not(:last-child) {
  border-bottom: 1px solid var(--border);
}

.search-group-heading {
  padding: 4px 14px 6px;
  font-family: var(--font-mono);
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  opacity: 0.6;
}

.search-result {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  text-decoration: none;
  transition: background 0.1s;
}

.search-result:hover,
.search-result--active {
  background: var(--surface-hover);
}

.search-result-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.search-result-dot--blog {
  background: var(--accent);
}

.search-result-dot--project {
  background: var(--primary);
}

.search-result-body {
  flex: 1;
  min-width: 0;
}

.search-result-title {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-result-tags {
  font-size: 0.65rem;
  color: var(--text-muted);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

---

### Task 5: Build and verify

- [ ] **Step 1: Run the build**

```bash
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Verify search-index.json**

```bash
cat dist/search-index.json | python3 -m json.tool | head -20
```

Expected: Valid JSON array with blog post and project entries.

- [ ] **Step 3: Verify search modal HTML**

```bash
grep -c 'search-btn' dist/blog/index.html
```

Expected: Output is `1` (search button renders in the nav).

---

### Task 6: Commit

- [ ] **Step 1: Commit all changes**

```bash
git add src/pages/search-index.json.js src/components/SearchModal.jsx src/components/Nav.astro src/styles/global.css
git commit -m "feat: add search modal with build-time search index"
```

---

## Spec Coverage Check

| Spec Requirement | Task |
|-----------------|------|
| Build-time search index JSON endpoint | Task 1 |
| Search icon button next to hamburger | Task 2 (button), Task 3 (placement) |
| Modal overlay centered, top of viewport | Task 4 (positioning CSS) |
| Live filtering by title + tags | Task 2 (filter logic matches terminal grep) |
| Results grouped by type (blog/projects) | Task 2 (blogResults, projectResults) |
| Cmd+K / Ctrl+K trigger | Task 2 (global keydown listener) |
| Escape / backdrop click dismiss | Task 2 (Escape handler, backdrop onClick) |
| Arrow keys + Enter navigation | Task 2 (handleKeyDown) |
| Desktop only (>=769px), no mobile | Task 4 (769px media query on .search-btn) |
| No changes to terminal or store | Confirmed — only new files + Nav.astro + global.css |
