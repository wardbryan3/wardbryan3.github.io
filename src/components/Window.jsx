import { useCallback, useState, useEffect } from 'react';
import { useOSStore } from '../stores/osStore';
import useDraggable from '../hooks/useDraggable';
import useResizable from '../hooks/useResizable';
import Icon from './Icon';

const ICON_NAMES = {
  folder: 'folder',
  file: 'file-earmark-pdf',
  music: 'music-player',
  trash: 'trash',
  gear: 'gear',
  terminal: 'terminal',
};

export default function Window({ id, children, menubar }) {
  const win = useOSStore((s) => s.windows[id]);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  const setPosition = useOSStore((s) => s.setPosition);
  const setSize = useOSStore((s) => s.setSize);
  const dockPosition = useOSStore((s) => s.dockPosition);



  const [navH, setNavH] = useState(48);
  const [footerH, setFooterH] = useState(50);

  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) setNavH(nav.offsetHeight);
    const footer = document.querySelector('footer');
    if (footer) setFooterH(footer.offsetHeight);
  }, []);

  const dockAtTop = dockPosition === 'top';
  const topOffset = navH + (dockAtTop ? 32 : 0);

  const clampPos = useCallback((x, y) => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    const t = (nav ? nav.offsetHeight : 48) + (dockAtTop ? 32 : 0);
    const fh = footer ? footer.offsetHeight : 50;
    const b = dockAtTop ? fh : fh + 32;
    const w = win.size.width;
    const h = win.size.height;
    return {
      x: Math.max(0, Math.min(x, window.innerWidth - w)),
      y: Math.max(t, Math.min(y, window.innerHeight - b - h)),
    };
  }, [win.size, dockAtTop]);

  const { startDrag } = useDraggable({
    onMove: (x, y) => setPosition(id, x, y),
    constraints: clampPos,
  });

  const { startResize } = useResizable({
    onResize: (w, h) => {
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 50;
      const maxW = window.innerWidth - win.position.x;
      const maxH = window.innerHeight - footerHeight - win.position.y;
      setSize(id, Math.min(w, maxW), Math.min(h, maxH));
    },
    minW: 280,
    minH: 200,
  });

  const handleTitleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.window-menubar')) return;
    focusWindow(id);
    startDrag(e, { x: win.position.x, y: win.position.y });
  }, [id, win.position, focusWindow, startDrag]);

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    focusWindow(id);
    startResize(e, { x: win.position.x, y: win.position.y }, { width: win.size.width, height: win.size.height });
  }, [id, win.position, win.size, focusWindow, startResize]);

  const handleTitleDblClick = useCallback(() => {
    toggleMaximize(id);
  }, [id, toggleMaximize]);

  if (!win || !win.open) return null;

  const isMaximized = win.maximized;

  const maxBottom = dockAtTop ? footerH : footerH + 32;
  const frameSx = isMaximized
    ? { position: 'fixed', top: topOffset, left: 0, width: '100%', height: `calc(100vh - ${topOffset + maxBottom}px)`, zIndex: win.zIndex, borderRadius: 0 }
    : { position: 'fixed', top: Math.max(topOffset, win.position.y), left: Math.max(0, win.position.x), width: win.size.width, height: win.size.height, zIndex: win.zIndex, borderRadius: '6px' };

  return (
    <div
      className={`os-window${isMaximized ? ' os-window-maximized' : ''}`}
      style={{
        ...frameSx,
        background: 'transparent',
        border: '1px solid var(--border)',
        display: win.minimized ? 'none' : 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDblClick}
        style={{
          position: 'relative', display: 'flex', alignItems: 'center', padding: '0.3rem 0.6rem',
          borderBottom: '1px solid var(--border)', cursor: 'grab',
          userSelect: 'none', background: 'var(--surface)', opacity: 0.9,
        }}
      >
        {ICON_NAMES[win.icon] && <Icon name={ICON_NAMES[win.icon]} size={14} style={{ marginRight: '0.4rem' }} />}
        <span style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', fontSize: 'calc(0.7rem * var(--os-font-mult))', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{win.title}</span>
        <div className="window-controls" style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
          <button
            className="titlebar-btn"
            onClick={() => toggleMinimize(id)}
            style={btnStyle}
          >
            <svg viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="4.5" width="8" height="1" fill="currentColor"/></svg>
          </button>
          <button
            className="titlebar-btn"
            onClick={() => toggleMaximize(id)}
            style={btnStyle}
          >
            {isMaximized ? (
              <svg viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="3.5" width="5.5" height="5.5" fill="none" stroke="currentColor" stroke-width="1"/><rect x="3.5" y="1" width="5.5" height="5.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>
            ) : (
              <svg viewBox="0 0 10 10" width="10" height="10"><rect x="2" y="2" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1"/></svg>
            )}
          </button>
          <button
            className="titlebar-btn titlebar-close"
            onClick={() => closeWindow(id)}
            style={{ ...btnStyle, color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cc3333'; e.currentTarget.style.borderColor = '#cc3333'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            <svg viewBox="0 0 10 10" width="10" height="10"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" stroke-width="1.2"/><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" stroke-width="1.2"/></svg>
          </button>
        </div>
      </div>

      {menubar && (
        <div className="window-menubar" style={{ display: 'flex', gap: '10px', padding: '2px 8px', borderBottom: '1px solid var(--border)', fontSize: 'calc(0.65rem * var(--os-font-mult))', background: 'var(--surface)', opacity: 0.9 }}>
          {menubar.map((item) => (
            <span key={item} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>{item}</span>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg)', opacity: 0.9 }}>
        {children}
      </div>

      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          style={{ position: 'absolute', bottom: 0, right: 0, width: '14px', height: '14px', cursor: 'nwse-resize' }}
        >
          <div style={{ position: 'absolute', bottom: '3px', right: '3px', width: '8px', height: '8px', borderRight: '2px solid var(--text-muted)', borderBottom: '2px solid var(--text-muted)', opacity: 0.4 }} />
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  width: '14px', height: '14px', fontSize: '0.5rem', lineHeight: '14px',
  textAlign: 'center', padding: 0, border: '1px solid var(--border)',
  background: 'var(--surface-hover)', color: 'var(--text-muted)',
  borderRadius: '3px', cursor: 'pointer',
};
