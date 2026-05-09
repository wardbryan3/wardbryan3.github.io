const rows = [
  { label: 'name', value: 'Bryan Ward' },
  { label: 'status', value: 'CS Student', accent: true },
  { label: 'level', value: '2nd Year (200-level)' },
  { label: 'focus', value: 'Full-stack development' },
  { label: 'tools', value: 'TypeScript, Python, Java, C++' },
  { label: 'shell', value: 'bash' },
];

export default function InfoPanel() {
  return (
    <div className="terminal-panel">
      <div className="panel-header">~/whoami</div>
      <div className="panel-body">
        <table className="info-table">
          <tbody>
            {rows.map(({ label, value, accent }) => (
              <tr key={label}>
                <td className="info-label">{label}</td>
                <td className={accent ? 'info-value info-value-accent' : 'info-value'}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
