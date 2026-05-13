import { useState, useEffect, useRef, useCallback } from 'react';

export default function SearchModal() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [data, setData] = useState(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetch('/search-index.json')
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      setQuery('');
      setSelectedIdx(0);
    }
  }, [open]);

  const results = (data || []).filter((item) => {
    if (!query) return false;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      (item.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const blogResults = results.filter((r) => r.type === 'blog');
  const projectResults = results.filter((r) => r.type === 'projects');
  const totalResults = blogResults.length + projectResults.length;

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, totalResults - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && totalResults > 0) {
        const all = [...blogResults, ...projectResults];
        const selected = all[selectedIdx];
        if (selected) {
          window.location.href = selected.path;
        }
      }
    },
    [blogResults, projectResults, selectedIdx, totalResults]
  );

  return (
    <>
      <button
        class="search-btn"
        aria-label={open ? 'Close search' : 'Open search'}
        onClick={() => setOpen((v) => !v)}
      >
        <span class="search-icon">&#128269;</span>
      </button>
      {open && <div class="search-backdrop" onClick={() => setOpen(false)} />}
      <div
        class={`search-modal ${open ? 'search-modal--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div class="search-input-wrap">
          <span class="search-input-icon">&#128269;</span>
          <input
            ref={inputRef}
            class="search-input"
            type="text"
            placeholder="Search posts and projects..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span class="search-esc-hint">ESC</span>
        </div>
        {query && totalResults === 0 && (
          <div class="search-empty">No results found</div>
        )}
        {blogResults.length > 0 && (
          <div class="search-group">
            <div class="search-group-heading">Blog Posts</div>
            {blogResults.map((item, i) => (
              <a
                key={item.path}
                href={item.path}
                class={`search-result ${selectedIdx === i ? 'search-result--active' : ''}`}
                onMouseEnter={() => setSelectedIdx(i)}
              >
                <span class="search-result-dot search-result-dot--blog"></span>
                <div class="search-result-body">
                  <div class="search-result-title">{item.title}</div>
                  {item.tags.length > 0 && (
                    <div class="search-result-tags">{item.tags.join(', ')}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
        {projectResults.length > 0 && (
          <div class="search-group">
            <div class="search-group-heading">Projects</div>
            {projectResults.map((item, i) => (
              <a
                key={item.path}
                href={item.path}
                class={`search-result ${selectedIdx === blogResults.length + i ? 'search-result--active' : ''}`}
                onMouseEnter={() => setSelectedIdx(blogResults.length + i)}
              >
                <span class="search-result-dot search-result-dot--project"></span>
                <div class="search-result-body">
                  <div class="search-result-title">{item.title}</div>
                  {item.tags.length > 0 && (
                    <div class="search-result-tags">{item.tags.join(', ')}</div>
                  )}
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
