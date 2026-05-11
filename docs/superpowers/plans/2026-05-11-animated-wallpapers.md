# Animated Wallpapers Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new animated wallpapers (Digital Rain + Hexagon Field) to the Portfolio OS desktop.

**Architecture:** Each wallpaper is a standalone React component that renders a full-viewport transparent canvas (Canvas 2D for Digital Rain, Three.js/R3F for Hex Field). Both read CSS custom properties for theme colors and register in the existing wallpaper selection flow.

**Tech Stack:** React, Three.js, React Three Fiber, Canvas 2D, Zustand

---

### Task 1: Create DigitalRain component (Canvas 2D)

**Files:**
- Create: `src/components/DigitalRain.jsx`

- [ ] **Step 1: Write the DigitalRain component**

```jsx
import { useEffect, useRef } from 'react';
import { useOSStore } from '../stores/osStore';

function getCSSVar(name) {
  if (typeof document === 'undefined') return { r: 0, g: 1, b: 0.4 };
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return { r: 0, g: 1, b: 0.4 };
  const hex = val.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
const FONT_SIZE = 14;
const COLUMN_WIDTH = FONT_SIZE * 1.2;
const FALL_SPEED_MIN = 0.5;
const FALL_SPEED_MAX = 2.5;
const TRAIL_LENGTH = 8;

function createColumn(colIndex, canvasWidth, canvasHeight) {
  const x = colIndex * COLUMN_WIDTH + COLUMN_WIDTH / 2;
  const speed = FALL_SPEED_MIN + Math.random() * (FALL_SPEED_MAX - FALL_SPEED_MIN);
  return {
    x,
    y: Math.random() * canvasHeight * -1,
    speed,
    chars: Array.from({ length: TRAIL_LENGTH }, () => CHARS[Math.floor(Math.random() * CHARS.length)]),
    counter: Math.random() * 100,
  };
}

function drawColumn(ctx, column, accentColor, primaryColor, fontSize) {
  const { x, y, chars } = column;
  for (let i = 0; i < chars.length; i++) {
    const charY = y - i * fontSize;
    if (charY < -fontSize || charY > ctx.canvas.height + fontSize) continue;
    const distance = i;
    const alpha = Math.max(0.05, 1.0 / Math.pow(distance + 1, 1.5));
    const color = distance === 0 ? accentColor : primaryColor;
    ctx.fillStyle = `rgba(${color.r * 255}, ${color.g * 255}, ${color.b * 255}, ${alpha})`;
    ctx.shadowBlur = distance === 0 ? 8 : 3;
    ctx.shadowColor = distance === 0
      ? `rgba(${accentColor.r * 255}, ${accentColor.g * 255}, ${accentColor.b * 255}, 0.5)`
      : `rgba(${primaryColor.r * 255}, ${primaryColor.g * 255}, ${primaryColor.b * 255}, 0.2)`;
    ctx.fillText(chars[i], x, charY);
  }
}

export default function DigitalRain() {
  const canvasRef = useRef(null);
  const theme = useOSStore((s) => s.theme);
  const columnsRef = useRef([]);
  const animFrameRef = useRef(null);
  const accentRef = useRef(getCSSVar('--accent'));
  const primaryRef = useRef(getCSSVar('--primary'));

  useEffect(() => {
    accentRef.current = getCSSVar('--accent');
    primaryRef.current = getCSSVar('--primary');
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const numCols = Math.ceil(window.innerWidth / COLUMN_WIDTH);
      if (columnsRef.current.length === 0) {
        columnsRef.current = Array.from({ length: numCols }, (_, i) =>
          createColumn(i, window.innerWidth, window.innerHeight)
        );
      }
    }

    resize();
    window.addEventListener('resize', resize);

    function animate() {
      if (document.hidden) {
        animFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (const col of columnsRef.current) {
        col.y += col.speed;
        if (Math.random() < 0.01) {
          const charIdx = Math.floor(Math.random() * CHARS.length);
          col.chars.unshift(CHARS[charIdx]);
          col.chars.pop();
        }
        if (col.y - TRAIL_LENGTH * FONT_SIZE > window.innerHeight) {
          Object.assign(col, createColumn(
            Math.floor(col.x / COLUMN_WIDTH),
            window.innerWidth,
            window.innerHeight
          ));
        }
        drawColumn(ctx, col, accentRef.current, primaryRef.current, FONT_SIZE);
      }

      animFrameRef.current = requestAnimationFrame(animate);
    }

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```
git add src/components/DigitalRain.jsx
git commit -m "feat: add Digital Rain animated wallpaper"
```

---

### Task 2: Create HexField component (Three.js / R3F)

**Files:**
- Create: `src/components/HexField.jsx`

- [ ] **Step 1: Write the HexField component**

Key design decision: The canvas must have `pointerEvents: 'none'` so desktop window interactions pass through. To still detect mouse hover over hexagons, we track `document` mousemove events, project a ray through the scene, and find which hex cell the ray intersects on the XZ plane.

```jsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useOSStore } from '../stores/osStore';

