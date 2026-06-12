import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Brain, Trophy } from 'lucide-react';

const FadingVideo = lazy(() => import('./FadingVideo'));

const features = [
  {
    icon: BarChart3,
    title: 'Smart Tracking',
    description: 'Log travel, food, energy and shopping activities. Get real-time CO₂ estimates and see your environmental impact instantly.',
    tags: ['Daily Log', 'CO₂ Score', 'Categories', 'Streaks'],
  },
  {
    icon: Brain,
    title: 'AI Insights',
    description: 'Gemini AI analyzes your habits and delivers personalized, actionable reduction tips tailored to your lifestyle and location.',
    tags: ['Gemini AI', 'Personal Tips', 'Comparisons', 'Reports'],
  },
  {
    icon: Trophy,
    title: 'Eco Challenges',
    description: 'Join gamified eco-challenges, track your reduction streaks, and offset unavoidable emissions through verified green projects.',
    tags: ['Challenges', 'Offsets', 'Community', 'Rewards'],
  },
];

export default function FeaturesSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <Suspense fallback={<div className="absolute inset-0 bg-forest-900 animate-pulse" />}>
        <FadingVideo
          src="https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4"
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg"
        />
      </Suspense>
      <div className="absolute inset-0 bg-[rgba(5,13,7,0.5)]" />

      <div className="relative z-10 px-8 md:px-16 pt-24 pb-10">
        <div className="max-w-7xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm font-body text-green-400/80 mb-4"
          >
            // How EcoPulse Works
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold text-white text-6xl md:text-7xl tracking-[-3px] leading-[0.9]"
          >
            Awareness
            <br />
            into Action
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  className="liquid-glass-card rounded-2xl p-6 min-h-[360px] flex flex-col"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 liquid-glass square rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {feature.tags.map((tag) => (
                        <span
                          key={tag}
                          className="liquid-glass px-2.5 py-1 rounded-full text-[10px] text-white/70 font-body"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto pt-8">
                    <h3 className="font-display italic text-white text-3xl tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm text-white/80 font-body leading-snug max-w-[32ch]">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
