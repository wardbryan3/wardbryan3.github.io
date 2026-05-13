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

export default function NavMenu({ currentPath }) {
  const [open, setOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState('system');
  const setTheme = useOSStore((s) => s.setTheme);

  useEffect(() => {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) setActiveTheme(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const isActive = (path) => {
    const p = currentPath;
    return p === path || (path !== '/' && p.startsWith(path + '/'));
  };

  const label = open ? 'Close navigation menu' : 'Open navigation menu';

  return (
    <>
      <button
        class="hamburger-btn"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
        <span class="hamburger-bar"></span>
      </button>
      {open && <div class="nav-backdrop" onClick={() => setOpen(false)} />}
      <div
        class={`nav-panel ${open ? 'nav-panel--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Navigation</span>
          <nav class="nav-panel-links">
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
          </nav>
        </div>
        <div class="nav-panel-divider"></div>
        <div class="nav-panel-section">
          <span class="nav-panel-heading">Theme</span>
          <div class="theme-grid">
            {THEMES.map((t) => (
              <button
                key={t}
                class={`theme-btn ${activeTheme === t ? 'theme-btn--active' : ''}`}
                onClick={() => {
                  setActiveTheme(t);
                  setTheme(t);
                }}
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
