# Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the minimal TerminalHero homepage with a full-viewport React-powered terminal dashboard featuring WebGL particle background, procedural 3D Tux wireframe, and layered CSS effects.

**Architecture:** Add `@astrojs/react` integration, then build a React island (`HeroDashboard.jsx`) that composes a Three.js particle background, a CSS grid of terminal-style panels (info, stats, skills, links), a procedural Tux wireframe rendered in one panel, and a glowing title overlay. Nav and Footer get corner-pushed. TerminalHero.astro is removed.

**Tech Stack:** Astro 5, React 19, @react-three/fiber, Three.js, CSS custom properties (existing theme)

---

## File Map

| File | Action | Role |
|------|--------|------|
| `src/components/ParticleField.jsx` | Create | Three.js particle system background |
| `src/components/TuxWireframe.jsx` | Create | Procedural Tux penguin as wireframe edges |
| `src/components/InfoPanel.jsx` | Create | Terminal box: name, status, focus |
| `src/components/StatsPanel.jsx` | Create | Terminal box: project/post/language counts |
| `src/components/SkillsPanel.jsx` | Create | Terminal box: tech tag chips |
| `src/components/LinksPanel.jsx` | Create | Terminal box: GitHub, LinkedIn, motd |
| `src/components/DashboardGrid.jsx` | Create | CSS grid layout composing all panels |
| `src/components/TitleOverlay.jsx` | Create | Large glowing name with cursor |
| `src/components/HeroDashboard.jsx` | Create | Root React island composing everything |
| `src/components/TerminalHero.astro` | Delete | Replaced by HeroDashboard |
| `src/pages/index.astro` | Modify | Use HeroDashboard instead of TerminalHero |
| `src/components/Nav.astro` | Modify | Corner-push: remove max-width, full-width bar |
| `src/components/Footer.astro` | Modify | Corner-push: remove max-width, full-width bar |
| `src/styles/global.css` | Modify | Add dashboard utility classes |
| `package.json` | Modify | Add React and Three.js deps |
| `astro.config.mjs` | Modify | Add @astrojs/react integration |

---

### Task 1: Install Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install React and Three.js packages**

```bash
npm install @astrojs/react react react-dom @react-three/fiber @react-three/drei three
```

Run: from project root
Expected: packages installed, package.json updated

- [ ] **Step 2: Verify package.json has all new deps**

Run: `node -e "const p = require('./package.json'); console.log(Object.keys(p.dependencies).join('\n'))"`
Expected output includes: `@astrojs/react`, `react`, `react-dom`, `@react-three/fiber`, `@react-three/drei`, `three`

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add React, react-three-fiber, and Three.js dependencies"
```

---

### Task 2: Configure Astro for React

**Files:**
- Modify: `astro.config.mjs`

- [ ] **Step 1: Add @astrojs/react integration to astro config**

Edit `astro.config.mjs` to import and add the react integration:

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://bryanward.dev',
  integrations: [mdx(), sitemap(), react()],
});
```

Use Edit tool with oldString:
```
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://bryanward.dev',
  integrations: [mdx(), sitemap()],
});
```

newString:
```
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://bryanward.dev',
  integrations: [mdx(), sitemap(), react()],
});
```

- [ ] **Step 2: Run type check to verify configuration**

