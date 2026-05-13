# Search Modal Design

## Summary

Add a search icon button next to the hamburger menu in the desktop navbar. Clicking it (or pressing Cmd+K/Ctrl+K) opens a centered modal overlay that lets users search blog posts and projects by title and tags, with live filtering as they type.

## Problem

No quick way to search the site across pages. The terminal has `find` and `grep` commands that search the same data, but the terminal is hidden by default on blog/projects pages and only shows on the homepage after boot.

## Design

### Search Button
- Magnifying glass icon (`&#128269;` or SVG) next to the hamburger menu in `.nav-actions`
- Desktop only (>=769px), no mobile changes

### Search Modal
- **Position**: Fixed at the top of the viewport (`top: ~60px`), centered horizontally. Overlays the navbar area. Feels like part of the navbar.
- **Width**: 520px max, responsive down
- **Backdrop**: Semi-transparent overlay covers the page
- **Input**: Auto-focused when opened, placeholder text "Search posts and projects..."
- **Results**: Grouped by type (Blog Posts, Projects), filtered in real-time as user types
- **Empty state**: "No results found" message when nothing matches
- **Selection**: Arrow keys navigate, Enter opens selected result, click opens result

### Triggers
- Click the search icon button
- Press Cmd+K / Ctrl+K (global keyboard shortcut, opens modal if closed)
- Press Escape or click backdrop to close

### Data
- Build-time generated `/search-index.json` at `src/pages/search-index.json.js` (same pattern as `rss.xml.js`)
- Same data format as the terminal's `searchData`: `{ title, slug, path, type, tags, date }`
- Fetched on modal mount and cached in memory
- Same filtering logic as terminal's `find` (title match) and `grep` (title + tags match)

## Implementation

### Files to Create
- `src/pages/search-index.json.js` — Build-time JSON endpoint for search data
- `src/components/SearchModal.jsx` — React component: search icon button + modal overlay + live search

### Files to Modify
- `src/components/Nav.astro` — Add `<SearchModal client:load />` in `.nav-actions`
- `src/styles/global.css` — Add styles for search modal, backdrop, results list

### No Changes Needed
- `src/terminal/commands.jsx` — Terminal's find/grep continue to work independently
- `src/stores/osStore.js` — No state needed for search
- `src/layouts/BaseLayout.astro` — No layout changes
