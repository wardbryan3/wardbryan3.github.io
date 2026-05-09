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
