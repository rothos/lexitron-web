import { NextRequest } from 'next/server';
import { getDefinitions } from '@/src/services/dictionary';
import { getEtymology } from '@/src/services/etymology';
import { SearchResult } from '@/src/types/dictionary';

export async function POST(request: NextRequest) {
  const { searchQuery } = await request.json();

  if (!searchQuery) {
    return new Response('Search query is required', { status: 400 });
  }

  try {
    const [dictionaryData, etymologyData] = await Promise.all([
      getDefinitions(searchQuery),
      getEtymology(searchQuery)
    ]);

    const result: SearchResult = {
      id: crypto.randomUUID(),
      searchTerm: searchQuery,
      timestamp: Date.now(),
      content: {
        definitions: dictionaryData.definitions,
        synonyms: dictionaryData.synonyms,
        etymology: etymologyData.data.items[0]?.vocabularies[0] ? {
          etymology: etymologyData.data.items[0].vocabularies[0].etymology || '',
          word: etymologyData.data.items[0].vocabularies[0].word
        } : undefined
      }
    };

    return Response.json({ result });
  } catch (error) {
    console.error('Search failed:', error);
    return new Response('Search failed', { status: 500 });
  }
} 