# Personal Website Design

## Overview

Personal website for Bryan Ward, a 2nd-year CS student. Built with Astro + MDX,
featuring a dark cyberpunk theme with neon purple and lime accents.

## Tech Stack

- **Framework:** Astro
- **Content:** MDX (Astro Content Collections)
- **Styling:** Plain CSS with custom properties
- **Package Manager:** npm
- **Integrations:** @astrojs/mdx, @astrojs/rss, @astrojs/sitemap

## Color Palette (Grim Purple + Lime)

| Token | Value |
|-------|-------|
| `--bg` | `#05000a` |
| `--surface` | `#12001a` |
| `--text` | `#d0c0e0` |
| `--primary` | `#8800cc` |
| `--accent` | `#00ff66` |

## Typography

- **Headings:** JetBrains Mono (retro monospace, cyber feel)
- **Body:** Inter (clean sans-serif for readability on dark backgrounds)
- **Effects:** Neon glow on accent elements (box-shadow + text-shadow with lime),
  animated typing effects, scan-line overlays

## Project Structure

```
website/
  src/
    layouts/
      BaseLayout.astro
      BlogPost.astro
      ProjectPage.astro
    pages/
      index.astro
      blog/
        index.astro
        [...slug].astro
      projects/
        index.astro
        [...slug].astro
    content/
      blog/          # MDX blog posts
      projects/      # MDX project pages
    styles/
      global.css
    components/
      Nav.astro
      Footer.astro
      TerminalHero.astro
      BlogSidebar.astro
      ProjectList.astro
      Tag.astro
  public/
    projects/        # Standalone web games
```

## Pages

### Home (`index.astro`)
- Terminal/sysinfo aesthetic inspired by fastfetch
- ASCII art or styled header with shell prompt: `bryan@ward`
- System-info-style fields: Name, Status, Level, Location, etc.
- Animated typing effect on tagline

### Blog (`blog/index.astro`, `blog/[...slug].astro`)
- Docs-style layout: left sidebar listing all post titles with dates
- Right panel shows selected post content
- Sidebar from `BlogSidebar.astro` component

### Projects (`projects/index.astro`, `projects/[...slug].astro`)
- Simple list of projects
- Each card shows: title, description, tech tags, optional demo/repo links
- Projects with `featured: true` pinned to top

## Components

- **Nav.astro** — Fixed top bar, name on left, page links on right, neon active state
- **Footer.astro** — Single line: `(c) 2026 Bryan Ward` + social links (GitHub, LinkedIn)
- **TerminalHero.astro** — Fastfetch-inspired hero section for home page
- **BlogSidebar.astro** — Left sidebar with post titles and dates
- **ProjectList.astro** — Simple project listing
- **Tag.astro** — Small neon pill for tech tags

## Content Model

### Blog Post Frontmatter
```yaml
---
title: string
date: date (YYYY-MM-DD)
description: string
tags: string[] (optional)
---
```

### Project Frontmatter
```yaml
---
title: string
date: date (YYYY-MM-DD)
description: string
tags: string[]
url: string (optional)
repo: string (optional)
featured: boolean (optional)
---
```

## Navigation

Fixed top nav bar. Pages: Home, Blog, Projects. Active page indicated by neon
underline using accent color. Footer is minimal — copyright + social links.

## RSS

RSS feed generated via `@astrojs/rss` integration. Available at `/rss.xml`.
