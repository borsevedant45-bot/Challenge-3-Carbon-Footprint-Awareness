import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import api from '../api/axios';
import {
  Car,
  Apple,
  Zap,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  X,
  Minus,
  Plus,
  UtensilsCrossed,
} from 'lucide-react';
import {
  calculateTransportEstimate,
  calculateFlightEstimate,
  calculateEnergyEstimate,
  calculateShoppingEstimate,
} from '../utils/co2Calculator';

function AnimatedCo2({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(1));
  useEffect(() => {
    animate(count, value, { duration: 0.4, ease: 'easeOut' });
  }, [value, count]);
  const color = value < 5 ? '#2ECC71' : value < 15 ? '#F0A500' : '#EF4444';
  return <motion.span className="text-5xl font-display font-bold" style={{ color }}>{rounded}</motion.span>;
}

const TABS = [
  { id: 'TRANSPORT', label: 'Transport', icon: Car },
  { id: 'FOOD', label: 'Food', icon: UtensilsCrossed },
  { id: 'ENERGY', label: 'Energy', icon: Zap },
  { id: 'SHOPPING', label: 'Shopping', icon: ShoppingBag },
];

const stagger = {
  hidden: { opacity: 0, y: 15 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, ease: 'easeOut', duration: 0.4 },
  }),
};

