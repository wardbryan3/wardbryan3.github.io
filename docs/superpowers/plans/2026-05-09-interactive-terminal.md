# Interactive Terminal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the fastfetch hero window into an interactive terminal with 14 commands, collapsible sidebar on subpages, and client-side search.

**Architecture:** New `src/terminal/` directory: `CommandRegistry.js` (command map + history), `commands.js` (14 command handlers returning `{ output, action? }`), `Terminal.jsx` (refactored from FastfetchWindow — adds interactive input, sidebar mode, Ctrl+K toggle). `HeroDashboard` updated. `BaseLayout` extended to conditionally render sidebar terminal on non-home pages.

**Tech Stack:** React (client:load), Astro content collections, no new dependencies

---

### Task 1: Create terminal foundation — registry and commands

**Files:**
- Create: `src/terminal/CommandRegistry.js`
- Create: `src/terminal/commands.js`

- [ ] **Step 1: Write CommandRegistry.js**

```js
export class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.history = [];
  }

  register(name, handler, description) {
    this.commands.set(name.toLowerCase(), { handler, description });
  }

  get(name) {
    return this.commands.get(name.toLowerCase());
  }

  list() {
    return [...this.commands.entries()].map(([name, cmd]) => ({
      name,
      description: cmd.description,
    }));
  }

  execute(name, args, context) {
    const cmd = this.get(name);
    if (!cmd) return { output: `command not found: ${name}` };
    this.history.push(`${name}${args.length ? ' ' + args.join(' ') : ''}`);
    return cmd.handler(args, context);
  }

  getHistory() {
    return [...this.history];
  }
}
```

- [ ] **Step 2: Write commands.js**

