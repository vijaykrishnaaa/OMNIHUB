import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';

const AddToCollectionModal = ({ content, onClose, onSubmit }) => {
    const { user } = useAuth();
    const [collections, setCollections] = useState([]);
    const [formData, setFormData] = useState({
        selectedCollection: '',
        newCollectionName: '',
        note: '',
        description: '',
        tags: ''
    });

    useEffect(() => {
        const fetchCollections = async () => {
            if (user?.id) {
                const response = await fetch(`http://localhost:5000/api/collections/user/${user.id}`);
                const data = await response.json();
                setCollections(data);
            }
        };
        fetchCollections();
    }, [user]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newFormData = { ...formData };
        
        if (name === 'selectedCollection') {
            newFormData.newCollectionName = '';
        }
        if (name === 'newCollectionName') {
            newFormData.selectedCollection = '';
        }

        newFormData[name] = value;
        setFormData(newFormData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(content._id, {
            ...formData,
            userId: user.id
        });
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Add to Collection</h2>
                    <p className="text-gray-400">Add "{content.title}" to a new or existing collection.</p>
                    
                    <div>
                        <label htmlFor="selectedCollection" className="block text-sm font-medium text-gray-300 mb-2">Select an Existing Collection</label>
                        <select
                            id="selectedCollection"
                            name="selectedCollection"
                            value={formData.selectedCollection}
                            onChange={handleChange}
                            className="w-full bg-gray-700 p-2 rounded text-white"
                            disabled={formData.newCollectionName !== ''}
                        >
                            <option value="">-- Select --</option>
                            {collections.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label htmlFor="newCollectionName" className="block text-sm font-medium text-gray-300 mb-2">Or Create a New Collection</label>
                        <input
                            type="text"
                            id="newCollectionName"
                            name="newCollectionName"
                            value={formData.newCollectionName}
                            onChange={handleChange}
                            className="w-full bg-gray-700 p-2 rounded text-white"
                            disabled={formData.selectedCollection !== ''}
                        />
                    </div>
                    
                    {formData.newCollectionName && (
                        <>
                             <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">New Collection Description</label>
                                <textarea id="description" name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="e.g., My favorite sci-fi movies"/>
                            </div>
                            <div>
                                <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                                <input
                                    type="text"
                                    id="tags"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 p-2 rounded text-white"
                                    placeholder="e.g., sci-fi, classic, 80s"
                                />
                            </div>
                        </>
                    )}

                    <div>
                        <label htmlFor="note" className="block text-sm font-medium text-gray-300 mb-2">Note for this item (optional)</label>
                        <textarea id="note" name="note" rows="2" value={formData.note} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Add to Collection</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToCollectionModal;