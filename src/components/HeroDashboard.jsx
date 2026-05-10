import ParticleField from './ParticleField';
import Terminal from '../terminal/Terminal';
import ErrorBoundary from './ErrorBoundary';

/**
 * @param {{ projectCount?: number, postCount?: number, searchData?: any[] }} props
 */
export default function HeroDashboard({ projectCount = 0, postCount = 0, searchData = [] }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <ErrorBoundary>
        <Terminal
          page="/home"
          projectCount={projectCount}
          postCount={postCount}
          searchData={searchData}
          side={false}
        />
      </ErrorBoundary>
    </section>
  );
}
