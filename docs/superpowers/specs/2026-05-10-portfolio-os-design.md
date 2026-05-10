# Portfolio OS — Desktop Homepage Overhaul

## Overview

Replace the current HeroDashboard (Terminal + ParticleField) homepage with a "Portfolio OS" desktop metaphor. The page becomes a fully interactive desktop environment with draggable, resizable windows, a top dock, and a floating app bar. Desktop only (>768px); mobile/tablet retains the existing Terminal-based layout.

## Architecture

### State Management

Zustand store (`src/stores/osStore.js`) holds all OS state. Created outside React so plain JS modules (Terminal command registry) can import it directly.

```js
// Store shape
{
  windows: {
    explorer:     { id, title, icon, open, minimized, maximized, position: {x,y}, size: {w,h}, zIndex },
    resume:       { ... },
    "media-player": { ... },
    trash:        { ... },
    settings:     { ... },
    terminal:     { ... },
  },
  windowOrder: [],       // z-order stack, last = top
  activeApp: "explorer", // title shown in dock center
  theme: "tokyonight",
  wallpaper: "particle-field",
  terminalFont: "mono",
  clockFormat: "12h",
  dockPosition: "top",
}
```

### Component Tree

```
DesktopOS (client:load React island)
├── ParticleField (background, reads CSS vars for theme colors)
├── Dock (top bar)
│   ├── PeekDesktopButton
│   ├── ActiveAppName (from store.activeApp)
│   ├── SettingsGear
│   ├── SystemTray
│   └── Clock (clickable greeting tooltip)
├── WindowLayer
│   ├── Window (shared frame: titlebar + resize + drag + focus)
│   │   ├── ExplorerWindow
│   │   ├── ResumeWindow
│   │   ├── MediaPlayerWindow
│   │   ├── TrashWindow
│   │   ├── SettingsWindow
│   │   └── TerminalWindow (wraps existing Terminal)
│   └── ... (one per open window)
└── AppBar (bottom floating pill, auto-hide)
    ├── LauncherIcon (×6: Explorer, Resume, Media Player, Trash, Settings, Terminal)
    └── OpenWindowIndicator (dot/line below open apps)
```

### Key Dependencies

- **zustand** (~1KB) — state management
- No drag/resize library — custom mouse event handlers on Window frame (reuses patterns from existing Terminal)

## Windows

All windows share a common title bar with menubar (File / Edit / View) + address bar or status bar where applicable, except Terminal which keeps its existing chrome.

### 1. Explorer (Projects ~ Portfolio)

- Title: "Projects ~ Portfolio"
- Icon: Folder
- Default size: 640x480
- Menubar + address bar (back/forward/up) + file tree sidebar + grid content
- File tree shows project folders; clicking filters grid
- Grid tiles: folder icon, title, short description, tech stack badges (.react, .py, etc.), Open button
- Open button: expands to modal view within window (full write-up, live link, GitHub)
- Double-click folder: minimizes Explorer, navigates to /projects/{slug}/
- Data: projects collection passed as Astro prop

### 2. Resume (Document Viewer)

- Title: "resume_current.pdf — Preview"
- Icon: Document
- Default size: 520x600
- Menubar + page counter
- Monospaced PDF-reader layout: contact line, experience (dates + bullets), skills, education
- Download PDF button at bottom (real PDF from public/)
- Data: static config file

### 3. Media Player (Social Proof)

- Title: "Now Playing"
- Icon: Cassette/note
- Default size: 420x360
- Menubar
- Layout: left = track list, right = visualization (animated bars), bottom = controls
- Track list: achievements as songs (title + duration)
- Play: highlights current track with equalizer animation
- Prev/Next: cycle through tracks
- Shuffle: random client/colleague quote
- Data: static config file

### 4. Trash Can (Easter Egg)

- Title: "Trash (0 items)"
- Icon: Trash can
- Default size: 360x280
- Menubar
- Empty state: playful message about dragging windows
- Dummy file: bad_idea.txt or deleted_project.zip with funny content
- Drag-over visual gag: whoosh + minimize (optional)

