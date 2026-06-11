import React, { useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';

const ELLIPSES = [
  { color: '#1A6B3C', opacity: 0.15, width: 800, height: 400, x: 150, y: 80, duration: 18, delay: 0 },
  { color: '#2ECC71', opacity: 0.10, width: 700, height: 350, x: -120, y: -60, duration: 24, delay: 2 },
  { color: '#0D4F2C', opacity: 0.12, width: 900, height: 500, x: 100, y: -80, duration: 20, delay: 4 },
  { color: '#52D68A', opacity: 0.08, width: 600, height: 300, x: -150, y: 60, duration: 22, delay: 1 },
];

function AuroraBackground() {
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  if (prefersReducedMotion) return null;

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden">
      {ELLIPSES.map((ellipse, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: ellipse.width,
            height: ellipse.height,
            backgroundColor: ellipse.color,
            opacity: ellipse.opacity,
            filter: 'blur(100px)',
            top: '50%',
            left: '50%',
            marginTop: -ellipse.height / 2,
            marginLeft: -ellipse.width / 2,
          }}
          animate={{
            x: [0, ellipse.x, 0, -ellipse.x, 0],
            y: [0, ellipse.y, 0, -ellipse.y, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: ellipse.duration,
            delay: ellipse.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export default React.memo(AuroraBackground);
