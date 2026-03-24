import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Unlock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

export default function OpenGift() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [giftId, setGiftId] = useState(searchParams.get('id') || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (shake) {
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [shake]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/gifts/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gift_id: giftId, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      setUnlocked(true);
      
      // Store success flag in sessionStorage
      sessionStorage.setItem(`gift_access_${giftId}`, 'true');

      setTimeout(() => {
        navigate(`/gift/${giftId}`);
      }, 1500);

    } catch (err: any) {
      setError(err.message);
      setShake(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-900 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden"
          >
            {/* Animated Background Glow */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen filter blur-[50px] opacity-50" />
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-screen filter blur-[50px] opacity-50" />

            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={unlocked ? { scale: 1.2, rotateY: 180 } : {}}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                    unlocked ? 'bg-green-400 text-white' : 'bg-white/20 text-white'
                  }`}
                >
                  {unlocked ? <Unlock size={32} /> : <Lock size={32} />}
                </motion.div>
              </div>

              <h2 className="text-3xl font-bold text-white text-center mb-2 tracking-tight">
                {unlocked ? 'Unlocked!' : t('open.title')}
              </h2>
              <p className="text-indigo-200 text-center mb-8">
                {unlocked ? 'Preparing your surprise...' : t('open.subtitle')}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm text-center"
                >
                  {t('open.error')}
                </motion.div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <input
                    type="text"
                    required
                    value={giftId}
                    onChange={(e) => setGiftId(e.target.value)}
                    disabled={unlocked || loading}
                    autoComplete="off"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all outline-none"
                    placeholder={t('create.giftId')}
                  />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={unlocked || loading}
                    autoComplete="off"
                    style={{ WebkitTextSecurity: showPassword ? 'none' : 'disc' }}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all outline-none pr-12"
                    placeholder={t('open.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={unlocked || loading}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                    unlocked
                      ? 'bg-green-500 text-white'
                      : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)]'
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : unlocked ? (
                    t('open.unlocking')
                  ) : (
                    <>
                      {t('open.unlockBtn')} <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
