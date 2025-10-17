import React, { useState, useRef, useEffect } from 'react';
import type { RawHomeCard, AdminUser } from '../types';
import { icons } from '../data/homeCards';

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
  const [iconId, setIconId] = useState('');
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
  const [editedIcon, setEditedIcon] = useState('');
  const [editedColor, setEditedColor] = useState('');
  const [editedTagName, setEditedTagName] = useState('');
  const [editedTagColor, setEditedTagColor] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  // Effect to sync iconId with id for convenience
  useEffect(() => {
    setIconId(id);
  }, [id]);

  const availableIcons = Object.keys(icons).join(', ');


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
      icon: iconId,
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
    setIconId('');
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
    setEditedIcon(card.icon || card.id);
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
        icon: editedIcon,
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
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., React Basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">ID (unique, no spaces)</label>
                        <input type="text" value={id} onChange={e => setId(e.target.value.toLowerCase().replace(/\s/g, ''))} placeholder="e.g., react-basics" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Icon ID</label>
                    <input type="text" value={iconId} onChange={e => setIconId(e.target.value)} placeholder="e.g., soc" className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    <p className="text-xs text-slate-400 mt-1 truncate">Available: {availableIcons}</p>
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
                        <label className="block text-sm font-medium text-slate-300 mb-1">Icon ID</label>
                        <input type="text" value={editedIcon} onChange={e => setEditedIcon(e.target.value)} className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white" />
                        <p className="text-xs text-slate-400 mt-1 truncate">Available: {availableIcons}</p>
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
    </div>
  );
};

export default AdminDashboardPage;
