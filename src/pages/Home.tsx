import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col items-center justify-center text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white/10 rounded-full"
            style={{
              width: Math.random() * 100 + 20,
              height: Math.random() * 100 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, Math.random() * -100 - 50],
              opacity: [0.1, 0.5, 0.1],
              scale: [1, Math.random() * 1.5 + 0.5, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center px-4 max-w-2xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <Gift size={80} className="text-white drop-shadow-2xl" />
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-2 -right-2"
            >
              <Sparkles size={32} className="text-yellow-300" />
            </motion.div>
          </div>
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-lg">
          {t('home.title')}
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-white/90 font-medium drop-shadow-md">
          {t('home.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <Link to="/create">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-white text-purple-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <Gift size={24} />
              {t('home.createBtn')}
            </motion.button>
          </Link>
          <Link to="/open">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-8 py-4 bg-purple-700/50 backdrop-blur-md border border-white/30 text-white rounded-full font-bold text-lg shadow-xl hover:bg-purple-600/50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={24} />
              {t('home.openBtn')}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
