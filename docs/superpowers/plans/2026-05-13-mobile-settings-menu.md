# Mobile Settings Menu Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a full-page settings panel to the mobile interface, accessible from the MoreSheet.

**Architecture:** A new `SettingsView.jsx` component (same slide-up pattern as `MoreSheet`) renders inside `MobileShell`. The MoreSheet's "Settings" item pushes to the existing `mobileViewStack`, and `SettingsView` reads from the stack to control visibility. All settings state/setters are shared with desktop via the existing Zustand store.

**Tech Stack:** React (JSX), Zustand store, CSS transitions, shared theme/font/wallpaper config lists from `SettingsWindow.jsx`

---

### Task 1: Create SettingsView component

**Files:**
- Create: `src/components/mobile/SettingsView.jsx`

- [ ] **Step 1: Write the SettingsView component**

```jsx
import { useState, useEffect } from 'react';
import { useOSStore } from '../../stores/osStore';

const THEMES = [
  'system', 'tokyonight', 'everforest', 'ayu', 'catppuccin',
  'catppuccin-macchiato', 'gruvbox', 'kanagawa', 'nord', 'matrix', 'one-dark',
];

const WALLPAPERS = ['particle-field', 'digital-rain', 'hex-field', 'dots', 'grid', 'none'];
const FONT_SIZES = ['small', 'medium', 'large'];

export default function SettingsView() {
  const mobileViewStack = useOSStore((s) => s.mobileViewStack);
  const popMobileView = useOSStore((s) => s.popMobileView);

  const theme = useOSStore((s) => s.theme);
  const fontSize = useOSStore((s) => s.fontSize);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const setTheme = useOSStore((s) => s.setTheme);
  const setFontSize = useOSStore((s) => s.setFontSize);
  const setWallpaper = useOSStore((s) => s.setWallpaper);

  const [alive, setAlive] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  const settingsOpen = mobileViewStack.includes('settings');

  useEffect(() => {
    if (settingsOpen) {
      setAlive(true);
      const timer = setTimeout(() => setSlideIn(true), 20);
      return () => clearTimeout(timer);
    } else if (alive) {
      setSlideIn(false);
      const timer = setTimeout(() => setAlive(false), 280);
      return () => clearTimeout(timer);
    }
  }, [settingsOpen]);

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => popMobileView(), 280);
  };

  if (!alive) return null;

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
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
          background: 'var(--surface)',
          borderRadius: '16px 16px 0 0',
          padding: '0 0 8px',
          maxHeight: '70vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          transform: slideIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s ease-out',
        }}
      >
        <div
          onClick={handleClose}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px 10px',
            borderBottom: '1px solid var(--border)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '16px', color: 'var(--accent)' }}>{'\u2190'} Back</span>
          <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text)' }}>Settings</span>
          <span style={{ width: '42px' }} />
        </div>

        <div style={{ overflow: 'auto', padding: '4px 20px' }}>
          <SettingRow label="Theme">
            <select value={theme} onChange={(e) => setTheme(e.target.value)} style={selectStyle}>
              {THEMES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label="Font Size">
            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} style={selectStyle}>
              {FONT_SIZES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </SettingRow>

          <SettingRow label="Wallpaper">
            <select value={wallpaper} onChange={(e) => setWallpaper(e.target.value)} style={selectStyle}>
              {WALLPAPERS.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
          </SettingRow>

          <div style={{ padding: '16px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            Portfolio OS v1.0
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingRow({ label, children }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 0',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <span style={{ fontSize: '16px', color: 'var(--text)' }}>{label}</span>
      {children}
    </div>
  );
}

const selectStyle = {
  background: 'var(--surface)',
  color: 'var(--text)',
  border: '1px solid var(--border)',
  borderRadius: '6px',
  padding: '6px 10px',
  fontSize: '14px',
  cursor: 'pointer',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/components/mobile/SettingsView.jsx
git commit -m "feat: add mobile SettingsView component"
```

---

### Task 2: Wire Settings into MoreSheet

**Files:**
- Modify: `src/components/mobile/MoreSheet.jsx`

- [ ] **Step 1: Add `pushMobileView` to the store selectors**

In MoreSheet.jsx, add the import for `pushMobileView`:
```jsx
const pushMobileView = useOSStore((s) => s.pushMobileView);
```

Add it after the existing selectors (around line 15 where `setMobileTab` is selected).

- [ ] **Step 2: Add 'settings' case to handleItemClick**

```jsx
      case 'settings':
        handleClose();
        setTimeout(() => pushMobileView('settings'), 280);
        break;
```

Add this before the `case 'contact':` block.

- [ ] **Step 3: Commit**

```bash
git add src/components/mobile/MoreSheet.jsx
git commit -m "feat: wire Settings item in MoreSheet to open settings view"
```

---

### Task 3: Render SettingsView in MobileShell

**Files:**
- Modify: `src/components/mobile/MobileShell.jsx`

- [ ] **Step 1: Import SettingsView**

Add at the top of MobileShell.jsx, after the MoreSheet import:
```jsx
import SettingsView from './SettingsView';
```

- [ ] **Step 2: Render SettingsView**

Add after `<MoreSheet />` in the JSX:
```jsx
      <SettingsView />
```

- [ ] **Step 3: Commit**

```bash
git add src/components/mobile/MobileShell.jsx
git commit -m "feat: render SettingsView in MobileShell"
```

---

### Task 4: Build verification

- [ ] **Step 1: Run build**

```bash
npm run build
```

Expected: 0 errors, 0 warnings (1 pre-existing hint about `showTerminal` is OK).

- [ ] **Step 2: Commit any fixes (if needed)**

If build fails, fix issues and re-run.

If build passes, no additional commit needed (all changes already committed in prior tasks).
