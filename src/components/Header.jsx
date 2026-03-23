import React from 'react';
import { Receipt, LogOut, ArrowLeft } from 'lucide-react';
import { APP_NAME } from '../constants.js';

const Header = ({ showHistory, setShowHistory, resetForm, handleLogout, onGoHome, theme = 'blue' }) => {
  const gradientClass = theme === 'green'
    ? 'bg-gradient-to-r from-green-600 to-emerald-700'
    : 'bg-gradient-to-r from-blue-600 to-indigo-700';
  const historyBtnClass = theme === 'green'
    ? 'bg-white text-green-700 hover:bg-green-50'
    : 'bg-white text-blue-600 hover:bg-blue-50';
  const subTextClass = theme === 'green' ? 'text-green-100' : 'text-blue-100';
  return (
    <div className={`${gradientClass} rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white`}>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <img src="https://res.cloudinary.com/dluwvqdaz/image/upload/v1763126831/logo_fatuqr.png" alt="Logo" className="w-20 h-20" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{APP_NAME}</h1>
            <p className={`${subTextClass} mt-1`}>{theme === 'green' ? 'Restaurant Billing System' : 'Professional Billing System'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => { setShowHistory(!showHistory); if (!showHistory) resetForm(); }} className={`${historyBtnClass} px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold transition flex items-center gap-2`}>
            <Receipt className="w-5 h-5" />
            {showHistory ? 'New Bill' : 'View History'}
          </button>
          {onGoHome && (
            <button onClick={onGoHome} className="bg-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-white/30 transition flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Home
            </button>
          )}
          <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
