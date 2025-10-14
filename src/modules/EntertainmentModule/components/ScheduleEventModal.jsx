import React, { useState } from 'react';

const ScheduleEventModal = ({ content, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        title: `Watch Party: ${content.title}`,
        eventDate: '',
        eventTime: '',
        description: '',
        eventType: 'Watch Party',
        capacity: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const fullDate = new Date(`${formData.eventDate}T${formData.eventTime}`);
        onSubmit(content._id, { ...formData, eventDate: fullDate });
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Schedule Event</h2>
                    <p className="text-gray-400">Create an event for "{content.title}".</p>
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">Event Title</label>
                        <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required/>
                    </div>
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="eventDate" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                            <input type="date" id="eventDate" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                        </div>
                        <div className="flex-1">
                            <label htmlFor="eventTime" className="block text-sm font-medium text-gray-300 mb-2">Time</label>
                            <input type="time" id="eventTime" name="eventTime" value={formData.eventTime} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" required />
                        </div>
                    </div>
                     <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="eventType" className="block text-sm font-medium text-gray-300 mb-2">Event Type</label>
                            <select id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white">
                                <option>Watch Party</option>
                                <option>Book Club</option>
                                <option>Live Discussion</option>
                                <option>Q&A Session</option>
                            </select>
                        </div>
                        <div className="flex-1">
                           <label htmlFor="capacity" className="block text-sm font-medium text-gray-300 mb-2">Max Participants (Optional)</label>
                            <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} min="1" className="w-full bg-gray-700 p-2 rounded text-white" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">Description / Link</label>
                        <textarea id="description" name="description" rows="3" value={formData.description} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" placeholder="e.g., Join our Discord for the watch party!" />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 rounded-lg">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-orange-500 rounded-lg font-bold">Schedule Event</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleEventModal;