import React from 'react';
import { Sparkles } from 'lucide-react';

export default function InsightTip({ tip, loading }) {
  return (
    <div className="liquid-glass-strong rounded-2xl p-5 border-l-2 border-[#2ECC71] relative overflow-hidden">
      <div className="flex items-start space-x-4">
        <div className="p-2.5 bg-[#2ECC71]/10 rounded-xl text-[#2ECC71] shrink-0">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="liquid-glass px-2 py-0.5 rounded-full text-[10px] text-[#2ECC71] font-medium">
              AI Insight
            </span>
          </div>
          {loading ? (
            <div className="space-y-2 py-2">
              <div className="h-3 bg-white/10 rounded-full w-full animate-pulse" />
              <div className="h-3 bg-white/10 rounded-full w-3/4 animate-pulse" />
            </div>
          ) : (
            <p className="text-sm font-body text-white/80 leading-relaxed">
              {tip || "Start logging your daily transport, foods, and energy items to receive custom reduction ideas from Gemini!"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
