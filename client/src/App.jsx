import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AuroraBackground from './components/AuroraBackground';
import FloatingLeaves from './components/FloatingLeaves';

import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Log from './pages/Log';
import Insights from './pages/Insights';
import Challenges from './pages/Challenges';
import Offset from './pages/Offset';

const pageTransition = {
  initial: { y: 30, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

const pageTransitionProps = {
  initial: 'initial',
  animate: 'animate',
  exit: 'exit',
  variants: pageTransition,
  transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
};

function AnimatedPage({ children }) {
  return (
    <motion.div {...pageTransitionProps}>
      {children}
    </motion.div>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050D07]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2ECC71]" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AnimatedPage>{children}</AnimatedPage>;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050D07]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2ECC71]" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <AnimatedPage>{children}</AnimatedPage>;
}

function AppContent() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-[#050D07] text-white/90 transition-colors duration-300">
      <AuroraBackground />
      <FloatingLeaves />
      <Navbar />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <Onboarding />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/log"
              element={
                <ProtectedRoute>
                  <Log />
                </ProtectedRoute>
              }
            />
            <Route
              path="/insights"
              element={
                <ProtectedRoute>
                  <Insights />
                </ProtectedRoute>
              }
            />
            <Route
              path="/challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offset"
              element={
                <ProtectedRoute>
                  <Offset />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
