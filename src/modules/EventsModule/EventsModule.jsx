import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Calendar, Edit, Trash2, Users } from 'lucide-react';
import EditEventModal from './components/EditEventModal';
import NotificationSystem from '../../components/Notifications/NotificationSystem';

const EventsModule = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingEvent, setEditingEvent] = useState(null);
    const [notification, setNotification] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/events');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleUpdateEvent = async (eventId, eventData) => {
        try {
            await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...eventData, userId: user.id })
            });
            setEditingEvent(null);
            fetchEvents();
            setNotification({ type: 'success', message: 'Event updated successfully.' });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to update event.' });
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await fetch(`http://localhost:5000/api/events/${eventId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
                fetchEvents();
                setNotification({ type: 'success', message: 'Event deleted successfully.' });
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete event.' });
            }
        }
    };

    if (loading) return <p className="text-white p-6 text-center">Loading events...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 text-white">
            <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <Calendar className="mr-3" /> Community Events
            </h1>
            
            {events.length === 0 ? (
                 <div className="text-center py-16 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No events have been scheduled yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.map(event => (
                        <div key={event._id} className="bg-gray-800 rounded-lg p-4 flex items-start space-x-4">
                            <img src={event.relatedContent?.imageUrl} alt={event.relatedContent?.title} className="w-20 h-28 object-cover rounded-md flex-shrink-0" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-xs text-orange-400 font-semibold">{new Date(event.eventDate).toLocaleString()}</p>
                                        <h3 className="text-xl font-bold text-white mt-1">{event.title}</h3>
                                        <p className="text-sm text-gray-400">For: {event.relatedContent?.title}</p>
                                    </div>
                                    {user && event.createdBy && user.id === event.createdBy._id && (
                                        <div className="flex space-x-1 flex-shrink-0">
                                            <button onClick={() => setEditingEvent(event)} className="p-1 hover:bg-gray-700 rounded"><Edit size={16}/></button>
                                            <button onClick={() => handleDeleteEvent(event._id)} className="p-1 hover:bg-gray-700 rounded"><Trash2 size={16}/></button>
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-300 mt-2">{event.description}</p>
                                <div className="flex justify-between items-end mt-2 text-xs">
                                    <p className="text-gray-500">Scheduled by: {event.createdBy?.username}</p>
                                    <div className="flex gap-4">
                                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-full">{event.eventType}</span>
                                        {event.capacity && (
                                             <span className="flex items-center gap-1 text-gray-400"><Users size={14}/> {event.capacity}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {editingEvent && (
                <EditEventModal
                    event={editingEvent}
                    onClose={() => setEditingEvent(null)}
                    onSave={handleUpdateEvent}
                />
            )}
        </div>
    );
};

export default EventsModule;