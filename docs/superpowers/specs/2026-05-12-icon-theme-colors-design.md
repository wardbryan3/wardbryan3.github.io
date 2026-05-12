# Theme-Aware Icon Colors

## Goal
Make all SVG icons in Portfolio OS respect the active theme by using `var(--text-muted)` for their fill color, and replace hardcoded PNG titlebar control buttons with themeable inline SVGs.

## Architecture
No new CSS custom properties or theme variables. Icons use the existing `--text-muted` color, which already varies per theme. All changes are in component JSX and one CSS rule.

## Changes

### 1. Global CSS utility class
Add to `src/styles/global.css`:
```css
.icon-img { color: var(--text-muted); }
```

### 2. Add `.icon-img` class to every `<img>` loading an SVG icon
Files and lines:
- `src/components/Dock.jsx:64,86,88`
- `src/components/AppBar.jsx:94`
- `src/components/Window.jsx:121`
- `src/components/MediaPlayerWindow.jsx:147,150,153,157`
- `src/components/DesktopOS.jsx:105`
- `src/components/TrashWindow.jsx:58,71`
- `src/components/ExplorerWindow.jsx:52,62,146`

### 3. Replace Window.jsx titlebar PNGs with inline SVGs
Four tiny inline SVGs using `fill="currentColor"` / `stroke="currentColor"`:
- Minimize, Maximize, Restore, Close
- Remove the 4 `icons8-*.png` references

### 4. Replace Terminal.jsx titlebar text with same inline SVGs
Replace Unicode text characters (`_`, `❐`/`□`, `×`) with the same inline SVGs from step 3.

### 5. Delete unused PNGs
Remove from `public/img/icons/`:
- `icons8-close-window-50.png`
- `icons8-maximize-window-50.png`
- `icons8-minimize-window-50.png`
- `icons8-restore-window-50.png`

## Files Modified
- `src/styles/global.css` — one rule
- `src/components/Window.jsx` — SVG `<img>` class + inline SVGs
- `src/components/Window.jsx` — inline SVGs (same as Window.jsx)
- `src/components/Dock.jsx` — class addition
- `src/components/AppBar.jsx` — class addition
- `src/components/MediaPlayerWindow.jsx` — class addition
- `src/components/DesktopOS.jsx` — class addition
- `src/components/TrashWindow.jsx` — class addition
- `src/components/ExplorerWindow.jsx` — class addition

## Files Deleted
- `public/img/icons/icons8-close-window-50.png`
- `public/img/icons/icons8-maximize-window-50.png`
- `public/img/icons/icons8-minimize-window-50.png`
- `public/img/icons/icons8-restore-window-50.png`
