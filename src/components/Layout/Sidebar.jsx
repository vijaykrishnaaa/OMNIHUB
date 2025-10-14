import React from 'react';
import { Home, Search, Play, BookOpen, Film, User, Upload, Book, X, Star, FileText, FolderKanban, Calendar, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import OmniHubLogo from '../../assets/my-logo.png';

const Sidebar = ({ activeView, setActiveView, isOpen, onClose, onOpenCollectionsModal }) => {
  const { user } = useAuth();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
  ];
 
  const contentItems = [
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'books', label: 'Books', icon: BookOpen },
    { id: 'movies', label: 'Movies', icon: Film },
    ...(user?.role === 'Creator' ? [{ id: 'upload', label: 'Upload Content', icon: Upload }] : []),
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'writeups', label: 'Write-Ups', icon: FileText },
    { id: 'collections', label: 'My Collections', icon: FolderKanban, action: onOpenCollectionsModal },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'related-links', label: 'Related Links', icon: LinkIcon },
  ];

  const adminItems = [
    { id: 'knowledge', label: 'Knowledge Manager', icon: Book },
  ];

  const profileItem = [
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleItemClick = (item) => {
    if (item.action) {
        item.action();
    } else {
        setActiveView(item.id);
    }
    onClose();
  };
 
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose}></div>}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8">
              <img src={OmniHubLogo} alt="OmniHub Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-xl font-bold text-white">OmniHub</h1>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-orange-500"><X className="w-5 h-5" /></button>
        </div>
        <nav className="mt-6 overflow-y-auto h-[calc(100%-140px)]">
          {menuItems.map(item => <NavItem key={item.id} item={item} activeView={activeView} onClick={() => handleItemClick(item)} />)}
          {contentItems.map(item => <NavItem key={item.id} item={item} activeView={activeView} onClick={() => handleItemClick(item)} />)}
          
          {user?.role === 'Creator' && (
            adminItems.map(item => <NavItem key={item.id} item={item} activeView={activeView} onClick={() => handleItemClick(item)} />)
          )}

          {profileItem.map(item => <NavItem key={item.id} item={item} activeView={activeView} onClick={() => handleItemClick(item)} />)}
        </nav>
        <div className="absolute bottom-4 left-4 right-4"><div className="bg-gray-700 rounded-lg p-3"><div className="flex items-center space-x-3"><div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center"><span className="text-sm font-medium text-white">{user?.username?.charAt(0).toUpperCase()}</span></div><div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{user?.username}</p><p className="text-xs text-gray-400">{user?.role}</p></div></div></div></div>
      </aside>
    </>
  );
};

const NavItem = ({ item, activeView, onClick }) => {
  const Icon = item.icon;
  return (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-gray-700 transition-colors ${activeView === item.id ? 'bg-gray-700 border-r-2 border-orange-500 text-orange-500' : 'text-gray-300'}`}>
      <Icon className="w-5 h-5" />
      <span>{item.label}</span>
    </button>
  );
};

export default Sidebar;