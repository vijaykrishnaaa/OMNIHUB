import React, { useState } from 'react';

const ReportArticleModal = ({ article, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        reason: 'Incorrect Information',
        details: '',
        urgency: 'Low',
        problematicSection: '',
        sourceLink: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(article._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Report Article</h2>
                    <p className="text-sm text-gray-400">You are reporting the article: <span className="font-bold text-orange-400">{article.title}</span></p>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">Reason for Report</label>
                            <select id="reason" name="reason" value={formData.reason} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>Incorrect Information</option>
                                <option>Outdated Content</option>
                                <option>Spam</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <label htmlFor="urgency" className="block text-sm font-medium text-gray-300 mb-2">Urgency</label>
                            <select id="urgency" name="urgency" value={formData.urgency} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="problematicSection" className="block text-sm font-medium text-gray-300 mb-2">Problematic Section (optional)</label>
                        <input type="text" id="problematicSection" name="problematicSection" value={formData.problematicSection} onChange={handleChange} placeholder="e.g., Section 3, Paragraph 2" className="w-full bg-gray-700 p-2 rounded text-white"/>
                    </div>
                     <div>
                        <label htmlFor="sourceLink" className="block text-sm font-medium text-gray-300 mb-2">Link to Correct Information (optional)</label>
                        <input type="url" id="sourceLink" name="sourceLink" value={formData.sourceLink} onChange={handleChange} placeholder="https://example.com/correct-info" className="w-full bg-gray-700 p-2 rounded text-white"/>
                    </div>

                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">Please provide details:</label>
                        <textarea id="details" name="details" value={formData.details} onChange={handleChange} rows="3" placeholder="What is the issue with this article?" className="w-full bg-gray-700 p-2 rounded text-white placeholder-gray-400" required />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-red-600 rounded-lg font-bold">Submit Report</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportArticleModal;