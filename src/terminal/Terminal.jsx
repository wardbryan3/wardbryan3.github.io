import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { CommandRegistry } from './CommandRegistry';
import { createCommands } from './commands';

const TUX_ART = `                .88888888:.
                88888888.88888.
              .8888888888888888.
              888888888888888888
              88' _\`88'_  \`88888
              88 88 88 88  88888
              88_88_::_88_:88888
              88:::,::,:::::8888
              88\`:::::::::'\`8888
             .88  \`::::'    8:88.
            8888            \`8:888.
          .8888'             \`888888.
         .8888:..  .::.  ...:'8888888:.
        .8888.'     :'     \`'::\`88:88888
       .8888        '         \`.888:8888.
      888:8         .           888:88888
    .888:88        .:           888:88888:
    8888888.       ::           88:888888
    \`.::.888.      ::          .88888888
   .::::::.888.    ::         :::\`8888'.:.
  ::::::::::.888   '         .::::::::::::
  ::::::::::::.8    '      .:8::::::::::::.
 .::::::::::::::.        .:888:::::::::::::
 :::::::::::::::88:.__..:88888:::::::::::'
  \`'.:::::::::::88888888888.88:::::::::'
     \`':::_:' -- '' -'-' \`':_::::'\``;

const DEFAULT_W = 760;
const DEFAULT_H = 520;
const MARGIN = 8;
const MOBILE_BP = 768;

function buildFields(projectCount, postCount) {
  return [
    { key: 'name',      value: 'Bryan Ward',                                                            cls: 'green' },
    { key: 'status',    value: 'learning and building',                                                 cls: 'green' },
    { key: 'level',     value: 'CS student / developer',                                                cls: 'purple' },
    { key: 'focus',     value: 'full-stack web, Linux, FOSS',                                           cls: 'white' },
    { key: 'tools',     value: 'Python, Java, JavaScript, HTML, CSS, Bash, Node.js, React, Spring Boot, Git, Linux, Astro', cls: 'white' },
    { key: 'projects',  value: `${projectCount} active`,                                                cls: 'white' },
    { key: 'posts',     value: `${postCount} published`,                                                cls: 'white' },
    { key: 'github',    value: 'github.com/wardbryan3',                                                 cls: 'link', href: 'https://github.com/wardbryan3' },
    { key: 'linkedin',  value: 'linkedin.com/in/bryan-ward-298292196',                                  cls: 'link', href: 'https://www.linkedin.com/in/bryan-ward-298292196/' },
  ];
}

function buildFieldLines(fields) {
  const maxKeyLen = Math.max(...fields.map(f => f.key.length));
  const padLen = maxKeyLen + 5;
  return fields.map(f => ({
    key: f.key.padEnd(padLen, ' '),
    value: f.value,
    cls: f.cls,
    href: f.href || null,
  }));
}

