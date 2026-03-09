import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-[#0a0a0a] flex flex-col relative">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f1a_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f1a_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="flex-1 flex flex-col items-center justify-center text-white overflow-hidden relative z-10 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center px-4 max-w-3xl w-full"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="flex justify-center mb-10"
          >
            <div className="relative p-6 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Gift size={48} className="text-gray-200" strokeWidth={1.5} />
              <motion.div
                animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-1 -right-1"
              >
                <Sparkles size={24} className="text-indigo-400" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 pb-2 tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            {t('home.title')}
          </h1>
          <p className="text-lg md:text-xl mb-12 text-gray-400 font-light max-w-xl mx-auto leading-relaxed">
            {t('home.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Gift size={18} strokeWidth={2} />
                {t('home.createBtn')}
              </motion.button>
            </Link>
            <Link to="/open" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-3.5 bg-transparent border border-gray-700 text-gray-300 rounded-full font-medium text-sm hover:bg-gray-800 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <Sparkles size={18} strokeWidth={2} />
                {t('home.openBtn')}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
