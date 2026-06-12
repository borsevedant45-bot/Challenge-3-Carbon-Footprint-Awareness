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
    <nav className="sticky top-0 z-50 liquid-glass backdrop-blur-md border-b border-[rgba(46,204,113,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6 text-[#2ECC71]" />
            <span className="text-xl font-display font-bold text-white tracking-tight">
              EcoPulse
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-[#2ECC71]'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-[#2ECC71]" />}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <div className="flex items-center space-x-2 border-l border-white/10 pl-3">
              <div className="h-8 w-8 rounded-full bg-[#2ECC71]/20 text-[#2ECC71] flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-medium text-white/70 max-w-[100px] truncate">
                {user.name}
              </span>
              <button
                onClick={logout}
                className="p-2 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-950/20 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-white/70 hover:bg-white/5"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden liquid-glass backdrop-blur-md border-b border-[rgba(46,204,113,0.1)] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  active
                    ? 'text-[#2ECC71] bg-white/5'
                    : 'text-white/70 hover:bg-white/5'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-[#2ECC71]/20 text-[#2ECC71] flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-white/70">{user.name}</span>
            </div>
            <button
              onClick={() => { setIsOpen(false); logout(); }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-950/20"
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
