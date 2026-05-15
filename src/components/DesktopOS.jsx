import { useEffect, lazy, Suspense } from 'react';
import { useOSStore } from '../stores/osStore';
import Icon from './Icon';
import ErrorBoundary from './ErrorBoundary';
import Dock from './Dock';
import AppBar from './AppBar';
import Window from './Window';

const ParticleField = lazy(() => import('./ParticleField'));
const DigitalRain = lazy(() => import('./DigitalRain'));
const HexField = lazy(() => import('./HexField'));
const ExplorerWindow = lazy(() => import('./ExplorerWindow'));
const ResumeWindow = lazy(() => import('./ResumeWindow'));
const MediaPlayerWindow = lazy(() => import('./MediaPlayerWindow'));
const TrashWindow = lazy(() => import('./TrashWindow'));
const SettingsWindow = lazy(() => import('./SettingsWindow'));
const TerminalWindow = lazy(() => import('./TerminalWindow'));

const WALLPAPER_CSS = {
  'particle-field': {},
  'digital-rain': {},
  'hex-field': {},
  dots: {
    backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)',
    backgroundSize: '24px 24px',
  },
  grid: {
    backgroundImage:
      'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
    backgroundSize: '40px 40px',
  },
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
    const onBootComplete = () => openWindow('terminal');
    document.addEventListener('boot:complete', onBootComplete);
    // @ts-ignore
    if (window.__bootComplete) openWindow('terminal');
    return () => document.removeEventListener('boot:complete', onBootComplete);
  }, [openWindow]);

  const wallpaperStyle =
    wallpaper !== 'particle-field' ? { background: 'var(--bg)', ...WALLPAPER_CSS[wallpaper] } : {};

  const dockAtTop = dockPosition === 'top';

  return (
    <section
      style={{
        position: 'relative',
        flex: 1,
        overflow: 'hidden',
        isolation: 'isolate',
        display: 'flex',
        flexDirection: 'column',
        '--os-font-mult': fontSize === 'medium' ? 1.2 : fontSize === 'large' ? 1.4 : 1,
        ...wallpaperStyle,
      }}
    >
      <ErrorBoundary>
        <Suspense fallback={null}>
          {wallpaper === 'particle-field' && <ParticleField />}
          {wallpaper === 'digital-rain' && <DigitalRain />}
          {wallpaper === 'hex-field' && <HexField />}
        </Suspense>
      </ErrorBoundary>
      {dockAtTop && <Dock />}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {Object.entries(windows).map(([id, win]) => {
          if (!win.open) return null;
          const menubar = id !== 'terminal' ? ['File', 'Edit', 'View'] : null;
          return (
            <Window key={id} id={id} menubar={menubar}>
              <ErrorBoundary>
                <Suspense
                  fallback={
                    <div
                      style={{
                        padding: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: 'calc(0.7rem * var(--os-font-mult))',
                      }}
                    >
                      Loading...
                    </div>
                  }
                >
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
                </Suspense>
              </ErrorBoundary>
            </Window>
          );
        })}
      </div>

      <div
        onDoubleClick={() => openWindow('trash')}
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '6px',
          userSelect: 'none',
        }}
      >
        <Icon name="trash" size={36} />
        <span
          style={{ fontSize: 'calc(0.65rem * var(--os-font-mult))', color: 'var(--text-muted)' }}
        >
          Trash
        </span>
      </div>

      {!dockAtTop && <Dock />}
      <AppBar />
    </section>
  );
}
