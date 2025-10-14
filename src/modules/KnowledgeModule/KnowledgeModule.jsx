import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, Edit, Trash2, Search, ThumbsUp } from 'lucide-react';
import ArticleStatsChart from './components/ArticleStatsChart';
import NotificationSystem from '../../components/Notifications/NotificationSystem';
import ArticleViewModal from './components/ArticleViewModal';
import EditArticleModal from './components/EditArticleModal';
import ReportArticleModal from './components/ReportArticleModal';

const KnowledgeModule = () => {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [articleStats, setArticleStats] = useState(null);
  const [newArticleData, setNewArticleData] = useState({ title: '', author: '', category: '', content: '', tags: '', status: 'Draft' });
  const [editingArticle, setEditingArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingArticle, setViewingArticle] = useState(null);
  const [reportingArticle, setReportingArticle] = useState(null);
  const [notification, setNotification] = useState(null);

  const fetchData = async () => {
    try {
      const [articlesRes, statsRes] = await Promise.all([
        fetch('http://localhost:5000/api/articles'),
        fetch('http://localhost:5000/api/articles/stats')
      ]);
      const articlesData = await articlesRes.json();
      const statsData = await statsRes.json();
      setArticles(articlesData);
      setArticleStats(statsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setNewArticleData({ ...newArticleData, [e.target.name]: e.target.value });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newArticleData, tags: newArticleData.tags.split(',').map(tag => tag.trim()) }),
      });
      if (!response.ok) throw new Error('Failed to save the article.');
      setNewArticleData({ title: '', author: '', category: '', content: '', tags: '', status: 'Draft' });
      fetchData();
    } catch (error) {
      console.error('Submit Error:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleUpdateSubmit = async (updatedArticle) => {
    try {
        const response = await fetch(`http://localhost:5000/api/articles/${updatedArticle._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedArticle)
        });
        if(!response.ok) throw new Error('Failed to update article');
        setEditingArticle(null);
        fetchData();
    } catch (error) {
        console.error('Update Error:', error);
        alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      await fetch(`http://localhost:5000/api/articles/${id}`, { method: 'DELETE' });
      fetchData(); 
    }
  };

  const handleReviewSubmitted = (status) => {
    if (status === 'success') {
      setNotification({ type: 'success', message: 'Thank you for your review!' });
    } else {
      setNotification({ type: 'error', message: 'Failed to submit review.' });
    }
    setViewingArticle(null);
  };
  
  const handleReportClick = (article) => {
    setViewingArticle(null);
    setReportingArticle(article);
  };

  const handleReportSubmit = async (articleId, reportData) => {
    try {
        const response = await fetch('http://localhost:5000/api/articlereports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...reportData, articleId, reportingUserId: user.id })
        });
        if(!response.ok) throw new Error('Failed to submit report');
        setReportingArticle(null);
        setNotification({ type: 'success', message: 'Report submitted successfully.' });
    } catch (error) {
        console.error('Report Error:', error);
        setNotification({ type: 'error', message: 'Failed to submit report.' });
    }
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (Array.isArray(article.tags) && article.tags.join(' ').toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto p-4 text-white">
      <NotificationSystem notification={notification} onClose={() => setNotification(null)} />
      <h1 className="text-3xl font-bold mb-6 flex items-center"><BookOpen className="mr-3"/>Knowledge Hub Manager</h1>
      
      <form onSubmit={handleCreateSubmit} className="bg-gray-800 p-6 rounded-lg mb-8 space-y-4">
        <h2 className="text-2xl font-bold mb-4">Add a New Article</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="title" value={newArticleData.title} onChange={handleInputChange} placeholder="Article Title" className="bg-gray-700 p-2 rounded" required />
          <input name="author" value={newArticleData.author} onChange={handleInputChange} placeholder="Author Name" className="bg-gray-700 p-2 rounded" required />
          <input name="category" value={newArticleData.category} onChange={handleInputChange} placeholder="Category (e.g., Tech)" className="bg-gray-700 p-2 rounded" required />
          <input name="tags" value={newArticleData.tags} onChange={handleInputChange} placeholder="Tags (comma-separated)" className="bg-gray-700 p-2 rounded" />
        </div>
        <textarea name="content" value={newArticleData.content} onChange={handleInputChange} placeholder="Article content..." className="w-full bg-gray-700 p-2 rounded h-32" required />
        <div className="flex items-center justify-between">
          <select name="status" value={newArticleData.status} onChange={handleInputChange} className="bg-gray-700 p-2 rounded">
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
          </select>
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded font-bold">
            Add Article
          </button>
        </div>
      </form>

      <div className="bg-gray-800 p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Published Articles</h2>
            <div className="relative w-1/3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-gray-700 p-2 pl-10 rounded w-full"
                />
            </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-600">
              <tr>
                <th className="p-2">Title</th><th className="p-2">Category</th><th className="p-2">Author</th><th className="p-2">Status</th><th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(article => (
                <tr key={article._id} className="border-b border-gray-700">
                  <td className="p-2">{article.title}</td>
                  <td className="p-2">{article.category}</td>
                  <td className="p-2">{article.author}</td>
                  <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${article.status === 'Published' ? 'bg-green-500' : 'bg-yellow-500'}`}>{article.status}</span></td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => setViewingArticle(article)} className="text-gray-400 hover:text-white" title="View Article"><ThumbsUp size={16} /></button>
                    <button onClick={() => setEditingArticle(article)} className="text-blue-400 hover:text-blue-300" title="Edit"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(article._id)} className="text-red-400 hover:text-red-300" title="Delete"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {articleStats && (
        <div className="bg-gray-800 p-6 rounded-lg mt-8">
            <ArticleStatsChart stats={articleStats} />
        </div>
      )}
      <ArticleViewModal 
        article={viewingArticle} 
        onClose={() => setViewingArticle(null)}
        onReviewSubmitted={handleReviewSubmitted}
        onReportClick={handleReportClick}
      />
      {editingArticle && (
        <EditArticleModal
            article={editingArticle}
            onClose={() => setEditingArticle(null)}
            onSave={handleUpdateSubmit}
        />
      )}
      {reportingArticle && (
        <ReportArticleModal
            article={reportingArticle}
            onClose={() => setReportingArticle(null)}
            onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default KnowledgeModule;