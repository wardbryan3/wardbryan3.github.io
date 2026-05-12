# Portfolio OS Bug Fixes & Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all identified bugs and code quality issues in the Portfolio OS codebase without changing visual appearance or behavior.

**Architecture:** 7 grouped tasks organized by file/dependency, running from safe file deletions through targeted bug fixes to shared hook extraction. Each task is self-contained and independently committable.

**Tech Stack:** Astro 5, React 19, Zustand 5, Three.js (wallpapers)

---

### Task 1: Delete unused Bootstrap icon directory

**Files:**
- Delete: `public/img/icons-main/` (entire directory tree)

**Context:** The `public/img/icons-main/` directory contains ~2,000 Bootstrap SVG icon files plus font files. The project uses 18 custom icons from `public/img/icons/` instead. This directory is never referenced by any code.

- [ ] **Step 1: Verify the directory is not referenced anywhere**

Run:
```bash
grep -r "icons-main" /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/src/ /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/public/ --include="*.{astro,jsx,js,ts,tsx,css,html}" 2>/dev/null | grep -v node_modules | grep -v ".worktrees" || echo "No references found"
```
Expected: "No references found"

- [ ] **Step 2: Delete the directory**

Run:
```bash
rm -rf /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/public/img/icons-main
```

Verify:
```bash
ls /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/public/img/icons-main 2>&1 || echo "Directory removed"
```

- [ ] **Step 3: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "chore: remove unused Bootstrap icon directory (20k files)"
```

---

### Task 2: Replace TrashWindow emoji with SVG icons

**Files:**
- Modify: `src/components/TrashWindow.jsx:58,76`

**Context:** AGENTS.md prohibits emoji in code. TrashWindow uses two Unicode emoji characters (`\uD83D\uDCC4` as a file icon and `\uD83D\uDDD1` as an empty-trash icon). Replace with the standard SVG folder icon and a trash SVG that already exist in `public/img/icons/`.

- [ ] **Step 1: Verify the SVG icons exist**

Run:
```bash
ls /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/public/img/icons/folder.svg /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen/public/img/icons/trash.svg
```
Expected: Both files exist.

- [ ] **Step 2: Replace emoji in TrashWindow.jsx**

In `src/components/TrashWindow.jsx`, replace the two emoji usages with `<img>` tags:

```jsx
// Line 58 — file list item icon
// Change from:
<span>{'\uD83D\uDCC4'}</span>
// To:
<img src="/img/icons/folder.svg" style={{ width: '14px', height: '14px', verticalAlign: 'middle' }} alt="" />

// Lines 72-77 — empty trash icon
// Change from:
<div style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5, }}>{'\uD83D\uDDD1'}</div>
// To:
<img src="/img/icons/trash.svg" style={{ width: '36px', height: '36px', marginBottom: '8px', opacity: 0.5, display: 'block', margin: '0 auto 8px' }} alt="" />

```

- [ ] **Step 3: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "refactor: replace emoji with SVG icons in TrashWindow"
```

---

### Task 3: Fix AppBar auto-hide timer shadowing

**Files:**
- Modify: `src/components/AppBar.jsx:20-41`

**Context:** The AppBar has a `showTimer` on line 21 that auto-hides after 3 seconds. The `handleMouseMove` handler shadows this variable with a local `hideTimer`, and `clearTimeout(showTimer)` on line 30 references the outer timer that's already resolved. The `hideTimer` declared on line 22 is never used by the initial auto-hide logic.

The fix: use a single ref-based approach for all timers so they don't shadow each other.

- [ ] **Step 1: Rewrite the auto-hide useEffect**

Replace lines 20-41 in `src/components/AppBar.jsx`:

Old:
```jsx
const [visible, setVisible] = useState(true);

useEffect(() => {
    const showTimer = setTimeout(() => setVisible(false), 3000);
    let hideTimer;
    const handleMouseMove = (e) => {
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 50;
      const sectionBottom = window.innerHeight - footerHeight;
      if (e.clientY >= sectionBottom - 30) {
        setVisible(true);
        clearTimeout(hideTimer);
        clearTimeout(showTimer);
      } else if (e.clientY < sectionBottom - 80) {
        hideTimer = setTimeout(() => setVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(hideTimer);
      clearTimeout(showTimer);
    };
  }, []);
```

