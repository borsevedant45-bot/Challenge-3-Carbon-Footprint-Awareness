import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import ChallengeCard from '../components/ChallengeCard';
import TiltCard from '../components/TiltCard';
import { Trophy, Award, Zap, HelpCircle } from 'lucide-react';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch all challenges and user active challenges
  const fetchChallengesData = async () => {
    try {
      setLoading(true);
      
      const allRes = await api.get('/api/challenges');
      const activeRes = await api.get('/api/challenges/active');

      if (allRes.data.success) {
        setChallenges(allRes.data.data);
      }
      if (activeRes.data.success) {
        setUserChallenges(activeRes.data.data);
      }

    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallengesData();
  }, []);

  // Handler: Join Challenge
  const handleJoin = async (challengeId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/challenges/join', { challengeId });
      if (res.data.success) {
        // Refresh challenges data
        await fetchChallengesData();
      }
    } catch (err) {
      console.error('Error joining challenge:', err);
      alert(err.response?.data?.message || 'Error joining challenge');
    } finally {
      setActionLoading(false);
    }
  };

  // Handler: Complete Challenge
  const handleComplete = async (userChallengeId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/challenges/complete', { userChallengeId });
      if (res.data.success) {
        // Refresh challenges data
        await fetchChallengesData();
      }
    } catch (err) {
      console.error('Error completing challenge:', err);
      alert(err.response?.data?.message || 'Error completing challenge');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-secondary" />
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest animate-pulse">
            Loading challenges board...
          </p>
        </div>
      </div>
    );
  }

  // Helper map to find user's subscription detail for a given challenge
  const getUserChallengeMap = () => {
    const map = {};
    userChallenges.forEach(uc => {
      map[uc.challengeId] = uc;
    });
    return map;
  };

  const ucMap = getUserChallengeMap();

  // Categorize user challenges to show highlights
  const activeCount = userChallenges.filter(uc => uc.status === 'ACTIVE').length;
  const completedCount = userChallenges.filter(uc => uc.status === 'COMPLETED').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-800 dark:text-nature-darkText">
            Gamified Challenges
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 dark:text-nature-darkText/40 mt-1">
            Complete green challenges to earn verified sustainable badges and reduce carbon output.
          </p>
        </div>

        {/* Stats indicators */}
        <div className="flex items-center space-x-3.5">
          <div className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-950/30">
            <Zap className="h-5 w-5 text-blue-500 animate-pulse" />
            <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
              ⚡ {activeCount} Active Task(s)
            </span>
          </div>

          <div className="flex items-center space-x-1.5 px-4.5 py-2.5 bg-green-50 dark:bg-green-950/20 rounded-2xl border border-green-100 dark:border-green-950/30">
            <Award className="h-5 w-5 text-secondary animate-bounce" />
            <span className="text-xs font-extrabold text-secondary">
              🏆 {completedCount} Badge(s) Earned
            </span>
          </div>
        </div>
      </div>

      {/* Intro info box */}
      <div className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-nature-cardDark dark:to-nature-cardDark border border-primary/20 dark:border-nature-darkBg/30 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-6 shadow-nature">
        <div className="space-y-1.5 text-center md:text-left">
          <h3 className="text-lg font-display font-black text-primary dark:text-secondary">
            Compete for a cleaner future!
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-nature-darkText/80 leading-relaxed max-w-xl">
            Choose from transportation, shopping, diet, or home energy tasks. Committing to small habits yields major collective changes. Earn custom badges directly displayed on your platform.
          </p>
        </div>
        <div className="flex shrink-0 p-4 bg-white/50 dark:bg-nature-darkBg/50 backdrop-blur-sm rounded-2xl sway-leaf">
          <Trophy className="h-10 w-10 text-accent" />
        </div>
      </div>

      {/* Challenge Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-display font-black text-gray-800 dark:text-nature-darkText">
          Available Challenges
        </h3>
        
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
  );
}
