// Type definitions
export type GameStatus = 'playing' | 'won' | 'lost' | 'complete';

export interface GameState {
  currentWord: string;
  guesses: string[];
  currentGuess: string;
  status: GameStatus;
  usedWords: string[];
  wonWords: string[];
  lostWords: string[];
  guessedLetters: Set<string>;
  correctLetters: Set<string>;
  wrongPosLetters: Set<string>;
  notInWordLetters: Set<string>;
}

export const MAX_GUESSES = 6;
export const WORD_LEN = 5;
