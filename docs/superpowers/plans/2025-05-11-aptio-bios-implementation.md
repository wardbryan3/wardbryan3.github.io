# Aptio BIOS Screen Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the simple BIOS dialog with a full Aptio UEFI BIOS layout including header, menu tab bar, split-pane content area, and footer.

**Architecture:** Update the React `BiosWindow.jsx` component with the Aptio layout structure wrapping the existing dialog. Update the corresponding CSS classes in `global.css`. The keyboard interaction logic stays unchanged.

**Tech Stack:** React, CSS

---

### Task 1: Update BIOS CSS in global.css

**Files:**
- Modify: `src/styles/global.css:800-902`

Replace the existing BIOS CSS block (lines 800-902) with new styles that add the Aptio layout elements while keeping the existing color palette.

- [ ] **Step 1: Replace BIOS CSS block**

Find the block starting at the comment `/* BIOS screen */` and replace everything from there through the end of the file with:

```css
/* BIOS screen */
.bios-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #0000aa;
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
  color: #c0c0c0;
}

.bios-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px solid #c0c0c0;
  padding: 8px 12px;
}

.bios-header-title {
  color: #fff;
  font-weight: bold;
  font-size: 0.75rem;
}

.bios-header-copyright {
  color: #c0c0c0;
  font-size: 0.65rem;
}

.bios-tabbar {
  display: flex;
  gap: 0;
  padding: 4px 8px;
}

.bios-tab {
  padding: 2px 12px;
  font-size: 0.75rem;
  color: #c0c0c0;
  cursor: default;
  user-select: none;
}

.bios-tab-selected {
  background: #000080;
  color: #fff;
  font-weight: bold;
}

.bios-body {
  flex: 1;
  display: flex;
  border-top: 1px solid #0000cc;
  min-height: 0;
}

.bios-body-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 12px;
}

.bios-body-right {
  width: 180px;
  border-left: 1px solid #0000cc;
  padding: 10px 8px;
  font-size: 0.65rem;
  color: #c0c0c0;
}

.bios-help-heading {
  color: #fff;
  font-weight: bold;
  margin-bottom: 6px;
  font-size: 0.65rem;
}

.bios-help-separator {
  border: none;
  border-top: 1px solid #0000cc;
  margin: 6px 0;
}

.bios-help-hints {
  color: #888;
  font-size: 0.6rem;
}

.bios-window {
  background: #c0c0c0;
  color: #000;
  border: 2px solid #fff;
  min-width: 380px;
  max-width: 420px;
}

.bios-window-titlebar {
  background: #000080;
  color: #fff;
  padding: 4px 10px;
  font-weight: bold;
  font-size: 0.75rem;
}

.bios-window-body {
  padding: 20px 16px;
  text-align: center;
}

.bios-window-text {
  color: #000;
  font-size: 0.8rem;
  margin-bottom: 16px;
  line-height: 1.6;
}

.bios-choices {
  display: flex;
  gap: 20px;
  justify-content: center;
  font-size: 0.8rem;
}

.bios-choice {
  padding: 3px 10px;
  cursor: pointer;
  user-select: none;
  color: #444;
}

.bios-choice-selected {
  background: #000080;
  color: #fff;
  font-weight: bold;
}

.bios-choice-label {
  font-weight: bold;
}

.bios-dialog-footer {
  margin-top: 16px;
  border-top: 1px solid #888;
  padding-top: 8px;
  font-size: 0.65rem;
  color: #444;
}

.bios-footer {
  border-top: 2px solid #c0c0c0;
  padding: 4px 12px;
  display: flex;
  gap: 16px;
  font-size: 0.65rem;
  color: #c0c0c0;
}

.bios-footer-key {
  color: #fff;
  font-weight: bold;
}
```

- [ ] **Step 2: Build to verify CSS compiles**