```js
export function createCommands({ page, projectCount, postCount, searchData }) {
  const commands = {};

  commands.help = {
    description: 'show available commands',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text">Available commands:</div>
          {[
            ['help', 'show this message'],
            ['whoami', 'about me'],
            ['pwd', 'current page'],
            ['date', 'date and time'],
            ['echo', 'echo text back'],
            ['clear', 'clear terminal'],
            ['history', 'recent commands'],
            ['neofetch', 'system info'],
            ['ls', 'list sections'],
            ['cd', 'navigate to page'],
            ['cat', 'view content'],
            ['find', 'search by name'],
            ['grep', 'search by content'],
            ['top', 'site activity'],
          ].map(([name, desc]) => (
            <div key={name} className="term-text">
              <span className="ff-value-green">  {name.padEnd(10)}</span>
              <span className="term-muted">— {desc}</span>
            </div>
          ))}
        </div>
      ),
    }),
  };

  commands.whoami = {
    description: 'about me',
    handler: () => ({
      output: (
        <div className="term-text">
          Bryan Ward — full-stack developer and CS student. I build things.
        </div>
      ),
    }),
  };

  commands.pwd = {
    description: 'current page',
    handler: () => ({
      output: <div className="term-text">{page}</div>,
    }),
  };

  commands.date = {
    description: 'date and time',
    handler: () => ({
      output: <div className="term-text">{new Date().toString()}</div>,
    }),
  };

  commands.echo = {
    description: 'echo text back',
    handler: (args) => ({
      output: <div className="term-text">{args.join(' ') || ''}</div>,
    }),
  };

  commands.clear = {
    description: 'clear terminal',
    handler: () => ({ action: 'clear' }),
  };

  commands.history = {
    description: 'recent commands',
    handler: (args, ctx) => {
      const hist = ctx.registry.getHistory();
      if (hist.length === 0)
        return { output: <div className="term-text term-muted">no history</div> };
      return {
        output: (
          <div className="term-output">
            {hist.map((cmd, i) => (
              <div key={i} className="term-text">
                <span className="term-muted">{String(i + 1).padStart(3)}</span>  {cmd}
              </div>
            ))}
          </div>
        ),
      };
    },
  };

  commands.neofetch = {
    description: 'system info',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text"><span className="term-muted">name     </span><span className="ff-value-green">Bryan Ward</span></div>
          <div className="term-text"><span className="term-muted">status   </span><span className="ff-value-green">building cool stuff</span></div>
          <div className="term-text"><span className="term-muted">level    </span><span className="ff-value-purple">CS student / developer</span></div>
          <div className="term-text"><span className="term-muted">focus    </span>full-stack web</div>
          <div className="term-text"><span className="term-muted">projects </span>{projectCount} active</div>
          <div className="term-text"><span className="term-muted">posts    </span>{postCount} published</div>
        </div>
      ),
    }),
  };

  commands.ls = {
    description: 'list sections',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text"><span className="ff-value-link">blog/</span></div>
          <div className="term-text"><span className="ff-value-link">projects/</span></div>
          <div className="term-text">README.md</div>
        </div>
      ),
    }),
  };

  commands.cd = {
    description: 'navigate to a page',
    handler: (args) => {
      const target = args[0];
      const paths = { blog: '/blog', projects: '/projects', home: '/', about: '/' };
      if (!target) return { output: <div className="term-text term-muted">cd: missing argument</div> };
      const url = paths[target];
      if (!url) return { output: <div className="term-text term-muted">cd: no such directory: {target}</div> };
      return {
        output: (
          <div className="term-text">
            navigating to <a href={url} className="ff-value-link">{url}</a>...
          </div>
        ),
        action: 'navigate',
        url,
      };
    },
  };

  commands.cat = {
    description: 'view content',
    handler: (args) => {
      const file = args[0];
      if (!file) return { output: <div className="term-text term-muted">cat: missing filename</div> };
      if (file === 'README.md') {
        return { output: <div className="term-text">Hi, I'm Bryan — a CS student and full-stack developer. Type 'ls' to explore.</div> };
      }
      return { output: <div className="term-text term-muted">cat: no such file: {file}</div> };
    },
  };

  commands.find = {
    description: 'search by name',
    handler: (args) => {
      const keyword = args.join(' ').toLowerCase();
      if (!keyword) return { output: <div className="term-text term-muted">find: missing search term</div> };
      if (!searchData || searchData.length === 0) return { output: <div className="term-text term-muted">no search data</div> };
      const results = searchData.filter(item => item.title.toLowerCase().includes(keyword));
      if (results.length === 0) return { output: <div className="term-text term-muted">no matches for: {keyword}</div> };
      return {
        output: (
          <div className="term-output">
            {results.map((item, i) => (
              <div key={i} className="term-text">
                <a href={item.path} className="ff-value-link">{item.type}/{item.slug}</a>
                <span className="term-muted">  {item.title}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  };

  commands.grep = {
    description: 'search by content',
    handler: (args) => {
      const keyword = args.join(' ').toLowerCase();
      if (!keyword) return { output: <div className="term-text term-muted">grep: missing search term</div> };
      if (!searchData || searchData.length === 0) return { output: <div className="term-text term-muted">no search data</div> };
      const results = searchData.filter(item => item.title.toLowerCase().includes(keyword));
      if (results.length === 0) return { output: <div className="term-text term-muted">no matches for: {keyword}</div> };
      return {
        output: (
          <div className="term-output">
            {results.map((item, i) => (
              <div key={i} className="term-text">
                <a href={item.path} className="ff-value-link">{item.type}/{item.slug}</a>
                <span className="term-muted">  {item.title}</span>
              </div>
            ))}
          </div>
        ),
      };
    },
  };

  commands.top = {
    description: 'site activity',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text">Tasks: {projectCount + postCount} total, {projectCount} running, {postCount} sleeping</div>
          <div className="term-text" style={{ marginTop: 4 }}>
            <span className="term-muted">PID</span>  <span className="term-muted">USER</span>      <span className="term-muted">%CPU</span> <span className="term-muted">COMMAND</span>
          </div>
          <div className="term-text">  1  bryan      0.0  /sbin/build</div>
          <div className="term-text">  2  bryan      5.2  /usr/bin/deploy</div>
          <div className="term-text">  3  bryan      3.1  /usr/bin/code</div>
          <div className="term-text">  4  bryan     12.7  /usr/bin/coffee</div>
          <div className="term-text">  5  bryan      0.3  /usr/bin/zsh</div>
        </div>
      ),
    }),
  };

  return commands;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/terminal/CommandRegistry.js src/terminal/commands.js
git commit -m "feat: add terminal command registry and 14 commands"
```

---

### Task 2: Create Terminal component (replaces FastfetchWindow)

**Files:**
- Create: `src/terminal/Terminal.jsx`
- Delete: `src/components/FastfetchWindow.jsx`

- [ ] **Step 1: Delete FastfetchWindow.jsx**

```bash
rm src/components/FastfetchWindow.jsx
```

- [ ] **Step 2: Write Terminal.jsx**

```jsx
import { useEffect, useState, useRef, useCallback } from 'react';
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
  searchData = [],
  side = false,
  defaultOpen = true,
}) {
  const [phase, setPhase] = useState(side ? 'interactive' : 'growing');
  const [commandText, setCommandText] = useState(side ? 'fastfetch' : '');
  const [input, setInput] = useState('');
  const [outputLines, setOutputLines] = useState([]);
  const [collapsed, setCollapsed] = useState(!defaultOpen);

  const fieldsRef = useRef(buildFields(projectCount, postCount));
  const fieldLinesRef = useRef(buildFieldLines(fieldsRef.current));
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
  const fieldLines = fieldLinesRef.current;

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
```

- [ ] **Step 3: Commit**

```bash
git add src/terminal/Terminal.jsx
git commit -m "feat: add interactive Terminal component"
```

