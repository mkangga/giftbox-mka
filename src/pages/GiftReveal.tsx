import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Gift, Heart, Star, Sparkles, ExternalLink, Music, Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const THEME_STYLES = {
  romantic: {
    bg: 'bg-gradient-to-br from-pink-200 via-red-100 to-pink-300',
    card: 'bg-white/80 backdrop-blur-md border border-pink-200',
    text: 'text-pink-900',
    accent: 'text-pink-500',
    button: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/50',
    font: 'font-serif',
    icon: Heart,
  },
  birthday: {
    bg: 'bg-gradient-to-br from-yellow-200 via-orange-100 to-red-200',
    card: 'bg-white/90 backdrop-blur-md border border-yellow-300',
    text: 'text-orange-900',
    accent: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/50',
    font: 'font-sans',
    icon: Star,
  },
  cute: {
    bg: 'bg-gradient-to-br from-teal-100 via-cyan-100 to-blue-200',
    card: 'bg-white/80 backdrop-blur-md border border-teal-200',
    text: 'text-teal-900',
    accent: 'text-teal-500',
    button: 'bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/50',
    font: 'font-sans rounded-2xl',
    icon: Sparkles,
  },
  minimal: {
    bg: 'bg-gray-50',
    card: 'bg-white border border-gray-200 shadow-sm',
    text: 'text-gray-900',
    accent: 'text-gray-900',
    button: 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-900/20',
    font: 'font-mono',
    icon: Gift,
  },
  galaxy: {
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-900 to-black',
    card: 'bg-white/10 backdrop-blur-xl border border-white/20',
    text: 'text-white',
    accent: 'text-indigo-300',
    button: 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/50',
    font: 'font-sans tracking-wide',
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
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    // Play music if available
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play failed:", e));
      setMusicPlaying(true);
    }

    // Shake animation duration
    setTimeout(() => {
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

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !giftData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-4">Oops!</h2>
          <p className="text-gray-400">{error || 'Gift not found'}</p>
          <button onClick={() => navigate('/')} className="mt-8 px-6 py-2 bg-indigo-600 rounded-full">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const theme = THEME_STYLES[giftData.theme as keyof typeof THEME_STYLES] || THEME_STYLES.romantic;
  const ThemeIcon = theme.icon;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.font} flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden transition-colors duration-1000`}>
      
      {/* Optional Background Music */}
      {/* We use a placeholder audio URL for demo purposes */}
      <audio ref={audioRef} src="https://assets.mixkit.co/music/preview/mixkit-magical-surprise-461.mp3" loop />
      
      {step === 3 && (
        <button
          onClick={toggleMusic}
          className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md border z-50 transition-all ${
            giftData.theme === 'galaxy' ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-black/5 border-black/10 text-black hover:bg-black/10'
          }`}
        >
          {musicPlaying ? <Music size={20} /> : <Music2 size={20} className="opacity-50" />}
        </button>
      )}

      {/* Galaxy Theme Stars */}
      {giftData.theme === 'galaxy' && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: Math.random() * 3 + 2, repeat: Infinity }}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step < 3 ? (
          <motion.div
            key="box"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            className="text-center z-10"
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
              <div className="relative">
                <Gift size={180} className={`${theme.accent} drop-shadow-2xl`} />
                {step === 1 && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-4 -right-4 bg-white rounded-full p-2 shadow-lg"
                  >
                    <Sparkles size={32} className="text-yellow-400" />
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
                <h1 className={`text-4xl md:text-5xl font-bold mb-8 ${theme.text} drop-shadow-sm`}>
                  {t('reveal.from')} {giftData.sender_name}
                </h1>
                <button
                  onClick={handleOpenGift}
                  className={`px-10 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 active:scale-95 shadow-xl ${theme.button}`}
                >
                  {t('reveal.openBtn')}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="w-full max-w-2xl z-10 space-y-8"
          >
            {/* Message Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={`p-8 md:p-12 rounded-3xl shadow-2xl ${theme.card} relative overflow-hidden`}
            >
              <ThemeIcon size={120} className={`absolute -top-10 -right-10 opacity-10 ${theme.accent}`} />
              
              <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme.text}`}>
                {t('reveal.to')} {giftData.recipient_name},
              </h2>
              <div className={`text-lg md:text-xl leading-relaxed whitespace-pre-wrap ${theme.text} opacity-90`}>
                {giftData.message}
              </div>
              <div className={`mt-8 text-right font-bold text-xl ${theme.accent}`}>
                {t('reveal.from')} {giftData.sender_name}
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
                <h3 className={`text-2xl font-bold text-center mb-6 ${theme.text}`}>
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
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`flex items-center justify-between p-6 rounded-2xl shadow-lg transition-all ${theme.card} hover:shadow-xl group`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${giftData.theme === 'galaxy' ? 'bg-white/10' : 'bg-black/5'}`}>
                          <Gift size={24} className={theme.accent} />
                        </div>
                        <span className={`text-xl font-bold ${theme.text}`}>
                          {link.title}
                        </span>
                      </div>
                      <ExternalLink size={24} className={`${theme.accent} opacity-50 group-hover:opacity-100 transition-opacity`} />
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
