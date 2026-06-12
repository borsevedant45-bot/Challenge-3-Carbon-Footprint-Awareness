import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChallengeCard from '../components/ChallengeCard';
import TiltCard from '../components/TiltCard';
import { Trophy, Award, Zap } from 'lucide-react';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchChallengesData = async () => {
    try {
      setLoading(true);
      const allRes = await api.get('/api/challenges');
      const activeRes = await api.get('/api/challenges/active');
      if (allRes.data.success) setChallenges(allRes.data.data);
      if (activeRes.data.success) setUserChallenges(activeRes.data.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengesData();
  }, []);

  const handleJoin = async (challengeId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/challenges/join', { challengeId });
      if (res.data.success) await fetchChallengesData();
    } catch (err) {
      console.error('Error joining challenge:', err);
      alert(err.response?.data?.message || 'Error joining challenge');
    } finally {
      setActionLoading(false);
    }
  };

  const handleComplete = async (userChallengeId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/challenges/complete', { userChallengeId });
      if (res.data.success) await fetchChallengesData();
    } catch (err) {
      console.error('Error completing challenge:', err);
      alert(err.response?.data?.message || 'Error completing challenge');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#050D07]">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#2ECC71]" />
          <p className="text-xs font-semibold text-white/40 uppercase tracking-widest animate-pulse">Loading challenges board...</p>
        </div>
      </div>
    );
  }

  const ucMap = {};
  userChallenges.forEach(uc => { ucMap[uc.challengeId] = uc; });

  const activeCount = userChallenges.filter(uc => uc.status === 'ACTIVE').length;
  const completedCount = userChallenges.filter(uc => uc.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#050D07]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">Gamified Challenges</h1>
            <p className="text-sm text-white/40 font-body mt-1">Complete green challenges to earn verified sustainable badges and reduce carbon output.</p>
          </div>
          <div className="flex items-center space-x-3.5">
            <div className="flex items-center space-x-1.5 px-4.5 py-2.5 liquid-glass-card rounded-2xl">
              <Zap className="h-5 w-5 text-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-white/80">{activeCount} Active</span>
            </div>
            <div className="flex items-center space-x-1.5 px-4.5 py-2.5 liquid-glass-card rounded-2xl">
              <Award className="h-5 w-5 text-[#2ECC71]" />
              <span className="text-xs font-bold text-white/80">{completedCount} Badges</span>
            </div>
          </div>
        </div>

        <div className="liquid-glass-card rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <h3 className="text-lg font-display font-bold text-white">Compete for a cleaner future!</h3>
            <p className="text-sm text-white/60 font-body leading-relaxed max-w-xl">
              Choose from transportation, shopping, diet, or home energy tasks. Committing to small habits yields major collective changes.
            </p>
          </div>
          <div className="flex shrink-0 p-4 bg-white/5 rounded-2xl">
            <Trophy className="h-10 w-10 text-[#F0A500]" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-display font-bold text-white">Available Challenges</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <TiltCard key={challenge.id}>
                <ChallengeCard
                  challenge={challenge}
                  userChallenge={ucMap[challenge.id]}
                  onJoin={handleJoin}
                  onComplete={handleComplete}
                  loading={actionLoading}
                />
              </TiltCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
