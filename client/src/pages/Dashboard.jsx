import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CO2Gauge from '../components/CO2Gauge';
import ActivityCard from '../components/ActivityCard';
import InsightTip from '../components/InsightTip';
import TiltCard from '../components/TiltCard';
import {
  Plus,
  Flame,
  Car,
  Apple,
  Zap,
  ShoppingBag,
  ArrowRight,
  TrendingDown,
  Leaf,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    categoryTotals: { TRANSPORT: 0, FOOD: 0, ENERGY: 0, SHOPPING: 0 },
    monthlyTotal: 0,
    streak: 0,
    activeGoal: null
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [aiTip, setAiTip] = useState('');

  const [loading, setLoading] = useState(true);
  const [tipLoading, setTipLoading] = useState(true);

  useEffect(() => {
    if (user && user.baselineScore === 0) {
      navigate('/onboarding');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const summaryRes = await api.get('/api/activities/summary');
        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data);
        }
        const activitiesRes = await api.get('/api/activities?limit=5');
        if (activitiesRes.data.success) {
          setRecentActivities(activitiesRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching dashboard summary:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAiTip = async () => {
      try {
        setTipLoading(true);
        const tipRes = await api.get('/api/insights/daily-tip');
        if (tipRes.data.success) {
          setAiTip(tipRes.data.data.tip);
        }
      } catch (err) {
        console.error('Error fetching daily tip:', err);
      } finally {
        setTipLoading(false);
      }
    };

    if (user) {
      fetchDashboardData();
      fetchAiTip();
    }
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050D07]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2ECC71]" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  const monthlyTarget = user?.baselineScore ? user.baselineScore / 12 : 250;

  const categoryCards = [
    { name: 'Transport', key: 'TRANSPORT', icon: Car, color: '#3B82F6' },
    { name: 'Diet / Food', key: 'FOOD', icon: Apple, color: '#2ECC71' },
    { name: 'Energy', key: 'ENERGY', icon: Zap, color: '#F0A500' },
    { name: 'Shopping', key: 'SHOPPING', icon: ShoppingBag, color: '#8B5CF6' }
  ];

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
        <button
          onClick={() => navigate('/log')}
          className="fixed bottom-6 right-6 z-50 p-4 liquid-glass-strong rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
          title="Quick Log Activity"
        >
          <Plus className="h-7 w-7 text-white" />
        </button>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Hello, {user?.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-white/40 font-body mt-1">
              Track your footprint and reduce your environmental impact.
            </p>
          </div>

          <div className="flex items-center space-x-3.5">
            <TiltCard>
              <div className="flex items-center space-x-1.5 px-4.5 py-2.5 liquid-glass-card rounded-2xl">
                <Flame className="h-5 w-5 text-[#F0A500] animate-pulse" />
                <span className="text-xs font-bold text-white/80">
                  {summary.streak} Day Log Streak
                </span>
              </div>
            </TiltCard>

            {summary.activeGoal && (
              <TiltCard>
                <div className="flex items-center space-x-1.5 px-4.5 py-2.5 liquid-glass-card rounded-2xl">
                  <TrendingDown className="h-5 w-5 text-[#2ECC71]" />
                  <span className="text-xs font-bold text-white/80">
                    Target: {Math.round(summary.activeGoal.targetCo2Kg)} kg
                  </span>
                </div>
              </TiltCard>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <CO2Gauge value={summary.monthlyTotal} target={monthlyTarget} />
          </div>

          <div className="md:col-span-2 flex flex-col justify-between space-y-6">
            <TiltCard>
              <InsightTip tip={aiTip} loading={tipLoading} />
            </TiltCard>

            <TiltCard>
              <div className="liquid-glass-card rounded-2xl p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white/30 uppercase tracking-widest">
                    Estimated Annual Footprint
                  </h4>
                  <p className="text-2xl font-display font-bold text-white">
                    {user?.baselineScore?.toLocaleString()} kg CO₂
                  </p>
                </div>
                <Link
                  to="/insights"
                  className="text-xs font-bold text-[#2ECC71] hover:text-green-300 transition-colors flex items-center space-x-1"
                >
                  <span>View breakdown</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </TiltCard>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-white">
            Monthly Emissions by Category
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categoryCards.map((card) => {
              const Icon = card.icon;
              const amount = summary.categoryTotals[card.key] || 0;
              return (
                <TiltCard key={card.name}>
                  <div className="liquid-glass-card rounded-2xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-xl" style={{ backgroundColor: `${card.color}20` }}>
                        <Icon className="h-5 w-5" style={{ color: card.color }} />
                      </div>
                      <span className="text-[10px] font-bold text-white/35">CO₂</span>
                    </div>
                    <div className="mt-4">
                      <span className="block text-2xl font-display font-bold text-white">
                        {Math.round(amount)} kg
                      </span>
                      <span className="block text-[10px] font-bold text-white/30 uppercase tracking-widest mt-1">
                        {card.name}
                      </span>
                    </div>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-display font-bold text-white">
                Recent Activity Logs
              </h3>
              <Link
                to="/log"
                className="text-xs font-bold text-[#2ECC71] hover:text-green-300 transition-colors flex items-center space-x-1"
              >
                <span>Log a new item</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentActivities.length === 0 ? (
                <div className="p-8 text-center liquid-glass-card rounded-2xl border border-dashed border-white/10">
                  <p className="text-sm text-white/40">
                    No activities logged recently. Try adding your commute, diet, or electricity details!
                  </p>
                </div>
              ) : (
                recentActivities.map((act) => (
                  <ActivityCard key={act.id} activity={act} />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <div className="liquid-glass-card rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Earn Green Badges
              </h4>
              <p className="text-xs text-white/50 font-body leading-relaxed">
                Complete sustainability tasks like vegetarian eating and cycling commutes to decrease your footprint score and achieve badges.
              </p>
              <Link
                to="/challenges"
                className="w-full py-3 liquid-glass-strong rounded-full text-xs font-bold text-white uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Explore Challenges</span>
              </Link>
            </div>

            <div className="liquid-glass-card rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Offset Marketplace
              </h4>
              <p className="text-xs text-white/50 font-body leading-relaxed">
                Fund native reforestation, solar deployments, and mangrove restorations in India to offset unavoidable emissions.
              </p>
              <Link
                to="/offset"
                className="w-full py-3 liquid-glass-strong rounded-full text-xs font-bold text-white uppercase tracking-wider transition-all flex items-center justify-center"
              >
                <span>Offset carbon impact</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
