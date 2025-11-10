import React, { useState, useEffect } from 'react';
import { Play, Eye, Clock, User, Edit, Trash2, PlusSquare, CalendarPlus, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationSystem from '../../../components/Notifications/NotificationSystem';
import AddToCollectionModal from './AddToCollectionModal';
import ScheduleEventModal from './ScheduleEventModal';
import AddRelatedLinkModal from './AddRelatedLinkModal';
import { API_URL } from '../../../apiConfig';

const VideoSection = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => { fetchVideos(); }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/content/Video');
      const data = await response.json();
      setVideos(data);
    } catch (error) { console.error("Failed to fetch videos:", error); } 
    finally { setLoading(false); }
  };

  const handleDelete = async (videoId) => {
    if (window.confirm('Are you sure you want to delete this video?')) {
      try {
        await fetch(`http://localhost:5000/api/content/${videoId}`, { method: 'DELETE' });
        fetchVideos();
        setNotification({ type: 'success', message: 'Video deleted successfully.' });
      } catch (error) { 
        console.error("Failed to delete video:", error);
        setNotification({ type: 'error', message: 'Failed to delete video.' });
      }
    }
  };

  const handleEditClick = (video) => {
    setCurrentVideo(video);
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/content/${currentVideo._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentVideo),
      });
      if (!response.ok) throw new Error('Failed to update video');
      const updatedVideo = await response.json();
      setVideos(videos.map(video => (video._id === updatedVideo._id ? updatedVideo : video)));
      setIsEditing(false);
      setCurrentVideo(null);
      setNotification({ type: 'success', message: 'Video updated successfully.' });
    } catch (error) { 
        console.error("Failed to update video:", error);
        setNotification({ type: 'error', message: 'Failed to update video.' });
    }
  };
  
  const handleAddToCollection = async (contentId, collectionData) => {
    try {
        const response = await fetch('http://localhost:5000/api/collections/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...collectionData, contentId })
        });
        if (!response.ok) throw new Error('Failed to add to collection');
        setActiveModal(null);
        setNotification({ type: 'success', message: 'Added to collection!' });
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to add to collection.' });
    }
  };

  const handleScheduleEvent = async (contentId, eventData) => {
    try {
        const response = await fetch('http://localhost:5000/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...eventData, createdBy: user.id, relatedContent: contentId })
        });
        if (!response.ok) throw new Error('Failed to schedule event');
        setActiveModal(null);
        setNotification({ type: 'success', message: 'Event scheduled successfully!' });
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to schedule event.' });
    }
  };

  const handleAddRelatedLink = async (contentId, linkData) => {
    try {
        const response = await fetch('http://localhost:5000/api/related-links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...linkData, submittedBy: user.id, relatedContent: contentId })
        });
        if (!response.ok) throw new Error('Failed to submit link');
        setActiveModal(null);
        setNotification({ type: 'success', message: 'Link submitted successfully!' });
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to submit link.' });
    }
  };

  if (loading) return <p className="text-white p-6 text-center">Loading videos...</p>;

  return (
    <div className="space-y-6">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
      <h1 className="text-2xl font-bold text-white">Videos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div key={video._id} className="bg-gray-800 rounded-lg group">
            <div className="p-4">
                <a href={video.watchUrl || '#'} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="relative h-48 bg-gray-700 rounded-md overflow-hidden">
                        <img src={video.imageUrl} alt={video.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                            <Play className="w-12 h-12 text-white opacity-0 group-hover:opacity-100" />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded">{video.duration}</div>
                    </div>
                    <div className="pt-4">
                        <h3 className="text-white font-medium mb-2 line-clamp-2">{video.title}</h3>
                        <div className="flex items-center space-x-2 mb-2"><User className="w-4 h-4 text-gray-400" /><span className="text-gray-400 text-sm">{video.channel || 'OmniHub Creator'}</span></div>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                            <div className="flex items-center space-x-1"><Eye className="w-3 h-3" /><span>{video.views || '0'} views</span></div>
                            <div className="flex items-center space-x-1"><Clock className="w-3 h-3" /><span>{new Date(video.createdAt).toLocaleDateString()}</span></div>
                        </div>
                    </div>
                </a>
            </div>
            <div className="border-t border-gray-700 px-4 py-3 flex justify-end items-center gap-4">
                {user && (
                    <div className="flex items-center gap-4 text-gray-400">
                        <button onClick={() => { setSelectedContent(video); setActiveModal('collection'); }} className="flex items-center text-sm hover:text-white" title="Add to Collection"><PlusSquare size={18} /></button>
                        <button onClick={() => { setSelectedContent(video); setActiveModal('event'); }} className="flex items-center text-sm hover:text-white" title="Schedule Event"><CalendarPlus size={18} /></button>
                        <button onClick={() => { setSelectedContent(video); setActiveModal('link'); }} className="flex items-center text-sm hover:text-white" title="Add Related Link"><LinkIcon size={18} /></button>
                    </div>
                )}
                {user && user.id === video.uploadedBy?._id && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(video)} className="flex items-center text-xs px-3 py-1 bg-blue-600/50 hover:bg-blue-600/80 rounded"><Edit size={14} className="mr-1"/> Edit</button>
                        <button onClick={() => handleDelete(video._id)} className="flex items-center text-xs px-3 py-1 bg-red-600/50 hover:bg-red-600/80 rounded"><Trash2 size={14} className="mr-1"/> Delete</button>
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>

      {isEditing && currentVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-4">
            <h2 className="text-2xl font-bold text-white mb-6">Edit Video</h2>
            <form onSubmit={handleUpdate} className="space-y-3">
              <div><label className="text-sm text-gray-400">Title</label><input value={currentVideo.title || ''} onChange={(e) => setCurrentVideo({...currentVideo, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div><label className="text-sm text-gray-400">Channel</label><input value={currentVideo.channel || ''} onChange={(e) => setCurrentVideo({...currentVideo, channel: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div><label className="text-sm text-gray-400">Views</label><input value={currentVideo.views || ''} onChange={(e) => setCurrentVideo({...currentVideo, views: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div><label className="text-sm text-gray-400">Duration</label><input value={currentVideo.duration || ''} onChange={(e) => setCurrentVideo({...currentVideo, duration: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div><label className="text-sm text-gray-400">Image Thumbnail URL</label><input value={currentVideo.imageUrl || ''} onChange={(e) => setCurrentVideo({...currentVideo, imageUrl: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div><label className="text-sm text-gray-400">Watch URL</label><input value={currentVideo.watchUrl || ''} onChange={(e) => setCurrentVideo({...currentVideo, watchUrl: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
              <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-700 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-orange-500 rounded">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {selectedContent && activeModal === 'collection' && (
        <AddToCollectionModal 
            content={selectedContent}
            onClose={() => setActiveModal(null)}
            onSubmit={handleAddToCollection}
        />
        )}
        {selectedContent && activeModal === 'event' && (
            <ScheduleEventModal
                content={selectedContent}
                onClose={() => setActiveModal(null)}
                onSubmit={handleScheduleEvent}
            />
        )}
        {selectedContent && activeModal === 'link' && (
            <AddRelatedLinkModal
                content={selectedContent}
                onClose={() => setActiveModal(null)}
                onSubmit={handleAddRelatedLink}
            />
        )}
    </div>
  );
};

export default VideoSection;
