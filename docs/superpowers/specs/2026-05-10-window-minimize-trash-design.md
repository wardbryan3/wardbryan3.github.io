# Window Minimize Fix & Trash Desktop Icon

## Issues

1. **Minimize button doesn't hide windows** — clicking minimize calls `toggleMinimize` which sets
   `minimized: true` in state, but the `Window` component only checks `open` before rendering.
2. **Active line indicator broken** — clicking a minimized app in the AppBar calls `focusWindow`
   which updates zIndex/activeApp but never unsets `minimized`. The indicator line renders
   in muted color because `isActive` requires `!w.minimized`.
3. **Trash should be a desktop icon** — remove from pinned AppBar apps; show in AppBar only
   when its window is open; add a desktop trash icon in bottom-right.

## Changes

### `src/components/Window.jsx` (line 103)
- Add `win.minimized` to render guard: `if (!win || !win.open || win.minimized) return null`

### `src/components/AppBar.jsx`
- Remove `trash` from pinned `APPS` array
- Change `focusWindow(id)` to `openWindow(id)` in minimized branch of `handleClick` —
  `openWindow` already handles un-minimizing via its internal check
- Merge trash into rendered apps only when `windows['trash']?.open` is true

### `src/components/DesktopOS.jsx`
- Add absolute-positioned trash icon at `bottom: 16px; right: 16px` with double-click
  handler calling `openWindow('trash')`
- Styled with theme CSS variables following existing OS aesthetic
