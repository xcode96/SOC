import React, { useState, useEffect } from 'react';

interface GitHubSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GitHubSyncModal: React.FC<GitHubSyncModalProps> = ({ isOpen, onClose }) => {
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [path, setPath] = useState('');
  const [pat, setPat] = useState('');
  const [saveButtonText, setSaveButtonText] = useState('Save Settings');

  useEffect(() => {
    if (isOpen) {
      setOwner(localStorage.getItem('githubOwner') || '');
      setRepo(localStorage.getItem('githubRepo') || '');
      setPath(localStorage.getItem('githubPath') || 'public/data.json');
      setPat(localStorage.getItem('githubPAT') || '');
      setSaveButtonText('Save Settings');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('githubOwner', owner);
    localStorage.setItem('githubRepo', repo);
    localStorage.setItem('githubPath', path);
    localStorage.setItem('githubPAT', pat);
    setSaveButtonText('Saved!');
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-settings-title"
    >
      <div
        className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
            <h3 id="github-settings-title" className="text-xl font-bold text-white">
                GitHub Publish Settings
            </h3>
            <button
                onClick={onClose}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Close settings"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="repo-owner" className="block text-sm font-medium text-slate-300 mb-1">
              Repository Owner
            </label>
            <input
              id="repo-owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., xcode96"
              required
            />
          </div>
          <div>
            <label htmlFor="repo-name" className="block text-sm font-medium text-slate-300 mb-1">
              Repository Name
            </label>
            <input
              id="repo-name"
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., testings"
              required
            />
          </div>
          <div>
            <label htmlFor="file-path" className="block text-sm font-medium text-slate-300 mb-1">
              File Path in Repo
            </label>
            <input
              id="file-path"
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              placeholder="e.g., public/data.json"
              required
            />
          </div>
          <div>
            <label htmlFor="pat" className="block text-sm font-medium text-slate-300 mb-1">
              Personal Access Token (PAT)
            </label>
            <input
              id="pat"
              type="password"
              value={pat}
              onChange={(e) => setPat(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
             <p className="text-xs text-slate-400 mt-2">
                Requires a Classic token with 'repo' scope. Stored in browser local storage.
            </p>
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500"
            >
              {saveButtonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GitHubSyncModal;
