import { create } from 'zustand';

function computePositions() {
  const w = 640, h = 480;
  const nav = document.querySelector('nav');
  const footer = document.querySelector('footer');
  const navH = nav ? nav.offsetHeight : 48;
  const footerH = footer ? footer.offsetHeight : 50;
  const topOffset = navH + 32;
  const avail = window.innerHeight - topOffset - footerH;
  return {
    terminal: {
      x: Math.max(0, Math.floor((window.innerWidth - w) / 2)),
      y: Math.max(topOffset, topOffset + Math.floor((avail - h) / 2) - 100),
    },
    settings: {
      x: Math.max(20, window.innerWidth - 400 - 20),
      y: topOffset + 4,
    },
  };
}

const positions = typeof document !== 'undefined' ? computePositions() : {
    terminal: { x: 640, y: 215 },
  settings: { x: 1500, y: 84 },
};

const DEFAULT_WINDOWS = {
  explorer:     { id: 'explorer',     title: 'Projects ~ Portfolio',   icon: 'folder',  open: false, minimized: false, maximized: false, position: { x: 60, y: 60 },    size: { width: 640, height: 480 },  zIndex: 1 },
  resume:       { id: 'resume',       title: 'resume_current.pdf \u2014 Preview', icon: 'file', open: false, minimized: false, maximized: false, position: { x: 680, y: 100 },   size: { width: 520, height: 600 },  zIndex: 2 },
  'media-player': { id: 'media-player', title: 'Now Playing',          icon: 'music',  open: false, minimized: false, maximized: false, position: { x: 200, y: 200 },   size: { width: 420, height: 360 },  zIndex: 3 },
  trash:        { id: 'trash',        title: 'Trash (0 items)',        icon: 'trash',  open: false, minimized: false, maximized: false, position: { x: 800, y: 350 },   size: { width: 360, height: 280 },  zIndex: 4 },
  settings:     { id: 'settings',     title: 'Settings \u2014 Portfolio OS', icon: 'gear',  open: false, minimized: false, maximized: false, position: { ...positions.settings }, size: { width: 400, height: 380 },  zIndex: 5 },
  terminal:     { id: 'terminal',     title: 'Terminal',               icon: 'terminal', open: false, minimized: false, maximized: false, position: { ...positions.terminal }, size: { width: 640, height: 480 },  zIndex: 1 },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem('portfolio-os-settings');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { theme: 'system', wallpaper: 'particle-field', terminalFont: 'mono', clockFormat: '12h', dockPosition: 'top', fontSize: 'small' };
}

function saveSettings(s) {
  try {
    localStorage.setItem('portfolio-os-settings', JSON.stringify({
      theme: s.theme, wallpaper: s.wallpaper, terminalFont: s.terminalFont, clockFormat: s.clockFormat, dockPosition: s.dockPosition, fontSize: s.fontSize,
    }));
  } catch {}
}

function getDefaultPositions() {
  const p = typeof document !== 'undefined' ? computePositions() : {
    terminal: { x: 640, y: 215 },
    settings: { x: 1500, y: 84 },
  };
  return {
    explorer:     { x: 60, y: 60 },
    resume:       { x: 680, y: 100 },
    'media-player': { x: 200, y: 200 },
    trash:        { x: 800, y: 350 },
    settings:     { ...p.settings },
    terminal:     { ...p.terminal },
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

  openWindow: (id, forcePosition) => {
    const state = get();
    if (!state.windows[id]) return;
    if (state.windows[id].open && !state.windows[id].minimized) {
      get().focusWindow(id);
      return;
    }
    const zIndex = state.nextZIndex;
    let pos = forcePosition;
    if (!pos && id === 'terminal') {
      const nav = document.querySelector('nav');
      const footer = document.querySelector('footer');
      const navH = nav ? nav.offsetHeight : 48;
      const footerH = footer ? footer.offsetHeight : 50;
      const topOffset = navH + 32;
      const avail = window.innerHeight - topOffset - footerH;
      pos = {
        x: Math.max(0, Math.floor((window.innerWidth - 640) / 2)),
        y: Math.max(topOffset, topOffset + Math.floor((avail - 480) / 2) - 100),
      };
    } else if (!pos && id === 'settings') {
      const nav = document.querySelector('nav');
      const navH = nav ? nav.offsetHeight : 48;
      pos = { x: Math.max(20, window.innerWidth - 400 - 20), y: navH + 32 + 4 };
    }
    if (pos) {
      get().setPosition(id, pos.x, pos.y);
    }
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

  setFontSize: (fontSize) => {
    saveSettings({ ...get(), fontSize });
    set({ fontSize });
  },

  // Mobile state
  mobileActiveTab: 'home',
  moreSheetOpen: false,
  terminalOpen: false,
  mobileViewStack: [],

  setMobileTab: (tab) => set({ mobileActiveTab: tab, mobileViewStack: [] }),
  openMoreSheet: () => set({ moreSheetOpen: true }),
  closeMoreSheet: () => set({ moreSheetOpen: false }),
  openMobileTerminal: () => set({ terminalOpen: true, moreSheetOpen: false }),
  closeMobileTerminal: () => set({ terminalOpen: false }),
  pushMobileView: (view) =>
    set((s) => ({ mobileViewStack: [...s.mobileViewStack, view] })),
  popMobileView: () =>
    set((s) => ({ mobileViewStack: s.mobileViewStack.slice(0, -1) })),
}));