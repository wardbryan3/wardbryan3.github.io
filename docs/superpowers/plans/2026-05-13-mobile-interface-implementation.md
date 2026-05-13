# Mobile Interface Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the terminal-only mobile experience with a content-first iOS-style tabbed interface.

**Architecture:** React components below `src/components/mobile/` hydrate as Astro islands. The homepage (`index.astro`) gets a `MobileLayout` root containing a floating pill+circle tab bar and tabbed content views (Home, Blog, Work, More). Blog and project detail pages get mobile content visibility fixes. Existing Zustand store gets mobile state additions. Theme/wallpaper settings shared with desktop.

**Tech Stack:** Astro 5, React (JSX), Zustand, CSS custom properties

---

## File Structure

### New files:
- `src/components/mobile/MobileLayout.jsx` — root mobile container, manages tab switching and overlay stack
- `src/components/mobile/MobileTabBar.jsx` — floating pill (Home, Blog, Work) + separate circle (More)
- `src/components/mobile/MoreSheet.jsx` — animated bottom sheet overlay
- `src/components/mobile/HomeTab.jsx` — homepage content
- `src/components/mobile/BlogTab.jsx` — blog post list with cards
- `src/components/mobile/WorkTab.jsx` — project cards
- `src/components/mobile/MobileTerminalView.jsx` — full-screen terminal wrapper with back button
- `src/components/mobile/MobileHeader.jsx` — top nav bar with title and settings gear

### Modified files:
- `src/stores/osStore.js` — add mobile state (`mobileActiveTab`, `moreSheetOpen`, `terminalOpen`, `mobileViewStack`)
- `src/pages/index.astro` — replace `HeroDashboard` with `MobileLayout`
- `src/pages/blog/index.astro` — remove mobile `display: none` on blog content
- `src/pages/blog/[...slug].astro` — remove mobile `display: none` on post content
- `src/pages/projects/index.astro` — remove mobile `display: none`
- `src/styles/global.css` — remove mobile content-hiding rules at 768px

### Deleted:
- `src/components/HeroDashboard.jsx` — replaced by `MobileLayout`/`HomeTab`

---

### Task 1: Add mobile state to osStore

**Files:**
- Modify: `src/stores/osStore.js` — append to the store object (before closing paren of `create((set, get) => ({`)

- [ ] Add mobile-specific state fields and actions

```javascript
  // Mobile state
  mobileActiveTab: 'home',
  moreSheetOpen: false,
  terminalOpen: false,
  mobileViewStack: [],

  setMobileTab: (tab) => set({ mobileActiveTab: tab, mobileViewStack: [] }),
  openMoreSheet: () => set({ moreSheetOpen: true }),
  closeMoreSheet: () => set({ moreSheetOpen: false }),
  openMobileTerminal: () => set({ terminalOpen: true, moreSheetOpen: false }),
  closeMobileTerminal: () => set({ terminalOpen: false }),
  pushMobileView: (view) =>
    set((s) => ({ mobileViewStack: [...s.mobileViewStack, view] })),
  popMobileView: () =>
    set((s) => ({ mobileViewStack: s.mobileViewStack.slice(0, -1) })),
```

- [ ] **Commit**

```bash
git add src/stores/osStore.js
git commit -m "feat: add mobile state to osStore"
```

---

### Task 2: Create MobileHeader component

**Files:**
- Create: `src/components/mobile/MobileHeader.jsx`

- [ ] Write a simple top bar with the user's name and a settings gear icon

```jsx
import { useOSStore } from '../../stores/osStore';

export default function MobileHeader({ title = 'Bryan Ward' }) {
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 16px 4px',
      }}
    >
      <span
        onClick={() => setMobileTab('home')}
        style={{ fontSize: '24px', fontWeight: 700, cursor: 'pointer' }}
      >
        {title}
      </span>
      <span style={{ fontSize: '18px', color: 'var(--accent)', cursor: 'pointer' }}>
        &#x2699;
      </span>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileHeader.jsx
git commit -m "feat: add MobileHeader component"
```

---

### Task 3: Create MobileTabBar component

**Files:**
- Create: `src/components/mobile/MobileTabBar.jsx`

