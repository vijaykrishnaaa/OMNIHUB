import React, { useState, useEffect } from 'react';
import { MessageSquare, Trash2 } from 'lucide-react';

const FeedbackDashboard = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/feedback');
      const data = await response.json();
      setFeedbackList(data);
    } catch (error) {
      console.error("Failed to fetch feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:5000/api/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      setFeedbackList(feedbackList.map(item => 
        item._id === id ? { ...item, status: newStatus } : item
      ));
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback item?')) {
      try {
        await fetch(`http://localhost:5000/api/feedback/${id}`, { method: 'DELETE' });
        setFeedbackList(feedbackList.filter(item => item._id !== id));
      } catch (error) {
        console.error("Failed to delete feedback:", error);
      }
    }
  };

  if (loading) return <p className="text-white p-6 text-center">Loading feedback...</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 text-white">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <MessageSquare className="mr-3"/> User Feedback Dashboard
      </h1>
      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-4">Email</th>
                <th className="p-4">Type</th>
                <th className="p-4">Message</th>
                <th className="p-4">Status</th>
                <th className="p-4">Submitted</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbackList.map(item => (
                <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-4">{item.userEmail}</td>
                  <td className="p-4">{item.feedbackType}</td>
                  <td className="p-4 max-w-sm truncate" title={item.message}>{item.message}</td>
                  <td className="p-4">
                    <select 
                      value={item.status} 
                      onChange={(e) => handleUpdateStatus(item._id, e.target.value)}
                      className="bg-gray-600 rounded p-1.5 text-xs border border-gray-500"
                    >
                      <option>New</option>
                      <option>Under Review</option>
                      <option>Resolved</option>
                      <option>Closed</option>
                    </select>
                  </td>
                  <td className="p-4 text-sm text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(item._id)} className="text-gray-400 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FeedbackDashboard;