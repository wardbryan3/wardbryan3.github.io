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
  const planeRef = useRef((() => {
    const p = new THREE.Mesh(
      new THREE.PlaneGeometry(50, 50),
      new THREE.MeshBasicMaterial({ visible: false, side: THREE.DoubleSide })
    );
    p.rotation.x = -Math.PI / 2;
    p.updateMatrixWorld(true);
    return p;
  })());
  const theme = useOSStore((s) => s.theme);
  const hoveredIdxRef = useRef(null);
  const [, setHoveredIdx] = useState(null);
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

  useEffect(() => {
    function onMouseMove(e) {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    document.addEventListener('mousemove', onMouseMove);
    return () => document.removeEventListener('mousemove', onMouseMove);
  }, []);

  const { camera } = useThree();

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

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
