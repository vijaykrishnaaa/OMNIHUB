import React, { useState } from 'react';

const ReportModal = ({ review, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        reason: 'Spam',
        details: '',
        urgency: 'Low',
        linkToEvidence: '',
        confirm: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.confirm) {
            alert('Please confirm you are submitting this report in good faith.');
            return;
        }
        onSubmit(review._id, formData);
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Report Review</h2>
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600">
                        <p className="text-sm text-gray-400">You are reporting a review by <span className="font-bold text-orange-400">{review.author?.username || 'Unknown User'}</span>.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="reason" className="block text-sm font-medium text-gray-300 mb-2">Reason</label>
                            <select id="reason" name="reason" value={formData.reason} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>Spam</option>
                                <option>Inappropriate Content</option>
                                <option>Harassment</option>
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
                        <label htmlFor="linkToEvidence" className="block text-sm font-medium text-gray-300 mb-2">Link to Evidence (optional)</label>
                        <input type="url" id="linkToEvidence" name="linkToEvidence" value={formData.linkToEvidence} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                    <div>
                        <label htmlFor="details" className="block text-sm font-medium text-gray-300 mb-2">Details</label>
                        <textarea id="details" name="details" value={formData.details} onChange={handleChange} rows="3" className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                     <div className="flex items-center">
                        <input id="confirm" name="confirm" type="checkbox" checked={formData.confirm} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700"/>
                        <label htmlFor="confirm" className="ml-2 block text-sm text-gray-300">I confirm this report is submitted in good faith.</label>
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

export default ReportModal;