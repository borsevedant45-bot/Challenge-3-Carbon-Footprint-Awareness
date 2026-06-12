import React, { useEffect, useState, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import TiltCard from '../components/TiltCard';
import ChallengeCard from '../components/ChallengeCard';
import { Trophy, Award, Zap } from 'lucide-react';

const FadingVideo = lazy(() => import('../components/FadingVideo'));

const stagger = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [userChallenges, setUserChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRes, activeRes] = await Promise.all([
        api.get('/api/challenges'),
        api.get('/api/challenges/active'),
      ]);
      if (allRes.data.success) setChallenges(allRes.data.data);
      if (activeRes.data.success) setUserChallenges(activeRes.data.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleJoin = async (challengeId) => {
    setActionLoading(true);
    try {
      const res = await api.post('/api/challenges/join', { challengeId });
      if (res.data.success) await fetchData();
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
      if (res.data.success) await fetchData();
    } catch (err) {
      console.error('Error completing challenge:', err);
      alert(err.response?.data?.message || 'Error completing challenge');
    } finally {
      setActionLoading(false);
    }
  };

  const ucMap = {};
  userChallenges.forEach((uc) => { ucMap[uc.challengeId] = uc; });
  const activeCount = userChallenges.filter((uc) => uc.status === 'ACTIVE').length;
  const completedCount = userChallenges.filter((uc) => uc.status === 'COMPLETED').length;

  return (
    <div className="min-h-screen bg-[#050D07] relative">
      <div className="fixed inset-0 z-0 opacity-15 pointer-events-none">
        <Suspense fallback={null}>
          <FadingVideo
            src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
            className="w-full h-full object-cover"
          />
        </Suspense>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-8 pb-16 space-y-6">
        <motion.div
          custom={0}
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="liquid-glass-strong rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-display font-bold text-white">Mission Board</h1>
            <p className="text-sm font-body text-white/60 mt-1">Complete challenges, earn badges, save the planet</p>
          </div>
          <div className="flex gap-3">
            <div className="liquid-glass rounded-full px-4 py-2 text-sm font-body flex items-center space-x-1.5">
              <Zap className="h-4 w-4 text-blue-400" />
              <span className="text-white/80">{activeCount} Active Missions</span>
            </div>
            <div className="liquid-glass rounded-full px-4 py-2 text-sm font-body flex items-center space-x-1.5">
              <Trophy className="h-4 w-4 text-[#2ECC71]" />
              <span className="text-white/80">{completedCount} Badges Earned</span>
            </div>
          </div>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="liquid-glass rounded-2xl h-64 animate-pulse" />
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
            {challenges.map((challenge, i) => (
              <motion.div key={challenge.id} custom={2 + i} variants={stagger} initial="hidden" animate="visible">
                <TiltCard>
                  <ChallengeCard
                    challenge={challenge}
                    userChallenge={ucMap[challenge.id]}
                    onJoin={handleJoin}
                    onComplete={handleComplete}
                    loading={actionLoading}
                  />
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
