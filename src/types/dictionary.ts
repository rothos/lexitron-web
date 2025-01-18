export type WordDefinition = {
  text: string;
  partOfSpeech: string;
  source: string;
};

export type WordSynonym = {
  word: string;
  score: number;
};

export interface WordEtymology {
  etymology: string;
  word: string;
}

export interface SearchResult {
  id: string;
  searchTerm: string;
  timestamp: number;
  content: {
    definitions: WordDefinition[];
    synonyms: WordSynonym[];
    etymology?: WordEtymology;
  };
}