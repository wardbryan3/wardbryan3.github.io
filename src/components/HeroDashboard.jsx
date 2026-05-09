import ParticleField from './ParticleField';
import TitleOverlay from './TitleOverlay';
import DashboardGrid from './DashboardGrid';

export default function HeroDashboard({ projectCount = 0, postCount = 0 }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <div className="hero-content">
        <TitleOverlay />
        <DashboardGrid projectCount={projectCount} postCount={postCount} />
      </div>
    </section>
  );
}
