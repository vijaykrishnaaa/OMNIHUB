import React, { useState } from 'react';

const AskQuestionModal = ({ review, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        questionText: '',
        isPublic: true,
        topic: 'General Inquiry',
        subject: '',
        askerEmail: '',
        referenceText: ''
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(review._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Ask the Reviewer a Question</h2>
                    <p className="text-gray-400">Your question will be sent to {review.author?.username || 'the author'}.</p>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                            <select id="topic" name="topic" value={formData.topic} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>General Inquiry</option>
                                <option>Spoiler Question</option>
                                <option>Request for Clarification</option>
                            </select>
                        </div>
                        <div className="flex-1">
                             <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                             <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="referenceText" className="block text-sm font-medium text-gray-300 mb-2">Reference from Review (optional)</label>
                        <textarea id="referenceText" name="referenceText" value={formData.referenceText} onChange={handleChange} rows="2" className="w-full bg-gray-700 p-2 rounded text-white" placeholder="Copy/paste the part of the review you're asking about..." />
                    </div>
                    <div>
                        <label htmlFor="questionText" className="block text-sm font-medium text-gray-300 mb-2">Your Question</label>
                        <textarea id="questionText" name="questionText" value={formData.questionText} onChange={handleChange} rows="4" className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                    <div className="flex items-center">
                        <input id="isPublic" name="isPublic" type="checkbox" checked={formData.isPublic} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700"/>
                        <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-300">Make this question visible to others</label>
                    </div>
                    {!formData.isPublic && (
                         <div>
                            <label htmlFor="askerEmail" className="block text-sm font-medium text-gray-300 mb-2">Your Email (for a private response)</label>
                             <input type="email" id="askerEmail" name="askerEmail" value={formData.askerEmail} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="you@example.com" required/>
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Submit Question</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AskQuestionModal;        