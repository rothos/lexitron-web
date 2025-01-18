'use client';

import { useState, useRef } from 'react';

type SearchResult = {
  id: string;
  timestamp: string;
  searchTerm: string;
  metadata: {
    resultCount: number;
    searchDuration: string;
  };
  content: {
    title: string;
    summary: string;
    details: string;
  };
};

const SearchResultItem = ({ result }: { result: SearchResult }) => (
  <div
    key={result.id}
    className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600"
  >
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {result.content.title}
      </h3>
      <span className="text-sm text-gray-500 dark:text-gray-400">
        {new Date(result.timestamp).toLocaleTimeString()}
      </span>
    </div>
    <p className="text-gray-600 dark:text-gray-300 mb-2">
      {result.content.summary}
    </p>
    <p className="text-sm text-gray-500 dark:text-gray-400">
      {result.content.details}
    </p>
  </div>
);

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ searchQuery }),
      });
      
      const data = await response.json();
      setSearchResults(prevResults => [data.result, ...prevResults]);
      setSearchQuery('');
      searchInputRef.current?.focus();
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
        Lexitron
      </h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
        The word machine
      </p>
      
      <div className="w-full max-w-xl px-4">
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
            onClick={handleSearch}
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
            <SearchResultItem key={result.id} result={result} />
          ))}
        </div>
      </div>
    </div>
  );
}