- [ ] Write the floating pill + circle tab bar with inline SVG icons

```jsx
import { useOSStore } from '../../stores/osStore';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'blog', label: 'Blog' },
  { id: 'work', label: 'Work' },
];

const ICONS = {
  home: {
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 10L12 3L20 10V20C20 20.55 19.55 21 19 21H14V15H10V21H5C4.45 21 4 20.55 4 20V10Z" fill="var(--accent)"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 10L12 3L20 10V20C20 20.55 19.55 21 19 21H14V15H10V21H5C4.45 21 4 20.55 4 20V10Z" stroke="rgba(200,200,210,0.7)" stroke-width="1.5" fill="none"/>
      </svg>
    ),
  },
  blog: {
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 2H16L20 6V20C20 20.55 19.55 21 19 21H4C3.45 21 3 20.55 3 20V3C3 2.45 3.45 2 4 2Z" fill="var(--accent)"/>
        <path d="M12 2V8H18" stroke="var(--bg)" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 2H16L20 6V20C20 20.55 19.55 21 19 21H4C3.45 21 3 20.55 3 20V3C3 2.45 3.45 2 4 2Z" stroke="rgba(200,200,210,0.7)" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
        <path d="M12 2V8H18" stroke="rgba(200,200,210,0.7)" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
      </svg>
    ),
  },
  work: {
    active: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.09 8.26L21 8.26L15.45 12.24L17.53 18.5L12 14.52L6.47 18.5L8.55 12.24L3 8.26L9.91 8.26L12 2Z" fill="var(--accent)"/>
      </svg>
    ),
    inactive: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L14.09 8.26L21 8.26L15.45 12.24L17.53 18.5L12 14.52L6.47 18.5L8.55 12.24L3 8.26L9.91 8.26L12 2Z" stroke="rgba(200,200,210,0.7)" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
      </svg>
    ),
  },
};

export default function MobileTabBar() {
  const activeTab = useOSStore((s) => s.mobileActiveTab);
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  const openMoreSheet = useOSStore((s) => s.openMoreSheet);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: '0 16px',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          padding: '4px 8px',
          background: 'rgba(40,40,50,0.75)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          borderRadius: '28px',
          pointerEvents: 'auto',
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <div
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1px',
                padding: '6px 14px',
                minWidth: '48px',
                cursor: 'pointer',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
            >
              {isActive ? ICONS[tab.id].active : ICONS[tab.id].inactive}
              <span
                style={{
                  fontSize: '9px',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent)' : 'rgba(200,200,210,0.7)',
                }}
              >
                {tab.label}
              </span>
            </div>
          );
        })}
      </div>

      <div
        onClick={openMoreSheet}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '25px',
          background: 'rgba(40,40,50,0.75)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="6" r="1.3" fill="rgba(200,200,210,0.7)"/>
          <circle cx="11" cy="11" r="1.3" fill="rgba(200,200,210,0.7)"/>
          <circle cx="11" cy="16" r="1.3" fill="rgba(200,200,210,0.7)"/>
        </svg>
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileTabBar.jsx
git commit -m "feat: add MobileTabBar with pill+circle navigation"
```

---

### Task 4: Create MoreSheet component

**Files:**
- Create: `src/components/mobile/MoreSheet.jsx`

- [ ] Write a slide-up bottom sheet overlay with options

