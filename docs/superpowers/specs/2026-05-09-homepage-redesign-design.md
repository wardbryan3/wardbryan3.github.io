# Homepage Redesign: Cyberpunk Terminal Desktop

## Overview

Replace the current minimal TerminalHero homepage with a full-viewport, React-powered terminal dashboard featuring WebGL particle backgrounds, a procedural 3D Tux penguin wireframe, and layered CSS/DOM effects. The result should feel like a "system desktop" — an advanced, impressive personal landing page that shows technical sophistication at a glance.

## Goals

- Replace the Mac-style dots with clean terminal panel headers
- Add React for interactive, stateful hero components
- Add Three.js (react-three-fiber) for particle backgrounds and 3D wireframe
- Push Nav/Footer content to extreme corners (left/right justification)
- Keep the cyberpunk theme (purple + lime, monospace, CRT scanlines)

## Tech Stack Additions

- `@astrojs/react` — React integration for Astro
- `react` + `react-dom` — React runtime
- `@react-three/fiber` — Declarative Three.js in React
- `@react-three/drei` — Three.js utilities (orbit controls, helpers)

No external animation libraries. All CSS/DOM effects are hand-written.

## Component Tree

```
layout/BaseLayout.astro
  Nav.astro (logo far-left, links far-right)
  <main>
    HeroDashboard.jsx (React island, client:load)
      ParticleField      — Three.js <Canvas> with floating particle system
      TitleOverlay       — Large glowing "BRYAN_WARD" with CSS text effects
      DashboardGrid      — CSS grid of terminal-style panels
        TuxWireframe     — Three.js canvas rendering procedural Tux penguin as wireframe
        InfoPanel        — Name, status, focus, location (terminal box)
        StatsPanel       — Project/post/language counts with animated numbers
        SkillsPanel      — Tech tag chips with glow borders
        LinksPanel       — GitHub, LinkedIn, email with prompt-style formatting
      ScanlineOverlay    — CSS ::before pseudo-element (CRT effect, already exists)
  Footer.astro (copyright far-left, social links far-right)
```

## Effects Breakdown

### WebGL (Three.js)

**ParticleField:**
- ~500–1000 floating particles rendered as points or small spheres
- Slow rotation on each axis, Brownian motion or noise-based displacement
- Uses `@react-three/drei` OrbitControls disabled (auto-animate only)
- Subtle fog for depth fade
- Colors: mix of `#00ff66` (accent green) and `#8800cc` (primary purple)

**TuxWireframe:**
- Procedurally constructed from Three.js primitives (no external assets)
- Body: Ellipsoid (scaled sphere)
- Head: Smaller sphere positioned above body
- Beak: Cone geometry, positioned on head
- Eyes: Two small spheres
- Flippers: Lathe geometry or custom shape geometry, angled outward
- Rendered as `EdgesGeometry` + `LineBasicMaterial` for wireframe look
- Slow Y-axis rotation
- Sits inside a terminal panel with a monospace border

### CSS/DOM

**TitleOverlay:**
- Heavy layered `text-shadow` glow in accent green (`#00ff66`)
- Multiple shadow layers: near glow, medium spread, wide ambient
- Animated glitch effect on hover (skew + color split via pseudo-elements)
- Blinking underscore cursor appended to title

**Terminal Panels:**
- `background: var(--surface)` with `border: 1px solid var(--border)`
- Subtle `box-shadow` pulse animation on panel borders
- Monospace text with accent-color labels
- Hover: border color transitions to accent with glow

**Prompt Line:**
- Typewriter-text CSS animation (typing steps)
- Blinking cursor at end (existing `@keyframes blink`)

**Scanlines:**
- Existing `body::before` scanline overlay in `global.css` — keep as-is

### Canvas 2D

- Mouse-following glow/particle trail on the dashboard area
- Subtle — doesn't compete with the WebGL particle field
- Implemented as a full-size transparent canvas behind the panels, pointer-events: none

## Nav/Footer Restyling

### Nav.astro
- `display: flex; justify-content: space-between; align-items: center;`
- Logo/name on far left
- Navigation links on far right
- Remove any centered content
- Keep sticky positioning and backdrop blur

### Footer.astro
- `display: flex; justify-content: space-between; align-items: center;`
- Copyright string on far left
- Social links (GitHub, LinkedIn) on far right
- Keep border-top and muted styling

## TerminalHero.astro

- Remove the red/yellow/green dots from the header bar
- Replace with a simple monospace title line: `bryan@ward ~ $` style header
- Or: remove TerminalHero entirely and replace with HeroDashboard

## File Changes

| Action | File |
|--------|------|
| ADD | `src/components/HeroDashboard.jsx` |
| ADD | `src/components/ParticleField.jsx` |
| ADD | `src/components/TuxWireframe.jsx` |
| ADD | `src/components/DashboardGrid.jsx` |
| ADD | `src/components/InfoPanel.jsx` |
| ADD | `src/components/StatsPanel.jsx` |
| ADD | `src/components/SkillsPanel.jsx` |
| ADD | `src/components/LinksPanel.jsx` |
| ADD | `src/components/TitleOverlay.jsx` |
| MODIFY | `src/pages/index.astro` |
| MODIFY | `src/components/Nav.astro` |
| MODIFY | `src/components/Footer.astro` |
| REMOVE | `src/components/TerminalHero.astro` |
| MODIFY | `package.json` (add dependencies) |
| MODIFY | `astro.config.mjs` (add react integration) |

## Dependencies to Add

```json
{
  "@astrojs/react": "^4.x",
  "react": "^19.x",
  "react-dom": "^19.x",
  "@react-three/fiber": "^9.x",
  "@react-three/drei": "^9.x",
  "three": "^0.170.x"
}
```

## Non-Functional Requirements

- Page must render as static HTML with React hydrated client-side
- Three.js canvas must respect the terminal panel bounds — no overflow
- Performance: target 60fps on desktop, graceful degradation on mobile (fewer particles)
- Accessibility: panels should be readable without JS; 3D effects are progressive enhancement
- All styling continues using CSS custom properties from `global.css`
