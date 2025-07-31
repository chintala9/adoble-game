// __tests__/useGame.test.ts
import { renderHook, act } from '@testing-library/react';
import { useGame } from './useGame';
import * as utils from '../utils';
import type { GameState } from '../types';

const mockWord = 'CRANE';

const mockGameState: GameState = {
  currentWord: mockWord,
  currentGuess: '',
  guesses: [],
  guessedLetters: new Set(),
  correctLetters: new Set(),
  wrongPosLetters: new Set(),
  notInWordLetters: new Set(),
  usedWords: [],
  wonWords: [],
  lostWords: [],
  status: 'playing',
};

describe('useGame hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    jest.spyOn(utils, 'freshGame').mockReturnValue({ ...mockGameState });
  });

  it('initializes from fresh game if no localStorage or URL param', () => {
    const { result } = renderHook(() => useGame());
    expect(result.current.state.currentWord).toBe(mockWord);
    expect(result.current.state.status).toBe('playing');
  });

  it('inputLetter adds letter to current guess', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.inputLetter('C');
    });
    expect(result.current.state.currentGuess).toBe('C');
  });

  it('backspace removes last letter', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.inputLetter('C');
      result.current.backspace();
    });
    expect(result.current.state.currentGuess).toBe('');
  });

  it('submitGuess processes correct guess as win', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      [...mockWord].forEach((ltr) => result.current.inputLetter(ltr));
    });
    expect(result.current.state.currentGuess).toBe(mockWord);
    act(() => {
      result.current.submitGuess();
    });
    expect(result.current.state.status).toBe('won');
    expect(result.current.state.guesses).toContain(mockWord);
    expect(result.current.state.wonWords).toContain(mockWord);
  });

  it('startNewGame resets with next word', () => {
    const nextWord = 'PLANE';
    jest.spyOn(utils, 'pickWord').mockReturnValue(nextWord);
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startNewGame();
    });

    expect(result.current.state.currentWord).toBe(nextWord);
    expect(result.current.state.guesses.length).toBe(0);
    expect(result.current.state.status).toBe('playing');
  });

  it('makeShareId compresses game data', () => {
    const { result } = renderHook(() => useGame());
    const shareId = result.current.makeShareId();
    expect(typeof shareId).toBe('string');
    expect(shareId.length).toBeGreaterThan(0);
  });

  it('persists state to localStorage on update', () => {
    const { result } = renderHook(() => useGame());
    act(() => {
      result.current.inputLetter('X');
    });

    const saved = localStorage.getItem('adobleGame');
    expect(saved).toBeTruthy();
  });
});
