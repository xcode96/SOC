
import React, { useState } from 'react';
import type { Topic } from '../types';

interface AdminGuideEditorPageProps {
  guide: { title: string; topics: Topic[] };
  guideId: string;
  onAddNewTopic: (guideId: string, newTopic: { id: string; title: string }) => void;
}

const AdminGuideEditorPage: React.FC<AdminGuideEditorPageProps> = ({ guide, guideId, onAddNewTopic }) => {
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicId, setNewTopicId] = useState('');

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle || !newTopicId) {
      alert('Topic Title and ID are required.');
      return;
    }
    if (guide.topics.some(t => t.id === newTopicId)) {
      alert('This Topic ID is already in use for this guide. Please choose a unique ID.');
      return;
    }

    onAddNewTopic(guideId, { id: newTopicId, title: newTopicTitle });

    // Reset form
    setNewTopicTitle('');
    setNewTopicId('');
  };

  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Edit Guide: <span className="text-cyan-400">{guide.title}</span></h1>
          <p className="text-slate-400">Add new topics to this guide.</p>
        </div>
        <a href="#/admin/dashboard" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Dashboard</a>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Add Topic Form */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Add New Topic</h2>
          <form onSubmit={handleAddTopicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic Title</label>
              <input 
                type="text" 
                value={newTopicTitle} 
                onChange={e => setNewTopicTitle(e.target.value)} 
                placeholder="e.g., Advanced Commands" 
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Topic ID (unique, no spaces)</label>
              <input 
                type="text" 
                value={newTopicId} 
                onChange={e => setNewTopicId(e.target.value.toLowerCase().replace(/\s/g, ''))} 
                placeholder="e.g., advanced-commands" 
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                required 
              />
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105">
              Add Topic
            </button>
          </form>
        </div>

        {/* Current Topics List */}
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Current Topics in Guide</h2>
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {guide.topics.map(topic => (
              <li key={topic.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center">
                <span className="font-medium">{topic.title}</span>
                <span className="text-xs text-slate-400">ID: {topic.id}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminGuideEditorPage;