export default function Log() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('TRANSPORT');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [savedCo2, setSavedCo2] = useState(0);
  const [toast, setToast] = useState(null);

  const [transportType, setTransportType] = useState('car');
  const [carType, setCarType] = useState('petrol');
  const [transportDistance, setTransportDistance] = useState(20);
  const [flightType, setFlightType] = useState('short');
  const [dietType, setDietType] = useState('omnivore');
  const [dietDays, setDietDays] = useState(1);
  const [energyKwh, setEnergyKwh] = useState(10);
  const [energySource, setEnergySource] = useState('fossil');
  const [clothingItems, setClothingItems] = useState(1);
  const [onlineOrders, setOnlineOrders] = useState(2);
  const [co2Estimate, setCo2Estimate] = useState(0);

  useEffect(() => {
    let e = 0;
    if (activeTab === 'TRANSPORT') {
      e = transportType === 'car'
        ? calculateTransportEstimate(carType, Number(transportDistance))
        : calculateFlightEstimate(flightType, Number(transportDistance));
    } else if (activeTab === 'FOOD') {
      const f = { vegan: 2.5, vegetarian: 3.8, omnivore: 5.5, heavy_meat: 7.2 };
      e = (f[dietType] || 5.5) * Number(dietDays);
    } else if (activeTab === 'ENERGY') {
      e = calculateEnergyEstimate(Number(energyKwh), energySource);
    } else if (activeTab === 'SHOPPING') {
      e = calculateShoppingEstimate(Number(clothingItems), Number(onlineOrders));
    }
    setCo2Estimate(Math.round(e * 100) / 100);
  }, [activeTab, transportType, carType, transportDistance, flightType, dietType, dietDays, energyKwh, energySource, clothingItems, onlineOrders]);

  useEffect(() => {
    const descMap = {
      TRANSPORT: transportType === 'car' ? `${transportDistance} km in ${carType} car` : `${transportDistance} km ${flightType}-haul flight`,
      FOOD: `${dietDays}d ${dietType} diet`,
      ENERGY: `${energyKwh} kWh ${energySource}`,
      SHOPPING: `${clothingItems} clothes, ${onlineOrders} orders`,
    };
    setDescription(descMap[activeTab]);
  }, [activeTab, transportType, carType, transportDistance, flightType, dietType, dietDays, energyKwh, energySource, clothingItems, onlineOrders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/api/activities', { category: activeTab, description, co2Kg: co2Estimate, date: new Date() });
      if (res.data.success) {
        setSavedCo2(co2Estimate);
        setTipMessage(res.data.data.microTip);
        setShowTipModal(true);
      }
    } catch (err) {
      console.error('Error logging activity:', err);
      setToast({ type: 'error', message: 'Failed to log activity' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-2xl mx-auto px-6 pt-8 pb-16 space-y-6">
        <motion.div custom={0} variants={stagger} initial="hidden" animate="visible" className="flex items-center space-x-3">
          <button onClick={() => navigate('/')} className="w-10 h-10 liquid-glass rounded-full flex items-center justify-center">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Log Activity</h1>
            <p className="text-sm font-body text-white/50">Track your carbon footprint</p>
          </div>
        </motion.div>

        <motion.div custom={1} variants={stagger} initial="hidden" animate="visible" className="liquid-glass rounded-2xl p-1.5 flex">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); }}
                className={`relative flex-1 flex flex-col items-center py-2.5 rounded-xl text-xs font-body transition-all ${
                  active ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 liquid-glass-strong rounded-xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex flex-col items-center">
                  <Icon className="h-5 w-5 mb-0.5" />
                  <span>{tab.label}</span>
                </span>
              </button>
            );
          })}
        </motion.div>

        <motion.div custom={2} variants={stagger} initial="hidden" animate="visible" className="liquid-glass-card rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'TRANSPORT' && (
              <div className="space-y-6">
                <div className="liquid-glass rounded-full p-1 flex">
                  {[{ id: 'car', label: 'Car' }, { id: 'flight', label: 'Flight' }, { id: 'bus', label: 'Bus' }, { id: 'train', label: 'Train' }].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTransportType(t.id)}
                      className={`flex-1 py-2 rounded-full text-xs font-body transition-all ${
                        transportType === t.id ? 'bg-white text-black font-medium' : 'text-white/60'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>

                {transportType === 'car' && (
                  <div className="flex gap-2">
                    {['petrol', 'diesel', 'electric'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCarType(f)}
                        className={`flex-1 py-2.5 rounded-full text-xs font-body transition-all ${
                          carType === f ? 'liquid-glass-strong text-white border border-green-400/30' : 'liquid-glass text-white/50 opacity-50'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}

                {transportType === 'flight' && (
                  <div className="flex gap-2">
                    {[{ id: 'short', label: 'Short Haul' }, { id: 'long', label: 'Long Haul' }].map((h) => (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => setFlightType(h.id)}
                        className={`flex-1 py-2.5 rounded-full text-xs font-body transition-all ${
                          flightType === h.id ? 'liquid-glass-strong text-white border border-green-400/30' : 'liquid-glass text-white/50 opacity-50'
                        }`}
                      >
                        {h.label}
                      </button>
                    ))}
                  </div>
                )}

                {transportType !== 'flight' && transportType !== 'car' ? null : (
                  <div className="flex items-center justify-center gap-4">
                    <button
                      type="button"
                      onClick={() => setTransportDistance(Math.max(1, Number(transportDistance) - 5))}
                      className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="text-center">
                      <input
                        type="number"
                        required
                        value={transportDistance}
                        onChange={(e) => setTransportDistance(e.target.value)}
                        min="1"
                        className="w-24 bg-transparent text-5xl font-display font-bold text-white text-center border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <p className="text-xs text-white/30 font-body">kilometers</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTransportDistance(Number(transportDistance) + 5)}
                      className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'FOOD' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'vegan', label: 'Vegan', sub: '2.5 kg/d' },
                    { id: 'vegetarian', label: 'Vegetarian', sub: '3.8 kg/d' },
                    { id: 'omnivore', label: 'Omnivore', sub: '5.5 kg/d' },
                    { id: 'heavy_meat', label: 'Heavy Meat', sub: '7.2 kg/d' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietType(d.id)}
                      className={`p-3.5 rounded-xl text-left transition-all ${
                        dietType === d.id ? 'liquid-glass-strong border border-green-400/30' : 'liquid-glass'
                      }`}
                    >
                      <span className="block text-sm font-body text-white">{d.label}</span>
                      <span className="block text-[10px] text-white/40 mt-0.5">{d.sub}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={() => setDietDays(Math.max(1, dietDays - 1))} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="text-center">
                    <input type="number" required value={dietDays} onChange={(e) => setDietDays(e.target.value)} min="1"
                      className="w-20 bg-transparent text-5xl font-display font-bold text-white text-center border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-white/30 font-body">days</p>
                  </div>
                  <button type="button" onClick={() => setDietDays(dietDays + 1)} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'ENERGY' && (
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4">
                  <button type="button" onClick={() => setEnergyKwh(Math.max(1, energyKwh - 1))} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="text-center">
                    <input type="number" required value={energyKwh} onChange={(e) => setEnergyKwh(e.target.value)} min="1"
                      className="w-24 bg-transparent text-5xl font-display font-bold text-white text-center border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <p className="text-xs text-white/30 font-body">kilowatt-hours</p>
                  </div>
                  <button type="button" onClick={() => setEnergyKwh(energyKwh + 1)} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex gap-2">
                  {[
                    { id: 'renewable', label: 'Solar/Wind' },
                    { id: 'mixed', label: 'Mixed' },
                    { id: 'fossil', label: 'Coal/Gas' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEnergySource(s.id)}
                      className={`flex-1 py-2.5 rounded-full text-xs font-body transition-all ${
                        energySource === s.id ? 'liquid-glass-strong border border-green-400/30' : 'liquid-glass text-white/50 opacity-50'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'SHOPPING' && (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-body text-white/40 mb-3 uppercase tracking-wider">Clothing Items</p>
                  <div className="flex items-center justify-center gap-4">
                    <button type="button" onClick={() => setClothingItems(Math.max(0, clothingItems - 1))} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-5xl font-display font-bold text-white w-16 text-center">{clothingItems}</span>
                    <button type="button" onClick={() => setClothingItems(clothingItems + 1)} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-body text-white/40 mb-3 uppercase tracking-wider">Online Orders</p>
                  <div className="flex items-center justify-center gap-4">
                    <button type="button" onClick={() => setOnlineOrders(Math.max(0, onlineOrders - 1))} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-5xl font-display font-bold text-white w-16 text-center">{onlineOrders}</span>
                    <button type="button" onClick={() => setOnlineOrders(onlineOrders + 1)} className="w-9 h-9 liquid-glass rounded-full flex items-center justify-center text-white/70">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add a note..."
                className="w-full px-4 py-3 liquid-glass-input text-sm font-body"
                style={{ border: '1px solid rgba(46,204,113,0.15)' }}
              />
            </div>

            <div className="liquid-glass-strong rounded-2xl p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-body text-white/50 uppercase tracking-wider">Estimated Impact</p>
              </div>
              <div className="text-right">
                <AnimatedCo2 value={co2Estimate} />
                <p className="text-xs font-body text-white/40 mt-1">
                  ≈ {Math.round(co2Estimate * 4.5)} km driven
                </p>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 liquid-glass-strong rounded-full text-lg font-body font-medium text-white flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving...</span>
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Log This Activity</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      {/* Tip Modal */}
      <AnimatePresence>
        {showTipModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="liquid-glass-card rounded-2xl p-8 max-w-md w-full relative space-y-6 text-center"
            >
              <button onClick={() => { setShowTipModal(false); navigate('/'); }} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex p-4 bg-green-950/30 text-[#2ECC71] rounded-2xl">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Activity Logged!</h3>
                <p className="text-xs font-body text-white/50 mt-2">+{savedCo2} kg CO₂ recorded</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl text-left space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4 w-4 text-[#2ECC71]" />
                  <span className="text-xs font-body text-[#2ECC71] uppercase tracking-wider">Gemini Micro-Tip</span>
                </div>
                <p className="text-sm font-body text-white/70 leading-relaxed italic">"{tipMessage}"</p>
              </div>
              <button
                onClick={() => { setShowTipModal(false); navigate('/'); }}
                className="w-full py-3 liquid-glass-strong rounded-full text-xs font-body text-white"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 100, opacity: 0 }}
            className={`fixed top-6 right-6 z-50 liquid-glass-strong rounded-full px-6 py-3 text-sm font-body flex items-center space-x-2 ${
              toast.type === 'error' ? 'border-l-4 border-red-400' : 'border-l-4 border-green-400'
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
