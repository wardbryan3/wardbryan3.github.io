import MobileHeader from './MobileHeader';

/**
 * @param {{ posts?: any[], projects?: any[] }} props
 */
export default function HomeTab({ posts = [], projects = [] }) {
  const sortedPosts = [...posts]
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 2);
  const featuredProjects = [...projects]
    .filter((p) => p.data.featured)
    .slice(0, 2);

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader />

      <div style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {/* Hero */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: '14px',
            padding: '20px',
            border: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontSize: '13px',
              color: 'var(--text-muted)',
              marginBottom: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            Full-Stack Developer
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, lineHeight: 1.15 }}>
            Bryan Ward
          </div>
          <div style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '4px' }}>
            I build fast, reliable web things.
          </div>
        </div>

        {/* Tools */}
        <div
          style={{
            background: 'var(--surface)',
            borderRadius: '14px',
            padding: '16px 20px',
            border: '1px solid var(--border)',
          }}
        >
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Tools
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Languages</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['TypeScript', 'JavaScript', 'Python', 'Java', 'C++'].map((t) => (
                <span key={t} style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '8px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Frontend</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['React', 'Astro', 'HTML / CSS'].map((t) => (
                <span key={t} style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '5px' }}>Backend / Tools</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {['Node.js', 'Git', 'SQL'].map((t) => (
                <span key={t} style={{ background: 'var(--accent)', color: 'var(--bg)', padding: '2px 9px', borderRadius: '20px', fontSize: '11px', fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Work */}
        {featuredProjects.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 600 }}>Featured Work</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {featuredProjects.map((p) => (
                <a
                  key={p.slug}
                  href={`/projects/${p.slug}`}
                  style={{
                    textDecoration: 'none',
                    background: 'var(--surface)',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid var(--border)',
                    display: 'block',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)' }}>
                        {p.data.title}
                      </div>
                      <div
                        style={{
                          fontSize: '12px',
                          color: 'var(--muted)',
                          marginTop: '1px',
                        }}
                      >
                        {p.data.description}
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Writing */}
        {sortedPosts.length > 0 && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
              }}
            >
              <span style={{ fontSize: '17px', fontWeight: 600 }}>Latest Writing</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {sortedPosts.map((post) => {
                const wordCount = post.body ? post.body.split(/\s+/).length : 0;
                const readTime = Math.max(1, Math.round(wordCount / 200));
                return (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    style={{
                      textDecoration: 'none',
                      background: 'var(--surface)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      border: '1px solid var(--border)',
                      display: 'block',
                    }}
                  >
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>
                      {post.data.title}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--muted)',
                        marginTop: '2px',
                      }}
                    >
                      {new Date(post.data.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      &middot; {readTime} min read
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Contact */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span style={{ fontSize: '17px', fontWeight: 600 }}>Contact</span>
          </div>
          <div
            style={{
              background: 'var(--surface)',
              borderRadius: '14px',
              padding: '16px',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <a
              href="mailto:wardbryan3@gmail.com"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="var(--accent)"/>
              </svg>
              wardbryan3@gmail.com
            </a>
            <a
              href="https://github.com/wardbryan3"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" fill="var(--accent)"/>
              </svg>
              GitHub
            </a>
            <a
              href="https://linkedin.com/in/bryanward"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: 'var(--text)',
                textDecoration: 'none',
                fontSize: '14px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M0 1.146C0 0.513 0.526 0 1.175 0H14.825C15.474 0 16 0.513 16 1.146V14.854C16 15.487 15.474 16 14.825 16H1.175C0.526 16 0 15.487 0 14.854V1.146ZM4.943 13.394V6.169H2.542V13.394H4.943ZM3.742 5.218C4.596 5.218 5.168 4.637 5.168 3.908C5.153 3.164 4.596 2.598 3.757 2.598C2.918 2.598 2.331 3.164 2.331 3.908C2.331 4.637 2.903 5.218 3.742 5.218ZM13.394 13.394V9.459C13.394 7.306 12.186 6.319 10.587 6.319C9.32 6.319 8.626 7.036 8.31 7.528V6.169H5.923C5.954 6.883 5.923 13.394 5.923 13.394H8.31V9.614C8.31 9.35 8.325 9.086 8.4 8.896C8.612 8.369 9.105 7.827 9.944 7.827C11.042 7.827 11.5 8.669 11.5 9.884V13.394H13.394Z" fill="var(--accent)"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