function getCSSVar(name) {
  if (typeof document === 'undefined') return { r: 0, g: 1, b: 0.4 };
  const val = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  if (!val) return { r: 0, g: 1, b: 0.4 };
  const hex = val.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16) / 255,
    g: parseInt(hex.substring(2, 4), 16) / 255,
    b: parseInt(hex.substring(4, 6), 16) / 255,
  };
}

const HEX_RADIUS = 0.4;
const HEX_SPACING = 0.7;
const GRID_COLS = 15;
const GRID_ROWS = 10;

function getHexCenter(row, col) {
  const x = (col - GRID_COLS / 2) * HEX_SPACING + (row % 2) * HEX_SPACING / 2;
  const z = (row - GRID_ROWS / 2) * HEX_SPACING * 0.85;
  return { x, z };
}

function getGridCell(worldX, worldZ) {
  const colApprox = Math.round((worldX + (worldZ / (HEX_SPACING * 0.85) % 2) * HEX_SPACING / 2) / HEX_SPACING + GRID_COLS / 2);
  const rowApprox = Math.round(worldZ / (HEX_SPACING * 0.85) + GRID_ROWS / 2);
  if (rowApprox < 0 || rowApprox >= GRID_ROWS || colApprox < 0 || colApprox >= GRID_COLS) return -1;
  // verify against actual hex center
  const c = getHexCenter(rowApprox, colApprox);
  const dx = worldX - c.x;
  const dz = worldZ - c.z;
  if (dx * dx + dz * dz < HEX_RADIUS * HEX_RADIUS * 1.2) {
    return rowApprox * GRID_COLS + colApprox;
  }
  return -1;
}

