# Fastfetch Hero Window Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the multi-panel hero with a single terminal window that animates open, types a fastfetch-style system info display, and has only one blinking cursor.

**Architecture:** One new component (`FastfetchWindow`) renders inside the reworked `HeroDashboard`. ParticleField stays as the full-screen background. Seven old components are deleted. The component uses a React phase state machine (`growing` → `prompt` → `command` → `output` → `done`) with CSS animation for the window grow and setInterval-based character-by-character typing.

**Tech Stack:** React (client:load), Astro, CSS animations, no new dependencies

---

### Task 1: Delete old components and remove Nav cursor

**Files:**
- Delete: `src/components/DashboardGrid.jsx`
- Delete: `src/components/InfoPanel.jsx`
- Delete: `src/components/StatsPanel.jsx`
- Delete: `src/components/SkillsPanel.jsx`
- Delete: `src/components/LinksPanel.jsx`
- Delete: `src/components/TitleOverlay.jsx`
- Delete: `src/components/TuxWireframe.jsx`
- Modify: `src/components/Nav.astro:13-15`

- [ ] **Step 1: Delete the 7 old component files**

Run:
```bash
rm src/components/DashboardGrid.jsx src/components/InfoPanel.jsx src/components/StatsPanel.jsx src/components/SkillsPanel.jsx src/components/LinksPanel.jsx src/components/TitleOverlay.jsx src/components/TuxWireframe.jsx
```

- [ ] **Step 2: Remove the blinking cursor from Nav.astro**

The logo currently shows `bryan@ward_` with a blinking cursor. Remove the cursor `<span>` and its associated CSS.

In `src/components/Nav.astro`, replace:
```astro
    <a href="/" class="logo">
      <span class="prompt">bryan@ward</span>
      <span class="cursor" aria-hidden="true">_</span>
    </a>
```
with:
```astro
    <a href="/" class="logo">
      <span class="prompt">bryan@ward</span>
    </a>
```

And in the `<style>` block, remove these CSS rules (the `.logo .cursor` block, lines 68-75):
```css
  .logo .cursor {
    display: inline-block;
    width: 0.5em;
    height: 1em;
    background: var(--accent);
    animation: blink 1s step-end infinite;
    vertical-align: text-bottom;
  }
```

The `.logo` rule also has `gap: 0.25rem` and `display: flex` which are no longer needed. Replace:
```css
  .logo {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--accent);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
  }
```
with:
```css
  .logo {
    font-family: var(--font-mono);
    font-size: 1rem;
    color: var(--accent);
    text-decoration: none;
    cursor: pointer;
  }
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "refactor: remove old hero panels and nav cursor"
```

---

### Task 2: Clean up global CSS — remove old styles, add new ones

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Remove old component-specific CSS classes**

Delete the following sections from `src/styles/global.css`:

Lines 131-197: `.hero-dashboard` through `.hero-subtitle`
Lines 199-214: `.dashboard-grid` through `.grid-area-*`
Lines 248-273: `.info-table` through `.info-value-accent`
Lines 274-298: `.stats-grid` through `.stat-label`
Lines 300-321: `.skills-wrap` through `.skill-tag`
Lines 323-371: `.links-list` through `.prompt-cursor`
Lines 373-399: Both `@media` blocks referencing `.dashboard-grid`
Lines 400-427: `.tux-terminal` through `.tux-prompt-line`

Also remove the generic `.cursor` class (lines 122-129) since the only cursor is now inside FastfetchWindow.

