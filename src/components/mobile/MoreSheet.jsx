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