function HexGrid() {
  const meshRef = useRef(null);
  const planeRef = useRef(new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
  ));
  planeRef.current.rotation.x = -Math.PI / 2;
  const theme = useOSStore((s) => s.theme);
  const hoveredIdxRef = useRef(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const mouseNDC = useRef(new THREE.Vector2(-999, -999));
  const raycaster = useRef(new THREE.Raycaster());

  const hexShape = useMemo(() => {
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i + Math.PI / 6;
      const x = Math.cos(angle) * HEX_RADIUS;
      const y = Math.sin(angle) * HEX_RADIUS;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    return shape;
  }, []);

  const { positions, colors } = useMemo(() => {
    const geo = new THREE.ShapeGeometry(hexShape);
    geo.rotateX(-Math.PI / 2);
    const pos = [];
    const col = [];
    const accent = getCSSVar('--accent');
    const primary = getCSSVar('--primary');
    const accentColor = new THREE.Color(accent.r, accent.g, accent.b);
    const primaryColor = new THREE.Color(primary.r, primary.g, primary.b);

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const c = getHexCenter(row, col);
        const matrix = new THREE.Matrix4().makeTranslation(c.x, 0, c.z);
        const color = Math.random() > 0.4 ? accentColor : primaryColor;
        for (let v = 0; v < geo.attributes.position.count; v++) {
          const p = new THREE.Vector3(
            geo.attributes.position.getX(v),
            geo.attributes.position.getY(v),
            geo.attributes.position.getZ(v)
          ).applyMatrix4(matrix);
          pos.push(p.x, p.y, p.z);
          col.push(color.r, color.g, color.b);
        }
      }
    }
    return { positions: new Float32Array(pos), colors: new Float32Array(col) };
  }, [theme]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [positions, colors]);

  const themeRef = useRef(theme);
  themeRef.current = theme;

  // Track mouse via document (since canvas has pointerEvents: none)
  useEffect(() => {
    function onMouseMove(e) {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  const { camera } = useThree();
  let elapsed = 0;

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    elapsed = time;

    // Raycast against invisible plane to find hovered hex
    raycaster.current.setFromCamera(mouseNDC.current, camera);
    const intersects = raycaster.current.intersectObject(planeRef.current);
    if (intersects.length > 0) {
      const pt = intersects[0].point;
      const idx = getGridCell(pt.x, pt.z);
      if (idx !== hoveredIdxRef.current) {
        hoveredIdxRef.current = idx;
        setHoveredIdx(idx);
      }
    } else {
      if (hoveredIdxRef.current !== null) {
        hoveredIdxRef.current = null;
        setHoveredIdx(null);
      }
    }

    const count = GRID_ROWS * GRID_COLS;
    const vertexCount = geometry.attributes.position.count;
    const vertsPerHex = vertexCount / count;
    const posAttr = geometry.attributes.position;

    for (let i = 0; i < count; i++) {
      const row = Math.floor(i / GRID_COLS);
      const col = i % GRID_COLS;
      const c = getHexCenter(row, col);

      const wave = Math.sin(c.x * 1.5 + time * 0.5) * 0.15 + Math.cos(c.z * 1.5 + time * 0.4) * 0.15;
      let scale = 1 + wave * 0.08;
      const centerY = wave * 0.05;

      if (hoveredIdxRef.current === i) {
        const pulse = Math.sin(time * 3) * 0.5 + 0.5;
        scale = 1 + 0.15 + pulse * 0.05;
      }

      for (let v = 0; v < vertsPerHex; v++) {
        const idx = i * vertsPerHex + v;
        const baseX = posAttr.array[idx * 3];
        const baseZ = posAttr.array[idx * 3 + 2];
        const dx = baseX - c.x;
        const dz = baseZ - c.z;
        posAttr.array[idx * 3] = c.x + dx * scale;
        posAttr.array[idx * 3 + 1] = centerY;
        posAttr.array[idx * 3 + 2] = c.z + dz * scale;
      }
    }

    posAttr.needsUpdate = true;
    geometry.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
      <meshStandardMaterial
        vertexColors
        transparent
        opacity={0.6}
        side={THREE.DoubleSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function HexField() {
  return (
    <Canvas
      camera={{ position: [0, 5, 8], fov: 45 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={0.8} />
      <HexGrid />
    </Canvas>
  );
}
```

- [ ] **Step 2: Commit**

```
git add src/components/HexField.jsx
git commit -m "feat: add Hexagon Field animated wallpaper"
```

---

### Task 3: Register both wallpapers in DesktopOS + SettingsWindow

**Files:**
- Modify: `src/components/DesktopOS.jsx` — add imports and conditional renders
- Modify: `src/components/SettingsWindow.jsx` — add keys to WALLPAPERS array

- [ ] **Step 1: Add imports to DesktopOS.jsx**

Add after line 3 (`import ParticleField from './ParticleField';`):
```jsx
import DigitalRain from './DigitalRain';
import HexField from './HexField';
```

- [ ] **Step 2: Add conditional renders to DesktopOS.jsx**

In the `WALLPAPER_CSS` object (line 14-19), add entries for the new wallpapers:
```jsx
const WALLPAPER_CSS = {
  'particle-field': {},
  'digital-rain': {},
  'hex-field': {},
  dots: { /* ... */ },
  grid: { /* ... */ },
  none: {},
};
```

Add after line 52 (`{wallpaper === 'particle-field' && <ParticleField />}`):
```jsx
{wallpaper === 'digital-rain' && <DigitalRain />}
{wallpaper === 'hex-field' && <HexField />}
```

- [ ] **Step 3: Add wallpaper keys to SettingsWindow.jsx**

Change line 8 from:
```jsx
const WALLPAPERS = ['particle-field', 'dots', 'grid', 'none'];
```
To:
```jsx
const WALLPAPERS = ['particle-field', 'digital-rain', 'hex-field', 'dots', 'grid', 'none'];
```

- [ ] **Step 4: Verify the build compiles**

```
npm run build 2>&1 | tail -20
```

Expected: Build succeeds with no errors.

- [ ] **Step 5: Commit**

```
git add src/components/DesktopOS.jsx src/components/SettingsWindow.jsx
git commit -m "feat: register digital-rain and hex-field wallpapers in settings"
```
