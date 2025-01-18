import { NextRequest } from 'next/server';
import { fetchRhymes, groupRhymesByPerfectScore, groupRhymesBySyllables } from '@/src/services/rhyme';
import { RhymeResult } from '@/src/types/rhyme';

export async function POST(request: NextRequest) {
  const { searchQuery } = await request.json();

  if (!searchQuery) {
    return new Response('Search query is required', { status: 400 });
  }

  try {
    const rhymes = await fetchRhymes(searchQuery);
    const perfectRhymes = groupRhymesByPerfectScore(rhymes);
    const groupedRhymes = groupRhymesBySyllables(perfectRhymes);

    return Response.json({ 
      result: {
        searchTerm: searchQuery,
        rhymes: groupedRhymes
      }
    });
  } catch (error) {
    console.error('Rhyme search failed:', error);
    return new Response('Rhyme search failed', { status: 500 });
  }
} 