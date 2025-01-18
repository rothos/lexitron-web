export type RhymeResult = {
  word: string;
  score: number;
  numSyllables: number;
};

// Group rhymes by number of syllables
export type GroupedRhymes = {
  [syllables: number]: RhymeResult[];
}; 