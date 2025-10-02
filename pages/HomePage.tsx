import React from 'react';
import type { HomeCard } from '../types';

interface HomePageProps {
  homeCards: HomeCard[];
}

const Card: React.FC<{ card: HomeCard }> = ({ card }) => (
  <a href={card.href} className={`rounded-2xl p-5 flex flex-col justify-between h-40 transition-all duration-300 ease-in-out hover:transform hover:scale-105 hover:shadow-2xl ${card.color}`}>
    <div>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center">{card.icon}</div>
          <h3 className="text-lg font-bold text-white">{card.title}</h3>
        </div>
        {card.tag && (
          <span className={`text-xs font-semibold rounded-full px-2 py-0.5 ${card.tag.color}`}>
            {card.tag.name}
          </span>
        )}
      </div>
    </div>
    <div className="flex items-center gap-2 text-sm text-white/70">
      <span>👇</span>
      <span>{card.status}</span>
    </div>
  </a>
);


const HomePage: React.FC<HomePageProps> = ({ homeCards }) => {
  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="relative text-center mb-12">
        <a
          href="https://github.com/xcode96"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 right-0 bg-slate-800/60 backdrop-blur-md text-white p-3 rounded-full shadow-lg hover:bg-slate-700/80 focus:outline-none focus:ring-4 focus:ring-sky-300/50 transition-all duration-300 ease-in-out transform hover:scale-110"
          aria-label="View developer on GitHub"
          title="View developer on GitHub"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-6 h-6">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
          </svg>
        </a>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-300 to-fuchsia-400">
          Learning Dashboard
        </h1>
        <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
          An interactive collection of guides and resources for modern technologies and concepts.
        </p>
         <div className="mt-4">
            <a href="#/admin/login" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">Admin Login</a>
        </div>
      </header>
      <main>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {homeCards.map(card => <Card key={card.id} card={card} />)}
        </div>
      </main>
      <footer className="text-center mt-12 text-slate-500 text-sm">
        <p>Select a topic to start learning.</p>
      </footer>
    </div>
  );
};

export default HomePage;