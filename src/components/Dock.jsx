import { useOSStore } from '../stores/osStore';
import { useState, useEffect } from 'react';
import Icon from './Icon';

export default function Dock() {
  const activeApp = useOSStore((s) => s.activeApp);
  const windows = useOSStore((s) => s.windows);
  const minimizeAll = useOSStore((s) => s.minimizeAll);
  const restoreAll = useOSStore((s) => s.restoreAll);
  const openWindow = useOSStore((s) => s.openWindow);
  const clockFormat = useOSStore((s) => s.clockFormat);
  const [time, setTime] = useState('');
  const [showGreeting, setShowGreeting] = useState(false);

  const allMinimized = Object.values(windows).every((w) => !w.open || w.minimized);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const mins = String(now.getMinutes()).padStart(2, '0');
      if (clockFormat === '24h') {
        const hours = String(now.getHours()).padStart(2, '0');
        setTime(`${hours}:${mins}`);
      } else {
        const h = now.getHours();
        const amp = h >= 12 ? 'PM' : 'AM';
        const h12 = h % 12 || 12;
        setTime(`${h12}:${mins} ${amp}`);
      }
    };
    update();
    const id = setInterval(update, 10000);
    return () => clearInterval(id);
  }, [clockFormat]);

  const handlePeek = () => {
    if (allMinimized) {
      restoreAll();
    } else {
      minimizeAll();
    }
  };

  const activeTitle = activeApp ? windows[activeApp]?.title || '' : '';

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '32px',
        padding: '0 10px',
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        fontSize: 'calc(0.7rem * var(--os-font-mult))',
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      <button
        onClick={handlePeek}
        style={{
          background: 'var(--surface-hover)',
          border: '1px solid var(--border)',
          borderRadius: '3px',
          padding: '2px 6px',
          fontSize: 'calc(0.6rem * var(--os-font-mult))',
          cursor: 'pointer',
          color: 'var(--text-muted)',
        }}
        title={allMinimized ? 'Restore windows' : 'Peek desktop'}
      >
        <Icon name="window-desktop" size={14} />
      </button>

      <span
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 600,
          color: 'var(--accent)',
          fontSize: 'calc(0.75rem * var(--os-font-mult))',
          whiteSpace: 'nowrap',
        }}
      >
        {activeTitle}
      </span>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={() => openWindow('settings')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Settings"
        >
          <Icon name="gear" size={14} />
        </button>
        <Icon name="wifi" size={14} />
        <button
          onClick={() => setShowGreeting(!showGreeting)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'calc(0.7rem * var(--os-font-mult))',
            position: 'relative',
          }}
        >
          {time}
          {showGreeting && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '4px',
                padding: '8px 12px',
                whiteSpace: 'nowrap',
                zIndex: 1000,
                fontSize: 'calc(0.7rem * var(--os-font-mult))',
                marginTop: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              }}
            >
              <div style={{ color: 'var(--text)', marginBottom: '2px' }}>Hello, recruiter</div>
              <div style={{ color: 'var(--text-muted)' }}>
                {new Date().toLocaleTimeString()} —{' '}
                {Intl.DateTimeFormat().resolvedOptions().timeZone}
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
