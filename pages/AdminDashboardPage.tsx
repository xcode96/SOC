
import React, { useState } from 'react';
import type { RawHomeCard } from '../types';

interface AdminDashboardPageProps {
  currentGuides: RawHomeCard[];
  onCreateGuide: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onReset: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentGuides, onCreateGuide, onReset }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [color, setColor] = useState('bg-gray-800/80');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('bg-gray-500/50 text-white');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !id) {
      alert('Title and ID are required.');
      return;
    }
    if (currentGuides.some(g => g.id === id)) {
      alert('This ID is already in use. Please choose a unique ID.');
      return;
    }
    const newCardData = {
      id,
      title,
      color,
      tag: tagName ? { name: tagName, color: tagColor } : undefined,
    };
    onCreateGuide(newCardData);
    // Reset form
    setTitle('');
    setId('');
    setTagName('');
  };

  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Create and manage guides.</p>
        </div>
        <a href="#/home" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Home</a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create Guide Form */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Create New Guide</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">ID (unique, no spaces)</label>
              <input type="text" value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="e.g., react" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Card Color (Tailwind Class)</label>
                <input type="text" value={color} onChange={e => setColor(e.target.value)} placeholder="e.g., bg-purple-800/80" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Tag Name (Optional)</label>
                <input type="text" value={tagName} onChange={e => setTagName(e.target.value)} placeholder="e.g., Frontend" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105">
              Create Guide
            </button>
          </form>
        </div>

        {/* Current Guides List */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Current Guides</h2>
            <button onClick={onReset} className="bg-red-600/80 text-white text-xs font-bold py-1 px-3 rounded-md hover:bg-red-700/80 transition-colors">
              Reset to Default
            </button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {currentGuides.map(guide => (
              <li key={guide.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="font-medium">{guide.title}</span>
                    <span className="text-xs text-slate-400">ID: {guide.id}</span>
                </div>
                <a href={`#/admin/edit/${guide.id}`} className="text-sm bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded-md transition-colors flex-shrink-0">
                    Edit
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;