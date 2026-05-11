# Portfolio OS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current homepage HeroDashboard with a draggable desktop OS interface featuring 6 windows, a top dock, and a floating bottom app bar.

**Architecture:** Single React island (`client:load`) wrapping a Zustand state store. All windows share a common Window frame component for drag/resize/focus behavior. Terminal command registry imports the store directly to open/close apps. Theme changes swap CSS custom properties on `:root`.

**Tech Stack:** React, Zustand (~1KB), Three.js (existing for ParticleField), CSS custom properties

---

### Task 1: Install Zustand

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install zustand**

Run: `npm install zustand`

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: add zustand for OS state management"
```

---

### Task 2: Create theme CSS variables

**Files:**
- Create: `src/styles/themes.css`

- [ ] **Step 1: Write themes.css with all 11 theme variable sets**

Each theme defines `--bg`, `--surface`, `--surface-hover`, `--text`, `--text-muted`, `--primary`, `--primary-glow`, `--accent`, `--accent-glow`, `--border`.

```css
:root,
[data-theme="system"] {
  --bg: #05000a;
  --surface: #12001a;
  --surface-hover: #1a0028;
  --text: #d0c0e0;
  --text-muted: #7a6a8a;
  --primary: #8800cc;
  --primary-glow: rgba(136, 0, 204, 0.4);
  --accent: #00ff66;
  --accent-glow: rgba(0, 255, 102, 0.4);
  --border: #2a1040;
}

[data-theme="tokyonight"] {
  --bg: #1a1b26;
  --surface: #24283b;
  --surface-hover: #2f354a;
  --text: #a9b1d6;
  --text-muted: #565f89;
  --primary: #bb9af7;
  --primary-glow: rgba(187, 154, 247, 0.4);
  --accent: #7dcfff;
  --accent-glow: rgba(125, 207, 255, 0.4);
  --border: #3b4261;
}

[data-theme="everforest"] {
  --bg: #2b3339;
  --surface: #3a454a;
  --surface-hover: #47545a;
  --text: #d3c6aa;
  --text-muted: #859289;
  --primary: #e69875;
  --primary-glow: rgba(230, 152, 117, 0.4);
  --accent: #a7c080;
  --accent-glow: rgba(167, 192, 128, 0.4);
  --border: #4f5b58;
}

[data-theme="ayu"] {
  --bg: #0b0e14;
  --surface: #1a1f29;
  --surface-hover: #262d3a;
  --text: #b3b1ad;
  --text-muted: #6e6e6e;
  --primary: #ff8f40;
  --primary-glow: rgba(255, 143, 64, 0.4);
  --accent: #73d0ff;
  --accent-glow: rgba(115, 208, 255, 0.4);
  --border: #2d3640;
}

[data-theme="catppuccin"] {
  --bg: #1e1e2e;
  --surface: #313244;
  --surface-hover: #3f4057;
  --text: #cdd6f4;
  --text-muted: #6c7086;
  --primary: #cba6f7;
  --primary-glow: rgba(203, 166, 247, 0.4);
  --accent: #89b4fa;
  --accent-glow: rgba(137, 180, 250, 0.4);
  --border: #45475a;
}

[data-theme="catppuccin-macchiato"] {
  --bg: #24273a;
  --surface: #363a4f;
  --surface-hover: #44485f;
  --text: #cad3f5;
  --text-muted: #6e738d;
  --primary: #c6a0f6;
  --primary-glow: rgba(198, 160, 246, 0.4);
  --accent: #8aadf4;
  --accent-glow: rgba(138, 173, 244, 0.4);
  --border: #494d64;
}

[data-theme="gruvbox"] {
  --bg: #282828;
  --surface: #3c3836;
  --surface-hover: #504945;
  --text: #ebdbb2;
  --text-muted: #928374;
  --primary: #d3869b;
  --primary-glow: rgba(211, 134, 155, 0.4);
  --accent: #b8bb26;
  --accent-glow: rgba(184, 187, 38, 0.4);
  --border: #504945;
}

[data-theme="kanagawa"] {
  --bg: #1f1f28;
  --surface: #2a2a37;
  --surface-hover: #363646;
  --text: #dcd7ba;
  --text-muted: #727287;
  --primary: #e6c384;
  --primary-glow: rgba(230, 195, 132, 0.4);
  --accent: #7fb4ca;
  --accent-glow: rgba(127, 180, 202, 0.4);
  --border: #363646;
}

[data-theme="nord"] {
  --bg: #2e3440;
  --surface: #3b4252;
  --surface-hover: #434c5e;
  --text: #eceff4;
  --text-muted: #7b88a1;
  --primary: #bf616a;
  --primary-glow: rgba(191, 97, 106, 0.4);
  --accent: #88c0d0;
  --accent-glow: rgba(136, 192, 208, 0.4);
  --border: #4c566a;
}

[data-theme="matrix"] {
  --bg: #000000;
  --surface: #0a0a0a;
  --surface-hover: #141414;
  --text: #00ff41;
  --text-muted: #008811;
  --primary: #008f11;
  --primary-glow: rgba(0, 143, 17, 0.4);
  --accent: #00ff41;
  --accent-glow: rgba(0, 255, 65, 0.4);
  --border: #003b00;
}

[data-theme="one-dark"] {
  --bg: #282c34;
  --surface: #353b45;
  --surface-hover: #3f4655;
  --text: #abb2bf;
  --text-muted: #636d83;
  --primary: #61afef;
  --primary-glow: rgba(97, 175, 239, 0.4);
  --accent: #98c379;
  --accent-glow: rgba(152, 195, 121, 0.4);
  --border: #474e5d;
}
```

- [ ] **Step 2: Import themes.css in global.css**

Add at the top of `src/styles/global.css`:

```css
@import './themes.css';
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/themes.css src/styles/global.css
git commit -m "feat: add all 11 theme CSS variable sets"
```

---

### Task 3: Create OS Zustand store

**Files:**
- Create: `src/stores/osStore.js`

- [ ] **Step 1: Write the Zustand store**

```js
import { create } from 'zustand';

