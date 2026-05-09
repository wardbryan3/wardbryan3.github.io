# Personal Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal website skeleton for Bryan Ward using Astro + MDX with a grim-purple cyberpunk theme.

**Architecture:** Astro static site with MDX content collections for blog posts and projects. CSS custom properties for theming. Standalone web game projects live in `public/projects/`.

**Tech Stack:** Astro 5, MDX, plain CSS (no framework), @astrojs/rss, @astrojs/sitemap, npm

---

### Task 1: Initialize Astro Project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`
- Create: `src/content/config.ts`

- [ ] **Step 1: Scaffold the project**

Run:
```bash
cd /home/b/Development/personal/website && npm create astro@latest . -- --skip-houston --template minimal --install --typescript strict
```

- [ ] **Step 2: Install integrations**

```bash
cd /home/b/Development/personal/website && npm install @astrojs/mdx @astrojs/rss @astrojs/sitemap
```

- [ ] **Step 3: Configure astro.config.mjs**

Write `astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bryanward.dev',
  integrations: [mdx(), sitemap()],
});
```

- [ ] **Step 4: Set up content collections schema**

Write `src/content/config.ts`:
```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()).optional(),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
    url: z.string().optional(),
    repo: z.string().optional(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog, projects };
```

- [ ] **Step 5: Verify**

```bash
cd /home/b/Development/personal/website && npx astro check
```

Expected: no errors (empty collections are fine).

- [ ] **Step 6: Commit**

```bash
cd /home/b/Development/personal/website && git init && git add -A && git commit -m "feat: initialize Astro project with MDX and content collections"
```

---

### Task 2: Global CSS Theme

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write the cyberpunk theme CSS**

Write `src/styles/global.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

:root {
  --bg: #05000a;
  --surface: #12001a;
  --surface-hover: #1a0028;
  --text: #d0c0e0;
  --text-muted: #7a6a8a;
  --primary: #8800cc;
  --primary-glow: rgba(136, 0, 204, 0.4);
  --accent: #00ff66;
  --accent-glow: rgba(0, 255, 102, 0.4);
  --border: #2a1040;
  --font-mono: 'JetBrains Mono', monospace;
  --font-sans: 'Inter', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: var(--bg);
  color: var(--text);
  line-height: 1.7;
  min-height: 100vh;
}

body::before {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 9999;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}

h1 { font-size: 2rem; }
h2 { font-size: 1.5rem; }
h3 { font-size: 1.25rem; }

a {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s, text-shadow 0.2s;
}

a:hover {
  text-shadow: 0 0 8px var(--accent-glow);
}

p { margin-bottom: 1rem; }

code {
  font-family: var(--font-mono);
  background: var(--surface);
  color: var(--accent);
  padding: 0.125em 0.375em;
  border-radius: 3px;
  font-size: 0.9em;
}

pre {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

pre code {
  background: none;
  padding: 0;
  color: var(--text);
}

.neon-glow {
  box-shadow: 0 0 10px var(--primary-glow), 0 0 20px var(--primary-glow);
}

.neon-glow-accent {
  box-shadow: 0 0 10px var(--accent-glow), 0 0 20px var(--accent-glow);
}

.neon-text {
  text-shadow: 0 0 5px var(--accent-glow), 0 0 10px var(--accent-glow);
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}
```

- [ ] **Step 2: Verify CSS is valid**

No syntax errors — the file compiles as valid CSS.

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add global cyberpunk theme CSS"
```

---

### Task 3: Nav Component

**Files:**
- Create: `src/components/Nav.astro`

- [ ] **Step 1: Write the Nav component**

Write `src/components/Nav.astro`:
```astro
---
const currentPath = Astro.url.pathname;
const links = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/projects', label: 'Projects' },
];
---

