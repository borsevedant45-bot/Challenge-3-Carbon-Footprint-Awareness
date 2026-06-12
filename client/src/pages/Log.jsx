import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Car,
  Apple,
  Zap,
  ShoppingBag,
  Sparkles,
  ArrowLeft,
  Save,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';
import {
  calculateTransportEstimate,
  calculateFlightEstimate,
  calculateEnergyEstimate,
  calculateShoppingEstimate
} from '../utils/co2Calculator';

export default function Log() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('TRANSPORT');
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [savedCo2, setSavedCo2] = useState(0);

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
    let estimate = 0;
    if (activeTab === 'TRANSPORT') {
      if (transportType === 'car') {
        estimate = calculateTransportEstimate(carType, Number(transportDistance));
      } else {
        estimate = calculateFlightEstimate(flightType, Number(transportDistance));
      }
    } else if (activeTab === 'FOOD') {
      const dietFactors = { vegan: 2.5, vegetarian: 3.8, omnivore: 5.5, heavy_meat: 7.2 };
      estimate = (dietFactors[dietType] || 5.5) * Number(dietDays);
    } else if (activeTab === 'ENERGY') {
      estimate = calculateEnergyEstimate(Number(energyKwh), energySource);
    } else if (activeTab === 'SHOPPING') {
      estimate = calculateShoppingEstimate(Number(clothingItems), Number(onlineOrders));
    }
    setCo2Estimate(Math.round(estimate * 100) / 100);
  }, [activeTab, transportType, carType, transportDistance, flightType, dietType, dietDays, energyKwh, energySource, clothingItems, onlineOrders]);

  useEffect(() => {
    if (activeTab === 'TRANSPORT') {
      setDescription(transportType === 'car'
        ? `${transportDistance} km commute in ${carType} car`
        : `${transportDistance} km ${flightType}-haul flight`
      );
    } else if (activeTab === 'FOOD') {
      setDescription(`${dietDays} day(s) eating a ${dietType} diet`);
    } else if (activeTab === 'ENERGY') {
      setDescription(`Used ${energyKwh} kWh from ${energySource} grid`);
    } else if (activeTab === 'SHOPPING') {
      setDescription(`Bought ${clothingItems} clothing items, ${onlineOrders} online order(s)`);
    }
  }, [activeTab, transportType, carType, transportDistance, flightType, dietType, dietDays, energyKwh, energySource, clothingItems, onlineOrders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { category: activeTab, description, co2Kg: co2Estimate, date: new Date() };
      const res = await api.post('/api/activities', payload);
      if (res.data.success) {
        setSavedCo2(co2Estimate);
        setTipMessage(res.data.data.microTip);
        setShowTipModal(true);
      }
    } catch (err) {
      console.error('Error logging activity:', err);
      alert('Failed to log activity. Please check input parameters.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'TRANSPORT', name: 'Transport', icon: Car, color: '#3B82F6' },
    { id: 'FOOD', name: 'Food / Diet', icon: Apple, color: '#2ECC71' },
    { id: 'ENERGY', name: 'Home Energy', icon: Zap, color: '#F0A500' },
    { id: 'SHOPPING', name: 'Shopping', icon: ShoppingBag, color: '#8B5CF6' },
  ];

  const btnClass = (isActive) =>
    `py-3 rounded-xl border text-xs font-bold capitalize transition-all ${
      isActive
        ? 'bg-white/10 border-white/20 text-white'
        : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
    }`;

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="flex items-center space-x-2">
          <button onClick={() => navigate('/')} className="p-2 rounded-xl liquid-glass-card">
            <ArrowLeft className="h-5 w-5 text-white/70" />
          </button>
          <span className="text-sm font-bold text-white/40">Back to Dashboard</span>
        </div>

        <div className="liquid-glass-card rounded-2xl overflow-hidden">
          <div className="p-8 pb-4 border-b border-white/10">
            <h1 className="text-3xl font-display font-bold text-white">Log Carbon Activity</h1>
            <p className="text-sm text-white/40 font-body mt-1">Log activities to recalculate your carbon metrics in real time.</p>
          </div>

          <div className="flex border-b border-white/10 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { setActiveTab(tab.id); setDescription(''); }}
                  className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-4 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                    active
                      ? 'border-[#2ECC71] text-[#2ECC71] bg-white/5'
                      : 'border-transparent text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {activeTab === 'TRANSPORT' && (
              <div className="space-y-5">
                <div className="flex space-x-3 bg-white/5 p-1.5 rounded-xl">
                  {['car', 'flight'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setTransportType(type)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        transportType === type
                          ? 'bg-white/10 text-white shadow-sm font-bold'
                          : 'text-white/40 hover:text-white/70'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {transportType === 'car' ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Fuel Type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['petrol', 'diesel', 'electric'].map((f) => (
                          <button key={f} type="button" onClick={() => setCarType(f)}
                            className={`${btnClass(carType === f)}`}>{f}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Distance (Kilometers)</label>
                      <input type="number" required value={transportDistance} onChange={(e) => setTransportDistance(e.target.value)} min="1" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Flight Distance / Haul</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: 'short', name: 'Short Haul', desc: '<= 1500 km' },
                          { id: 'long', name: 'Long Haul', desc: '> 1500 km' }
                        ].map((h) => (
                          <button key={h.id} type="button" onClick={() => setFlightType(h.id)}
                            className={`p-3 rounded-xl border text-left transition-all ${
                              flightType === h.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                            }`}>
                            <span className="block text-xs font-bold">{h.name}</span>
                            <span className="block text-[9px] font-medium text-white/30 mt-0.5">{h.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Flight Distance (Kilometers)</label>
                      <input type="number" required value={transportDistance} onChange={(e) => setTransportDistance(e.target.value)} min="1" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'FOOD' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Diet Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'vegan', name: 'Vegan', desc: '2.5 kg/day' },
                      { id: 'vegetarian', name: 'Vegetarian', desc: '3.8 kg/day' },
                      { id: 'omnivore', name: 'Omnivore', desc: '5.5 kg/day' },
                      { id: 'heavy_meat', name: 'Heavy Meat', desc: '7.2 kg/day' }
                    ].map((d) => (
                      <button key={d.id} type="button" onClick={() => setDietType(d.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          dietType === d.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                        }`}>
                        <span className="block text-xs font-bold capitalize">{d.name}</span>
                        <span className="block text-[9px] font-medium text-white/30 mt-0.5">{d.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Log Duration (Days)</label>
                  <input type="number" required value={dietDays} onChange={(e) => setDietDays(e.target.value)} min="1" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                </div>
              </div>
            )}

            {activeTab === 'ENERGY' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Electricity Consumption (kWh)</label>
                  <input type="number" required value={energyKwh} onChange={(e) => setEnergyKwh(e.target.value)} min="1" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Energy Source</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'renewable', title: 'Solar/Wind', desc: '0.23 kg/kWh' },
                      { id: 'mixed', title: 'Mixed Grid', desc: '0.525 kg/kWh' },
                      { id: 'fossil', title: 'Coal / Gas', desc: '0.82 kg/kWh' }
                    ].map((s) => (
                      <button key={s.id} type="button" onClick={() => setEnergySource(s.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          energySource === s.id ? 'bg-white/10 border-white/20 text-white' : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                        }`}>
                        <span className="block text-xs font-bold">{s.title}</span>
                        <span className="block text-[8px] font-medium text-white/30 mt-0.5">{s.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SHOPPING' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">New Clothing Garments Purchased</label>
                  <input type="number" required value={clothingItems} onChange={(e) => setClothingItems(e.target.value)} min="0" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                  <span className="text-[10px] text-white/40 mt-1 block">Clothes average 10 kg CO₂ per item production impact.</span>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Online Delivery Orders Logged</label>
                  <input type="number" required value={onlineOrders} onChange={(e) => setOnlineOrders(e.target.value)} min="0" className="w-full px-4 py-3 liquid-glass-input text-sm" />
                  <span className="text-[10px] text-white/40 mt-1 block">Deliveries average 3 kg CO₂ shipping and packaging impact.</span>
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Log Details / Description</label>
              <input
                type="text" required value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Weekly highway commute to workplace"
                className="w-full px-4 py-3.5 liquid-glass-input text-sm"
              />
            </div>

            <div className="p-5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-[#2ECC71]/15 text-[#2ECC71] rounded-lg">
                  <Info className="h-4.5 w-4.5" />
                </div>
                <span className="text-xs font-bold text-white/70">Calculated Estimate Impact</span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-display font-bold text-[#2ECC71]">{co2Estimate}</span>
                <span className="text-xs font-bold text-white/40 ml-1">kg CO₂</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center justify-center space-x-2 uppercase tracking-wider disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{loading ? 'Saving log...' : 'Save Activity Log'}</span>
            </button>
          </form>
        </div>

        {showTipModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="liquid-glass-card rounded-2xl p-8 max-w-md w-full relative space-y-6 text-center">
              <button onClick={() => { setShowTipModal(false); navigate('/'); }} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex p-4 bg-green-950/30 text-[#2ECC71] rounded-2xl">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-2xl font-display font-bold text-white">Activity Logged!</h3>
                <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Added +{savedCo2} kg CO₂ to monthly total</p>
              </div>
              <div className="p-5 bg-white/5 border border-white/10 rounded-xl text-left space-y-2">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-4.5 w-4.5 text-[#2ECC71]" />
                  <span className="text-xs font-bold text-[#2ECC71] uppercase tracking-widest">Gemini Micro-Tip</span>
                </div>
                <p className="text-sm font-medium text-white/70 leading-relaxed italic">"{tipMessage}"</p>
              </div>
              <button
                onClick={() => { setShowTipModal(false); navigate('/'); }}
                className="w-full py-3 liquid-glass-strong rounded-full text-xs font-bold text-white uppercase tracking-widest"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
