import { useLocation } from 'react-router-dom';

export function Footer() {
  const location = useLocation();

  // If we want to hide it on reveal page, we could, but the request asked for "seluruh pagesnya" (all pages).
  // We will render it on all pages.
  
  return (
    <footer className="w-full py-8 text-center z-40 bg-transparent">
      <p className="text-sm text-gray-400 font-light tracking-wide mb-1">
        Built by MKA
      </p>
      <a 
        href="https://mka.my.id" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-sm text-gray-500 hover:text-gray-300 transition-colors font-mono"
      >
        mka.my.id
      </a>
    </footer>
  );
}
