import { EtymologyResponse } from '../types/etymology';

const ETYMOLOGY_API_BASE = 'https://www.etymonline.com/api/etymology';

export async function getEtymology(word: string): Promise<EtymologyResponse> {
  const response = await fetch(`${ETYMOLOGY_API_BASE}/?word=${encodeURIComponent(word)}`);
  
  if (!response.ok) {
    throw new Error(`Etymology API error: ${response.statusText}`);
  }

  return response.json();
} 