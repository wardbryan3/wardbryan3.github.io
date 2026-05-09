export default function StatsPanel({ projectCount = 0, postCount = 0 }) {
  const stats = [
    { label: 'projects', value: projectCount, color: '#00ff66' },
    { label: 'posts', value: postCount, color: '#8800cc' },
    { label: 'languages', value: 5, color: '#00ff66' },
  ];

  return (
    <div className="terminal-panel">
      <div className="panel-header">~/stats</div>
      <div className="panel-body">
        <div className="stats-grid">
          {stats.map(({ label, value, color }) => (
            <div className="stat-item" key={label}>
              <span className="stat-value" style={{ color }}>
                {value}
              </span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
