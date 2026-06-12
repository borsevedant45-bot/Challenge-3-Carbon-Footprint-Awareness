import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import TiltCard from '../components/TiltCard';
import {
  Sparkles,
  Leaf,
  DollarSign,
  Globe,
  Heart,
  CheckCircle2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Offset() {
  const navigate = useNavigate();
  const [offsets, setOffsets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pledgeLoading, setPledgeLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tons, setTons] = useState(1);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchOffsets = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/offsets');
        if (res.data.success) setOffsets(res.data.data);
      } catch (error) {
        console.error('Error fetching offsets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffsets();
  }, []);

  const openPledge = (project) => {
    setSelectedProject(project);
    setTons(1);
    setShowPledgeModal(true);
  };

  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;
    setPledgeLoading(true);
    try {
      const res = await api.post('/api/offsets/pledge', {
        offsetId: selectedProject.id,
        tons: parseFloat(tons)
      });
      if (res.data.success) {
        setShowPledgeModal(false);
        setSuccessMessage(res.data.message);
        setShowSuccessModal(true);
      }
    } catch (err) {
      console.error('Pledging error:', err);
      alert('Error recording your offset pledge. Please try again.');
    } finally {
      setPledgeLoading(false);
    }
  };

  const getTreeEquivalent = (t) => Math.round(t * 45);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050D07]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2ECC71]" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest animate-pulse">Loading offset marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">Offset Marketplace</h1>
          <p className="text-sm text-white/40 font-body mt-1">Support verified global carbon reduction projects to neutralize your carbon impact.</p>
        </div>

        <div className="liquid-glass-card rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-display font-bold text-white flex items-center justify-center md:justify-start space-x-1.5">
              <Leaf className="h-5 w-5 text-[#2ECC71]" />
              <span>Impact Tree Calculator</span>
            </h3>
            <p className="text-sm text-white/60 font-body leading-relaxed max-w-xl">
              Offsetting <span className="font-bold text-[#2ECC71]">1 Ton of CO₂</span> is equivalent to planting roughly <span className="font-bold text-[#F0A500]">45 mature trees</span> growing and absorbing carbon for a full year.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm px-6 py-4.5 rounded-2xl border border-white/10 text-center shrink-0">
            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest block mb-1">Planting Equivalency</span>
            <div className="flex items-baseline justify-center space-x-1">
              <span className="text-2xl font-display font-bold text-[#2ECC71]">45</span>
              <span className="text-xs font-bold text-white/60">trees / ton</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offsets.map((project) => (
            <TiltCard key={project.id}>
              <div className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col justify-between">
                <div className="h-44 relative bg-forest-900 overflow-hidden">
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-[10px] font-bold tracking-wider text-white uppercase rounded-full flex items-center space-x-1">
                    <Globe className="h-3 w-3" />
                    <span>{project.country}</span>
                  </div>
                  {project.verified && (
                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-[#2ECC71] text-white text-[9px] font-bold uppercase tracking-wider rounded-full">
                      Verified Gold
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">{project.name}</h3>
                    <p className="text-xs text-white/60 font-body leading-relaxed">{project.description}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div>
                      <span className="text-[10px] font-bold text-white/30 uppercase block">PRICE / TON</span>
                      <span className="text-base font-display font-bold text-white">${project.pricePerTon.toFixed(2)}</span>
                    </div>
                    <button
                      onClick={() => openPledge(project)}
                      className="px-5 py-2.5 liquid-glass-strong rounded-full text-xs font-bold uppercase tracking-wider text-white transition-all"
                    >
                      Pledge Offset
                    </button>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>

      {showPledgeModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="liquid-glass-card rounded-2xl p-8 max-w-md w-full relative space-y-6">
            <button onClick={() => setShowPledgeModal(false)} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white">
              <X className="h-5 w-5" />
            </button>
            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-bold text-white">Pledge Offset Carbon</h3>
              <p className="text-xs font-medium text-white/50">Project: {selectedProject.name}</p>
            </div>
            <form onSubmit={handlePledgeSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/40 uppercase tracking-wider block">Amount to offset (Metric Tons)</label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0.1"
                  value={tons}
                  onChange={(e) => setTons(e.target.value)}
                  className="w-full px-4 py-3 liquid-glass-input text-sm"
                />
              </div>
              <div className="p-4 bg-white/5 rounded-xl space-y-2 border border-white/10 text-xs font-medium text-white/70">
                <div className="flex justify-between">
                  <span>Carbon Offset equivalent:</span>
                  <span className="font-bold text-[#2ECC71]">{tons * 1000} kg CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span>Tree absorption equivalent:</span>
                  <span className="font-bold text-[#F0A500]">{getTreeEquivalent(tons)} trees / year</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-2 font-bold text-white">
                  <span>Simulated funding:</span>
                  <span>${(tons * selectedProject.pricePerTon).toFixed(2)}</span>
                </div>
              </div>
              <p className="text-[10px] text-white/40">MVP Feature: No actual payment details are required.</p>
              <button
                type="submit"
                disabled={pledgeLoading}
                className="w-full py-4 liquid-glass-strong rounded-full text-sm font-bold text-white flex items-center justify-center space-x-1.5 uppercase tracking-widest disabled:opacity-50"
              >
                <Heart className="h-4.5 w-4.5" />
                <span>{pledgeLoading ? 'Submitting...' : 'Confirm Pledge'}</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="liquid-glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6 relative">
            <button
              onClick={() => { setShowSuccessModal(false); navigate('/'); }}
              className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="inline-flex p-4 bg-green-950/30 text-[#2ECC71] rounded-2xl">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-display font-bold text-white">Offset Recorded!</h3>
              <p className="text-xs text-white/50 font-body leading-relaxed">{successMessage}</p>
            </div>
            <div className="p-4 bg-[#2ECC71]/5 rounded-xl text-xs font-medium text-[#2ECC71] leading-relaxed border border-[#2ECC71]/10">
              Thank you! This offset deduction has been loaded to your activities timeline.
            </div>
            <button
              onClick={() => { setShowSuccessModal(false); navigate('/'); }}
              className="w-full py-3 liquid-glass-strong rounded-full text-xs font-bold text-white uppercase tracking-widest"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
