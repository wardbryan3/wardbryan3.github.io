function renderSearchResults(results, keyword) {
  if (results.length === 0) return { output: <div className="term-text term-muted">no matches for: {keyword}</div> };
  return {
    output: (
      <div className="term-output">
        {results.map((item, i) => (
          <div key={i} className="term-text">
            <a href={item.path} className="ff-value-link">{item.type}/{item.slug}</a>
            <span className="term-muted">  {item.title}</span>
          </div>
        ))}
      </div>
    ),
  };
}

export function createCommands({ page, projectCount, postCount, searchData, dirs = [] }) {
  const normalizePage = (p) => p === '/home' ? '/' : p;
  const resolveParent = (p) => {
    if (p === '/') return '/';
    const parts = p.replace(/^\/|\/$/g, '').split('/');
    parts.pop();
    return parts.length === 0 ? '/' : '/' + parts.join('/');
  };
  const commands = {};

  commands.help = {
    description: 'show available commands',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text">Available commands:</div>
          {[
            ['help', 'show this message'],
            ['whoami', 'about me'],
            ['pwd', 'current page'],
            ['date', 'date and time'],
            ['echo', 'echo text back'],
            ['clear', 'clear terminal'],
            ['history', 'recent commands'],
            ['fastfetch', 'system info'],
            ['ls', 'list directories (ls, ls blog)'],
            ['cd', 'navigate pages (cd blog, cd post)'],
            ['cat', 'view content'],
            ['find', 'search by name'],
            ['grep', 'search by content'],
            ['top', 'site activity'],
          ].map(([name, desc]) => (
            <div key={name} className="term-text">
              <span className="ff-value-green">  {name.padEnd(10)}</span>
              <span className="term-muted">— {desc}</span>
            </div>
          ))}
        </div>
      ),
    }),
  };

  commands.whoami = {
    description: 'about me',
    handler: () => ({
      output: (
        <div className="term-text">
          Bryan Ward — CS student and developer from southern Oregon. Linux
          enthusiast, FOSS advocate, exploring agentic engineering and AI tooling.
        </div>
      ),
    }),
  };

  commands.pwd = {
    description: 'current page',
    handler: () => ({
      output: <div className="term-text">{normalizePage(page)}</div>,
    }),
  };

  commands.date = {
    description: 'date and time',
    handler: () => ({
      output: <div className="term-text">{new Date().toString()}</div>,
    }),
  };

  commands.echo = {
    description: 'echo text back',
    handler: (args) => ({
      output: <div className="term-text">{args.join(' ') || ''}</div>,
    }),
  };

  commands.clear = {
    description: 'clear terminal',
    handler: () => ({ action: 'clear' }),
  };

  commands.history = {
    description: 'recent commands',
    handler: (_args, ctx) => {
      const hist = ctx.registry.getHistory();
      if (hist.length === 0)
        return { output: <div className="term-text term-muted">no history</div> };
      return {
        output: (
          <div className="term-output">
            {hist.map((cmd, i) => (
              <div key={i} className="term-text">
                <span className="term-muted">{String(i + 1).padStart(3)}</span>  {cmd}
              </div>
            ))}
          </div>
        ),
      };
    },
  };

  commands.fastfetch = {
    description: 'system info',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text"><span className="term-muted">name     </span><span className="ff-value-green">Bryan Ward</span></div>
          <div className="term-text"><span className="term-muted">status   </span><span className="ff-value-green">learning and building</span></div>
          <div className="term-text"><span className="term-muted">level    </span><span className="ff-value-purple">CS student / developer</span></div>
          <div className="term-text"><span className="term-muted">focus    </span>full-stack web, Linux, FOSS</div>
          <div className="term-text"><span className="term-muted">tools    </span>Python, Java, JavaScript, HTML, CSS, Bash, Node.js, React, Spring Boot, Git, Linux, Astro</div>
          <div className="term-text"><span className="term-muted">projects </span>{projectCount} active</div>
          <div className="term-text"><span className="term-muted">posts    </span>{postCount} published</div>
        </div>
      ),
    }),
  };

  commands.ls = {
    description: 'list sections',
    handler: (args) => {
      if (!searchData || searchData.length === 0) return { output: <div className="term-text term-muted">no search data</div> };
      const raw = args[0];
      if (!raw || raw === '/' || raw === '~') {
        return {
          output: (
            <div className="term-output">
              {dirs.map(d => (
                <div key={d.name} className="term-text">
                  <span className="ff-value-link">{d.name}/</span>
                  <span className="term-muted">  {d.description} ({d.count})</span>
                </div>
              ))}
              <div className="term-text">README.md</div>
            </div>
          ),
        };
      }

      const target = raw.replace(/\/+$/, '');

      if (target === 'blog') {
        const items = searchData.filter(e => e.type === 'blog');
        return {
          output: (
            <div className="term-output">
              {items.map(item => (
                <div key={item.slug} className="term-text">
                  <a href={item.path} className="ff-value-link">{item.slug}/</a>
                  <span className="term-muted">  {item.title}</span>
                  {item.date && <span className="term-muted" style={{ float: 'right' }}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
                </div>
              ))}
            </div>
          ),
        };
      }

      if (target === 'projects') {
        const items = searchData.filter(e => e.type === 'projects');
        return {
          output: (
            <div className="term-output">
              {items.map(item => (
                <div key={item.slug} className="term-text">
                  <a href={item.path} className="ff-value-link">{item.slug}/</a>
                  <span className="term-muted">  {item.title}</span>
                </div>
              ))}
            </div>
          ),
        };
      }

      return { output: <div className="term-text term-muted">ls: cannot access '{raw}': No such directory</div> };
    },
  };

  commands.cd = {
    description: 'navigate to a page',
    handler: (args) => {
      const target = args[0];
      const current = normalizePage(page);

      if (!target || target === '~' || target === '/' || target === 'home') {
        if (current === '/')
          return { output: <div className="term-text">already at /</div> };
        return {
          output: <div className="term-text">navigating to <a href="/" className="ff-value-link">/</a>...</div>,
          action: 'navigate',
          url: '/',
        };
      }

      if (target === '.') {
        return { output: <div className="term-text">{current}</div> };
      }

      if (target === '..') {
        const parent = resolveParent(current);
        if (parent === current)
          return { output: <div className="term-text term-muted">already at root</div> };
        return {
          output: <div className="term-text">navigating to <a href={parent} className="ff-value-link">{parent}</a>...</div>,
          action: 'navigate',
          url: parent,
        };
      }

      if (target === 'blog') {
        return {
          output: <div className="term-text">navigating to <a href="/blog" className="ff-value-link">/blog</a>...</div>,
          action: 'navigate',
          url: '/blog',
        };
      }

      if (target === 'projects') {
        return {
          output: <div className="term-text">navigating to <a href="/projects" className="ff-value-link">/projects</a>...</div>,
          action: 'navigate',
          url: '/projects',
        };
      }

      const slashIndex = target.indexOf('/');
      if (slashIndex > 0) {
        const prefix = target.slice(0, slashIndex);
        const slug = target.slice(slashIndex + 1);
        if ((prefix === 'blog' || prefix === 'projects') && slug) {
          const entry = searchData.find(e => e.type === prefix && e.slug === slug);
          if (entry) {
            return {
              output: <div className="term-text">navigating to <a href={entry.path} className="ff-value-link">{entry.path}</a>...</div>,
              action: 'navigate',
              url: entry.path,
            };
          }
        }
        return { output: <div className="term-text term-muted">cd: no such directory: {target}</div> };
      }

      const exactMatch = searchData.find(e => e.slug === target);
      if (exactMatch) {
        return {
          output: <div className="term-text">navigating to <a href={exactMatch.path} className="ff-value-link">{exactMatch.path}</a>...</div>,
          action: 'navigate',
          url: exactMatch.path,
        };
      }

      const matches = searchData.filter(e => e.slug.includes(target));
      if (matches.length === 1) {
        return {
          output: <div className="term-text">navigating to <a href={matches[0].path} className="ff-value-link">{matches[0].path}</a>...</div>,
          action: 'navigate',
          url: matches[0].path,
        };
      }
      if (matches.length > 1) {
        return {
          output: (
            <div className="term-output">
              {matches.map((item, i) => (
                <div key={i} className="term-text">
                  <a href={item.path} className="ff-value-link">{item.type}/{item.slug}</a>
                  <span className="term-muted">  {item.title}</span>
                </div>
              ))}
            </div>
          ),
        };
      }

      return { output: <div className="term-text term-muted">cd: no such directory: {target}</div> };
    },
  };

  commands.cat = {
    description: 'view content',
    handler: (args) => {
      const file = args[0];
      if (!file) return { output: <div className="term-text term-muted">cat: missing filename</div> };
      if (file === 'README.md') {
        return { output: <div className="term-text">Hi, I'm Bryan — a CS student and developer from southern Oregon. Type 'ls' to explore.</div> };
      }
      return { output: <div className="term-text term-muted">cat: no such file: {file}</div> };
    },
  };

  commands.find = {
    description: 'search by name',
    handler: (args) => {
      const keyword = args.join(' ').toLowerCase();
      if (!keyword) return { output: <div className="term-text term-muted">find: missing search term</div> };
      if (!searchData || searchData.length === 0) return { output: <div className="term-text term-muted">no search data</div> };
      const results = searchData.filter(item => item.title.toLowerCase().includes(keyword));
      return renderSearchResults(results, keyword);
    },
  };

  commands.grep = {
    description: 'search by content',
    handler: (args) => {
      const keyword = args.join(' ').toLowerCase();
      if (!keyword) return { output: <div className="term-text term-muted">grep: missing search term</div> };
      if (!searchData || searchData.length === 0) return { output: <div className="term-text term-muted">no search data</div> };
      const results = searchData.filter(item => {
        const inTitle = item.title.toLowerCase().includes(keyword);
        const inTags = item.tags && item.tags.some(tag => tag.toLowerCase().includes(keyword));
        return inTitle || inTags;
      });
      return renderSearchResults(results, keyword);
    },
  };

  commands.top = {
    description: 'site activity',
    handler: () => ({
      output: (
        <div className="term-output">
          <div className="term-text">Tasks: {projectCount + postCount} total, {projectCount} running, {postCount} sleeping</div>
          <div className="term-text" style={{ marginTop: 4 }}>
            <span className="term-muted">PID</span>  <span className="term-muted">USER</span>      <span className="term-muted">%CPU</span> <span className="term-muted">COMMAND</span>
          </div>
          <div className="term-text">  1  bryan      0.0  /sbin/build</div>
          <div className="term-text">  2  bryan      5.2  /usr/bin/deploy</div>
          <div className="term-text">  3  bryan      3.1  /usr/bin/code</div>
          <div className="term-text">  4  bryan     12.7  /usr/bin/coffee</div>
          <div className="term-text">  5  bryan      0.3  /usr/bin/zsh</div>
        </div>
      ),
    }),
  };

  return commands;
}
