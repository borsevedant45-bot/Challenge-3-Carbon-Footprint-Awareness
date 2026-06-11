import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
  
  // Custom states for logging tip modal
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [savedCo2, setSavedCo2] = useState(0);

  // Form states
  // 1. Transport
  const [transportType, setTransportType] = useState('car'); // car | flight
  const [carType, setCarType] = useState('petrol');
  const [transportDistance, setTransportDistance] = useState(20);
  const [flightType, setFlightType] = useState('short'); // short | long
  
  // 2. Food
  const [dietType, setDietType] = useState('omnivore');
  const [dietDays, setDietDays] = useState(1);

  // 3. Energy
  const [energyKwh, setEnergyKwh] = useState(10);
  const [energySource, setEnergySource] = useState('fossil');

  // 4. Shopping
  const [clothingItems, setClothingItems] = useState(1);
  const [onlineOrders, setOnlineOrders] = useState(2);

  // Live preview score
  const [co2Estimate, setCo2Estimate] = useState(0);

  // Update co2 estimate preview in real-time
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
  }, [
    activeTab, 
    transportType, 
    carType, 
    transportDistance, 
    flightType, 
    dietType, 
    dietDays, 
    energyKwh, 
    energySource, 
    clothingItems, 
    onlineOrders
  ]);

  // Set default descriptions depending on categories selected
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
      const payload = {
        category: activeTab,
        description,
        co2Kg: co2Estimate,
        date: new Date()
      };

      const res = await axios.post('/api/activities', payload);
      if (res.data.success) {
        setSavedCo2(co2Estimate);
        setTipMessage(res.data.data.microTip);
        setShowTipModal(true); // Open AI Tip modal!
      }
    } catch (err) {
      console.error('Error logging activity:', err);
      alert('Failed to log activity. Please check input parameters.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'TRANSPORT', name: 'Transport', icon: Car, color: 'border-blue-500 text-blue-500' },
    { id: 'FOOD', name: 'Food / Diet', icon: Apple, color: 'border-green-500 text-green-500' },
    { id: 'ENERGY', name: 'Home Energy', icon: Zap, color: 'border-amber-500 text-accent' },
    { id: 'SHOPPING', name: 'Shopping', icon: ShoppingBag, color: 'border-purple-500 text-purple-500' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 relative">
      
      {/* Back Header */}
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-white dark:bg-nature-cardDark text-gray-500 dark:text-nature-darkText hover:shadow-nature transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-bold text-gray-400">Back to Dashboard</span>
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-nature-cardDark rounded-[32px] border border-gray-100 dark:border-nature-darkBg/20 shadow-nature overflow-hidden">
        
        {/* Title */}
        <div className="p-8 pb-4 border-b border-gray-100 dark:border-nature-darkBg/25">
          <h1 className="text-3xl font-display font-black text-gray-800 dark:text-nature-darkText">
            Log Carbon Activity
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
            Log activities to recalculate your carbon metrics in real time.
          </p>
        </div>

        {/* Tab List */}
        <div className="flex border-b border-gray-100 dark:border-nature-darkBg/25 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setDescription('');
                }}
                className={`flex-1 min-w-[120px] flex items-center justify-center space-x-2 py-4 border-b-2 font-bold text-sm transition-all focus:outline-none ${
                  active 
                    ? `${tab.color} bg-gray-50/50 dark:bg-nature-darkBg/30 font-black` 
                    : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-nature-darkText'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Dynamic input sections based on tab */}
          {activeTab === 'TRANSPORT' && (
            <div className="space-y-5">
              {/* Car or Flight selector */}
              <div className="flex space-x-3 bg-gray-50 dark:bg-nature-darkBg p-1.5 rounded-2xl">
                {['car', 'flight'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setTransportType(type)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                      transportType === type
                        ? 'bg-white dark:bg-nature-cardDark text-blue-500 shadow-sm font-black'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-nature-darkText'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {transportType === 'car' ? (
                <div className="space-y-4">
                  {/* Car fuel type */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider">
                      Fuel Type
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {['petrol', 'diesel', 'electric'].map((f) => (
                        <button
                          key={f}
                          type="button"
                          onClick={() => setCarType(f)}
                          className={`py-3 rounded-xl border text-xs font-bold capitalize transition-all ${
                            carType === f
                              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-400 text-blue-500'
                              : 'bg-white dark:bg-nature-darkBg border-gray-100 dark:border-nature-darkBg/50 text-gray-500 dark:text-nature-darkText/50 hover:bg-gray-50 dark:hover:bg-nature-darkBg'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Distance */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                      Distance (Kilometers)
                    </label>
                    <input
                      type="number"
                      required
                      value={transportDistance}
                      onChange={(e) => setTransportDistance(e.target.value)}
                      min="1"
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Flight haul */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider">
                      Flight Distance / Haul
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'short', name: 'Short Haul', desc: '<= 1500 km' },
                        { id: 'long', name: 'Long Haul', desc: '> 1500 km' }
                      ].map((h) => (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => setFlightType(h.id)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            flightType === h.id
                              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-400 text-blue-500'
                              : 'bg-white dark:bg-nature-darkBg border-gray-100 dark:border-nature-darkBg/50 text-gray-500 dark:text-nature-darkText/50 hover:bg-gray-50 dark:hover:bg-nature-darkBg'
                          }`}
                        >
                          <span className="block text-xs font-bold">{h.name}</span>
                          <span className="block text-[9px] font-semibold text-gray-400 dark:text-nature-darkText/30 mt-0.5">{h.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                      Flight Distance (Kilometers)
                    </label>
                    <input
                      type="number"
                      required
                      value={transportDistance}
                      onChange={(e) => setTransportDistance(e.target.value)}
                      min="1"
                      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-blue-400 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'FOOD' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider">
                  Diet Type Logged
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'vegan', name: 'Vegan', desc: 'Plant-based (2.5 kg/day)' },
                    { id: 'vegetarian', name: 'Vegetarian', desc: 'Dairy/egg (3.8 kg/day)' },
                    { id: 'omnivore', name: 'Omnivore', desc: 'Balanced (5.5 kg/day)' },
                    { id: 'heavy_meat', name: 'Heavy Meat', desc: 'Meat intensive (7.2 kg/day)' }
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDietType(d.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        dietType === d.id
                          ? 'bg-green-50 dark:bg-green-950/20 border-secondary text-secondary'
                          : 'bg-white dark:bg-nature-darkBg border-gray-100 dark:border-nature-darkBg/50 text-gray-500 dark:text-nature-darkText/50 hover:bg-gray-50 dark:hover:bg-nature-darkBg'
                      }`}
                    >
                      <span className="block text-xs font-bold capitalize">{d.name}</span>
                      <span className="block text-[9px] font-semibold text-gray-400 dark:text-nature-darkText/30 mt-0.5">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                  Log Duration (Days)
                </label>
                <input
                  type="number"
                  required
                  value={dietDays}
                  onChange={(e) => setDietDays(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-secondary transition-all"
                />
              </div>
            </div>
          )}

          {activeTab === 'ENERGY' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                  Electricity Consumption (kWh)
                </label>
                <input
                  type="number"
                  required
                  value={energyKwh}
                  onChange={(e) => setEnergyKwh(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-amber-400 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider">
                  Energy Grid / Source
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'renewable', title: 'Solar/Wind', desc: '0.23 kg/kWh' },
                    { id: 'mixed', title: 'Mixed Grid', desc: '0.525 kg/kWh' },
                    { id: 'fossil', title: 'Coal / Gas', desc: '0.82 kg/kWh' }
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setEnergySource(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        energySource === s.id
                          ? 'bg-amber-50 dark:bg-amber-950/20 border-accent text-accent'
                          : 'bg-white dark:bg-nature-darkBg border-gray-100 dark:border-nature-darkBg/50 text-gray-500 dark:text-nature-darkText/50 hover:bg-gray-50 dark:hover:bg-nature-darkBg'
                      }`}
                    >
                      <span className="block text-xs font-bold">{s.title}</span>
                      <span className="block text-[8px] font-semibold text-gray-400 dark:text-nature-darkText/30 mt-0.5">{s.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SHOPPING' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                  New Clothing Garments Purchased
                </label>
                <input
                  type="number"
                  required
                  value={clothingItems}
                  onChange={(e) => setClothingItems(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-purple-400 transition-all"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  🌳 Clothes average 10 kg CO₂ per item production impact.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                  Online Delivery Orders Logged
                </label>
                <input
                  type="number"
                  required
                  value={onlineOrders}
                  onChange={(e) => setOnlineOrders(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-purple-400 transition-all"
                />
                <span className="text-[10px] text-gray-400 mt-1 block">
                  📦 Deliveries average 3 kg CO₂ shipping and packaging impact.
                </span>
              </div>
            </div>
          )}

          {/* Description override */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
              Log Details / Description
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weekly highway commute to workplace"
              className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-secondary transition-all"
            />
          </div>

          {/* Live Estimate box */}
          <div className="p-5 bg-gradient-to-r from-secondary/5 to-primary/5 dark:from-nature-darkBg/40 dark:to-nature-darkBg/40 border border-secondary/15 dark:border-nature-darkBg/60 rounded-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-secondary/15 text-secondary rounded-lg">
                <Info className="h-4.5 w-4.5" />
              </div>
              <span className="text-xs font-extrabold text-gray-600 dark:text-nature-darkText/80">
                Calculated Estimate Impact
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-display font-black text-secondary">
                {co2Estimate}
              </span>
              <span className="text-xs font-bold text-gray-400 ml-1">kg CO₂</span>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-secondary text-white font-extrabold rounded-2xl shadow-lg shadow-secondary/15 hover:bg-secondary/95 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-2 text-sm uppercase tracking-wider"
          >
            <Save className="h-4 w-4" />
            <span>{loading ? 'Saving log...' : 'Save Activity Log'}</span>
          </button>

        </form>
      </div>

      {/* Custom Gemini AI Coach Micro-tip Modal */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-nature-cardDark p-8 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/30 shadow-2xl max-w-md w-full relative space-y-6 text-center animate-scaleIn">
            
            <button
              onClick={() => {
                setShowTipModal(false);
                navigate('/');
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-nature-darkBg rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="inline-flex p-4 bg-green-50 dark:bg-green-950/20 text-secondary rounded-3xl animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-display font-black text-gray-800 dark:text-nature-darkText">
                Activity Logged!
              </h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Added +{savedCo2} kg CO₂ to monthly total
              </p>
            </div>

            {/* AI Tip Coach Card */}
            <div className="p-5 bg-gradient-to-tr from-primary/10 to-secondary/10 dark:from-nature-darkBg/60 dark:to-nature-darkBg/60 border border-primary/20 dark:border-nature-darkBg/50 rounded-2xl text-left space-y-2">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="h-4.5 w-4.5 text-secondary animate-pulse" />
                <span className="text-xs font-black text-primary dark:text-secondary uppercase tracking-widest">
                  Gemini Micro-Tip
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-nature-darkText/80 leading-relaxed italic">
                "{tipMessage}"
              </p>
            </div>

            <button
              onClick={() => {
                setShowTipModal(false);
                navigate('/');
              }}
              className="w-full py-3 bg-secondary text-white font-extrabold rounded-2xl shadow-md text-xs uppercase tracking-widest hover:bg-secondary/90 transition-all"
            >
              Return to Dashboard
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
