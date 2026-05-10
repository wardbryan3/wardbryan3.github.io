# Blog Docs Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign blog pages with a three-column docs-style layout, persistent terminal state, and RSS autodiscovery.

**Architecture:** CSS Grid layout (200px 1fr auto auto) replaces the current flex layout. Terminal gets a `flow` mode for in-grid positioning and sessionStorage persistence. TOC auto-generated from MDX headings via Astro's content collection `render()` API.

**Tech Stack:** Astro 5, React 19 (Terminal.jsx), CSS Grid, CSS custom properties, sessionStorage

---

### Task 1: Add RSS autodiscovery link

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add RSS link tag to BaseLayout head**

Add the RSS autodiscovery `<link>` tag after the favicon link:

```astro
<!-- in src/layouts/BaseLayout.astro, after line 50 (favicon link) -->
<link rel="alternate" type="application/rss+xml" title="Bryan Ward's Blog" href="/rss.xml" />
```

- [ ] **Step 2: Verify it renders**

Run: `npx astro build` and check that `dist/index.html` contains the RSS link tag.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add RSS autodiscovery link tag"
```

---

### Task 2: Narrow BlogSidebar width

**Files:**
- Modify: `src/components/BlogSidebar.astro`

- [ ] **Step 1: Change sidebar width from 240-260px to 200px**

In the `<style>` section, find and replace:

```css
/* Old */
.blog-sidebar {
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--border);
  min-width: 240px;
  max-width: 260px;
  overflow-y: auto;
}