<nav>
  <div class="nav-inner">
    <a href="/" class="logo">
      <span class="prompt">bryan@ward</span>
      <span class="cursor" aria-hidden="true">_</span>
    </a>
    <ul class="nav-links">
      {links.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class:list={[
              'nav-link',
              {
                active: currentPath === href || (href !== '/' && currentPath.startsWith(href)),
              },
            ]}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5, 0, 10, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
  }

  .logo {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--accent);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }

  .logo:hover {
    text-shadow: 0 0 8px var(--accent-glow);
  }

  .logo .cursor {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    background: var(--accent);
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .nav-links {
    list-style: none;
    display: flex;
    gap: 1.5rem;
  }

  .nav-link {
    font-family: var(--font-mono);
    font-size: 0.875rem;
    color: var(--text-muted);
    text-decoration: none;
    padding-bottom: 0.25rem;
    border-bottom: 2px solid transparent;
    transition: color 0.2s, border-color 0.2s, text-shadow 0.2s;
  }

  .nav-link:hover {
    color: var(--text);
  }

  .nav-link.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
    text-shadow: 0 0 6px var(--accent-glow);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add Nav component with neon active state"
```

---

### Task 4: Footer Component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write the Footer component**

Write `src/components/Footer.astro`:
```astro
<footer>
  <div class="footer-inner">
    <span class="copy">&copy; {new Date().getFullYear()} Bryan Ward</span>
    <div class="social-links">
      <a href="https://github.com/bryanward" target="_blank" rel="noopener noreferrer">GitHub</a>
      <a href="https://linkedin.com/in/bryanward" target="_blank" rel="noopener noreferrer">LinkedIn</a>
    </div>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--border);
    padding: 1rem 1.5rem;
    margin-top: auto;
  }

  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .copy {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
  }

  .social-links {
    display: flex;
    gap: 1rem;
  }

  .social-links a {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    transition: color 0.2s, text-shadow 0.2s;
  }

  .social-links a:hover {
    color: var(--accent);
    text-shadow: 0 0 6px var(--accent-glow);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add minimal Footer component"
```

---

### Task 5: Tag Component

**Files:**
- Create: `src/components/Tag.astro`

- [ ] **Step 1: Write the Tag component**

Write `src/components/Tag.astro`:
```astro
---
interface Props {
  label: string;
}

const { label } = Astro.props;
---

<span>{label}</span>

<style>
  span {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent);
    background: rgba(0, 255, 102, 0.08);
    border: 1px solid rgba(0, 255, 102, 0.2);
    border-radius: 4px;
    padding: 0.125em 0.5em;
    white-space: nowrap;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add Tag component for tech tags"
```

---

### Task 6: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write the BaseLayout**

Write `src/layouts/BaseLayout.astro`:
```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
const fullTitle = `${title} | Bryan Ward`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description || "Bryan Ward - CS student and developer"} />
    <title>{fullTitle}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style is:global>
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
</style>
```

- [ ] **Step 2: Add a favicon placeholder**

Write `public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#05000a"/>
  <text x="16" y="22" text-anchor="middle" font-family="monospace" font-size="18" font-weight="bold" fill="#00ff66">BW</text>
</svg>
```

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add BaseLayout and favicon"
```

---

### Task 7: TerminalHero Component

**Files:**
- Create: `src/components/TerminalHero.astro`

- [ ] **Step 1: Write the TerminalHero**

