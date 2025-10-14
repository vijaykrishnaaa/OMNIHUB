import React, { useState, useEffect } from 'react';

const EditArticleModal = ({ article, onClose, onSave }) => {
    const [formData, setFormData] = useState(article);

    useEffect(() => {
        setFormData({ ...article, tags: Array.isArray(article.tags) ? article.tags.join(', ') : '' });
    }, [article]);
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) });
    };

    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-2xl font-bold text-white mb-4">Edit Article</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Article Title" className="bg-gray-700 p-2 rounded" required />
                        <input name="author" value={formData.author} onChange={handleChange} placeholder="Author Name" className="bg-gray-700 p-2 rounded" required />
                        <input name="category" value={formData.category} onChange={handleChange} placeholder="Category (e.g., Tech)" className="bg-gray-700 p-2 rounded" required />
                        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="bg-gray-700 p-2 rounded" />
                    </div>
                    <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Article content..." className="w-full bg-gray-700 p-2 rounded h-32" required />
                    <div className="flex items-center justify-between">
                        <select name="status" value={formData.status} onChange={handleChange} className="bg-gray-700 p-2 rounded">
                            <option value="Draft">Draft</option>
                            <option value="Published">Published</option>
                        </select>
                        <div className="flex items-center space-x-2">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancel</button>
                            <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-bold">Save Changes</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditArticleModal;