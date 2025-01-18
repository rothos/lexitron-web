import { NextRequest } from 'next/server';
import { getEtymology } from '../../../src/services/etymology';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const word = searchParams.get('word');

  if (!word) {
    return new Response('Word parameter is required', { status: 400 });
  }

  try {
    const etymologyData = await getEtymology(word);
    return Response.json(etymologyData);
  } catch (error) {
    console.error('Etymology lookup error:', error);
    return new Response('Etymology lookup failed', { status: 500 });
  }
} 