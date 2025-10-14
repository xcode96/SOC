import React, { useState, useRef, useEffect } from 'react';
import type { RawHomeCard, AdminUser } from '../types';
import { icons } from '../data/homeCards';
import GitHubPublishModal from '../components/GitHubPublishModal';
import type { GitHubSettings } from '../components/GitHubPublishModal';

interface AdminDashboardPageProps {
  currentGuides: RawHomeCard[];
  onCreateGuide: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onCreateComingSoonCard: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onUpdateCard: (updatedCard: RawHomeCard) => void;
  onDeleteCard: (cardId: string) => void;
  onReset: () => void;
  adminUsers: AdminUser[];
  onAddUser: (newUser: AdminUser) => void;
  onDeleteUser: (username: string) => void;
  onExportData: () => void;
  onImportData: (fileContent: string) => void;
  onPublishToGitHub: () => Promise<void>;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
    currentGuides, 
    onCreateGuide, 
    onCreateComingSoonCard,
    onUpdateCard,
    onDeleteCard,
    onReset, 
    adminUsers, 
    onAddUser, 
    onDeleteUser, 
    onExportData, 
    onImportData,
    onPublishToGitHub
}) => {
  // Create form state
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [color, setColor] = useState('bg-gray-800/80');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('bg-gray-500/50 text-white');
  const [isComingSoon, setIsComingSoon] = useState(false);

  // User management state
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // File import ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<RawHomeCard | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedTagName, setEditedTagName] = useState('');
  const [editedTagColor, setEditedTagColor] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  // GitHub Publish feature states
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [githubSettings, setGithubSettings] = useState<GitHubSettings>({ owner: '', repo: '', path: 'public/data.json', pat: '' });
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    try {
        const savedSettings = localStorage.getItem('githubPublishSettings');
        if (savedSettings) {
            setGithubSettings(JSON.parse(savedSettings));
        }
    } catch (e) {
        console.error("Could not parse GitHub settings from localStorage", e);
        localStorage.removeItem('githubPublishSettings');
    }
  }, []);

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
      icon: id,
      color,
      tag: tagName ? { name: tagName, color: tagColor } : undefined,
    };

    if (isComingSoon) {
        onCreateComingSoonCard(newCardData);
    } else {
        onCreateGuide(newCardData);
    }

    // Reset form
    setTitle('');
    setId('');
    setTagName('');
    setIsComingSoon(false);
  };

  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUsername = newUsername.trim().toLowerCase();
    if (!cleanedUsername || !newPassword) {
      alert('Username and password cannot be empty.');
      return;
    }
    if (adminUsers.some(user => user.username.toLowerCase() === cleanedUsername)) {
      alert('This username already exists.');
      return;
    }
    onAddUser({ username: cleanedUsername, password: newPassword });
    setNewUsername('');
    setNewPassword('');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        onImportData(content);
      } else {
        alert('Failed to read file content.');
      }
    };
    reader.onerror = () => alert('Error reading the file.');
    reader.readAsText(file);
    if (event.target) event.target.value = '';
  };

  const openEditModal = (card: RawHomeCard) => {
    setCardToEdit(card);
    setEditedTitle(card.title);
    setEditedColor(card.color);
    setEditedTagName(card.tag?.name || '');
    setEditedTagColor(card.tag?.color || 'bg-gray-500/50 text-white');
    setEditedStatus(card.status);
    setIsEditModalOpen(true);
  };

  const handleUpdateCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardToEdit) return;
    const updatedCard: RawHomeCard = {
        ...cardToEdit,
        title: editedTitle,
        color: editedColor,
        tag: editedTagName ? { name: editedTagName, color: editedTagColor } : undefined,
        status: editedStatus,
    };
    onUpdateCard(updatedCard);
    setIsEditModalOpen(false);
    setCardToEdit(null);
  };

  const handleDeleteClick = (card: RawHomeCard) => {
    if (window.confirm(`Are you sure you want to delete the card "${card.title}"? This will also delete its guide content and cannot be undone.`)) {
        onDeleteCard(card.id);
    }
  };

  const handleSaveGitHubSettings = (settings: GitHubSettings) => {
    setGithubSettings(settings);
    localStorage.setItem('githubPublishSettings', JSON.stringify(settings));
    setIsPublishModalOpen(false);
    alert('GitHub settings saved! You can now publish your data.');
  };

  const handlePublishClick = async () => {
    if (!githubSettings.pat || !githubSettings.owner || !githubSettings.repo) {
        alert('GitHub settings are not configured. Please set them up first.');
        setIsPublishModalOpen(true);
        return;
    }
    if (window.confirm('This will overwrite the file in your GitHub repository with the current data. Are you sure?')) {
        setIsPublishing(true);
        await onPublishToGitHub();
        setIsPublishing(false);
    }
  };


  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Manage home page cards, users, and data.</p>
        </div>
        <a href="#/home" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Home</a>
      </header>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="xl:col-span-2 space-y-8">
            {/* Create Guide Form */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold mb-4">Create New Card</h2>
              <form onSubmit={handleCreateGuideSubmit} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID (unique, no spaces)</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="e.g., react-basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
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
                <div className="flex items-center pt-2">
                    <input id="is-coming-soon" type="checkbox" checked={isComingSoon} onChange={e => setIsComingSoon(e.target.checked)} className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-sky-600 focus:ring-sky-500" />
                    <label htmlFor="is-coming-soon" className="ml-2 block text-sm text-slate-300">Create as 'Coming Soon'</label>
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105">
                Create Card
                </button>
              </form>
            </div>
            {/* Current Guides List */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Current Cards ({currentGuides.length})</h2>
                <ul className="space-y-3 max-h-96 overflow-y-auto">
                    {currentGuides.map(guide => (
                    <li key={guide.id} className="bg-slate-700/50 p-3 rounded-lg flex justify-between items-center gap-4">
                        <div className="flex flex-col flex-grow min-w-0">
                            <span className="font-medium truncate" title={guide.title}>{guide.title}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">ID: {guide.id}</span>
                                {guide.status === 'Coming Soon' && <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded-full">Coming Soon</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => openEditModal(guide)} className="text-sm bg-slate-600 hover:bg-slate-500 text-white font-bold py-1 px-3 rounded-md transition-colors">Edit Card</button>
                            <a 
                                href={`#/admin/edit/${guide.id}`} 
                                className={`text-sm bg-sky-600 hover:bg-sky-500 text-white font-bold py-1 px-3 rounded-md transition-colors ${guide.status === 'Coming Soon' ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={e => guide.status === 'Coming Soon' && e.preventDefault()}
                                aria-disabled={guide.status === 'Coming Soon'}
                                title={guide.status === 'Coming Soon' ? "Cannot edit content for a 'Coming Soon' card" : "Edit guide content"}
                            >
                                Edit Content
                            </a>
                            <button onClick={() => handleDeleteClick(guide)} className="text-sm bg-red-600/80 hover:bg-red-500 text-white font-bold py-1 px-3 rounded-md transition-colors">Delete</button>
                        </div>
                    </li>
                    ))}
                </ul>
            </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-8">
            {/* Actions Panel */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Data Management</h2>
                <p className="text-xs text-slate-400 mb-3 -mt-2">
                  Publish or Export creates a `data.json` file. Place this file in your project's public root to set the new default content.
                </p>
                <div className="space-y-3">
                    <button onClick={handlePublishClick} disabled={isPublishing} className="w-full text-center text-sm bg-gray-600 hover:bg-gray-500 disabled:bg-gray-700 disabled:cursor-wait text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path></svg>
                        {isPublishing ? 'Publishing...' : 'Publish to GitHub'}
                    </button>
                    <button onClick={() => setIsPublishModalOpen(true)} className="w-full text-center text-sm bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        GitHub Settings
                    </button>
                     <button onClick={onExportData} className="w-full text-center text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export All Data
                    </button>
                    <button onClick={handleImportClick} className="w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import Data
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
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
              <form onSubmit={handleAddUserSubmit} className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label htmlFor="new-username" className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                        <input id="new-username" type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="New username" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                    <div>
                        <label htmlFor="new-password"className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input id="new-password" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Set password" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                </div>
                <button type="submit" className="w-full text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Add User</button>
              </form>
              <ul className="space-y-2 max-h-48 overflow-y-auto mt-4">
                {adminUsers.map(user => (
                  <li key={user.username} className="bg-slate-700/50 p-2 rounded-lg flex justify-between items-center text-sm">
                    <span className="font-medium">{user.username}</span>
                    <button onClick={() => onDeleteUser(user.username)} className="text-xs bg-red-600/80 hover:bg-red-500 text-white font-bold py-0.5 px-2 rounded-md transition-colors">Delete</button>
                  </li>
                ))}
              </ul>
            </div>
        </div>
      </div>

      {isEditModalOpen && cardToEdit && (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setIsEditModalOpen(false)}
        >
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-6">Edit Card: <span className="text-cyan-400">{cardToEdit.title}</span></h3>
                <form onSubmit={handleUpdateCardSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Title</label>
                        <input type="text" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                        <input type="text" value={editedStatus} onChange={e => setEditedStatus(e.target.value)} placeholder="e.g., Explore the guide" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                         <p className="text-xs text-slate-400 mt-1">Use "Coming Soon" to make this a placeholder.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Card Color</label>
                            <input type="text" value={editedColor} onChange={e => setEditedColor(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tag Name</label>
                            <input type="text" value={editedTagName} onChange={e => setEditedTagName(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-1">Tag Color</label>
                            <input type="text" value={editedTagColor} onChange={e => setEditedTagColor(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                        </div>
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Cancel</button>
                        <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      <GitHubPublishModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSave={handleSaveGitHubSettings}
        initialSettings={githubSettings}
      />
    </div>
  );
};

export default AdminDashboardPage;