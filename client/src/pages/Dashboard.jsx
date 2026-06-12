import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion';
import api from '../api/axios';
import TiltCard from '../components/TiltCard';
import ActivityCard from '../components/ActivityCard';
import {
  Plus,
  Car,
  Apple,
  Zap,
  ShoppingBag,
  ArrowRight,
  Leaf,
  Sparkles,
  Bell
} from 'lucide-react';

function AnimatedNumber({ value, className = '' }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const spring = useSpring(count, { stiffness: 80, damping: 20 });

  useEffect(() => {
    spring.set(value);
  }, [value, spring]);

  return <motion.span className={className}>{rounded}</motion.span>;
}

const categoryConfig = {
  TRANSPORT: { icon: Car, color: '#3B82F6', label: 'Transport' },
  FOOD: { icon: Apple, color: '#2ECC71', label: 'Food' },
  ENERGY: { icon: Zap, color: '#F0A500', label: 'Energy' },
  SHOPPING: { icon: ShoppingBag, color: '#EC4899', label: 'Shopping' },
};

function MiniSparkline({ trend }) {
  const points = (trend || [0, 0, 0, 0, 0, 0, 0])
    .map((v, i) => {
      const x = (i / 6) * 100;
      const max = Math.max(...trend, 1);
      const y = 100 - (v / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');
  const isDown = trend && trend[trend.length - 1] < trend[0];
  return (
    <svg viewBox="0 0 100 100" className="w-full h-8">
      <polyline
        fill="none"
        stroke={isDown ? '#2ECC71' : '#F0A500'}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

function Skeleton({ className = '' }) {
  return <div className={`liquid-glass rounded-2xl animate-pulse ${className}`} />;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    categoryTotals: { TRANSPORT: 0, FOOD: 0, ENERGY: 0, SHOPPING: 0 },
    monthlyTotal: 0,
    streak: 0,
    activeGoal: null,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [aiTip, setAiTip] = useState('');
  const [loading, setLoading] = useState(true);
  const [tipLoading, setTipLoading] = useState(true);

  const today = useMemo(() => new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }), []);

  useEffect(() => {
    if (user && user.baselineScore === 0) {
      navigate('/onboarding');
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [summaryRes, activitiesRes] = await Promise.all([
          api.get('/api/activities/summary'),
          api.get('/api/activities?limit=5'),
        ]);
        if (summaryRes.data.success) setSummary(summaryRes.data.data);
        if (activitiesRes.data.success) setRecentActivities(activitiesRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchTip = async () => {
      try {
        setTipLoading(true);
        const tipRes = await api.get('/api/insights/daily-tip');
        if (tipRes.data.success) setAiTip(tipRes.data.data.tip);
      } catch (err) {
        console.error('Error fetching tip:', err);
      } finally {
        setTipLoading(false);
      }
    };

    if (user) {
      fetchDashboard();
      fetchTip();
    }
  }, [user, navigate]);

  const monthlyTarget = user?.baselineScore ? user.baselineScore / 12 : 250;
  const pct = monthlyTarget > 0 ? Math.min((summary.monthlyTotal / monthlyTarget) * 100, 100) : 0;
  const gaugeColor = pct > 90 ? '#EF4444' : pct > 70 ? '#F0A500' : '#2ECC71';
  const remaining = Math.max(0, monthlyTarget - summary.monthlyTotal);

  const weekDays = useMemo(() => {
    const d = new Date();
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date(d);
      day.setDate(d.getDate() - i);
      days.push(day.toLocaleDateString('en-US', { weekday: 'short' }).slice(0, 2));
    }
    return days;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050D07] p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-12 w-72" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <Skeleton className="h-64 md:col-span-2" />
            <Skeleton className="h-64 md:col-span-3" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-6">
        <button
          onClick={() => navigate('/log')}
          className="fixed bottom-6 right-6 z-50 p-4 liquid-glass-strong rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
        >
          <Plus className="h-7 w-7 text-white" />
        </button>

        {/* Top Bar */}
        <motion.div custom={0} variants={stagger} initial="hidden" animate="visible" className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">Good morning, {user?.name.split(' ')[0]} 🌿</h1>
            <p className="text-sm font-body text-white/50">{today} &middot; Your planet needs you today</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center">
              <Bell className="h-4 w-4 text-white/70" />
            </div>
            <div className="w-10 h-10 liquid-glass-strong rounded-full flex items-center justify-center">
              <span className="text-sm font-display font-medium text-white">{user?.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </motion.div>

        {/* Row 1: Three Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div custom={1} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6" style={{ borderLeft: '2px solid #2ECC71' }}>
            <p className="text-xs font-display text-white/50 uppercase tracking-widest">Annual Footprint</p>
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-5xl font-display font-bold text-white">
                {user?.baselineScore?.toLocaleString() || '—'}
              </span>
              <span className="text-lg text-white/40 font-body">kg CO₂</span>
            </div>
            <div className="mt-4 liquid-glass rounded-full px-3 py-1 inline-flex items-center text-xs">
              <span className="text-green-400">↓ 12% below India average</span>
            </div>
          </motion.div>

          <motion.div custom={2} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6 text-center">
            <span className="text-4xl">🔥</span>
            <div className="mt-2">
              <span className="text-5xl font-display font-bold text-white">{summary.streak}</span>
            </div>
            <p className="text-sm font-body text-white/50 mt-1">Day Logging Streak</p>
            <div className="flex justify-center gap-1.5 mt-4">
              {weekDays.map((d, i) => (
                <div key={d + i} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-full ${i < summary.streak % 7 ? 'bg-[#2ECC71]' : i === 6 && summary.streak > 0 ? 'ring-2 ring-[#2ECC71] ring-offset-2 ring-offset-[#050D07] bg-[#2ECC71]' : 'bg-white/10'}`}
                  />
                  <span className="text-[8px] text-white/30">{d}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div custom={3} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6">
            <div className="flex gap-2">
              <div className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center text-lg">🌱</div>
              <div className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center text-lg">🌊</div>
              <div className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center text-lg opacity-30">⚡</div>
              <div className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center text-lg opacity-30">🏔️</div>
            </div>
            <p className="text-sm font-body text-white/50 mt-3">Badges Earned</p>
            <p className="text-lg font-display font-bold text-white">2 of 8 unlocked</p>
            <div className="mt-3 w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full" style={{ width: '25%' }} />
            </div>
          </motion.div>
        </div>

        {/* Row 2: Radial Budget + AI Tip */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <motion.div custom={4} variants={stagger} initial="hidden" animate="visible" className="md:col-span-2 liquid-glass-card rounded-2xl p-6">
            <h3 className="text-lg font-display font-bold text-white">Monthly CO₂ Budget</h3>
            <div className="flex flex-col items-center mt-6">
              <svg width="180" height="180" viewBox="0 0 180 180" className="transform -rotate-90">
                <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <motion.circle
                  cx="90" cy="90" r="72"
                  fill="none"
                  stroke={gaugeColor}
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 72}
                  initial={{ strokeDashoffset: 2 * Math.PI * 72 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 72 - (pct / 100) * 2 * Math.PI * 72 }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-display font-bold text-white">
                  <AnimatedNumber value={Math.round(summary.monthlyTotal)} />
                </span>
                <span className="text-xs font-body text-white/50">of {Math.round(monthlyTarget)}kg used</span>
              </div>
            </div>
            <div className="flex gap-2 mt-6 justify-center">
              <div className="liquid-glass rounded-full px-3 py-1 text-xs text-green-400 flex items-center space-x-1">
                <span>✓</span>
                <span><AnimatedNumber value={Math.round(summary.monthlyTotal)} />kg used</span>
              </div>
              <div className="bg-white/10 rounded-full px-3 py-1 text-xs text-white/50 flex items-center space-x-1">
                <span>◦</span>
                <span><AnimatedNumber value={Math.round(remaining)} />kg remaining</span>
              </div>
            </div>
          </motion.div>

          <motion.div custom={5} variants={stagger} initial="hidden" animate="visible" className="md:col-span-3 liquid-glass-strong rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="liquid-glass rounded-full px-3 py-1 text-xs text-green-400">✦ AI Insight</span>
              <span className="text-xs text-white/30 font-body">Powered by Gemini</span>
            </div>
            <div className="flex-1 flex items-center">
              {tipLoading ? (
                <div className="space-y-3 w-full">
                  <div className="h-4 bg-white/10 rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-white/10 rounded animate-pulse w-1/2" />
                </div>
              ) : (
                <p className="text-xl font-display italic text-white leading-relaxed">
                  {aiTip || "Start logging activities to receive personalized AI tips from Gemini."}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between mt-4">
              <button className="liquid-glass rounded-full px-4 py-2 text-xs text-white/70 font-body hover:bg-white/5 transition-colors">Refresh tip</button>
              <Link to="/log" className="text-xs text-green-400 hover:text-green-300 font-body transition-colors flex items-center space-x-1">
                <span>Log related activity</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Row 3: Category Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryConfig).map(([key, cfg], i) => {
            const Icon = cfg.icon;
            const amount = summary.categoryTotals[key] || 0;
            const trendData = [amount * 0.8, amount * 0.9, amount * 0.7, amount * 1.1, amount * 0.85, amount * 0.95, amount];
            const isTrendingUp = trendData[trendData.length - 1] > trendData[0];
            return (
              <motion.div key={key} custom={6 + i} variants={stagger} initial="hidden" animate="visible">
                <TiltCard>
                  <div className="liquid-glass-card rounded-2xl p-5 relative overflow-hidden" style={{ borderLeft: `3px solid ${cfg.color}` }}>
                    <div className="flex items-center justify-between">
                      <Icon className="h-6 w-6" style={{ color: cfg.color }} />
                      <span className="text-xs font-display text-white/60 uppercase tracking-wider">{cfg.label}</span>
                    </div>
                    <div className="mt-4">
                      <span className="text-4xl font-display font-bold text-white">
                        <AnimatedNumber value={Math.round(amount * 10) / 10} />
                      </span>
                      <span className="text-xs font-body text-white/40 ml-1">kg this month</span>
                    </div>
                    <div className="mt-3">
                      <MiniSparkline trend={trendData} />
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            );
          })}
        </div>

        {/* Row 4: Activity Log + Offset Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div custom={10} variants={stagger} initial="hidden" animate="visible" className="lg:col-span-2 liquid-glass-card rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-display font-bold text-white">Recent Activity</h3>
              <Link to="/log" className="text-xs text-green-400 hover:text-green-300 font-body transition-colors">View All →</Link>
            </div>
            {recentActivities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Leaf className="h-16 w-16 text-white/10 mb-4" />
                <p className="text-lg font-display text-white/60">No activities yet</p>
                <p className="text-sm font-body text-white/30 mt-1">Start logging to see your impact</p>
                <button
                  onClick={() => navigate('/log')}
                  className="mt-4 liquid-glass-strong rounded-full px-6 py-2.5 text-sm text-white font-body"
                >
                  Log First Activity
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentActivities.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))}
              </div>
            )}
          </motion.div>

          <motion.div custom={11} variants={stagger} initial="hidden" animate="visible" className="lg:col-span-1 liquid-glass-strong rounded-2xl p-6 flex flex-col items-center" style={{ background: 'radial-gradient(circle at center, rgba(46,204,113,0.05) 0%, transparent 70%)' }}>
            <span className="text-5xl">🌍</span>
            <h3 className="text-xl font-display font-bold text-white text-center mt-3">Offset Your Impact</h3>
            <p className="text-sm font-body text-white/60 text-center mt-2">Support verified green projects and neutralize unavoidable emissions.</p>
            <div className="flex gap-2 mt-4">
              <span className="liquid-glass rounded-full px-3 py-1 text-xs text-white/50">5 Projects</span>
              <span className="liquid-glass rounded-full px-3 py-1 text-xs text-white/50">From $9/ton</span>
            </div>
            <button
              onClick={() => navigate('/offset')}
              className="mt-6 liquid-glass-strong rounded-full w-full py-3 text-sm text-white font-body text-center"
            >
              Browse Projects →
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
