import React, { useState } from 'react';

interface AdminLoginPageProps {
  onLogin: (success: boolean) => void;
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Updated to handle multiple admin users
    const validUsernames = ['admin', 'dq.adm'];
    if (validUsernames.includes(username) && password === 'password') {
      setError('');
      onLogin(true);
    } else {
      setError('Invalid username or password');
      onLogin(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center p-4 opacity-0 animate-fade-in will-change-transform-opacity">
      <div className="w-full max-w-md">
        <div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-center text-white mb-2">Admin Login</h1>
          <p className="text-center text-slate-400 mb-8">Access the admin dashboard.</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                placeholder="admin or dq.adm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
                placeholder="password"
              />
            </div>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-sky-500 to-fuchsia-500 text-white font-bold py-2.5 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-all transform hover:scale-105"
            >
              Login
            </button>
          </form>

           <div className="text-center mt-6">
            <a href="#/home" className="text-sm text-sky-400 hover:text-sky-300 transition-colors">← Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;