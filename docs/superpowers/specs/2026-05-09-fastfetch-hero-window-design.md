# Fastfetch Hero Window

## Summary

Replace the current hero section (TitleOverlay + DashboardGrid with 5 panel components) with a single terminal window that animates open and types out a fastfetch-style system info display.

## Background

Keep the existing ParticleField (Three.js canvas) as the full-screen background. Unchanged.

## Window Animation

- The terminal window container grows from bottom-center using CSS transform with a KDE-style spring ease (`cubic-bezier(0.34, 1.56, 0.64, 1)`)
- Originates as a tiny dot at the bottom center of the hero area
- Scales to full size over ~400ms with slight overshoot
- After the grow animation completes, the typing animation begins

## Typing Animation

All text types out character-by-character (no divider line). The tux art and field lines type simultaneously — each character reveals in both columns at the same time, as if a single text stream is being printed to the terminal.

Sequence:

1. Prompt appears: `bryan@ward:~$` with blinking block cursor
2. `fastfetch` command types out at the prompt
3. Newline, then output begins: tux ASCII art (left column) and field lines (right column) type out simultaneously character by character
4. Final prompt: `bryan@ward:~$` with the blinking block cursor — the only cursor on the page

The animation always plays through (no click-to-skip).

## Content Fields

Displayed as `key` (gray, right-padded) + `value` (colored):

| Key       | Value             | Color       |
|-----------|-------------------|-------------|
| name      | Bryan Ward         | green       |
| status    | building cool stuff | green       |
| level     | CS student / developer | purple  |
| focus     | full-stack web     | white       |
| tools     | TypeScript, JavaScript, React, Next.js, Node.js, Python, Java, C++, Rust, SQL, Git, Docker, Linux, Astro | white |
| projects  | N active (dynamic) | white       |
| posts     | M published (dynamic) | white     |
| github    | github.com/wardbryan3 | blue (link) |
| linkedin  | linkedin.com/in/bryan-ward-298292196 | blue (link) |

Links are clickable anchors opening in `target="_blank"`.

## Layout

- Tux art left, fields right (flexbox row, gap ~24px)
- On mobile (below 480px): hide tux art, fields stack at full width
- Window is centered in the hero viewport, max-width constrained so it looks good at desktop sizes

## Responsive

- **Desktop:** Full layout as shown, window comfortably sized
- **Tablet (~768px):** Smaller tux art or slightly tighter gap
- **Mobile (~480px):** Tux art hidden, fields full-width

## Component Changes

### Remove (no longer needed)
- `src/components/DashboardGrid.jsx`
- `src/components/InfoPanel.jsx`
- `src/components/StatsPanel.jsx`
- `src/components/SkillsPanel.jsx`
- `src/components/LinksPanel.jsx`
- `src/components/TitleOverlay.jsx`
- `src/components/TuxWireframe.jsx`

### Keep
- `src/components/ParticleField.jsx` (background, unchanged)
- `src/components/HeroDashboard.jsx` (will be reworked to render FastfetchWindow instead of the old layout)

### Create
- `src/components/FastfetchWindow.jsx` — the main component handling grow animation, typing state machine, and rendering tux art + fields

## Props

FastfetchWindow accepts:
- `projectCount` (number) — for the projects field
- `postCount` (number) — for the posts field

Passed from `index.astro` through `HeroDashboard`.

## Implementation Details

- Use React state machine for typing phases: `idle` → `growing` → `prompt` → `command` → `output` → `done`
- The grow phase uses CSS animation (`@keyframes window-grow`)
- The typing phase uses `setTimeout` / `requestAnimationFrame` for character-by-character reveal
- Tux art is stored as a string constant and revealed character by character
- Each field line types out character by character in sequence

## CSS

- Add `@keyframes window-grow` animation with transform-origin `bottom center`
- Remove all old dashboard grid, panel, tux-cursor, hero-cursor styles
- Keep only one cursor style for the final prompt
- Keep scanline overlay, neon glow, and existing theme variables
- Keep responsive breakpoints (480px, 768px) for hiding tux art
