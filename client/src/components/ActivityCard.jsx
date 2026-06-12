import React from 'react';
import { Car, Apple, Zap, ShoppingBag, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function ActivityCard({ activity }) {
  const { category, description, co2Kg, date } = activity;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const getCategoryStyles = () => {
    switch (category) {
      case 'TRANSPORT':
        return { icon: Car, iconColor: '#3B82F6', bg: 'rgba(59,130,246,0.15)' };
      case 'FOOD':
        return { icon: Apple, iconColor: '#2ECC71', bg: 'rgba(46,204,113,0.15)' };
      case 'ENERGY':
        if (co2Kg < 0) return { icon: Zap, iconColor: '#10B981', bg: 'rgba(16,185,129,0.15)' };
        return { icon: Zap, iconColor: '#F0A500', bg: 'rgba(240,165,0,0.15)' };
      case 'SHOPPING':
        return { icon: ShoppingBag, iconColor: '#8B5CF6', bg: 'rgba(139,92,246,0.15)' };
      default:
        return { icon: Zap, iconColor: '#9CA3AF', bg: 'rgba(156,163,175,0.15)' };
    }
  };

  const { icon: CategoryIcon, iconColor, bg } = getCategoryStyles();
  const isOffset = co2Kg < 0;

  return (
    <div className="liquid-glass-card rounded-xl p-3 flex items-center justify-between hover:scale-[1.01] transition-transform duration-300">
      <div className="flex items-center space-x-3.5">
        <div className="p-3 rounded-xl" style={{ backgroundColor: bg }}>
          <CategoryIcon className="h-5 w-5" style={{ color: iconColor }} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white/30 uppercase tracking-wider">
            {category} {isOffset && '• OFFSET'}
          </span>
          <span className="text-sm font-medium text-white/80 max-w-[200px] sm:max-w-md truncate">
            {description}
          </span>
          <span className="text-[10px] font-medium text-white/40">
            {formattedDate}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-1">
        {isOffset ? (
          <div className="flex items-center text-emerald-400 font-bold text-sm">
            <ArrowDownRight className="h-4 w-4 mr-0.5" />
            <span>{Math.abs(Math.round(co2Kg))} kg</span>
          </div>
        ) : (
          <div className="flex items-center text-white font-bold text-sm">
            <ArrowUpRight className="h-4 w-4 mr-0.5 text-red-400" />
            <span>{Math.round(co2Kg)} kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
