import ParticleField from './ParticleField';
import Terminal from '../terminal/Terminal';
import ErrorBoundary from './ErrorBoundary';

/**
 * @param {{ projectCount?: number, postCount?: number, searchData?: any[], dirs?: { name: string; description: string; count: number }[] }} props
 */
export default function HeroDashboard({ projectCount = 0, postCount = 0, searchData = [], dirs = [] }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <ErrorBoundary>
        <Terminal
          page="/home"
          projectCount={projectCount}
          postCount={postCount}
          searchData={searchData}
          dirs={dirs}
          side={false}
        />
      </ErrorBoundary>
    </section>
  );
}
