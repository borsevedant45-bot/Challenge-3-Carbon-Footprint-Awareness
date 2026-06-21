import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Car,
  Flame,
  Apple,
  Home,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function Onboarding() {
  const { updateBaseline } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [baselineScore, setBaselineScore] = useState(0);
  const [analysis, setAnalysis] = useState('');

  const [carType, setCarType] = useState('petrol');
  const [weeklyKm, setWeeklyKm] = useState(50);
  const [flightsPerYear, setFlightsPerYear] = useState(1);
  const [diet, setDiet] = useState('omnivore');
  const [houseSize, setHouseSize] = useState('Medium');
  const [energySource, setEnergySource] = useState('mixed');
  const [clothesPerMonth, setClothesPerMonth] = useState(2);
  const [onlineOrdersPerMonth, setOnlineOrdersPerMonth] = useState(4);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleCalculate = async () => {
    setLoading(true);
    const quizData = {
      transport: { carType, weeklyKm: Number(weeklyKm), flightsPerYear: Number(flightsPerYear) },
      diet,
      energy: { houseSize, energySource },
      shopping: { clothesPerMonth: Number(clothesPerMonth), onlineOrdersPerMonth: Number(onlineOrdersPerMonth) }
    };
    const result = await updateBaseline(quizData);
    setLoading(false);
    if (result.success) {
      setBaselineScore(result.baselineScore);
      setAnalysis(result.geminiAnalysis);
      setStep(5);
    } else {
      alert('Error updating baseline carbon score. Please try again.');
    }
  };

  const getStepPercent = () => ((step - 1) / 4) * 100;

  const btnClass = (isActive) =>
    `py-3.5 rounded-2xl border text-xs font-bold capitalize transition-all ${
      isActive
        ? 'bg-white/10 border-white/20 text-white font-bold'
        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
    }`;

  return (
    <div className="min-h-screen bg-[#050D07] flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl liquid-glass-card rounded-2xl p-8 sm:p-12 relative overflow-hidden">
        {step < 5 && (
          <div className="mb-8 space-y-4">
            <div className="flex justify-between items-center text-xs font-bold tracking-widest text-[#2ECC71] uppercase">
              <span>STEP {step} OF 4</span>
              <span>{Math.round(getStepPercent())}%</span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#2ECC71] h-full rounded-full"
                animate={{ width: `${getStepPercent()}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'rgba(59,130,246,0.2)' }}>
                  <Car className="h-6 w-6 text-blue-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Tell us about your transit</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">What fuel type does your car use?</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {['petrol', 'diesel', 'electric', 'none'].map((t) => (
                      <button key={t} type="button" onClick={() => setCarType(t)}
                        className={btnClass(carType === t)}>{t}</button>
                    ))}
                  </div>
                </div>
                {carType !== 'none' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Approximate weekly kilometers driven</label>
                    <input type="number" value={weeklyKm} onChange={(e) => setWeeklyKm(e.target.value)} min="0" className="w-full px-4 py-3.5 liquid-glass-input text-sm" />
                  </div>
                )}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">How many flights do you take per year?</label>
                  <input type="number" value={flightsPerYear} onChange={(e) => setFlightsPerYear(e.target.value)} min="0" className="w-full px-4 py-3.5 liquid-glass-input text-sm" />
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                <button type="button" onClick={nextStep}
                  className="px-6 py-3 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center space-x-2 uppercase tracking-wider">
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'rgba(46,204,113,0.2)' }}>
                  <Apple className="h-6 w-6 text-[#2ECC71]" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Tell us about your diet</h2>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Select your primary diet type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {[
                    { id: 'vegan', name: 'Vegan', desc: 'Plant-based foods only (lowest footprint)' },
                    { id: 'vegetarian', name: 'Vegetarian', desc: 'No meat, includes dairy/eggs' },
                    { id: 'omnivore', name: 'Omnivore', desc: 'Balanced mix of grains, vegetables, and meats' },
                    { id: 'heavy_meat', name: 'Heavy Meat Eater', desc: 'Includes meat in almost every meal' }
                  ].map((d) => (
                    <button key={d.id} type="button" onClick={() => setDiet(d.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        diet === d.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                      }`}>
                      <span className="block text-sm font-bold text-white">{d.name}</span>
                      <span className="block text-[10px] font-medium text-white/40 mt-1">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <button type="button" onClick={prevStep}
                  className="px-6 py-3 border border-white/10 text-white/70 font-bold rounded-full flex items-center space-x-2 text-sm uppercase tracking-wider">
                  <ArrowLeft className="h-4 w-4" /><span>Back</span>
                </button>
                <button type="button" onClick={nextStep}
                  className="px-6 py-3 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center space-x-2 uppercase tracking-wider">
                  <span>Next</span><ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'rgba(240,165,0,0.2)' }}>
                  <Home className="h-6 w-6 text-[#F0A500]" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Tell us about your home</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">What size is your home?</label>
                  <div className="grid grid-cols-3 gap-3">
                    {['Small Apartment', 'Medium House', 'Large Mansion'].map((size) => (
                      <button key={size} type="button" onClick={() => setHouseSize(size)}
                        className={btnClass(houseSize === size)}>{size.split(' ')[0]}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">What is your electricity energy source?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'renewable', title: 'Solar / Hydro', desc: '100% Renewable source' },
                      { id: 'mixed', title: 'Mixed', desc: 'Hybrid grid & solar' },
                      { id: 'fossil', title: 'Standard Grid', desc: 'Coal / Gas (India average)' }
                    ].map((source) => (
                      <button key={source.id} type="button" onClick={() => setEnergySource(source.id)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          energySource === source.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                        }`}>
                        <span className="block text-xs font-bold text-white">{source.title}</span>
                        <span className="block text-[9px] font-medium text-white/40 mt-1">{source.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <button type="button" onClick={prevStep}
                  className="px-6 py-3 border border-white/10 text-white/70 font-bold rounded-full flex items-center space-x-2 text-sm uppercase tracking-wider">
                  <ArrowLeft className="h-4 w-4" /><span>Back</span>
                </button>
                <button type="button" onClick={nextStep}
                  className="px-6 py-3 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center space-x-2 uppercase tracking-wider">
                  <span>Next</span><ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              <div className="flex items-center space-x-3">
                <div className="p-3.5 rounded-xl" style={{ backgroundColor: 'rgba(139,92,246,0.2)' }}>
                  <ShoppingBag className="h-6 w-6 text-purple-400" />
                </div>
                <h2 className="text-2xl font-display font-bold text-white">Tell us about your shopping</h2>
              </div>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">How many new clothing items do you buy monthly?</label>
                  <input type="number" value={clothesPerMonth} onChange={(e) => setClothesPerMonth(e.target.value)} min="0" className="w-full px-4 py-3.5 liquid-glass-input text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">How many online delivery orders do you make monthly?</label>
                  <input type="number" value={onlineOrdersPerMonth} onChange={(e) => setOnlineOrdersPerMonth(e.target.value)} min="0" className="w-full px-4 py-3.5 liquid-glass-input text-sm" />
                </div>
              </div>
              <div className="pt-4 flex justify-between">
                <button type="button" onClick={prevStep}
                  className="px-6 py-3 border border-white/10 text-white/70 font-bold rounded-full flex items-center space-x-2 text-sm uppercase tracking-wider">
                  <ArrowLeft className="h-4 w-4" /><span>Back</span>
                </button>
                <button type="button" onClick={handleCalculate} disabled={loading}
                  className="px-6 py-3 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center space-x-2 uppercase tracking-wider disabled:opacity-50">
                  <span>{loading ? 'Analyzing...' : 'Show Results'}</span>
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="text-center space-y-6"
            >
              <div className="inline-flex p-4 bg-green-950/30 text-[#2ECC71] rounded-2xl">
                <CheckCircle className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold text-white">Your baseline score is ready!</h2>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">ESTIMATED ANNUAL EMISSIONS</p>
              </div>
              <div className="py-6 px-8 inline-block bg-white/5 border border-white/10 rounded-2xl">
                <span className="text-5xl font-display font-bold text-[#2ECC71]">{baselineScore.toLocaleString()}</span>
                <span className="text-sm font-bold text-white/30 block mt-1">kg CO₂ / year</span>
              </div>
              <div className="text-left bg-white/5 p-6 rounded-2xl border border-white/10 max-w-md mx-auto space-y-3">
                <h4 className="text-xs font-bold text-[#2ECC71] uppercase tracking-widest flex items-center space-x-1.5 mb-2">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Baseline Analysis</span>
                </h4>
                <div className="text-sm text-white/70 leading-relaxed whitespace-pre-line">{analysis}</div>
              </div>
              <div className="pt-4">
                <button type="button" onClick={() => navigate('/')}
                  className="w-full sm:w-auto px-8 py-4 liquid-glass-strong rounded-full text-sm font-bold text-white uppercase tracking-wider">
                  Enter Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
