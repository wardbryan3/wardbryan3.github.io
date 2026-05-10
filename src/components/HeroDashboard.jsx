import ParticleField from './ParticleField';
import Terminal from '../terminal/Terminal';

/**
 * @param {{ projectCount?: number, postCount?: number, searchData?: any[] }} props
 */
export default function HeroDashboard({ projectCount = 0, postCount = 0, searchData = [] }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <Terminal
        page="/home"
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        side={false}
      />
    </section>
  );
}
