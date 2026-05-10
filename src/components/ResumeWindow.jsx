export default function ResumeWindow() {
  return (
    <div
      style={{
        height: '100%', overflow: 'auto', fontFamily: 'var(--font-mono)',
        fontSize: '0.7rem', padding: '16px', lineHeight: '1.6',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div
          style={{
            fontWeight: 700, fontSize: '0.85rem',
            color: 'var(--text)',
          }}
        >
          BRYAN WARD
        </div>
        <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>
          wardbryan3@gmail.com | linkedin.com/in/bryanward | github.com/wardbryan3
        </div>
      </div>

      <Section title="EXPERIENCE">
        <div style={{ fontWeight: 600 }}>
          Software Engineering Intern — Company Name
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
          Jan 2025 - Present
        </div>
        <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
          <li>Built and shipped features serving 10k+ users</li>
          <li>Reduced CI pipeline time by 40%</li>
        </ul>
      </Section>

      <Section title="SKILLS">
        <div style={{ fontSize: '0.65rem' }}>
          TypeScript, React, Python, Go, PostgreSQL, Docker
        </div>
      </Section>

      <Section title="EDUCATION">
        <div style={{ fontWeight: 600 }}>
          B.S. Computer Science — University Name
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}>
          Expected 2026
        </div>
      </Section>

      <div
        style={{
          textAlign: 'center', marginTop: '16px', paddingTop: '12px',
          borderTop: '1px solid var(--border)',
        }}
      >
        <a
          href="/resume.pdf"
          download
          style={{
            display: 'inline-block', padding: '6px 16px',
            border: '1px solid var(--accent)', borderRadius: '4px',
            color: 'var(--accent)', textDecoration: 'none',
            fontSize: '0.65rem',
          }}
        >
          {'\u2B07'} Download PDF
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div
        style={{
          fontWeight: 600, fontSize: '0.7rem',
          borderBottom: '1px solid var(--border)', marginBottom: '4px',
          color: 'var(--accent)',
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
