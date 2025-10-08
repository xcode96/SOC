import React, { useState, useRef } from 'react';
import { ContentType } from '../types';
import type { RawHomeCard, AdminUser, GuideImportData } from '../types';

interface AdminDashboardPageProps {
  currentGuides: RawHomeCard[];
  onCreateGuide: (newCardData: Omit<RawHomeCard, 'status' | 'href'>) => void;
  onReset: () => void;
  adminUsers: AdminUser[];
  onAddUser: (newUser: AdminUser) => void;
  onDeleteUser: (username: string) => void;
  onExportData: () => void;
  onImportData: (fileContent: string) => void;
  onImportGuideFromUrl: (data: GuideImportData) => void;
}

const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentGuides, onCreateGuide, onReset, adminUsers, onAddUser, onDeleteUser, onExportData, onImportData, onImportGuideFromUrl }) => {
  const [title, setTitle] = useState('');
  const [id, setId] = useState('');
  const [color, setColor] = useState('bg-gray-800/80');
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState('bg-gray-500/50 text-white');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const guideFileInputRef = useRef<HTMLInputElement>(null);
  const [importUrl, setImportUrl] = useState('');
  const [isImporting, setIsImporting] = useState(false);

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
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        onImportData(content);
      } else {
        alert('Failed to read file content.');
      }
    };
    reader.onerror = () => {
      alert('Error reading the file.');
    };
    reader.readAsText(file);

    // Reset the file input value so the same file can be selected again
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleImportFromUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl) {
      alert('Please provide a URL.');
      return;
    }
    
    setIsImporting(true);
    try {
      const url = new URL(importUrl);
       if (!url.protocol.startsWith('http')) {
        throw new Error('Invalid URL protocol.');
      }

      const response = await fetch(importUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch from URL. Status: ${response.status}`);
      }
      
      const data = await response.json();
      
      onImportGuideFromUrl(data);
      setImportUrl('');

    } catch (error) {
      console.error('Import from URL failed:', error);
      alert(`Error importing guide: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
    }
  };
  
  const handleImportGuideFileClick = () => {
    guideFileInputRef.current?.click();
  };

  const handleGuideFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        try {
          const data = JSON.parse(content);
          onImportGuideFromUrl(data);
        } catch (error) {
          console.error('Import from file failed:', error);
          alert(`Error importing guide from file: ${error instanceof Error ? error.message : 'Invalid JSON format'}`);
        }
      } else {
        alert('Failed to read file content.');
      }
    };
    reader.onerror = () => {
      alert('Error reading the file.');
    };
    reader.readAsText(file);

    // Reset the file input value
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleDownloadTemplate = () => {
    const templateData: GuideImportData = {
      homeCard: {
        id: "my-new-guide",
        title: "My New Guide",
        color: "bg-purple-800/80",
        tag: {
          name: "Custom",
          color: "bg-purple-500/50 text-white",
        },
      },
      guideData: {
        title: "My New Guide Interactive Guide",
        topics: [
          {
            id: "introduction",
            title: "Introduction",
            content: [
              {
                type: ContentType.HEADING2,
                text: "Welcome to My New Guide",
              },
              {
                type: ContentType.PARAGRAPH,
                text: "This is the first topic. After importing, you can add more complex content like lists, colored text, and tables using the guide editor.",
              },
            ],
          },
        ],
      },
    };
    const dataStr = JSON.stringify(templateData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guide-template.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
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
             {/* Import External Guide */}
            <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Import External Guide</h2>
                <button
                  onClick={handleDownloadTemplate}
                  className="text-xs text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5"
                  type="button"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download Template</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Use the template to create a guide. You can then import it from a public URL (like a GitHub Gist) or upload it directly from your computer.
              </p>
              
              <form onSubmit={handleImportFromUrlSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="import-url" className="block text-sm font-medium text-slate-300 mb-1">Import from Raw URL</label>
                    <input 
                      id="import-url"
                      type="url" 
                      value={importUrl} 
                      onChange={e => setImportUrl(e.target.value)} 
                      placeholder="https://gist.githubusercontent.com/.../guide.json" 
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isImporting || !importUrl}
                >
                  {isImporting ? (
                    <>
                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Importing...
                    </>
                  ) : (
                    'Import from URL'
                  )}
                </button>
              </form>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-600"></div></div>
                <div className="relative flex justify-center"><span className="bg-slate-800/60 px-2 text-sm text-slate-400">OR</span></div>
              </div>

              <div>
                <label htmlFor="import-file-button" className="block text-sm font-medium text-slate-300 mb-1">Import from Local File</label>
                <button 
                  id="import-file-button"
                  onClick={handleImportGuideFileClick}
                  type="button"
                  className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center gap-2"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Guide File
                </button>
                <input
                  type="file"
                  ref={guideFileInputRef}
                  onChange={handleGuideFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>

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
                    <button onClick={handleImportClick} className="w-full text-center text-sm bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-3 rounded-md transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Import Data
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept=".json"
                        className="hidden"
                    />
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
                        <input
                          id="new-username"
                          type="text"
                          value={newUsername}
                          onChange={(e) => setNewUsername(e.target.value)}
                          placeholder="New username"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                    </div>
                    <div>
                        <label htmlFor="new-password"className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                        <input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Set password"
                          className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                          required
                        />
                    </div>
                </div>
                <button type="submit" className="w-full text-sm bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                  Add User
                </button>
              </form>
              <ul className="space-y-2 max-h-48 overflow-y-auto mt-4">
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