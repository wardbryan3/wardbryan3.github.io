# Animated Wallpapers — Digital Rain + Hexagon Field

## Overview

Add two new animated wallpaper options to the Portfolio OS desktop. Both follow the existing `ParticleField` pattern: they render as absolutely-positioned full-viewport canvases with `pointerEvents: none`, read CSS custom properties (`--accent`, `--primary`) for theme adaptation, and are selectable from the Settings panel.

## Wallpaper 1: Digital Rain

### Implementation

Canvas 2D (not Three.js). A `DigitalRain.jsx` component using a single `<canvas>` element with a 2D rendering context.

### Behavior

- Columns of characters fall vertically at varying speeds
- Each column: 4-8 characters visible, brightest at the leading (bottom) character, fading to dim toward the top
- Characters drawn from English letters (a-z, A-Z) and digits (0-9) only
- Character set: `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
- Column count: ~60-80 columns across the viewport width
- Each column has independent speed, density, and reset timing
- When a column reaches the bottom, it resets to a random position above viewport with a new random speed
- The leading character is bright (full opacity), trailing characters fade exponentially (`opacity = 1.0 / distance^1.5`)

### Visual Style

- Characters rendered in monospace font (10-12px)
- Color: primarily `--accent` for the leading char, `--primary` for trailing chars
- Subtle glow: `ctx.shadowBlur` + `ctx.shadowColor` matching the text color
- Background: transparent (CSS `var(--bg)` shows through, or no background fill at all)

### Theme Adaptation

- On theme change (detected via `useOSStore` `theme` subscription), re-read CSS vars and apply to next frame
- Uses `getCSSVar` utility (shared from `ParticleField.jsx` or duplicated)

### Performance

- `requestAnimationFrame` loop, only render visible columns
- Pause when tab is hidden (`document.hidden` check)
- DPR-aware canvas sizing via `devicePixelRatio`

## Wallpaper 2: Hexagon Field

### Implementation

Three.js via React Three Fiber (`@react-three/fiber`), same pattern as `ParticleField`.

### Geometry

- Flat honeycomb grid of hexagons using `RingGeometry` or custom `BufferGeometry`
- Each hexagon is a flat shape (thin extrusion or flat mesh) lying in the XZ plane
- Grid dimensions: ~15x10 hexagons (configurable), evenly spaced
- Hexagon radius: ~0.4 units, spacing ~0.7 units center-to-center
- Camera positioned looking down at the grid from above at a slight angle, slowly orbiting

### Interaction — Mouse Hover

- Raycaster tracks mouse position over the grid
- Hovered hexagon pulses: scales up slightly (1.0 -> 1.15) and increases opacity/emissive intensity
- Pulse follows a smooth curve (sine-based) on hover enter
- Adjacent hexagons get a weaker ripple effect propagating outward
- When mouse leaves all hexagons, they return to ambient state with smooth easing

### Visual Style

- Each hexagon colored with either `--accent` or `--primary` (random 60/40 split)
- Ambient state: low opacity (~0.2-0.3), subtle color
- Hovered state: full opacity (~0.8-1.0), brighter, slight scale pulse
- `AdditiveBlending` or standard transparency
- Wireframe outline option on each hexagon (thin line with `--border` color)

### Animation

- Ambient slow wave: a gentle sine wave passes through the grid (alters opacity/scale subtly), independent of mouse
- Camera slowly rotates around the Y axis (0.02-0.04 rad/s)

### Performance

- Hexagon geometry shared via `useMemo`
- Raycaster only active when mouse is over the canvas area
- InstancedMesh for all hexagons (single draw call)
- DPR capped at `[1, 1.5]` like ParticleField

## Registration

Both wallpapers register the same way as `ParticleField`:

1. **`src/components/DigitalRain.jsx`** and **`src/components/HexField.jsx`** — new components
2. **`src/components/DesktopOS.jsx`** — add imports and conditional render branches (same pattern as line 52)
3. **`src/components/SettingsWindow.jsx`** — add keys to `WALLPAPERS` array
4. **`src/stores/osStore.js`** — optionally update default wallpaper
5. **`src/components/HeroDashboard.jsx`** — check if it needs updating (it always uses ParticleField)

## File Changes

| File | Action |
|------|--------|
| `src/components/DigitalRain.jsx` | Create |
| `src/components/HexField.jsx` | Create |
| `src/components/DesktopOS.jsx` | Edit (add imports + conditionals) |
| `src/components/SettingsWindow.jsx` | Edit (extend WALLPAPERS array) |

## Testing

- Both wallpapers should render without errors in the desktop view
- Theme switching should update colors immediately
- Digital Rain: verify characters are English alphanumeric only
- Hex Field: mouse hover should trigger pulse effect
- Settings dropdown should list both new options and switching should work
