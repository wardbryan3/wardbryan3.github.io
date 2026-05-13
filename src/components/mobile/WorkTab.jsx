import MobileHeader from './MobileHeader';

/**
 * @param {{ projects?: any[] }} props
 */
export default function WorkTab({ projects = [] }) {
  const sorted = [...projects].sort((a, b) => {
    if (a.data.featured && !b.data.featured) return -1;
    if (!a.data.featured && b.data.featured) return 1;
    return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
  });

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader title="Work" />
      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sorted.map((project) => (
          <div
            key={project.slug}
            style={{
              background: 'var(--surface)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid var(--border)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text)', marginBottom: '2px' }}>
                  {project.data.title}
                </div>
                <div style={{ fontSize: '13px', color: 'var(--muted)', lineHeight: 1.5, marginBottom: '8px' }}>
                  {project.data.description}
                </div>
              </div>
            </div>
            {project.data.tags && project.data.tags.length > 0 && (
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '10px' }}>
                {project.data.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: '10px',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: 'var(--bg)',
                      color: 'var(--accent)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '14px' }}>
              {project.data.url && (
                <a
                  href={project.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none' }}
                >
                  Live Demo
                </a>
              )}
              {project.data.repo && (
                <a
                  href={project.data.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '12px', color: 'var(--muted)', textDecoration: 'none' }}
                >
                  Source
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
