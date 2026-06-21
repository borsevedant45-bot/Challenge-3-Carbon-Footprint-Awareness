import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Leaf, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import api from '../api/axios';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      navigate('/onboarding');
    } else {
      setError(result.message || 'Registration failed. Please check your inputs.');
    }
  };

  const handleGoogleRegister = async () => {
    setLoading(true);
    try {
      const mockGoogleData = {
        email: email || 'guest.nature@gmail.com',
        name: name || 'Guest Tree Hugger',
        googleId: 'google_1234567890'
      };
      const res = await api.post('/api/auth/google', mockGoogleData);
      if (res.data.success) {
        window.location.reload();
      }
    } catch (err) {
      setError('Google Registration simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050D07] flex items-center justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="liquid-glass-card rounded-2xl p-8 space-y-6">
          <div className="text-center">
            <div className="inline-flex p-3 bg-white/5 rounded-2xl mb-3">
              <Leaf className="h-8 w-8 text-[#2ECC71]" />
            </div>
            <h2 className="text-2xl font-display font-bold text-white">Create an account</h2>
            <p className="text-sm text-white/50 font-body mt-1">Begin tracking and reducing your carbon footprint</p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-3 rounded-xl bg-red-950/30 text-red-400 text-sm border border-red-900/50">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 liquid-glass-input text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-white/50 uppercase tracking-wider block mb-1.5">Email Address</label>
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-3 liquid-glass-input text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 liquid-glass-strong rounded-full text-sm font-medium text-white flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/10" />
            <span className="absolute bg-[rgba(26,107,60,0.06)] px-4 text-xs font-medium text-white/30">or</span>
          </div>

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-3 border border-white/10 rounded-full text-sm font-medium text-white/80 hover:bg-white/5 transition-colors flex items-center justify-center space-x-2"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.7 0 3.22.685 4.33 1.795l3.14-3.14C19.16 2.535 15.93 1.2 12.24 1.2c-5.96 0-10.8 4.84-10.8 10.8s4.84 10.8 10.8 10.8c5.44 0 9.87-3.945 9.87-9.87 0-.585-.05-1.165-.15-1.73H12.24z" />
            </svg>
            <span>Sign Up with Google</span>
          </button>

          <p className="text-center text-xs text-white/40">
            Already have an account?{' '}
            <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in now</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
