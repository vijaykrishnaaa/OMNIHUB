import React from 'react';

const EditProfileModal = ({ onClose, profileData, setProfileData, onSave }) => {

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-4">
        <h2 className="text-2xl font-bold text-white mb-6">Edit Profile</h2>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          <div><label className="block text-sm text-gray-400 mb-1">Full Name</label><input type="text" value={profileData.fullName || ''} onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })} className="w-full bg-gray-700 p-2 rounded" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Username</label><input type="text" value={profileData.username || ''} onChange={(e) => setProfileData({ ...profileData, username: e.target.value })} className="w-full bg-gray-700 p-2 rounded" disabled /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Bio</label><textarea value={profileData.bio || ''} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} rows={3} className="w-full bg-gray-700 p-2 rounded" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Location</label><input type="text" value={profileData.location || ''} onChange={(e) => setProfileData({ ...profileData, location: e.target.value })} className="w-full bg-gray-700 p-2 rounded" /></div>
          <div><label className="block text-sm text-gray-400 mb-1">Website</label><input type="text" value={profileData.website || ''} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} className="w-full bg-gray-700 p-2 rounded" /></div>
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg">Cancel</button>
          <button onClick={onSave} className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
};
export default EditProfileModal;