import { create } from 'zustand';

const DEFAULT_WINDOWS = {
  explorer:     { id: 'explorer',     title: 'Projects ~ Portfolio',   icon: 'folder',  open: true, minimized: false, maximized: false, position: { x: 60, y: 60 },    size: { width: 640, height: 480 },  zIndex: 1 },
  resume:       { id: 'resume',       title: 'resume_current.pdf \u2014 Preview', icon: 'file', open: true, minimized: false, maximized: false, position: { x: 680, y: 100 },   size: { width: 520, height: 600 },  zIndex: 2 },
  'media-player': { id: 'media-player', title: 'Now Playing',          icon: 'music',  open: false, minimized: false, maximized: false, position: { x: 200, y: 200 },   size: { width: 420, height: 360 },  zIndex: 3 },
  trash:        { id: 'trash',        title: 'Trash (0 items)',        icon: 'trash',  open: false, minimized: false, maximized: false, position: { x: 800, y: 350 },   size: { width: 360, height: 280 },  zIndex: 4 },
  settings:     { id: 'settings',     title: 'Settings \u2014 Portfolio OS', icon: 'gear',  open: false, minimized: false, maximized: false, position: { x: 400, y: 150 },   size: { width: 400, height: 380 },  zIndex: 5 },
  terminal:     { id: 'terminal',     title: 'Terminal',               icon: 'terminal', open: false, minimized: false, maximized: false, position: { x: 300, y: 80 },    size: { width: 480, height: 400 },  zIndex: 6 },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('portfolio-os-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { theme: 'system', wallpaper: 'particle-field', terminalFont: 'mono', clockFormat: '12h', dockPosition: 'top' };
}

function saveSettings(s) {
  try {
    localStorage.setItem('portfolio-os-settings', JSON.stringify({
      theme: s.theme, wallpaper: s.wallpaper, terminalFont: s.terminalFont, clockFormat: s.clockFormat, dockPosition: s.dockPosition,
    }));
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
const initialOpenIds = Object.entries(DEFAULT_WINDOWS)
  .filter(([, w]) => w.open)
  .map(([id]) => id);

export const useOSStore = create((set, get) => ({
  windows: Object.fromEntries(
    Object.entries(DEFAULT_WINDOWS).map(([id, w]) => [id, { ...w }])
  ),
  windowOrder: [...initialOpenIds],
  activeApp: initialOpenIds.length > 0 ? initialOpenIds[initialOpenIds.length - 1] : null,
  nextZIndex: 7,
  ...settings,

  openWindow: (id) => {
    const state = get();
    if (!state.windows[id]) return;
    if (state.windows[id].open && !state.windows[id].minimized) {
      get().focusWindow(id);
      return;
    }
    const zIndex = state.nextZIndex;
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], open: true, minimized: false, zIndex } },
      windowOrder: [...(s.windowOrder || []), id],
      activeApp: id,
      nextZIndex: zIndex + 1,
    }));
  },

  closeWindow: (id) => {
    set((s) => {
      const w = s.windows[id];
      if (!w || !w.open) return s;
      const newOrder = (s.windowOrder || []).filter((wid) => wid !== id);
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
      windowOrder: [...(s.windowOrder || []).filter((wid) => wid !== id), id],
      activeApp: id,
      nextZIndex: zIndex + 1,
    }));
  },

  toggleMinimize: (id) => {
    set((s) => {
      const w = s.windows[id];
      if (!w || !w.open) return s;
      const minimized = !w.minimized;
      const newOrder = minimized
        ? (s.windowOrder || []).filter((wid) => wid !== id)
        : [...(s.windowOrder || []), id];
      return {
        windows: { ...s.windows, [id]: { ...w, minimized } },
        windowOrder: newOrder,
        activeApp: minimized
          ? (newOrder.length > 0 ? newOrder[newOrder.length - 1] : null)
          : id,
      };
    });
  },

  toggleMaximize: (id) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], maximized: !s.windows[id].maximized },
      },
    }));
  },

  setPosition: (id, x, y) => {
    set((s) => ({
      windows: { ...s.windows, [id]: { ...s.windows[id], position: { x, y } } },
    }));
  },

  setSize: (id, width, height) => {
    set((s) => ({
      windows: {
        ...s.windows,
        [id]: { ...s.windows[id], size: { width, height } },
      },
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
    const ids = Object.keys(state.windows).filter(
      (id) => state.windows[id].minimized
    );
    if (ids.length === 0) return;
    set((s) => {
      const updated = { ...s.windows };
      for (const id of ids) {
        updated[id] = { ...updated[id], minimized: false };
      }
      return { windows: updated, windowOrder: [...ids] };
    });
  },

  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    saveSettings({ ...get(), theme });
    set({ theme });
  },

  setWallpaper: (wallpaper) => {
    saveSettings({ ...get(), wallpaper });
    set({ wallpaper });
  },

  setTerminalFont: (terminalFont) => {
    saveSettings({ ...get(), terminalFont });
    set({ terminalFont });
  },

  setClockFormat: (clockFormat) => {
    saveSettings({ ...get(), clockFormat });
    set({ clockFormat });
  },

  setDockPosition: (dockPosition) => {
    saveSettings({ ...get(), dockPosition });
    set({ dockPosition });
  },
}));
