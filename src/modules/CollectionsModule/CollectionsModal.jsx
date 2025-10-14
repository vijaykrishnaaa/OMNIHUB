import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FolderKanban, X, Edit, Trash2, Check, XCircle } from 'lucide-react';

const CollectionsModal = ({ onClose, onNavigate }) => {
    const { user } = useAuth();
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCollection, setEditingCollection] = useState(null);
    const [newName, setNewName] = useState('');

    const fetchCollectionDetails = async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/collections/details/${user.id}`);
            const data = await response.json();
            setCollections(data);
        } catch (error) {
            console.error("Failed to fetch collections:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCollectionDetails();
    }, [user]);

    const handleItemClick = (item) => {
        const viewMap = {
            'Movie': 'movies',
            'Book': 'books',
            'Video': 'videos'
        };
        const view = viewMap[item.contentType];
        if (view) {
            onNavigate(view);
        }
        onClose();
    };

    const handleDeleteCollection = async (collectionId) => {
        if (window.confirm('Are you sure you want to delete this entire collection?')) {
            await fetch(`http://localhost:5000/api/collections/${collectionId}`, { method: 'DELETE' });
            fetchCollectionDetails();
        }
    };

    const handleRemoveItem = async (collectionId, itemId) => {
        if (window.confirm('Are you sure you want to remove this item from the collection?')) {
            await fetch(`http://localhost:5000/api/collections/${collectionId}/item/${itemId}`, { method: 'DELETE' });
            fetchCollectionDetails();
        }
    };

    const handleRenameCollection = async (collectionId) => {
        await fetch(`http://localhost:5000/api/collections/${collectionId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName }),
        });
        setEditingCollection(null);
        setNewName('');
        fetchCollectionDetails();
    };

    const startEditing = (collection) => {
        setEditingCollection(collection);
        setNewName(collection.name);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <FolderKanban className="mr-3" /> My Collections
                    </h1>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X size={28} />
                    </button>
                </div>
                <div className="flex-grow overflow-y-auto pr-2">
                    {loading ? (
                        <p className="text-white p-6 text-center">Loading collections...</p>
                    ) : collections.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400">You haven't created any collections yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {collections.map(collection => (
                                <div key={collection._id}>
                                    <div className="flex items-center gap-4 mb-4">
                                        {editingCollection?._id === collection._id ? (
                                            <div className="flex items-center gap-2 flex-grow">
                                                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="bg-gray-700 text-2xl font-semibold text-orange-400 p-1 rounded" />
                                                <button onClick={() => handleRenameCollection(collection._id)} className="text-green-400 hover:text-green-300"><Check size={22} /></button>
                                                <button onClick={() => setEditingCollection(null)} className="text-red-400 hover:text-red-300"><XCircle size={22} /></button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <h2 className="text-2xl font-semibold text-orange-400">{collection.name}</h2>
                                                <button onClick={() => startEditing(collection)} className="text-gray-400 hover:text-white" title="Rename Collection"><Edit size={16} /></button>
                                                <button onClick={() => handleDeleteCollection(collection._id)} className="text-gray-400 hover:text-red-500" title="Delete Collection"><Trash2 size={16} /></button>
                                            </div>
                                        )}
                                    </div>

                                    {collection.items.length === 0 ? (
                                        <p className="text-gray-500">This collection is empty.</p>
                                    ) : (
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {collection.items.map(item => (
                                                item.content ? (
                                                    <div key={item._id} className="group relative text-left">
                                                        <button onClick={() => handleRemoveItem(collection._id, item._id)} className="absolute top-1 right-1 z-10 bg-black/50 text-white/70 hover:text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove from collection">
                                                            <X size={14} />
                                                        </button>
                                                        <button onClick={() => handleItemClick(item.content)} className="w-full">
                                                            <img src={item.content.imageUrl} alt={item.content.title} className="w-full h-48 object-cover rounded-md transition-transform group-hover:scale-105" />
                                                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-2 rounded-b-md">
                                                                <h4 className="text-sm font-bold truncate text-white">{item.content.title}</h4>
                                                                {item.note && <p className="text-xs text-gray-400 truncate italic mt-1">"{item.note}"</p>}
                                                            </div>
                                                        </button>
                                                    </div>
                                                ) : null
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CollectionsModal;