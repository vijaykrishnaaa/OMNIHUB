import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ContentModule = () => {
  const { user } = useAuth();
  const [contentType, setContentType] = useState('Movie');
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      contentType,
      uploadedBy: user.id,
      cast: formData.cast ? formData.cast.split(',').map(actor => actor.trim()) : [],
    };
    try {
      const response = await fetch('http://localhost:5000/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to upload content');
      alert('Content uploaded successfully!');
      e.target.reset();
      setFormData({});
    } catch (error) {
      alert(error.message);
    }
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <input name="title" onChange={handleInputChange} placeholder="Title" className="bg-gray-700 p-2 rounded" required />
        <input name="imageUrl" onChange={handleInputChange} placeholder="Image Thumbnail URL" className="bg-gray-700 p-2 rounded" required />
        <input name="watchUrl" onChange={handleInputChange} placeholder="Watch URL (e.g., YouTube link)" className="bg-gray-700 p-2 rounded" />
        <textarea name="description" onChange={handleInputChange} placeholder="Description" className="bg-gray-700 p-2 rounded md:col-span-2 h-24" />
      </>
    );

    if (contentType === 'Movie') {
      return (
        <>
          {commonFields}
          <input name="author_director" onChange={handleInputChange} placeholder="Director" className="bg-gray-700 p-2 rounded" />
          <input name="genre_category" onChange={handleInputChange} placeholder="Genre (e.g., Sci-Fi)" className="bg-gray-700 p-2 rounded" />
          <input name="rating" type="number" step="0.1" onChange={handleInputChange} placeholder="Rating (e.g., 8.7)" className="bg-gray-700 p-2 rounded" />
          <input name="duration" onChange={handleInputChange} placeholder="Duration (e.g., 2h 14m)" className="bg-gray-700 p-2 rounded" />
          <input name="releaseYear" type="number" onChange={handleInputChange} placeholder="Release Year (e.g., 2023)" className="bg-gray-700 p-2 rounded" />
          <input name="trailerUrl" onChange={handleInputChange} placeholder="YouTube Trailer URL" className="bg-gray-700 p-2 rounded" />
          <textarea name="cast" onChange={handleInputChange} placeholder="Cast (comma-separated, e.g., John Smith, Maria Garcia)" className="bg-gray-700 p-2 rounded md:col-span-2 h-16" />
        </>
      );
    }
    if (contentType === 'Book') {
      return (
        <>
          {commonFields}
          <input name="author_director" onChange={handleInputChange} placeholder="Author" className="bg-gray-700 p-2 rounded" required />
          <input name="rating" type="number" step="0.1" onChange={handleInputChange} placeholder="Rating (e.g., 4.8)" className="bg-gray-700 p-2 rounded" />
          <input name="reviews" type="number" onChange={handleInputChange} placeholder="Number of Reviews (e.g., 1240)" className="bg-gray-700 p-2 rounded" />
          <input name="pages" type="number" onChange={handleInputChange} placeholder="Pages (e.g., 456)" className="bg-gray-700 p-2 rounded" />
          <input name="releaseYear" type="number" onChange={handleInputChange} placeholder="Published Year (e.g., 2023)" className="bg-gray-700 p-2 rounded" />
          <input name="genre_category" onChange={handleInputChange} placeholder="Category (e.g., Technology)" className="bg-gray-700 p-2 rounded" />
        </>
      );
    }
    if (contentType === 'Video') {
      return (
        <>
          {commonFields}
          <input name="channel" onChange={handleInputChange} placeholder="Channel Name (e.g., Code Academy)" className="bg-gray-700 p-2 rounded" />
          <input name="views" onChange={handleInputChange} placeholder="Views (e.g., 2.3M)" className="bg-gray-700 p-2 rounded" />
          <input name="duration" onChange={handleInputChange} placeholder="Duration (e.g., 15:30)" className="bg-gray-700 p-2 rounded" />
        </>
      );
    }
    return commonFields;
  };

  if (user?.role !== 'Creator') return <div className="text-white text-center p-8">You must be a Creator to upload content.</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6">Upload New Content</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="mb-6"><label className="block mb-2">Select Content Type:</label><select onChange={(e) => setContentType(e.target.value)} value={contentType} className="bg-gray-700 p-2 rounded"><option>Movie</option><option>Book</option><option>Video</option></select></div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderFormFields()}
          <button type="submit" className="md:col-span-2 bg-orange-500 hover:bg-orange-600 p-3 rounded font-bold">Upload Content</button>
        </form>
      </div>
    </div>
  );
};

export default ContentModule;