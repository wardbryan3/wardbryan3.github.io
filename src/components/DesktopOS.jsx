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

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <section
      style={{
        position: 'relative', height: '100%', overflow: 'hidden',
        isolation: 'isolate', display: 'flex', flexDirection: 'column',
      }}
    >
      <ParticleField />
      <Dock />
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
      <AppBar />
    </section>
  );
}