### 5. Settings (System Preferences)

- Title: "Settings — Portfolio OS"
- Icon: Gear
- Default size: 400x350
- Menubar
- Options: Theme selector, Wallpaper selector, Terminal font (mono/sans), Dock position (top/bottom), Clock format (12h/24h), Reset window positions, About line
- Persistence: localStorage key "portfolio-os-settings"

### 6. Terminal

- Title: "Terminal"
- Icon: >_
- Wraps existing Terminal component
- New commands: `open <app>`, `close <app>`, `windows`
- All existing commands (fetch, ls, cd, help, etc.) preserved
- Can be closed/minimized like any other window

## Themes

11 themes, each setting CSS custom properties on :root:

| Theme | Description |
|-------|-------------|
| system | Current default (dark purple) |
| tokyonight | Based on Tokyonight |
| everforest | Based on Everforest |
| ayu | Based on Ayu dark |
| catppuccin | Based on Catppuccin |
| catppuccin-macchiato | Catppuccin variant |
| gruvbox | Based on Gruvbox |
| kanagawa | Based on Kanagawa |
| nord | Based on Nord |
| matrix | Green-on-black hacker style |
| one-dark | Based on Atom One Dark |

Theme selection swaps CSS variables globally. Wallpapers (animated backgrounds like ParticleField) read current CSS variables to adapt their colors.

## Desktop Shell

### Dock (Top Bar)

```
[Peek Desktop]         [Active App Name]         [Settings] [Tray] [Clock]
```

- Peek Desktop: minimizes all windows, click again to restore
- Active App Name: title of the currently focused window
- Settings gear: opens Settings window (shortcut)
- System Tray: decorative icons (wifi, battery — ambiance only, non-functional in v1)
- Clock: click shows greeting ("Hello, recruiter" + time + timezone)

### AppBar (Bottom)

- Floating pill, centered horizontally
- Auto-hides; appears when mouse approaches bottom ~20px of viewport
- Contains launcher icons for all 6 apps
- Open apps show a small indicator line below the icon
- Click closed app → opens it
- Click open/minimized app → focuses it
- No Show Desktop button (replaced by Peek Desktop in dock)

## Data Flow

1. Astro page fetches `getCollection('projects')` and passes as props to DesktopOS
2. DesktopOS bootstraps Zustand store with initial state
3. Windows render conditionally based on store `windows.*.open`
4. Terminal commands import store directly via `useOSStore.getState()`
5. Settings changes persist to localStorage and re-hydrate on page load

## Files to Create

```
src/
├── stores/
│   └── osStore.js              # Zustand store
├── components/
│   ├── DesktopOS.jsx            # Root React island
│   ├── Dock.jsx                 # Top bar
│   ├── AppBar.jsx               # Bottom floating taskbar
│   ├── Window.jsx               # Shared window frame (titlebar + drag + resize)
│   ├── ExplorerWindow.jsx       # Projects browser
│   ├── ResumeWindow.jsx         # Document viewer
│   ├── MediaPlayerWindow.jsx    # Social proof player
│   ├── TrashWindow.jsx          # Easter egg
│   ├── SettingsWindow.jsx       # System preferences
│   └── TerminalWindow.jsx       # Wraps existing Terminal
├── data/
│   └── resume.js                # Resume content (static)
└── styles/
    └── themes.css               # CSS custom properties for all 11 themes
```

## Files to Modify

```
src/pages/index.astro            # Replace HeroDashboard with DesktopOS
src/terminal/commands.jsx         # Add open/close/windows commands
src/components/HeroDashboard.jsx  # Remove or redirect to DesktopOS
```

## Mobile (<768px)

No changes. Existing Terminal-based layout remains untouched. The `DesktopOS` component renders conditionally via CSS media query or a `isDesktop` check from Astro.

## Out of Scope (v1)

- Actual file system / file operations
- Multi-monitor support
- Window snapping to grid
- Real system tray functionality
- Persistent window positions across sessions
