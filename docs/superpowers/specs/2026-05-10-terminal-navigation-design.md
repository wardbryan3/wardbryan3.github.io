# Terminal Navigation Design

## Summary

Expand the existing terminal to support full website navigation via keyboard.
Add a global keybinding (Ctrl+`) to focus the terminal from anywhere on the page.
Extend `cd`, `ls`, and `pwd` commands to cover all pages (blog posts, projects)
with path resolution supporting `~`, `/`, `..`, `home`, and bare `cd` as aliases
for the homepage.

## Commands

### `cd` — navigate anywhere

| Input | Behavior |
|---|---|
| `cd` (no args) | Navigate to `/` |
| `cd ~` | Navigate to `/` |
| `cd /` | Navigate to `/` |
| `cd home` | Navigate to `/` |
| `cd blog` | Navigate to `/blog` |
| `cd blog/my-post` | Navigate to `/blog/my-post` |
| `cd projects` | Navigate to `/projects` |
| `cd projects/my-project` | Navigate to `/projects/my-project` |
| `cd ..` | Go up one level |
| `cd .` | No-op |
| `cd slug` | Single-arg: fuzzy match across all searchData, prefer exact |

### `ls` — directory listing

| Input | Output |
|---|---|
| `ls` or `ls ~` or `ls /` | Root directories with descriptions |
| `ls blog` | All blog posts (title + date) |
| `ls projects` | All projects (title) |
| `ls bad` | Error: `ls: cannot access 'bad': No such directory` |

### `pwd` — current path

Shows the real URL path. Updated to reflect whatever page you're on.

### Commands unchanged

`help`, `whoami`, `date`, `echo`, `clear`, `history`, `fastfetch`, `find`, `grep`,
`cat README.md`, `top`

## Global Keybinding

- **Key**: Ctrl+` (backtick)
- **Effect**: Focuses terminal input. If collapsed, expands first. On mobile,
  opens floating overlay.
- **Implementation**: Single `document.addEventListener('keydown', ...)` in
  Terminal component mount.
- **Existing shortcuts preserved**: Ctrl+K/Ctrl+L remain input-scoped.

## Path Resolution

Path resolution is stateless — no virtual CWD. Each command parses its argument
independently using the passed `searchData` prop and current `page` prop:

- `..` strips last path segment from `page` prop
- Slugs validated against `searchData` entries
- Only needs enhanced `searchData` (add `date` field) and a `dirs` prop for
  root-level `ls` descriptions

## Data Flow

Existing props on Terminal component extended minimally:

- `searchData` — add `date` field to blog entries
- `dirs` — new optional prop: `{ name, description, count }[]` for root `ls`

No new data fetching. No new components. No new props on parent layouts beyond
what they already pass.

## Files Changed

- `src/terminal/commands.jsx` — rewrite `cd`, `ls`, `pwd` with path resolution
- `src/terminal/Terminal.jsx` — add global keydown listener, auto-focus +
  uncollapse on Ctrl+`
- `src/pages/index.astro` — pass `dirs` prop to Terminal
- `src/pages/blog/[...slug].astro` — pass `dirs` prop, add `date` to searchData
- `src/pages/projects/[...slug].astro` — pass `dirs` prop

## Non-goals

- No SPA routing (static site, full page navigation via window.location.href)
- No in-terminal content rendering (no `cat` for blog posts)
- No virtual filesystem state
- No changes to mobile hamburger or nav
