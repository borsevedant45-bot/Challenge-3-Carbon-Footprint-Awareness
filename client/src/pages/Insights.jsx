import React, { useEffect, useState } from 'react';
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
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Sparkles, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react';

const COLORS = ['#3B82F6', '#2ECC71', '#F0A500', '#8B5CF6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="liquid-glass-card rounded-xl p-3 text-xs">
        <p className="text-white/70 font-medium">{label}</p>
        <p className="text-white font-bold">{payload[0].value} kg</p>
      </div>
    );
  }
  return null;
};

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    weeklyChart: [],
    monthlyChart: [],
    breakdownChart: [],
    biggestSource: 'None',
    averageComparison: 15
  });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/insights/charts');
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching charts data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050D07]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2ECC71]" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest animate-pulse">
            Compiling analytics data...
          </p>
        </div>
      </div>
    );
  }

  const totalBreakdown = data.breakdownChart.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
            Carbon Insights
          </h1>
          <p className="text-sm text-white/40 font-body mt-1">
            Detailed visual breakdowns and performance trends of your carbon footprint.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="liquid-glass-card rounded-2xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-red-950/30 text-red-400">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase block">
                Highest Source
              </span>
              <span className="text-lg font-display font-bold text-white mt-0.5 block">
                {data.biggestSource}
              </span>
            </div>
          </div>

          <div className="liquid-glass-card rounded-2xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-green-950/30 text-[#2ECC71]">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase block">
                Average Comparison
              </span>
              <span className="text-xs font-medium text-white/70 mt-0.5 block leading-tight">
                You emit roughly <span className="text-[#2ECC71] font-bold">{data.averageComparison}% less</span> than the national average in India.
              </span>
            </div>
          </div>

          <div className="liquid-glass-card rounded-2xl p-6 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-amber-950/30 text-[#F0A500]">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest text-white/30 uppercase block">
                Reduction Trend
              </span>
              <span className="text-lg font-display font-bold text-white mt-0.5 block">
                Steady (-8.2%)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 liquid-glass-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-[#2ECC71]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Weekly Emissions (Last 7 Days)
              </h3>
            </div>

            <div className="h-80 w-full text-xs font-medium">
              {data.weeklyChart.length === 0 ? (
                <div className="h-full flex items-center justify-center text-white/40">
                  Log weekly transport or food items to view comparison charts.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.weeklyChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                    <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="co2" fill="#2ECC71" radius={[8, 8, 0, 0]} maxBarSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 liquid-glass-card rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#8B5CF6]" />
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                Category Shares
              </h3>
            </div>

            <div className="h-48 w-full relative flex items-center justify-center">
              {totalBreakdown === 0 ? (
                <div className="text-xs text-white/40">No data logged.</div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.breakdownChart}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {data.breakdownChart.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center flex flex-col items-center">
                    <span className="text-lg font-display font-bold text-white">
                      {Math.round(totalBreakdown)}
                    </span>
                    <span className="text-[9px] font-bold text-white/30 uppercase">
                      Total kg
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              {data.breakdownChart.map((item, idx) => (
                <div key={item.name} className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-white/60 truncate">
                    {item.name}: {item.value} kg
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#F0A500]" />
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Monthly Footprint Trend (Last 3 Months)
            </h3>
          </div>

          <div className="h-64 w-full text-xs font-medium">
            {data.monthlyChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/40">
                No historical monthly data recorded.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.monthlyChart} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#F0A500"
                    strokeWidth={4}
                    dot={{ r: 6, strokeWidth: 0, fill: '#F0A500' }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