Run: `npx astro build 2>&1 | tail -5`
Expected: Build succeeds with "Complete!" in output.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add Aptio BIOS layout CSS classes"
```

### Task 2: Update BiosWindow.jsx with Aptio layout

**Files:**
- Modify: `src/components/BiosWindow.jsx`

Replace the JSX with the full Aptio layout: header, menu tab bar, split-pane content, help pane, and footer. Keep the React state and keyboard handlers unchanged.

- [ ] **Step 1: Replace BiosWindow.jsx content**

```jsx
import { useState, useEffect, useCallback } from 'react';

export default function BiosWindow() {
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState('Y');

  const handleKey = useCallback((e) => {
    if (!show) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      setSelected(prev => prev === 'Y' ? 'N' : 'Y');
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (selected === 'Y') {
        setShow(false);
        document.dispatchEvent(new CustomEvent('boot:bios-yes'));
      }
    }
  }, [show, selected]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  useEffect(() => {
    const handler = () => {
      setShow(true);
      setSelected('Y');
    };
    document.addEventListener('boot:show-bios', handler);
    return () => document.removeEventListener('boot:show-bios', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="bios-overlay">
      <div className="bios-header">
        <span className="bios-header-title">Aptio Setup Utility - v1.0</span>
        <span className="bios-header-copyright">Copyright (C) 2025 American Megatrends</span>
      </div>

      <div className="bios-tabbar">
        <span className="bios-tab bios-tab-selected">Main</span>
        <span className="bios-tab">Advanced</span>
        <span className="bios-tab">Chipset</span>
        <span className="bios-tab">Boot</span>
        <span className="bios-tab">Security</span>
        <span className="bios-tab">Save &amp; Exit</span>
      </div>

      <div className="bios-body">
        <div className="bios-body-left">
          <div className="bios-window">
            <div className="bios-window-titlebar">Boot Confirmation</div>
            <div className="bios-window-body">
              <div className="bios-window-text">
                My wife made me put this here,<br />would you like to boot?
              </div>
              <div className="bios-choices">
                <div
                  className={`bios-choice ${selected === 'Y' ? 'bios-choice-selected' : ''}`}
                  onClick={() => setSelected('Y')}
                >
                  <span className="bios-choice-label">[Y]</span> Yes
                </div>
                <div
                  className={`bios-choice ${selected === 'N' ? 'bios-choice-selected' : ''}`}
                  onClick={() => setSelected('N')}
                >
                  <span className="bios-choice-label">[N]</span> No
                </div>
              </div>
              <div className="bios-dialog-footer">
                &larr; &rarr; Select &nbsp;&nbsp; Enter Accept
              </div>
            </div>
          </div>
        </div>
        <div className="bios-body-right">
          <div className="bios-help-heading">Item Specific Help</div>
          <hr className="bios-help-separator" />
          <div>
            Confirm whether to<br />
            continue booting into<br />
            Portfolio OS.
          </div>
          <hr className="bios-help-separator" />
          <div className="bios-help-hints">
            &larr; &rarr; Change<br />
            Enter Accept
          </div>
        </div>
      </div>

      <div className="bios-footer">
        <span><span className="bios-footer-key">F1</span> Help</span>
        <span><span className="bios-footer-key">ESC</span> Exit</span>
        <span><span className="bios-footer-key">&larr; &rarr;</span> Select</span>
        <span><span className="bios-footer-key">Enter</span> Accept</span>
      </div>
    </div>
  );
}
```

Note: Uses `&amp;` for the ampersand in "Save & Exit" and `&larr;` / `&rarr;` for arrow characters.

- [ ] **Step 2: Build to verify compiles**

Run: `npx astro build 2>&1 | tail -5`
Expected: Build succeeds with "Complete!" in output.

- [ ] **Step 3: Verify HTML output contains Aptio layout**

```bash
grep -c 'Aptio Setup Utility' dist/index.html
grep -c 'Item Specific Help' dist/index.html
grep -c 'bios-tab-selected' dist/index.html
grep -c 'bios-footer-key' dist/index.html
```
Expected: Each returns at least 1.

- [ ] **Step 4: Commit**

```bash
git add src/components/BiosWindow.jsx
git commit -m "feat: add Aptio BIOS layout with header, tabs, help pane, and footer"
```
