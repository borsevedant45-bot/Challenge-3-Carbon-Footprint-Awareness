import React, { Suspense, useState, lazy } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

const GlobeScene = lazy(() => import('../components/GlobeScene'));

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleGoogleLogin = async () => {
    // Simulated Google Federated Login for MVP
    setLoading(true);
    try {
      const mockGoogleData = {
        email: email || 'guest.nature@gmail.com',
        name: 'Guest Tree Hugger',
        googleId: 'google_1234567890'
      };
      
      const { useAuth } = await import('../context/AuthContext');
      // Directly hit endpoint or call handler
      const res = await axios.post('/api/auth/google', mockGoogleData);
      if (res.data.success) {
        window.location.reload(); // reload to fetch profile
      }
    } catch (err) {
      setError('Google Sign-In simulation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-nature-bg dark:bg-nature-darkBg transition-colors duration-300">
      
      {/* Left Column: 3D Globe Scene (Hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-center justify-center overflow-hidden flex-col">
        <Suspense fallback={<div className="animate-pulse bg-green-900 rounded-xl h-[420px] w-full" />}>
          <GlobeScene />
        </Suspense>
        <div className="relative text-center p-6 z-10 space-y-4 -mt-8">
          <h1 className="text-4xl font-display font-black text-white leading-tight">
            Nurture your impact,<br/>one pulse at a time.
          </h1>
          <p className="text-green-100 max-w-md mx-auto text-sm font-medium leading-relaxed">
            Join thousands tracking their daily carbon footprints, engaging in challenges, and funding certified carbon capture offset projects.
          </p>
        </div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-nature-cardDark p-8 rounded-3xl shadow-nature border border-gray-50 dark:border-nature-darkBg/30">
          
          {/* Logo / Header */}
          <div className="text-center lg:hidden">
            <div className="inline-flex p-3 bg-secondary/10 rounded-2xl mb-3">
              <Leaf className="h-8 w-8 text-secondary" />
            </div>
            <h2 className="text-2xl font-display font-black text-primary dark:text-secondary">
              EcoPulse
            </h2>
          </div>

          <div className="text-left">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-800 dark:text-nature-darkText">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
              Please enter your details to sign in
            </p>
          </div>

          {error && (
            <div className="flex items-center space-x-2 p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm border border-red-100 dark:border-red-950/30">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-nature-darkText/50 uppercase tracking-wider block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-500 dark:text-nature-darkText/50 uppercase tracking-wider block">
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-secondary hover:text-primary transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/15 transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary/95 text-white font-extrabold rounded-2xl shadow-lg shadow-primary/10 dark:shadow-secondary/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider disabled:opacity-50"
            >
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-gray-100 dark:border-nature-darkBg/50" />
            <span className="absolute bg-white dark:bg-nature-cardDark px-4 text-xs font-bold text-gray-400 dark:text-nature-darkText/30 uppercase tracking-widest">
              or
            </span>
          </div>

          {/* Google OAuth Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 bg-white dark:bg-nature-darkBg hover:bg-gray-50 dark:hover:bg-nature-darkBg/80 border border-gray-200 dark:border-nature-darkBg/50 text-gray-700 dark:text-nature-darkText font-extrabold rounded-2xl transition-all flex items-center justify-center space-x-2 text-xs uppercase tracking-wider"
          >
            {/* Google Icon SVG */}
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.187 4.114-3.415 0-6.19-2.775-6.19-6.19s2.775-6.19 6.19-6.19c1.7 0 3.22.685 4.33 1.795l3.14-3.14C19.16 2.535 15.93 1.2 12.24 1.2c-5.96 0-10.8 4.84-10.8 10.8s4.84 10.8 10.8 10.8c5.44 0 9.87-3.945 9.87-9.87 0-.585-.05-1.165-.15-1.73H12.24z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Footer Navigation */}
          <div className="text-center text-xs font-semibold text-gray-400 dark:text-nature-darkText/40">
            Don't have an account?{' '}
            <Link 
              to="/register" 
              className="text-secondary hover:text-primary dark:hover:text-secondary/80 font-bold decoration-2"
            >
              Sign up now
            </Link>
          </div>

        </div>
      </div>

    </div>
  );
}
