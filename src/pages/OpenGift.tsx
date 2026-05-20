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
    <div className="flex-1 bg-[#fdfcf7] flex flex-col relative select-none">
      {/* Neobrutalist Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0"
        style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      ></div>

      <div className="flex-1 flex items-center justify-center p-4 pt-28 pb-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <motion.div
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="bg-white border-[3px] border-black p-8 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex justify-center mb-8">
                <motion.div
                  animate={unlocked ? { scale: 1.1, rotateY: 180 } : {}}
                  transition={{ duration: 0.6 }}
                  className={`w-20 h-20 rounded-2xl flex items-center justify-center border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${
                    unlocked ? 'bg-[#bbf7d0]' : 'bg-[#fef08a]'
                  }`}
                >
                  {unlocked ? <Unlock size={32} className="stroke-[2.5px] text-black" /> : <Lock size={32} className="stroke-[2.5px] text-black" />}
                </motion.div>
              </div>

              <h2 className="text-3xl font-extrabold text-black text-center mb-2 tracking-tight uppercase leading-tight">
                {unlocked ? 'Unlocked!' : t('open.title')}
              </h2>
              <p className="text-black/70 text-center mb-8 font-mono text-sm font-semibold">
                {unlocked ? 'Preparing your surprise...' : t('open.subtitle')}
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-200 border-[2.5px] border-black text-black px-4 py-3 rounded-xl mb-6 text-xs text-center font-mono font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
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
                    className="w-full px-4 py-3.5 bg-white border-[3px] border-black rounded-xl text-black placeholder-black/40 font-semibold focus:bg-[#fef08a] focus:outline-none transition-all"
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
                    className="w-full px-4 py-3.5 bg-white border-[3px] border-black rounded-xl text-black placeholder-black/40 font-semibold focus:bg-[#fef08a] focus:outline-none transition-all pr-12"
                    placeholder={t('open.passwordPlaceholder')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black hover:scale-105 transition-all cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={20} className="stroke-[2.5px]" /> : <Eye size={20} className="stroke-[2.5px]" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={unlocked || loading}
                  className={`w-full py-4 rounded-xl font-extrabold text-lg border-[3px] border-black transition-all flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider ${
                    unlocked
                      ? 'bg-[#bbf7d0] text-black'
                      : 'bg-[#fbcfe8] hover:bg-[#f472b6] text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px]'
                  }`}
                >
                  {loading ? (
                    <div className="w-6 h-6 border-[2.5px] border-black border-t-transparent rounded-full animate-spin" />
                  ) : unlocked ? (
                    t('open.unlocking')
                  ) : (
                    <>
                      {t('open.unlockBtn')} <ArrowRight size={20} className="stroke-[2.5px]" />
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
