import { useState, useEffect } from 'react';
import { useOSStore } from '../stores/osStore';

const THEMES = [
  'system', 'tokyonight', 'everforest', 'ayu', 'catppuccin',
  'catppuccin-macchiato', 'gruvbox', 'kanagawa', 'nord', 'matrix', 'one-dark',
];

const THEME_LABELS = {
  system: 'system',
  tokyonight: 'tokyo',
  everforest: 'ever',
  ayu: 'ayu',
  catppuccin: 'cat',
  'catppuccin-macchiato': 'mac',
  gruvbox: 'gruv',
  kanagawa: 'kana',
  nord: 'nord',
  matrix: 'mtx',
  'one-dark': '1dark',
};

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const theme = useOSStore((s) => s.theme);
  const setTheme = useOSStore((s) => s.setTheme);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const isActive = (path) => {
    const p = window.location.pathname;
    return p === path || (path !== '/' && p.startsWith(path + '/'));
  };

  return (
    <>
      <button
        class="hamburger-btn"
        aria-label="Open navigation menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
      {open && <div class="nav-backdrop" onClick={() => setOpen(false)} />}
      <div class={`nav-panel ${open ? 'nav-panel--open' : ''}`}>
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Navigation</span>
          <div class="nav-panel-links">
            <a
              href="/"
              class={`nav-panel-link ${isActive('/') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Home
            </a>
            <a
              href="/blog"
              class={`nav-panel-link ${isActive('/blog') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Blog
            </a>
            <a
              href="/projects"
              class={`nav-panel-link ${isActive('/projects') ? 'nav-panel-link--active' : ''}`}
              onClick={() => setOpen(false)}
            >
              Projects
            </a>
          </div>
        </div>
        <div class="nav-panel-divider"></div>
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Theme</span>
          <div class="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t}
                class={`theme-btn ${theme === t ? 'theme-btn--active' : ''}`}
                onClick={() => setTheme(t)}
              >
                {THEME_LABELS[t] || t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