New:
```jsx
const [visible, setVisible] = useState(true);
const timersRef = useRef({});

useEffect(() => {
    const t = timersRef.current;
    t.initialHide = setTimeout(() => setVisible(false), 3000);

    const handleMouseMove = (e) => {
      const footer = document.querySelector('footer');
      const footerHeight = footer ? footer.offsetHeight : 50;
      const sectionBottom = window.innerHeight - footerHeight;
      if (e.clientY >= sectionBottom - 30) {
        setVisible(true);
        clearTimeout(t.mouseLeave);
        clearTimeout(t.initialHide);
      } else if (e.clientY < sectionBottom - 80) {
        clearTimeout(t.mouseLeave);
        t.mouseLeave = setTimeout(() => setVisible(false), 500);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(t.initialHide);
      clearTimeout(t.mouseLeave);
    };
  }, []);
```

- [ ] **Step 2: Add `useRef` import**

Add `useRef` to the React import on line 1:

```jsx
import { useOSStore } from '../stores/osStore';
import { useState, useEffect, useRef } from 'react';
```

- [ ] **Step 3: Build check**

Run:
```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -5
```
Expected: No type errors, or no new type errors.

- [ ] **Step 4: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "fix: AppBar auto-hide timer variable shadowing"
```

---

### Task 4: Fix BootScreen timer and listener leak

**Files:**
- Modify: `src/components/BootScreen.astro:43-98`

**Context:** The `<script>` block in BootScreen.astro creates `postTimer` and adds event listeners (`keydown`, `boot:bios-yes`) that are never cleaned up. If the component unmounts before timers fire, they'll try to manipulate detached DOM.

The `<script>` is a plain inline script (not a React effect), so cleanup needs to happen via returning `removeEventListener` calls isn't natively supported. Instead, we'll use the `beforeunload` event and structure the code so it's safe even after unmount. Specifically:
- Null-check DOM elements before accessing them
- Track whether the boot sequence is still active with a flag

- [ ] **Step 1: Add safety guards to the boot script**

Replace the `<script>` block in `src/components/BootScreen.astro` (lines 43-99) with this version:

```html
<script>
(function() {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (isMobile) return;

  let phase = 'press-del';
  let alive = true;

  function getOverlay() {
    return document.getElementById('boot-overlay');
  }
  function getPost() {
    return document.getElementById('boot-post');
  }
  function getLoading() {
    return document.getElementById('loading-screen');
  }

  function showLoading() {
    if (!alive) return;
    phase = 'loading';
    const overlay = getOverlay();
    const postScreen = getPost();
    const loadingScreen = getLoading();
    if (!overlay || !postScreen || !loadingScreen) return;
    clearTimeout(postTimer);
    overlay.style.display = 'flex';
    postScreen.style.display = 'none';
    loadingScreen.style.display = 'flex';

    const biosEl = document.querySelector('.bios-overlay');
    if (biosEl) biosEl.remove();

    setTimeout(() => {
      if (!alive) return;
      phase = 'done';
      overlay.classList.add('boot-hidden');
      setTimeout(() => {
        if (!alive) return;
        overlay.style.display = 'none';
      }, 500);
    }, 1500);
  }

  let postTimer;

  function startBootSequence() {
    postTimer = setTimeout(() => {
      if (phase === 'press-del' && alive) {
        showLoading();
      }
    }, 1000);

    const onDel = function onDel(e) {
      if (phase === 'press-del' && e.key === 'Delete') {
        e.preventDefault();
        phase = 'bios';
        clearTimeout(postTimer);
        const overlay = getOverlay();
        if (overlay) overlay.style.display = 'none';
        document.dispatchEvent(new CustomEvent('boot:show-bios'));
      }
    };

    const onBiosYes = function onBiosYes() {
      if (phase !== 'bios') return;
      showLoading();
    };

    document.addEventListener('keydown', onDel);
    document.addEventListener('boot:bios-yes', onBiosYes);

    document.addEventListener('beforeunload', function cleanup() {
      alive = false;
      clearTimeout(postTimer);
      document.removeEventListener('keydown', onDel);
      document.removeEventListener('boot:bios-yes', onBiosYes);
    });
  }

  startBootSequence();
})();
</script>
```

- [ ] **Step 2: Build check**

```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -5
```
Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "fix: BootScreen timer and event listener leak on unmount"
```

