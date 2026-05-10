import { useOSStore } from '../stores/osStore';
import Terminal from '../terminal/Terminal';

export default function TerminalWindow({ projectCount, postCount, searchData, dirs }) {
  const terminalFont = useOSStore((s) => s.terminalFont);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Terminal
        page="/home"
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
        side={false}
        embedded
        terminalFont={terminalFont}
      />
    </div>
  );
}
