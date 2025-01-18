import { NextResponse } from 'next/server';

// Define the schema for our search results
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

export async function POST(request: Request) {
  const { searchQuery } = await request.json();
  
  // Generate a dummy search result
  const result: SearchResult = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    searchTerm: searchQuery,
    metadata: {
      resultCount: Math.floor(Math.random() * 100) + 1,
      searchDuration: `${(Math.random() * 0.5).toFixed(2)}s`,
    },
    content: {
      title: `${searchQuery}`,
      summary: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      details: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    },
  };
  
  return NextResponse.json({ result });
} 