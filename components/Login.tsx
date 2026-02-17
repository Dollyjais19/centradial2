
import React, { useState } from 'react';
import { HARDCODED_USERS } from '../constants';

interface LoginProps {
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = HARDCODED_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(username);
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-aura-sage fade-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-aura-green rounded-full flex items-center justify-center mx-auto mb-4">
             <span className="text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-2xl font-semibold text-aura-green">CentraDial</h1>
          <p className="text-gray-500 mt-2 italic font-light">Calm Protection for Your Digital Life</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-aura-sage focus:ring-2 focus:ring-aura-green outline-none transition-all"
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-aura-sage focus:ring-2 focus:ring-aura-green outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button 
            type="submit"
            className="w-full bg-aura-green text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity mt-2 shadow-sm"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
