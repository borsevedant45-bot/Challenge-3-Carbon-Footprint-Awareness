import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

export default function InsightTip({ tip, loading }) {
  return (
    <div className="relative overflow-hidden p-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-nature-cardDark dark:to-nature-cardDark border border-primary/20 dark:border-nature-darkBg/30 rounded-3xl shadow-nature">
      {/* Decorative leaf/circles background */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-secondary/5 rounded-full blur-xl pointer-events-none" />

      <div className="flex items-start space-x-4">
        {/* Icon container */}
        <div className="p-3 bg-primary/20 dark:bg-secondary/20 rounded-2xl text-primary dark:text-secondary mt-0.5 animate-pulse">
          <Sparkles className="h-5 w-5" />
        </div>

        {/* Tip Text */}
        <div className="flex-1">
          <h4 className="text-sm font-extrabold text-primary dark:text-secondary uppercase tracking-wider mb-1">
            Today's AI Tip
          </h4>
          
          {loading ? (
            <div className="space-y-2 py-2">
              <div className="h-3 bg-gray-200 dark:bg-nature-darkBg/60 rounded-full w-full animate-pulse" />
              <div className="h-3 bg-gray-200 dark:bg-nature-darkBg/60 rounded-full w-3/4 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm font-medium text-gray-700 dark:text-nature-darkText/80 leading-relaxed">
              {tip || "Start logging your daily transport, foods, and energy items to receive custom reduction ideas from Gemini!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
