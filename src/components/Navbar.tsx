import { Link, useLocation } from 'react-router-dom';
import { Gift, PlusCircle, Unlock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Navbar() {
  const { t } = useTranslation();
  const location = useLocation();

  // Hide navbar on the reveal page to keep the surprise immersive
  if (location.pathname.startsWith('/gift/')) {
    return null;
  }

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-white border-[3px] border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
      <Link
        to="/"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-[2px] transition-all text-sm sm:text-base ${
          location.pathname === '/' 
            ? 'bg-[#fef08a] text-black font-extrabold border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
            : 'text-black border-transparent font-bold hover:bg-gray-100 hover:border-black'
        }`}
      >
        <Gift size={18} className="stroke-[2.5px]" />
        <span className="hidden sm:inline font-sans">{t('nav.home', 'Home')}</span>
      </Link>
      <Link
        to="/create"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-[2px] transition-all text-sm sm:text-base ${
          location.pathname === '/create' 
            ? 'bg-[#fbcfe8] text-black font-extrabold border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
            : 'text-black border-transparent font-bold hover:bg-gray-100 hover:border-black'
        }`}
      >
        <PlusCircle size={18} className="stroke-[2.5px]" />
        <span className="hidden sm:inline font-sans">{t('nav.create', 'Create')}</span>
      </Link>
      <Link
        to="/open"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border-[2px] transition-all text-sm sm:text-base ${
          location.pathname === '/open' 
            ? 'bg-[#bbf7d0] text-black font-extrabold border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
            : 'text-black border-transparent font-bold hover:bg-gray-100 hover:border-black'
        }`}
      >
        <Unlock size={18} className="stroke-[2.5px]" />
        <span className="hidden sm:inline font-sans">{t('nav.open', 'Open')}</span>
      </Link>
    </nav>
  );
}