---

### Task 5: Fix MediaPlayerWindow stale setTimeout

**Files:**
- Modify: `src/components/MediaPlayerWindow.jsx:51-55`

**Context:** The `handleShuffle` function calls `setTimeout(() => setQuote(null), 4000)` with no cleanup. If the component unmounts within 4 seconds, the callback fires on an unmounted component.

- [ ] **Step 1: Add cleanup ref for the shuffle timer**

In `src/components/MediaPlayerWindow.jsx`, add a ref after the state declarations (after line 23):

```jsx
const shuffleTimerRef = useRef(null);
```

Add `useRef` to the React import on line 1:

```jsx
import { useState, useEffect, useRef } from 'react';
```

- [ ] **Step 2: Update `handleShuffle` to track and clean up the timer**

Replace lines 51-55 (the `handleShuffle` function):

```jsx
const handleShuffle = () => {
    clearTimeout(shuffleTimerRef.current);
    const q = SHUFFLE_QUOTES[Math.floor(Math.random() * SHUFFLE_QUOTES.length)];
    setQuote(q);
    shuffleTimerRef.current = setTimeout(() => setQuote(null), 4000);
};
```

- [ ] **Step 3: Add useEffect cleanup on unmount**

Add after the existing `useEffect` block (after line 49):

```jsx
useEffect(() => {
    return () => clearTimeout(shuffleTimerRef.current);
}, []);
```

- [ ] **Step 4: Build check**

```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -5
```
Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "fix: MediaPlayerWindow stale setTimeout on unmount"
```

---

### Task 6: Extract shared useDraggable and useResizable hooks, fix Window stale closure

**Files:**
- Create: `src/hooks/useDraggable.js`
- Create: `src/hooks/useResizable.js`
- Modify: `src/components/Window.jsx:51-97` — use shared hooks, fix position closure bug
- Modify: `src/terminal/Terminal.jsx:96-128,188-200` — use shared hooks

**Context:** `Window.jsx` and `Terminal.jsx` have independent drag and resize implementations with subtle bugs:
- `Window.jsx` `handleResizeStart` captures `win.position` in its closure via deps, so dragging before resizing uses stale coordinates
- `Terminal.jsx` uses always-active global listeners (checking refs), while `Window.jsx` adds/removes listeners per drag — two patterns for the same thing

Extract shared `useDraggable` and `useResizable` hooks that both components consume.

- [ ] **Step 1: Create `src/hooks/useDraggable.js`**

```jsx
import { useCallback, useEffect, useRef } from 'react';

export default function useDraggable({ onMove, constraints }) {
  const dragRef = useRef(null);

  const handleMouseDown = useCallback((e) => {
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: 0,
      origY: 0,
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const d = dragRef.current;
      if (!d) return;
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      let newX = d.origX + dx;
      let newY = d.origY + dy;
      if (constraints) {
        const clamped = constraints(newX, newY);
        newX = clamped.x;
        newY = clamped.y;
      }
      onMove(newX, newY);
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onMove, constraints]);

  const startDrag = useCallback((e, currentPos) => {
    if (dragRef.current) return;
    const d = dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: currentPos.x,
      origY: currentPos.y,
    };
    e.preventDefault();
  }, []);

  return { startDrag };
}
```

- [ ] **Step 2: Create `src/hooks/useResizable.js`**

```jsx
import { useCallback, useEffect, useRef } from 'react';