const DEFAULT_WINDOWS = {
  explorer:     { id: 'explorer',     title: 'Projects ~ Portfolio',   icon: 'folder',  open: false, minimized: false, maximized: false, position: { x: 60, y: 60 },    size: { width: 640, height: 480 },  zIndex: 1 },
  resume:       { id: 'resume',       title: 'resume_current.pdf — Preview', icon: 'file', open: false, minimized: false, maximized: false, position: { x: 680, y: 100 },   size: { width: 520, height: 600 },  zIndex: 2 },
  'media-player': { id: 'media-player', title: 'Now Playing',          icon: 'music',  open: false, minimized: false, maximized: false, position: { x: 200, y: 200 },   size: { width: 420, height: 360 },  zIndex: 3 },
  trash:        { id: 'trash',        title: 'Trash (0 items)',        icon: 'trash',  open: false, minimized: false, maximized: false, position: { x: 800, y: 350 },   size: { width: 360, height: 280 },  zIndex: 4 },
  settings:     { id: 'settings',     title: 'Settings — Portfolio OS', icon: 'gear',  open: false, minimized: false, maximized: false, position: { x: 400, y: 150 },   size: { width: 400, height: 380 },  zIndex: 5 },
  terminal:     { id: 'terminal',     title: 'Terminal',               icon: 'terminal', open: false, minimized: false, maximized: false, position: { x: 300, y: 80 },    size: { width: 480, height: 400 },  zIndex: 6 },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('portfolio-os-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { theme: 'system', wallpaper: 'particle-field', terminalFont: 'mono', clockFormat: '12h', dockPosition: 'top' };
}

function saveSettings(settings) {
  try {
    localStorage.setItem('portfolio-os-settings', JSON.stringify(settings));
  } catch {}
}

function getDefaultPositions() {
  return {
    explorer:     { x: 60, y: 60 },
    resume:       { x: 680, y: 100 },
    'media-player': { x: 200, y: 200 },
    trash:        { x: 800, y: 350 },
    settings:     { x: 400, y: 150 },
    terminal:     { x: 300, y: 80 },
  };
}

const settings = loadSettings();

export const useOSStore = create((set, get) => ({
  windows: { ...DEFAULT_WINDOWS },
  windowOrder: [],
  activeApp: null,
  nextZIndex: 7,
  theme: settings.theme,
  wallpaper: settings.wallpaper,
  terminalFont: settings.terminalFont,
  clockFormat: settings.clockFormat,
  dockPosition: settings.dockPosition,

  openWindow: (id) => {
    const state = get();
    if (!state.windows[id]) return;
    if (state.windows[id].open) {
      get().focusWindow(id);
      return;
    }
    const zIndex = state.nextZIndex;
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], open: true, minimized: false, zIndex } },
      windowOrder: [...s.windowOrder, id],
      activeApp: id,
      nextZIndex: zIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set((s) => {
      const w = s.windows[id];
      if (!w || !w.open) return s;
      const newOrder = s.windowOrder.filter((wid) => wid !== id);
      return {
        windows: { ...s.windows, [id]: { ...w, open: false, minimized: false } },
        windowOrder: newOrder,
        activeApp: newOrder.length > 0 ? newOrder[newOrder.length - 1] : null,
      };
    });
  },

  focusWindow: (id) => {
    const state = get();
    if (!state.windows[id] || !state.windows[id].open) return;
    const zIndex = state.nextZIndex;
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], zIndex } },
      windowOrder: [...s.windowOrder.filter((wid) => wid !== id), id],
      activeApp: id,
      nextZIndex: zIndex + 1,
    }));
  },

  toggleMinimize: (id) => {
    set((s) => {
      const w = s.windows[id];
      if (!w || !w.open) return s;
      const minimized = !w.minimized;
      const newOrder = minimized ? s.windowOrder.filter((wid) => wid !== id) : [...s.windowOrder, id];
      return {
        windows: { ...s.windows, [id]: { ...w, minimized } },
        windowOrder: newOrder,
        activeApp: minimized ? (newOrder.length > 0 ? newOrder[newOrder.length - 1] : null) : id,
      };
    });
  },

  toggleMaximize: (id) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], maximized: !s.windows[id].maximized } },
    }));
  },

  setPosition: (id, x, y) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], position: { x, y } } },
    }));
  },

  setSize: (id, width, height) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], size: { width, height } } },
    }));
  },

  resetWindows: () => {
    const defaults = getDefaultPositions();
    set((s) => {
      const updated = { ...s.windows };
      for (const [id, pos] of Object.entries(defaults)) {
        if (updated[id]) {
          updated[id] = { ...updated[id], position: { ...pos }, maximized: false };
        }
      }
      return { windows: updated };
    });
  },

  minimizeAll: () => {
    set((s) => {
      const updated = { ...s.windows };
      for (const id of Object.keys(updated)) {
        if (updated[id].open) {
          updated[id] = { ...updated[id], minimized: true };
        }
      }
      return { windows: updated, windowOrder: [], activeApp: null };
    });
  },

  restoreAll: () => {
    const state = get();
    const ids = Object.keys(state.windows).filter((id) => state.windows[id].minimized);
    if (ids.length === 0) return;
    set((s) => {
      const updated = { ...s.windows };
      const restored = [];
      for (const id of ids) {
        updated[id] = { ...updated[id], minimized: false };
        restored.push(id);
      }
      return { windows: updated, windowOrder: restored };
    });
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
    saveSettings({ ...get(), theme, wallpaper: get().wallpaper, terminalFont: get().terminalFont, clockFormat: get().clockFormat, dockPosition: get().dockPosition });
  },

  setWallpaper: (wallpaper) => {
    set({ wallpaper });
    saveSettings({ ...get(), theme: get().theme, wallpaper, terminalFont: get().terminalFont, clockFormat: get().clockFormat, dockPosition: get().dockPosition });
  },

  setTerminalFont: (terminalFont) => {
    set({ terminalFont });
    saveSettings({ ...get(), theme: get().theme, wallpaper: get().wallpaper, terminalFont, clockFormat: get().clockFormat, dockPosition: get().dockPosition });
  },

  setClockFormat: (clockFormat) => {
    set({ clockFormat });
    saveSettings({ ...get(), theme: get().theme, wallpaper: get().wallpaper, terminalFont: get().terminalFont, clockFormat, dockPosition: get().dockPosition });
  },

  setDockPosition: (dockPosition) => {
    set({ dockPosition });
    saveSettings({ ...get(), theme: get().theme, wallpaper: get().wallpaper, terminalFont: get().terminalFont, clockFormat: get().clockFormat, dockPosition });
  },
}));
```

- [ ] **Step 2: Commit**

```bash
git add src/stores/osStore.js
git commit -m "feat: create Zustand store for OS window management"
```

---

### Task 4: Create shared Window frame component

**Files:**
- Create: `src/components/Window.jsx`

- [ ] **Step 1: Write Window.jsx**

This component wraps any window content with the shared chrome: title bar (with app icon, control buttons), drag handling, resize handling, focus-on-click.

```jsx
import { useOSStore } from '../stores/osStore';
import { useCallback, useRef, useEffect } from 'react';

