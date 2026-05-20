import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Heart, Star, Sparkles, ExternalLink, Music, Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const THEME_STYLES = {
  romantic: {
    bg: 'bg-[#fbcfe8]',
    card: 'bg-white border-[3px] border-black',
    accent: 'bg-[#fef08a]',
    button: 'bg-[#bbf7d0] hover:bg-[#86efac]',
    icon: Heart,
  },
  birthday: {
    bg: 'bg-[#fef08a]',
    card: 'bg-white border-[3px] border-black',
    accent: 'bg-[#fbcfe8]',
    button: 'bg-[#bbf7d0] hover:bg-[#86efac]',
    icon: Star,
  },
  cute: {
    bg: 'bg-[#bbf7d0]',
    card: 'bg-white border-[3px] border-black',
    accent: 'bg-[#fbcfe8]',
    button: 'bg-[#fef08a] hover:bg-[#fde047]',
    icon: Sparkles,
  },
  minimal: {
    bg: 'bg-[#fdfcf7]',
    card: 'bg-white border-[3px] border-black',
    accent: 'bg-gray-100',
    button: 'bg-[#fde047] hover:bg-yellow-300',
    icon: Gift,
  },
  galaxy: {
    bg: 'bg-[#c084fc]',
    card: 'bg-white border-[3px] border-black',
    accent: 'bg-[#fef08a]',
    button: 'bg-[#bbf7d0] hover:bg-[#86efac]',
    icon: Star,
  },
};

export default function GiftReveal() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [giftData, setGiftData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Closed Box, 2: Shaking/Opening, 3: Reveal
  const popSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkAccess = () => {
      const hasAccess = sessionStorage.getItem(`gift_access_${id}`);
      if (!hasAccess) {
        navigate('/open?id=' + id);
        return false;
      }
      return true;
    };

    const fetchGift = async () => {
      if (!checkAccess()) return;

      try {
        const response = await fetch(`/api/gifts/${id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load gift');
        }

        setGiftData(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGift();
  }, [id, navigate]);

  const handleOpenGift = () => {
    setStep(2);

    // Shake animation duration
    setTimeout(() => {
      // Play pop sound
      if (popSoundRef.current) {
        popSoundRef.current.play().catch(e => console.error("Pop sound failed:", e));
      }

      // Confetti explosion
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      setStep(3);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex-1 bg-[#fdfcf7] flex items-center justify-center relative">
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 z-0"
          style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        ></div>
        <div className="relative w-12 h-12 border-[3.5px] border-black border-t-transparent rounded-full animate-spin z-10" />
      </div>
    );
  }

  if (error || !giftData) {
    return (
      <div className="flex-1 bg-white border-[3px] border-black flex items-center justify-center text-black p-4 text-center">
        <div>
          <h2 className="text-3xl font-extrabold mb-4 uppercase">Oops!</h2>
          <p className="text-red-500 font-mono font-bold">{error || 'Gift not found'}</p>
          <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-[#fde047] border-[2.5px] border-black font-extrabold uppercase rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const theme = THEME_STYLES[giftData.theme as keyof typeof THEME_STYLES] || THEME_STYLES.romantic;
  const ThemeIcon = theme.icon;

  return (
    <div className={`flex-1 ${theme.bg} flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-1000 select-none`}>
      {/* Neobrutalist Grid Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-25 z-0"
        style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      ></div>

      {/* Pop sound effect */}
      <audio ref={popSoundRef} src="https://assets.mixkit.co/sfx/preview/mixkit-party-crowd-applause-1227.mp3" />

      <AnimatePresence mode="wait">
        {step < 3 ? (
          <motion.div
            key="box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="text-center z-10 w-full max-w-md px-4"
          >
            <motion.div
              animate={step === 2 ? {
                x: [-10, 10, -10, 10, -5, 5, 0],
                y: [0, -10, 0, -10, 0],
                rotate: [-5, 5, -5, 5, 0]
              } : {
                y: [0, -10, 0]
              }}
              transition={step === 2 ? { duration: 1.5, ease: "easeInOut" } : { duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="cursor-pointer inline-block"
              onClick={step === 1 ? handleOpenGift : undefined}
            >
              <div className="relative p-10 bg-white border-[4px] border-black rounded-[2.5rem] shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
                <Gift size={120} className="text-black stroke-[2.5px]" />
                {step === 1 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-[#fde047] border-[2.2px] border-black rounded-lg p-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Sparkles size={24} className="text-black" />
                  </motion.div>
                )}
              </div>
            </motion.div>

            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-black uppercase leading-tight bg-white border-[3px] border-black px-6 py-3 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] inline-block">
                  {t('reveal.from')} {giftData.sender_name}
                </h1>
                
                <div>
                  <button
                    onClick={handleOpenGift}
                    className={`px-10 py-5 rounded-2xl border-[3px] border-black font-extrabold text-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all cursor-pointer uppercase tracking-wider ${theme.button}`}
                  >
                    {t('reveal.openBtn')}
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-2xl z-10 space-y-8 px-4"
          >
            {/* Message Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`p-8 md:p-12 rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden bg-white border-[3px] border-black text-black z-10`}
            >
              <ThemeIcon size={120} className="absolute -top-10 -right-10 opacity-5 text-black stroke-[3px]" />
              
              <h2 className="text-3xl md:text-4xl font-extrabold mb-6 tracking-tight uppercase border-b-[2.5px] border-dashed border-black/20 pb-3 leading-tight">
                {t('reveal.to')} {giftData.recipient_name},
              </h2>
              <div className="text-lg md:text-xl font-mono leading-relaxed whitespace-pre-wrap bg-gray-50 border-[2px] border-black p-5 sm:p-7 rounded-2xl font-semibold mb-6">
                {giftData.message}
              </div>
              <div className="text-right">
                <span className="font-extrabold text-sm uppercase bg-[#fef08a] border-[2px] border-black px-4 py-2 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block">
                  {t('reveal.from')} {giftData.sender_name}
                </span>
              </div>
            </motion.div>

            {/* Gift Links */}
            {giftData.links && giftData.links.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="space-y-4"
              >
                <h3 className="text-2xl font-extrabold text-center uppercase tracking-wider mb-6 bg-white border-[2.2px] border-black px-4 py-1.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] inline-block mx-auto block max-w-max text-black">
                  {t('reveal.surprises')}
                </h3>
                <div className="grid gap-4">
                  {giftData.links.map((link: any, index: number) => (
                    <motion.a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                      className="flex items-center justify-between p-6 bg-white border-[3px] border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] active:scale-97 transition-all text-black cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-[#fef08a] border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <Gift size={24} className="stroke-[2.5px] text-black" />
                        </div>
                        <span className="text-lg sm:text-xl font-extrabold uppercase">
                          {link.title}
                        </span>
                      </div>
                      <ExternalLink size={24} className="stroke-[2.5px] group-hover:scale-110 transition-transform text-black" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
