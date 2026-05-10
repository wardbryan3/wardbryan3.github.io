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
    <div
      style={{
        padding: '10px', fontSize: '0.7rem', height: '100%',
        overflow: 'auto',
      }}
    >
      <SettingRow label="Theme">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          style={selectStyle}
        >
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
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

      <SettingRow label="Terminal font">
        <select
          value={terminalFont}
          onChange={(e) => setTerminalFont(e.target.value)}
          style={selectStyle}
        >
          {FONTS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </SettingRow>

      <SettingRow label="Dock position">
        <select
          value={dockPosition}
          onChange={(e) => setDockPosition(e.target.value)}
          style={selectStyle}
        >
          {DOCK_POSITIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </SettingRow>

      <SettingRow label="Clock format">
        <select
          value={clockFormat}
          onChange={(e) => setClockFormat(e.target.value)}
          style={selectStyle}
        >
          {CLOCK_FORMATS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </SettingRow>

      <div style={{ padding: '6px 0' }}>
        <button
          onClick={resetWindows}
          style={{
            width: '100%', padding: '5px 0',
            background: 'var(--surface-hover)',
            border: '1px solid var(--border)', borderRadius: '4px',
            cursor: 'pointer', color: 'var(--text)', fontSize: '0.65rem',
          }}
        >
          Reset window positions
        </button>
      </div>

      <div
        style={{
          padding: '8px 0', textAlign: 'center',
          color: 'var(--text-muted)', fontSize: '0.6rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        Portfolio OS v1.0 &mdash; Built with Astro + React
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div
      style={{
        display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', padding: '6px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ color: 'var(--text)' }}>{label}</span>
      {children}
    </div>
  );
}

const selectStyle = {
  background: 'var(--surface)', color: 'var(--text)',
  border: '1px solid var(--border)', borderRadius: '3px',
  padding: '2px 6px', fontSize: '0.65rem', cursor: 'pointer',
};
