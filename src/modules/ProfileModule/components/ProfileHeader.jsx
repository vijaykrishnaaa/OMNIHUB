import React from 'react';
import { Edit3, Link, MapPin } from 'lucide-react';

const ProfileHeader = ({ user, profileData, onEditClick }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        <div className="relative">
          <div className="w-32 h-32 bg-gray-600 rounded-full flex items-center justify-center overflow-hidden">
            <span className="text-4xl font-bold text-white">{profileData.username?.charAt(0).toUpperCase()}</span>
          </div>
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-4 mb-2">
            <h1 className="text-3xl font-bold text-white">{profileData.fullName || profileData.username}</h1>
            <button onClick={onEditClick} className="flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg">
              <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
            </button>
          </div>
          <p className="text-gray-400 mb-3">@{profileData.username}</p>
          <p className="text-gray-300 mb-4">{profileData.bio}</p>

          <div className="flex justify-center md:justify-start items-center flex-wrap gap-x-4 gap-y-2 text-gray-400">
            {profileData.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={16}/>
                <span>{profileData.location}</span>
              </div>
            )}
            {profileData.website && (
              <a href={profileData.website} target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 flex items-center space-x-1">
                <Link size={16}/>
                <span>Website</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;