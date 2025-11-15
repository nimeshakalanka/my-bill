import React from 'react';
import { Building2, Receipt, LogOut } from 'lucide-react';
import { APP_NAME } from '../constants.js';

const Header = ({ showHistory, setShowHistory, resetForm, handleLogout }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-6 md:p-8 mb-6 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Building2 className="w-12 h-12 md:w-16 md:h-16" />
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{APP_NAME}</h1>
            <p className="text-blue-100 mt-1">Professional Billing System</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <button onClick={() => { setShowHistory(!showHistory); if (!showHistory) resetForm(); }} className="bg-white text-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center gap-2">
            <Receipt className="w-5 h-5" />
            {showHistory ? 'New Bill' : 'View History'}
          </button>
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