Write `src/components/TerminalHero.astro`:
```astro
<section class="terminal-hero">
  <div class="terminal-header">
    <span class="dot dot-red"></span>
    <span class="dot dot-yellow"></span>
    <span class="dot dot-green"></span>
    <span class="terminal-title">bryan@ward ~ fastfetch</span>
  </div>

  <pre class="ascii">
  ___                   ___                __
 | _ )_  _ _ _  __ _   / /_ ___ _  _ ___ / /
 | _ \ || | ' \/ _` | / / / // _ `/ // / -_)_/
 |___/\_, |_||_\__,_|/_/ /_/ \_,_/\_, /\__(_)
      |__/                         /___/
  </pre>

  <table class="info-table">
    <tbody>
      <tr> <td class="label">name</td>   <td>Bryan Ward</td> </tr>
      <tr> <td class="label">status</td> <td><span class="status-active">CS Student</span></td> </tr>
      <tr> <td class="label">level</td>  <td>2nd Year (200-level)</td> </tr>
      <tr> <td class="label">focus</td>  <td>Full-stack development</td> </tr>
      <tr> <td class="label">tools</td>  <td><span class="tools">TypeScript, Python, Java, C++</span></td> </tr>
      <tr> <td class="label">shell</td>  <td>bash</td> </tr>
    </tbody>
  </table>

  <div class="prompt-line">
    <span class="prompt-symbol">$</span>
    <span class="typed-text" id="typed-text">building the web, one commit at a time</span>
    <span class="cursor blink"></span>
  </div>
</section>

