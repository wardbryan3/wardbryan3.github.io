import { useEffect, useState, useRef, useCallback } from 'react';
import { CommandRegistry } from './CommandRegistry';
import { createCommands, renderFastfetchOutput } from './commands';
import useDraggable from '../hooks/useDraggable';
import useResizable from '../hooks/useResizable';

const DEFAULT_W = 760;
const DEFAULT_H = 520;
const MARGIN = 8;
const MOBILE_BP = 768;

export default function Terminal({
  page = '/home',
  projectCount = 0,
  postCount = 0,
  searchData = /** @type {any[]} */ ([]),
  dirs = /** @type {{ name: string; description: string; count: number }[]} */ ([]),
  side = false,
  flow = false,
  defaultOpen = true,
  embedded = false,
  terminalFont = 'mono',
}) {
  const [phase, setPhase] = useState(side || flow ? 'interactive' : 'growing');
  const [commandText, setCommandText] = useState('');
  const [input, setInput] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [collapsed, setCollapsed] = useState(!defaultOpen);
  const [maximized, setMaximized] = useState(false);
  const [pos, setPos] = useState(side ? null : { x: 0, y: 0 });
  const [size, setSize] = useState(side ? null : { w: DEFAULT_W, h: DEFAULT_H });
  const [ready, setReady] = useState(false);
  const [globalFocusKey, setGlobalFocusKey] = useState(0);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const savedInputRef = useRef('');

  // Restore terminal state from sessionStorage
  const [restored] = useState(() => {
    try {
      const saved = sessionStorage.getItem('terminal-state-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch (e) {
      console.warn('[Terminal] Failed to restore state:', e);
    }
    return null;
  });

  useEffect(() => {
    if (restored && restored.outputLines) {
      setOutputLines(restored.outputLines);
    }
  }, [restored]);

  // Clear cached terminal output when navigating to a different page
  useEffect(() => {
    if (restored) {
      setOutputLines([]);
      try { sessionStorage.removeItem('terminal-state-v1'); } catch (e) { console.warn('[Terminal] Failed to clear state:', e); }
    }
  }, [page]);

  const navRef = useRef(48);
  const preMinRef = useRef(null);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const maximizedRef = useRef(maximized);
  maximizedRef.current = maximized;
  const registryRef = useRef(new CommandRegistry());
  const inputRef = useRef(null);
  const bodyRef = useRef(null);
  const footerRef = useRef(0);

  // Measure nav height and footer height
  useEffect(() => {
    const nav = document.querySelector('nav');
    if (nav) navRef.current = nav.offsetHeight;
    const footer = document.querySelector('footer');
    if (footer) footerRef.current = footer.offsetHeight;
  }, []);

  // Center on mount (client-side)
  useEffect(() => {
    if (!side && typeof window !== 'undefined') {
      const navH = navRef.current;
      const footerH = footerRef.current;
      if (window.innerWidth <= MOBILE_BP) {
        setMaximized(true);
        setSize({ w: window.innerWidth, h: window.innerHeight - navH });
        setPos({ x: 0, y: navH });
        setPhase('prompt');
      } else {
        const maxY = Math.max(navH + MARGIN, Math.min((window.innerHeight - DEFAULT_H) / 2, window.innerHeight - DEFAULT_H - footerH - MARGIN));
        setPos({
          x: Math.max(MARGIN, (window.innerWidth - DEFAULT_W) / 2),
          y: maxY,
        });
      }
      setReady(true);
    }
  }, [side]);



  // Reposition and resize when viewport changes
  useEffect(() => {
    if (side || !ready) return;
    const handleResize = () => {
      const navH = navRef.current;
      const s = sizeRef.current;
      const m = maximizedRef.current;
      if (!s) return;
      if (m) {
        if (window.innerWidth <= MOBILE_BP) {
          const navH = navRef.current;
          setSize({ w: window.innerWidth, h: window.innerHeight - navH });
          setPos({ x: 0, y: navH });
        } else {
          const w = Math.round(window.innerWidth * 0.9);
          const h = Math.round(window.innerHeight * 0.85);
          setSize({ w, h });
          setPos({ x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2) });
        }
      } else {
        setPos(prev => {
          if (!prev) return prev;
          const clampedX = Math.max(MARGIN, Math.min(prev.x, window.innerWidth - s.w - MARGIN));
          const clampedY = Math.max(navH + MARGIN, Math.min(prev.y, window.innerHeight - s.h - footerRef.current - MARGIN));
          return { x: clampedX, y: clampedY };
        });
        setSize(prev => {
          if (!prev) return prev;
          const clampedW = Math.min(prev.w, window.innerWidth - MARGIN * 2);
          const clampedH = Math.min(prev.h, window.innerHeight - navH - footerRef.current - MARGIN * 2);
          return { w: Math.max(480, clampedW), h: Math.max(320, clampedH) };
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [side, ready]);

  // Global Ctrl+` keybinding to focus terminal
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setCollapsed(false);
        setGlobalFocusKey(k => k + 1);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  // Focus from global Ctrl+` shortcut
  useEffect(() => {
    if (globalFocusKey > 0 && !collapsed && phase === 'interactive' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [globalFocusKey, collapsed, phase]);

  const { startDrag } = useDraggable({
    onMove: (x, y) => setPos({ x, y }),
    constraints: (x, y) => ({
      x: Math.max(MARGIN, Math.min(x, window.innerWidth - (size?.w || DEFAULT_W) - MARGIN)),
      y: Math.max(navRef.current + MARGIN, Math.min(y, window.innerHeight - (size?.h || DEFAULT_H) - footerRef.current - MARGIN)),
    }),
  });

  const { startResize } = useResizable({
    onResize: (newW, newH) => {
      const maxW = window.innerWidth - (pos?.x || 0) - MARGIN;
      const maxH = window.innerHeight - (pos?.y || 0) - footerRef.current - MARGIN;
      setSize({ w: Math.min(newW, maxW), h: Math.min(newH, maxH) });
    },
    minW: 480,
    minH: 320,
  });

  // Register commands
  useEffect(() => {
    const reg = registryRef.current;
    reg.commands.clear();
    const allCommands = createCommands({ page, projectCount, postCount, searchData, dirs });
    Object.entries(allCommands).forEach(([name, cmd]) => {
      reg.register(name, cmd.handler, cmd.description);
    });
  }, [page, projectCount, postCount, searchData, dirs]);

  // Execute command
  const executeCommand = useCallback((raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0];
    const args = parts.slice(1);
    const result = registryRef.current.execute(cmdName, args, { registry: registryRef.current });

    if (result.action === 'clear') {
      setOutputLines([]);
      setInput('');
      try { sessionStorage.removeItem('terminal-state-v1'); } catch (e) { console.warn('[Terminal] Failed to clear state:', e); }
      return;
    }

    if (result.action === 'navigate') {
      setOutputLines(prev => [...prev, { type: 'input', text: trimmed }, { type: 'output', content: result.output }]);
      setInput('');
      window.location.href = result.url;
      return;
    }

    setOutputLines(prev => [...prev, { type: 'input', text: trimmed }, { type: 'output', content: result.output }]);
    setInput('');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
      setHistoryIndex(-1);
      savedInputRef.current = '';
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const hist = registryRef.current.getHistory();
      if (hist.length === 0) return;
      if (historyIndex === -1) savedInputRef.current = input;
      const newIdx = Math.min(historyIndex + 1, hist.length - 1);
      setHistoryIndex(newIdx);
      setInput(hist[hist.length - 1 - newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;
      const newIdx = historyIndex - 1;
      if (newIdx < 0) {
        setHistoryIndex(-1);
        setInput(savedInputRef.current);
      } else {
        const hist = registryRef.current.getHistory();
        setHistoryIndex(newIdx);
        setInput(hist[hist.length - 1 - newIdx]);
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCollapsed(prev => !prev); }
    else if ((e.ctrlKey || e.metaKey) && e.key === 'l') { e.preventDefault(); setOutputLines([]); }
  }, [input, executeCommand, historyIndex]);

  const toggleMaximize = useCallback(() => {
    if (side) return;
    setCollapsed(false);
    setMaximized(prev => {
      const next = !prev;
      if (next) {
        if (window.innerWidth <= MOBILE_BP) {
          const navH = navRef.current;
          setSize({ w: window.innerWidth, h: window.innerHeight - navH });
          setPos({ x: 0, y: navH });
        } else {
          const w = Math.round(window.innerWidth * 0.9);
          const h = Math.round(window.innerHeight * 0.85);
          setSize({ w, h });
          setPos({ x: Math.round((window.innerWidth - w) / 2), y: Math.round((window.innerHeight - h) / 2) });
        }
      } else {
        setSize({ w: DEFAULT_W, h: DEFAULT_H });
        setPos({ x: Math.round((window.innerWidth - DEFAULT_W) / 2), y: Math.round((window.innerHeight - DEFAULT_H) / 2) });
      }
      return next;
    });
  }, [side]);

  const closeWindow = useCallback(() => {
    if (side) return;
    if (!collapsed) {
      preMinRef.current = { x: pos.x, y: pos.y, w: size.w, h: size.h };
      const newX = pos.x + (size.w - 480) / 2;
      const newY = pos.y;
      setPos({ x: Math.max(MARGIN, newX), y: Math.max(navRef.current + MARGIN, newY) });
      setSize({ w: 480, h: 34 });
      setCollapsed(true);
    } else {
      if (preMinRef.current) {
        setPos({ x: preMinRef.current.x, y: preMinRef.current.y });
        setSize({ w: preMinRef.current.w, h: preMinRef.current.h });
        preMinRef.current = null;
      }
      setCollapsed(false);
    }
  }, [side, collapsed, pos, size]);

  useEffect(() => {
    if (!collapsed && phase === 'interactive' && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [collapsed, phase]);

  // Auto-scroll to keep prompt visible when window resizes
  useEffect(() => {
    if (!side && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [size, side]);

  // Auto-scroll when new output is added
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [outputLines]);

  // Persist terminal state to sessionStorage (debounced)
  const persistRef = useRef(null);
  useEffect(() => {
    clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem('terminal-state-v1', JSON.stringify({ outputLines }));
      } catch (e) { console.warn('[Terminal] Failed to persist state:', e); }
    }, 1000);
    return () => clearTimeout(persistRef.current);
  }, [outputLines]);

  // Animation phases
  useEffect(() => {
    if (side || phase !== 'growing' || !ready) return;
    const timer = setTimeout(() => setPhase('prompt'), 450);
    return () => clearTimeout(timer);
  }, [side, phase, ready]);

  useEffect(() => {
    if (phase !== 'prompt') return;
    const timer = setTimeout(() => setPhase('command'), 600);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'command') return;
    const target = 'fastfetch';
    let i = 0;
    let doneTimer;
    const timer = setInterval(() => {
      i++;
      setCommandText(target.slice(0, i));
      if (i >= target.length) { clearInterval(timer); doneTimer = setTimeout(() => setPhase('output'), 300); }
    }, 60);
    return () => { clearInterval(timer); clearTimeout(doneTimer); };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'output') return;
    const timer = setTimeout(() => setPhase('interactive'), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'interactive' && !collapsed && inputRef.current) inputRef.current.focus({ preventScroll: true });
  }, [phase, collapsed]);

  const showCursor = phase === 'prompt' || phase === 'command';
  const isInteractive = phase === 'interactive';

  const terminalBody = (
    <div
      className={`terminal-window-body${isInteractive ? ' terminal-body-interactive' : ''}`}
      ref={bodyRef}
      onClick={() => isInteractive && inputRef.current?.focus()}
      style={{ fontFamily: terminalFont === 'sans-serif' ? 'var(--font-sans)' : 'var(--font-mono)' }}
    >
      {(phase !== 'growing' || side) && !flow && (
        <div className="ff-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          {phase !== 'prompt' && commandText && <span className="ff-command">{commandText}</span>}
          {showCursor && <span className="ff-cursor">&nbsp;</span>}
        </div>
      )}

      {!side && !flow && phase !== 'growing' && phase !== 'prompt' && phase !== 'command' && renderFastfetchOutput(projectCount, postCount)}

      {isInteractive && outputLines.length === 0 && (
        <div className="term-muted" style={{ marginTop: '0.5rem', fontSize: 'calc(0.75rem * var(--os-font-mult, 1))' }}>
          Type 'help' for a list of available commands
        </div>
      )}

      {outputLines.map((line, i) => (
        <div key={i} className="term-entry">
          {line.type === 'input' ? (
            <div className="ff-line">
              <span className="ff-prompt">bryan@ward:~$ </span>
              <span className="term-input-text">{line.text}</span>
            </div>
          ) : (
            <div className="term-output-wrapper">{line.content}</div>
          )}
        </div>
      ))}

      {isInteractive && (
        <div className="ff-line term-input-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          <input ref={inputRef} className="term-input" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} spellCheck={false} aria-label="Terminal command input" />
        </div>
      )}
    </div>
  );

  if (embedded) {
    return <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>{terminalBody}</div>;
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const effectiveCollapsed = isMobile ? false : collapsed;
  const windowClasses = `terminal-window${!side && phase === 'growing' && ready ? ' growing' : ''}${side ? ' terminal-sidebar' : ''}${effectiveCollapsed ? ' terminal-collapsed' : ''}${maximized ? ' terminal-maximized' : ''}`;

  if (flow) {
    return (
      <div className={`terminal-column${effectiveCollapsed ? ' terminal-column-collapsed' : ''}`}>
        {!isMobile && (
          <button
            className="terminal-flow-toggle"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
            title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
          >
            {collapsed ? '<' : '>'}
          </button>
        )}
        <div className={`terminal-window terminal-flow${effectiveCollapsed ? ' terminal-collapsed' : ''}`}>
          {!effectiveCollapsed && (
            <div className="terminal-flow-body">
              {terminalBody}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (side) {
    return (
      <div className={`terminal-column${effectiveCollapsed ? ' terminal-column-collapsed' : ''}`}>
        {!isMobile && (
          <button
            className="terminal-flow-toggle"
            onClick={() => setCollapsed(prev => !prev)}
            aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
            title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
          >
            {collapsed ? '<' : '>'}
          </button>
        )}
        <div className={`terminal-window terminal-flow${effectiveCollapsed ? ' terminal-collapsed' : ''}`}>
          {!effectiveCollapsed && (
            <div className="terminal-flow-body">
              {terminalBody}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={windowClasses}
      style={{ position: 'fixed', left: pos?.x ?? 0, top: pos?.y ?? 0, width: size?.w ?? DEFAULT_W, height: effectiveCollapsed ? '34px' : (size?.h ?? DEFAULT_H) + 'px', minHeight: effectiveCollapsed ? '34px' : undefined, zIndex: 10, opacity: ready ? 1 : 0 }}
    >
      <div className="terminal-titlebar" onMouseDown={(e) => { if (pos) startDrag(e, pos); }}>
        <span className="titlebar-title">bryan@ward — fastfetch</span>
        {!isMobile && (
          <div className="titlebar-buttons">
            <span className="titlebar-btn titlebar-minimize" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); closeWindow(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeWindow(); } }} title="Minimize"><svg viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="4.5" width="8" height="1" fill="currentColor"/></svg></span>
            <span className="titlebar-btn titlebar-maximize" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); toggleMaximize(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMaximize(); } }} title={maximized ? 'Restore' : 'Maximize'}>{maximized ? <svg viewBox="0 0 10 10" width="10" height="10"><rect x="1" y="3.5" width="5.5" height="5.5" fill="none" stroke="currentColor" strokeWidth="1"/><rect x="3.5" y="1" width="5.5" height="5.5" fill="none" stroke="currentColor" strokeWidth="1"/></svg> : <svg viewBox="0 0 10 10" width="10" height="10"><rect x="2" y="2" width="6" height="6" fill="none" stroke="currentColor" strokeWidth="1"/></svg>}</span>
            <span className="titlebar-btn titlebar-close" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); closeWindow(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeWindow(); } }} title="Close"><svg viewBox="0 0 10 10" width="10" height="10"><line x1="2" y1="2" x2="8" y2="8" stroke="currentColor" strokeWidth="1.2"/><line x1="8" y1="2" x2="2" y2="8" stroke="currentColor" strokeWidth="1.2"/></svg></span>
          </div>
        )}
      </div>
      {!effectiveCollapsed && terminalBody}
      {!effectiveCollapsed && <div className="terminal-resize-handle" onMouseDown={(e) => { if (pos && size) startResize(e, pos, size); }} />}
    </div>
  );
}
