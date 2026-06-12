import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const LEAF_COLORS = ['#2ECC71', '#1A6B3C', '#52D68A'];

function Leaf({ position, rotation, scale, speed, color, offset }) {
  const meshRef = useRef();
  const startY = position[1];

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset;
    const y = startY + t * 0.3;
    if (meshRef.current) {
      if (y > 1.5) {
        meshRef.current.position.y = -1.5;
        meshRef.current.position.x = (Math.random() - 0.5) * 3;
      } else {
        meshRef.current.position.y = y;
        meshRef.current.position.x = position[0] + Math.sin(t * 0.5) * 0.3;
      }
      meshRef.current.rotation.x = rotation[0] + t * 0.2;
      meshRef.current.rotation.y = rotation[1] + t * 0.3;
      meshRef.current.rotation.z = rotation[2] + t * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[0.3, 0.4]} />
      <meshBasicMaterial color={color} transparent opacity={0.25} side={THREE.DoubleSide} />
    </mesh>
  );
}

function LeavesField() {
  const count = 40;
  const leaves = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        position: [(Math.random() - 0.5) * 3, Math.random() * 3 - 1.5, (Math.random() - 0.5) * 2],
        rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
        scale: 0.05 + Math.random() * 0.1,
        speed: 0.15 + Math.random() * 0.1,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)],
        offset: Math.random() * 10,
      });
    }
    return arr;
  }, []);

  return (
    <group>
      {leaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </group>
  );
}

function FloatingLeaves() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div className="hidden md:block fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ position: [0, 0, 2], fov: 60 }} gl={{ alpha: true }}>
        <LeavesField />
      </Canvas>
    </div>
  );
}

export default React.memo(FloatingLeaves);
