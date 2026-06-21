import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Menu,
  X,
  Leaf,
  BarChart3,
  Trophy,
  PlusCircle,
  LayoutDashboard,
  Sparkles,
  LogOut
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Log Activity', path: '/log', icon: PlusCircle },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'Offset', path: '/offset', icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 liquid-glass backdrop-blur-xl border-b border-[rgba(46,204,113,0.08)]" style={{ height: 64 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-5 w-5 text-[#2ECC71]" />
            <span className="text-lg font-display font-bold text-white tracking-tight">EcoPulse</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`relative flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm transition-all ${
                    active
                      ? 'text-green-400'
                      : 'text-white/60 hover:text-white hover:liquid-glass'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-body">{item.name}</span>
                  {active && <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400" />}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="liquid-glass rounded-full px-3 py-1.5 flex items-center space-x-1.5">
              <Leaf className="h-3.5 w-3.5 text-[#2ECC71]" />
              <span className="text-xs text-white/70 font-body">0 kg this month</span>
            </div>
            <div className="w-9 h-9 liquid-glass-strong rounded-full flex items-center justify-center">
              <span className="text-sm font-display font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-950/20 transition-colors"
              title="Log Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center"
            >
              {isOpen ? <X className="h-5 w-5 text-white/70" /> : <Menu className="h-5 w-5 text-white/70" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden liquid-glass-strong rounded-2xl mx-4 mt-2 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-base transition-all ${
                  active
                    ? 'text-green-400 bg-white/5'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-body">{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="w-9 h-9 liquid-glass-strong rounded-full flex items-center justify-center">
                <span className="text-sm font-display font-medium text-white">{user.name.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-sm font-body text-white/70">{user.name}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-body text-red-400 hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
