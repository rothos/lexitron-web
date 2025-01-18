import { NextResponse } from 'next/server';

// Define the schema for our search results
type WordDefinition = {
  text: string;
  partOfSpeech: string;
  source: string;
};

type SearchResult = {
  id: string;
  timestamp: string;
  searchTerm: string;
  metadata: {
    resultCount: number;
    searchDuration: string;
  };
  content: {
    definitions: WordDefinition[];
    // Reserved for future endpoints
    examples?: string[];
    relatedWords?: string[];
  };
};

if (!process.env.WORDNIK_API_KEY) {
  throw new Error('WORDNIK_API_KEY is not set in environment variables');
}

export async function POST(request: Request) {
  const { searchQuery } = await request.json();
  
  const startTime = Date.now();
  
  try {
    const response = await fetch(
      `https://api.wordnik.com/v4/word.json/${encodeURIComponent(searchQuery)}/definitions?limit=5&api_key=${process.env.WORDNIK_API_KEY}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Wordnik API responded with status: ${response.status}`);
    }

    const definitions = await response.json();
    
    const result: SearchResult = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      searchTerm: searchQuery,
      metadata: {
        resultCount: definitions.length,
        searchDuration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
      },
      content: {
        definitions: definitions.map((def: any) => ({
          text: def.text,
          partOfSpeech: def.partOfSpeech,
          source: def.sourceDictionary,
        })),
      },
    };
    
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error fetching from Wordnik:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word definitions' },
      { status: 500 }
    );
  }
} 