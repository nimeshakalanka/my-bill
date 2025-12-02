import React, { useState } from 'react';
import { Building2, AlertTriangle } from 'lucide-react';
import { APP_NAME } from '../constants.js';

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    if (username === 'admin' && password === 'Summit2025') {
      onLoginSuccess();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="flex items-center justify-center gap-3 mb-6">
          <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Logo" className="w-12 h-12" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{APP_NAME}</h1>
            <p className="text-gray-500">Billing System Login</p>
          </div>
        </div>
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Username" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Password" />
          </div>
          <button type="submit" className="w-full py-3 px-6 rounded-lg font-semibold text-white transition shadow-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;