```jsx
import { useOSStore } from '../../stores/osStore';

const ITEMS = [
  { id: 'terminal', label: 'Terminal', icon: '>' },
  { id: 'resume', label: 'Resume', icon: '&#x1F464;' },
  { id: 'about', label: 'About', icon: '&#x2139;' },
  { id: 'settings', label: 'Settings', icon: '&#x2699;' },
  { id: 'contact', label: 'Contact', icon: '&#x2709;' },
];

export default function MoreSheet() {
  const moreSheetOpen = useOSStore((s) => s.moreSheetOpen);
  const closeMoreSheet = useOSStore((s) => s.closeMoreSheet);
  const openMobileTerminal = useOSStore((s) => s.openMobileTerminal);

  if (!moreSheetOpen) return null;

  const handleItemClick = (id) => {
    if (id === 'terminal') {
      openMobileTerminal();
    } else {
      closeMoreSheet();
    }
  };

  return (
    <div
      onClick={closeMoreSheet}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          borderRadius: '16px 16px 0 0',
          padding: '8px 0',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom, 8px))',
          animation: 'slideUp 0.3s ease-out',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '4px',
            borderRadius: '2px',
            background: 'var(--text-muted)',
            margin: '0 auto 8px',
            opacity: 0.3,
          }}
        />
        {ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => handleItemClick(item.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: item.id === 'terminal' ? 'monospace' : 'inherit',
                fontWeight: item.id === 'terminal' ? 'bold' : 'normal',
                fontSize: item.id === 'terminal' ? '18px' : '16px',
                color: 'var(--accent)',
              }}
              dangerouslySetInnerHTML={{ __html: item.icon }}
            />
            <span style={{ color: 'var(--text)' }}>{item.label}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MoreSheet.jsx
git commit -m "feat: add MoreSheet bottom sheet component"
```

---

### Task 5: Create HomeTab component

**Files:**
- Create: `src/components/mobile/HomeTab.jsx`

- [ ] Write the homepage content with hero, featured work, writing, and terminal shortcut

```jsx
import { useOSStore } from '../../stores/osStore';
import MobileHeader from './MobileHeader';

const FALLBACK_POSTS = [];
const FALLBACK_PROJECTS = [];

export default function HomeTab({ posts = FALLBACK_POSTS, projects = FALLBACK_PROJECTS }) {
  const openMoreSheet = useOSStore((s) => s.openMoreSheet);
  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 2);
  const featuredProjects = [...projects]
    .filter((p) => p.data.featured)
    .slice(0, 2);

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader />

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Hero */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Full-Stack Developer
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.15 }}>
            Bryan Ward
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            I build fast, reliable web things.
          </div>
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {['TypeScript', 'React', 'Python'].map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
            <span
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'var(--text)',
              }}
            >
              +3
            </span>
          </div>
        </div>

        {/* Featured Work */}
        {featuredProjects.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 600 }}>Featured Work</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuredProjects.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid var(--border)',
                    display: 'block',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                        {p.data.title}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--muted)',
                          marginTop: '1px',
                        }}
                      >
                        {p.data.description}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Writing */}
        {sortedPosts.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 600 }}>Latest Writing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedPosts.map((post) => {
                const wordCount = post.body ? post.body.split(/\s+/).length : 0;
                const readTime = Math.max(1, Math.round(wordCount / 200));
                return (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      textDecoration: 'none',
                      background: 'var(--surface)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      display: 'block',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      {post.data.title}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--muted)',
                        marginTop: '2px',
                      }}
                    >
                      {new Date(post.data.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      &middot; {readTime} min read
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Terminal shortcut */}
        <div
          onClick={openMoreSheet}
          style={{
            background: 'var(--surface)',
            borderRadius: '12px',
            padding: '14px',
            border: '1px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--bg)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'var(--accent)',
            }}
          >
            &gt;
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
              Open Terminal
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Navigate the site with commands
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/HomeTab.jsx
git commit -m "feat: add HomeTab with hero, projects, writing, terminal shortcut"
```

---

### Task 6: Create BlogTab component

**Files:**
- Create: `src/components/mobile/BlogTab.jsx`

- [ ] Write the blog list tab showing sorted posts as tappable cards

```jsx
import MobileHeader from './MobileHeader';

export default function BlogTab({ posts = [] }) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader title="Blog" />
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map((post) => {
          const wordCount = post.body ? post.body.split(/\s+/).length : 0;
          const readTime = Math.max(1, Math.round(wordCount / 200));
          return (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)',
                display: 'block',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '4px' }}>
                {post.data.title}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '8px' }}>
                {post.data.description}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--muted)' }}>
                <span>
                  {new Date(post.data.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>&middot;</span>
                <span>{readTime} min read</span>
              </div>
              {post.data.tags && post.data.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '6px',
                        background: 'var(--bg)',
                        color: 'var(--accent)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </a>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/BlogTab.jsx
git commit -m "feat: add BlogTab with post cards"
```

