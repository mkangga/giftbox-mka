import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2 bg-[#bbf7d0] border-[3px] border-black rounded-xl text-black font-extrabold hover:bg-[#86efac] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
    >
      <Globe className="w-4 h-4 stroke-[2.5px]" />
      <span className="text-sm uppercase font-mono">{i18n.language}</span>
    </button>
  );
}
