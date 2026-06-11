import React from 'react';
import { Car, Apple, Zap, ShoppingBag, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function ActivityCard({ activity }) {
  const { category, description, co2Kg, date } = activity;

  // Format date
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Category Icon & Color definitions
  const getCategoryStyles = () => {
    switch (category) {
      case 'TRANSPORT':
        return {
          icon: Car,
          bgColor: 'bg-blue-50 dark:bg-blue-950/20',
          iconColor: 'text-blue-500 dark:text-blue-400'
        };
      case 'FOOD':
        return {
          icon: Apple,
          bgColor: 'bg-green-50 dark:bg-green-950/20',
          iconColor: 'text-secondary'
        };
      case 'ENERGY':
        // If CO2 is negative, it's an offset pledge
        if (co2Kg < 0) {
          return {
            icon: Zap,
            bgColor: 'bg-emerald-50 dark:bg-emerald-950/25',
            iconColor: 'text-emerald-500 dark:text-emerald-400'
          };
        }
        return {
          icon: Zap,
          bgColor: 'bg-amber-50 dark:bg-amber-950/20',
          iconColor: 'text-accent'
        };
      case 'SHOPPING':
        return {
          icon: ShoppingBag,
          bgColor: 'bg-purple-50 dark:bg-purple-950/20',
          iconColor: 'text-purple-500'
        };
      default:
        return {
          icon: Zap,
          bgColor: 'bg-gray-50 dark:bg-gray-950/20',
          iconColor: 'text-gray-500'
        };
    }
  };

  const { icon: CategoryIcon, bgColor, iconColor } = getCategoryStyles();
  const isOffset = co2Kg < 0;

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-nature-cardDark rounded-2xl border border-gray-100 dark:border-nature-darkBg/20 hover:shadow-natureHover hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center space-x-3.5">
        {/* Left Icon */}
        <div className={`p-3 rounded-xl ${bgColor} ${iconColor}`}>
          <CategoryIcon className="h-5 w-5" />
        </div>
        
        {/* Texts */}
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 dark:text-nature-darkText/30 uppercase tracking-wider">
            {category} {isOffset && '• OFFSET'}
          </span>
          <span className="text-sm font-semibold text-gray-700 dark:text-nature-darkText max-w-[200px] sm:max-w-md truncate">
            {description}
          </span>
          <span className="text-[10px] font-medium text-gray-400 dark:text-nature-darkText/40">
            {formattedDate}
          </span>
        </div>
      </div>

      {/* CO2 indicator */}
      <div className="flex items-center space-x-1">
        {isOffset ? (
          <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-extrabold text-sm sm:text-base">
            <ArrowDownRight className="h-4 w-4 mr-0.5" />
            <span>{Math.abs(Math.round(co2Kg))} kg</span>
          </div>
        ) : (
          <div className="flex items-center text-gray-700 dark:text-nature-darkText font-extrabold text-sm sm:text-base">
            <ArrowUpRight className="h-4 w-4 mr-0.5 text-red-400" />
            <span>{Math.round(co2Kg)} kg</span>
          </div>
        )}
      </div>
    </div>
  );
}
