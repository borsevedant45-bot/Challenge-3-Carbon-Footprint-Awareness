import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';
import TiltCard from '../components/TiltCard';
import {
  Heart,
  CheckCircle2,
  X,
  Globe,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const gradientMap = {
  solar: 'linear-gradient(135deg, rgba(240,165,0,0.2), rgba(245,158,11,0.1))',
  rainforest: 'linear-gradient(135deg, rgba(46,204,113,0.2), rgba(5,150,105,0.1))',
  cookstoves: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(190,24,93,0.1))',
  wind: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(29,78,216,0.1))',
  mangrove: 'linear-gradient(135deg, rgba(6,182,212,0.2), rgba(2,132,199,0.1))',
};

const emojiMap = {
  solar: '☀️',
  rainforest: '🌿',
  cookstoves: '🔥',
  wind: '💨',
  mangrove: '🌊',
};

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

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
  const [pledgedIds, setPledgedIds] = useState(new Set());

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
        tons: parseFloat(tons),
      });
      if (res.data.success) {
        setShowPledgeModal(false);
        setSuccessMessage(res.data.message);
        setPledgedIds((prev) => new Set(prev).add(selectedProject.id));
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

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-6">
        <motion.div
          custom={0}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="liquid-glass-strong rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <span className="text-6xl">🌍</span>
            <h1 className="text-3xl font-display font-bold text-white mt-2">Offset Your Carbon Footprint</h1>
            <p className="text-sm font-body text-white/60 mt-2 max-w-xl">
              Every tonne you offset funds verified projects protecting ecosystems worldwide.
            </p>
          </div>
          <div className="liquid-glass rounded-2xl p-5 shrink-0 w-full md:w-auto">
            <p className="text-xs font-body text-white/50 mb-3">1 tonne CO₂ offset =</p>
            <div className="space-y-2">
              <p className="text-sm font-body text-white/70">🌳 40 trees planted for a year</p>
              <p className="text-sm font-body text-white/70">☀️ 500 kWh clean energy generated</p>
              <p className="text-sm font-body text-white/70">🌊 200m² ocean habitat protected</p>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="liquid-glass rounded-2xl h-72 animate-pulse" />
            ))}
          </div>
        ) : (
          <motion.div
            custom={1}
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {offsets.map((project, i) => {
              const type = project.type || 'rainforest';
              const isPledged = pledgedIds.has(project.id);
              return (
                <motion.div key={project.id} custom={2 + i} variants={stagger} initial="hidden" animate="visible">
                  <TiltCard>
                    <div className="liquid-glass-card rounded-2xl overflow-hidden flex flex-col">
                      <div
                        className="h-40 flex items-center justify-center"
                        style={{ background: gradientMap[type] || gradientMap.rainforest }}
                      >
                        <span className="text-6xl">{emojiMap[type] || '🌿'}</span>
                      </div>
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-white/60 inline-block mb-3">
                            <Globe className="h-3 w-3 inline mr-1" />
                            {project.country}
                          </span>
                          <h3 className="text-xl font-display font-bold text-white">{project.name}</h3>
                          <p className="text-sm font-body text-white/60 mt-2 leading-relaxed">{project.description}</p>
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
                          <div>
                            <span className="text-2xl font-display font-bold text-white">${project.pricePerTon.toFixed(2)}</span>
                            <span className="text-sm font-body text-white/40 ml-1">/ton</span>
                          </div>
                          {project.verified && (
                            <span className="liquid-glass rounded-full px-3 py-1 text-xs font-body text-green-400">✓ Verified</span>
                          )}
                        </div>
                        {isPledged ? (
                          <div className="w-full py-3 mt-4 rounded-full text-sm font-body text-center bg-[#2ECC71] text-forest-950 font-medium">
                            ✓ Pledged
                          </div>
                        ) : (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => openPledge(project)}
                            className="w-full py-3 mt-4 liquid-glass-strong rounded-full text-sm font-body text-white transition-all"
                          >
                            Pledge Support
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      {/* Pledge Modal */}
      <AnimatePresence>
        {showPledgeModal && selectedProject && (
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
              className="liquid-glass-card rounded-2xl p-8 max-w-md w-full relative space-y-6"
            >
              <button onClick={() => setShowPledgeModal(false)} className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white">
                <X className="h-5 w-5" />
              </button>
              <div>
                <h3 className="text-xl font-display font-bold text-white">Pledge Offset Carbon</h3>
                <p className="text-xs font-body text-white/50 mt-1">Project: {selectedProject.name}</p>
              </div>
              <form onSubmit={handlePledgeSubmit} className="space-y-5">
                <div>
                  <label className="text-xs font-body text-white/40 uppercase tracking-wider block mb-2">
                    Amount to offset (Metric Tons)
                  </label>
                  <input
                    type="number"
                    required
                    step="0.1"
                    min="0.1"
                    value={tons}
                    onChange={(e) => setTons(e.target.value)}
                    className="w-full px-4 py-3 liquid-glass-input text-sm font-body"
                  />
                </div>
                <div className="p-4 bg-white/5 rounded-xl space-y-2 border border-white/10 text-xs font-body text-white/70">
                  <div className="flex justify-between">
                    <span>Carbon Offset equivalent:</span>
                    <span className="font-display font-bold text-green-400">{tons * 1000} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tree absorption equivalent:</span>
                    <span className="font-display font-bold text-amber-400">{getTreeEquivalent(tons)} trees / year</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2 font-display font-bold text-white">
                    <span>Simulated funding:</span>
                    <span>${(tons * selectedProject.pricePerTon).toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-[10px] text-white/40 font-body">MVP Feature: No actual payment details are required.</p>
                <button
                  type="submit"
                  disabled={pledgeLoading}
                  className="w-full py-4 liquid-glass-strong rounded-full text-sm font-body text-white flex items-center justify-center space-x-1.5 disabled:opacity-50"
                >
                  <Heart className="h-4 w-4" />
                  <span>{pledgeLoading ? 'Submitting...' : 'Confirm Pledge'}</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
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
              className="liquid-glass-card rounded-2xl p-8 max-w-md w-full text-center space-y-6 relative"
            >
              <button
                onClick={() => { setShowSuccessModal(false); }}
                className="absolute top-4 right-4 p-1.5 text-white/40 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="inline-flex p-4 bg-green-950/30 text-[#2ECC71] rounded-2xl">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div>
                <h3 className="text-2xl font-display font-bold text-white">Offset Recorded!</h3>
                <p className="text-xs font-body text-white/50 mt-2 leading-relaxed">{successMessage}</p>
              </div>
              <div className="p-4 bg-green-950/20 rounded-xl text-xs font-body text-green-400 leading-relaxed border border-green-900/30">
                Thank you! This offset deduction has been loaded to your activities timeline.
              </div>
              <button
                onClick={() => { setShowSuccessModal(false); navigate('/'); }}
                className="w-full py-3 liquid-glass-strong rounded-full text-sm font-body text-white"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
