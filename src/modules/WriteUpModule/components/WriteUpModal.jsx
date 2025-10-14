import React, { useState, useEffect } from 'react';

const categories = [
    'Tech',
    'Sci-Fi',
    'Gaming',
    'Movie Review',
    'Book Review',
    'Tutorial',
    'Lifestyle',
    'Opinion',
];

const WriteUpModal = ({ onClose, onSave, editingWriteUp }) => {
  const [formData, setFormData] = useState({ title: '', subtitle: '', category: '', content: '', tags: '' });

  useEffect(() => {
    if (editingWriteUp) {
      setFormData({
        ...editingWriteUp,
        tags: Array.isArray(editingWriteUp.tags) ? editingWriteUp.tags.join(', ') : ''
      });
    } else {
      setFormData({ title: '', subtitle: '', category: '', content: '', tags: '' });
    }
  }, [editingWriteUp]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = () => {
    onSave({ ...formData, tags: formData.tags.split(',').map(tag => tag.trim()) });
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">{editingWriteUp ? 'Edit Write-Up' : 'Create Write-Up'}</h2>
        <div className="space-y-4">
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full bg-gray-700 p-2 rounded" required />
          <input name="subtitle" value={formData.subtitle || ''} onChange={handleChange} placeholder="Subtitle (Optional)" className="w-full bg-gray-700 p-2 rounded" />
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            className="w-full bg-gray-700 p-2 rounded text-white"
            required
          >
            <option value="" disabled>Select a Category...</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags" className="w-full bg-gray-700 p-2 rounded" />
          <textarea name="content" value={formData.content} onChange={handleChange} placeholder="Your write-up content..." rows={8} className="w-full bg-gray-700 p-2 rounded" required />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-700 rounded-lg">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-orange-500 rounded-lg">{editingWriteUp ? 'Update' : 'Submit'}</button>
        </div>
      </div>
    </div>
  );
};

export default WriteUpModal;