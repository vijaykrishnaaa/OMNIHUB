import React, { useState, useEffect } from 'react';
import { Search, Film, BookOpen, Play, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_URL } from '../../../apiConfig';

const SearchModule = ({ setActiveView }) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const storedHistory = localStorage.getItem('omnihub_search_history');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`${API_URL}/api/search?q=${searchQuery}&filter=${activeFilter}`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };
    const debounceSearch = setTimeout(() => { performSearch(); }, 300);
    return () => clearTimeout(debounceSearch);
  }, [searchQuery, activeFilter]);

  const addToHistory = (term) => {
    if (!term.trim()) return;
    const newHistory = [term, ...searchHistory.filter(item => item !== term)].slice(0, 5);
    setSearchHistory(newHistory);
    localStorage.setItem('omnihub_search_history', JSON.stringify(newHistory));
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    addToHistory(searchQuery);
    setIsFocused(false);
  };

  const handleResultClick = (result) => {
    const viewMap = {
      'Movie': 'movies',
      'Book': 'books',
      'Video': 'videos'
    };
    const view = viewMap[result.contentType];
    if (view) {
      setActiveView(view);
    }
  };

  const getIcon = (type) => {
    const icons = { Movie: Film, Book: BookOpen, Video: Play };
    return icons[type] || Search;
  };
  
  const filters = [
    { id: 'all', label: 'All' },
    { id: 'Video', label: 'Videos' },
    { id: 'Book', label: 'Books' },
    { id: 'Movie', label: 'Movies' },
  ];

  return (
    <div className="max-w-4xl mx-auto pb-20 lg:pb-0">
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-6">Search</h1>
        <form onSubmit={handleSearchSubmit} className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Search for videos, books, movies..."
            className="w-full pl-10 pr-4 py-3 bg-gray-700 rounded-lg text-white"
          />
        </form>
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${activeFilter === filter.id ? 'bg-orange-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
            >
              <span>{filter.label}</span>
            </button>
          ))}
        </div>
      </div>

      {isFocused && searchQuery === '' && searchHistory.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Searches</h2>
          {searchHistory.map((item, index) => (
            <button key={index} onClick={() => setSearchQuery(item)} className="flex items-center w-full text-left p-2 rounded hover:bg-gray-700">
              <Clock size={16} className="mr-3 text-gray-400"/> {item}
            </button>
          ))}
        </div>
      )}

      {searchQuery && (
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white">Results for "{searchQuery}"</h2>
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-gray-400">Searching...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((result) => {
                const Icon = getIcon(result.contentType);
                return (
                  <button key={result._id} onClick={() => handleResultClick(result)} className="w-full text-left bg-gray-700 rounded-lg p-4 flex items-center space-x-4 hover:bg-gray-600">
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-600 rounded-md flex items-center justify-center">
                        <Icon className="w-6 h-6 text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-medium truncate">{result.title}</h3>
                      <p className="text-gray-400 text-sm">by {result.uploadedBy?.username || 'Unknown Creator'}</p>
                    </div>
                  </button>
                );
              })
            ) : (
              <p className="text-gray-500">No results found.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModule;
