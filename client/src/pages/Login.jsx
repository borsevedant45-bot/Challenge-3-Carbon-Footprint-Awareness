import React, { useState, lazy, Suspense } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Leaf, Mail, Lock, AlertCircle, ArrowRight, ArrowUpRight, Users, BarChart3, Brain, Trophy } from 'lucide-react';
import BlurText from '../components/BlurText';

const FadingVideo = lazy(() => import('../components/FadingVideo'));

const staggerItem = (delay) => ({
  initial: { filter: 'blur(10px)', opacity: 0, y: 20 },
  animate: { filter: 'blur(0px)', opacity: 1, y: 0 },
  transition: { delay, ease: 'easeOut', duration: 0.6 },
});

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050D07] overflow-x-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={<div className="w-full h-full bg-forest-900 animate-pulse" />}>
          <FadingVideo
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
            className="absolute left-1/2 top-0 -translate-x-1/2 w-[120%] h-[120%] object-cover object-top"
            poster="https://images.pexels.com/photos/167699/pexels-photo-167699.jpeg"
          />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(5,13,7,0.3)] to-[rgba(5,13,7,0.6)]" />
      </div>

      {/* Navbar */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-12 h-12 liquid-glass rounded-full flex items-center justify-center">
            <Leaf className="text-[#2ECC71]" size={22} />
          </div>
          <div className="hidden lg:flex items-center liquid-glass rounded-full px-2 py-1.5 space-x-1">
            {['Home', 'Track', 'Insights', 'Challenges', 'Offset'].map((item) => (
              <button
                key={item}
                className="px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
              >
                {item}
              </button>
            ))}
            <button className="ml-2 bg-white text-forest-900 rounded-full px-4 py-2 text-sm font-medium flex items-center space-x-1.5 hover:bg-white/90 transition-colors">
              <span>Start Tracking</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="w-12 h-12" />
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center pt-36 md:pt-44 px-4">
        <motion.div {...staggerItem(0.4)} className="liquid-glass rounded-full px-4 py-2 mb-8">
          <span className="bg-white text-forest-950 text-[10px] font-bold px-2 py-0.5 rounded-full mr-2">New</span>
          <span className="text-white/80 text-sm font-body">AI-Powered Carbon Tracking — Know Your Impact</span>
        </motion.div>

        <BlurText
          text="Track Your Carbon. Heal the Planet."
          className="text-6xl md:text-7xl lg:text-[5.5rem] font-display font-bold text-white leading-[0.9] max-w-3xl tracking-[-3px] text-center"
        />

        <motion.p
          {...staggerItem(0.8)}
          className="mt-4 text-sm md:text-base text-white/80 max-w-xl font-body font-light leading-relaxed text-center"
        >
          Understand your daily carbon footprint through smart tracking, AI-powered insights, and meaningful actions. Every small change adds up.
        </motion.p>

        <motion.div {...staggerItem(1.1)} className="flex gap-4 mt-8">
          <button
            onClick={() => navigate('/register')}
            className="liquid-glass-strong rounded-full px-6 py-3 text-sm font-medium text-white flex items-center space-x-2 hover:scale-105 transition-transform"
          >
            <span>Begin Your Journey</span>
            <ArrowUpRight size={16} />
          </button>
          <button
            onClick={() => setAuthMode('login')}
            className="text-white/70 hover:text-white text-sm font-medium flex items-center space-x-1 transition-colors"
          >
            <span>Sign In</span>
            <ArrowRight size={14} />
          </button>
        </motion.div>

        <motion.div {...staggerItem(1.3)} className="flex gap-4 mt-10">
          <div className="liquid-glass-card p-5 w-[200px] rounded-2xl">
            <Leaf className="text-white" size={28} />
            <p className="font-display italic text-4xl text-white mt-2">2.4T</p>
            <p className="text-xs text-white/60 font-body mt-2">Tonnes CO₂ Tracked Globally</p>
          </div>
          <div className="liquid-glass-card p-5 w-[200px] rounded-2xl">
            <Users className="text-white" size={28} />
            <p className="font-display italic text-4xl text-white mt-2">180K+</p>
            <p className="text-xs text-white/60 font-body mt-2">Active Eco Warriors Worldwide</p>
          </div>
        </motion.div>
      </div>

      {/* Partners Row */}
      <div className="relative z-10 flex justify-center pb-8 mt-16">
        <motion.div {...staggerItem(1.4)} className="liquid-glass rounded-full px-6 py-3">
          <p className="text-xs text-white/50 font-body text-center mb-2">Trusted by leading sustainability organizations</p>
          <div className="flex items-center gap-8 font-display italic text-white text-lg">
            <span>GreenPeace</span>
            <span>WWF</span>
            <span>UNEP</span>
            <span>EarthDay</span>
            <span>CarbonTrust</span>
          </div>
        </motion.div>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 flex justify-center mt-16 pb-24 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass-card max-w-md w-full rounded-2xl p-8"
        >
          {/* Tabs */}
          <div className="flex mb-8 bg-white/5 rounded-full p-1">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                authMode === 'login' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all ${
                authMode === 'register' ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white/80'
              }`}
            >
              Register
            </button>
          </div>

          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <h2 className="text-xl font-display font-bold text-white mb-2">Welcome back</h2>

                {error && (
                  <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-950/30 text-red-400 text-sm border border-red-900/50">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-10 pr-4 py-3 liquid-glass-input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 liquid-glass-input text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 liquid-glass-strong rounded-full text-sm font-medium text-white flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>{loading ? 'Signing In...' : 'Sign In'}</span>
                  <ArrowRight size={14} />
                </button>

                <p className="text-center text-xs text-white/40">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('register')}
                    className="text-green-400 hover:text-green-300 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <p className="text-white/60 text-sm font-body text-center">
                  Ready to start your journey?{' '}
                  <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">
                    Create an account
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Features Section */}
      <FeaturesSection />
    </div>
  );
}

function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: 'Smart Tracking',
      desc: 'Log travel, food, energy and shopping activities. Get real-time CO₂ estimates and see your environmental impact instantly.',
      tags: ['Daily Log', 'CO₂ Score', 'Categories', 'Streaks'],
    },
    {
      icon: Brain,
      title: 'AI Insights',
      desc: 'Gemini AI analyzes your habits and delivers personalized, actionable reduction tips tailored to your lifestyle and location.',
      tags: ['Gemini AI', 'Personal Tips', 'Comparisons', 'Reports'],
    },
    {
      icon: Trophy,
      title: 'Eco Challenges',
      desc: 'Join gamified eco-challenges, track your reduction streaks, and offset unavoidable emissions through verified green projects.',
      tags: ['Challenges', 'Offsets', 'Community', 'Rewards'],
    },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-forest-900 animate-pulse" />}>
          <FadingVideo
            src="https://videos.pexels.com/video-files/856973/856973-hd_1920_1080_25fps.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </Suspense>
      </div>
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
                    <div className="w-11 h-11 liquid-glass rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="text-white" size={24} />
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {feature.tags.map((tag) => (
                        <span key={tag} className="liquid-glass px-2.5 py-1 rounded-full text-[10px] text-white/70 font-body">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-auto pt-8">
                    <h3 className="font-display italic text-white text-3xl tracking-tight">{feature.title}</h3>
                    <p className="mt-3 text-sm text-white/80 font-body leading-snug max-w-[32ch]">{feature.desc}</p>
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
