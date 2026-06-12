import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { Sparkles, TrendingUp, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

const COLORS = ['#3B82F6', '#2ECC71', '#F0A500', '#EC4899'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="rounded-xl p-3 text-xs"
        style={{
          background: 'rgba(5,13,7,0.9)',
          border: '1px solid rgba(46,204,113,0.3)',
          borderRadius: '12px',
          color: 'white',
        }}
      >
        <p className="text-white/70 font-body">{label}</p>
        <p className="text-white font-display font-bold">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    weeklyChart: [],
    monthlyChart: [],
    breakdownChart: [],
    biggestSource: 'None',
    biggestSourcePct: 0,
    averageComparison: 15,
    trend: 0,
  });

  const now = new Date();
  const monthYear = now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/insights/charts');
        if (res.data.success) setData(res.data.data);
      } catch (error) {
        console.error('Error fetching charts data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const totalBreakdown = data.breakdownChart.reduce((sum, item) => sum + item.value, 0);
  const isBelowAvg = data.averageComparison > 0;
  const trendIsUp = data.trend > 0;

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-6">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="visible">
          <h1 className="text-4xl font-display font-bold text-white">Your Carbon Insights</h1>
          <p className="text-sm font-body text-white/40 mt-1">{monthYear}</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-glass rounded-2xl h-32 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Row 1: Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div custom={1} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6 border-l-4 border-amber-400">
                <p className="text-xs font-body text-white/50 uppercase tracking-wider">Primary Emission Source</p>
                <div className="mt-3 flex items-center space-x-3">
                  <AlertTriangle className="h-10 w-10 text-amber-400" />
                  <div>
                    <p className="text-3xl font-display font-bold text-white">{data.biggestSource}</p>
                    <p className="text-sm font-body text-white/60 mt-1">Accounts for {data.biggestSourcePct}% of your footprint</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                variants={stagger}
                initial="hidden"
                animate="visible"
                className={`liquid-glass-card rounded-2xl p-6 border-l-4 ${isBelowAvg ? 'border-green-400' : 'border-red-400'}`}
              >
                <p className="text-xs font-body text-white/50 uppercase tracking-wider">vs India Average</p>
                <div className="mt-3">
                  <span className={`text-4xl font-display font-bold ${isBelowAvg ? 'text-green-400' : 'text-red-400'}`}>
                    {isBelowAvg ? '↓' : '↑'} {Math.abs(data.averageComparison)}% {isBelowAvg ? 'below' : 'above'}
                  </span>
                  <p className="text-xs font-body text-white/40 mt-1">National average: 1.9 tons/year</p>
                </div>
              </motion.div>

              <motion.div custom={3} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6 border-l-4 border-blue-400">
                <p className="text-xs font-body text-white/50 uppercase tracking-wider">This Month's Trend</p>
                <div className="mt-3 flex items-center space-x-3">
                  <div>
                    <span className="text-4xl font-display font-bold text-white flex items-center">
                      {trendIsUp ? <ArrowUp className="h-6 w-6 text-red-400 mr-1" /> : <ArrowDown className="h-6 w-6 text-green-400 mr-1" />}
                      {Math.abs(data.trend).toFixed(1)}%
                    </span>
                    <p className="text-xs font-body text-white/40 mt-1">compared to last month</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Row 2: Weekly Chart */}
            <motion.div custom={4} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-display font-bold text-white">Weekly Emissions</h3>
                <span className="text-xs font-body text-white/40">Last 7 days</span>
              </div>
              <div className="h-72 w-full">
                {data.weeklyChart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-white/30">
                    <Sparkles className="h-10 w-10 mb-2 opacity-50" />
                    <p className="text-sm font-body">Start logging activities to see your weekly chart</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weeklyChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="rgba(46,204,113,0.08)" vertical={false} />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: 'Nunito', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: 'Nunito', fontSize: 12 }} tickLine={false} axisLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="co2" fill="#2ECC71" radius={[4, 4, 0, 0]} maxBarSize={40} opacity={0.9} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            {/* Row 3: Category Shares + Monthly Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div custom={5} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6">
                <h3 className="text-base font-display font-bold text-white mb-6">Category Shares</h3>
                <div className="h-56">
                  {totalBreakdown === 0 ? (
                    <div className="h-full flex items-center justify-center text-white/30 text-sm font-body">No data logged yet</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.breakdownChart}
                          cx="50%" cy="50%"
                          innerRadius={55}
                          outerRadius={85}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {data.breakdownChart.map((entry, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {data.breakdownChart.map((item, idx) => (
                    <div key={item.name} className="liquid-glass rounded-full px-3 py-1 text-xs flex items-center space-x-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-white/70 font-body">{item.name}</span>
                      <span className="text-white/40 font-body">
                        {totalBreakdown > 0 ? `${Math.round((item.value / totalBreakdown) * 100)}%` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div custom={6} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-6">
                <h3 className="text-base font-display font-bold text-white mb-6">Monthly Trend</h3>
                <div className="h-56">
                  {data.monthlyChart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/30">
                      <TrendingUp className="h-10 w-10 mb-2 opacity-50" />
                      <p className="text-sm font-body">Insufficient data for trend</p>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.monthlyChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="rgba(46,204,113,0.08)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: 'Nunito', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <YAxis stroke="rgba(255,255,255,0.4)" tick={{ fontFamily: 'Nunito', fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <defs>
                          <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2ECC71" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#2ECC71" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="co2" fill="url(#lineGradient)" stroke="none" />
                        <Line
                          type="monotone"
                          dataKey="co2"
                          stroke="#2ECC71"
                          strokeWidth={2}
                          dot={{ r: 5, fill: '#2ECC71', strokeWidth: 0 }}
                          activeDot={{ r: 7, fill: '#2ECC71' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
