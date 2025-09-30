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
      <header className="text-center mb-12">
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
