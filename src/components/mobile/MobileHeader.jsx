import { useOSStore } from '../../stores/osStore';

export default function MobileHeader({ title = 'Bryan Ward' }) {
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  return (
    <div style={{ padding: '8px 16px 4px' }}>
      <span
        onClick={() => setMobileTab('home')}
        style={{
          fontSize: 'calc(24px * var(--os-font-mult, 1))',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        {title}
      </span>
    </div>
  );
}
