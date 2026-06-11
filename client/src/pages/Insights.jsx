import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import { Sparkles, BarChart3, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const COLORS = ['#3B82F6', '#2ECC71', '#F0A500', '#8B5CF6'];

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
        const res = await axios.get('/api/insights/charts');
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
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
            Compiling analytics data...
          </p>
        </div>
      </div>
    );
  }

  // Calculate percentages for breakdown labels
  const totalBreakdown = data.breakdownChart.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-800 dark:text-nature-darkText">
          Carbon Insights
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
          Detailed visual breakdowns and performance trends of your carbon footprint.
        </p>
      </div>

      {/* Row 1: Key Stats Callouts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Biggest Source Card */}
        <div className="bg-white dark:bg-nature-cardDark p-6 rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature flex items-center space-x-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-2xl">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-nature-darkText/30 uppercase block">
              Highest Source
            </span>
            <span className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText mt-0.5">
              {data.biggestSource}
            </span>
          </div>
        </div>

        {/* Gemini Comparison Box */}
        <div className="bg-white dark:bg-nature-cardDark p-6 rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature flex items-center space-x-4">
          <div className="p-3 bg-green-50 dark:bg-green-950/20 text-secondary rounded-2xl">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-nature-darkText/30 uppercase block">
              Average Comparison
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-nature-darkText/80 mt-0.5 block leading-tight">
              You emit roughly <span className="text-secondary font-black">{data.averageComparison}% less</span> than the national average in India.
            </span>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="bg-white dark:bg-nature-cardDark p-6 rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature flex items-center space-x-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-accent rounded-2xl">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-black tracking-widest text-gray-400 dark:text-nature-darkText/30 uppercase block">
              Reduction Trend
            </span>
            <span className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText mt-0.5">
              Steady (-8.2%)
            </span>
          </div>
        </div>

      </div>

      {/* Row 2: Weekly Bar Chart & Category Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Bar Chart (2/3 width) */}
        <div className="lg:col-span-2 bg-white dark:bg-nature-cardDark p-6 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/20 shadow-nature space-y-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-primary dark:text-secondary" />
            <h3 className="text-base font-extrabold text-gray-800 dark:text-nature-darkText uppercase tracking-wider">
              Weekly Emissions (Last 7 Days)
            </h3>
          </div>

          <div className="h-80 w-full text-xs font-semibold">
            {data.weeklyChart.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Log weekly transport or food items to view comparison charts.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.weeklyChart} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      background: 'rgba(255,255,255,0.9)', 
                      border: '1px solid rgba(0,0,0,0.05)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                    }} 
                    labelStyle={{ fontWeight: 'bold' }}
                  />
                  <Bar dataKey="co2" fill="#2ECC71" radius={[8, 8, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Category breakdown Pie/Donut (1/3 width) */}
        <div className="lg:col-span-1 bg-white dark:bg-nature-cardDark p-6 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/20 shadow-nature flex flex-col justify-between space-y-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h3 className="text-base font-extrabold text-gray-800 dark:text-nature-darkText uppercase tracking-wider">
              Category Shares
            </h3>
          </div>

          <div className="h-48 w-full relative flex items-center justify-center">
            {totalBreakdown === 0 ? (
              <div className="text-xs text-gray-400">No data logged.</div>
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Center text */}
                <div className="absolute text-center flex flex-col items-center">
                  <span className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText">
                    {Math.round(totalBreakdown)}
                  </span>
                  <span className="text-[9px] font-bold text-gray-400 dark:text-nature-darkText/30 uppercase">
                    Total kg
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Labels legend */}
          <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
            {data.breakdownChart.map((item, idx) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="text-gray-500 dark:text-nature-darkText/60 truncate">
                  {item.name}: {item.value} kg
                </span>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Row 3: Monthly Trend line (Full width) */}
      <div className="bg-white dark:bg-nature-cardDark p-6 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/20 shadow-nature space-y-6">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-accent" />
          <h3 className="text-base font-extrabold text-gray-800 dark:text-nature-darkText uppercase tracking-wider">
            Monthly Footprint Trend (Last 3 Months)
          </h3>
        </div>

        <div className="h-64 w-full text-xs font-semibold">
          {data.monthlyChart.length === 0 ? (
            <div className="h-full flex items-center justify-center text-gray-400">
              No historical monthly data recorded.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.monthlyChart} margin={{ top: 10, right: 20, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    background: 'rgba(255,255,255,0.9)', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                  }} 
                />
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
  );
}
