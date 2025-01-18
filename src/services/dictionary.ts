import { WordDefinition, SearchResult } from '../types/dictionary';

export class DictionaryService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('WORDNIK_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  async searchWord(searchQuery: string): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(
        `https://api.wordnik.com/v4/word.json/${encodeURIComponent(searchQuery)}/definitions?limit=5&api_key=${this.apiKey}`,
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
      
      return {
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
    } catch (error) {
      throw new Error(`Failed to fetch word definitions: ${error}`);
    }
  }
} 