import InfoPanel from './InfoPanel';
import StatsPanel from './StatsPanel';
import SkillsPanel from './SkillsPanel';
import LinksPanel from './LinksPanel';
import TuxWireframe from './TuxWireframe';

export default function DashboardGrid({ projectCount, postCount }) {
  return (
    <div className="dashboard-grid">
      <div className="grid-area-info">
        <InfoPanel />
      </div>
      <div className="grid-area-tux">
        <div className="terminal-panel">
          <div className="panel-header">~/tux</div>
          <div className="panel-body tux-panel-body">
            <TuxWireframe />
          </div>
        </div>
      </div>
      <div className="grid-area-stats">
        <StatsPanel projectCount={projectCount} postCount={postCount} />
      </div>
      <div className="grid-area-skills">
        <SkillsPanel />
      </div>
      <div className="grid-area-links">
        <LinksPanel />
      </div>
    </div>
  );
}