Run: `npx astro check`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add astro.config.mjs
git commit -m "feat: add @astrojs/react integration"
```

---

### Task 3: Create ParticleField Component

**Files:**
- Create: `src/components/ParticleField.jsx`

- [ ] **Step 1: Write the ParticleField component**

```jsx
import { Canvas } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Particles({ count = 600 }) {
  const meshRef = useRef(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const accentColor = new THREE.Color('#00ff66');
    const primaryColor = new THREE.Color('#8800cc');

    for (let i = 0; i < count; i++) {
      const r = 4 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const colorChoice = Math.random() > 0.6 ? accentColor : primaryColor;
      colors[i * 3] = colorChoice.r;
      colors[i * 3 + 1] = colorChoice.g;
      colors[i * 3 + 2] = colorChoice.b;
    }
    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.04;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.06;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={positions.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function ParticleField() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      dpr={[1, 1.5]}
    >
      <Particles />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ParticleField.jsx
git commit -m "feat: add Three.js particle field background component"
```

---

### Task 4: Create TuxWireframe Component

**Files:**
- Create: `src/components/TuxWireframe.jsx`

- [ ] **Step 1: Write the TuxWireframe component**

```jsx
import { Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function TuxMesh() {
  const groupRef = useRef(null);

  const parts = useMemo(() => {
    const bodyGeo = new THREE.SphereGeometry(0.6, 20, 16);
    const body = new THREE.Mesh(bodyGeo);
    body.scale.set(1, 1.25, 0.8);
    body.position.set(0, 0, 0);

    const headGeo = new THREE.SphereGeometry(0.35, 14, 12);
    const head = new THREE.Mesh(headGeo);
    head.position.set(0, 0.85, 0.05);

    const beakGeo = new THREE.ConeGeometry(0.07, 0.14, 8, 1);
    const beak = new THREE.Mesh(beakGeo);
    beak.position.set(0, 0.85, 0.36);
    beak.rotation.x = -Math.PI / 2;

    const leftEyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const leftEye = new THREE.Mesh(leftEyeGeo);
    leftEye.position.set(0.11, 1.0, 0.28);

    const rightEyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const rightEye = new THREE.Mesh(rightEyeGeo);
    rightEye.position.set(-0.11, 1.0, 0.28);

    const leftFlipperGeo = new THREE.BoxGeometry(0.08, 0.45, 0.04);
    const leftFlipper = new THREE.Mesh(leftFlipperGeo);
    leftFlipper.position.set(-0.52, 0.05, 0);
    leftFlipper.rotation.z = 0.5;
    leftFlipper.rotation.y = 0.3;

    const rightFlipperGeo = new THREE.BoxGeometry(0.08, 0.45, 0.04);
    const rightFlipper = new THREE.Mesh(rightFlipperGeo);
    rightFlipper.position.set(0.52, 0.05, 0);
    rightFlipper.rotation.z = -0.5;
    rightFlipper.rotation.y = -0.3;

    const leftFootGeo = new THREE.BoxGeometry(0.22, 0.04, 0.18);
    const leftFoot = new THREE.Mesh(leftFootGeo);
    leftFoot.position.set(-0.15, -0.72, 0.12);

    const rightFootGeo = new THREE.BoxGeometry(0.22, 0.04, 0.18);
    const rightFoot = new THREE.Mesh(rightFootGeo);
    rightFoot.position.set(0.15, -0.72, 0.12);

    const allParts = [
      body, head, beak,
      leftEye, rightEye,
      leftFlipper, rightFlipper,
      leftFoot, rightFoot,
    ];

    const mergedGeometry = new THREE.BufferGeometry();
    const mergedPositions = [];

    for (const part of allParts) {
      part.updateMatrixWorld();
      const geo = part.geometry.clone();
      geo.applyMatrix4(part.matrixWorld);
      const posAttr = geo.getAttribute('position');
      for (let i = 0; i < posAttr.count; i++) {
        mergedPositions.push(
          posAttr.getX(i),
          posAttr.getY(i),
          posAttr.getZ(i)
        );
      }
    }

    mergedGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(mergedPositions, 3)
    );

    const edges = new THREE.EdgesGeometry(mergedGeometry, 15);
    return edges;
  }, []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={parts}>
        <lineBasicMaterial color="#00ff66" transparent opacity={0.85} />
      </lineSegments>
    </group>
  );
}

export default function TuxWireframe() {
  return (
    <Canvas
      camera={{ position: [0, 0.15, 2.5], fov: 40 }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0} />
      <TuxMesh />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TuxWireframe.jsx
git commit -m "feat: add procedural Tux penguin wireframe component"
```

---

### Task 5: Create InfoPanel Component

**Files:**
- Create: `src/components/InfoPanel.jsx`

- [ ] **Step 1: Write the InfoPanel component**

```jsx
const rows = [
  { label: 'name', value: 'Bryan Ward' },
  { label: 'status', value: 'CS Student', accent: true },
  { label: 'level', value: '2nd Year (200-level)' },
  { label: 'focus', value: 'Full-stack development' },
  { label: 'tools', value: 'TypeScript, Python, Java, C++' },
  { label: 'shell', value: 'bash' },
];

export default function InfoPanel() {
  return (
    <div className="terminal-panel">
      <div className="panel-header">~/whoami</div>
      <div className="panel-body">
        <table className="info-table">
          <tbody>
            {rows.map(({ label, value, accent }) => (
              <tr key={label}>
                <td className="info-label">{label}</td>
                <td className={accent ? 'info-value info-value-accent' : 'info-value'}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/InfoPanel.jsx
git commit -m "feat: add InfoPanel terminal component"
```

---

### Task 6: Create StatsPanel Component

**Files:**
- Create: `src/components/StatsPanel.jsx`

- [ ] **Step 1: Write the StatsPanel component**

```jsx
export default function StatsPanel({ projectCount = 0, postCount = 0 }) {
  const stats = [
    { label: 'projects', value: projectCount, color: '#00ff66' },
    { label: 'posts', value: postCount, color: '#8800cc' },
    { label: 'languages', value: 5, color: '#00ff66' },
  ];

  return (
    <div className="terminal-panel">
      <div className="panel-header">~/stats</div>
      <div className="panel-body">
        <div className="stats-grid">
          {stats.map(({ label, value, color }) => (
            <div className="stat-item" key={label}>
              <span className="stat-value" style={{ color }}>
                {value}
              </span>
              <span className="stat-label">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/StatsPanel.jsx
git commit -m "feat: add StatsPanel terminal component"
```

---

### Task 7: Create SkillsPanel Component

**Files:**
- Create: `src/components/SkillsPanel.jsx`

- [ ] **Step 1: Write the SkillsPanel component**

```jsx
const skills = [
  'TypeScript', 'JavaScript', 'React', 'Next.js', 'Node.js',
  'Python', 'Java', 'C++', 'Rust', 'SQL',
  'Git', 'Docker', 'Linux', 'Astro',
];

export default function SkillsPanel() {
  return (
    <div className="terminal-panel">
      <div className="panel-header">~/tools</div>
      <div className="panel-body">
        <div className="skills-wrap">
          {skills.map((skill) => (
            <span key={skill} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/SkillsPanel.jsx
git commit -m "feat: add SkillsPanel terminal component"
```

---

### Task 8: Create LinksPanel Component

**Files:**
- Create: `src/components/LinksPanel.jsx`

- [ ] **Step 1: Write the LinksPanel component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LinksPanel.jsx
git commit -m "feat: add LinksPanel terminal component"
```

---

### Task 9: Create TitleOverlay Component

**Files:**
- Create: `src/components/TitleOverlay.jsx`

- [ ] **Step 1: Write the TitleOverlay component**

```jsx
export default function TitleOverlay() {
  return (
    <div className="title-overlay">
      <h1 className="hero-title">
        BRYAN_WARD
        <span className="hero-cursor">_</span>
      </h1>
      <p className="hero-subtitle">~/full-stack-dev $ whoami</p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TitleOverlay.jsx
git commit -m "feat: add glowing TitleOverlay component"
```

---

### Task 10: Create DashboardGrid Component

**Files:**
- Create: `src/components/DashboardGrid.jsx`

- [ ] **Step 1: Write the DashboardGrid component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/DashboardGrid.jsx
git commit -m "feat: add DashboardGrid layout component"
```

---

### Task 11: Create HeroDashboard Root Component

**Files:**
- Create: `src/components/HeroDashboard.jsx`

- [ ] **Step 1: Write the HeroDashboard component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/HeroDashboard.jsx
git commit -m "feat: add HeroDashboard root component"
```

---

### Task 12: Update Index Page and Remove TerminalHero

**Files:**
- Modify: `src/pages/index.astro`
- Delete: `src/components/TerminalHero.astro`

- [ ] **Step 1: Rewrite index.astro**

Replace the entire file content:

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../layouts/BaseLayout.astro';
import HeroDashboard from '../components/HeroDashboard';

const projects = await getCollection('projects');
const posts = await getCollection('blog');
const projectCount = projects.length;
const postCount = posts.length;
---

<BaseLayout title="Home" description="Bryan Ward - CS student and developer">
  <HeroDashboard projectCount={projectCount} postCount={postCount} client:load />
</BaseLayout>
```

Use Write tool to replace the file.

- [ ] **Step 2: Delete TerminalHero.astro**

```bash
rm src/components/TerminalHero.astro
```

- [ ] **Step 3: Run astro check**

Run: `npx astro check`
Expected: No errors

- [ ] **Step 4: Commit**

```bash
git rm src/components/TerminalHero.astro
git add src/pages/index.astro
git commit -m "feat: replace TerminalHero with HeroDashboard on home page"
```

---

### Task 13: Add Dashboard CSS to Global Styles

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Append dashboard styles to global.css**

Add the following CSS at the end of `src/styles/global.css`:

```css
.hero-dashboard {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem 2rem;
  overflow: hidden;
  isolation: isolate;
}

.hero-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.title-overlay {
  text-align: center;
}

.hero-title {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 5vw, 3rem);
  font-weight: 700;
  color: var(--accent);
  text-shadow:
    0 0 10px var(--accent-glow),
    0 0 40px var(--accent-glow),
    0 0 80px rgba(0, 255, 102, 0.15);
  letter-spacing: 0.15em;
  margin-bottom: 0.25rem;
  position: relative;
  display: inline-block;
  transition: text-shadow 0.3s;
}

.hero-title:hover {
  text-shadow:
    0 0 10px var(--accent-glow),
    0 0 40px var(--accent-glow),
    0 0 80px rgba(0, 255, 102, 0.2),
    0 0 120px rgba(0, 255, 102, 0.1);
}

.hero-cursor {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
  vertical-align: text-bottom;
  margin-left: 0.1em;
}

.hero-subtitle {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 0.75rem;
  width: 100%;
  grid-template-areas:
    "info tux stats"
    "skills skills links";
}

.grid-area-info { grid-area: info; }
.grid-area-tux { grid-area: tux; }
.grid-area-stats { grid-area: stats; }
.grid-area-skills { grid-area: skills; }
.grid-area-links { grid-area: links; }

.terminal-panel {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.terminal-panel:hover {
  border-color: var(--accent);
  box-shadow: 0 0 12px rgba(0, 255, 102, 0.08);
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.75rem;
  border-bottom: 1px solid var(--border);
  color: var(--accent);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.panel-body {
  padding: 0.75rem;
  line-height: 1.6;
}

.tux-panel-body {
  padding: 0;
  height: 200px;
  overflow: hidden;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
}

.info-table td {
  padding: 0.2rem 0;
  vertical-align: top;
}

.info-label {
  color: var(--accent);
  padding-right: 0.75rem;
  white-space: nowrap;
}

.info-value {
  color: var(--text);
}

.info-value-accent {
  color: var(--accent);
  text-shadow: 0 0 4px var(--accent-glow);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.6rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.skills-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skill-tag {
  display: inline-block;
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--border);
  border-radius: 9999px;
  color: var(--text);
  background: var(--surface-hover);
  transition: border-color 0.2s, color 0.2s, text-shadow 0.2s;
}

.skill-tag:hover {
  border-color: var(--accent);
  color: var(--accent);
  text-shadow: 0 0 4px var(--accent-glow);
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 0.75rem;
}

.link-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.7rem;
  color: var(--text);
  text-decoration: none;
  transition: color 0.2s;
}

.link-item:hover {
  color: var(--accent);
}

.link-label {
  color: var(--accent);
  min-width: 2.5rem;
}

.links-prompt {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.prompt-symbol {
  color: var(--accent);
}

.prompt-text {
  color: var(--text-muted);
}

.prompt-cursor {
  display: inline-block;
  width: 0.4em;
  height: 1em;
  background: var(--accent);
  animation: blink 1s step-end infinite;
}

@media (max-width: 768px) {
  .hero-dashboard {
    padding: 3rem 1rem 1.5rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "info stats"
      "tux tux"
      "skills skills"
      "links links";
  }

  .tux-panel-body {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "info"
      "stats"
      "tux"
      "skills"
      "links";
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/global.css
git commit -m "feat: add dashboard grid and terminal panel styles"
```

---

### Task 14: Corner-Push Nav

**Files:**
- Modify: `src/components/Nav.astro`

- [ ] **Step 1: Update Nav to span full width and push corners**

Replace the `<style>` block. The template markup stays the same; only CSS changes.

oldString:
```
<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5, 0, 10, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
  }
```

newString:
```
<style>
  nav {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(5, 0, 10, 0.85);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }

  .nav-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 2rem;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat: corner-push nav to full width"
```

---

### Task 15: Corner-Push Footer

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Update Footer to span full width and push corners**

Replace the footer-inner style. The markup stays the same.

oldString:
```
  .footer-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
```

newString:
```
  .footer-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.5rem;
  }
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat: corner-push footer to full width"
```

---

### Task 16: Build and Verify

**Files:**
- None (verification only)

- [ ] **Step 1: Run astro check**

```bash
npx astro check
```
Expected: No TypeScript errors

- [ ] **Step 2: Run astro build**

```bash
npm run build
```
Expected: Successful SSG build with no errors

- [ ] **Step 3: Verify TerminalHero is gone**

```bash
ls src/components/TerminalHero.astro 2>&1
```
Expected: `No such file or directory`

- [ ] **Step 4: Verify no import errors in the built output**

```bash
grep -r "TerminalHero" src/ 2>&1
```
Expected: No matches (empty output)

- [ ] **Step 5: Commit if any fixes were needed, otherwise done**

---

## Completion Checklist

- [ ] `npm run build` succeeds
- [ ] `npx astro check` passes
- [ ] Nav: logo far left, links far right, no max-width wrapper
- [ ] Footer: copyright far left, social links far right, no max-width wrapper
- [ ] TerminalHero.astro is deleted and has no remaining references
- [ ] Homepage renders HeroDashboard with particle background, Tux wireframe, all panels
- [ ] Terminal panels have hover glow effects
- [ ] Title has multi-layer text-shadow glow with blinking cursor
- [ ] Responsive: mobile collapses grid to 1-2 columns
