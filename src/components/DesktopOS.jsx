import { useEffect } from 'react';
import { useOSStore } from '../stores/osStore';
import ParticleField from './ParticleField';
import DigitalRain from './DigitalRain';
import HexField from './HexField';
import Dock from './Dock';
import AppBar from './AppBar';
import Window from './Window';
import ExplorerWindow from './ExplorerWindow';
import ResumeWindow from './ResumeWindow';
import MediaPlayerWindow from './MediaPlayerWindow';
import TrashWindow from './TrashWindow';
import SettingsWindow from './SettingsWindow';
import TerminalWindow from './TerminalWindow';

const WALLPAPER_CSS = {
  'particle-field': {},
  'digital-rain': {},
  'hex-field': {},
  dots: { backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' },
  grid: { backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' },
  none: {},
};

export default function DesktopOS({ projects, projectCount, postCount, searchData, dirs }) {
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const dockPosition = useOSStore((s) => s.dockPosition);
  const fontSize = useOSStore((s) => s.fontSize);
  const windows = useOSStore((s) => s.windows);
  const openWindow = useOSStore((s) => s.openWindow);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    openWindow('terminal');
  }, [openWindow]);

  const wallpaperStyle = wallpaper !== 'particle-field'
    ? { background: 'var(--bg)', ...WALLPAPER_CSS[wallpaper] }
    : {};

  const dockAtTop = dockPosition === 'top';

  return (
    <section
      style={{
        position: 'relative', flex: 1, overflow: 'hidden',
        isolation: 'isolate', display: 'flex', flexDirection: 'column',
        '--os-font-mult': fontSize === 'medium' ? 1.2 : fontSize === 'large' ? 1.4 : 1,
        ...wallpaperStyle,
      }}
    >
      {wallpaper === 'particle-field' && <ParticleField />}
      {wallpaper === 'digital-rain' && <DigitalRain />}
      {wallpaper === 'hex-field' && <HexField />}
      {dockAtTop && <Dock />}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {Object.entries(windows).map(([id, win]) => {
          if (!win.open) return null;
          const menubar = id !== 'terminal' ? ['File', 'Edit', 'View'] : null;
          return (
            <Window key={id} id={id} menubar={menubar}>
              {id === 'explorer' && <ExplorerWindow projects={projects} />}
              {id === 'resume' && <ResumeWindow />}
              {id === 'media-player' && <MediaPlayerWindow />}
              {id === 'trash' && <TrashWindow />}
              {id === 'settings' && <SettingsWindow />}
              {id === 'terminal' && (
                <TerminalWindow
                  projectCount={projectCount}
                  postCount={postCount}
                  searchData={searchData}
                  dirs={dirs}
                />
              )}
            </Window>
          );
        })}
      </div>

      <div
        onDoubleClick={() => openWindow('trash')}
        style={{
          position: 'absolute', bottom: '16px', right: '16px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          gap: '4px', cursor: 'pointer', padding: '8px',
          borderRadius: '6px', userSelect: 'none',
        }}
      >
        <img src="/img/icons/trash.svg" style={{ width: '36px', height: '36px' }} alt="Trash" />
        <span style={{ fontSize: 'calc(0.65rem * var(--os-font-mult))', color: 'var(--text-muted)' }}>Trash</span>
      </div>

      {!dockAtTop && <Dock />}
      <AppBar />
    </section>
  );
}
