export type WordDefinition = {
  text: string;
  partOfSpeech: string;
  source: string;
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
    examples?: string[];
    relatedWords?: string[];
  };
};