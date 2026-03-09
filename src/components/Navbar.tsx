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
    <nav className="fixed top-1 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-xl">
      <Link
        to="/"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
          location.pathname === '/' 
            ? 'bg-white/20 text-white font-bold shadow-sm' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <Gift size={18} />
        <span className="hidden sm:inline">{t('nav.home', 'Home')}</span>
      </Link>
      <Link
        to="/create"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
          location.pathname === '/create' 
            ? 'bg-white/20 text-white font-bold shadow-sm' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <PlusCircle size={18} />
        <span className="hidden sm:inline">{t('nav.create', 'Create')}</span>
      </Link>
      <Link
        to="/open"
        className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all text-sm sm:text-base ${
          location.pathname === '/open' 
            ? 'bg-white/20 text-white font-bold shadow-sm' 
            : 'text-gray-300 hover:text-white hover:bg-white/10'
        }`}
      >
        <Unlock size={18} />
        <span className="hidden sm:inline">{t('nav.open', 'Open')}</span>
      </Link>
    </nav>
  );
}
