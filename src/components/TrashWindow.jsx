import { useState } from 'react';

const DUMMY_FILES = [
  { name: 'bad_idea.txt', content: '*cough* Comic Sans on a resume *cough*' },
  {
    name: 'deleted_project.zip',
    content:
      'This project was left in 2022. It\u2019s best that way.',
  },
];

export default function TrashWindow() {
  const [items] = useState(DUMMY_FILES);
  const [openedFile, setOpenedFile] = useState(null);

  return (
    <div
      style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        fontSize: 'calc(0.7rem * var(--os-font-mult))',
      }}
    >
      {openedFile ? (
        <div style={{ flex: 1, padding: '16px', overflow: 'auto' }}>
          <button
            onClick={() => setOpenedFile(null)}
            style={{
              background: 'none', border: '1px solid var(--border)',
              borderRadius: '3px', padding: '4px 8px', cursor: 'pointer',
              color: 'var(--text)', marginBottom: '10px', fontSize: 'calc(0.65rem * var(--os-font-mult))',
            }}
          >
            {'\u2190'} Back
          </button>
          <div
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)', borderRadius: '4px',
              padding: '12px', fontStyle: 'italic',
              color: 'var(--text-muted)',
            }}
          >
            {openedFile.content}
          </div>
        </div>
      ) : items.length > 0 ? (
        <div style={{ flex: 1, padding: '8px', overflow: 'auto' }}>
          {items.map((file, i) => (
            <div
              key={i}
              onClick={() => setOpenedFile(file)}
              style={{
                padding: '6px 8px', cursor: 'pointer',
                borderBottom: '1px solid var(--border)',
                display: 'flex', gap: '6px', alignItems: 'center',
              }}
            >
              <span>{'\uD83D\uDCC4'}</span>
              <span>{file.name}</span>
            </div>
          ))}
        </div>
      ) : (
        <div
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '20px', textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: '2rem', marginBottom: '8px', opacity: 0.5,
            }}
          >
            {'\uD83D\uDDD1'}
          </div>
          <p
            style={{
              color: 'var(--text-muted)', fontStyle: 'italic',
              fontSize: 'calc(0.7rem * var(--os-font-mult))', lineHeight: '1.6',
            }}
          >
            Nothing spilled yet. Drag my other windows over the trash to delete
            them \u2014 they\u2019ll come back after a refresh.
          </p>
        </div>
      )}
    </div>
  );
}
