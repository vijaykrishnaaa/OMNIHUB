import React, { useState, useEffect } from 'react';
import { Star, Edit, Trash2, MessageCircle, AlertTriangle, HelpCircle, GitCompareArrows } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ReviewStatsChart from './components/ReviewStatsChart';
import EditReviewModal from './components/EditReviewModal';
import CommentsSection from './components/CommentsSection';
import ReportModal from './components/ReportModal';
import AskQuestionModal from './components/AskQuestionModal';
import SuggestAlternativeModal from './components/SuggestAlternativeModal';
import NotificationSystem from '../../components/Notifications/NotificationSystem';

const ReviewsModule = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [newReviewData, setNewReviewData] = useState({ movieName: '', rating: 5, pros: '', cons: '', hasSpoilers: false });
  const [editingReview, setEditingReview] = useState(null);
  const [expandedCommentsId, setExpandedCommentsId] = useState(null);
  const [reportingReview, setReportingReview] = useState(null);
  const [askingQuestionOn, setAskingQuestionOn] = useState(null);
  const [suggestingAlternativeFor, setSuggestingAlternativeFor] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
        const [reviewsRes, statsRes] = await Promise.all([
            fetch('http://localhost:5000/api/reviews'),
            fetch('http://localhost:5000/api/reviews/stats')
        ]);
        const reviewsData = await reviewsRes.json();
        const statsData = await statsRes.json();
        setReviews(reviewsData);
        setReviewStats(statsData);
    } catch (error) {
        console.error("Failed to fetch review data:", error);
    }
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewReviewData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newReviewData, author: user.id, authorId: user.id }),
    });
    setNewReviewData({ movieName: '', rating: 5, pros: '', cons: '', hasSpoilers: false });
    fetchData();
  };
  
  const handleUpdateReview = async (updatedReviewData) => {
    try {
        await fetch(`http://localhost:5000/api/reviews/${updatedReviewData._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...updatedReviewData, authorId: user.id })
        });
        setEditingReview(null);
        fetchData();
        setNotification({ type: 'success', message: 'Review updated successfully!' });
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to update review.' });
    }
  };

  const handleEditClick = (review) => {
    setEditingReview(review);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await fetch(`http://localhost:5000/api/reviews/${reviewId}`, { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authorId: user.id })
      });
      fetchData();
      setNotification({ type: 'success', message: 'Review deleted.' });
    }
  };
  
  const toggleComments = (reviewId) => {
    setExpandedCommentsId(expandedCommentsId === reviewId ? null : reviewId);
  };

  const handleReportSubmit = async (reviewId, reportData) => {
    try {
        const response = await fetch('http://localhost:5000/api/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reportData, reportingUserId: user.id, reportedReviewId: reviewId })
        });
        if (!response.ok) throw new Error('Failed to submit report');
        setNotification({ type: 'success', message: 'Thank you, your report has been submitted.' });
        setReportingReview(null);
    } catch (error) {
        setNotification({ type: 'error', message: 'There was an error submitting your report.' });
    }
  };
  
  const handleQuestionSubmit = async (reviewId, questionData) => {
    try {
        const response = await fetch('http://localhost:5000/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...questionData, askerId: user.id, reviewId })
        });
        if (!response.ok) throw new Error('Failed to submit question');
        setNotification({ type: 'success', message: 'Your question has been sent.' });
        setAskingQuestionOn(null);
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to send question.' });
    }
  };
  
  const handleAlternativeSubmit = async (reviewId, altData) => {
    try {
        const response = await fetch('http://localhost:5000/api/alternatives', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...altData, suggestedById: user.id, originalReviewId: reviewId })
        });
        if (!response.ok) throw new Error('Failed to submit suggestion');
        setNotification({ type: 'success', message: 'Your suggestion has been submitted.' });
        setSuggestingAlternativeFor(null);
    } catch (error) {
        setNotification({ type: 'error', message: 'Failed to submit suggestion.' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 text-white">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
      <h1 className="text-3xl font-bold mb-6">Community Reviews</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-8">
          <form onSubmit={handleCreateSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4">
            <h2 className="text-2xl font-bold">Write a New Review</h2>
            <input name="movieName" value={newReviewData.movieName} onChange={handleInputChange} placeholder="Content Name (Movie, Book, etc.)" className="w-full bg-gray-700 p-2 rounded" required />
            <textarea name="pros" value={newReviewData.pros} onChange={handleInputChange} placeholder="What did you like? (Pros)" className="w-full bg-gray-700 p-2 rounded h-24" />
            <textarea name="cons" value={newReviewData.cons} onChange={handleInputChange} placeholder="What did you dislike? (Cons)" className="w-full bg-gray-700 p-2 rounded h-24" />
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <label>Rating:</label>
                    <input name="rating" type="number" min="1" max="10" step="0.5" value={newReviewData.rating} onChange={handleInputChange} className="bg-gray-700 p-2 rounded w-24" required />
                    <span className="text-yellow-400"><Star /></span>
                </div>
                <div className="flex items-center">
                    <input id="hasSpoilers" name="hasSpoilers" type="checkbox" checked={newReviewData.hasSpoilers} onChange={handleInputChange} className="h-4 w-4 rounded bg-gray-700"/>
                    <label htmlFor="hasSpoilers" className="ml-2 block text-sm text-gray-300">Contains Spoilers</label>
                </div>
            </div>
            <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-bold w-full">Submit New Review</button>
          </form>
          <div className="space-y-6">
            {reviews.map(review => (
              <div key={review._id} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-orange-400">{review.movieName}</h3>
                        <p className="text-sm text-gray-400 mb-2">by {review.author?.username || 'Deleted User'}</p>
                        <div className="flex items-center text-yellow-400 mb-4">
                            {[...Array(Math.floor(review.rating))].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                            <span className="ml-2 font-bold text-lg">{review.rating} / 10</span>
                        </div>
                    </div>
                    {user && review.author && user.id === review.author._id && (
                        <div className="flex space-x-2">
                            <button onClick={() => handleEditClick(review)} className="p-2 hover:bg-gray-700 rounded"><Edit size={16}/></button>
                            <button onClick={() => handleDelete(review._id)} className="p-2 hover:bg-gray-700 rounded"><Trash2 size={16}/></button>
                        </div>
                    )}
                </div>
                {review.hasSpoilers && <span className="inline-block bg-yellow-500/20 text-yellow-300 px-2 py-1 text-xs font-bold rounded-full mb-3">CONTAINS SPOILERS</span>}
                {review.pros && <div className="mt-2"><h4 className="font-semibold text-green-400">Pros:</h4><p className="text-gray-300">{review.pros}</p></div>}
                {review.cons && <div className="mt-2"><h4 className="font-semibold text-red-400">Cons:</h4><p className="text-gray-300">{review.cons}</p></div>}
                
                <div className="flex justify-end items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                    <button onClick={() => toggleComments(review._id)} className="flex items-center text-sm text-gray-400 hover:text-white"><MessageCircle size={16} className="mr-2" />{expandedCommentsId === review._id ? 'Hide' : 'Comments'} ({review.commentCount})</button>
                    {user && review.author && user.id !== review.author._id && (
                        <>
                        <button onClick={() => setAskingQuestionOn(review)} className="flex items-center text-sm text-gray-400 hover:text-white"><HelpCircle size={16} className="mr-2" /> Ask Question</button>
                        <button onClick={() => setSuggestingAlternativeFor(review)} className="flex items-center text-sm text-gray-400 hover:text-white"><GitCompareArrows size={16} className="mr-2" /> Suggest Alternative</button>
                        <button onClick={() => setReportingReview(review)} className="p-2 text-yellow-500 hover:bg-gray-700 rounded" title="Report this review"><AlertTriangle size={16}/></button>
                        </>
                    )}
                </div>
                {expandedCommentsId === review._id && <CommentsSection reviewId={review._id} onCommentPosted={fetchData} />}
              </div>
            ))}
          </div>
        </div>
        <div className="lg:w-1/3">
          <div className="bg-gray-800 p-6 rounded-lg">
            <ReviewStatsChart stats={reviewStats} />
          </div>
        </div>
      </div>
      {editingReview && <EditReviewModal review={editingReview} onClose={() => setEditingReview(null)} onSave={handleUpdateReview}/>}
      {reportingReview && <ReportModal review={reportingReview} onClose={() => setReportingReview(null)} onSubmit={handleReportSubmit}/>}
      {askingQuestionOn && <AskQuestionModal review={askingQuestionOn} onClose={() => setAskingQuestionOn(null)} onSubmit={handleQuestionSubmit} />}
      {suggestingAlternativeFor && <SuggestAlternativeModal review={suggestingAlternativeFor} onClose={() => setSuggestingAlternativeFor(null)} onSubmit={handleAlternativeSubmit} />}
    </div>
  );
};

export default ReviewsModule;