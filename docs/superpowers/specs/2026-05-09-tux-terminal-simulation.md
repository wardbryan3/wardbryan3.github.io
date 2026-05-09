# Tux Terminal Simulation

## Summary

Replace the current TuxWireframe component (which displays ASCII art as a centered block with a typewriter effect) with a terminal simulation: a sequential reveal of a shell prompt, a `cat` command, and then the ASCII art output — all within the existing panel structure.

## Motivation

The previous approach had a persistent "border around the ASCII art" issue — a visible visual boundary at the edges of the art text within the panel. By presenting the art as terminal output (left-aligned, part of a command/response flow), the art integrates naturally into the panel with no separate box or border around it.

## Design

### Layout
- Same panel structure: `.terminal-panel` with `.panel-header` and `.panel-body`
- Panel header: `cat /usr/share/ascii/tux.txt` (unchanged)
- Panel body: left-aligned terminal content (no centering)
- Font size: `0.75rem` (inherited from `.terminal-panel`, matching all other panels)
- No text-shadow or glow on the art text
- No scanlines or vignette overlays

### Animation Sequence
1. **Prompt types out**: `$ ` appears character by character
2. **Command types out**: `cat /usr/share/ascii/tux.txt` types out after the prompt
3. **Newline** appears after command completes
4. **Art types out**: the ASCII art Tux types out chunk by chunk

### Cursor Behavior
- A blinking block cursor (`█`) follows the typing at the current position
- After the art finishes typing, a new prompt line appears below: `user@host:~$ █`

### Component Changes
- `src/components/TuxWireframe.jsx`: Complete rewrite of the animation logic (sequential state machine instead of single typewriter)
- `src/styles/global.css`: Remove `.tux-body` flex-centering, update `.tux-art` to plain left-aligned text at 0.75rem

### CSS Changes
- `.tux-body`: Remove `display: flex`, `align-items: center`, `justify-content: center` — text is left-aligned in normal flow
- `.tux-art`: Remove `text-shadow`, set `font-size` to inherit (0.75rem), remove centering
- No new CSS classes needed — reuse existing `.terminal-panel`, `.panel-header`, `.panel-body`

## File Changes

| File | Change |
|------|--------|
| `src/components/TuxWireframe.jsx` | Rewrite animation to sequential command→output model |
| `src/styles/global.css` | Simplify `.tux-body` and `.tux-art` — remove centering, glow, custom sizing |

## Testing

- `npm run build` must pass (astro check + astro build)
- No visual test framework — manual verification in browser