/* New */
.blog-sidebar {
  padding: 1.5rem 1rem;
  border-right: 1px solid var(--border);
  width: 200px;
  min-width: 200px;
  overflow-y: auto;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/BlogSidebar.astro
git commit -m "fix: narrow blog sidebar to 200px"
```

---

### Task 3: Create TableOfContents component

**Files:**
- Create: `src/components/TableOfContents.astro`
- Create: `src/components/TableOfContents.jsx`

- [ ] **Step 1: Create static TOC shell (Astro)**

```astro
---
// src/components/TableOfContents.astro
export interface Props {
  headings: { depth: number; slug: string; text: string }[];
}

const { headings } = Astro.props;

const tocHeadings = headings.filter((h) => h.depth <= 3);
---

<nav class="toc" aria-label="Table of contents">
  <h4 class="toc-heading">On this page</h4>
  <ul class="toc-list">
    {tocHeadings.map((h) => (
      <li class:list={[`toc-item`, `toc-depth-${h.depth}`]}>
        <a href={`#${h.slug}`} class="toc-link">{h.text}</a>
      </li>
    ))}
  </ul>
</nav>

<style>
  .toc {
    padding: 1.5rem 1rem;
    overflow-y: auto;
  }

  .toc-heading {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 1rem;
  }

  .toc-list {
    list-style: none;
  }

  .toc-item {
    margin-bottom: 0.25rem;
  }

  .toc-link {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    text-decoration: none;
    transition: color 0.15s;
    display: block;
    padding: 0.2rem 0;
  }

  .toc-link:hover {
    color: var(--accent);
  }

  .toc-depth-3 .toc-link {
    padding-left: 0.75rem;
    font-size: 0.7rem;
  }

  .toc-link.active {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Create interactive TOC with scroll tracking (React)**

```jsx
// src/components/TableOfContents.jsx
import { useEffect, useState } from 'react';

export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const filtered = headings.filter((h) => h.depth <= 3);

  return (
    <nav className="toc" aria-label="Table of contents">
      <h4 className="toc-heading">On this page</h4>
      <ul className="toc-list">
        {filtered.map((h) => (
          <li
            key={h.slug}
            className={`toc-item toc-depth-${h.depth}${activeId === h.slug ? ' active' : ''}`}
          >
            <a href={`#${h.slug}`} className="toc-link">{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] **Step 3: Add TOC CSS to global.css**

Add at the end of `src/styles/global.css`:

```css
.toc {
  padding: 1.5rem 1rem;
  overflow-y: auto;
}

.toc-heading {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.toc-list {
  list-style: none;
}

.toc-item {
  margin-bottom: 0.2rem;
}

.toc-item.active > .toc-link {
  color: var(--accent);
}

.toc-link {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
  text-decoration: none;
  display: block;
  padding: 0.2rem 0;
  transition: color 0.15s;
}

.toc-link:hover {
  color: var(--accent);
}

.toc-depth-3 .toc-link {
  padding-left: 0.75rem;
  font-size: 0.7rem;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/TableOfContents.astro src/components/TableOfContents.jsx src/styles/global.css
git commit -m "feat: add table of contents component with scroll tracking"
```

---

### Task 4: Add flow mode and sessionStorage persistence to Terminal

**Files:**
- Modify: `src/terminal/Terminal.jsx`

- [ ] **Step 1: Add `flow` prop and update state initialization**

In `src/terminal/Terminal.jsx`, change the function signature and add sessionStorage initialization:

```jsx
// Change the function signature from:
export default function Terminal({
  page = '/home',
  projectCount = 0,
  postCount = 0,
  searchData = /** @type {any[]} */ ([]),
  side = false,
  defaultOpen = true,
}) {

// To:
export default function Terminal({
  page = '/home',
  projectCount = 0,
  postCount = 0,
  searchData = /** @type {any[]} */ ([]),
  side = false,
  flow = false,
  defaultOpen = true,
}) {
```

Then add sessionStorage restoration after the existing state declarations (around line 78):

```jsx
// After line 78: const [ready, setReady] = useState(false);
// Add:
// Restore terminal state from sessionStorage
const [restored] = useState(() => {
  try {
    const saved = sessionStorage.getItem('terminal-state-v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed;
    }
  } catch {}
  return null;
});

useEffect(() => {
  if (restored && restored.outputLines) {
    setOutputLines(restored.outputLines);
  }
}, [restored]);
```

- [ ] **Step 2: Save terminal state to sessionStorage on every change**

Add after the existing outputLines effect (around line 303):

```jsx
// Persist terminal state to sessionStorage
useEffect(() => {
  try {
    sessionStorage.setItem('terminal-state-v1', JSON.stringify({ outputLines }));
  } catch {}
}, [outputLines]);
```

- [ ] **Step 3: Update the clear command to also clear sessionStorage**

Find the `executeCommand` function and update the clear handler:

```jsx
// Find around line 225:
if (result.action === 'clear') { setOutputLines([]); setInput(''); return; }

// Replace with:
if (result.action === 'clear') {
  setOutputLines([]);
  setInput('');
  try { sessionStorage.removeItem('terminal-state-v1'); } catch {}
  return;
}
```

- [ ] **Step 4: Add flow mode rendering**

Find the return section of the component (around line 418). Currently the component returns the sidebar version if `side` is true, else the floating window version. Add a third branch for flow mode:

```jsx
// Before the existing if (side) { ... } block (line 418), add:

if (flow) {
  return (
    <div className={`terminal-window terminal-flow${collapsed ? ' terminal-collapsed' : ''}`}>
      <button
        className="terminal-minimize terminal-flow-minimize"
        onClick={() => setCollapsed(prev => !prev)}
        aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
        title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
      >
        {collapsed ? '>' : '<'}
      </button>
      {!collapsed && (
        <div className="terminal-flow-body">
          {terminalBody}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Add flow mode CSS to global.css**

Add at the end of `src/styles/global.css`:

```css
/* Flow mode (in-grid terminal) */
.terminal-flow {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border);
  background: var(--surface);
  width: 320px;
  min-width: 320px;
  overflow: hidden;
  transition: width 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
  border-radius: 0;
  font-family: var(--font-mono);
}

.terminal-flow.terminal-collapsed {
  width: 32px;
  min-width: 32px;
}

.terminal-flow-body {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.terminal-flow .terminal-window-body {
  padding: 0;
}

.terminal-flow-minimize {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.terminal-flow-minimize:hover {
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.terminal-flow.terminal-collapsed .terminal-flow-minimize {
  right: -36px;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background: var(--surface);
}

.terminal-flow .term-input {
  width: 100%;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/terminal/Terminal.jsx src/styles/global.css
git commit -m "feat: add flow mode and sessionStorage persistence to terminal"
```

---

### Task 5: Introduce prop to skip terminal rendering in BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Add `renderTerminal` prop**

```astro
// In src/layouts/BaseLayout.astro, add to the Props interface and destructuring:

interface Props {
  title: string;
  description?: string;
  image?: string;
  showTerminal?: boolean;
  renderTerminal?: boolean;
  terminalPage?: string;
  projectCount?: number;
  postCount?: number;
  searchData?: any[];
}

const {
  title,
  description,
  image,
  showTerminal = false,
  renderTerminal = true,
  terminalPage = '/home',
  projectCount = 0,
  postCount = 0,
  searchData = [],
} = Astro.props;
```

- [ ] **Step 2: Wrap terminal rendering with renderTerminal check**

```astro
<!-- Change from: -->
{showTerminal && (
  ...
)}

<!-- To: -->
{showTerminal && renderTerminal && (
  ...
)}
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: add renderTerminal prop to BaseLayout"
```

---

### Task 6: Rewrite BlogPost layout with CSS Grid

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Replace the entire layout with CSS Grid**

```astro
---
import BaseLayout from './BaseLayout.astro';
import BlogSidebar from '../components/BlogSidebar.astro';
import TableOfContents from '../components/TableOfContents.jsx';
import Terminal from '../terminal/Terminal';
import Tag from '../components/Tag.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  showTerminal?: boolean;
  terminalPage?: string;
  postCount?: number;
  searchData?: any[];
  headings?: { depth: number; slug: string; text: string }[];
}

const {
  title,
  description,
  date,
  tags,
  showTerminal = false,
  terminalPage = '',
  postCount = 0,
  searchData = [],
  headings = [],
} = Astro.props;
---

<BaseLayout
  title={title}
  description={description}
  showTerminal={false}
  renderTerminal={false}
  terminalPage={terminalPage}
  postCount={postCount}
  searchData={searchData}
>
  <div class="blog-docs-layout">
    <BlogSidebar />
    <article class="blog-content">
      <header class="post-header">
        <h1>{title}</h1>
        <time class="post-date" datetime={date.toISOString()}>
          {date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {tags && tags.length > 0 && (
          <div class="tags">
            {tags.map((tag) => <Tag label={tag} />)}
          </div>
        )}
      </header>
      <div class="prose">
        <slot />
      </div>
    </article>
    {headings.length > 0 && (
      <div class="toc-column">
        <TableOfContents headings={headings} client:load />
      </div>
    )}
    <Terminal
      page={terminalPage || '/blog'}
      projectCount={0}
      postCount={postCount}
      searchData={searchData}
      flow={true}
      defaultOpen={true}
      client:load
    />
  </div>
</BaseLayout>

<style>
  .blog-docs-layout {
    display: grid;
    grid-template-columns: 200px 1fr auto auto;
    min-height: calc(100vh - 48px - 60px); /* viewport - nav - footer */
    max-width: 100%;
  }

  .blog-content {
    padding: 2rem 2.5rem;
    max-width: 720px;
    min-width: 0;
    overflow-wrap: break-word;
  }

  .post-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .post-header h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .post-date {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-muted);
    display: block;
    margin-bottom: 0.75rem;
  }

  .tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .prose {
    line-height: 1.8;
  }

  .toc-column {
    width: 200px;
    min-width: 200px;
    border-left: 1px solid var(--border);
  }

  @media (max-width: 1024px) {
    .blog-docs-layout {
      grid-template-columns: 200px 1fr;
    }
    .toc-column {
      display: none;
    }
  }

  @media (max-width: 768px) {
    .blog-docs-layout {
      grid-template-columns: 1fr;
    }
    .blog-sidebar {
      display: none;
    }
  }

  @media (max-width: 640px) {
    .blog-content {
      padding: 1.5rem 1rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "feat: rewrite BlogPost with CSS Grid docs layout"
```

---

### Task 7: Update blog pages to pass headings

**Files:**
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Update blog index page**

```astro
---
// src/pages/blog/index.astro
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

const posts = await getCollection('blog');
const sortedPosts = posts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const latestPost = sortedPosts[0];
const { Content } = await latestPost.render();

const allProjects = await getCollection('projects');
const searchData = [
  ...sortedPosts.map(p => ({ title: p.data.title, slug: p.slug, path: `/blog/${p.slug}`, type: 'blog', tags: p.data.tags })),
  ...allProjects.map(p => ({ title: p.data.title, slug: p.slug, path: `/projects/${p.slug}`, type: 'projects', tags: p.data.tags })),
];
---

<BlogPost
  title={latestPost.data.title}
  description={latestPost.data.description}
  date={latestPost.data.date}
  tags={latestPost.data.tags}
  showTerminal={true}
  terminalPage="/blog"
  postCount={sortedPosts.length}
  searchData={searchData}
>
  <Content />
</BlogPost>
```

(No changes needed here — the index page shows the latest post and the `headings` prop will be undefined, which means no TOC is shown.)

- [ ] **Step 2: Update blog post page to pass headings**

```astro
---
// src/pages/blog/[...slug].astro
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content, headings } = await post.render();

const allPosts = await getCollection('blog');
const allProjects = await getCollection('projects');
const sortedPosts = allPosts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);
const searchData = [
  ...sortedPosts.map(p => ({ title: p.data.title, slug: p.slug, path: `/blog/${p.slug}`, type: 'blog', tags: p.data.tags })),
  ...allProjects.map(p => ({ title: p.data.title, slug: p.slug, path: `/projects/${p.slug}`, type: 'projects', tags: p.data.tags })),
];
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
  showTerminal={true}
  terminalPage={`/blog/${post.slug}`}
  postCount={sortedPosts.length}
  searchData={searchData}
  headings={headings}
>
  <Content />
</BlogPost>
```

- [ ] **Step 3: Commit**

```bash
git add src/pages/blog/index.astro src/pages/blog/[...slug].astro
git commit -m "feat: pass headings data to blog layouts"
```

---

### Task 8: Ensure project pages keep working

**Files:**
- Check (no changes needed): `src/layouts/ProjectPage.astro`

- [ ] **Step 1: Verify ProjectPage passes no conflicting props to BaseLayout**

Read the file to confirm it doesn't pass `renderTerminal` and works correctly with the BaseLayout changes. The default value `renderTerminal = true` in BaseLayout means existing pages work without modification.

- [ ] **Step 2: Build and verify**

```bash
npx astro build
```

Expected: successful build with no errors.

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "fix: ensure project pages compatible with BaseLayout changes"
```
---

### Task 9: Verify everything works together

- [ ] **Step 1: Build the project**

```bash
npx astro build 2>&1
```

Expected: clean build with no errors.

- [ ] **Step 2: Verify the RSS autodiscovery link**

```bash
grep -r 'rss+xml' dist/ 2>/dev/null || echo "Check dist/index.html for RSS link"
```

Expected: `dist/index.html` contains `<link rel="alternate" type="application/rss+xml" ... />`.

- [ ] **Step 3: Verify blog pages use the new layout**

```bash
ls -la dist/blog/
```

Expected: blog pages are generated successfully.

- [ ] **Step 4: Run tests if available**

```bash
npx astro check 2>&1 || echo "No type check or tests configured"
```

Expected: no type errors.
