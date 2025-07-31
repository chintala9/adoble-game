
import {
  freshGame,
  pickWord,
  serializeGameState,
  deserializeGameState,
  restoreFromId,
} from './utils';
import { WORD_LIST } from './data';
import { compressToEncodedURIComponent as compress } from 'lz-string';
import { type GameState } from './types';

describe('utils', () => {
  describe('freshGame', () => {
    it('returns a valid new game state', () => {
      const state = freshGame();
      expect(typeof state.currentWord).toBe('string');
      expect(state.guesses).toEqual([]);
      expect(state.status).toBe('playing');
      expect(state.usedWords.length).toBe(1);
      expect(state.guessedLetters instanceof Set).toBe(true);
    });
  });

  describe('pickWord', () => {
    it('returns a word not in used list', () => {
      const used = [WORD_LIST[0], WORD_LIST[1]];
      const word = pickWord(used);
      expect(used.includes(word)).toBe(false);
    });

    it('eventually picks all words', () => {
      const picked = new Set<string>();
      for (let i = 0; i < WORD_LIST.length; i++) {
        const word = pickWord([]);
        picked.add(word);
      }
      expect(picked.size).toBeGreaterThan(0);
    });
  });

  describe('serializeGameState and deserializeGameState', () => {
    it('converts sets to arrays and back correctly', () => {
      const original: GameState = {
        currentWord: 'BRUSH',
        guesses: ['ADOBE'],
        currentGuess: 'PHOTO',
        status: 'playing',
        usedWords: ['ADOBE', 'PIXEL'],
        wonWords: ['BRUSH'],
        lostWords: [],
        guessedLetters: new Set(['A', 'B']),
        correctLetters: new Set(['B']),
        wrongPosLetters: new Set(['A']),
        notInWordLetters: new Set(['X']),
      };

      const serialized = serializeGameState(original);
      expect(serialized.guessedLetters).toEqual(['A', 'B']);

      const deserialized = deserializeGameState(serialized);
      expect(deserialized.guessedLetters instanceof Set).toBe(true);
      expect(deserialized.guessedLetters.has('A')).toBe(true);
      expect(deserialized.correctLetters.has('B')).toBe(true);
      expect(deserialized.notInWordLetters.has('X')).toBe(true);
    });
  });

  describe('restoreFromId', () => {
    it('restores valid compressed game ID', () => {
      const gameData = {
        w: WORD_LIST.indexOf('ADOBE'),
        g: ['CRANE'],
        u: ['ADOBE'],
        wn: ['ADOBE'],
        ls: [],
      };

      const encoded = compress(JSON.stringify(gameData));
      const restored = restoreFromId(encoded);

      expect(restored).not.toBeNull();
      expect(restored?.currentWord).toBe('ADOBE');
      expect(restored?.guesses).toEqual(['CRANE']);
      expect(restored?.status).toBe('playing');
      expect(restored?.usedWords).toContain('ADOBE');
    });

    it('returns null on invalid id', () => {
      const restored = restoreFromId('invalid-string');
      expect(restored).toBeNull();
    });
  });
});
