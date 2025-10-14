import React from 'react';
import VideoSection from './components/VideoSection';
import BookSection from './components/BookSection';
import MovieSection from './components/MovieSection';

const EntertainmentModule = ({ activeCategory }) => {
  const renderSection = () => {
    switch (activeCategory) {
      case 'videos':
        return <VideoSection />;
      case 'books':
        return <BookSection />;
      case 'movies':
        return <MovieSection />;
      default:
        return <VideoSection />;
    }
  };

  return (
    <div className="pb-20 lg:pb-0">
      {renderSection()}
    </div>
  );
};

export default EntertainmentModule;