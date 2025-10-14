import React, { useState } from 'react';

const ShareModal = ({ writeUp, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        recipientEmail: '',
        senderName: '',
        senderEmail: '',
        subject: `Check out this article: ${writeUp.title}`,
        message: ''
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
                    <h2 className="text-2xl font-bold text-white mb-4">Share Write-Up via Email</h2>
                    <div>
                        <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-300 mb-2">Recipient's Email</label>
                        <input type="email" id="recipientEmail" name="recipientEmail" value={formData.recipientEmail} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="senderName" className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                            <input type="text" id="senderName" name="senderName" value={formData.senderName} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-300 mb-2">Your Email</label>
                            <input type="email" id="senderEmail" name="senderEmail" value={formData.senderEmail} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                        </div>
                    </div>
                     <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                        <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Optional Message</label>
                        <textarea id="message" name="message" rows="3" value={formData.message} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Send</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShareModal;