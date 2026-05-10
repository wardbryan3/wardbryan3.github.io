import { useCallback, useRef } from 'react';
import { useOSStore } from '../stores/osStore';

const ICONS = {
  folder: '\uD83D\uDCC1',
  file: '\uD83D\uDCC4',
  music: '\u266A',
  trash: '\uD83D\uDDD1',
  gear: '\u2699',
  terminal: '\u203A_',
};

export default function Window({ id, children, menubar }) {
  const win = useOSStore((s) => s.windows[id]);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const toggleMinimize = useOSStore((s) => s.toggleMinimize);
  const toggleMaximize = useOSStore((s) => s.toggleMaximize);
  const setPosition = useOSStore((s) => s.setPosition);
  const setSize = useOSStore((s) => s.setSize);

  const dragStart = useRef(null);
  const posStart = useRef(null);

  const handleTitleMouseDown = useCallback((e) => {
    if (e.target.closest('.window-controls') || e.target.closest('.window-menubar')) return;
    focusWindow(id);
    dragStart.current = { x: e.clientX, y: e.clientY };
    posStart.current = { x: win.position.x, y: win.position.y };
    const handleMouseMove = (e) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition(id, posStart.current.x + dx, posStart.current.y + dy);
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, win.position, focusWindow, setPosition]);

  const handleResizeStart = useCallback((e) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const startW = win.size.width;
    const startH = win.size.height;
    const handleMouseMove = (e) => {
      setSize(
        id,
        Math.max(280, startW + e.clientX - startX),
        Math.max(200, startH + e.clientY - startY)
      );
    };
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [id, win.size, setSize]);

  const handleTitleDblClick = useCallback(() => {
    toggleMaximize(id);
  }, [id, toggleMaximize]);

  if (!win || !win.open) return null;

  const isMaximized = win.maximized;
  const dockH = 32;

  const frameSx = isMaximized
    ? { position: 'fixed', top: dockH, left: 0, width: '100%', height: 'calc(100vh - 32px)', zIndex: win.zIndex, borderRadius: 0 }
    : { position: 'fixed', top: Math.max(dockH, win.position.y), left: Math.max(0, win.position.x), width: win.size.width, height: win.size.height, zIndex: win.zIndex, borderRadius: '6px' };

  return (
    <div
      className={`os-window${isMaximized ? ' os-window-maximized' : ''}`}
      style={{
        ...frameSx,
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      }}
      onMouseDown={() => focusWindow(id)}
    >
      <div
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={handleTitleDblClick}
        style={{
          display: 'flex', alignItems: 'center', padding: '0.3rem 0.6rem',
          borderBottom: '1px solid var(--border)', cursor: 'grab',
          userSelect: 'none', background: 'var(--surface)',
        }}
      >
        <span style={{ marginRight: '0.4rem', fontSize: '0.75rem' }}>{ICONS[win.icon] || ''}</span>
        <span style={{ flex: 1, fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center' }}>{win.title}</span>
        <div className="window-controls" style={{ display: 'flex', gap: '4px' }}>
          <button
            className="titlebar-btn"
            onClick={() => toggleMinimize(id)}
            style={btnStyle}
          >_</button>
          <button
            className="titlebar-btn"
            onClick={() => toggleMaximize(id)}
            style={btnStyle}
          >{isMaximized ? '\u21F1' : '\u25A1'}</button>
          <button
            className="titlebar-btn titlebar-close"
            onClick={() => closeWindow(id)}
            style={{ ...btnStyle, color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#cc3333'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = '#cc3333'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--surface-hover)'; e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >X</button>
        </div>
      </div>

      {menubar && (
        <div className="window-menubar" style={{ display: 'flex', gap: '10px', padding: '2px 8px', borderBottom: '1px solid var(--border)', fontSize: '0.65rem', background: 'var(--surface)' }}>
          {menubar.map((item) => (
            <span key={item} style={{ cursor: 'pointer', color: 'var(--text-muted)' }}>{item}</span>
          ))}
        </div>
      )}

      <div style={{ flex: 1, minHeight: 0, overflow: 'auto', background: 'var(--bg)' }}>
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
