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

function buildFields(projectCount, postCount) {
  return [
    { key: 'name',      value: 'Bryan Ward',                                                            cls: 'green' },
    { key: 'status',    value: 'building cool stuff',                                                   cls: 'green' },
    { key: 'level',     value: 'CS student / developer',                                                cls: 'purple' },
    { key: 'focus',     value: 'full-stack web',                                                        cls: 'white' },
    { key: 'tools',     value: 'TypeScript, JavaScript, React, Next.js, Node.js, Python, Java, C++, Rust, SQL, Git, Docker, Linux, Astro', cls: 'white' },
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
  side = false,
  defaultOpen = true,
}) {
  const [phase, setPhase] = useState(side ? 'interactive' : 'growing');
  const [commandText, setCommandText] = useState('');
  const [input, setInput] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [collapsed, setCollapsed] = useState(!defaultOpen);

  const fields = useMemo(() => buildFields(projectCount, postCount), [projectCount, postCount]);
  const fieldLines = useMemo(() => buildFieldLines(fields), [fields]);
  const registryRef = useRef(new CommandRegistry());
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  // Register commands
  useEffect(() => {
    const reg = registryRef.current;
    reg.commands.clear();
    const allCommands = createCommands({ page, projectCount, postCount, searchData });
    Object.entries(allCommands).forEach(([name, cmd]) => {
      reg.register(name, cmd.handler, cmd.description);
    });
  }, [page, projectCount, postCount, searchData]);

  // Execute command
  const executeCommand = useCallback((raw) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0];
    const args = parts.slice(1);

    const result = registryRef.current.execute(cmdName, args, {
      registry: registryRef.current,
    });

    if (result.action === 'clear') {
      setOutputLines([]);
      setInput('');
      return;
    }

    if (result.action === 'navigate') {
      setOutputLines(prev => [...prev,
        { type: 'input', text: trimmed },
        { type: 'output', content: result.output },
      ]);
      setInput('');
      window.open(result.url, '_self');
      return;
    }

    setOutputLines(prev => [...prev,
      { type: 'input', text: trimmed },
      { type: 'output', content: result.output },
    ]);
    setInput('');

    setTimeout(() => {
      if (bodyRef.current) {
        bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
      }
    }, 20);
  }, []);

  // Keyboard handler
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setCollapsed(prev => !prev);
    }
  }, [input, executeCommand]);

  // Focus input when interactive
  useEffect(() => {
    if (!collapsed && phase === 'interactive' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [collapsed, phase]);

  // Animation phases (homepage only)
  useEffect(() => {
    if (side || phase !== 'growing') return;
    const timer = setTimeout(() => setPhase('prompt'), 450);
    return () => clearTimeout(timer);
  }, [side, phase]);

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
      if (i >= target.length) {
        clearInterval(timer);
        doneTimer = setTimeout(() => setPhase('output'), 300);
      }
    }, 60);
    return () => {
      clearInterval(timer);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'output') return;
    const timer = setTimeout(() => setPhase('interactive'), 400);
    return () => clearTimeout(timer);
  }, [phase]);

  useEffect(() => {
    if (phase === 'interactive' && !collapsed && inputRef.current) {
      inputRef.current.focus();
    }
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
      {/* Command line from initial animation */}
      {(phase !== 'growing' || side) && (
        <div className="ff-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          {phase !== 'prompt' && commandText && (
            <span className="ff-command">{commandText}</span>
          )}
          {showCursor && <span className="ff-cursor">&nbsp;</span>}
        </div>
      )}

      {/* Fastfetch output (homepage: after command; sidebar: hidden) */}
      {!side && phase !== 'growing' && phase !== 'prompt' && phase !== 'command' && (
        <div className="ff-output">
          <pre className="ff-tux">{TUX_ART}</pre>
          {renderFieldLines()}
        </div>
      )}

      {/* Command history */}
      {outputLines.map((line, i) => (
        <div key={i} className="term-entry">
          {line.type === 'input' ? (
            <div className="ff-line">
              <span className="ff-prompt">$ </span>
              <span className="term-input-text">{line.text}</span>
            </div>
          ) : (
            <div className="term-output-wrapper">{line.content}</div>
          )}
        </div>
      ))}

      {/* Interactive prompt */}
      {isInteractive && (
        <div className="ff-line term-input-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          <input
            ref={inputRef}
            className="term-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
          <span className="ff-cursor">&nbsp;</span>
        </div>
      )}
    </div>
  );

  const windowClasses = `terminal-window${!side && phase === 'growing' ? ' growing' : ''}${side ? ' terminal-sidebar' : ''}${collapsed ? ' terminal-collapsed' : ''}`;

  return (
    <div className={windowClasses}>
      {side && (
        <button
          className="terminal-minimize"
          onClick={() => setCollapsed(prev => !prev)}
          aria-label={collapsed ? 'Open terminal' : 'Close terminal'}
          title={collapsed ? 'Open terminal (Ctrl+K)' : 'Close terminal (Ctrl+K)'}
        >
          {collapsed ? '▶' : '▼'}
        </button>
      )}
      {!collapsed && terminalBody}
    </div>
  );
}