---

### Task 3: Add terminal CSS — input, sidebar, command output

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Add CSS after the `.ff-command` block (after the existing line 220 area)**

```css
/* Interactive terminal */
.terminal-body-interactive {
  max-height: 70vh;
  overflow-y: auto;
}

.term-input-line {
  display: flex;
  align-items: center;
}

.term-input {
  background: transparent;
  border: none;
  color: var(--text);
  font-family: var(--font-mono);
  font-size: inherit;
  outline: none;
  flex: 1;
  caret-color: var(--accent);
}

.term-entry {
  margin-bottom: 0.15rem;
}

.term-input-text {
  color: var(--text);
}

.term-output-wrapper {
  margin-bottom: 0;
}

.term-output {
  line-height: inherit;
}

.term-text {
  color: var(--text);
}

.term-muted {
  color: var(--text-muted);
}

/* Sidebar */
.terminal-sidebar {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  z-index: 50;
  border-radius: 0;
  border-right: none;
  border-top: none;
  border-bottom: none;
  transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
}

.terminal-sidebar .terminal-window-body {
  max-height: 100vh;
  overflow-y: auto;
  padding-top: 3rem;
}

.terminal-sidebar.terminal-collapsed {
  transform: translateX(calc(100% - 32px));
}

/* Minimize button */
.terminal-minimize {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 4px;
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.15rem 0.4rem;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.terminal-minimize:hover {
  border-color: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.terminal-sidebar.terminal-collapsed .terminal-minimize {
  right: -36px;
  border-left: none;
  border-radius: 0 4px 4px 0;
  background: var(--surface);
}

/* Scrollbar */
.terminal-body-interactive::-webkit-scrollbar,
.terminal-sidebar .terminal-window-body::-webkit-scrollbar {
  width: 4px;
}

.terminal-body-interactive::-webkit-scrollbar-track,
.terminal-sidebar .terminal-window-body::-webkit-scrollbar-track {
  background: transparent;
}

.terminal-body-interactive::-webkit-scrollbar-thumb,
.terminal-sidebar .terminal-window-body::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 2px;
}

@media (max-width: 768px) {
  .terminal-sidebar {
    width: 100%;
    max-width: 100%;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "style: add terminal input, sidebar, and command output styles"
```

---

### Task 4: Wire homepage

**Files:**
- Modify: `src/components/HeroDashboard.jsx`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Update HeroDashboard.jsx**

```jsx
import ParticleField from './ParticleField';
import Terminal from '../terminal/Terminal';

export default function HeroDashboard({ projectCount = 0, postCount = 0, searchData = [] }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <div className="hero-content">
        <Terminal
          page="/home"
          projectCount={projectCount}
          postCount={postCount}
          searchData={searchData}
          side={false}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update index.astro to generate searchData**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroDashboard from '../components/HeroDashboard';

const projects = await getCollection('projects');
const posts = await getCollection('blog');
const projectCount = projects.length;
const postCount = posts.length;

const searchData = [
  ...posts.map(p => ({ title: p.data.title, slug: p.slug, path: `/blog/${p.slug}`, type: 'blog' })),
  ...projects.map(p => ({ title: p.data.title, slug: p.slug, path: `/projects/${p.slug}`, type: 'projects' })),
];
---

<BaseLayout title="Home" description="Bryan Ward - CS student and developer">
  <HeroDashboard projectCount={projectCount} postCount={postCount} searchData={searchData} client:load />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroDashboard.jsx src/pages/index.astro
git commit -m "feat: wire interactive terminal to homepage with search data"
```

---

### Task 5: Wire sidebar terminal to subpages

**Files:**
- Modify: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/blog/index.astro`
- Modify: `src/pages/blog/[...slug].astro`
- Modify: `src/pages/projects/index.astro`
- Modify: `src/pages/projects/[...slug].astro`
- Modify: `src/layouts/BlogPost.astro`
- Modify: `src/layouts/ProjectPage.astro`

- [ ] **Step 1: Update BaseLayout.astro**

Add showTerminal prop and Terminal import. The updated frontmatter and body:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Terminal from '../terminal/Terminal';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
  showTerminal?: boolean;
  terminalPage?: string;
  projectCount?: number;
  postCount?: number;
}

const {
  title,
  description,
  showTerminal = false,
  terminalPage = '/home',
  projectCount = 0,
  postCount = 0,
} = Astro.props;
const fullTitle = `${title} | Bryan Ward`;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description || "Bryan Ward - CS student and developer"} />
    <title>{fullTitle}</title>
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  </head>
  <body>
    <Nav />
    <main>
      <slot />
    </main>
    <Footer />
    {showTerminal && (
      <Terminal
        page={terminalPage}
        projectCount={projectCount}
        postCount={postCount}
        side={true}
        defaultOpen={true}
        client:load
      />
    )}
  </body>
</html>

<style is:global>
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  main {
    flex: 1;
  }
</style>
```

