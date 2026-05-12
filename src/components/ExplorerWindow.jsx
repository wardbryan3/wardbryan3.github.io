import { useState } from 'react';
import Icon from './Icon';

export default function ExplorerWindow({ projects }) {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleDoubleClick = (slug) => {
    window.location.href = `/projects/${slug}/`;
  };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column', height: '100%',
        fontSize: 'calc(0.7rem * var(--os-font-mult))',
      }}
    >
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '4px',
          padding: '3px 8px', borderBottom: '1px solid var(--border)',
          background: 'var(--surface)',
        }}
      >
        <button style={addrBtnStyle}>{'\u25C0'}</button>
        <button style={addrBtnStyle}>{'\u25B6'}</button>
        <button style={addrBtnStyle}>{'\u2B06'}</button>
        <span
          style={{
            flex: 1, background: 'var(--bg)', padding: '2px 6px',
            borderRadius: '3px', color: 'var(--text-muted)',
            fontSize: 'calc(0.65rem * var(--os-font-mult))',
          }}
        >
          ~/Projects/
        </span>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <div
          style={{
            width: '130px', borderRight: '1px solid var(--border)',
            padding: '6px', overflow: 'auto', background: 'var(--surface)',
            fontSize: 'calc(0.65rem * var(--os-font-mult))',
          }}
        >
          <div
            style={{
              color: 'var(--accent)', fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            <Icon name="folder" size={14} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> Projects
          </div>
          {projects.map((p) => (
            <div
              key={p.slug}
              style={{
                paddingLeft: '12px', padding: '2px 0', cursor: 'pointer',
                color: 'var(--text)',
              }}
            >
              <Icon name="folder" size={14} style={{ verticalAlign: 'middle', marginRight: '2px' }} /> {p.data.title}
            </div>
          ))}
        </div>

        {selectedProject ? (
          <div style={{ flex: 1, padding: '12px', overflow: 'auto' }}>
            <button
              onClick={() => setSelectedProject(null)}
              style={{
                background: 'none', border: '1px solid var(--border)',
                color: 'var(--text)', padding: '4px 8px',
                borderRadius: '4px', cursor: 'pointer',
                marginBottom: '10px', fontSize: 'calc(0.65rem * var(--os-font-mult))',
              }}
            >
              {'\u2190'} Back
            </button>
            <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>
              {selectedProject.data.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>
              {selectedProject.data.description}
            </p>
            <div
              style={{
                display: 'flex', gap: '6px', flexWrap: 'wrap',
                marginBottom: '12px',
              }}
            >
              {selectedProject.data.tags?.map((t) => (
                <span
                  key={t}
                  style={{
                    background: 'var(--surface)', padding: '2px 6px',
                    borderRadius: '3px', fontSize: 'calc(0.6rem * var(--os-font-mult))',
                    color: 'var(--accent)',
                  }}
                >
                  .{t.toLowerCase()}
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {selectedProject.data.liveUrl && (
                <a
                  href={selectedProject.data.liveUrl}
                  target="_blank" rel="noopener noreferrer"
                  style={linkBtnStyle}
                >
                  Live Site
                </a>
              )}
              {selectedProject.data.githubUrl && (
                <a
                  href={selectedProject.data.githubUrl}
                  target="_blank" rel="noopener noreferrer"
                  style={{ ...linkBtnStyle, borderColor: 'var(--border)', color: 'var(--text)' }}
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1, display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '8px', padding: '10px', overflow: 'auto',
              alignContent: 'start',
            }}
          >
            {projects.map((p) => (
              <div
                key={p.slug}
                onDoubleClick={() => handleDoubleClick(p.slug)}
                style={{
                  border: '1px solid var(--border)', borderRadius: '6px',
                  padding: '10px', background: 'var(--surface)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '1.3rem', marginBottom: '4px' }}>
                  <Icon name="folder" size={14} style={{ verticalAlign: 'middle', marginRight: '2px' }} />
                </div>
                <div
                  style={{
                    fontWeight: 600, fontSize: 'calc(0.7rem * var(--os-font-mult))',
                    marginBottom: '4px',
                  }}
                >
                  {p.data.title}
                </div>
                <div
                  style={{
                    fontSize: 'calc(0.6rem * var(--os-font-mult))', color: 'var(--text-muted)',
                    marginBottom: '6px',
                  }}
                >
                  {p.data.description}
                </div>
                <div
                  style={{
                    display: 'flex', gap: '2px', flexWrap: 'wrap',
                    marginBottom: '6px',
                  }}
                >
                  {p.data.tags?.map((t) => (
                    <span
                      key={t}
                      style={{
                        background: 'var(--surface-hover)', padding: '1px 4px',
                        borderRadius: '2px', fontSize: '0.55rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      .{t.toLowerCase()}
                    </span>
                  ))}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(p);
                  }}
                  style={{
                    background: 'var(--surface-hover)',
                    border: '1px solid var(--border)', borderRadius: '3px',
                    padding: '2px 8px', cursor: 'pointer',
                    color: 'var(--text)', fontSize: 'calc(0.6rem * var(--os-font-mult))',
                  }}
                >
                  Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const addrBtnStyle = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: 'var(--text-muted)', fontSize: 'calc(0.65rem * var(--os-font-mult))',
};

const linkBtnStyle = {
  padding: '4px 10px', border: '1px solid var(--accent)',
  borderRadius: '4px', color: 'var(--accent)',
  textDecoration: 'none', fontSize: 'calc(0.65rem * var(--os-font-mult))',
};
