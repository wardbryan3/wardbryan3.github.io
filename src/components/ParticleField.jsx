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
    return { positions: pos, colors: colors };
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
