import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function PulseRing({ radius, color, speed }) {
  const ringRef = useRef();
  const startTime = useRef(Math.random() * 3);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime() - startTime.current;
    const t = ((elapsed * speed) % 3) / 3;
    if (ringRef.current) {
      ringRef.current.scale.setScalar(1 + t * 2);
      const mat = ringRef.current.material;
      mat.opacity = Math.max(0, 0.6 * (1 - t));
    }
  });

  return (
    <mesh ref={ringRef}>
      <torusGeometry args={[radius, 0.02, 16, 64]} />
      <meshBasicMaterial color={color} transparent opacity={0} />
    </mesh>
  );
}

function Globe() {
  const meshRef = useRef();
  const wireframeRef = useRef();

  useFrame(({ clock }) => {
    const rot = clock.getElapsedTime() * 0.15;
    if (meshRef.current) meshRef.current.rotation.y = rot;
    if (wireframeRef.current) wireframeRef.current.rotation.y = rot;
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#1A6B3C" roughness={0.6} metalness={0.1} />
      </mesh>
      <mesh ref={wireframeRef}>
        <sphereGeometry args={[1.01, 24, 24]} />
        <meshBasicMaterial color="#2ECC71" wireframe transparent opacity={0.3} />
      </mesh>
      <PulseRing radius={1.2} color="#2ECC71" speed={0.3} />
      <PulseRing radius={1.2} color="#52D68A" speed={0.25} />
      <PulseRing radius={1.2} color="#2ECC71" speed={0.35} />
    </group>
  );
}

function GlobeScene() {
  return (
    <div className="w-full" style={{ height: '420px' }}>
      <Canvas camera={{ position: [0, 0, 2.8] }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[2, 2, 2]} color="#2ECC71" intensity={1} />
        <pointLight position={[-2, -1, -2]} color="#1A6B3C" intensity={0.3} />
        <Globe />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

export default React.memo(GlobeScene);
