import { useOSStore } from '../stores/osStore';
import { useState, useEffect } from 'react';

const APPS = [
  { id: 'explorer', icon: '\uD83D\uDCC1', label: 'Explorer' },
  { id: 'resume', icon: '\uD83D\uDCC4', label: 'Resume' },
  { id: 'media-player', icon: '\u266A', label: 'Media Player' },
  { id: 'trash', icon: '\uD83D\uDDD1', label: 'Trash' },
  { id: 'settings', icon: '\u2699', label: 'Settings' },
  { id: 'terminal', icon: '\u203A_', label: 'Terminal' },
];

export default function AppBar() {
  const windows = useOSStore((s) => s.windows);
  const activeApp = useOSStore((s) => s.activeApp);
  const openWindow = useOSStore((s) => s.openWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const showTimer = setTimeout(() => setVisible(false), 3000);
    let hideTimer;
    const handleMouseMove = (e) => {
      const viewportH = window.innerHeight;
      if (e.clientY >= viewportH - 30) {
        setVisible(true);
        clearTimeout(hideTimer);
        clearTimeout(showTimer);
      } else if (e.clientY < viewportH - 80) {
        hideTimer = setTimeout(() => setVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, []);

  const handleClick = (id) => {
    const w = windows[id];
    if (!w.open) {
      openWindow(id);
    } else if (w.minimized) {
      focusWindow(id);
    } else if (activeApp === id) {
      toggleMinimize(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div
      style={{
        position: 'fixed', bottom: visible ? '10px' : '-50px',
        left: '50%', transform: 'translateX(-50%)',
        transition: 'bottom 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '6px 14px',
        display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 10000, fontSize: '0.8rem',
      }}
    >
      {APPS.map((app) => {
        const w = windows[app.id];
        const isOpen = w?.open && !w.minimized;
        const isActive = activeApp === app.id && isOpen;
        return (
          <button
            key={app.id}
            onClick={() => handleClick(app.id)}
            title={app.label}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: '2px 0', position: 'relative',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '2px',
              color: isActive
                ? 'var(--accent)'
                : isOpen || w?.open
                  ? 'var(--text)'
                  : 'var(--text-muted)',
              fontSize: '0.8rem',
            }}
          >
            <span>{app.icon}</span>
            {w?.open && (
              <span
                style={{
                  width: '14px', height: '2px',
                  background: isActive ? 'var(--accent)' : 'var(--text-muted)',
                  borderRadius: '1px',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
