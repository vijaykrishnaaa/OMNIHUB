import React, { useState } from 'react';

const SuggestAlternativeModal = ({ review, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        contentName: '',
        contentType: 'Movie',
        reason: '',
        link: '',
        genre: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(review._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Suggest an Alternative</h2>
                    <p className="text-gray-400">Disagree with the review for "{review.movieName}"? Suggest something better.</p>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="contentName" className="block text-sm font-medium text-gray-300 mb-2">Alternative Content Name</label>
                            <input type="text" id="contentName" name="contentName" value={formData.contentName} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required/>
                        </div>
                        <div className="flex-1">
                             <label htmlFor="contentType" className="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                            <select id="contentType" name="contentType" value={formData.contentType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>Movie</option>
                                <option>Book</option>
                                <option>Video</option>
                            </select>
                        </div>
                    </div>
                     <div>
                        <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">Genre / Category</label>
                        <input type="text" id="genre" name="genre" value={formData.genre} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required/>
                    </div>
                     <div>
                        <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-2">Link to Alternative (e.g., IMDb, Goodreads)</label>
                        <input type="url" id="link" name="link" value={formData.link} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required/>
                    </div>
                    <div>
                        <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">Why is this a better alternative?</label>
                        <textarea id="reason" name="reason" value={formData.reason} onChange={handleChange} rows="3" className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Submit Suggestion</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SuggestAlternativeModal;