---

### Task 7: Create WorkTab component

**Files:**
- Create: `src/components/mobile/WorkTab.jsx`

- [ ] Write the projects tab showing cards with tech badges and links

```jsx
import MobileHeader from './MobileHeader';

export default function WorkTab({ projects = [] }) {
  const sorted = [...projects].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader title="Work" />
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map((project) => (
          <div
            key={project.slug}
            style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                  {project.data.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '8px' }}>
                  {project.data.description}
                </div>
              </div>
            </div>
            {project.data.tags && project.data.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {project.data.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg)',
                      color: 'var(--accent)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '14px' }}>
              {project.data.url && (
                <a
                  href={project.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Live Demo
                </a>
              )}
              {project.data.repo && (
                <a
                  href={project.data.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}
                >
                  Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/WorkTab.jsx
git commit -m "feat: add WorkTab with project cards"
```

---

### Task 8: Create MobileTerminalView component

**Files:**
- Create: `src/components/mobile/MobileTerminalView.jsx`

- [ ] Write a full-screen terminal wrapper with back button

```jsx
import { useOSStore } from '../../stores/osStore';
import Terminal from '../../terminal/Terminal';

export default function MobileTerminalView({
  projectCount = 0,
  postCount = 0,
  searchData = [],
  dirs = [],
}) {
  const terminalOpen = useOSStore((s) => s.terminalOpen);
  const closeMobileTerminal = useOSStore((s) => s.closeMobileTerminal);

  if (!terminalOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '12px 16px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <span
          onClick={closeMobileTerminal}
          style={{
            fontSize: '16px',
            color: 'var(--accent)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          &larr; Back
        </span>
        <span
          style={{
            flex: 1,
            textAlign: 'center',
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--text)',
          }}
        >
          Terminal
        </span>
        <span style={{ width: '50px' }} />
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Terminal
          page="/home"
          projectCount={projectCount}
          postCount={postCount}
          searchData={searchData}
          dirs={dirs}
          side={false}
        />
      </div>
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileTerminalView.jsx
git commit -m "feat: add MobileTerminalView full-screen wrapper"
```

---

### Task 9: Create MobileLayout root component

**Files:**
- Create: `src/components/mobile/MobileLayout.jsx`

- [ ] Write the root container that wires tabs, tab bar, overlays together

```jsx
import { useOSStore } from '../../stores/osStore';
import MobileTabBar from './MobileTabBar';
import HomeTab from './HomeTab';
import BlogTab from './BlogTab';
import WorkTab from './WorkTab';
import MoreSheet from './MoreSheet';
import MobileTerminalView from './MobileTerminalView';

export default function MobileLayout({
  projects = [],
  posts = [],
  postCount = 0,
  projectCount = 0,
  searchData = [],
  dirs = [],
}) {
  const activeTab = useOSStore((s) => s.mobileActiveTab);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Tab content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {activeTab === 'home' && <HomeTab posts={posts} projects={projects} />}
        {activeTab === 'blog' && <BlogTab posts={posts} />}
        {activeTab === 'work' && <WorkTab projects={projects} />}
      </div>

      {/* Tab bar */}
      <div style={{ padding: '8px 0 16px' }}>
        <MobileTabBar />
      </div>

      {/* Overlays */}
      <MoreSheet />
      <MobileTerminalView
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
      />
    </div>
  );
}
```

- [ ] **Commit**

```bash
git add src/components/mobile/MobileLayout.jsx
git commit -m "feat: add MobileLayout root component"
```

---

### Task 10: Update index.astro to use MobileLayout

**Files:**
- Modify: `src/pages/index.astro`

- [ ] Replace `HeroDashboard` import and usage with `MobileLayout`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import DesktopOS from '../components/DesktopOS';
import MobileLayout from '../components/mobile/MobileLayout';

const projects = await getCollection('projects');
const posts = await getCollection('blog');
const projectCount = projects.length;
const postCount = posts.length;

