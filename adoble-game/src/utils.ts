import { decompressFromEncodedURIComponent as decompress } from 'lz-string';
import { type GameState } from './types';
import { WORD_LIST } from './data';

/* ---------- helpers ---------- */
export const freshGame = (): GameState => {
  const first = pickWord([]);
  return {
    currentWord: first,
    guesses: [],
    currentGuess: '',
    status: 'playing',
    usedWords: [first],
    wonWords: [],
    lostWords: [],
    guessedLetters: new Set(),
    correctLetters: new Set(),
    wrongPosLetters: new Set(),
    notInWordLetters: new Set(),
  };
};

export const pickWord = (used: string[]) =>
  WORD_LIST.filter((w) => !used.includes(w))[
    Math.floor(Math.random() * (WORD_LIST.length - used.length))
  ];

export const serializeGameState = (gameState: GameState) => {
  return {
    ...gameState,
    guessedLetters: Array.from(gameState.guessedLetters),
    correctLetters: Array.from(gameState.correctLetters),
    wrongPosLetters: Array.from(gameState.wrongPosLetters),
    notInWordLetters: Array.from(gameState.notInWordLetters),
  };
};

// After loading from localStorage
export const deserializeGameState = (rawData: any): GameState => {
  return {
    ...rawData,
    guessedLetters: new Set(rawData.guessedLetters || []),
    correctLetters: new Set(rawData.correctLetters || []),
    wrongPosLetters: new Set(rawData.wrongPosLetters || []),
    notInWordLetters: new Set(rawData.notInWordLetters || []),
  };
};

export const restoreFromId = (id: string): GameState | null => {
  try {
    const raw = decompress(id);
    if (!raw) return null;
    const p = JSON.parse(raw);
    return {
      currentWord: WORD_LIST[p.w],
      guesses: p.g,
      currentGuess: '',
      status: 'playing',
      usedWords: p.u,
      wonWords: p.wn,
      lostWords: p.ls,
      guessedLetters: new Set(),
      correctLetters: new Set(),
      wrongPosLetters: new Set(),
      notInWordLetters: new Set(),
    };
  } catch {
    return null;
  }
};
