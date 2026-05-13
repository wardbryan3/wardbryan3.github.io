# Mobile Interface Design

## Overview

Replace the current terminal-only mobile experience with a content-first iOS-style interface. Full site content (blog, projects, resume, about) becomes accessible on mobile while keeping the terminal available but tucked away.

## Architecture

### Navigation: Floating Pill + Circle

The primary navigation is a floating tab bar consisting of two elements:

- **Pill capsule** containing main tabs (Home, Blog, Work) — dark blur glass material, pill-shaped, floats above content
- **Separate circle** for "More" — same glass material, positioned next to the pill

Active tab shows a filled SF-Symbol-style icon in accent color. Inactive tabs use outline-weight icons in muted gray. Labels sit below icons in 9px font.

### Tab Contents

| Tab | Content |
|-----|---------|
| **Home** | Hero with positioning statement + stack tags, featured projects (card with live/GitHub links), latest writing (post previews), terminal shortcut row |
| **Blog** | Blog index with post cards (title, date, read time), tap to read full post |
| **Work** | Project portfolio (cards or grid with tech badges, live demo, source links) |
| **More** | Bottom sheet slide-up with: Terminal, Resume, About, Settings, Contact |

### Visual Design

- **Tab bar**: `rgba(40,40,50,0.75)` background, 40px blur, saturate 200%, no border
- **Typography**: system font (`-apple-system`, system-ui), matching iOS conventions
- **Icons**: custom SVG in SF Symbols style — filled variant for active, outline for inactive
- **Cards**: rounded (10-14px radius), subtle border, surface background
- **Content padding**: 16px horizontal, consistent spacing scale
- **Dark mode**: glass adapts naturally to existing theme system

### Terminal

Accessed from the More sheet. Opens as a full-screen view over the current tab with:
- Auto-maximized (existing behavior at < 768px)
- Back button to dismiss to previous tab
- Existing terminal commands available

## Component Tree

```
MobileLayout (root — manages tabs + overlays)
  MobileHeader (title + settings gear)
  MobileTabBar
    PillTabs (Home, Blog, Work)
    MoreCircle (opens MoreSheet overlay)
  TabContent (switches based on active tab + navigationStack)
    HomeTab
      HeroSection
      FeaturedWork (project cards)
      LatestWriting (post previews)
      TerminalShortcut
    BlogTab (list → tap post → BlogPostPage replaces list)
      BlogPostCard[]
      BlogPostPage (detail view with back to list)
    WorkTab
      ProjectCard[]
  MoreSheet (overlay, slides up from bottom over any tab)
    TerminalButton → opens MobileTerminalView
    ResumeLink
    AboutSection
    SettingsPanel
    ContactLink
  MobileTerminalView (full-screen overlay, back dismisses)
```

### Navigation Flow Within Tabs

Each tab has its own `navigationStack` in state. Tapping a blog post pushes the detail view onto the stack; the back button pops it. The tab bar remains visible on list views but hides during detail views to maximize reading space.

## State

Use existing Zustand store (`osStore.js`). Add:

- `mobileActiveTab`: 'home' | 'blog' | 'work'
- `mobileViewStack`: `{ tab: string, view: string }[]` — per-tab navigation stack for back-button support. Blog pushes `{ tab: 'blog', view: 'post-{slug}' }` to show a post detail; back pops to list.
- `moreSheetOpen`: boolean
- `terminalOpen`: boolean

Theme/wallpaper/clock settings already persist via localStorage and apply to both desktop and mobile. No duplication needed.

## Changes to Existing Code

### Pages

- **`src/pages/index.astro`**: Replace `HeroDashboard` with `MobileLayout` in the mobile `client:media` block
- **`src/pages/blog/index.astro`**: Remove `display: none` at mobile, render `BlogTab` content instead
- **`src/pages/projects/index.astro`**: Remove `display: none` at mobile, render `WorkTab` content instead

### Styles

**`src/styles/global.css`**: Remove mobile `display: none` rules for blog and project pages, keep terminal auto-maximize behavior.

Specific rules to remove at line ~579-627 (the `@media (max-width: 768px)` block):
- `.blog-docs-layout { display: none; }` and its children — blog content should render
- `.project-page, .projects-page { display: none; }` — project pages should render
- Keep terminal auto-maximize rules (`.terminal-flow`, etc.)

Replace with: mobile-adapted content styles that the new React components handle.

**`src/components/HeroDashboard.jsx`**: Can be removed entirely — replaced by `MobileLayout`/`HomeTab`.

### New Components Required

- `src/components/mobile/MobileLayout.jsx` — root container with tab bar + content area
- `src/components/mobile/MobileTabBar.jsx` — pill + circle navigation
- `src/components/mobile/MoreSheet.jsx` — bottom sheet overlay
- `src/components/mobile/HomeTab.jsx` — homepage content
- `src/components/mobile/BlogTab.jsx` — blog list
- `src/components/mobile/BlogPostPage.jsx` — single post view
- `src/components/mobile/WorkTab.jsx` — projects list
- `src/components/mobile/MobileTerminalView.jsx` — full-screen terminal wrapper
- `src/components/mobile/MobileHeader.jsx` — top navigation bar

## Future Phases (not in initial implementation)

- iOS spring animations / gesture-driven transitions between tabs
- Pull-to-refresh on blog/project lists
- Tab bar auto-hide on scroll down (iOS 26 collapsible tab bar pattern)
- Share sheet integration for blog posts
- Push notifications
- PWA manifest updates
- Offline content caching