<style>
  .terminal-hero {
    max-width: 720px;
    margin: 3rem auto;
    padding: 1.5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .terminal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border);
    margin-bottom: 1.5rem;
  }

  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .dot-red { background: #ff5f56; }
  .dot-yellow { background: #ffbd2e; }
  .dot-green { background: #27c93f; }

  .terminal-title {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-left: 0.5rem;
  }

  .ascii {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--accent);
    line-height: 1.2;
    margin-bottom: 1.5rem;
    white-space: pre;
    text-shadow: 0 0 4px var(--accent-glow);
  }

  .info-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1.5rem;
  }

  .info-table td {
    padding: 0.375rem 0;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    vertical-align: top;
  }

  .info-table .label {
    color: var(--accent);
    padding-right: 1.5rem;
    white-space: nowrap;
  }

  .status-active {
    color: var(--accent);
    text-shadow: 0 0 4px var(--accent-glow);
  }

  .prompt-line {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    color: var(--accent);
  }

  .prompt-symbol {
    color: var(--accent);
    margin-right: 0.5rem;
  }

  .typed-text {
    color: var(--text);
  }

  .cursor.blink {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    background: var(--accent);
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }

  @keyframes blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  @media (max-width: 600px) {
    .terminal-hero {
      margin: 1.5rem 1rem;
      padding: 1rem;
    }

    .ascii {
      font-size: 0.55rem;
    }

    .info-table td {
      font-size: 0.7rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add TerminalHero component with fastfetch-inspired home page"
```

---

### Task 8: Home Page

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace the default index page**

Write `src/pages/index.astro`:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import TerminalHero from '../components/TerminalHero.astro';
---

<BaseLayout title="Home" description="Bryan Ward - CS student and developer">
  <TerminalHero />
</BaseLayout>
```

- [ ] **Step 2: Verify dev server**

```bash
cd /home/b/Development/personal/website && npx astro dev --host 0.0.0.0 &
```
Wait a few seconds, then check that the page loads at `http://localhost:4321`. Kill the dev server after verifying.

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add home page with TerminalHero"
```

---

### Task 9: Placeholder Content

**Files:**
- Create: `src/content/blog/getting-started.mdx`
- Create: `src/content/blog/sample-post.mdx`
- Create: `src/content/projects/web-game.mdx`
- Create: `src/content/projects/cli-tool.mdx`

- [ ] **Step 1: Write placeholder blog posts**

Write `src/content/blog/getting-started.mdx`:
```mdx
---
title: "Getting Started"
date: 2026-05-08
description: "Hello, World! This is my first blog post, powered by Astro and MDX."
tags: ["astro", "personal"]
---

Welcome to my blog! This is where I'll write about things I'm learning and building.

More content coming soon.
```

Write `src/content/blog/sample-post.mdx`:
```mdx
---
title: "Another Post"
date: 2026-05-07
description: "A second sample post to demonstrate the blog sidebar."
tags: ["demo"]
---

This is another post to show how the sidebar works with multiple entries.
```

- [ ] **Step 2: Write placeholder projects**

Write `src/content/projects/web-game.mdx`:
```mdx
---
title: "Snake Game"
date: 2026-05-01
description: "A classic snake game built with vanilla JavaScript and Canvas."
tags: ["JavaScript", "Canvas", "Game"]
url: "/projects/snake-game"
featured: true
---

Coming soon: a web-based implementation of the classic Snake game.
```

Write `src/content/projects/cli-tool.mdx`:
```mdx
---
title: "Dotfiles Manager"
date: 2026-04-15
description: "A CLI tool for managing dotfiles across machines."
tags: ["Go", "CLI"]
repo: "https://github.com/bryanward/dotman"
---

A simple command-line tool to sync dotfiles and configurations.
```

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add placeholder blog posts and projects"
```

---

### Task 10: BlogSidebar Component

**Files:**
- Create: `src/components/BlogSidebar.astro`

- [ ] **Step 1: Write BlogSidebar**

Write `src/components/BlogSidebar.astro`:
```astro
---
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ data }) => {
  return import.meta.env.PROD ? true : true;
});

const sortedPosts = posts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const currentPath = Astro.url.pathname;
---

<aside class="blog-sidebar">
  <h3 class="sidebar-heading">Posts</h3>
  <ul class="post-list">
    {sortedPosts.map((post) => {
      const postPath = `/blog/${post.slug}`;
      const isActive = currentPath === postPath;
      return (
        <li>
          <a
            href={postPath}
            class:list={['post-link', { active: isActive }]}
          >
            <span class="post-title">{post.data.title}</span>
            <span class="post-date">
              {post.data.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </a>
        </li>
      );
    })}
  </ul>
</aside>

<style>
  .blog-sidebar {
    padding: 1.5rem 1rem;
    border-right: 1px solid var(--border);
    min-width: 240px;
    max-width: 260px;
    overflow-y: auto;
  }

  .sidebar-heading {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--text-muted);
    margin-bottom: 1rem;
    padding-left: 0.5rem;
  }

  .post-list {
    list-style: none;
  }

  .post-link {
    display: block;
    padding: 0.5rem 0.5rem;
    border-radius: 4px;
    color: var(--text-muted);
    transition: background 0.15s, color 0.15s;
  }

  .post-link:hover {
    background: var(--surface-hover);
    color: var(--text);
  }

  .post-link.active {
    background: rgba(0, 255, 102, 0.06);
    color: var(--accent);
    border-left: 2px solid var(--accent);
  }

  .post-title {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .post-date {
    display: block;
    font-size: 0.7rem;
    color: var(--text-muted);
    margin-top: 0.125rem;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add BlogSidebar component"
```

---

### Task 11: BlogPost Layout

**Files:**
- Create: `src/layouts/BlogPost.astro`

- [ ] **Step 1: Write BlogPost layout**

Write `src/layouts/BlogPost.astro`:
```astro
---
import BaseLayout from './BaseLayout.astro';
import BlogSidebar from '../components/BlogSidebar.astro';
import Tag from '../components/Tag.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
}

const { title, description, date, tags } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div class="blog-layout">
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
  </div>
</BaseLayout>

<style>
  .blog-layout {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    min-height: calc(100vh - 100px);
  }

  .blog-content {
    flex: 1;
    padding: 2rem 2rem;
    max-width: 800px;
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

  @media (max-width: 768px) {
    .blog-layout {
      flex-direction: column;
    }

    .blog-sidebar {
      border-right: none;
      border-bottom: 1px solid var(--border);
      max-width: 100%;
    }

    .blog-content {
      padding: 1.5rem 1rem;
    }
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add BlogPost layout with sidebar"
```

---

### Task 12: Blog Pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[...slug].astro`

- [ ] **Step 1: Write blog listing page**

Write `src/pages/blog/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

const posts = await getCollection('blog');
const sortedPosts = posts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const latestPost = sortedPosts[0];
const { Content } = await latestPost.render();
---

<BlogPost
  title={latestPost.data.title}
  description={latestPost.data.description}
  date={latestPost.data.date}
  tags={latestPost.data.tags}
>
  <Content />
</BlogPost>
```

- [ ] **Step 2: Write blog post page**

Write `src/pages/blog/[...slug].astro`:
```astro
---
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
const { Content } = await post.render();
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
>
  <Content />
</BlogPost>
```

- [ ] **Step 3: Verify blog pages build**

```bash
cd /home/b/Development/personal/website && npx astro build
```

Expected: Build succeeds. HTML files generated in `dist/blog/`.

- [ ] **Step 4: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add blog listing and post pages"
```

---

### Task 13: ProjectList Component

**Files:**
- Create: `src/components/ProjectList.astro`

- [ ] **Step 1: Write ProjectList**

Write `src/components/ProjectList.astro`:
```astro
---
import type { CollectionEntry } from 'astro:content';
import Tag from './Tag.astro';

interface Props {
  projects: CollectionEntry<'projects'>[];
}

const { projects } = Astro.props;
---

<ul class="project-list">
  {projects.map((project) => (
    <li class="project-item">
      <div class="project-top">
        <a href={`/projects/${project.slug}`} class="project-title">
          {project.data.title}
        </a>
        {project.data.featured && <span class="featured-badge">featured</span>}
      </div>
      <p class="project-desc">{project.data.description}</p>
      <div class="project-meta">
        <div class="tags">
          {project.data.tags.map((tag) => <Tag label={tag} />)}
        </div>
        <div class="project-links">
          {project.data.url && (
            <a href={project.data.url} class="meta-link">demo</a>
          )}
          {project.data.repo && (
            <a href={project.data.repo} class="meta-link" target="_blank" rel="noopener noreferrer">repo</a>
          )}
        </div>
      </div>
    </li>
  ))}
</ul>

<style>
  .project-list {
    list-style: none;
    max-width: 720px;
  }

  .project-item {
    padding: 1.25rem 0;
    border-bottom: 1px solid var(--border);
  }

  .project-item:first-child {
    padding-top: 0;
  }

  .project-item:last-child {
    border-bottom: none;
  }

  .project-top {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 0.375rem;
  }

  .project-title {
    font-family: var(--font-mono);
    font-size: 1.1rem;
    color: var(--text);
    transition: color 0.2s, text-shadow 0.2s;
  }

  .project-title:hover {
    color: var(--accent);
    text-shadow: 0 0 6px var(--accent-glow);
  }

  .featured-badge {
    font-family: var(--font-mono);
    font-size: 0.6rem;
    text-transform: uppercase;
    background: rgba(0, 255, 102, 0.1);
    color: var(--accent);
    border: 1px solid rgba(0, 255, 102, 0.25);
    border-radius: 3px;
    padding: 0.125em 0.5em;
  }

  .project-desc {
    font-size: 0.9rem;
    color: var(--text-muted);
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .project-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tags {
    display: flex;
    gap: 0.375rem;
    flex-wrap: wrap;
  }

  .project-links {
    display: flex;
    gap: 0.75rem;
  }

  .meta-link {
    font-family: var(--font-mono);
    font-size: 0.7rem;
    color: var(--text-muted);
    transition: color 0.2s;
  }

  .meta-link:hover {
    color: var(--accent);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add ProjectList component"
```

---

### Task 14: ProjectPage Layout

**Files:**
- Create: `src/layouts/ProjectPage.astro`

- [ ] **Step 1: Write ProjectPage layout**

Write `src/layouts/ProjectPage.astro`:
```astro
---
import BaseLayout from './BaseLayout.astro';
import Tag from '../components/Tag.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  url?: string;
  repo?: string;
}

const { title, description, date, tags, url, repo } = Astro.props;
---

<BaseLayout title={title} description={description}>
  <div class="project-page">
    <header class="project-header">
      <h1>{title}</h1>
      <time class="project-date" datetime={date.toISOString()}>
        {date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </time>
      <div class="tags">
        {tags.map((tag) => <Tag label={tag} />)}
      </div>
      {(url || repo) && (
        <div class="project-links">
          {url && <a href={url} class="project-link" target="_blank" rel="noopener noreferrer">Live Demo</a>}
          {repo && <a href={repo} class="project-link" target="_blank" rel="noopener noreferrer">Source Code</a>}
        </div>
      )}
    </header>
    <div class="prose">
      <slot />
    </div>
  </div>
</BaseLayout>

<style>
  .project-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .project-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border);
  }

  .project-header h1 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
  }

  .project-date {
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
    margin-bottom: 1rem;
  }

  .project-links {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }

  .project-link {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--accent);
    padding: 0.25rem 0.75rem;
    border: 1px solid var(--accent);
    border-radius: 4px;
    transition: background 0.2s, box-shadow 0.2s;
  }

  .project-link:hover {
    background: rgba(0, 255, 102, 0.1);
    box-shadow: 0 0 10px var(--accent-glow);
  }

  .prose {
    line-height: 1.8;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add ProjectPage layout"
```

---

### Task 15: Projects Pages

**Files:**
- Create: `src/pages/projects/index.astro`
- Create: `src/pages/projects/[...slug].astro`

- [ ] **Step 1: Write projects listing page**

Write `src/pages/projects/index.astro`:
```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectList from '../../components/ProjectList.astro';

const allProjects = await getCollection('projects');
const projects = allProjects.sort((a, b) => {
  if (a.data.featured && !b.data.featured) return -1;
  if (!a.data.featured && b.data.featured) return 1;
  return b.data.date.getTime() - a.data.date.getTime();
});
---

<BaseLayout title="Projects" description="Projects I've built">
  <div class="projects-page">
    <h1>Projects</h1>
    <p class="subtitle">Things I've built.</p>
    <ProjectList projects={projects} />
  </div>
</BaseLayout>

<style>
  .projects-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .projects-page h1 {
    margin-bottom: 0.25rem;
  }

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
</style>
```

- [ ] **Step 2: Write project detail page**

Write `src/pages/projects/[...slug].astro`:
```astro
---
import { getCollection } from 'astro:content';
import ProjectPage from '../../layouts/ProjectPage.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<ProjectPage
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  tags={project.data.tags}
  url={project.data.url}
  repo={project.data.repo}
>
  <Content />
</ProjectPage>
```

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add projects listing and detail pages"
```

---

### Task 16: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.js`

- [ ] **Step 1: Write RSS feed route**

Write `src/pages/rss.xml.js`:
```js
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: "Bryan Ward's Blog",
    description: 'Thoughts on code, projects, and learning.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      .map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.slug}`,
      })),
    customData: '<language>en-us</language>',
  });
}
```

- [ ] **Step 2: Verify RSS builds**

```bash
cd /home/b/Development/personal/website && npx astro build && cat dist/rss.xml | head -20
```

Expected: XML output with `<rss>` element, contains blog post entries.

- [ ] **Step 3: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: add RSS feed with @astrojs/rss"
```

---

### Task 17: Final Verification

- [ ] **Step 1: Run astro check**

```bash
cd /home/b/Development/personal/website && npx astro check
```

Expected: No type errors or warnings.

- [ ] **Step 2: Run production build**

```bash
cd /home/b/Development/personal/website && npx astro build
```

Expected: Build succeeds, `dist/` directory populated with HTML files for all pages.

- [ ] **Step 3: Verify all pages exist in dist/**

```bash
cd /home/b/Development/personal/website && find dist -name "*.html" | sort
```

Expected output should include:
```
dist/index.html
dist/blog/index.html
dist/blog/getting-started/index.html
dist/blog/sample-post/index.html
dist/projects/index.html
dist/projects/web-game/index.html
dist/projects/cli-tool/index.html
```

- [ ] **Step 4: Commit**

```bash
cd /home/b/Development/personal/website && git add -A && git commit -m "feat: finalize personal website skeleton"
```
