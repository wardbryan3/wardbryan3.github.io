import { useOSStore } from '../../stores/osStore';

export default function MobileHeader({ title = 'Bryan Ward' }) {
  const setMobileTab = useOSStore((s) => s.setMobileTab);
  return (
    <div style={{ padding: '8px 16px 4px' }}>
      <span
        onClick={() => setMobileTab('home')}
        style={{ fontSize: '24px', fontWeight: 700, cursor: 'pointer' }}
      >
        {title}
      </span>
    </div>
  );
}
