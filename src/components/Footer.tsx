import { useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();

  return (
    <footer className="w-full py-8 text-center z-40 bg-transparent flex flex-col items-center justify-center gap-1">
      <div className="bg-white border-[3px] border-black px-6 py-3 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block">
        <p className="text-sm text-black font-extrabold tracking-wide">
          Built by MKA
        </p>
        <a 
          href="https://mka.my.id" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-xs text-black border-t border-black/20 pt-1 mt-1 block hover:underline transition-colors font-mono font-semibold"
        >
          mka.my.id
        </a>
      </div>
    </footer>
  );
}
