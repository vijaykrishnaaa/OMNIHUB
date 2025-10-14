import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

const CommentsSection = ({ reviewId, onCommentPosted }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState('');

    const fetchComments = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:5000/api/comments/review/${reviewId}`);
            const data = await response.json();
            setComments(data);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        fetchComments();
    }, [reviewId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await fetch('http://localhost:5000/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: newComment,
                    authorId: user.id,
                    reviewId: reviewId,
                }),
            });
            setNewComment('');
            fetchComments();
            if (onCommentPosted) {
                onCommentPosted();
            }
        } catch (error) {
            console.error("Failed to post comment:", error);
        }
    };

    const handleEditClick = (comment) => {
        setEditingComment(comment);
        setEditText(comment.text);
    };

    const handleUpdateComment = async (commentId) => {
        try {
            await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: editText, authorId: user.id }),
            });
            setEditingComment(null);
            setEditText('');
            fetchComments();
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await fetch(`http://localhost:5000/api/comments/${commentId}`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ authorId: user.id }),
                });
                fetchComments();
                 if (onCommentPosted) {
                    onCommentPosted();
                }
            } catch (error) {
                console.error("Failed to delete comment:", error);
            }
        }
    };
    
    return (
        <div className="mt-6 pt-4 border-t border-gray-700">
            <h4 className="text-lg font-semibold text-white mb-4">Comments</h4>
            <div className="space-y-4 mb-4">
                {isLoading && <p className="text-gray-400">Loading comments...</p>}
                {!isLoading && comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
                {comments.map(comment => (
                    <div key={comment._id} className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-orange-400">{comment.author?.username || 'User'}</p>
                            {user && comment.author && user.id === comment.author._id && (
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleEditClick(comment)} className="text-gray-400 hover:text-white"><Edit size={14} /></button>
                                    <button onClick={() => handleDeleteComment(comment._id)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                </div>
                            )}
                        </div>
                        {editingComment?._id === comment._id ? (
                            <div className="mt-2">
                                <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    className="w-full bg-gray-600 p-2 rounded-lg text-white text-sm"
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button onClick={() => setEditingComment(null)} className="text-xs text-gray-400 hover:text-white">Cancel</button>
                                    <button onClick={() => handleUpdateComment(comment._id)} className="text-xs bg-orange-500 hover:bg-orange-600 px-3 py-1 rounded">Save</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-300 text-sm mt-1">{comment.text}</p>
                        )}
                    </div>
                ))}
            </div>
            {user && (
                <form onSubmit={handleCommentSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="flex-grow bg-gray-600 p-2 rounded-lg text-white placeholder-gray-400"
                    />
                    <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold">Post</button>
                </form>
            )}
        </div>
    );
};

export default CommentsSection;