export default function LinksPanel() {
  return (
    <div className="terminal-panel">
      <div className="panel-header">~/links</div>
      <div className="panel-body">
        <div className="links-list">
          <a
            href="https://github.com/bryanward"
            target="_blank"
            rel="noopener noreferrer"
            className="link-item"
          >
            <span className="link-label">repo</span>
            <span>github.com/bryanward</span>
          </a>
          <a
            href="https://linkedin.com/in/bryanward"
            target="_blank"
            rel="noopener noreferrer"
            className="link-item"
          >
            <span className="link-label">in</span>
            <span>linkedin.com/in/bryanward</span>
          </a>
        </div>
        <div className="links-prompt">
          <span className="prompt-symbol">$</span>
          <span className="prompt-text">building the web, one commit at a time</span>
          <span className="prompt-cursor">_</span>
        </div>
      </div>
    </div>
  );
}
