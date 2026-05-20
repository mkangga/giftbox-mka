import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Gift, Sparkles, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Footer } from '../components/Footer';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex-1 bg-[#fdfcf7] flex flex-col relative overflow-x-hidden select-none">
      {/* Neobrutalist Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ backgroundImage: 'radial-gradient(circle, #000000 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
      ></div>

      <div className="flex-1 flex flex-col items-center justify-center text-black relative z-10 pt-28 pb-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-3xl w-full"
        >
          {/* Badge Icon */}
          <div className="flex justify-center mb-8">
            <motion.div
              whileHover={{ rotate: [-3, 3, -3], scale: 1.05 }}
              className="relative p-6 rounded-2xl bg-[#fbcfe8] border-[3px] border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            >
              <Gift size={56} className="text-black stroke-[2.5px]" />
              <div className="absolute -top-3 -right-3 bg-[#bbf7d0] border-[2.2px] border-black p-1.5 rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Sparkles size={20} className="text-black stroke-[2.5px]" />
              </div>
            </motion.div>
          </div>

          {/* Stark Typography Title with Black Drop Shadow text effect */}
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-8 tracking-tight text-black uppercase leading-tight flex flex-wrap justify-center gap-4">
            <span className="bg-[#fef08a] border-[3px] border-black px-4 py-2 inline-block rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rotate-[-1.5deg]">
              Digital
            </span>
            <span className="bg-[#bbf7d0] border-[3px] border-black px-4 py-2 inline-block rounded-xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] rotate-[1.5deg]">
              Gift Box
            </span>
          </h1>

          <p className="text-base md:text-lg mb-12 text-black/90 font-mono font-semibold max-w-xl mx-auto leading-relaxed bg-white border-[3px] border-black p-5 rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]">
            {t('home.subtitle')}
          </p>

          {/* Heavy black dropped buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center max-w-md mx-auto sm:max-w-none">
            <Link to="/create" className="w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 bg-[#fbcfe8] text-black border-[3px] border-black rounded-xl font-extrabold text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift size={22} className="stroke-[2.5px]" />
                {t('home.createBtn')}
              </motion.button>
            </Link>

            <Link to="/open" className="w-full sm:w-auto">
              <motion.button
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 bg-[#bbf7d0] text-black border-[3px] border-black rounded-xl font-extrabold text-lg shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[5px] hover:translate-y-[5px] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Unlock size={22} className="stroke-[2.5px]" />
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
