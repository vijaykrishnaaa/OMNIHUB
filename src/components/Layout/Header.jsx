import React from 'react';
import { Menu, LogOut } from 'lucide-react'; 
import { useAuth } from '../../contexts/AuthContext';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 lg:pl-68">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden text-gray-400 hover:text-orange-500 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden lg:flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-700 border border-orange-500 rounded flex items-center justify-center">
              <span className="text-orange-500 text-xs font-bold">OH</span>
            </div>
            <h1 className="text-xl font-bold text-white">OmniHub</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {user?.username?.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="hidden sm:block text-sm text-gray-300">
              {user?.username}
            </span>
          </div>
          
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;