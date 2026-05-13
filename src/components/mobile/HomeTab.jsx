import { useOSStore } from '../../stores/osStore';
import MobileHeader from './MobileHeader';

const FALLBACK_POSTS = [];
const FALLBACK_PROJECTS = [];

export default function HomeTab({ posts = FALLBACK_POSTS, projects = FALLBACK_PROJECTS }) {
  const openMoreSheet = useOSStore((s) => s.openMoreSheet);
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
          <div
            style={{
              marginTop: '12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {['TypeScript', 'React', 'Python'].map((tag) => (
              <span
                key={tag}
                style={{
                  background: 'var(--accent)',
                  color: 'var(--bg)',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
            <span
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                color: 'var(--text)',
              }}
            >
              +3
            </span>
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

        {/* Terminal shortcut */}
        <div
          onClick={openMoreSheet}
          style={{
            background: 'var(--surface)',
            borderRadius: '12px',
            padding: '14px',
            border: '1px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            cursor: 'pointer',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background: 'var(--bg)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'monospace',
              fontSize: '16px',
              fontWeight: 'bold',
              color: 'var(--accent)',
            }}
          >
            &gt;
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)' }}>
              Open Terminal
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>
              Navigate the site with commands
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
