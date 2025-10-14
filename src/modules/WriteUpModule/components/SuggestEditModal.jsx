import React, { useState } from 'react';

const SuggestEditModal = ({ writeUp, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        suggestionType: 'Typo/Grammar',
        problematicSection: '',
        suggestionText: '',
        sourceLink: '',
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(writeUp._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Suggest an Edit</h2>
                    <p className="text-gray-400">Your suggestion for "{writeUp.title}" will be sent to the author.</p>
                    
                     <div>
                        <label htmlFor="suggestionType" className="block text-sm font-medium text-gray-300 mb-2">Type of Suggestion</label>
                        <select id="suggestionType" name="suggestionType" value={formData.suggestionType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                            <option>Typo/Grammar</option>
                            <option>Factual Error</option>
                            <option>Add More Detail</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="problematicSection" className="block text-sm font-medium text-gray-300 mb-2">Section with Issue (optional)</label>
                        <input type="text" id="problematicSection" name="problematicSection" value={formData.problematicSection} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="e.g., 3rd paragraph"/>
                    </div>
                    <div>
                        <label htmlFor="suggestionText" className="block text-sm font-medium text-gray-300 mb-2">Your Suggestion</label>
                        <textarea id="suggestionText" name="suggestionText" rows="4" value={formData.suggestionText} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                     <div>
                        <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-300 mb-2">Link to Source (optional)</label>
                        <input type="url" id="sourceLink" name="sourceLink" value={formData.sourceLink} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="https://example.com/source"/>
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

export default SuggestEditModal;