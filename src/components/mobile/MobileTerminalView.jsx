import { useState, useEffect } from 'react';
import { useOSStore } from '../../stores/osStore';
import Terminal from '../../terminal/Terminal';

/**
 * @param {{ projectCount?: number, postCount?: number, searchData?: any[], dirs?: { name: string; description: string; count: number }[] }} props
 */
export default function MobileTerminalView({
  projectCount = 0,
  postCount = 0,
  searchData = [],
  dirs = [],
}) {
  const terminalOpen = useOSStore((s) => s.terminalOpen);
  const closeMobileTerminal = useOSStore((s) => s.closeMobileTerminal);

  const [alive, setAlive] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (terminalOpen) {
      setAlive(true);
      const timer = setTimeout(() => setSlideIn(true), 20);
      return () => clearTimeout(timer);
    } else if (alive) {
      setSlideIn(false);
      const timer = setTimeout(() => setAlive(false), 280);
      return () => clearTimeout(timer);
    }
  }, [terminalOpen, alive]);

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => closeMobileTerminal(), 280);
  };

  if (!alive) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
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
          background: 'var(--bg)',
          height: '100%',
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
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            background: 'var(--surface)',
            position: 'relative',
          }}
        >
          <span
            onClick={handleClose}
            style={{
              fontSize: 'calc(16px * var(--os-font-mult, 1))',
              color: 'var(--accent)',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            {'\u2190'} Back
          </span>
          <span
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 'calc(14px * var(--os-font-mult, 1))',
              fontWeight: 600,
              color: 'var(--text)',
            }}
          >
            Terminal
          </span>
        </div>

        <div className="mobile-terminal-body" style={{ flex: 1, minHeight: 0 }}>
          <Terminal
            page="/home"
            projectCount={projectCount}
            postCount={postCount}
            searchData={searchData}
            dirs={dirs}
            side={false}
            embedded
          />
        </div>
      </div>
    </div>
  );
}
