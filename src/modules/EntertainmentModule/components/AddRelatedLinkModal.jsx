import React, { useState } from 'react';

const AddRelatedLinkModal = ({ content, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        url: '',
        linkType: 'Video Essay',
        description: '',
        containsSpoilers: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(content._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-md mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Add a Related Link</h2>
                    <p className="text-gray-400">Submit a link related to "{content.title}".</p>
                    <div>
                        <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">URL</label>
                        <input type="url" id="url" name="url" value={formData.url} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="https://youtube.com/..." required/>
                    </div>
                     <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Link Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="e.g., Deep Dive Analysis" required/>
                    </div>
                    <div>
                        <label htmlFor="linkType" className="block text-sm font-medium text-gray-300 mb-2">Link Type</label>
                        <select id="linkType" name="linkType" value={formData.linkType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                            <option>Video Essay</option>
                            <option>Fan Theory</option>
                            <option>Podcast Discussion</option>
                            <option>Article</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description (optional)</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full bg-gray-700 p-2 rounded text-white" placeholder="A brief summary of the linked content."/>
                    </div>
                    <div className="flex items-center">
                        <input id="containsSpoilers" name="containsSpoilers" type="checkbox" checked={formData.containsSpoilers} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700 text-orange-500 border-gray-600 focus:ring-orange-500"/>
                        <label htmlFor="containsSpoilers" className="ml-2 block text-sm text-gray-300">This link contains spoilers</label>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Submit Link</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddRelatedLinkModal;