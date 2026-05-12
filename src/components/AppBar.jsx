import { useOSStore } from '../stores/osStore';
import { useState, useEffect, useRef } from 'react';

const APPS = [
  { id: 'explorer', icon: '/img/icons/folder.svg', label: 'Explorer' },
  { id: 'resume', icon: '/img/icons/file-earmark-pdf.svg', label: 'Resume' },
  { id: 'media-player', icon: '/img/icons/music-player.svg', label: 'Media Player' },
  { id: 'settings', icon: '/img/icons/gear.svg', label: 'Settings' },
  { id: 'terminal', icon: '/img/icons/terminal.svg', label: 'Terminal' },
];

export default function AppBar() {
  const windows = useOSStore((s) => s.windows);
  const activeApp = useOSStore((s) => s.activeApp);
  const openWindow = useOSStore((s) => s.openWindow);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const [visible, setVisible] = useState(true);
  const timersRef = useRef({});

  useEffect(() => {
    const t = timersRef.current;
    t.initialHide = setTimeout(() => setVisible(false), 3000);

    const handleMouseMove = (e) => {
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 50;
      const sectionBottom = window.innerHeight - footerHeight;
      if (e.clientY >= sectionBottom - 30) {
        setVisible(true);
        clearTimeout(t.mouseLeave);
        clearTimeout(t.initialHide);
      } else if (e.clientY < sectionBottom - 80) {
        clearTimeout(t.mouseLeave);
        t.mouseLeave = setTimeout(() => setVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(t.initialHide);
      clearTimeout(t.mouseLeave);
    };
  }, []);

  const handleClick = (id) => {
    const w = windows[id];
    if (!w.open) {
      openWindow(id);
    } else if (w.minimized) {
      openWindow(id);
    } else if (activeApp === id) {
      toggleMinimize(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <div
      style={{
        position: 'absolute', bottom: visible ? '10px' : '-50px',
        left: '50%', transform: 'translateX(-50%)',
        transition: 'bottom 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: '12px', padding: '6px 14px',
        display: 'flex', gap: '12px', alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        zIndex: 10000, fontSize: 'calc(0.8rem * var(--os-font-mult))',
      }}
    >
      {[...APPS, ...(windows['trash']?.open ? [{ id: 'trash', icon: '/img/icons/trash.svg', label: 'Trash' }] : [])].map((app) => {
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
              fontSize: 'calc(0.8rem * var(--os-font-mult))',
            }}
          >
            <img src={app.icon} className="icon-img" style={{ width: '18px', height: '18px' }} alt={app.label} />
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
