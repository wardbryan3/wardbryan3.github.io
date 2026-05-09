import ParticleField from './ParticleField';
import Terminal from '../terminal/Terminal';

export default function HeroDashboard({ projectCount = 0, postCount = 0, searchData = [] }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <div className="hero-content">
        <Terminal
          page="/home"
          projectCount={projectCount}
          postCount={postCount}
          searchData={searchData}
          side={false}
        />
      </div>
    </section>
  );
}
