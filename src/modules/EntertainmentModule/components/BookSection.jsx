import React, { useState, useEffect } from 'react';
import { BookOpen, Star, ExternalLink, Edit, Trash2, PlusSquare, CalendarPlus, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import NotificationSystem from '../../../components/Notifications/NotificationSystem';
import AddToCollectionModal from './AddToCollectionModal';
import ScheduleEventModal from './ScheduleEventModal';
import AddRelatedLinkModal from './AddRelatedLinkModal';
import { API_URL } from '../../../apiConfig';

const BookSection = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentBook, setCurrentBook] = useState(null);
    const [notification, setNotification] = useState(null);
    const [activeModal, setActiveModal] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);

    useEffect(() => {
        fetchBooks();
    }, []);

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await fetch('${API_URL}/api/content/Book');
            const data = await response.json();
            setBooks(data);
        } catch (error) {
            console.error("Failed to fetch books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId) => {
        if (window.confirm('Are you sure you want to delete this book?')) {
            try {
                await fetch(`${API_URL}/api/content/${bookId}`, { method: 'DELETE' });
                fetchBooks();
                setNotification({ type: 'success', message: 'Book deleted successfully.' });
            } catch (error) {
                console.error("Failed to delete book:", error);
                setNotification({ type: 'error', message: 'Failed to delete book.' });
            }
        }
    };

    const handleEditClick = (book) => {
        setCurrentBook(book);
        setIsEditing(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/api/content/${currentBook._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...currentBook,
                    rating: parseFloat(currentBook.rating),
                    releaseYear: parseInt(currentBook.releaseYear, 10),
                    pages: parseInt(currentBook.pages, 10),
                    reviews: parseInt(currentBook.reviews, 10),
                }),
            });
            if (!response.ok) throw new Error('Failed to update book');
            const updatedBook = await response.json();
            setBooks(books.map(book => (book._id === updatedBook._id ? updatedBook : book)));
            setIsEditing(false);
            setCurrentBook(null);
            setNotification({ type: 'success', message: 'Book updated successfully.' });
        } catch (error) {
            console.error("Failed to update book:", error);
            setNotification({ type: 'error', message: 'Failed to update book.' });
        }
    };

    const handleAddToCollection = async (contentId, collectionData) => {
        try {
            const response = await fetch('${API_URL}/api/collections/add', {
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
            const response = await fetch('${API_URL}/api/events', {
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
            const response = await fetch('${API_URL}/api/related-links', {
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

    if (loading) return <p className="text-white p-6 text-center">Loading books...</p>;

    return (
        <div className="space-y-6">
            <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
            <h1 className="text-2xl font-bold text-white">Books</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                    <div key={book._id} className="bg-gray-800 rounded-lg p-6 flex flex-col">
                        <div className="flex items-start space-x-4 mb-4 flex-grow">
                            <div className="w-16 h-20 flex-shrink-0">
                                <img src={book.imageUrl} alt={book.title} className="w-full h-full object-cover rounded shadow-md" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-white font-semibold text-lg">{book.title}</h3>
                                <p className="text-gray-400 text-sm">by {book.author_director}</p>
                                <div className="flex items-center text-sm mt-1">
                                    <Star className="w-4 h-4 text-yellow-400 mr-1" /><span className="text-orange-500 font-medium">{book.rating || 'N/A'}</span>
                                    {book.reviews > 0 && <span className="text-gray-400 ml-2">({book.reviews} reviews)</span>}
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{book.description}</p>
                        <div className="bg-gray-700/50 rounded p-3 mb-4 grid grid-cols-2 gap-y-2 text-sm text-gray-400">
                            <div>Pages: <span className="text-white">{book.pages || 'N/A'}</span></div>
                            <div>Published: <span className="text-white">{book.releaseYear || 'N/A'}</span></div>
                            <div className="col-span-2">Category: <span className="text-orange-400">{book.genre_category || 'N/A'}</span></div>
                        </div>
                        <a href={book.watchUrl} target="_blank" rel="noopener noreferrer" className="w-full block text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg mt-auto flex items-center justify-center space-x-2">
                            <ExternalLink className="w-4 h-4" /><span>Find This Book</span>
                        </a>

                        <div className="border-t border-gray-700 mt-4 pt-4 flex justify-end items-center gap-4">
                            {user && (
                                <div className="flex items-center gap-4 text-gray-400">
                                    <button onClick={() => { setSelectedContent(book); setActiveModal('collection'); }} className="flex items-center text-sm hover:text-white" title="Add to Collection"><PlusSquare size={18} /></button>
                                    <button onClick={() => { setSelectedContent(book); setActiveModal('event'); }} className="flex items-center text-sm hover:text-white" title="Schedule Event"><CalendarPlus size={18} /></button>
                                    <button onClick={() => { setSelectedContent(book); setActiveModal('link'); }} className="flex items-center text-sm hover:text-white" title="Add Related Link"><LinkIcon size={18} /></button>
                                </div>
                            )}
                            {user && user.id === book.uploadedBy?._id && (
                                <div className="flex items-center gap-2">
                                    <button onClick={() => handleEditClick(book)} className="flex items-center text-xs px-3 py-1 bg-blue-600/50 hover:bg-blue-600/80 rounded"><Edit size={14} className="mr-1"/> Edit</button>
                                    <button onClick={() => handleDelete(book._id)} className="flex items-center text-xs px-3 py-1 bg-red-600/50 hover:bg-red-600/80 rounded"><Trash2 size={14} className="mr-1"/> Delete</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {isEditing && currentBook && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-4">
                        <h2 className="text-2xl font-bold text-white mb-6">Edit Book</h2>
                        <form onSubmit={handleUpdate} className="space-y-3 max-h-[60vh] overflow-y-auto pr-4">
                            <div><label className="text-sm text-gray-400">Title</label><input value={currentBook.title || ''} onChange={(e) => setCurrentBook({...currentBook, title: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Author</label><input value={currentBook.author_director || ''} onChange={(e) => setCurrentBook({...currentBook, author_director: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Rating</label><input type="number" step="0.1" value={currentBook.rating || ''} onChange={(e) => setCurrentBook({...currentBook, rating: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Reviews</label><input type="number" value={currentBook.reviews || ''} onChange={(e) => setCurrentBook({...currentBook, reviews: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Pages</label><input type="number" value={currentBook.pages || ''} onChange={(e) => setCurrentBook({...currentBook, pages: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Published Year</label><input type="number" value={currentBook.releaseYear || ''} onChange={(e) => setCurrentBook({...currentBook, releaseYear: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Category</label><input value={currentBook.genre_category || ''} onChange={(e) => setCurrentBook({...currentBook, genre_category: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1" /></div>
                            <div><label className="text-sm text-gray-400">Description</label><textarea value={currentBook.description || ''} onChange={(e) => setCurrentBook({...currentBook, description: e.target.value})} className="w-full bg-gray-700 p-2 rounded mt-1 h-24" /></div>
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
export default BookSection;
