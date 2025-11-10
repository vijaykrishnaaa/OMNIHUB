import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link as LinkIcon, Edit, Trash2, AlertTriangle } from 'lucide-react';
import EditRelatedLinkModal from './components/EditRelatedLinkModal';
import NotificationSystem from '../../components/Notifications/NotificationSystem';
import { API_URL } from '../../apiConfig'; // <-- THIS IS THE CORRECTED PATH

const RelatedLinksModule = () => {
    const { user } = useAuth();
    const [links, setLinks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingLink, setEditingLink] = useState(null);
    const [notification, setNotification] = useState(null);

    const fetchLinks = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/related-links`);
            const data = await response.json();
            setLinks(data);
        } catch (error) {
            console.error("Failed to fetch links:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLinks();
    }, []);

    const handleUpdateLink = async (linkId, linkData) => {
        try {
            await fetch(`${API_URL}/api/related-links/${linkId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...linkData, userId: user.id })
            });
            setEditingLink(null);
            fetchLinks();
            setNotification({ type: 'success', message: 'Link updated successfully.' });
        } catch (error) {
            setNotification({ type: 'error', message: 'Failed to update link.' });
        }
    };

    const handleDeleteLink = async (linkId) => {
        if (window.confirm('Are you sure you want to delete this link?')) {
            try {
                await fetch(`${API_URL}/api/related-links/${linkId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
                fetchLinks();
                setNotification({ type: 'success', message: 'Link deleted successfully.' });
            } catch (error) {
                setNotification({ type: 'error', message: 'Failed to delete link.' });
            }
        }
    };

    if (loading) return <p className="text-white p-6 text-center">Loading links...</p>;

    return (
        <div className="max-w-4xl mx-auto p-4 text-white">
            <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
            <h1 className="text-3xl font-bold mb-6 flex items-center">
                <LinkIcon className="mr-3" /> Related Links
            </h1>
            
            {links.length === 0 ? (
                 <div className="text-center py-16 bg-gray-800 rounded-lg">
                    <p className="text-gray-400">No related links have been submitted yet.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {links.map(link => (
                        <div key={link._id} className="bg-gray-800 rounded-lg p-4 block transition-colors relative">
                             <a href={link.url} target="_blank" rel="noopener noreferrer" className="group">
                                <p className="text-sm text-gray-400">For: {link.relatedContent?.title}</p>
                                <h3 className="text-lg font-bold text-orange-400 mt-1 group-hover:underline">{link.title}</h3>
                                <p className="text-xs text-blue-400 truncate mt-1">{link.url}</p>
                                {link.description && <p className="text-sm text-gray-300 mt-2 italic">"{link.description}"</p>}
                            </a>
                            {user && link.submittedBy && user.id === link.submittedBy._id && (
                                <div className="absolute top-2 right-2 flex space-x-1">
                                    <button onClick={() => setEditingLink(link)} className="p-1 hover:bg-gray-700 rounded"><Edit size={16}/></button>
                                    <button onClick={() => handleDeleteLink(link._id)} className="p-1 hover:bg-gray-700 rounded"><Trash2 size={16}/></button>
                                </div>
                            )}
                             <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                                <span>Type: {link.linkType}</span>
                                <div className="flex items-center gap-4">
                                     {link.containsSpoilers && (
                                        <span className="flex items-center gap-1 text-yellow-400 font-bold"><AlertTriangle size={14} /> Spoilers</span>
                                    )}
                                    <span>Submitted by: {link.submittedBy?.username}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
             {editingLink && (
                <EditRelatedLinkModal
                    link={editingLink}
                    onClose={() => setEditingLink(null)}
                    onSave={handleUpdateLink}
                />
            )}
        </div>
    );
};

export default RelatedLinksModule;