const ICONS = {
  folder: '\uD83D\uDCC1',
  file: '\uD83D\uDCC4',
  music: '\u266A',
  trash: '\uD83D\uDDD1',
  gear: '\u2699',
  terminal: '\u203A_',
};

export default function Window({ id, children, menubar }) {
  const win = useOSStore((s) => s.windows[id]);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  const setPosition = useOSStore((s) => s.setPosition);
  const setSize = useOSStore((s) => s.setSize);
  const dockPosition = useOSStore((s) => s.dockPosition);
  const windowOrder = useOSStore((s) => s.windowOrder);

  const dragRef = useRef(null);
  const dragStart = useRef(null);
  const posStart = useRef(null);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.window-menubar')) return;
    focusWindow(id);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { x: win.position.x, y: win.position.y };
    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition(id, posStart.current.x + dx, posStart.current.y + dy);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, win.position, focusWindow, setPosition]);

  const resizeRef = useRef(null);
  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.size.width;
    const startH = win.size.height;
    const handleMouseMove = (e) => {
      setSize(id, Math.max(280, startW + e.clientX - startX), Math.max(200, startH + e.clientY - startY));
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, win.size, setSize]);

  const handleTitleDblClick = useCallback(() => {
    toggleMaximize(id);
  }, [id, toggleMaximize]);

  if (!win || !win.open) return null;

  const isMaximized = win.maximized;
  const maxW = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const maxH = typeof window !== 'undefined' ? window.innerHeight : 800;
  const dockH = dockPosition === 'top' ? 32 : 0;
  const appBarH = dockPosition === 'bottom' ? 32 : 0;
  const availH = maxH - dockH - appBarH;

  const frameSx = isMaximized
    ? { position: 'fixed', top: dockPosition === 'top' ? dockH : 0, left: 0, width: '100%', height: `${availH}px`, zIndex: win.zIndex, borderRadius: 0 }
    : { position: 'fixed', top: Math.max(dockH, win.position.y), left: Math.max(0, win.position.x), width: win.size.width, height: win.size.height, zIndex: win.zIndex, borderRadius: '6px' };

  return (
    <div
      className={`os-window${isMaximized ? ' os-window-maximized' : ''}`}
      style={{ ...frameSx, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
      onMouseDown={() => focusWindow(id)}
    >
      {/* Title bar */}
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleTitleDblClick}
        style={{ display: 'flex', alignItems: 'center', padding: '0.3rem 0.6rem', borderBottom: '1px solid var(--border)', cursor: 'grab', userSelect: 'none', background: 'var(--surface)' }}
      >
        <span style={{ marginRight: '0.4rem', fontSize: '0.75rem' }}>{ICONS[win.icon] || ''}</span>
        <span style={{ flex: 1, fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>{win.title}</span>
        <div className="window-controls" style={{ display: 'flex', gap: '4px' }}>
          <button className="titlebar-btn" onClick={() => toggleMinimize(id)} style={{ width: '14px', height: '14px', fontSize: '0.5rem', lineHeight: '14px', textAlign: 'center', padding: 0, border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer' }}>_</button>
          <button className="titlebar-btn" onClick={() => toggleMaximize(id)} style={{ width: '14px', height: '14px', fontSize: '0.5rem', lineHeight: '14px', textAlign: 'center', padding: 0, border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer' }}>{isMaximized ? '\u21F1' : '\u25A1'}</button>
          <button className="titlebar-btn titlebar-close" onClick={() => closeWindow(id)} style={{ width: '14px', height: '14px', fontSize: '0.5rem', lineHeight: '14px', textAlign: 'center', padding: 0, border: '1px solid var(--border)', background: 'var(--surface-hover)', color: 'var(--text-muted)', borderRadius: '3px', cursor: 'pointer' }}>X</button>
        </div>
      </div>

      {/* Menu bar */}
      {menubar && (
        <div className="window-menubar" style={{ display: 'flex', gap: '10px', padding: '2px 8px', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', background: 'var(--surface)' }}>
          {menubar.map((item) => (
            <span key={item} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>{item}</span>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg)' }}>
        {children}
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          ref={resizeRef}
          onMouseDown={handleResizeStart}
          style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', cursor: 'nwse-resize' }}
        >
          <div style={{ position: 'absolute', bottom: '3px', right: '3px', width: '8px', height: '8px', borderRight: '2px solid var(--text-muted)', borderBottom: '2px solid var(--text-muted)', opacity: 0.4 }} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Window.jsx
git commit -m "feat: create shared Window frame with drag/resize/focus"
```

---

### Task 5: Create Dock component

**Files:**
- Create: `src/components/Dock.jsx`

- [ ] **Step 1: Write Dock.jsx**

Top bar with peek desktop button, active app name, settings gear, system tray icons, and clock.

```jsx
import { useOSStore } from '../stores/osStore';
import { useState, useEffect } from 'react';

export default function Dock() {
  const activeApp = useOSStore((s) => s.activeApp);
  const windows = useOSStore((s) => s.windows);
  const minimizeAll = useOSStore((s) => s.minimizeAll);
  const restoreAll = useOSStore((s) => s.restoreAll);
  const openWindow = useOSStore((s) => s.openWindow);
  const clockFormat = useOSStore((s) => s.clockFormat);
  const [time, setTime] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);
  const allMinimized = Object.values(windows).every((w) => !w.open || w.minimized);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours();
      const mins = String(now.getMinutes()).padStart(2, '0');
      if (clockFormat === '24h') {
        setTime(`${String(hours).padStart(2, '0')}:${mins}`);
      } else {
        const amp = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        setTime(`${h12}:${mins} ${amp}`);
      }
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [clockFormat]);

  const handlePeek = () => {
    if (allMinimized) {
      restoreAll();
    } else {
      minimizeAll();
    }
  };

  const handleClockClick = () => setShowGreeting(!showGreeting);

  const activeTitle = activeApp ? (windows[activeApp]?.title || '') : '';

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '32px', padding: '0 10px', background: 'var(--surface)', borderBottom: '1px solid var(--border)', fontSize: '0.7rem', userSelect: 'none', flexShrink: 0 }}>
      {/* Peek Desktop */}
      <button
        onClick={handlePeek}
        style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '3px', padding: '2px 6px', fontSize: '0.6rem', cursor: 'pointer', color: 'var(--text-muted)' }}
        title={allMinimized ? 'Restore windows' : 'Peek desktop'}
      >
        {allMinimized ? '\u25A3' : '\u25A2'}
      </button>

      {/* Active app name */}
      <span style={{ flex: 1, textAlign: 'center', fontWeight: 600, color: 'var(--accent)', fontSize: '0.75rem' }}>
        {activeTitle}
      </span>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => openWindow('settings')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.8rem' }}
          title="Settings"
        >
          {'\u2699'}
        </button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>{'\u25A0'} {'\u25A1'}</span>
        <button
          onClick={handleClockClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', position: 'relative' }}
        >
          {time}
          {showGreeting && (
            <div style={{ position: 'absolute', top: '100%', right: 0, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px 12px', whiteSpace: 'nowrap', zIndex: 1000, fontSize: '0.7rem', marginTop: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}>
              <div style={{ color: 'var(--text)', marginBottom: '2px' }}>Hello, recruiter</div>
              <div style={{ color: 'var(--text-muted)' }}>{new Date().toLocaleTimeString()} — {Intl.DateTimeFormat().resolvedOptions().timeZone}</div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Dock.jsx
git commit -m "feat: create Dock component with peek desktop, app name, clock"
```

---

### Task 6: Create AppBar component

**Files:**
- Create: `src/components/AppBar.jsx`

- [ ] **Step 1: Write AppBar.jsx**

Floating bottom pill that auto-hides. Contains launcher icons for all 6 apps with open/active indicators.

```jsx
import { useOSStore } from '../stores/osStore';
import { useState, useEffect, useRef } from 'react';

const APPS = [
  { id: 'explorer', icon: '\uD83D\uDCC1', label: 'Explorer' },
  { id: 'resume', icon: '\uD83D\uDCC4', label: 'Resume' },
  { id: 'media-player', icon: '\u266A', label: 'Media Player' },
  { id: 'trash', icon: '\uD83D\uDDD1', label: 'Trash' },
  { id: 'settings', icon: '\u2699', label: 'Settings' },
  { id: 'terminal', icon: '\u203A_', label: 'Terminal' },
];

export default function AppBar() {
  const windows = useOSStore((s) => s.windows);
  const activeApp = useOSStore((s) => s.activeApp);
  const openWindow = useOSStore((s) => s.openWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const viewportH = window.innerHeight;
      if (e.clientY >= viewportH - 30) {
        setVisible(true);
        clearTimeout(hideTimer.current);
      } else if (e.clientY < viewportH - 80) {
        hideTimer.current = setTimeout(() => setVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimer.current);
    };
  }, []);

  const handleClick = (id) => {
    const w = windows[id];
    if (!w.open) {
      openWindow(id);
    } else if (w.minimized) {
      focusWindow(id);
    } else if (activeApp === id) {
      toggleMinimize(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', bottom: visible ? '10px' : '-50px', left: '50%', transform: 'translateX(-50%)',
        transition: 'bottom 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '6px 14px',
        display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 10000, fontSize: '0.8rem',
      }}
    >
      {APPS.map((app) => {
        const w = windows[app.id];
        const isOpen = w?.open && !w.minimized;
        const isActive = activeApp === app.id && isOpen;
        return (
          <button
            key={app.id}
            onClick={() => handleClick(app.id)}
            title={app.label}
            style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
              color: isActive ? 'var(--accent)' : isOpen || w?.open ? 'var(--text)' : 'var(--text-muted)',
              fontSize: '0.8rem', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            }}
          >
            <span>{app.icon}</span>
            {(w?.open) && (
              <span style={{ width: '14px', height: '2px', background: isActive ? 'var(--accent)' : 'var(--text-muted)', borderRadius: '1px' }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/AppBar.jsx
git commit -m "feat: create AppBar with auto-hide launcher icons"
```

---

### Task 7: Create Explorer window

**Files:**
- Create: `src/components/ExplorerWindow.jsx`
- Create: `src/data/resume.js` (date-format helper used by Explorer)
- Modify: `src/pages/index.astro` (pass projects data)

- [ ] **Step 1: Write ExplorerWindow.jsx**

Projects browser with menubar, address bar, file tree sidebar, and grid of project tiles.

```jsx
import { useState } from 'react';
import { useOSStore } from '../stores/osStore';

export default function ExplorerWindow({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const openWindow = useOSStore((s) => s.openWindow);

  const handleDoubleClick = (slug) => {
    openWindow('explorer');
    window.location.href = `/projects/${slug}/`;
  };

  const handleOpen = (project) => {
    setSelectedProject(project);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '0.7rem' }}>
      {/* Address bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.65rem' }}>{'\u25C0'}</button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.65rem' }}>{'\u25B6'}</button>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.65rem' }}>{'\u2B06'}</button>
        <span style={{ flex: 1, background: 'var(--bg)', padding: '2px 6px', borderRadius: '3px', color: 'var(--text-muted)', fontSize: '0.65rem' }}>~/Projects/</span>
      </div>
      {/* Main area: sidebar + grid */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* File tree sidebar */}
        <div style={{ width: '130px', borderRight: '1px solid var(--border)', padding: '6px', overflow: 'auto', background: 'var(--surface)', fontSize: '0.65rem' }}>
          <div style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: '4px' }}>{'\uD83D\uDCC1'} Projects</div>
          {projects.map((p) => (
            <div key={p.slug} style={{ paddingLeft: '12px', padding: '2px 0', cursor: 'pointer', color: 'var(--text)' }}>
              {'\uD83D\uDCC1'} {p.data.title}
            </div>
          ))}
        </div>
        {/* Content area */}
        {selectedProject ? (
          <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
            <button onClick={() => setSelectedProject(null)} style={{ background: 'none', border: '1px solid var(--border)', color: 'var(--text)', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', marginBottom: '10px', fontSize: '0.65rem' }}>
              {'\u2190'} Back
            </button>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{selectedProject.data.title}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{selectedProject.data.description}</p>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '12px' }}>
              {selectedProject.data.tags?.map((t) => (
                <span key={t} style={{ background: 'var(--surface)', padding: '2px 6px', borderRadius: '3px', fontSize: '0.6rem', color: 'var(--accent)' }}>.{t.toLowerCase()}</span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedProject.data.liveUrl && (
                <a href={selectedProject.data.liveUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '4px 10px', border: '1px solid var(--accent)', borderRadius: '4px', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.65rem' }}>Live Site</a>
              )}
              {selectedProject.data.githubUrl && (
                <a href={selectedProject.data.githubUrl} target="_blank" rel="noopener noreferrer" style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: '4px', color: 'var(--text)', textDecoration: 'none', fontSize: '0.65rem' }}>GitHub</a>
              )}
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', padding: '10px', overflow: 'auto', alignContent: 'start' }}>
            {projects.map((p) => (
              <div
                key={p.slug}
                onDoubleClick={() => handleDoubleClick(p.slug)}
                style={{ border: '1px solid var(--border)', borderRadius: '6px', padding: '10px', background: 'var(--surface)', cursor: 'pointer' }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>{'\uD83D\uDCC1'}</div>
                <div style={{ fontWeight: 600, fontSize: '0.7rem', marginBottom: '4px' }}>{p.data.title}</div>
                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{p.data.description}</div>
                <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '6px' }}>
                  {p.data.tags?.map((t) => (
                    <span key={t} style={{ background: 'var(--surface-hover)', padding: '1px 4px', borderRadius: '2px', fontSize: '0.55rem', color: 'var(--text-muted)' }}>.{t.toLowerCase()}</span>
                  ))}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleOpen(p); }}
                  style={{ background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '3px', padding: '2px 8px', cursor: 'pointer', color: 'var(--text)', fontSize: '0.6rem' }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExplorerWindow.jsx
git commit -m "feat: create Explorer window with project grid and detail view"
```

---

### Task 8: Create Resume window

**Files:**
- Create: `src/components/ResumeWindow.jsx`
- Create: `src/data/resume.js`

- [ ] **Step 1: Write resume data file**

```js
export const resumeData = {
  name: 'Bryan Ward',
  contact: {
    email: 'wardbryan3@gmail.com',
    linkedin: 'linkedin.com/in/bryanward',
    github: 'github.com/wardbryan3',
  },
  experience: [
    {
      title: 'Software Engineering Intern',
      company: 'Company Name',
      dates: 'Jan 2025 - Present',
      bullets: [
        'Built and shipped features serving 10k+ users',
        'Reduced CI pipeline time by 40%',
      ],
    },
  ],
  skills: ['TypeScript', 'React', 'Python', 'Go', 'PostgreSQL', 'Docker'],
  education: [
    { degree: 'B.S. Computer Science', school: 'University Name', year: '2026' },
  ],
};
```

- [ ] **Step 2: Write ResumeWindow.jsx**

```jsx
export default function ResumeWindow() {
  return (
    <div style={{ height: '100%', overflow: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', padding: '16px', lineHeight: '1.6' }}>
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--text)' }}>BRYAN WARD</div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          wardbryan3@gmail.com | linkedin.com/in/bryanward | github.com/wardbryan3
        </div>
      </div>

      <Section title="EXPERIENCE">
        <div style={{ fontWeight: 600 }}>Software Engineering Intern — Company Name</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>Jan 2025 - Present</div>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          <li>Built and shipped features serving 10k+ users</li>
          <li>Reduced CI pipeline time by 40%</li>
        </ul>
      </Section>

      <Section title="SKILLS">
        <div style={{ fontSize: '0.65rem' }}>TypeScript, React, Python, Go, PostgreSQL, Docker</div>
      </Section>

      <Section title="EDUCATION">
        <div style={{ fontWeight: 600 }}>B.S. Computer Science — University Name</div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>Expected 2026</div>
      </Section>

      <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
        <a
          href="/resume.pdf"
          download
          style={{ display: 'inline-block', padding: '6px 16px', border: '1px solid var(--accent)', borderRadius: '4px', color: 'var(--accent)', textDecoration: 'none', fontSize: '0.65rem' }}
        >
          {'\u2B07'} Download PDF
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ fontWeight: 600, fontSize: '0.7rem', borderBottom: '1px solid var(--border)', marginBottom: '4px', color: 'var(--accent)' }}>{title}</div>
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ResumeWindow.jsx src/data/resume.js
git commit -m "feat: create Resume window with PDF-reader layout"
```

---

### Task 9: Create Media Player window

**Files:**
- Create: `src/components/MediaPlayerWindow.jsx`

- [ ] **Step 1: Write MediaPlayerWindow.jsx**

```jsx
import { useState } from 'react';

const TRACKS = [
  { num: '01', title: 'Featured on CSS Design Awards', duration: '2:14' },
  { num: '02', title: 'Open-source contributor \u2014 500+ stars', duration: '3:02' },
  { num: '03', title: 'Guest speaker: Design Systems Summit', duration: '1:58' },
];

const SHUFFLE_QUOTES = [
  '"Bryan delivered beyond expectations." \u2014 Former Manager',
  '"A pleasure to work with \u2014 great code, great attitude." \u2014 Colleague',
  '"The terminal portfolio was a standout in the hiring process." \u2014 Recruiter',
  '"Technical skills and design sense are a rare combo." \u2014 Client',
];

function shuffle(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function MediaPlayerWindow() {
  const [currentTrack, setCurrentTrack] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quote, setQuote] = useState(null);

  const handlePlay = () => {
    if (currentTrack < 0) {
      setCurrentTrack(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev > 0 ? prev - 1 : TRACKS.length - 1));
    setIsPlaying(true);
  };

  const handleNext = () => {
    setCurrentTrack((prev) => (prev < TRACKS.length - 1 ? prev + 1 : 0));
    setIsPlaying(true);
  };

  const handleShuffle = () => {
    setQuote(shuffle(SHUFFLE_QUOTES));
    setTimeout(() => setQuote(null), 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: '0.7rem' }}>
      {/* Main: track list left, visualization right */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Track list */}
        <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
          {TRACKS.map((track, i) => (
            <div
              key={track.num}
              onClick={() => { setCurrentTrack(i); setIsPlaying(true); }}
              style={{
                display: 'flex', gap: '6px', padding: '5px 6px', cursor: 'pointer', borderRadius: '3px',
                background: currentTrack === i ? 'var(--surface-hover)' : 'transparent',
                color: currentTrack === i ? 'var(--accent)' : 'var(--text)',
                borderBottom: '1px solid var(--border)',
              }}
            >
              <span style={{ color: 'var(--text-muted)', width: '20px' }}>{track.num}</span>
              <span style={{ flex: 1 }}>{track.title}</span>
              <span style={{ color: 'var(--text-muted)' }}>{track.duration}</span>
              {isPlaying && currentTrack === i && (
                <span style={{ color: 'var(--accent)', fontSize: '0.65rem' }}>{'\u266A'}</span>
              )}
            </div>
          ))}
          {quote && (
            <div style={{ marginTop: '12px', padding: '8px', border: '1px solid var(--accent)', borderRadius: '4px', fontStyle: 'italic', color: 'var(--accent)', fontSize: '0.65rem' }}>
              {quote}
            </div>
          )}
        </div>
        {/* Visualization */}
        <div style={{ width: '120px', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '3px', height: '80px' }}>
            {[20, 40, 60, 35, 50, 25, 45, 30].map((h, i) => (
              <div
                key={i}
                style={{
                  width: '6px', height: isPlaying && currentTrack >= 0 ? `${h}px` : '20px',
                  background: 'var(--accent)', borderRadius: '2px',
                  transition: 'height 300ms',
                  opacity: isPlaying && currentTrack >= 0 ? 0.8 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <button onClick={handlePrev} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '0.7rem' }}>{'\u23EE'}</button>
        <button onClick={handlePlay} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent)', fontSize: '1rem' }}>{isPlaying ? '\u23F8' : '\u25B6'}</button>
        <button onClick={handleNext} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '0.7rem' }}>{'\u23ED'}</button>
        <span style={{ flex: 1 }} />
        <button onClick={handleShuffle} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '0.7rem' }} title="Shuffle">{'\uD83D\uDD00'}</button>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
          {currentTrack >= 0 ? `${TRACKS[currentTrack].duration}` : '0:00'}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MediaPlayerWindow.jsx
git commit -m "feat: create Media Player window with track list and visualization"
```

---

### Task 10: Create Trash window

**Files:**
- Create: `src/components/TrashWindow.jsx`

- [ ] **Step 1: Write TrashWindow.jsx**

Easter egg window with empty-state message. Minimal.

```jsx
import { useState } from 'react';

const DUMMY_FILES = [
  { name: 'bad_idea.txt', content: '*cough* Comic Sans on a resume *cough*' },
  { name: 'deleted_project.zip', content: 'This project was left in 2022. It\u2019s best that way.' },
];

export default function TrashWindow() {
  const [items] = useState([]);
  const [openedFile, setOpenedFile] = useState(null);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', fontSize: '0.7rem' }}>
      {openedFile ? (
        <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
          <button
            onClick={() => setOpenedFile(null)}
            style={{ background: 'none', border: '1px solid var(--border)', borderRadius: '3px', padding: '4px 8px', cursor: 'pointer', color: 'var(--text)', marginBottom: '10px', fontSize: '0.65rem' }}
          >
            {'\u2190'} Back
          </button>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px', padding: '12px', fontStyle: 'italic', color: 'var(--text-muted)' }}>
            {openedFile.content}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
          {items.map((file, i) => (
            <div
              key={i}
              onClick={() => setOpenedFile(file)}
              style={{ padding: '6px 8px', cursor: 'pointer', borderBottom: '1px solid var(--border)', display: 'flex', gap: '6px', alignItems: 'center' }}
            >
              <span>{'\uD83D\uDCC4'}</span>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}>{'\uD83D\uDDD1'}</div>
          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.7rem', lineHeight: '1.6' }}>
            Nothing spilled yet. Drag my other windows over the trash to delete them \u2014 they\u2019ll come back after a refresh.
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TrashWindow.jsx
git commit -m "feat: create Trash window with easter egg content"
```

---

### Task 11: Create Settings window

**Files:**
- Create: `src/components/SettingsWindow.jsx`

- [ ] **Step 1: Write SettingsWindow.jsx**

```jsx
import { useOSStore } from '../stores/osStore';

const THEMES = [
  'system', 'tokyonight', 'everforest', 'ayu', 'catppuccin',
  'catppuccin-macchiato', 'gruvbox', 'kanagawa', 'nord', 'matrix', 'one-dark',
];

const WALLPAPERS = ['particle-field'];
const FONTS = ['mono', 'sans-serif'];
const DOCK_POSITIONS = ['top', 'bottom'];
const CLOCK_FORMATS = ['12h', '24h'];

export default function SettingsWindow() {
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const terminalFont = useOSStore((s) => s.terminalFont);
  const dockPosition = useOSStore((s) => s.dockPosition);
  const clockFormat = useOSStore((s) => s.clockFormat);
  const setTheme = useOSStore((s) => s.setTheme);
  const setWallpaper = useOSStore((s) => s.setWallpaper);
  const setTerminalFont = useOSStore((s) => s.setTerminalFont);
  const setDockPosition = useOSStore((s) => s.setDockPosition);
  const setClockFormat = useOSStore((s) => s.setClockFormat);
  const resetWindows = useOSStore((s) => s.resetWindows);

  return (
    <div style={{ padding: '10px', fontSize: '0.7rem', height: '100%', overflow: 'auto' }}>
      <SettingRow label="Theme">
        <select value={theme} onChange={(e) => setTheme(e.target.value)} style={selectStyle}>
          {THEMES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </SettingRow>

      <SettingRow label="Wallpaper">
        <select value={wallpaper} onChange={(e) => setWallpaper(e.target.value)} style={selectStyle}>
          {WALLPAPERS.map((w) => <option key={w} value={w}>{w}</option>)}
        </select>
      </SettingRow>

      <SettingRow label="Terminal font">
        <select value={terminalFont} onChange={(e) => setTerminalFont(e.target.value)} style={selectStyle}>
          {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>
      </SettingRow>

      <SettingRow label="Dock position">
        <select value={dockPosition} onChange={(e) => setDockPosition(e.target.value)} style={selectStyle}>
          {DOCK_POSITIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </SettingRow>

      <SettingRow label="Clock format">
        <select value={clockFormat} onChange={(e) => setClockFormat(e.target.value)} style={selectStyle}>
          {CLOCK_FORMATS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </SettingRow>

      <div style={{ padding: '6px 0' }}>
        <button onClick={resetWindows} style={{ width: '100%', padding: '5px 0', background: 'var(--surface-hover)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer', color: 'var(--text)', fontSize: '0.65rem' }}>
          Reset window positions
        </button>
      </div>

      <div style={{ padding: '8px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.6rem', borderTop: '1px solid var(--border)' }}>
        Portfolio OS v1.0 &mdash; Built with Astro + React
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text)' }}>{label}</span>
      {children}
    </div>
  );
}

const selectStyle = {
  background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: '3px', padding: '2px 6px', fontSize: '0.65rem', cursor: 'pointer',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SettingsWindow.jsx
git commit -m "feat: create Settings window with theme/wallpaper/font/clock/dock options"
```

---

### Task 12: Create Terminal wrapper window

**Files:**
- Create: `src/components/TerminalWindow.jsx`

- [ ] **Step 1: Write TerminalWindow.jsx**

Wraps existing Terminal component for use inside the OS window frame (without the sidebar/flow mode chrome).

```jsx
import Terminal from '../terminal/Terminal';

export default function TerminalWindow({ projectCount, postCount, searchData, dirs }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Terminal
        page="/home"
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
        side={false}
        embedded
      />
    </div>
  );
}
```

- [ ] **Step 2: Update Terminal.jsx to support `embedded` prop**

Add the `embedded` prop to the destructured props (line 70):

```jsx
flow = false,
defaultOpen = true,
embedded = false,
```

Add this early return block right after the `showCursor`/`isInteractive` computed values (before the `renderFieldLines` function, around line 400):

```jsx
if (embedded) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {terminalBody}
    </div>
  );
}
```

This makes Terminal render just the body content — no titlebar, no resize handle, no minimize/maximize buttons, no position:fixed, no border. The Window frame provides all that chrome.

- [ ] **Step 3: Commit**

```bash
git add src/components/TerminalWindow.jsx src/terminal/Terminal.jsx src/styles/global.css
git commit -m "feat: create Terminal wrapper window with embedded mode"
```

---

### Task 13: Update ParticleField for theme awareness

**Files:**
- Modify: `src/components/ParticleField.jsx`

- [ ] **Step 1: Update ParticleField to read colors from CSS variables**

Replace the hardcoded `#00ff66` and `#8800cc` with computed CSS variable values:

```jsx
function getCSSVar(name) {
  if (typeof document === 'undefined') return { r: 0, g: 1, b: 0.4 };
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return { r: 0, g: 1, b: 0.4 };
  const hex = val.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

// Inside Particles function:
const accentColor = new THREE.Color(getCSSVar('--accent'));
const primaryColor = new THREE.Color(getCSSVar('--primary'));
```

Since ParticleField uses `useMemo` with `count` as dep, the colors won't re-read on theme change. Add a `key` prop to the `<Canvas>` that includes the theme name, or add a state dependency. Simplest approach: pass theme as a prop and use it in the dependency array.

Actually, the cleanest approach: create a `useThemeColors` hook that subscribes to the store and returns color objects, then use them in the useMemo dep.

```jsx
import { useOSStore } from '../stores/osStore';
```

Then inside `Particles`:

```jsx
const theme = useOSStore((s) => s.theme);

const particleData = useMemo(() => {
  const accent = new THREE.Color(getCSSVar('--accent'));
  const primary = new THREE.Color(getCSSVar('--primary'));
  // ... rest of particle generation
}, [count, theme]);
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ParticleField.jsx
git commit -m "feat: make ParticleField colors respond to theme changes"
```

---

### Task 14: Create the root DesktopOS component

**Files:**
- Create: `src/components/DesktopOS.jsx`

- [ ] **Step 1: Write DesktopOS.jsx**

Root component that wires Dock, AppBar, all windows, and ParticleField together.

```jsx
import { useEffect } from 'react';
import { useOSStore } from '../stores/osStore';
import ParticleField from './ParticleField';
import Dock from './Dock';
import AppBar from './AppBar';
import Window from './Window';
import ExplorerWindow from './ExplorerWindow';
import ResumeWindow from './ResumeWindow';
import MediaPlayerWindow from './MediaPlayerWindow';
import TrashWindow from './TrashWindow';
import SettingsWindow from './SettingsWindow';
import TerminalWindow from './TerminalWindow';

export default function DesktopOS({ projects, projectCount, postCount, searchData, dirs }) {
  const theme = useOSStore((s) => s.theme);
  const windows = useOSStore((s) => s.windows);
  const dockPosition = useOSStore((s) => s.dockPosition);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="hero-dashboard" style={{ ...osContainerStyle, flexDirection: dockPosition === 'bottom' ? 'column-reverse' : 'column' }}>
      <ParticleField />
      <Dock />
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {Object.entries(windows).map(([id, win]) => {
          if (!win.open) return null;
          let menubar = null;
          if (id !== 'terminal') {
            menubar = ['File', 'Edit', 'View'];
          }
          return (
            <Window key={id} id={id} menubar={menubar}>
              {id === 'explorer' && <ExplorerWindow projects={projects} />}
              {id === 'resume' && <ResumeWindow />}
              {id === 'media-player' && <MediaPlayerWindow />}
              {id === 'trash' && <TrashWindow />}
              {id === 'settings' && <SettingsWindow />}
              {id === 'terminal' && (
                <TerminalWindow projectCount={projectCount} postCount={postCount} searchData={searchData} dirs={dirs} />
              )}
            </Window>
          );
        })}
      </div>
      <AppBar />
    </div>
  );
}

const osContainerStyle = {
  position: 'relative',
  minHeight: '100vh',
  overflow: 'hidden',
  isolation: 'isolate',
  display: 'flex',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DesktopOS.jsx
git commit -m "feat: create DesktopOS root component that wires all windows"
```

---

### Task 15: Update index.astro

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Rewrite index.astro to use DesktopOS for desktop, HeroDashboard for mobile**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroDashboard from '../components/HeroDashboard';
import DesktopOS from '../components/DesktopOS';

const projects = await getCollection('projects');
const posts = await getCollection('blog');
const projectCount = projects.length;
const postCount = posts.length;

const searchData = [
  ...posts.map(p => ({ title: p.data.title, slug: p.slug, path: `/blog/${p.slug}`, type: 'blog', tags: p.data.tags, date: p.data.date })),
  ...projects.map(p => ({ title: p.data.title, slug: p.slug, path: `/projects/${p.slug}`, type: 'projects', tags: p.data.tags, date: p.data.date })),
];
const dirs = [{ name: 'blog', description: 'blog posts', count: postCount }, { name: 'projects', description: 'projects', count: projectCount }];
---

<BaseLayout title="Home" description="Bryan Ward - CS student and developer">
  <DesktopOS
    projects={projects}
    projectCount={projectCount}
    postCount={postCount}
    searchData={searchData}
    dirs={dirs}
    client:media="(min-width: 769px)"
  />
  <HeroDashboard
    projectCount={projectCount}
    postCount={postCount}
    searchData={searchData}
    dirs={dirs}
    client:media="(max-width: 768px)"
  />
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: switch to DesktopOS on desktop, keep HeroDashboard on mobile"
```

---

### Task 16: Add terminal OS commands

**Files:**
- Read: `src/terminal/commands.jsx`
- Modify: `src/terminal/commands.jsx`

- [ ] **Step 1: Add `open`/`close`/`windows` commands at the end of the `createCommands` function**

Import the store at the top of `commands.jsx`:

```jsx
import { useOSStore } from '../stores/osStore';
```

Add these entries to the `commands` object right before `return commands;` (line 350):

```jsx
commands.open = {
  description: 'open an app window (explorer, resume, media, settings, trash)',
  handler: (args) => {
    const app = args?.[0];
    if (!app) return { output: <div className="term-text term-muted">Usage: open &lt;app&gt;<br />Apps: explorer, resume, media, settings, trash</div> };
    const valid = ['explorer', 'resume', 'media', 'settings', 'trash'];
    const id = app === 'media' ? 'media-player' : app;
    if (valid.includes(app)) {
      useOSStore.getState().openWindow(id);
      return { output: <div className="term-text ff-value-green">Opening {app}...</div> };
    }
    return { output: <div className="term-text term-muted">Unknown app: {app}</div> };
  },
};

commands.close = {
  description: 'close an app window',
  handler: (args) => {
    const app = args?.[0];
    if (!app) return { output: <div className="term-text term-muted">Usage: close &lt;app&gt;</div> };
    const id = app === 'media' ? 'media-player' : app;
    useOSStore.getState().closeWindow(id);
    return { output: <div className="term-text">Closing {app}...</div> };
  },
};

commands.windows = {
  description: 'list open windows',
  handler: () => {
    const state = useOSStore.getState();
    const open = Object.entries(state.windows)
      .filter(([, w]) => w.open)
      .map(([id, w]) => `  ${id}${w.minimized ? ' (minimized)' : ''}`);
    const list = open.join('\n') || '  (none)';
    return { output: <div className="term-text" style={{ whiteSpace: 'pre' }}>Open windows:\n{list}</div> };
  },
};
```

Also add `open`, `close`, and `windows` to the help command's command list (around line 33):

```jsx
{[
  ['help', 'show this message'],
  ['whoami', 'about me'],
  ['open', 'open an app window'],
  ['close', 'close an app window'],
  ['windows', 'list open windows'],
  // ... rest of existing commands
]}
```

- [ ] **Step 3: Commit**

```bash
git add src/terminal/commands.jsx
git commit -m "feat: add open/close/windows terminal commands for OS integration"
```

---

### Task 17: Build & verify

**Files:**
- No files — run build

- [ ] **Step 1: Run the full build**

```bash
npm run build
```

Expected: 0 errors, site builds successfully.

- [ ] **Step 2: Fix any build issues**

If there are type errors or import issues, fix them.

- [ ] **Step 3: Commit any fixes**

```bash
git commit -am "fix: resolve build issues after OS integration"
```
