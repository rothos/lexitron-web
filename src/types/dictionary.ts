export type WordDefinition = {
  text: string;
  partOfSpeech: string;
  source: string;
};

export type WordSynonym = {
  word: string;
  score: number;
};

export type SearchResult = {
  id: string;
  timestamp: string;
  searchTerm: string;
  metadata: {
    resultCount: number;
    searchDuration: string;
  };
  content: {
    definitions: WordDefinition[];
    synonyms: WordSynonym[];
    examples?: string[];
    relatedWords?: string[];
  };
};