import { WordDefinition, SearchResult, WordSynonym } from '../types/dictionary';

export class DictionaryService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('WORDNIK_API_KEY is required');
    }
    this.apiKey = apiKey;
  }

  private async fetchDefinitions(word: string): Promise<WordDefinition[]> {
    const response = await fetch(
      `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/definitions?limit=5&api_key=${this.apiKey}`,
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

  private async fetchSynonyms(word: string): Promise<WordSynonym[]> {
    const response = await fetch(
      `https://api.wordnik.com/v4/word.json/${encodeURIComponent(word)}/relatedWords?relationshipTypes=synonym&limitPerRelationshipType=10&api_key=${this.apiKey}`,
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

  async searchWord(searchQuery: string): Promise<SearchResult> {
    const startTime = Date.now();
    
    try {
      const [definitions, synonyms] = await Promise.all([
        this.fetchDefinitions(searchQuery),
        this.fetchSynonyms(searchQuery),
      ]);
      
      return {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        searchTerm: searchQuery,
        metadata: {
          resultCount: definitions.length + synonyms.length,
          searchDuration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
        },
        content: {
          definitions,
          synonyms,
        },
      };
    } catch (error) {
      throw new Error(`Failed to fetch word data: ${error}`);
    }
  }
} 