The `.hero-dashboard` rule at lines 131-141 should be **kept** but simplified (it's the container for ParticleField + FastfetchWindow). We'll update it in Task 5.

For now, delete:
```css
.cursor {
  display: inline-block;
  width: 0.6em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title-overlay {
  text-align: center;
}

.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--accent);
  text-shadow:
    0 0 10px var(--accent-glow),
    0 0 40px var(--accent-glow),
    0 0 80px rgba(0, 255, 102, 0.15);
  letter-spacing: 0.15em;
  margin-bottom: 0.25rem;
  position: relative;
  display: inline-block;
  transition: text-shadow 0.3s;
}

.hero-title:hover {
  text-shadow:
    0 0 10px var(--accent-glow),
    0 0 40px var(--accent-glow),
    0 0 80px rgba(0, 255, 102, 0.2),
    0 0 120px rgba(0, 255, 102, 0.1);
}

.hero-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 0.1em;
}

.hero-subtitle {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0.75rem;
  width: 100%;
  grid-template-areas:
    "info tux stats"
    "skills skills links";
}

.grid-area-info { grid-area: info; }
.grid-area-tux { grid-area: tux; }
.grid-area-stats { grid-area: stats; }
.grid-area-skills { grid-area: skills; }
.grid-area-links { grid-area: links; }

.terminal-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.terminal-panel:hover {
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(0, 255, 102, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--accent);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-body {
  padding: 0.75rem;
  line-height: 1.6;
}


.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 0.2rem 0;
  vertical-align: top;
}

.info-label {
  color: var(--accent);
  padding-right: 0.75rem;
  white-space: nowrap;
}

.info-value {
  color: var(--text);
}

.info-value-accent {
  color: var(--accent);
  text-shadow: 0 0 4px var(--accent-glow);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skill-tag {
  display: inline-block;
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 9999px;
  color: var(--text);
  background: var(--surface-hover);
  transition: border-color 0.2s, color 0.2s, text-shadow 0.2s;
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-shadow: 0 0 4px var(--accent-glow);
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.link-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text);
  text-decoration: none;
  transition: color 0.2s;
}

.link-item:hover {
  color: var(--accent);
}

.link-label {
  color: var(--accent);
  min-width: 2.5rem;
}

.links-prompt {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.prompt-symbol {
  color: var(--accent);
}

.prompt-text {
  color: var(--text-muted);
}

.prompt-cursor {
  display: inline-block;
  width: 0.4em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}

@media (max-width: 768px) {
  .hero-dashboard {
    padding: 3rem 1rem 1.5rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "info stats"
      "tux tux"
      "skills skills"
      "links links";
  }

}

@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "info"
      "stats"
      "tux"
      "skills"
      "links";
  }
}

.tux-terminal {
  font-family: var(--font-mono);
  font-size: inherit;
  line-height: 1.6;
}

.tux-line {
  min-height: 1.2em;
}

.tux-art {
  font-family: var(--font-mono);
  font-size: inherit;
  line-height: 1.0;
  color: var(--accent);
  white-space: pre;
  margin: 0;
}

.tux-cursor {
  color: var(--accent);
  animation: blink 0.8s step-end infinite;
}

.tux-prompt-line {
  color: var(--text-muted);
}
```

- [ ] **Step 2: Add new window-grow animation and terminal-window styles**

After the `@keyframes blink` block (around line 120), add:

```css
@keyframes window-grow {
  0%   { transform: scaleY(0.02) scaleX(0.1); opacity: 0; }
  60%  { transform: scaleY(1.05) scaleX(1.05); opacity: 1; }
  100% { transform: scaleY(1)    scaleX(1);    opacity: 1; }
}

.terminal-window {
  background: var(--surface);
  border: 1px solid var(--accent);
  border-radius: 6px;
  overflow: hidden;
  font-family: var(--font-mono);
  min-height: 300px;
  transform-origin: bottom center;
}

.terminal-window.growing {
  animation: window-grow 400ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.terminal-window-body {
  padding: 1.25rem;
  line-height: 1.6;
}

.ff-output {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  font-size: 0.8rem;
}

.ff-tux {
  flex-shrink: 0;
  font-size: 0.65rem;
  line-height: 1.0;
  color: var(--accent);
  white-space: pre;
  margin: 0;
}

.ff-fields {
  flex: 1;
  min-width: 0;
}

.ff-line {
  white-space: pre;
}

.ff-key {
  color: var(--text-muted);
}

.ff-value {
  color: var(--text);
}

.ff-value-green {
  color: var(--accent);
  text-shadow: 0 0 4px var(--accent-glow);
}

.ff-value-purple {
  color: var(--primary);
  text-shadow: 0 0 4px var(--primary-glow);
}

.ff-value-link {
  color: #4488ff;
  text-decoration: none;
}

.ff-value-link:hover {
  text-shadow: 0 0 6px rgba(68, 136, 255, 0.5);
}

.ff-prompt {
  margin-top: 0.75rem;
  color: var(--text-muted);
}

.ff-cursor {
  display: inline-block;
  width: 0.55em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
}

.ff-command {
  color: var(--text);
}

@media (max-width: 480px) {
  .ff-tux {
    display: none;
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "style: replace dashboard styles with fastfetch window styles"
```

---

### Task 3: Create FastfetchWindow component

**Files:**
- Create: `src/components/FastfetchWindow.jsx`

- [ ] **Step 1: Write the component**

Create `src/components/FastfetchWindow.jsx`:

```jsx
import { useEffect, useState, useRef } from 'react';

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

function buildFieldSegments(fields) {
  const segments = [];
  const maxKeyLen = Math.max(...fields.map(f => f.key.length));
  const padLen = maxKeyLen + 5;
  for (let fi = 0; fi < fields.length; fi++) {
    const f = fields[fi];
    const paddedKey = f.key.padEnd(padLen, ' ');
    for (let ci = 0; ci < paddedKey.length; ci++) {
      segments.push({ fieldIdx: fi, part: 'key', char: paddedKey[ci], color: 'key' });
    }
    for (let ci = 0; ci < f.value.length; ci++) {
      segments.push({ fieldIdx: fi, part: 'value', char: f.value[ci], color: f.cls });
    }
    if (fi < fields.length - 1) {
      segments.push({ fieldIdx: -1, part: 'newline', char: '\n', color: null });
    }
  }
  return segments;
}

export default function FastfetchWindow({ projectCount = 0, postCount = 0 }) {
  const [phase, setPhase] = useState('growing');
  const [commandText, setCommandText] = useState('');
  const [outputIndex, setOutputIndex] = useState(0);

  const fieldsRef = useRef(buildFields(projectCount, postCount));
  const tuxCharsRef = useRef(TUX_ART.split(''));
  const fieldSegmentsRef = useRef(buildFieldSegments(fieldsRef.current));
  const maxOutputRef = useRef(Math.max(
    tuxCharsRef.current.length,
    fieldSegmentsRef.current.filter(s => s.part !== 'newline').length
  ));

  // Phase: growing → prompt (after CSS animation completes)
  useEffect(() => {
    const timer = setTimeout(() => setPhase('prompt'), 450);
    return () => clearTimeout(timer);
  }, []);

  // Phase: prompt → command
  useEffect(() => {
    if (phase !== 'prompt') return;
    const timer = setTimeout(() => setPhase('command'), 600);
    return () => clearTimeout(timer);
  }, [phase]);

  // Phase: command — type "fastfetch"
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

  // Phase: output — type tux + fields simultaneously
  useEffect(() => {
    if (phase !== 'output') return;
    const max = maxOutputRef.current;
    let i = 0;
    let doneTimer;
    const timer = setInterval(() => {
      i += 3;
      setOutputIndex(Math.min(i, max));
      if (i >= max) {
        clearInterval(timer);
        doneTimer = setTimeout(() => setPhase('done'), 400);
      }
    }, 12);
    return () => {
      clearInterval(timer);
      clearTimeout(doneTimer);
    };
  }, [phase]);

  // Build visible tux art
  const tuxChars = tuxCharsRef.current;
  const visibleTux = outputIndex < tuxChars.length
    ? tuxChars.slice(0, outputIndex).join('')
    : TUX_ART;

  // Build visible field parts (computed each render based on outputIndex)
  const fieldSegments = fieldSegmentsRef.current;
  const visibleFieldParts = [];
  let segCount = 0;
  for (const seg of fieldSegments) {
    const before = segCount;
    segCount += seg.char.length;
    if (before >= outputIndex) break;
    if (seg.part === 'newline') {
      visibleFieldParts.push({ ...seg, visible: segCount <= outputIndex });
    } else {
      const avail = Math.max(0, Math.min(seg.char.length, outputIndex - before));
      visibleFieldParts.push({ ...seg, char: seg.char.slice(0, avail), visible: avail > 0 });
    }
    if (segCount >= outputIndex) break;
  }

  const showCursor = phase === 'prompt' || phase === 'command';

  return (
    <div className={`terminal-window ${phase === 'growing' ? 'growing' : ''}`}>
      <div className="terminal-window-body">
        {/* Prompt + command line */}
        <div className="ff-line">
          <span className="ff-prompt">bryan@ward:~$ </span>
          {(phase === 'command' || phase === 'output' || phase === 'done') && (
            <span className="ff-command">{commandText || 'fastfetch'}</span>
          )}
          {showCursor && <span className="ff-cursor">&nbsp;</span>}
        </div>

        {/* Output: tux + fields */}
        {(phase === 'output' || phase === 'done') && (
          <div className="ff-output">
            <pre className="ff-tux">{visibleTux}</pre>
            <div className="ff-fields">
              {visibleFieldParts.map((seg, i) => {
                if (seg.part === 'newline') {
                  return seg.visible ? <br key={i} /> : null;
                }
                if (!seg.char) return null;
                let cls = 'ff-value';
                if (seg.color === 'green') cls += ' ff-value-green';
                else if (seg.color === 'purple') cls += ' ff-value-purple';
                else if (seg.color === 'link') cls += ' ff-value-link';
                else if (seg.color === 'key') cls = 'ff-key';

                if (seg.color === 'link' && seg.fieldIdx >= 0) {
                  const field = fieldsRef.current[seg.fieldIdx];
                  return (
                    <a key={i} href={field.href} target="_blank" rel="noopener noreferrer" className={cls}>
                      {seg.char}
                    </a>
                  );
                }
                return <span key={i} className={cls}>{seg.char}</span>;
              })}
            </div>
          </div>
        )}

        {/* Final prompt */}
        {phase === 'done' && (
          <div className="ff-prompt" style={{ marginTop: '0.75rem' }}>
            bryan@ward:~${' '}
            <span className="ff-cursor">&nbsp;</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the file was created**

Run: `ls -la src/components/FastfetchWindow.jsx`

- [ ] **Step 3: Commit**

```bash
git add src/components/FastfetchWindow.jsx
git commit -m "feat: add FastfetchWindow component with grow + type animations"
```

---

### Task 4: Rework HeroDashboard to use FastfetchWindow

**Files:**
- Modify: `src/components/HeroDashboard.jsx`

- [ ] **Step 1: Replace HeroDashboard content**

Replace the entire contents of `src/components/HeroDashboard.jsx`:

```jsx
import ParticleField from './ParticleField';
import FastfetchWindow from './FastfetchWindow';

export default function HeroDashboard({ projectCount = 0, postCount = 0 }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <div className="hero-content">
        <FastfetchWindow projectCount={projectCount} postCount={postCount} />
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Update the hero-content CSS to center the window**

In `src/styles/global.css`, find the `.hero-dashboard` rule (which should still be there from the earlier cleanup) and ensure it provides a centered container. If the `.hero-content` class was deleted in Task 2, re-add it:

```css
.hero-dashboard {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  isolation: isolate;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 780px;
  padding: 0 1rem;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroDashboard.jsx src/styles/global.css
git commit -m "refactor: use FastfetchWindow in HeroDashboard"
```

---

### Task 5: Build and verify

**Files:**
- No file changes, verification only

- [ ] **Step 1: Build the project**

Run:
```bash
npm run build
```
Expected: Build completes without errors. No broken imports from deleted components.

- [ ] **Step 2: Check for any remaining import references to deleted components**

Run:
```bash
git grep -n -E "DashboardGrid|InfoPanel|StatsPanel|SkillsPanel|LinksPanel|TitleOverlay|TuxWireframe" -- '*.jsx' '*.astro' '*.ts' '*.tsx'
```
Expected: No matches (empty output).

- [ ] **Step 3: Run typecheck if available**

Run:
```bash
npm run typecheck 2>/dev/null || echo "no typecheck script"
```

- [ ] **Step 4: Commit any cleanup**

If build succeeded and no broken references found:
```bash
git add -A
git diff --cached --stat
git commit -m "chore: verify build after fastfetch hero redesign"
```
Only commit if there are actual changes from verification.
