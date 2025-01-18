import { NextResponse } from 'next/server';
import { DictionaryService } from '@/src/services/dictionary';

if (!process.env.WORDNIK_API_KEY) {
  throw new Error('WORDNIK_API_KEY is not set in environment variables');
}

const dictionaryService = new DictionaryService(process.env.WORDNIK_API_KEY);

export async function POST(request: Request) {
  const { searchQuery } = await request.json();
  
  try {
    const result = await dictionaryService.searchWord(searchQuery);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Error searching word:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word definitions' },
      { status: 500 }
    );
  }
} 