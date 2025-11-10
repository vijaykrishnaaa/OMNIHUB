import React, { useState, useEffect } from 'react';
import { Film, Star, Clock, Calendar, Play, ExternalLink, Edit, Trash2, PlusSquare, CalendarPlus, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationSystem from '../../../components/Notifications/NotificationSystem';
import AddToCollectionModal from './AddToCollectionModal';
import ScheduleEventModal from './ScheduleEventModal';
import AddRelatedLinkModal from './AddRelatedLinkModal';
import { API_URL } from '../../../apiConfig';

const MovieSection = () => {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/content/Movie');
      const data = await response.json();
      setMovies(data);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDelete = async (movieId) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await fetch(`http://localhost:5000/api/content/${movieId}`, { method: 'DELETE' });
        fetchMovies();
        setNotification({ type: 'success', message: 'Movie deleted successfully.' });
      } catch (error) {
        console.error("Failed to delete movie:", error);
        setNotification({ type: 'error', message: 'Failed to delete movie.' });
      }
    }
  };
  
  const handleEditClick = (movie) => {
    setCurrentMovie({ ...movie, cast: Array.isArray(movie.cast) ? movie.cast.join(', ') : '' });
    setIsEditing(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/content/${currentMovie._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentMovie,
          cast: currentMovie.cast.split(',').map(a => a.trim()),
        }),
      });
      if (!response.ok) throw new Error('Failed to update movie');
      const updatedMovie = await response.json();
      setMovies(movies.map(movie => (movie._id === updatedMovie._id ? updatedMovie : movie)));
      setIsEditing(false);
      setCurrentMovie(null);
      setNotification({ type: 'success', message: 'Movie updated successfully.' });
    } catch (error) {
      console.error("Failed to update movie:", error);
      setNotification({ type: 'error', message: 'Failed to update movie.' });
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

  if (loading) return <p className="text-white p-6 text-center">Loading movies...</p>;

  return (
    <div className="space-y-6">
        <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
        <h1 className="text-2xl font-bold text-white">Movies</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {movies.map((movie) => (
            <div key={movie._id} className="bg-gray-800 rounded-lg p-6 flex flex-col">
                <div className="flex space-x-6 flex-grow">
                    <div className="flex-shrink-0 w-24">
                        <img src={movie.imageUrl} alt={movie.title} className="w-24 h-36 object-cover rounded shadow-lg" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-white font-bold text-xl">{movie.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">Directed by {movie.author_director}</p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400 mb-3">
                        <div className="flex items-center space-x-1"><Star className="w-4 h-4 text-yellow-400" /><span className="text-orange-500 font-medium">{movie.rating || 'N/A'}</span></div>
                        <div className="flex items-center space-x-1"><Clock className="w-4 h-4" /><span>{movie.duration || 'N/A'}</span></div>
                        <div className="flex items-center space-x-1"><Calendar className="w-4 h-4" /><span>{movie.releaseYear || 'N/A'}</span></div>
                        </div>
                        {movie.genre_category && <span className="inline-block bg-purple-500/20 text-purple-300 px-3 py-1 text-xs font-medium rounded-full mb-4">{movie.genre_category.toUpperCase()}</span>}
                        <p className="text-gray-300 text-sm mb-4">{movie.description}</p>
                        <div className="bg-gray-700/50 rounded p-3 mb-4">
                        <p className="text-gray-500 text-xs font-semibold">CAST</p>
                        <p className="text-gray-300 text-sm">{Array.isArray(movie.cast) ? movie.cast.join(', ') : ''}</p>
                        </div>
                        <div className="flex space-x-3">
                        <a href={movie.trailerUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"><Play className="w-4 h-4" /><span>Watch Trailer</span></a>
                        <a href={movie.watchUrl} target="_blank" rel="noopener noreferrer" className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center space-x-2"><ExternalLink className="w-4 h-4" /><span>Find Movie</span></a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-4 pt-4 flex justify-end items-center gap-4">
                    {user && (
                    <div className="flex items-center gap-4 text-gray-400">
                        <button onClick={() => { setSelectedContent(movie); setActiveModal('collection'); }} className="flex items-center text-sm hover:text-white" title="Add to Collection"><PlusSquare size={18} /></button>
                        <button onClick={() => { setSelectedContent(movie); setActiveModal('event'); }} className="flex items-center text-sm hover:text-white" title="Schedule Event"><CalendarPlus size={18} /></button>
                        <button onClick={() => { setSelectedContent(movie); setActiveModal('link'); }} className="flex items-center text-sm hover:text-white" title="Add Related Link"><LinkIcon size={18} /></button>
                    </div>
                    )}
                    {user && user.id === movie.uploadedBy?._id && (
                    <div className="flex items-center gap-2">
                        <button onClick={() => handleEditClick(movie)} className="flex items-center text-xs px-3 py-1 bg-blue-600/50 hover:bg-blue-600/80 rounded"><Edit size={14} className="mr-1"/> Edit</button>
                        <button onClick={() => handleDelete(movie._id)} className="flex items-center text-xs px-3 py-1 bg-red-600/50 hover:bg-red-600/80 rounded"><Trash2 size={14} className="mr-1"/> Delete</button>
                    </div>
                    )}
                </div>
            </div>
            ))}
        </div>

        {isEditing && currentMovie && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Edit Movie</h2>
                    <form onSubmit={handleUpdate} className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
                    <div><label className="text-sm text-gray-400">Title</label><input value={currentMovie.title || ''} onChange={(e) => setCurrentMovie({...currentMovie, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Director</label><input value={currentMovie.author_director || ''} onChange={(e) => setCurrentMovie({...currentMovie, author_director: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Rating</label><input type="number" step="0.1" value={currentMovie.rating || ''} onChange={(e) => setCurrentMovie({...currentMovie, rating: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Duration</label><input value={currentMovie.duration || ''} onChange={(e) => setCurrentMovie({...currentMovie, duration: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Release Year</label><input type="number" value={currentMovie.releaseYear || ''} onChange={(e) => setCurrentMovie({...currentMovie, releaseYear: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Genre</label><input value={currentMovie.genre_category || ''} onChange={(e) => setCurrentMovie({...currentMovie, genre_category: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                    <div><label className="text-sm text-gray-400">Description</label><textarea value={currentMovie.description || ''} onChange={(e) => setCurrentMovie({...currentMovie, description: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1 h-24" /></div>
                    <div><label className="text-sm text-gray-400">Cast (comma-separated)</label><textarea value={currentMovie.cast || ''} onChange={(e) => setCurrentMovie({...currentMovie, cast: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1 h-20" /></div>
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

export default MovieSection;
