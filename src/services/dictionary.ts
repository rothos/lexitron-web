import { WordDefinition, WordSynonym } from '../types/dictionary';

if (!process.env.WORDNIK_API_KEY) {
  throw new Error('WORDNIK_API_KEY is required');
}

const API_KEY = process.env.WORDNIK_API_KEY;

async function fetchDefinitions(word: string): Promise<WordDefinition[]> {
  const response = await fetch(
    `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions?limit=5&api_key=${API_KEY}`,
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
  return definitions.map((def: any) => ({
    text: def.text,
    partOfSpeech: def.partOfSpeech,
    source: def.sourceDictionary,
  }));
}

async function fetchSynonyms(word: string): Promise<WordSynonym[]> {
  const response = await fetch(
    `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${API_KEY}`,
    {
      headers: {
        'Accept': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Wordnik API responded with status: ${response.status}`);
  }

  const data = await response.json();
  const synonyms = data.find((item: any) => item.relationshipType === 'synonym');
  
  if (!synonyms) return [];
  
  return synonyms.words.map((word: string, index: number) => ({
    word,
    score: 1 - (index * 0.1), // Simple scoring based on position
  }));
}

export async function getDefinitions(searchQuery: string) {
  const [definitions, synonyms] = await Promise.all([
    fetchDefinitions(searchQuery),
    fetchSynonyms(searchQuery),
  ]);
  
  return {
    definitions,
    synonyms,
  };
} 