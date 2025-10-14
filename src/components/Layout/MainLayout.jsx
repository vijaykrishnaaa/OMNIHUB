import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import BottomNav from './BottomNav';

import HomePage from '../../modules/HomePage/HomePage';
import SearchModule from '../../modules/SearchModule/SearchModule';
import EntertainmentModule from '../../modules/EntertainmentModule/EntertainmentModule';
import ProfileModule from '../../modules/ProfileModule/ProfileModule';
import ContentModule from '../../modules/ContentModule/ContentModule';
import KnowledgeModule from '../../modules/KnowledgeModule/KnowledgeModule';
import ReviewsModule from '../../modules/ReviewsModule/ReviewsModule';
import WriteUpModule from '../../modules/WriteUpModule/WriteUpModule';
import CollectionsModal from '../../modules/CollectionsModule/CollectionsModal';
import EventsModule from '../../modules/EventsModule/EventsModule';
import RelatedLinksModule from '../../modules/RelatedLinksModule/RelatedLinksModule';

const MainLayout = () => {
  const [activeView, setActiveView] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollectionsModalOpen, setIsCollectionsModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeView) {
      case 'home': return <HomePage />;
      case 'search': return <SearchModule setActiveView={setActiveView} />;
      case 'videos':
      case 'books':
      case 'movies':
        return <EntertainmentModule activeCategory={activeView} />;
      case 'profile':
        return <ProfileModule />;
      case 'upload':
        return <ContentModule />;
      case 'knowledge': 
        return <KnowledgeModule />;
      case 'reviews':
        return <ReviewsModule />;
      case 'writeups': 
        return <WriteUpModule />;
      case 'events':
        return <EventsModule />;
      case 'related-links':
        return <RelatedLinksModule />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex">
        <Sidebar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onOpenCollectionsModal={() => setIsCollectionsModalOpen(true)}
        />
        <main className="flex-1 lg:ml-64">
          <div className="container mx-auto px-4 py-6">
            {renderContent()}
          </div>
        </main>
      </div>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
      {isCollectionsModalOpen && (
        <CollectionsModal 
            onClose={() => setIsCollectionsModalOpen(false)}
            onNavigate={setActiveView}
        />
      )}
    </div>
  );
};

export default MainLayout;