import React, { useState } from 'react';
import type { AdminUser } from '../types';

interface AdminLoginPageProps {
  onLogin: (success: boolean) => void;
  validUsers: AdminUser[];
}

const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLogin, validUsers }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedUsername = username.trim().toLowerCase();
    const userExists = validUsers.some(user => user.username.toLowerCase() === cleanedUsername);
    
    if (userExists && password === 'password') {
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
                placeholder="Enter admin username"
                autoCapitalize="none"
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
            
            <div className="text-center text-xs text-slate-500">
                <p>Hint: The valid usernames are ({validUsers.map(u=>u.username).join(', ')}) and the password is 'password'.</p>
            </div>

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