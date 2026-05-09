import ParticleField from './ParticleField';
import FastfetchWindow from './FastfetchWindow';

export default function HeroDashboard({ projectCount = 0, postCount = 0 }) {
  return (
    <section className="hero-dashboard">
      <ParticleField />
      <div className="hero-content">
        <FastfetchWindow projectCount={projectCount} postCount={postCount} />
      </div>
    </section>
  );
}
