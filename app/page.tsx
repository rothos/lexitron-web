'use client';

import { useState, useRef, useEffect } from 'react';
import { SearchResult, WordDefinition, WordSynonym } from '@/src/types/dictionary';

type TabType = 'definitions' | 'synonyms' | 'etymology';

const SearchResultItem = ({ result }: { result: SearchResult }) => {
  const [activeTab, setActiveTab] = useState<TabType>('definitions');

  return (
    <div
      key={result.id}
      className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {result.searchTerm}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(result.timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-4 border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setActiveTab('definitions')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'definitions'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Definitions ({result.content.definitions.length})
        </button>
        <button
          onClick={() => setActiveTab('synonyms')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'synonyms'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Synonyms ({result.content.synonyms.length})
        </button>
        <button
          onClick={() => setActiveTab('etymology')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'etymology'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Etymology
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'definitions' && result.content.definitions.map((def, index) => (
          <div key={index} className="border-l-2 border-gray-200 dark:border-gray-600 pl-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {def.partOfSpeech}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                from {def.source}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              {def.text}
            </p>
          </div>
        ))}
        {activeTab === 'synonyms' && (
          <div className="flex flex-wrap gap-2">
            {result.content.synonyms.map((syn, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded-full text-sm text-gray-700 dark:text-gray-300"
                style={{ opacity: syn.score }}
              >
                {syn.word}
              </span>
            ))}
          </div>
        )}
        {activeTab === 'etymology' && result.content.etymology && (
          <div className="prose dark:prose-invert max-w-none" 
               dangerouslySetInnerHTML={{ __html: result.content.etymology.etymology }} />
        )}
      </div>
    </div>
  );
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load search history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Save search history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleSearch = async (query: string = searchQuery) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery: query }),
      });
      
      const data = await response.json();
      setSearchResults(prevResults => [data.result, ...prevResults]);
      
      // Update search history
      setSearchHistory(prev => {
        const newHistory = [query, ...prev.filter(item => item !== query)].slice(0, 50); // Keep last 50 searches
        return newHistory;
      });
      
      setSearchQuery('');
      searchInputRef.current?.focus();
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = (term: string) => {
    // Try to find existing result
    const existingResult = searchResults.find(result => result.searchTerm.toLowerCase() === term.toLowerCase());
    
    if (existingResult) {
      // Scroll to existing result
      resultRefs.current[existingResult.id]?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Re-search for the term
      handleSearch(term);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          Lexitron
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          The word machine
        </p>
        
        <div className="w-full max-w-xl">
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-sm"
              autoFocus
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {/* Search Results */}
          <div className="mt-6 space-y-4">
            {isLoading && (
              <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
              </div>
            )}
            {searchResults.map((result) => (
              <div key={result.id} ref={(el) => {
                resultRefs.current[result.id] = el;
              }}>
                <SearchResultItem result={result} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search History Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Search History</h2>
        <div className="space-y-2">
          {searchHistory.map((term, index) => (
            <button
              key={index}
              onClick={() => handleHistoryClick(term)}
              className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
