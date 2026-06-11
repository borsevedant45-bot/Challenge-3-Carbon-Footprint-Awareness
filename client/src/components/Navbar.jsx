import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sun, 
  Moon, 
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
  const { user, logout, theme, toggleTheme } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Log Activity', path: '/log', icon: PlusCircle },
    { name: 'Insights', path: '/insights', icon: BarChart3 },
    { name: 'Challenges', path: '/challenges', icon: Trophy },
    { name: 'Offset Marketplace', path: '/offset', icon: Sparkles },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-nature-cardDark/85 backdrop-blur-md border-b border-gray-100 dark:border-nature-darkBg/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Leaf className="h-6 w-6 text-secondary" />
              <span className="text-xl font-display font-extrabold text-primary dark:text-secondary tracking-tight">
                Eco<span className="text-secondary dark:text-accent">Pulse</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary'
                      : 'text-gray-600 dark:text-nature-darkText/70 hover:bg-gray-50 dark:hover:bg-nature-darkBg/40 hover:text-primary dark:hover:text-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-gray-50 dark:bg-nature-darkBg/60 text-gray-600 dark:text-nature-darkText hover:bg-gray-100 dark:hover:bg-nature-darkBg transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* User Details */}
            <div className="flex items-center space-x-2 border-l border-gray-200 dark:border-nature-darkBg/50 pl-3">
              <div className="h-8 w-8 rounded-full bg-secondary/20 dark:bg-secondary/35 text-primary dark:text-secondary flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-nature-darkText max-w-[100px] truncate">
                {user.name}
              </span>
              
              <button
                onClick={logout}
                className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-gray-50 dark:bg-nature-darkBg/60 text-gray-600 dark:text-nature-darkText"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-nature-darkText hover:bg-gray-100 dark:hover:bg-nature-darkBg/60 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-nature-cardDark border-b border-gray-100 dark:border-nature-darkBg/40 px-4 pt-2 pb-4 space-y-1 transition-all duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                  isActive(item.path)
                    ? 'bg-primary/10 dark:bg-secondary/15 text-primary dark:text-secondary'
                    : 'text-gray-600 dark:text-nature-darkText/70 hover:bg-gray-50 dark:hover:bg-nature-darkBg/40'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          <div className="pt-4 border-t border-gray-100 dark:border-nature-darkBg/50 flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-secondary/20 dark:bg-secondary/35 text-primary dark:text-secondary flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-semibold text-gray-700 dark:text-nature-darkText">
                {user.name}
              </span>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
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
