import React, { useState, useRef, useEffect } from 'react';
import type { RawHomeCard, AdminUser } from '../types';
import GitHubSyncModal from '../components/GitHubSyncModal';

interface AdminDashboardPageProps {
  currentGuides: RawHomeCard[];
  onCreateGuide: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onCreateComingSoonCard: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onUpdateCard: (updatedCard: RawHomeCard) => void;
  onDeleteCard: (cardId: string) => void;
  adminUsers: AdminUser[];
  onAddUser: (newUser: AdminUser) => void;
  onDeleteUser: (username: string) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ 
    currentGuides, 
    onCreateGuide, 
    onCreateComingSoonCard,
    onUpdateCard,
    onDeleteCard,
    adminUsers, 
    onAddUser, 
    onDeleteUser, 
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
  
  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cardToEdit, setCardToEdit] = useState<RawHomeCard | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedTagName, setEditedTagName] = useState('');
  const [editedTagColor, setEditedTagColor] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  // GitHub Sync State
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);


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

  const handlePublishToGitHub = async () => {
    if (!window.confirm('This will overwrite the data file in your GitHub repository. Are you sure you want to publish?')) {
      return;
    }

    setIsPublishing(true);

    const owner = localStorage.getItem('githubOwner');
    const repo = localStorage.getItem('githubRepo');
    const path = localStorage.getItem('githubPath');
    const token = localStorage.getItem('githubPAT');

    if (!owner || !repo || !path || !token) {
      alert('GitHub settings are incomplete. Please configure them first.');
      setIsPublishing(false);
      return;
    }

    try {
      // Fetch guideData from localStorage as it's not available in props.
      const guideData = JSON.parse(localStorage.getItem('guideData') || '{}');
      
      // Use currentGuides and adminUsers from props to ensure we publish what's currently in the state.
      const fullData = { homeCards: currentGuides, guideData, adminUsers };
      const content = btoa(unescape(encodeURIComponent(JSON.stringify(fullData, null, 2))));
      
      const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
      const headers = {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
      };
      
      let sha;
      const getResponse = await fetch(apiUrl, { headers, cache: 'no-cache' });

      if (getResponse.ok) {
        const fileData = await getResponse.json();
        sha = fileData.sha;
      } else if (getResponse.status !== 404) {
        const errorData = await getResponse.json();
        throw new Error(`Failed to fetch current file: ${errorData.message}`);
      }
      
      const body = {
        message: `Update data from admin panel [${new Date().toISOString()}]`,
        content,
        sha,
      };

      const putResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify(body),
      });
      
      if (!putResponse.ok) {
        const errorData = await putResponse.json();
        throw new Error(`GitHub API Error: ${errorData.message}`);
      }

      alert('Successfully published to GitHub!');

    } catch (error) {
      const errorMessage = (error as Error).message;
      alert(`Failed to publish: ${errorMessage}`);
      console.error('Publishing error:', error);
    } finally {
      setIsPublishing(false);
    }
  };


  return (
    <div className="h-full text-white p-4 sm:p-8 opacity-0 animate-fade-in will-change-transform-opacity overflow-y-auto">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400">Manage home page cards and admin users.</p>
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
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/\s/g, ''))} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                         <p className="text-xs text-slate-400 mt-1">Unique ID for the guide card and URL.</p>
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

            {/* GitHub Sync Section */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">Data Sync</h2>
                <div className="space-y-3">
                    <button 
                        onClick={() => setIsGithubModalOpen(true)}
                        className="w-full text-sm bg-slate-600 hover:bg-slate-500 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" /></svg>
                        GitHub Settings
                    </button>
                    <button 
                        onClick={handlePublishToGitHub}
                        disabled={isPublishing}
                        className="w-full text-sm bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait flex items-center justify-center gap-2"
                    >
                        {isPublishing ? (
                             <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        )}
                        {isPublishing ? 'Publishing...' : 'Publish to GitHub'}
                    </button>
                    <p className="text-xs text-slate-400 text-center">
                        Saves a `data.json` file to your repo. This can be used for backups or to load the guide from an external source.
                    </p>
                </div>
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

       <GitHubSyncModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
};

export default AdminDashboardPage;
