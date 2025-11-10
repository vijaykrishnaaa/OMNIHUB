import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import WriteUpModal from './components/WriteUpModal';
import WriteUpStatsChart from './components/WriteUpStatsChart';
import ShareModal from './components/ShareModal';
import SuggestEditModal from './components/SuggestEditModal';
import RateWriteUpModal from './components/RateWriteUpModal';
import NotificationSystem from '../../components/Notifications/NotificationSystem';
import { Edit, Trash2, FileText, Share2, Pencil, Star } from 'lucide-react';
import { API_URL } from '../../../apiConfig';

const WriteUpModule = () => {
  const { user } = useAuth();
  const [writeUps, setWriteUps] = useState([]);
  const [writeUpStats, setWriteUpStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWriteUpModalOpen, setIsWriteUpModalOpen] = useState(false);
  const [editingWriteUp, setEditingWriteUp] = useState(null);
  const [sharingWriteUp, setSharingWriteUp] = useState(null);
  const [suggestingEditOn, setSuggestingEditOn] = useState(null);
  const [ratingWriteUp, setRatingWriteUp] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [writeUpsRes, statsRes] = await Promise.all([
          fetch('http://localhost:5000/api/writeups'),
          fetch('http://localhost:5000/api/writeups/stats')
      ]);
      const writeUpsData = await writeUpsRes.json();
      const statsData = await statsRes.json();
      setWriteUps(writeUpsData);
      setWriteUpStats(statsData);
    } catch (error) {
      console.error("Failed to fetch write-ups data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveWriteUp = async (formData) => {
    const isEditing = !!editingWriteUp;
    const url = isEditing ? `http://localhost:5000/api/writeups/${editingWriteUp._id}` : 'http://localhost:5000/api/writeups';
    const method = isEditing ? 'PUT' : 'POST';
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, author: user.id }),
      });
      if (!response.ok) throw new Error('Failed to save write-up');
      setIsWriteUpModalOpen(false);
      setEditingWriteUp(null);
      fetchData();
      setNotification({ type: 'success', message: `Write-up ${isEditing ? 'updated' : 'created'} successfully!` });
    } catch (error) { 
        console.error('Save Error:', error); 
        setNotification({ type: 'error', message: 'Failed to save write-up.' });
    }
  };

  const handleDeleteWriteUp = async (writeUpId) => {
    if (window.confirm('Are you sure you want to delete this write-up?')) {
      try {
        await fetch(`http://localhost:5000/api/writeups/${writeUpId}`, { 
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author: user.id })
        });
        fetchData();
        setNotification({ type: 'success', message: 'Write-up deleted.' });
      } catch (error) { console.error('Delete Error:', error); }
    }
  };

  const handleShareSubmit = async (writeUpId, shareData) => {
    try {
        const response = await fetch('http://localhost:5000/api/shares', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...shareData, sharedBy: user.id, writeUpId })
        });
        if (!response.ok) throw new Error('Failed to share');
        setSharingWriteUp(null);
        setNotification({ type: 'success', message: 'Write-up shared successfully!' });
    } catch(error) {
        setNotification({ type: 'error', message: 'Failed to share write-up.' });
    }
  };

  const handleSuggestEditSubmit = async (writeUpId, suggestionText) => {
    try {
        const response = await fetch('http://localhost:5000/api/edit-suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ suggestionText, suggestedBy: user.id, writeUpId })
        });
        if (!response.ok) throw new Error('Failed to submit suggestion');
        setSuggestingEditOn(null);
        setNotification({ type: 'success', message: 'Suggestion submitted successfully!' });
    } catch(error) {
        setNotification({ type: 'error', message: 'Failed to submit suggestion.' });
    }
  };

  const handleRatingSubmit = async (writeUpId, ratingData) => {
    try {
        const response = await fetch('http://localhost:5000/api/writeup-ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...ratingData, authorId: user.id, writeUpId })
        });
        if (!response.ok) throw new Error('Failed to submit rating');
        setRatingWriteUp(null);
        setNotification({ type: 'success', message: 'Thank you for your rating!' });
    } catch(error) {
        setNotification({ type: 'error', message: 'Failed to submit rating.' });
    }
  };

  const handleEditWriteUpClick = (writeUp) => {
    setEditingWriteUp(writeUp);
    setIsWriteUpModalOpen(true);
  };
  
  if (loading) return <p className="text-white p-6 text-center">Loading write-ups...</p>;

  return (
    <div className="max-w-4xl mx-auto pb-20 lg-pb-0">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Community Write-Ups</h1>
        {user && (
            <button onClick={() => { setEditingWriteUp(null); setIsWriteUpModalOpen(true); }} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded flex items-center">
            <FileText size={16} className="mr-2"/> New Write-Up
            </button>
        )}
      </div>
      <div className="space-y-4">
        {writeUps.length > 0 ? writeUps.map(writeUp => (
          <div key={writeUp._id} className="bg-gray-800 p-4 rounded-lg">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold">{writeUp.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">
                        by {writeUp.author?.username || 'Unknown Author'} in <span className="font-semibold">{writeUp.category}</span>
                    </p>
                </div>
                {user && writeUp.author && user.id === writeUp.author._id && (
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEditWriteUpClick(writeUp)} className="p-1 text-blue-400 hover:text-blue-300"><Edit size={16}/></button>
                        <button onClick={() => handleDeleteWriteUp(writeUp._id)} className="p-1 text-red-400 hover:text-red-300"><Trash2 size={16}/></button>
                    </div>
                )}
            </div>
            <p className="text-gray-300 my-4">{writeUp.content}</p>
            <div className="flex justify-end items-center space-x-4 border-t border-gray-700 pt-2">
                 {user && (
                    <>
                        <button onClick={() => setRatingWriteUp(writeUp)} className="flex items-center text-sm text-gray-400 hover:text-white">
                            <Star size={16} className="mr-2" /> Rate
                        </button>
                        <button onClick={() => setSharingWriteUp(writeUp)} className="flex items-center text-sm text-gray-400 hover:text-white">
                            <Share2 size={16} className="mr-2" /> Share
                        </button>
                         {writeUp.author && user.id !== writeUp.author._id && (
                            <button onClick={() => setSuggestingEditOn(writeUp)} className="flex items-center text-sm text-gray-400 hover:text-white">
                                <Pencil size={16} className="mr-2" /> Suggest Edit
                            </button>
                        )}
                    </>
                 )}
            </div>
          </div>
        )) : <p className="text-gray-500 text-center py-8">No write-ups have been posted yet. Be the first!</p>}
      </div>
      <div className="bg-gray-800 p-6 rounded-lg mt-8">
        <WriteUpStatsChart stats={writeUpStats} />
      </div>
      {isWriteUpModalOpen && ( <WriteUpModal onClose={() => setIsWriteUpModalOpen(false)} onSave={handleSaveWriteUp} editingWriteUp={editingWriteUp} /> )}
      {sharingWriteUp && ( <ShareModal writeUp={sharingWriteUp} onClose={() => setSharingWriteUp(null)} onSubmit={handleShareSubmit} /> )}
      {suggestingEditOn && ( <SuggestEditModal writeUp={suggestingEditOn} onClose={() => setSuggestingEditOn(null)} onSubmit={handleSuggestEditSubmit} /> )}
      {ratingWriteUp && ( <RateWriteUpModal writeUp={ratingWriteUp} onClose={() => setRatingWriteUp(null)} onSubmit={handleRatingSubmit} /> )}
    </div>
  );
};

export default WriteUpModule;