export default function useResizable({ onResize, minW = 280, minH = 200 }) {
  const resizeRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const r = resizeRef.current;
      if (!r) return;
      const newW = Math.max(minW, r.origW + (e.clientX - r.startX));
      const newH = Math.max(minH, r.origH + (e.clientY - r.startY));
      onResize(newW, newH);
    };
    const handleMouseUp = () => {
      resizeRef.current = null;
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, minW, minH]);

  const startResize = useCallback((e, currentPos, currentSize) => {
    resizeRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origW: currentSize.width || currentSize.w,
      origH: currentSize.height || currentSize.h,
      posX: currentPos.x,
      posY: currentPos.y,
    };
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return { startResize };
}
```

- [ ] **Step 3: Refactor Window.jsx to use the shared hooks**

In `src/components/Window.jsx`:

Add imports at top:
```jsx
import useDraggable from '../hooks/useDraggable';
import useResizable from '../hooks/useResizable';
```

Replace the `handleTitleMouseDown` function (lines 51-70) and `handleResizeStart` function (lines 72-97) and `clampPos` (lines 39-49) with:

```jsx
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
    focusWindow(id);
    startResize(e, { x: win.position.x, y: win.position.y }, { width: win.size.width, height: win.size.height });
  }, [id, win.position, win.size, focusWindow, startResize]);
```

Remove the old `dragStart`, `posStart` refs (lines 23-24) since they're no longer needed:

```jsx
  const dragStart = useRef(null);
  const posStart = useRef(null);
```

Remove `useRef` from the import if it's no longer used elsewhere, or keep it if `navH`/`footerH` refs still use it.

- [ ] **Step 4: Refactor Terminal.jsx drag to use useDraggable**

In `src/components/Terminal.jsx`:

Add import:
```jsx
import useDraggable from '../hooks/useDraggable';
import useResizable from '../hooks/useResizable';
```

Replace the `startDrag` function (lines 188-193) with:
```jsx
const { startDrag } = useDraggable({
    onMove: (x, y) => setPos({ x, y }),
    constraints: (x, y) => ({
      x: Math.max(MARGIN, Math.min(x, window.innerWidth - (size?.w || DEFAULT_W) - MARGIN)),
      y: Math.max(navRef.current + MARGIN, Math.min(y, window.innerHeight - (size?.h || DEFAULT_H) - footerRef.current - MARGIN)),
    }),
  });
```

Replace the `startResize` function (lines 195-200) with:
```jsx
const { startResize } = useResizable({
    onResize: (newW, newH) => {
      const maxW = window.innerWidth - (pos?.x || 0) - MARGIN;
      const maxH = window.innerHeight - (pos?.y || 0) - footerRef.current - MARGIN;
      setSize({ w: Math.min(newW, maxW), h: Math.min(newH, maxH) });
    },
    minW: 480,
    minH: 320,
  });
```

Update the titlebar `onMouseDown` to pass current position (line 468):
```jsx
<div className="terminal-titlebar" onMouseDown={(e) => {
    if (pos) startDrag(e, pos);
  }}>
```

Update the resize handle `onMouseDown` to pass current position and size (line 479):
```jsx
<div className="terminal-resize-handle" onMouseDown={(e) => {
    if (pos && size) startResize(e, pos, size);
  }} />
```

Remove the old `dragRef`, `resizeRef` refs (lines 53-54) and the global mousemove/mouseup useEffect (lines 96-128) since the hooks handle this now.

- [ ] **Step 5: Build check**

```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -10
```
Expected: No errors.

- [ ] **Step 6: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "refactor: extract useDraggable and useResizable hooks, fix Window resize stale closure"
```

---

### Task 7: Fix Terminal sessionStorage persistence and stale data

**Files:**
- Modify: `src/terminal/Terminal.jsx:36-45,329-334`

**Context:** Two issues:
1. Terminal persists `outputLines` to `sessionStorage` on every change. With long sessions, this writes increasingly large JSON blobs on every keystroke.
2. Cached `outputLines` are never invalidated when the `page` prop changes. Commands like `cd` reference `searchData` that may be stale.

