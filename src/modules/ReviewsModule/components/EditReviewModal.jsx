import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const EditReviewModal = ({ review, onClose, onSave }) => {
  const [formData, setFormData] = useState({
      movieName: '',
      rating: 5,
      pros: '',
      cons: '',
      hasSpoilers: false
  });

  useEffect(() => {
    if (review) {
        setFormData({
            movieName: review.movieName || '',
            rating: review.rating || 5,
            pros: review.pros || '',
            cons: review.cons || '',
            hasSpoilers: review.hasSpoilers || false,
            _id: review._id
        });
    }
  }, [review]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-white mb-4">Edit Your Review</h2>
          <input 
            name="movieName" 
            value={formData.movieName} 
            onChange={handleChange} 
            placeholder="Content Name (Movie, Book, etc.)" 
            className="w-full bg-gray-700 p-2 rounded" 
            required 
          />
          <textarea 
            name="pros" 
            value={formData.pros} 
            onChange={handleChange} 
            placeholder="What did you like?" 
            className="w-full bg-gray-700 p-2 rounded h-24" 
          />
          <textarea 
            name="cons" 
            value={formData.cons} 
            onChange={handleChange} 
            placeholder="What did you dislike?" 
            className="w-full bg-gray-700 p-2 rounded h-24" 
          />
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
                <label className="text-white">Rating:</label>
                <input 
                name="rating" 
                type="number" 
                min="1" max="10" step="0.5" 
                value={formData.rating} 
                onChange={handleChange} 
                className="bg-gray-700 p-2 rounded w-24" 
                required 
                />
                <span className="text-yellow-400"><Star /></span>
            </div>
            <div className="flex items-center">
                <input id="hasSpoilers" name="hasSpoilers" type="checkbox" checked={formData.hasSpoilers} onChange={handleChange} className="h-4 w-4 rounded bg-gray-700 text-orange-500"/>
                <label htmlFor="hasSpoilers" className="ml-2 block text-sm text-gray-300">Contains Spoilers</label>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 rounded-lg font-bold">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReviewModal;