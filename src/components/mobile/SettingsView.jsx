import { useState, useEffect } from 'react';
import { useOSStore } from '../../stores/osStore';

const THEMES = [
  'system',
  'tokyonight',
  'everforest',
  'ayu',
  'catppuccin',
  'catppuccin-macchiato',
  'gruvbox',
  'kanagawa',
  'nord',
  'matrix',
  'one-dark',
];

const WALLPAPERS = ['particle-field', 'digital-rain', 'hex-field', 'dots', 'grid', 'none'];
const FONT_SIZES = ['small', 'medium', 'large'];

export default function SettingsView() {
  const mobileViewStack = useOSStore((s) => s.mobileViewStack);
  const popMobileView = useOSStore((s) => s.popMobileView);

  const theme = useOSStore((s) => s.theme);
  const fontSize = useOSStore((s) => s.fontSize);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const setTheme = useOSStore((s) => s.setTheme);
  const setFontSize = useOSStore((s) => s.setFontSize);
  const setWallpaper = useOSStore((s) => s.setWallpaper);

  const [alive, setAlive] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const settingsOpen = mobileViewStack.includes('settings');

  useEffect(() => {
    if (settingsOpen) {
      setAlive(true);
      const timer = setTimeout(() => setSlideIn(true), 20);
      return () => clearTimeout(timer);
    } else if (alive) {
      setSlideIn(false);
      const timer = setTimeout(() => setAlive(false), 280);
      return () => clearTimeout(timer);
    }
  }, [settingsOpen]);

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => popMobileView(), 280);
  };

  if (!alive) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        opacity: slideIn ? 1 : 0,
        transition: 'opacity 0.25s ease-out',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px 16px 0 0',
          padding: '0 0 8px',
          marginBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          maxHeight: '70vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: slideIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s ease-out',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px 10px',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <span
            onClick={handleClose}
            style={{
              fontSize: 'calc(16px * var(--os-font-mult, 1))',
              color: 'var(--accent)',
              cursor: 'pointer',
            }}
          >
            {'\u2190'} Back
          </span>
          <span
            style={{
              fontSize: 'calc(17px * var(--os-font-mult, 1))',
              fontWeight: 600,
              color: 'var(--text)',
            }}
          >
            Settings
          </span>
          <span style={{ width: '42px' }} />
        </div>

        <div style={{ overflow: 'auto', padding: '4px 20px' }}>
          <SettingRow label="Theme">
            <select value={theme} onChange={(e) => setTheme(e.target.value)} style={selectStyle}>
              {THEMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label="Font Size">
            <select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              style={selectStyle}
            >
              {FONT_SIZES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label="Wallpaper">
            <select
              value={wallpaper}
              onChange={(e) => setWallpaper(e.target.value)}
              style={selectStyle}
            >
              {WALLPAPERS.map((w) => (
                <option key={w} value={w}>
                  {w}
                </option>
              ))}
            </select>
          </SettingRow>

          <div
            style={{
              padding: '16px 0',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: 'calc(12px * var(--os-font-mult, 1))',
            }}
          >
            Portfolio OS v1.0
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: 'calc(16px * var(--os-font-mult, 1))', color: 'var(--text)' }}>
        {label}
      </span>
      {children}
    </div>
  );
}

const selectStyle = {
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: 'calc(14px * var(--os-font-mult, 1))',
  cursor: 'pointer',
};
