import MobileHeader from './MobileHeader';

/**
 * @param {{ posts?: any[] }} props
 */
export default function BlogTab({ posts = [] }) {
  const sorted = [...posts].sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return (
    <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <MobileHeader title="Blog" />
      <div
        style={{ padding: '0 16px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {sorted.map((post) => {
          const wordCount = post.body ? post.body.split(/\s+/).length : 0;
          const readTime = Math.max(1, Math.round(wordCount / 200));
          return (
            <a
              key={post.slug}
              href={`/blog/${post.slug}`}
              style={{
                textDecoration: 'none',
                background: 'var(--surface)',
                borderRadius: '12px',
                padding: '16px',
                border: '1px solid var(--border)',
                display: 'block',
              }}
            >
              <div
                style={{
                  fontSize: 'calc(16px * var(--os-font-mult, 1))',
                  fontWeight: 600,
                  color: 'var(--text)',
                  marginBottom: '4px',
                }}
              >
                {post.data.title}
              </div>
              <div
                style={{
                  fontSize: 'calc(13px * var(--os-font-mult, 1))',
                  color: 'var(--muted)',
                  lineHeight: 1.5,
                  marginBottom: '8px',
                }}
              >
                {post.data.description}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: 'calc(11px * var(--os-font-mult, 1))',
                  color: 'var(--muted)',
                }}
              >
                <span>
                  {new Date(post.data.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span>&middot;</span>
                <span>{readTime} min read</span>
              </div>
              {post.data.tags && post.data.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '8px' }}>
                  {post.data.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 'calc(10px * var(--os-font-mult, 1))',
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
            </a>
          );
        })}
      </div>
    </div>
  );
}
