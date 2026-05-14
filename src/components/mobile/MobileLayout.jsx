import { useEffect } from 'react';
import { useOSStore } from '../../stores/osStore';
import ErrorBoundary from '../ErrorBoundary';
import ParticleField from '../ParticleField';
import DigitalRain from '../DigitalRain';
import HexField from '../HexField';
import HomeTab from './HomeTab';
import BlogTab from './BlogTab';
import WorkTab from './WorkTab';

const WALLPAPER_CSS = {
  dots: { backgroundImage: 'radial-gradient(var(--border) 1px, transparent 1px)', backgroundSize: '24px 24px' },
  grid: { backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)', backgroundSize: '40px 40px' },
};

/**
 * @param {{ projects?: any[], posts?: any[] }} props
 */
export default function MobileLayout({
  projects = [],
  posts = [],
}) {
  const activeTab = useOSStore((s) => s.mobileActiveTab);
  const theme = useOSStore((s) => s.theme);
  const wallpaper = useOSStore((s) => s.wallpaper);
  const fontSize = useOSStore((s) => s.fontSize);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    const mult = fontSize === 'medium' ? 1.2 : fontSize === 'large' ? 1.4 : 1;
    document.documentElement.style.setProperty('--os-font-mult', String(mult));
  }, [fontSize]);

  const wallpaperStyle = WALLPAPER_CSS[wallpaper]
    ? { background: 'var(--bg)', ...WALLPAPER_CSS[wallpaper] }
    : {};

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        minHeight: 0,
        position: 'relative',
        ...wallpaperStyle,
      }}
    >
      <ErrorBoundary>
        {wallpaper === 'particle-field' && <ParticleField />}
        {wallpaper === 'digital-rain' && <DigitalRain />}
        {wallpaper === 'hex-field' && <HexField />}
      </ErrorBoundary>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', zIndex: 1 }}>
        {activeTab === 'home' && <HomeTab posts={posts} projects={projects} />}
        {activeTab === 'blog' && <BlogTab posts={posts} />}
        {activeTab === 'work' && <WorkTab projects={projects} />}
      </div>
    </div>
  );
}
