import React from 'react';
import { Apple, Bike, Zap, ShoppingBag, Droplets, Trophy, CheckCircle, ShieldCheck } from 'lucide-react';

export default function ChallengeCard({ challenge, userChallenge, onJoin, onComplete, loading }) {
  const { id, title, description, co2SavedKg, durationDays, category, iconName } = challenge;

  // Resolve Icon component
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

  // Determine user Challenge status
  const isActive = userChallenge && userChallenge.status === 'ACTIVE';
  const isCompleted = userChallenge && userChallenge.status === 'COMPLETED';

  // Styling category color maps
  const getColorStyles = () => {
    switch (category) {
      case 'TRANSPORT': return 'text-blue-500 bg-blue-50 dark:bg-blue-950/20';
      case 'FOOD': return 'text-green-500 bg-green-50 dark:bg-green-950/20';
      case 'ENERGY': return 'text-amber-500 bg-amber-50 dark:bg-amber-950/20';
      case 'SHOPPING': return 'text-purple-500 bg-purple-50 dark:bg-purple-950/20';
      default: return 'text-secondary bg-green-50 dark:bg-green-950/20';
    }
  };

  return (
    <div className={`p-5 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
      isCompleted 
        ? 'bg-green-50/50 dark:bg-nature-cardDark border-secondary/35 opacity-90' 
        : isActive 
          ? 'bg-white dark:bg-nature-cardDark border-primary/30 dark:border-nature-darkBg/60 shadow-nature' 
          : 'bg-white dark:bg-nature-cardDark border-gray-100 dark:border-nature-darkBg/10 hover:shadow-natureHover hover:-translate-y-1'
    }`}>
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl ${getColorStyles()}`}>
            <IconComp className="h-6 w-6" />
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black tracking-widest text-accent uppercase block">
              ⭐ {co2SavedKg} kg saved
            </span>
            <span className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 block mt-0.5">
              {durationDays} Days
            </span>
          </div>
        </div>

        <h4 className="text-base font-extrabold text-gray-800 dark:text-nature-darkText mb-1.5">
          {title}
        </h4>
        <p className="text-xs text-gray-500 dark:text-nature-darkText/60 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div>
        {isCompleted ? (
          <div className="flex items-center space-x-1.5 text-secondary font-bold text-sm bg-green-100/40 dark:bg-green-950/20 px-3 py-2 rounded-xl justify-center">
            <ShieldCheck className="h-4.5 w-4.5 text-secondary animate-bounce" />
            <span>Badge Earned</span>
          </div>
        ) : isActive ? (
          <div className="space-y-3">
            {/* Active Challenge Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>ACTIVE PROGRESS</span>
                <span>50%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-nature-darkBg/50 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-secondary h-full rounded-full" 
                  style={{ width: '50%' }}
                />
              </div>
            </div>
            
            <button
              onClick={() => onComplete(userChallenge.id)}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase text-white bg-secondary hover:bg-secondary/90 transition-all shadow-md shadow-secondary/15 flex items-center justify-center space-x-1"
            >
              <CheckCircle className="h-4 w-4" />
              <span>Complete Challenge</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => onJoin(id)}
            disabled={loading}
            className="w-full py-2.5 rounded-xl text-xs font-extrabold tracking-wider uppercase text-primary dark:text-secondary bg-primary/10 dark:bg-secondary/10 hover:bg-primary dark:hover:bg-secondary hover:text-white dark:hover:text-white transition-all flex items-center justify-center"
          >
            Join Challenge
          </button>
        )}
      </div>
    </div>
  );
}
