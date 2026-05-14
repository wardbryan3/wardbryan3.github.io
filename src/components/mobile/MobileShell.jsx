import { useOSStore } from '../../stores/osStore';
import MoreSheet from './MoreSheet';
import SettingsView from './SettingsView';
import MobileTerminalView from './MobileTerminalView';

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'blog', label: 'Blog' },
  { id: 'work', label: 'Work' },
  { id: 'terminal', label: 'Terminal' },
];

const ICONS = {
  home: {
    active: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 10L12 3L20 10V20C20 20.55 19.55 21 19 21H14V15H10V21H5C4.45 21 4 20.55 4 20V10Z"
          fill="var(--accent)"
        />
      </svg>
    ),
    inactive: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 10L12 3L20 10V20C20 20.55 19.55 21 19 21H14V15H10V21H5C4.45 21 4 20.55 4 20V10Z"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.5"
          fill="none"
        />
      </svg>
    ),
  },
  blog: {
    active: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 2H16L20 6V20C20 20.55 19.55 21 19 21H4C3.45 21 3 20.55 3 20V3C3 2.45 3.45 2 4 2Z"
          fill="var(--accent)"
        />
        <path d="M12 2V8H18" stroke="var(--bg)" stroke-width="1.5" stroke-linejoin="round" />
      </svg>
    ),
    inactive: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 2H16L20 6V20C20 20.55 19.55 21 19 21H4C3.45 21 3 20.55 3 20V3C3 2.45 3.45 2 4 2Z"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.5"
          stroke-linejoin="round"
          fill="none"
        />
        <path
          d="M12 2V8H18"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.5"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  work: {
    active: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.09 8.26L21 8.26L15.45 12.24L17.53 18.5L12 14.52L6.47 18.5L8.55 12.24L3 8.26L9.91 8.26L12 2Z"
          fill="var(--accent)"
        />
      </svg>
    ),
    inactive: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2L14.09 8.26L21 8.26L15.45 12.24L17.53 18.5L12 14.52L6.47 18.5L8.55 12.24L3 8.26L9.91 8.26L12 2Z"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.5"
          stroke-linejoin="round"
          fill="none"
        />
      </svg>
    ),
  },
  terminal: {
    active: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2" fill="var(--accent)" opacity="0.2" />
        <path
          d="M6 10L9 13L6 16M11 16H18"
          stroke="var(--accent)"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
    inactive: (
      <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.5"
          fill="none"
        />
        <path
          d="M6 10L9 13L6 16M11 16H18"
          stroke="rgba(200,200,210,0.7)"
          stroke-width="1.8"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    ),
  },
};

/**
 * @param {{ currentPath?: string, projectCount?: number, postCount?: number, searchData?: any[], dirs?: { name: string; description: string; count: number }[] }} props
 */
export default function MobileShell({
  currentPath = '/',
  projectCount = 0,
  postCount = 0,
  searchData = [],
  dirs = [],
}) {
  const storeActiveTab = useOSStore((s) => s.mobileActiveTab);
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  const terminalOpen = useOSStore((s) => s.terminalOpen);
  const openMobileTerminal = useOSStore((s) => s.openMobileTerminal);
  const closeMobileTerminal = useOSStore((s) => s.closeMobileTerminal);
  const moreSheetOpen = useOSStore((s) => s.moreSheetOpen);
  const openMoreSheet = useOSStore((s) => s.openMoreSheet);
  const closeMoreSheet = useOSStore((s) => s.closeMoreSheet);

  const isHomepage = currentPath === '/';

  let computedActiveTab;
  if (terminalOpen) {
    computedActiveTab = 'terminal';
  } else if (isHomepage) {
    computedActiveTab = storeActiveTab;
  } else if (currentPath.startsWith('/blog')) {
    computedActiveTab = 'blog';
  } else if (currentPath.startsWith('/projects')) {
    computedActiveTab = 'work';
  } else {
    computedActiveTab = 'home';
  }

  const handleTabClick = (id) => {
    if (id === 'terminal') {
      if (terminalOpen) {
        closeMobileTerminal();
      } else {
        openMobileTerminal();
      }
      return;
    }

    if (terminalOpen) {
      closeMobileTerminal();
    }

    if (isHomepage) {
      setMobileTab(id);
    } else {
      if (id === 'home') window.location.href = '/';
      else if (id === 'blog') window.location.href = '/blog';
      else if (id === 'work') window.location.href = '/projects';
    }
  };

  const handleMoreClick = () => {
    if (moreSheetOpen) {
      closeMoreSheet();
    } else {
      openMoreSheet();
    }
  };

  return (
    <>
      <div
        className="mobile-shell"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px',
          paddingBottom: 'calc(8px + env(safe-area-inset-bottom, 0px))',
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            padding: '4px 8px',
            background: 'transparent',
            backdropFilter: 'blur(40px) saturate(200%)',
            WebkitBackdropFilter: 'blur(40px) saturate(200%)',
            borderRadius: '28px',
            pointerEvents: 'auto',
          }}
        >
          {TABS.map((tab) => {
            const isActive = computedActiveTab === tab.id;
            return (
              <div
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
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
                    fontSize: 'calc(9px * var(--os-font-mult, 1))',
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
          onClick={handleMoreClick}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '28px',
            background: 'transparent',
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
          <svg width="28" height="28" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="6" r="1.3" fill="rgba(200,200,210,0.7)" />
            <circle cx="11" cy="11" r="1.3" fill="rgba(200,200,210,0.7)" />
            <circle cx="11" cy="16" r="1.3" fill="rgba(200,200,210,0.7)" />
          </svg>
        </div>
      </div>

      <MobileTerminalView
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
      />

      <MoreSheet />
      <SettingsView />

      <style>{`
        @media (min-width: 769px) {
          .mobile-shell {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
