import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

function ParticleBurst({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 10 }, (_, i) => ({
    angle: (i / 10) * 360,
    distance: 30 + Math.random() * 30,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.2,
    color: ['#2ECC71', '#52D68A', '#1A6B3C'][Math.floor(Math.random() * 3)],
  }));

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((p.angle * Math.PI) / 180) * p.distance,
            y: Math.sin((p.angle * Math.PI) / 180) * p.distance,
            opacity: 0,
            scale: 0,
          }}
          transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
}

export default function CO2Gauge({ value = 0, target = 250 }) {
  const roundedValue = Math.round(value);
  const roundedTarget = Math.round(target);
  const percentage = target > 0 ? Math.min(Math.round((value / target) * 100), 150) : 0;

  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const animatedValue = useTransform(count, (latest) => Math.round(latest));
  const [displayPercent, setDisplayPercent] = useState(0);
  const [showParticles, setShowParticles] = useState(false);

  const fillPercentage = Math.min(percentage, 100);
  const strokeDashoffset = circumference - (fillPercentage / 100) * circumference;

  const isExceeded = percentage > 100;
  const isWarning = percentage > 85 && !isExceeded;
  const gaugeColor = isExceeded ? '#EF4444' : isWarning ? '#F0A500' : '#2ECC71';
  const glowColor = isExceeded ? '#EF4444' : isWarning ? '#F0A500' : '#2ECC71';

  useEffect(() => {
    const controls = animate(count, roundedValue, {
      duration: 1.2,
      ease: 'easeOut',
    });

    const percentageControls = animate(0, percentage, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (latest) => setDisplayPercent(Math.round(latest)),
    });

    const timer = setTimeout(() => setShowParticles(true), 1200);
    const clearParticles = setTimeout(() => setShowParticles(false), 2000);

    return () => {
      controls.stop();
      percentageControls.stop();
      clearTimeout(timer);
      clearTimeout(clearParticles);
    };
  }, [value, percentage]);

  return (
    <div
      className="liquid-glass-card rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        filter: `drop-shadow(0 0 20px ${glowColor}40)`,
      }}
    >
      <h3 className="text-white/60 text-sm font-semibold mb-6">
        Monthly Budget Status
      </h3>

      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="stroke-white/5 fill-none"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            className="fill-none"
            stroke={gaugeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute flex flex-col items-center text-center">
          <div className="flex items-baseline">
            <motion.span className="text-4xl font-display font-bold text-white">
              {animatedValue}
            </motion.span>
            <span className="text-xs font-bold text-white/40 ml-0.5">kg</span>
          </div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
            of {roundedTarget} kg
          </div>
          <div className={`text-xs font-bold mt-2 px-2.5 py-0.5 rounded-full ${
            isExceeded
              ? 'bg-red-950/30 text-red-400'
              : isWarning
                ? 'bg-amber-950/30 text-amber-400'
                : 'bg-green-950/30 text-green-400'
          }`}>
            {displayPercent}% Used
          </div>
        </div>

        <motion.div
          className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor: gaugeColor,
            boxShadow: `0 0 8px ${glowColor}`,
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        />

        <ParticleBurst active={showParticles} />
      </div>

      <div className="mt-6 text-center">
        {isExceeded ? (
          <p className="text-xs font-medium text-red-400">
            You've exceeded your monthly footprint target!
          </p>
        ) : (
          <p className="text-xs font-medium text-white/60">
            You have <span className="font-bold text-[#2ECC71]">{Math.max(0, roundedTarget - roundedValue)} kg</span> of CO₂ remaining this month.
          </p>
        )}
      </div>
    </div>
  );
}
