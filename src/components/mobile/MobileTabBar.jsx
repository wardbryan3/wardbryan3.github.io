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
