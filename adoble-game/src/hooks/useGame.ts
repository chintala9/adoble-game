import { useCallback, useEffect, useState } from 'react';
import { type GameState, MAX_GUESSES, WORD_LEN } from '../types';
import { WORD_LIST } from '../data';
import { compressToEncodedURIComponent as compress } from 'lz-string';
import {
  freshGame,
  pickWord,
  deserializeGameState,
  serializeGameState,
  restoreFromId,
} from '../utils';

const LS_KEY = 'adobleGame';

export type { GameState }; // Add this
export type UseGameReturn = {
  state: GameState;
  inputLetter: (ltr: string) => void;
  backspace: () => void;
  submitGuess: () => void;
  makeShareId: () => string;
  startNewGame: () => void;
};

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    try {
      const urlId = new URLSearchParams(window.location.search).get('id');
      const fromId = urlId ? restoreFromId(urlId) : null;
      if (fromId) return fromId;

      const saved = localStorage.getItem(LS_KEY);
      if (saved) {
        const rawData = JSON.parse(saved);
        return deserializeGameState(rawData);
      }
    } catch (e) {
      console.warn('Failed to restore game state:', e);
      localStorage.removeItem(LS_KEY); // Clear corrupted data
    }
    return freshGame();
  });

  // Save state to localStorage on change
  useEffect(() => {
    const serializedState = serializeGameState(state);
    localStorage.setItem(LS_KEY, JSON.stringify(serializedState));
  }, [state]);

  // Add a letter to current guess
  const inputLetter = (ltr: string) => {
    setState((s) =>
      s.status !== 'playing' || s.currentGuess.length >= WORD_LEN
        ? s
        : { ...s, currentGuess: s.currentGuess + ltr }
    );
  };

  // Remove last letter
  const backspace = () => {
    setState((s) =>
      s.status !== 'playing' || s.currentGuess.length === 0
        ? s
        : { ...s, currentGuess: s.currentGuess.slice(0, -1) }
    );
  };

  // Evaluate a guess
  const analyseGuess = useCallback(
    (guess: string): GameState => {
      const newGuessArr = [...state.guesses, guess];
      const gLetters = new Set([...state.guessedLetters, ...guess]);

      const correct = new Set(state.correctLetters);
      const wrongPos = new Set(state.wrongPosLetters);
      const notIn = new Set(state.notInWordLetters);

      [...guess].forEach((c, i) => {
        if (state.currentWord[i] === c) {
          correct.add(c);
          wrongPos.delete(c);
        } else if (state.currentWord.includes(c)) {
          if (!correct.has(c)) wrongPos.add(c);
        } else {
          notIn.add(c);
        }
      });

      const won = guess === state.currentWord;
      const lost = !won && newGuessArr.length >= MAX_GUESSES;

      const next: GameState = {
        ...state,
        guesses: newGuessArr,
        currentGuess: '',
        guessedLetters: gLetters,
        correctLetters: correct,
        wrongPosLetters: wrongPos,
        notInWordLetters: notIn,
        wonWords: state.wonWords,
        lostWords: state.lostWords,
        status: state.status,
      };

      if (won) {
        next.wonWords = [...state.wonWords, state.currentWord];
        next.status =
          next.usedWords.length >= WORD_LIST.length ? 'complete' : 'won';
      } else if (lost) {
        next.lostWords = [...state.lostWords, state.currentWord];
        next.status =
          next.usedWords.length >= WORD_LIST.length ? 'complete' : 'lost';
      }

      setState(next);
      return next;
    },
    [state]
  );

  // Submit guess if valid
  const submitGuess = () => {
    if (state.status === 'playing' && state.currentGuess.length === WORD_LEN) {
      analyseGuess(state.currentGuess);
    }
  };

  // Generate shareable game state ID
  const makeShareId = () => {
    return compress(
      JSON.stringify({
        w: WORD_LIST.indexOf(state.currentWord),
        g: state.guesses,
        u: state.usedWords,
        wn: state.wonWords,
        ls: state.lostWords,
      })
    );
  };

  // Start a new game round
  const startNewGame = useCallback(() => {
    setState((s) => {
      if (s.usedWords.length >= WORD_LIST.length) {
        localStorage.removeItem(LS_KEY);
        return freshGame();
      }

      const nextWord = pickWord(s.usedWords);
      return {
        ...s,
        currentWord: nextWord,
        usedWords: [...s.usedWords, nextWord],
        guesses: [],
        currentGuess: '',
        status: 'playing',
        guessedLetters: new Set(),
        correctLetters: new Set(),
        wrongPosLetters: new Set(),
        notInWordLetters: new Set(),
      };
    });
  }, []);

  return {
    state,
    inputLetter,
    backspace,
    submitGuess,
    makeShareId,
    startNewGame,
  };
}
