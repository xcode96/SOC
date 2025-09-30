import React from 'react';

interface HeaderProps {
  onMenuClick: () => void;
  // Fix: Add optional title prop to allow custom header titles.
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title }) => {
  return (
    <header className="p-4 z-10 bg-white/70 backdrop-blur-lg border-b border-slate-900/10 flex items-center justify-between gap-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden text-slate-700 hover:text-sky-500 transition-colors"
          aria-label="Open navigation menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-fuchsia-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <h1 className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-sky-500 to-cyan-500">
          {/* Fix: Display the title prop if provided, otherwise show a default title. */}
          {title || 'SOC Concepts Interactive Guide'}
        </h1>
      </div>
    </header>
  );
};

export default Header;
