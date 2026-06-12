import React from 'react';
import { Apple, Bike, Zap, ShoppingBag, Droplets, Trophy, CheckCircle } from 'lucide-react';

export default function ChallengeCard({ challenge, userChallenge, onJoin, onComplete, loading }) {
  const { id, title, description, co2SavedKg, durationDays, category, iconName } = challenge;

  const getIcon = () => {
    switch (iconName) {
      case 'Apple': return Apple;
      case 'Bike': return Bike;
      case 'Zap': return Zap;
      case 'ShoppingBag': return ShoppingBag;
      case 'Droplets': return Droplets;
      default: return Trophy;
    }
  };

  const IconComp = getIcon();
  const isActive = userChallenge && userChallenge.status === 'ACTIVE';
  const isCompleted = userChallenge && userChallenge.status === 'COMPLETED';

  const getColor = () => {
    switch (category) {
      case 'TRANSPORT': return '#3B82F6';
      case 'FOOD': return '#2ECC71';
      case 'ENERGY': return '#F0A500';
      case 'SHOPPING': return '#EC4899';
      default: return '#2ECC71';
    }
  };

  const getCategoryPill = () => {
    switch (category) {
      case 'TRANSPORT': return 'Transport';
      case 'FOOD': return 'Food';
      case 'ENERGY': return 'Energy';
      case 'SHOPPING': return 'Shopping';
      default: return 'General';
    }
  };

  const color = getColor();

  return (
    <div className={`liquid-glass-card rounded-2xl p-6 flex flex-col justify-between ${isCompleted ? 'opacity-80' : ''}`}>
      <div>
        <div className="flex items-start justify-between">
          <div className="w-13 h-13 liquid-glass-strong rounded-2xl flex items-center justify-center" style={{ width: 52, height: 52 }}>
            <IconComp className="h-8 w-8" style={{ color }} />
          </div>
          <span
            className="liquid-glass rounded-full px-3 py-1 text-[10px] font-body"
            style={{ color: `${color}` }}
          >
            {getCategoryPill()}
          </span>
        </div>

        <h4 className="text-xl font-display font-bold text-white mt-4">{title}</h4>
        <p className="text-sm font-body text-white/60 mt-2 leading-relaxed">{description}</p>

        <div className="flex gap-4 mt-4">
          <span className="text-xs font-body text-white/50">⏱ {durationDays} days</span>
          <span className="text-xs font-body text-green-400">🌿 Saves {co2SavedKg}kg CO₂</span>
        </div>

        {isActive && (
          <div className="mt-4">
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#2ECC71] rounded-full transition-all duration-500" style={{ width: '50%' }} />
            </div>
            <p className="text-xs text-white/40 font-body mt-1">50% complete</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        {isCompleted ? (
          <div className="w-full py-2.5 rounded-full text-sm font-body text-center bg-[#2ECC71] text-forest-950 font-medium">
            ✓ Completed
          </div>
        ) : isActive ? (
          <button
            onClick={() => onComplete(userChallenge.id)}
            disabled={loading}
            className="w-full py-2.5 liquid-glass rounded-full text-sm font-body text-green-400 border border-green-400/30 transition-all disabled:opacity-50 hover:bg-white/5"
          >
            In Progress →
          </button>
        ) : (
          <button
            onClick={() => onJoin(id)}
            disabled={loading}
            className="w-full py-2.5 liquid-glass-strong rounded-full text-sm font-body text-white transition-all disabled:opacity-50 hover:brightness-110"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
}
