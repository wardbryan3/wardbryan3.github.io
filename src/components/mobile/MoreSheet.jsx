import { useOSStore } from '../../stores/osStore';

const ICON_SIZE = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'var(--accent)',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ITEMS = [
  {
    id: 'resume',
    label: 'Resume',
    icon: (
      <svg {...ICON_SIZE}>
        <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12Z" />
        <path d="M4 20C4 16 7 14 12 14C17 14 20 16 20 20" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About',
    icon: (
      <svg {...ICON_SIZE}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 16V12" />
        <path d="M12 8.5V8" />
      </svg>
    ),
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: (
      <svg {...ICON_SIZE}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1V4" />
        <path d="M12 20V23" />
        <path d="M4.22 4.22L6.34 6.34" />
        <path d="M17.66 17.66L19.78 19.78" />
        <path d="M1 12H4" />
        <path d="M20 12H23" />
        <path d="M4.22 19.78L6.34 17.66" />
        <path d="M17.66 6.34L19.78 4.22" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: (
      <svg {...ICON_SIZE}>
        <path d="M4 6C4 5.45 4.45 5 5 5H19C19.55 5 20 5.45 20 6V18C20 18.55 19.55 19 19 19H5C4.45 19 4 18.55 4 18V6Z" />
        <path d="M4 6L12 12.5L20 6" />
      </svg>
    ),
  },
];

import { useState, useEffect } from 'react';

export default function MoreSheet() {
  const moreSheetOpen = useOSStore((s) => s.moreSheetOpen);
  const closeMoreSheet = useOSStore((s) => s.closeMoreSheet);
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  const pushMobileView = useOSStore((s) => s.pushMobileView);
  const [alive, setAlive] = useState(false);
  const [slideIn, setSlideIn] = useState(false);

  useEffect(() => {
    if (moreSheetOpen) {
      setAlive(true);
      const timer = setTimeout(() => setSlideIn(true), 20);
      return () => clearTimeout(timer);
    } else if (alive) {
      setSlideIn(false);
      const timer = setTimeout(() => setAlive(false), 280);
      return () => clearTimeout(timer);
    }
  }, [moreSheetOpen]);

  const handleClose = () => {
    setSlideIn(false);
    setTimeout(() => closeMoreSheet(), 280);
  };

  if (!alive) return null;

  const handleItemClick = (id) => {
    switch (id) {
      case 'resume':
        closeMoreSheet();
        window.open('/resume.pdf', '_blank');
        break;
      case 'about':
        handleClose();
        setTimeout(() => setMobileTab('home'), 280);
        break;
      case 'settings':
        handleClose();
        setTimeout(() => pushMobileView('settings'), 280);
        break;
      case 'contact':
        closeMoreSheet();
        window.location.href = 'mailto:wardbryan3@gmail.com';
        break;
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 300,
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
          padding: '8px 0',
          marginBottom: 'calc(72px + env(safe-area-inset-bottom, 0px))',
          transform: slideIn ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.28s ease-out',
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
              fontSize: 'calc(16px * var(--os-font-mult, 1))',
            }}
          >
            <span
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {item.icon}
            </span>
            <span style={{ color: 'var(--text)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
