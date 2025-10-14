
import React, { useState, useEffect } from 'react';

export interface GitHubSettings {
  owner: string;
  repo: string;
  path: string;
  pat: string;
}

interface GitHubPublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: GitHubSettings) => void;
  initialSettings: GitHubSettings;
}

const GitHubPublishModal: React.FC<GitHubPublishModalProps> = ({ isOpen, onClose, onSave, initialSettings }) => {
  const [settings, setSettings] = useState<GitHubSettings>(initialSettings);

  useEffect(() => {
    // Sync state if initialSettings change while modal is open (or on first open)
    setSettings(initialSettings);
  }, [initialSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value.trim() }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(settings);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="github-settings-title"
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h2 id="github-settings-title" className="text-lg font-bold">
            GitHub Publish Settings
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 transition-colors" aria-label="Close modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="owner" className="block text-sm font-medium text-slate-700 mb-1">
                Repository Owner
              </label>
              <input
                id="owner"
                name="owner"
                type="text"
                value={settings.owner}
                onChange={handleChange}
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g., xcode96"
                required
              />
            </div>

            <div>
              <label htmlFor="repo" className="block text-sm font-medium text-slate-700 mb-1">
                Repository Name
              </label>
              <input
                id="repo"
                name="repo"
                type="text"
                value={settings.repo}
                onChange={handleChange}
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g., Clitools"
                required
              />
            </div>

            <div>
              <label htmlFor="path" className="block text-sm font-medium text-slate-700 mb-1">
                File Path in Repo
              </label>
              <input
                id="path"
                name="path"
                type="text"
                value={settings.path}
                onChange={handleChange}
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="e.g., public/data.json"
                required
              />
            </div>

            <div>
              <label htmlFor="pat" className="block text-sm font-medium text-slate-700 mb-1">
                Personal Access Token (PAT)
              </label>
              <input
                id="pat"
                name="pat"
                type="password"
                value={settings.pat}
                onChange={handleChange}
                className="w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                placeholder="••••••••••••••••••••••"
                required
              />
               <p className="text-xs text-slate-500 mt-2">
                Requires a Classic token with 'repo' scope. Stored in browser local storage.
              </p>
            </div>
          </div>

          <footer className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-xl text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors text-sm"
            >
              Save Settings
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default GitHubPublishModal;
