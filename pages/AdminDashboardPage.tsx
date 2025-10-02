import React, { useState } from 'react';
import type { RawHomeCard, AdminUser } from '../types';

interface AdminDashboardPageProps {
  currentGuides: RawHomeCard[];
  onCreateGuide: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onReset: () => void;
  adminUsers: AdminUser[];
  onAddUser: (newUser: AdminUser) => void;
  onDeleteUser: (username: string) => void;
  onExportData: () => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentGuides, onCreateGuide, onReset, adminUsers, onAddUser, onDeleteUser, onExportData }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [color, setColor] = useState('bg-gray-800/80');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('bg-gray-500/50 text-white');
  const [newUsername, setNewUsername] = useState('');

  const handleCreateGuideSubmit = (e: React.FormEvent) => {
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

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUsername = newUsername.trim().toLowerCase();
    if (!cleanedUsername) {
      alert('Username cannot be empty.');
      return;
    }
    if (adminUsers.some(user => user.username.toLowerCase() === cleanedUsername)) {
      alert('This username already exists.');
      return;
    }
    onAddUser({ username: cleanedUsername });
    setNewUsername('');
  };

  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Create guides, manage users, and export data.</p>
        </div>
        <a href="#/home" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Home</a>
      </header>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
            {/* Create Guide Form */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Create New Guide</h2>
              <form onSubmit={handleCreateGuideSubmit} className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">ID (unique, no spaces)</label>
                    <input type="text" value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="e.g., react" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Card Color</label>
                        <input type="text" value={color} onChange={e => setColor(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tag Name</label>
                        <input type="text" value={tagName} onChange={e => setTagName(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Tag Color</label>
                        <input type="text" value={tagColor} onChange={e => setTagColor(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    </div>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105">
                Create Guide
                </button>
              </form>
            </div>
            {/* Current Guides List */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Current Guides ({currentGuides.length})</h2>
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

        {/* Sidebar Area */}
        <div className="space-y-8">
            {/* Actions Panel */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Actions</h2>
                <div className="space-y-3">
                     <button onClick={onExportData} className="w-full text-center text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export All Data
                    </button>
                    <button onClick={onReset} className="w-full text-center text-sm bg-red-600/80 hover:bg-red-700/80 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                         </svg>
                        Reset to Default
                    </button>
                </div>
            </div>

            {/* User Management */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Manage Admin Users</h2>
              <form onSubmit={handleAddUserSubmit} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newUsername} 
                  onChange={(e) => setNewUsername(e.target.value)} 
                  placeholder="New username" 
                  className="flex-grow bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  required 
                />
                <button type="submit" className="text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1 px-3 rounded-md transition-colors flex-shrink-0">
                  Add
                </button>
              </form>
              <ul className="space-y-2 max-h-48 overflow-y-auto">
                {adminUsers.map(user => (
                  <li key={user.username} className="bg-slate-700/50 p-2 rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium">{user.username}</span>
                    <button onClick={() => onDeleteUser(user.username)} className="text-xs bg-red-600/80 hover:bg-red-500 text-white font-bold py-0.5 px-2 rounded-md transition-colors">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;