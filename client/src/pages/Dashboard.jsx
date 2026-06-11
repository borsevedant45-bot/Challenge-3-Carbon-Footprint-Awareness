import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
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
  TrendingDown
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
    // If user hasn't set their baseline score, redirect them to Onboarding
    if (user && user.baselineScore === 0) {
      navigate('/onboarding');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch summary
        const summaryRes = await axios.get('/api/activities/summary');
        if (summaryRes.data.success) {
          setSummary(summaryRes.data.data);
        }

        // Fetch recent activities
        const activitiesRes = await axios.get('/api/activities?limit=5');
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
        const tipRes = await axios.get('/api/insights/daily-tip');
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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Calculate default monthly target: User's baseline score divided by 12 (annual -> monthly)
  // Or fallback to 250 kg/month if not loaded yet
  const monthlyTarget = user?.baselineScore ? user.baselineScore / 12 : 250;

  const categoryCards = [
    { name: 'Transport', key: 'TRANSPORT', icon: Car, color: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20' },
    { name: 'Diet / Food', key: 'FOOD', icon: Apple, color: 'text-green-500 bg-green-50 dark:bg-green-950/20' },
    { name: 'Energy', key: 'ENERGY', icon: Zap, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
    { name: 'Shopping', key: 'SHOPPING', icon: ShoppingBag, color: 'text-purple-500 bg-purple-50 dark:bg-purple-950/20' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative">
      
      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => navigate('/log')}
        className="fixed bottom-6 right-6 z-50 p-4 bg-secondary text-white rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center hover:bg-secondary/95 focus:outline-none"
        title="Quick Log Activity"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Welcome & Streak Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-800 dark:text-nature-darkText">
            Hello, {user?.name.split(' ')[0]} 🌱
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
            Track your footprint and reduce your environmental impact.
          </p>
        </div>

        {/* Streak & Active goal indicator */}
        <div className="flex items-center space-x-3.5">
          <TiltCard>
            <div className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-950/30">
              <Flame className="h-5 w-5 text-accent animate-pulse" />
              <span className="text-xs font-extrabold text-accent">
                🔥 {summary.streak} Day Log Streak
              </span>
            </div>
          </TiltCard>

          {summary.activeGoal && (
            <TiltCard>
              <div className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-100 dark:border-green-950/30">
                <TrendingDown className="h-5 w-5 text-secondary" />
                <span className="text-xs font-extrabold text-secondary">
                  Target: {Math.round(summary.activeGoal.targetCo2Kg)} kg
                </span>
              </div>
            </TiltCard>
          )}
        </div>
      </div>

      {/* Main Row: Gauge & AI Tip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Gauge card */}
        <div className="md:col-span-1">
          <CO2Gauge value={summary.monthlyTotal} target={monthlyTarget} />
        </div>

        {/* AI Tip Coach Card */}
        <div className="md:col-span-2 flex flex-col justify-between">
          <TiltCard>
            <InsightTip tip={aiTip} loading={tipLoading} />
          </TiltCard>

          {/* Core Overview Quick Insight */}
          <TiltCard>
            <div className="mt-6 md:mt-0 p-6 bg-white dark:bg-nature-cardDark rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-xs font-black text-gray-400 dark:text-nature-darkText/30 uppercase tracking-widest">
                Estimated Annual Footprint
              </h4>
              <p className="text-2xl font-display font-black text-gray-800 dark:text-nature-darkText">
                {user?.baselineScore?.toLocaleString()} kg CO₂
              </p>
            </div>
            <Link 
              to="/insights" 
              className="text-xs font-extrabold text-secondary hover:text-primary transition-colors flex items-center space-x-1"
            >
              <span>View breakdown</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          </TiltCard>
        </div>
      </div>

      {/* Category Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText">
          Monthly Emissions by Category
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categoryCards.map((card) => {
            const Icon = card.icon;
            const amount = summary.categoryTotals[card.key] || 0;
            return (
              <TiltCard key={card.name}>
              <div 
                className="bg-white dark:bg-nature-cardDark p-5 rounded-2xl border border-gray-100 dark:border-nature-darkBg/25 shadow-nature hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 rounded-xl ${card.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-nature-darkText/35">
                    CO₂
                  </span>
                </div>
                <div className="mt-4">
                  <span className="block text-2xl font-display font-black text-gray-800 dark:text-nature-darkText">
                    {Math.round(amount)} kg
                  </span>
                  <span className="block text-[10px] font-bold text-gray-400 dark:text-nature-darkText/30 uppercase tracking-widest mt-1">
                    {card.name}
                  </span>
                </div>
              </div>
              </TiltCard>
            );
          })}
        </div>
      </div>

      {/* Recent Activity List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent logs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText">
              Recent Activity Logs
            </h3>
            <Link 
              to="/log" 
              className="text-xs font-bold text-secondary hover:text-primary transition-colors flex items-center space-x-1"
            >
              <span>Log a new item</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentActivities.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-nature-cardDark rounded-3xl border border-dashed border-gray-200 dark:border-nature-darkBg/40">
                <p className="text-sm text-gray-400 dark:text-nature-darkText/40">
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

        {/* Small marketplace / challenge sidebar summary */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Challenges box */}
          <div className="bg-white dark:bg-nature-cardDark p-6 rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature space-y-4">
            <h4 className="text-sm font-extrabold text-gray-800 dark:text-nature-darkText uppercase tracking-wider">
              Earn Green Badges
            </h4>
            <p className="text-xs text-gray-400 dark:text-nature-darkText/50 leading-relaxed">
              Complete sustainability tasks like vegetarian eating and cycling commutes to decrease your footprint score and achieve badges.
            </p>
            <Link 
              to="/challenges" 
              className="w-full py-3 bg-primary/10 dark:bg-secondary/15 hover:bg-primary dark:hover:bg-secondary text-primary dark:text-secondary hover:text-white dark:hover:text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Explore Challenges</span>
            </Link>
          </div>

          {/* Offsetting project seed box */}
          <div className="bg-gradient-to-tr from-secondary/10 to-primary/10 dark:from-nature-cardDark dark:to-nature-cardDark p-6 rounded-3xl border border-secondary/20 dark:border-nature-darkBg/30 shadow-nature space-y-4">
            <h4 className="text-sm font-extrabold text-primary dark:text-secondary uppercase tracking-wider">
              Offset Marketplace
            </h4>
            <p className="text-xs text-gray-500 dark:text-nature-darkText/60 leading-relaxed">
              Fund native reforestation, solar deployments, and mangrove restorations in India to offset unavoidable emissions.
            </p>
            <Link 
              to="/offset" 
              className="w-full py-3 bg-secondary text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center hover:bg-secondary/90 shadow-md shadow-secondary/15"
            >
              <span>Offset carbon impact</span>
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