export default function Terminal({
  page = '/home',
  projectCount = 0,
  postCount = 0,
  searchData = /** @type {any[]} */ ([]),
  dirs = /** @type {{ name: string; description: string; count: number }[]} */ ([]),
  side = false,
  flow = false,
  defaultOpen = true,
}) {
  const [phase, setPhase] = useState(side ? 'interactive' : 'growing');
  const [commandText, setCommandText] = useState('');
  const [input, setInput] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [collapsed, setCollapsed] = useState(!defaultOpen);
  const [maximized, setMaximized] = useState(false);
  const [pos, setPos] = useState(side ? null : { x: 0, y: 0 });
  const [size, setSize] = useState(side ? null : { w: DEFAULT_W, h: DEFAULT_H });
  const [ready, setReady] = useState(false);

  // Mobile floating state
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const check = () => setMobileOpen(document.body.classList.contains('terminal-mobile-open'));
    check();
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const closeMobileTerminal = useCallback(() => {
    document.body.classList.remove('terminal-mobile-open');
    setMobileOpen(false);
  }, []);

  // Restore terminal state from sessionStorage
  const [restored] = useState(() => {
    try {
      const saved = sessionStorage.getItem('terminal-state-v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed;
      }
    } catch {}
    return null;
  });

  useEffect(() => {
    if (restored && restored.outputLines) {
      setOutputLines(restored.outputLines);
    }
  }, [restored]);

  const dragRef = useRef(null);
  const resizeRef = useRef(null);
  const navRef = useRef(48);
  const footerRef = useRef(0);
  const preMinRef = useRef(null);
  const sizeRef = useRef(size);
  sizeRef.current = size;
  const maximizedRef = useRef(maximized);
  maximizedRef.current = maximized;
  const fields = useMemo(() => buildFields(projectCount, postCount), [projectCount, postCount]);
  const fieldLines = useMemo(() => buildFieldLines(fields), [fields]);
  const registryRef = useRef(new CommandRegistry());
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

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

  // Global mouse handlers for drag + resize
  useEffect(() => {
    if (side) return;
    const handleMouseMove = (e) => {
      if (dragRef.current) {
        const d = dragRef.current;
        const w = d.sizeW;
        const h = d.sizeH;
        const rawX = d.origX + (e.clientX - d.startX);
        const rawY = d.origY + (e.clientY - d.startY);
        const clampedX = Math.max(MARGIN, Math.min(rawX, window.innerWidth - w - MARGIN));
        const clampedY = Math.max(navRef.current + MARGIN, Math.min(rawY, window.innerHeight - h - footerRef.current - MARGIN));
        setPos({ x: clampedX, y: clampedY });
      }
      if (resizeRef.current) {
        const r = resizeRef.current;
        const newW = Math.max(480, r.origW + (e.clientX - r.startX));
        const newH = Math.max(320, r.origH + (e.clientY - r.startY));
        const maxW = window.innerWidth - r.posX - MARGIN;
        const maxH = window.innerHeight - r.posY - footerRef.current - MARGIN;
        setSize({ w: Math.min(newW, maxW), h: Math.min(newH, maxH) });
      }
    };
    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
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

  const startDrag = useCallback((e) => {
    if (side || !pos || !size) return;
    if (maximized && window.innerWidth <= MOBILE_BP) return;
    dragRef.current = { startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y, sizeW: size.w, sizeH: size.h };
    e.preventDefault();
  }, [side, pos, size, maximized]);

  const startResize = useCallback((e) => {
    if (side || !pos || !size) return;
    if (maximized && window.innerWidth <= MOBILE_BP) return;
    resizeRef.current = { startX: e.clientX, startY: e.clientY, origW: size.w, origH: size.h, posX: pos.x, posY: pos.y };
    e.preventDefault();
  }, [side, pos, size, maximized]);

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
      try { sessionStorage.removeItem('terminal-state-v1'); } catch {}
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
    if (e.key === 'Enter') executeCommand(input);
    else if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setCollapsed(prev => !prev); }
    else if ((e.ctrlKey || e.metaKey) && e.key === 'l') { e.preventDefault(); setOutputLines([]); }
  }, [input, executeCommand]);

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
    if (!collapsed && phase === 'interactive' && inputRef.current) inputRef.current.focus();
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

  // Persist terminal state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('terminal-state-v1', JSON.stringify({ outputLines }));
    } catch {}
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
    if (phase === 'interactive' && !collapsed && inputRef.current) inputRef.current.focus();
  }, [phase, collapsed]);

  const showCursor = phase === 'prompt' || phase === 'command';
  const isInteractive = phase === 'interactive';

  const renderFieldLines = () => (
    <div className="ff-fields">
      {fieldLines.map((fl, i) => {
        const valueCls = fl.cls === 'green'
          ? 'ff-value ff-value-green'
          : fl.cls === 'purple'
            ? 'ff-value ff-value-purple'
            : fl.cls === 'link'
              ? 'ff-value ff-value-link'
              : 'ff-value';
        return (
          <div key={i} className="ff-line">
            <span className="ff-key">{fl.key}</span>
            {fl.cls === 'link' ? (
              <a href={fl.href} target="_blank" rel="noopener noreferrer" className={valueCls}>{fl.value}</a>
            ) : (
              <span className={valueCls}>{fl.value}</span>
            )}
          </div>
        );
      })}
    </div>
  );

  const terminalBody = (
    <div
      className={`terminal-window-body${isInteractive ? ' terminal-body-interactive' : ''}`}
      ref={bodyRef}
    >
      {(phase !== 'growing' || side) && (
        <div className="ff-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          {phase !== 'prompt' && commandText && <span className="ff-command">{commandText}</span>}
          {showCursor && <span className="ff-cursor">&nbsp;</span>}
        </div>
      )}

      {!side && phase !== 'growing' && phase !== 'prompt' && phase !== 'command' && (
        <div className="ff-output">
          <pre className="ff-tux">{TUX_ART}</pre>
          {renderFieldLines()}
        </div>
      )}

      {isInteractive && outputLines.length === 0 && (
        <div className="term-muted" style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
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

  const windowClasses = `terminal-window${!side && phase === 'growing' && ready ? ' growing' : ''}${side ? ' terminal-sidebar' : ''}${collapsed ? ' terminal-collapsed' : ''}${maximized ? ' terminal-maximized' : ''}`;

  // Mobile floating: when toggled on mobile, render full-screen like the homepage terminal
  const isMobileView = typeof window !== 'undefined' && window.innerWidth <= 768;

  if (mobileOpen && isMobileView && (flow || side)) {
    return (
      <div className="terminal-window terminal-mobile-floating">
        <div className="terminal-titlebar">
          <span className="titlebar-title">bryan@ward — terminal</span>
          <div className="titlebar-buttons">
            <span className="titlebar-btn titlebar-close" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); closeMobileTerminal(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeMobileTerminal(); } }} title="Close">×</span>
          </div>
        </div>
        {terminalBody}
      </div>
    );
  }

  if (flow) {
    return (
      <div className={`terminal-window terminal-flow${collapsed ? ' terminal-collapsed' : ''}`}>
        <button
          className="terminal-minimize terminal-flow-minimize"
          onClick={() => setCollapsed(prev => !prev)}
          aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
          title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
        >
          {collapsed ? '>' : '<'}
        </button>
        {!collapsed && (
          <div className="terminal-flow-body">
            {terminalBody}
          </div>
        )}
      </div>
    );
  }

  if (side) {
    return (
      <div className={windowClasses}>
        <button className="terminal-minimize" onClick={() => setCollapsed(prev => !prev)} aria-label={collapsed ? 'Open terminal' : 'Close terminal'} title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}>
          {collapsed ? '▶' : '▼'}
        </button>
        {!collapsed && terminalBody}
      </div>
    );
  }

  return (
    <div
      className={windowClasses}
      style={{ position: 'fixed', left: pos?.x ?? 0, top: pos?.y ?? 0, width: size?.w ?? DEFAULT_W, height: collapsed ? '34px' : (size?.h ?? DEFAULT_H) + 'px', minHeight: collapsed ? '34px' : undefined, zIndex: 10, opacity: ready ? 1 : 0 }}
    >
      <div className="terminal-titlebar" onMouseDown={startDrag}>
        <span className="titlebar-title">bryan@ward — fastfetch</span>
        <div className="titlebar-buttons">
          <span className="titlebar-btn titlebar-minimize" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); closeWindow(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeWindow(); } }} title="Minimize">_</span>
          <span className="titlebar-btn titlebar-maximize" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); toggleMaximize(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMaximize(); } }} title={maximized ? 'Restore' : 'Maximize'}>{maximized ? '❐' : '□'}</span>
          <span className="titlebar-btn titlebar-close" role="button" tabIndex={0} onMouseDown={(e) => { e.stopPropagation(); closeWindow(); }} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeWindow(); } }} title="Close">×</span>
        </div>
      </div>
      {!collapsed && terminalBody}
      {!collapsed && <div className="terminal-resize-handle" onMouseDown={startResize} />}
    </div>
  );
}
