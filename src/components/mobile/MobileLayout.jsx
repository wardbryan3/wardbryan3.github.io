import { useOSStore } from '../../stores/osStore';
import HomeTab from './HomeTab';
import BlogTab from './BlogTab';
import WorkTab from './WorkTab';
import MobileTerminalView from './MobileTerminalView';

/**
 * @param {{ projects?: any[], posts?: any[], postCount?: number, projectCount?: number, searchData?: any[], dirs?: { name: string; description: string; count: number }[] }} props
 */
export default function MobileLayout({
  projects = [],
  posts = [],
  postCount = 0,
  projectCount = 0,
  searchData = [],
  dirs = [],
}) {
  const activeTab = useOSStore((s) => s.mobileActiveTab);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        width: '100%',
        minHeight: 0,
        position: 'relative',
      }}
    >
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {activeTab === 'home' && <HomeTab posts={posts} projects={projects} />}
        {activeTab === 'blog' && <BlogTab posts={posts} />}
        {activeTab === 'work' && <WorkTab projects={projects} />}
      </div>

      <MobileTerminalView
        projectCount={projectCount}
        postCount={postCount}
        searchData={searchData}
        dirs={dirs}
      />
    </div>
  );
}