- [ ] **Step 2: Update blog/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

const posts = await getCollection('blog');
const sortedPosts = posts.sort(
  (a, b) => b.data.date.getTime() - a.data.date.getTime()
);

const latestPost = sortedPosts[0];
const { Content } = await latestPost.render();
---

<BlogPost
  title={latestPost.data.title}
  description={latestPost.data.description}
  date={latestPost.data.date}
  tags={latestPost.data.tags}
  showTerminal={true}
  terminalPage="/blog"
  postCount={sortedPosts.length}
>
  <Content />
</BlogPost>
```

- [ ] **Step 3: Update blog/[...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import BlogPost from '../../layouts/BlogPost.astro';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPost
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
  showTerminal={true}
  terminalPage={`/blog/${post.slug}`}
>
  <Content />
</BlogPost>
```

- [ ] **Step 4: Update BlogPost.astro to forward props**

Replace the frontmatter interface and BaseLayout call in `src/layouts/BlogPost.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import BlogSidebar from '../components/BlogSidebar.astro';
import Tag from '../components/Tag.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags?: string[];
  showTerminal?: boolean;
  terminalPage?: string;
  postCount?: number;
}

const { title, description, date, tags, showTerminal = false, terminalPage = '', postCount = 0 } = Astro.props;
---

<BaseLayout
  title={title}
  description={description}
  showTerminal={showTerminal}
  terminalPage={terminalPage}
  postCount={postCount}
>
  <div class="blog-layout">
    <BlogSidebar />
    <article class="blog-content">
```

Keep everything after `<article class="blog-content">` unchanged from the existing file.

- [ ] **Step 5: Update projects/index.astro**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectList from '../../components/ProjectList.astro';

const allProjects = await getCollection('projects');
const projects = allProjects.sort((a, b) => {
  if (a.data.featured && !b.data.featured) return -1;
  if (!a.data.featured && b.data.featured) return 1;
  return b.data.date.getTime() - a.data.date.getTime();
});
---

<BaseLayout
  title="Projects"
  description="Projects I've built"
  showTerminal={true}
  terminalPage="/projects"
  projectCount={projects.length}
>
  <div class="projects-page">
    <h1>Projects</h1>
    <p class="subtitle">Things I've built.</p>
    <ProjectList projects={projects} />
  </div>
</BaseLayout>

<style>
  .projects-page {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 1.5rem;
  }

  .projects-page h1 {
    margin-bottom: 0.25rem;
  }

  .subtitle {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
</style>
```

- [ ] **Step 6: Update projects/[...slug].astro**

```astro
---
import { getCollection } from 'astro:content';
import ProjectPage from '../../layouts/ProjectPage.astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
const { Content } = await project.render();
---

<ProjectPage
  title={project.data.title}
  description={project.data.description}
  date={project.data.date}
  tags={project.data.tags}
  url={project.data.url}
  repo={project.data.repo}
  showTerminal={true}
  terminalPage={`/projects/${project.slug}`}
>
  <Content />
</ProjectPage>
```

- [ ] **Step 7: Update ProjectPage.astro to forward props**

Replace the frontmatter interface and BaseLayout call in `src/layouts/ProjectPage.astro`:

```astro
---
import BaseLayout from './BaseLayout.astro';
import Tag from '../components/Tag.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  url?: string;
  repo?: string;
  showTerminal?: boolean;
  terminalPage?: string;
  projectCount?: number;
}

const { title, description, date, tags, url, repo, showTerminal = false, terminalPage = '', projectCount = 0 } = Astro.props;
---

<BaseLayout
  title={title}
  description={description}
  showTerminal={showTerminal}
  terminalPage={terminalPage}
  projectCount={projectCount}
>
  <div class="project-page">
    <header class="project-header">
```

Keep everything after `<header class="project-header">` unchanged from the existing file.

- [ ] **Step 8: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/blog/index.astro src/pages/blog/\[...slug\].astro src/pages/projects/index.astro src/pages/projects/\[...slug\].astro src/layouts/BlogPost.astro src/layouts/ProjectPage.astro
git commit -m "feat: add sidebar terminal to all subpages"
```

---

### Task 6: Build and verify

**Files:**
- No file changes

- [ ] **Step 1: Build**

```bash
npm run build
```
Expected: Build completes without errors.

- [ ] **Step 2: Verify no FastfetchWindow references remain**

```bash
git grep -n "FastfetchWindow" -- '*.jsx' '*.astro'
```
Expected: No matches.

- [ ] **Step 3: Verify terminal directory structure**

```bash
ls src/terminal/
```
Expected: CommandRegistry.js, commands.js, Terminal.jsx
