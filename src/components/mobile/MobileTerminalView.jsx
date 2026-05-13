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
