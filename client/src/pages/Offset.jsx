import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TiltCard from '../components/TiltCard';
import { 
  Sparkles, 
  Leaf, 
  HelpCircle, 
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

  // States for Pledge Modal
  const [selectedProject, setSelectedProject] = useState(null);
  const [tons, setTons] = useState(1);
  const [showPledgeModal, setShowPledgeModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch offsets marketplace items
  useEffect(() => {
    const fetchOffsets = async () => {
      try {
        setLoading(true);
        const res = await axios.get('/api/offsets');
        if (res.data.success) {
          setOffsets(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching offsets:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOffsets();
  }, []);

  // Handler: Open Pledge Form
  const openPledge = (project) => {
    setSelectedProject(project);
    setTons(1);
    setShowPledgeModal(true);
  };

  // Handler: Submit Pledge
  const handlePledgeSubmit = async (e) => {
    e.preventDefault();
    if (!selectedProject) return;

    setPledgeLoading(true);
    try {
      const res = await axios.post('/api/offsets/pledge', {
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

  // Visual helper: 1 ton of offset is roughly equivalent to planting 45 trees
  const getTreeEquivalent = (t) => {
    return Math.round(t * 45);
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
            Loading offset marketplace...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-800 dark:text-nature-darkText">
          Offset Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
          Support verified global carbon reduction projects to neutralize your carbon impact.
        </p>
      </div>

      {/* Impact Tree Calculator banner */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-secondary/15 to-primary/10 dark:from-nature-cardDark dark:to-nature-cardDark border border-secondary/25 dark:border-nature-darkBg/30 rounded-[32px] shadow-nature flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-lg sm:text-xl font-display font-black text-primary dark:text-secondary flex items-center justify-center md:justify-start space-x-1.5">
            <Leaf className="h-5 w-5 text-secondary sway-leaf" />
            <span>Impact Tree Calculator</span>
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-nature-darkText/80 leading-relaxed max-w-xl">
            Did you know? Offsetting <span className="font-extrabold text-secondary">1 Ton of CO₂</span> is equivalent to planting roughly <span className="font-extrabold text-accent">45 mature trees</span> growing and absorbing carbon for a full year.
          </p>
        </div>

        {/* Mini interactive widget inside banner */}
        <div className="bg-white/80 dark:bg-nature-darkBg/50 backdrop-blur-sm px-6 py-4.5 rounded-2xl border border-white dark:border-nature-darkBg/30 text-center shadow-sm shrink-0">
          <span className="text-[10px] font-black text-gray-400 dark:text-nature-darkText/40 uppercase tracking-widest block mb-1">
            Planting Equivalency
          </span>
          <div className="flex items-baseline justify-center space-x-1">
            <span className="text-2xl font-display font-black text-secondary">45</span>
            <span className="text-xs font-bold text-gray-500 dark:text-nature-darkText/60">trees / ton</span>
          </div>
        </div>
      </div>

      {/* Grid of Offset Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offsets.map((project) => (
          <TiltCard key={project.id}>
          <div 
            className="bg-white dark:bg-nature-cardDark rounded-3xl border border-gray-100 dark:border-nature-darkBg/20 shadow-nature overflow-hidden flex flex-col justify-between hover:shadow-natureHover hover:-translate-y-1 transition-all duration-300"
          >
            {/* Image */}
            <div className="h-44 relative bg-gray-100 overflow-hidden">
              <img 
                src={project.imageUrl} 
                alt={project.name}
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              
              {/* Country tag */}
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm text-[10px] font-black tracking-wider text-white uppercase rounded-full flex items-center space-x-1">
                <Globe className="h-3 w-3" />
                <span>{project.country}</span>
              </div>

              {project.verified && (
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-secondary text-white text-[9px] font-black uppercase tracking-wider rounded-full shadow-sm">
                  Verified Gold
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-extrabold text-gray-800 dark:text-nature-darkText">
                  {project.name}
                </h3>
                <p className="text-xs text-gray-500 dark:text-nature-darkText/60 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-gray-50 dark:border-nature-darkBg/30">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-nature-darkText/30 uppercase block">
                    PRICE PER TON
                  </span>
                  <span className="text-base font-display font-black text-gray-800 dark:text-nature-darkText">
                    ${project.pricePerTon.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => openPledge(project)}
                  className="px-5 py-2.5 bg-primary dark:bg-secondary hover:bg-primary-dark dark:hover:bg-secondary/95 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md shadow-primary/10"
                >
                  Pledge Offset
                </button>
              </div>
            </div>
          </div>
          </TiltCard>
        ))}
      </div>

      {/* Pledge Input Form Modal */}
      {showPledgeModal && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-nature-cardDark p-8 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/30 shadow-2xl max-w-md w-full relative space-y-6 animate-scaleIn">
            
            <button
              onClick={() => setShowPledgeModal(false)}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-nature-darkBg rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1.5">
              <h3 className="text-xl font-display font-black text-gray-800 dark:text-nature-darkText">
                Pledge Offset Carbon
              </h3>
              <p className="text-xs font-semibold text-gray-400 dark:text-nature-darkText/40">
                Project: {selectedProject.name}
              </p>
            </div>

            <form onSubmit={handlePledgeSubmit} className="space-y-5">
              
              {/* Ton input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 dark:text-nature-darkText/40 uppercase tracking-wider block">
                  Amount to offset (Metric Tons)
                </label>
                <input
                  type="number"
                  required
                  step="0.1"
                  min="0.1"
                  value={tons}
                  onChange={(e) => setTons(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-nature-darkBg border border-gray-100 dark:border-nature-darkBg/50 text-gray-800 dark:text-nature-darkText text-sm focus:outline-none focus:border-secondary transition-all"
                />
              </div>

              {/* Summary stats */}
              <div className="p-4 bg-gray-50 dark:bg-nature-darkBg rounded-2xl space-y-2 border border-gray-100 dark:border-nature-darkBg/40 text-xs font-semibold text-gray-600 dark:text-nature-darkText/80">
                <div className="flex justify-between">
                  <span>Carbon Offset equivalent:</span>
                  <span className="font-extrabold text-secondary">{tons * 1000} kg CO₂</span>
                </div>
                <div className="flex justify-between">
                  <span>Tree absorption equivalent:</span>
                  <span className="font-extrabold text-accent">{getTreeEquivalent(tons)} trees / year</span>
                </div>
                <div className="flex justify-between border-t border-gray-100 dark:border-nature-darkBg/40 pt-2 font-extrabold text-gray-800 dark:text-nature-darkText">
                  <span>Simulated funding:</span>
                  <span>${(tons * selectedProject.pricePerTon).toFixed(2)}</span>
                </div>
              </div>

              <div className="text-[10px] text-gray-400 leading-normal">
                💡 <span className="font-bold">MVP Feature</span>: No actual payment details are required. Pledges are recorded as negative carbon activity in your dashboard log.
              </div>

              <button
                type="submit"
                disabled={pledgeLoading}
                className="w-full py-4 bg-secondary text-white font-extrabold rounded-2xl shadow-lg shadow-secondary/15 hover:bg-secondary/95 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center space-x-1.5 text-xs uppercase tracking-widest disabled:opacity-50"
              >
                <Heart className="h-4.5 w-4.5 animate-pulse" />
                <span>{pledgeLoading ? 'Submitting Pledge...' : 'Confirm Pledge'}</span>
              </button>

            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-nature-cardDark p-8 rounded-[32px] border border-gray-100 dark:border-nature-darkBg/30 shadow-2xl max-w-md w-full text-center space-y-6 relative animate-scaleIn">
            
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/');
              }}
              className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-nature-darkBg rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="inline-flex p-4 bg-green-50 dark:bg-green-950/20 text-secondary rounded-[24px] mb-2 animate-bounce">
              <CheckCircle2 className="h-12 w-12" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-2xl font-display font-black text-gray-800 dark:text-nature-darkText">
                Offset Recorded!
              </h3>
              <p className="text-xs text-gray-400 dark:text-nature-darkText/50 leading-relaxed">
                {successMessage}
              </p>
            </div>

            <div className="p-4 bg-secondary/5 rounded-2xl text-xs font-semibold text-secondary leading-relaxed border border-secondary/10">
              🌳 Thank you! This offset deduction has been loaded to your activities timeline, decreasing your overall monthly footprint!
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
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
