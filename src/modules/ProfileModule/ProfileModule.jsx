import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProfileHeader from './components/ProfileHeader';
import EditProfileModal from './components/EditProfileModal';
import ContentStatsChart from './components/ContentStatsChart';
import { BarChart2 } from 'lucide-react';

const ProfileModule = () => {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentStats, setContentStats] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const apiCalls = [fetch(`http://localhost:5000/api/users/${user.id}`)];
          if (user.role === 'Creator') {
            apiCalls.push(fetch(`http://localhost:5000/api/users/${user.id}/content-stats`));
          }

          const responses = await Promise.all(apiCalls);
          const profile = await responses[0].json();
          setProfileData(profile);

          if (responses.length > 1) {
            const statsData = await responses[1].json();
            setContentStats(statsData);
          }

        } catch (error) { 
          console.error("Failed to fetch profile data:", error); 
        } finally { 
          setLoading(false); 
        }
      } else {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);
 
  const handleEditProfile = async () => { 
    const { fullName, bio, location, website } = profileData;
    const updates = { fullName, bio, location, website };

    try {
        const response = await fetch(`http://localhost:5000/api/users/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });

        if (!response.ok) {
            throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        login(updatedUser); 
        setProfileData(updatedUser); 
        setIsEditing(false);
    } catch (error) { 
        console.error("Failed to update profile:", error); 
        alert("There was an error saving your profile. Please try again.");
    }
  };

  if (loading || !profileData) return <p className="text-white p-6 text-center">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      <ProfileHeader user={user} profileData={profileData} onEditClick={() => setIsEditing(true)} />
      {user?.role === 'Creator' && (
        <div className="mt-8">
          <div className="flex items-center mb-4">
              <BarChart2 className="w-6 h-6 mr-3 text-orange-500"/>
              <h2 className="text-2xl font-bold text-white">Content Analytics</h2>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
              <ContentStatsChart stats={contentStats} />
          </div>
        </div>
      )}

      {isEditing && ( <EditProfileModal onClose={() => setIsEditing(false)} profileData={profileData} setProfileData={setProfileData} onSave={handleEditProfile} /> )}
    </div>
  );
};

export default ProfileModule;