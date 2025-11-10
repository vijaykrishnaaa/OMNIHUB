import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { API_URL } from '../../../apiConfig';

const ArticleReviewForm = ({ articleId, onReviewSubmitted }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        isHelpful: 'yes',
        helpfulFeedback: '',
        updateSuggestion: '',
        clarityRating: 3,
        accuracyRating: 3,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('${API_URL}/api/articlereviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    isHelpful: formData.isHelpful === 'yes',
                    articleId: articleId,
                    authorId: user.id
                })
            });
            if (!response.ok) throw new Error('Failed to submit review');
            onReviewSubmitted('success');
        } catch (error) {
            console.error(error);
            onReviewSubmitted('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-8 pt-6 border-t border-gray-700">
            <h3 className="text-xl font-semibold text-white mb-4">Review this Article</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-300">Was this article helpful?</label>
                    <div className="flex items-center space-x-4 mt-2">
                        <label className="flex items-center">
                            <input type="radio" name="isHelpful" value="yes" checked={formData.isHelpful === 'yes'} onChange={handleChange} className="mr-2" /> Yes
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="isHelpful" value="no" checked={formData.isHelpful === 'no'} onChange={handleChange} className="mr-2" /> No
                        </label>
                    </div>
                </div>
                
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label htmlFor="clarityRating" className="block text-sm font-medium text-gray-300">Clarity Rating: {formData.clarityRating}/5</label>
                        <input id="clarityRating" name="clarityRating" type="range" min="1" max="5" value={formData.clarityRating} onChange={handleChange} className="w-full" />
                    </div>
                    <div className="flex-1">
                        <label htmlFor="accuracyRating" className="block text-sm font-medium text-gray-300">Accuracy Rating: {formData.accuracyRating}/5</label>
                        <input id="accuracyRating" name="accuracyRating" type="range" min="1" max="5" value={formData.accuracyRating} onChange={handleChange} className="w-full" />
                    </div>
                </div>

                <div>
                    <label htmlFor="helpfulFeedback" className="block text-sm font-medium text-gray-300">How was this article helpful? (Optional)</label>
                    <textarea id="helpfulFeedback" name="helpfulFeedback" rows="3" value={formData.helpfulFeedback} onChange={handleChange} className="mt-1 w-full bg-gray-900 p-2 rounded" />
                </div>
                <div>
                    <label htmlFor="updateSuggestion" className="block text-sm font-medium text-gray-300">How could this article be improved? (Optional)</label>
                    <textarea id="updateSuggestion" name="updateSuggestion" rows="3" value={formData.updateSuggestion} onChange={handleChange} className="mt-1 w-full bg-gray-900 p-2 rounded" />
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg font-bold disabled:bg-gray-500">
                        {isSubmitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ArticleReviewForm;
