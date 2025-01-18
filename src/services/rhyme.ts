import { RhymeResult } from '../types/rhyme';

export async function fetchRhymes(word: string): Promise<RhymeResult[]> {
  const response = await fetch(
    `https://www.rhymezone.com/api/words?k=rza_inline&arhy=1&max=100&sl=${encodeURIComponent(word)}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch rhymes: ${response.statusText}`);
  }

  const results: RhymeResult[] = await response.json();
  return results;
}

export function groupRhymesByPerfectScore(rhymes: RhymeResult[]): RhymeResult[] {
  return rhymes
    .filter(rhyme => rhyme.score === 100 && !rhyme.word.includes(' '))
    .sort((a, b) => a.numSyllables - b.numSyllables);
}

export function groupRhymesBySyllables(rhymes: RhymeResult[]): { [key: number]: RhymeResult[] } {
  return rhymes.reduce((groups: { [key: number]: RhymeResult[] }, rhyme) => {
    const syllables = rhyme.numSyllables;
    if (!groups[syllables]) {
      groups[syllables] = [];
    }
    groups[syllables].push(rhyme);
    return groups;
  }, {});
} 