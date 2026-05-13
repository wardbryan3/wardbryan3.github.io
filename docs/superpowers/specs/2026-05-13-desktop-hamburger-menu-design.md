# Desktop Hamburger Menu with Theme Picker

## Summary

Move the desktop navigation links ("Home", "Blog", "Projects") into a slide-in panel from the right side of the navbar, and include a theme picker in that panel. Fix the cross-page theme persistence bug (theme was only applied on the homepage via DesktopOS, never on blog/projects pages).

## Problem

1. Desktop nav links are always visible — wastes horizontal space, especially on blog pages where the layout is already dense (sidebar + content + terminal column)
2. No way to switch themes outside the homepage's faux OS Settings window — blog/projects pages have no theme controls
3. Themes don't apply on non-homepage pages at all — `data-theme` is only set by DesktopOS's `useEffect`, which only renders on the homepage

## Design

### Hamburger Menu (Slide-in Panel)

- **Trigger**: A hamburger icon on the right side of the navbar in the `.nav-actions` area (replacing the current empty space)
- **Desktop only** (>768px). Mobile keeps the existing mobile nav unchanged (future overhaul planned separately)
- **Panel**: Fixed-position panel slides in from the right edge, below the navbar (`top: 52px`), spanning the viewport height minus navbar/footer
- **Width**: ~240px, matching the blog sidebar width
- **Overlay**: Semi-transparent backdrop covers the page when open
- **Dismiss**: Click outside the panel, press Escape, or click the hamburger again

### Panel Contents

**Navigation section** (top of panel):
- Home (with active highlight on `/`)
- Blog (with active highlight on `/blog`, `/blog/*`)
- Projects (with active highlight on `/projects`, `/projects/*`)
- Active link styled with accent color, same as current inline nav

**Theme section** (below navigation, separated by a divider):
- 2-column grid of theme buttons
- Each button shows the theme name (shortened for compact display) with the theme's background color as a visual cue
- Clicking a theme applies it immediately via the osStore's `setTheme`
- Currently selected theme highlighted

### Cross-Page Theme Persistence

**Root cause**: `data-theme` is only set by `DesktopOS.jsx`'s `useEffect`. Blog and project pages never call `document.documentElement.setAttribute('data-theme', ...)`, so they always render with the default `:root` styles ("system" dark purple) regardless of the user's saved preference.

**Fix**: Add an inline `<script>` in `BaseLayout.astro`'s `<head>` that reads localStorage and applies the theme before the first paint:

```js
(function() {
  try {
    var saved = JSON.parse(localStorage.getItem('portfolio-os-settings'));
    if (saved && saved.theme) {
      document.documentElement.setAttribute('data-theme', saved.theme);
    }
  } catch(e) {}
})();
```

This runs synchronously in `<head>` before any CSS-dependent rendering, eliminating the flash of incorrect theme.

## Implementation

### Files to Modify

- **`src/layouts/BaseLayout.astro`** — Add inline `<script>` in `<head>` for theme initialization
- **`src/components/Nav.astro`** — Add `client:load` React hamburger menu component; hide inline nav links on desktop (>768px); show hamburger button on desktop
- **`src/styles/global.css`** — Add styles for the slide-in panel, backdrop, theme grid

### Files to Create

- **`src/components/NavMenu.jsx`** — React component with:
  - `open` state for panel visibility
  - Nav links (Home, Blog, Projects) with active-link detection from `window.location.pathname`
  - Theme picker grid using `useOSStore` for reading/writing theme
  - Escape key listener and click-outside-to-close via backdrop

### No Changes Needed

- **`src/stores/osStore.js`** — `setTheme` already handles `data-theme` + localStorage
- **`src/styles/themes.css`** — Already has all theme definitions
- **Mobile styles** — untouched (<640px nav remains as-is)

## The FOUC Problem

Without the inline `<head>` script, the page renders with no `data-theme` attribute, so `:root` / `[data-theme="system"]` rules apply. After React hydrates and the menu component calls `useOSStore`, `DesktopOS`'s `useEffect` would fire to set the theme — but by then the page is already painted.

The inline script eliminates this entirely by running before any rendering.
