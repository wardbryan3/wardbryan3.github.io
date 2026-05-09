# Tux Terminal Simulation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite TuxWireframe to simulate a terminal session: prompt types out, then command, then ASCII art output — all within the existing panel structure.

**Architecture:** Single-component change. TuxWireframe gets a sequential state machine (prompt → command → art → final prompt) with chunk-based typewriter animation. CSS simplified — no centering, no glow, no scanlines. Font size inherits from `.terminal-panel` (0.75rem).

**Tech Stack:** React, CSS

---

### Task 1: Rewrite TuxWireframe component

**Files:**
- Modify: `src/components/TuxWireframe.jsx` (full rewrite)

- [ ] **Step 1: Write the new component**

Replace the entire file with the terminal-simulation component:

```jsx
import { useEffect, useState } from 'react';

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

export default function TuxWireframe() {
  const [phase, setPhase] = useState('prompt');
  const [prompt, setPrompt] = useState('');
  const [command, setCommand] = useState('');
  const [art, setArt] = useState('');

  useEffect(() => {
    if (phase !== 'prompt') return;
    const text = '$ ';
    let i = 0;
    const timer = setInterval(() => {
      i++;
      setPrompt(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('command'), 300);
      }
    }, 60);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'command') return;
    const text = 'cat /usr/share/ascii/tux.txt';
    let i = 0;
    const timer = setInterval(() => {
      const chunk = Math.floor(Math.random() * 3) + 1;
      i = Math.min(i + chunk, text.length);
      setCommand(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('art'), 400);
      }
    }, 30);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'art') return;
    const chars = TUX_ART.split('');
    let i = 0;
    const timer = setInterval(() => {
      const chunk = Math.floor(Math.random() * 8) + 4;
      i = Math.min(i + chunk, chars.length);
      setArt(chars.slice(0, i).join(''));
      if (i >= chars.length) {
        clearInterval(timer);
        setTimeout(() => setPhase('done'), 500);
      }
    }, 2);
    return () => clearInterval(timer);
  }, [phase]);

  return (
    <div className="terminal-panel">
      <div className="panel-header">cat /usr/share/ascii/tux.txt</div>
      <div className="panel-body tux-body">
        <div className="tux-terminal">
          <div className="tux-line">
            {prompt}{command}
            {(phase === 'prompt' || phase === 'command') && (
              <span className="tux-cursor">█</span>
            )}
          </div>
          {(phase === 'art' || phase === 'done') && (
            <>
              <div className="tux-line">&nbsp;</div>
              <pre className="tux-art">
                {art}
                {phase === 'art' && <span className="tux-cursor">█</span>}
              </pre>
            </>
          )}
          {phase === 'done' && (
            <div className="tux-line tux-prompt-line">
              user@archie:~${' '}
              <span className="tux-cursor">█</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build check**

Run: `npm run build`
Expected: 0 errors, 0 warnings, build completes

---

### Task 2: Simplify tux CSS

**Files:**
- Modify: `src/styles/global.css` (lines 402-424)

- [ ] **Step 1: Replace tux CSS rules**

Replace the current `.tux-body`, `.tux-art`, and `.tux-cursor` rules with simplified versions:

```css
.tux-body {
  padding: 0.75rem;
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

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: 0 errors, 0 warnings, build completes

---

### Task 3: Verify in browser

- [ ] **Step 1: Start dev server and check**

Run: `npm run dev`
Open in browser. Verify:
- Tux panel shows prompt typing, then command, then art
- No extra border/outline around the art
- Cursor blinks at correct positions
- Final prompt line appears after art completes
- Panel matches other panels visually (same border, same font size)

- [ ] **Step 2: Check responsive layout**

Resize to mobile widths. Verify dashboard grid reflows correctly.
