import React, { useState } from 'react';

const RateWriteUpModal = ({ writeUp, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        clarity: 3,
        accuracy: 3,
        engagement: 3,
        recommend: true,
        justification: ''
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? (value === 'true') : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(writeUp._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Rate this Write-Up</h2>
                    <p className="text-gray-400">Your rating for "{writeUp.title}"</p>
                    
                    <div>
                        <label htmlFor="clarity" className="block text-sm font-medium text-gray-300">Clarity: {formData.clarity}/5</label>
                        <input id="clarity" name="clarity" type="range" min="1" max="5" value={formData.clarity} onChange={handleChange} className="w-full" />
                    </div>

                    <div>
                        <label htmlFor="accuracy" className="block text-sm font-medium text-gray-300">Accuracy: {formData.accuracy}/5</label>
                        <input id="accuracy" name="accuracy" type="range" min="1" max="5" value={formData.accuracy} onChange={handleChange} className="w-full" />
                    </div>

                    <div>
                        <label htmlFor="engagement" className="block text-sm font-medium text-gray-300">Engagement: {formData.engagement}/5</label>
                        <input id="engagement" name="engagement" type="range" min="1" max="5" value={formData.engagement} onChange={handleChange} className="w-full" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300">Would you recommend this?</label>
                        <div className="flex items-center space-x-4 mt-2">
                            <label className="flex items-center text-white"><input type="radio" name="recommend" value={true} checked={formData.recommend === true} onChange={handleChange} className="mr-2"/>Yes</label>
                            <label className="flex items-center text-white"><input type="radio" name="recommend" value={false} checked={formData.recommend === false} onChange={handleChange} className="mr-2"/>No</label>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="justification" className="block text-sm font-medium text-gray-300 mb-2">Justification (optional)</label>
                        <textarea id="justification" name="justification" rows="3" value={formData.justification} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                    
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Submit Rating</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RateWriteUpModal;