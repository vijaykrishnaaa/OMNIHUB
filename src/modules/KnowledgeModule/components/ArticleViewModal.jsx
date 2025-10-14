import React from 'react';
import ArticleReviewForm from './ArticleReviewForm';
import { X, AlertTriangle } from 'lucide-react';

const ArticleViewModal = ({ article, onClose, onReviewSubmitted, onReportClick }) => {
    if (!article) return null;
    
    return (
        <div onClick={onClose} className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 rounded-lg p-8 w-full max-w-3xl mx-auto max-h-[90vh] overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={24} />
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">{article.title}</h2>
                        <p className="text-sm text-gray-400 mb-4">by {article.author} in <span className="font-semibold">{article.category}</span></p>
                    </div>
                    <button onClick={() => onReportClick(article)} className="flex items-center text-sm text-yellow-400 hover:text-yellow-300 ml-4 flex-shrink-0">
                        <AlertTriangle size={16} className="mr-2"/> Report this Article
                    </button>
                </div>
                <div className="prose prose-invert max-w-none text-gray-300 whitespace-pre-wrap">
                    {article.content}
                </div>
                <ArticleReviewForm articleId={article._id} onReviewSubmitted={onReviewSubmitted} />
            </div>
        </div>
    );
};

export default ArticleViewModal;