- [ ] **Step 1: Debounce sessionStorage writes**

Replace the sessionStorage useEffect (lines 329-334) with a debounced version:

```jsx
// Persist terminal state to sessionStorage (debounced)
const persistRef = useRef(null);
useEffect(() => {
    clearTimeout(persistRef.current);
    persistRef.current = setTimeout(() => {
      try {
        sessionStorage.setItem('terminal-state-v1', JSON.stringify({ outputLines }));
      } catch {}
    }, 1000);
    return () => clearTimeout(persistRef.current);
  }, [outputLines]);
```

- [ ] **Step 2: Invalidate cached output on page change**

Add a `useEffect` that clears output when `page` changes (add after the restored-state useEffect at lines 47-51):

```jsx
// Clear cached terminal output when navigating to a different page
useEffect(() => {
    if (restored) {
      setOutputLines([]);
      try { sessionStorage.removeItem('terminal-state-v1'); } catch {}
    }
  }, [page]);
```

- [ ] **Step 3: Build check**

```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -5
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "fix: debounce Terminal sessionStorage writes, invalidate on page change"
```

---

### Task 8: Add ErrorBoundary to DesktopOS window content and lazy-load windows

**Files:**
- Modify: `src/components/DesktopOS.jsx:1-16,57-84`

**Context:** DesktopOS renders window content (ExplorerWindow, etc.) without ErrorBoundary protection. Additionally, all window components are eagerly imported.

- [ ] **Step 1: Add React.lazy imports**

Replace the direct imports (lines 9-15) with lazy imports:

```jsx
import { useEffect, lazy, Suspense } from 'react';
```

Remove the direct imports for the window components and add lazy ones after them:

```jsx
// Keep non-window imports:
import ParticleField from './ParticleField';
import DigitalRain from './DigitalRain';
import HexField from './HexField';
import ErrorBoundary from './ErrorBoundary';
import Dock from './Dock';
import AppBar from './AppBar';

// Lazy-loaded window components
const ExplorerWindow = lazy(() => import('./ExplorerWindow'));
const ResumeWindow = lazy(() => import('./ResumeWindow'));
const MediaPlayerWindow = lazy(() => import('./MediaPlayerWindow'));
const TrashWindow = lazy(() => import('./TrashWindow'));
const SettingsWindow = lazy(() => import('./SettingsWindow'));
const TerminalWindow = lazy(() => import('./TerminalWindow'));
```

- [ ] **Step 2: Wrap window content in ErrorBoundary + Suspense**

Replace the window mapping section (lines 64-84) with:

```jsx
{Object.entries(windows).map(([id, win]) => {
    if (!win.open) return null;
    const menubar = id !== 'terminal' ? ['File', 'Edit', 'View'] : null;
    return (
      <Window key={id} id={id} menubar={menubar}>
        <ErrorBoundary>
          <Suspense fallback={
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: 'calc(0.7rem * var(--os-font-mult))' }}>
              Loading...
            </div>
          }>
            {id === 'explorer' && <ExplorerWindow projects={projects} />}
            {id === 'resume' && <ResumeWindow />}
            {id === 'media-player' && <MediaPlayerWindow />}
            {id === 'trash' && <TrashWindow />}
            {id === 'settings' && <SettingsWindow />}
            {id === 'terminal' && (
              <TerminalWindow
                projectCount={projectCount}
                postCount={postCount}
                searchData={searchData}
                dirs={dirs}
              />
            )}
          </Suspense>
        </ErrorBoundary>
      </Window>
    );
  })}
```

- [ ] **Step 3: Build check**

```bash
cd /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen && npx astro check 2>&1 | tail -10
```
Expected: No errors.

- [ ] **Step 4: Commit**

```bash
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen add -A
git -C /home/b/Development/personal/website/.worktrees/feat/bootscreen/bootscreen commit -m "refactor: lazy-load window components, add ErrorBoundary to window content"
```

---

### Execution Handoff

Plan complete. Two execution options available:

**1. Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** — execute tasks in this session with checkpoints

Which approach?
