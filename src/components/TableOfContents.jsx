import { useEffect, useState } from 'react';

/**
 * @param {Object} props
 * @param {{ depth: number; slug: string; text: string }[]} [props.headings]
 */
export default function TableOfContents({ headings = [] }) {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-48px 0px -80% 0px' }
    );

    headings.forEach((h) => {
      const el = document.getElementById(h.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  const filtered = headings.filter((h) => h.depth <= 3);

  return (
    <nav className="toc" aria-label="Table of contents">
      <h4 className="toc-heading">On this page</h4>
      <ul className="toc-list">
        {filtered.map((h) => (
          <li
            key={h.slug}
            className={`toc-item toc-depth-${h.depth}${activeId === h.slug ? ' active' : ''}`}
          >
            <a href={`#${h.slug}`} className="toc-link">{h.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
