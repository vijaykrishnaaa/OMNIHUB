import React from 'react';
import { Home, Search, User } from 'lucide-react';

const BottomNav = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700">
      <div className="flex justify-around items-center py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                activeView === item.id ? 'text-orange-500' : 'text-gray-400'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;