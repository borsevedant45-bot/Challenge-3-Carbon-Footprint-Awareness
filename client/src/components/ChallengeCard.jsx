import React from 'react';
import { Apple, Bike, Zap, ShoppingBag, Droplets, Trophy, CheckCircle, ShieldCheck } from 'lucide-react';

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
      case 'SHOPPING': return '#8B5CF6';
      default: return '#2ECC71';
    }
  };

  const color = getColor();

  return (
    <div className={`liquid-glass-card rounded-2xl p-5 flex flex-col justify-between ${
      isCompleted ? 'opacity-80' : ''
    }`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}20` }}>
            <IconComp className="h-6 w-6" style={{ color }} />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold tracking-widest text-[#F0A500] uppercase block">
              {co2SavedKg} kg saved
            </span>
            <span className="text-xs font-bold text-white/40 block mt-0.5">{durationDays} Days</span>
          </div>
        </div>

        <h4 className="text-base font-bold text-white mb-1.5">{title}</h4>
        <p className="text-xs text-white/60 font-body leading-relaxed mb-4">{description}</p>
      </div>

      <div>
        {isCompleted ? (
          <div className="flex items-center space-x-1.5 text-[#2ECC71] font-bold text-sm bg-green-950/20 px-3 py-2 rounded-xl justify-center">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span>Badge Earned</span>
          </div>
        ) : isActive ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-white/40">
                <span>Progress</span>
                <span>50%</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-[#2ECC71] h-full rounded-full" style={{ width: '50%' }} />
              </div>
            </div>
            <button
              onClick={() => onComplete(userChallenge.id)}
              disabled={loading}
              className="w-full py-2.5 liquid-glass-strong rounded-full text-xs font-bold tracking-wider uppercase text-white flex items-center justify-center space-x-1 disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onJoin(id)}
            disabled={loading}
            className="w-full py-2.5 liquid-glass rounded-full text-xs font-bold tracking-wider uppercase text-white/80 hover:text-white transition-all flex items-center justify-center disabled:opacity-50"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
}
