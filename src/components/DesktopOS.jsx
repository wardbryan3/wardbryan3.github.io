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

const WALLPAPER_CSS = {
  'particle-field': {},
  dots: { backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' },
  grid: { backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' },
  none: {},
};

export default function DesktopOS({ projects, projectCount, postCount, searchData, dirs }) {
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const dockPosition = useOSStore((s) => s.dockPosition);
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
        ...wallpaperStyle,
      }}
    >
      {wallpaper === 'particle-field' && <ParticleField />}
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
      {!dockAtTop && <Dock />}
      <AppBar />
    </section>
  );
}