const searchData = [
  ...posts.map(p => ({ title: p.data.title, slug: p.slug, path: `/blog/${p.slug}`, type: 'blog', tags: p.data.tags, date: p.data.date })),
  ...projects.map(p => ({ title: p.data.title, slug: p.slug, path: `/projects/${p.slug}`, type: 'projects', tags: p.data.tags, date: p.data.date })),
];
const dirs = [{ name: 'blog', description: 'blog posts', count: postCount }, { name: 'projects', description: 'projects', count: projectCount }];
---

<BaseLayout title="Home" description="Bryan Ward - CS student and developer" showBootScreen={true}>
  <div class="os-desktop">
    <DesktopOS
      projects={projects}
      projectCount={projectCount}
      postCount={postCount}
      searchData={searchData}
      dirs={dirs}
      client:media="(min-width: 769px)"
    />
  </div>
  <div class="os-mobile">
    <MobileLayout
      projects={projects}
      posts={posts}
      projectCount={projectCount}
      postCount={postCount}
      searchData={searchData}
      dirs={dirs}
      client:media="(max-width: 768px)"
    />
  </div>
</BaseLayout>

<style>
  .os-desktop { flex: 1; display: flex; flex-direction: column; }
  .os-mobile { display: contents; }

  @media (max-width: 768px) {
    .os-desktop { display: none; }
  }

  @media (min-width: 769px) {
    .os-mobile { display: none; }
  }
</style>
```

- [ ] **Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: replace HeroDashboard with MobileLayout on homepage"
```

---

### Task 11: Fix blog index page on mobile

**Files:**
- Modify: `src/pages/blog/index.astro`

- [ ] Remove the `display: none` on `.blog-content` so blog index content is visible on mobile

Edit the `@media (max-width: 768px)` block at line 179:
- Remove `.blog-content { display: none; }`
- Add mobile-friendly padding for `.blog-content`:

```css
@media (max-width: 768px) {
  .blog-docs-layout {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
  }
  .blog-sidebar-column {
    display: none;
  }
  .blog-content {
    padding: 1.5rem 1rem;
    max-width: 100%;
  }
}
```

Also remove the fallback that hides the `.blog-content` in the media query at line 189.

- [ ] **Commit**

```bash
git add src/pages/blog/index.astro
git commit -m "fix: show blog index content on mobile"
```

---

### Task 12: Fix blog post detail page on mobile

**Files:**
- Modify: `src/layouts/BlogPost.astro`

- [ ] Remove `display: none` on `.blog-content` at mobile, add proper mobile padding

Edit the `@media (max-width: 768px)` block at line 281:

```css
@media (max-width: 768px) {
  .blog-docs-layout {
    display: flex;
    flex-direction: column;
    min-height: 0;
    flex: 1;
  }
  .blog-sidebar-column {
    display: none;
  }
  .blog-content {
    padding: 1.5rem 1rem;
    max-width: 100%;
  }
}
```

- [ ] **Commit**

```bash
git add src/layouts/BlogPost.astro
git commit -m "fix: show blog post content on mobile"
```

---

### Task 13: Fix projects page on mobile

**Files:**
- Modify: `src/styles/global.css`

- [ ] Remove the `display: none` rules that hide blog and project page content

In the `@media (max-width: 768px)` block at line 579, remove `.project-page, .projects-page { display: none; }`. The project content will now render naturally.

- [ ] **Commit**

```bash
git add src/styles/global.css
git commit -m "fix: show project page content on mobile"
```

---

### Task 14: Remove HeroDashboard and clean up

**Files:**
- Delete: `src/components/HeroDashboard.jsx`

- [ ] Delete `HeroDashboard.jsx` (no longer imported anywhere since index.astro now uses MobileLayout)

- [ ] **Commit**

```bash
git rm src/components/HeroDashboard.jsx
git commit -m "refactor: remove HeroDashboard (replaced by MobileLayout)"
```

---

### Task 15: Build verification

- [ ] Run the build to verify no errors

```bash
npm run build
```

Expected: Astro check passes, build completes to `dist/`. No import errors.

- [ ] If the build fails, fix the issue and rebuild until clean.

- [ ] **Commit any fixes**

```bash
git commit -am "chore: fix build issues from mobile migration"
```
