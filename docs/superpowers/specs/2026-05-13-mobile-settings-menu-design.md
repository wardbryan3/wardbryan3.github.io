# Mobile Settings Menu — Design Spec

## Overview

Add a proper settings menu to the mobile interface. Currently the MoreSheet has a "Settings" entry that does nothing. This spec defines a full-page settings panel that slides up from the bottom, with theme, font size, and wallpaper options.

## Settings

Three settings, matching the desktop SettingsWindow:
- **Theme** — `select` with all themes: system, tokyonight, everforest, ayu, catppuccin, catppuccin-macchiato, gruvbox, kanagawa, nord, matrix, one-dark
- **Font size** — `select` with: small, medium, large
- **Wallpaper** — `select` with: particle-field, digital-rain, hex-field, dots, grid, none

Changes apply immediately via the existing store setters (`setTheme`, `setFontSize`, `setWallpaper`). State persists to localStorage through the existing `saveSettings` mechanism.

## UI / UX

### Entry Point
- User taps More → MoreSheet slides up
- User taps "Settings" → MoreSheet closes (with its current slide-down animation)
- Settings panel slides up from the bottom

### Settings Panel
- Full-height panel with dark overlay behind it (same pattern as MoreSheet)
- Slides up from the bottom (same CSS transition pattern)
- Title bar at top: back arrow (`<-`) on the left, "Settings" centered
- Scrollable body with setting rows
- Each row: label on the left, `<select>` dropdown on the right
- Version text at bottom: "Portfolio OS v1.0"

### Dismissal
- Back arrow: slides panel down, returns to the previous tab
- Tap dark overlay: slides panel down, returns to the previous tab
- Slide-down animation matches the open animation (reversed)

### Navigation
- Uses the existing `mobileViewStack` in the osStore
- `pushMobileView('settings')` when opening
- `popMobileView()` when closing
- Back navigation returns to whatever tab the user was on

## Architecture

### New Component: `SettingsView.jsx`
- Full-screen panel, positioned `fixed` with `inset: 0`
- Same `alive`/`slideIn` state pattern as `MoreSheet` for animated entry/exit
- Renders inside `MobileShell` alongside `MoreSheet`
- Visibility controlled by: `mobileViewStack.includes('settings')` OR dedicated store boolean

### Store Changes (minimal)
- Uses the existing `mobileViewStack` — `pushMobileView('settings')` to open, `popMobileView()` to close
- No new store state needed

### Integration
- `MoreSheet.jsx` — `handleItemClick` for `'settings'` calls `pushMobileView('settings')` (or equivalent) + `handleClose()`
- `MobileShell.jsx` — renders `<SettingsView />` alongside `<MoreSheet />`
- All settings state and setters already exist in the store (shared with desktop)

## Dependencies
- No new store state needed (settings live in existing store, navigation via existing `mobileViewStack`)
- Shared themes/fonts/wallpapers lists can be imported from `SettingsWindow.jsx` (or duplicated — only 3 small arrays)
- All store setter functions already exist (`setTheme`, `setFontSize`, `setWallpaper`)

## Open Questions
- None. Design is fully specified.
