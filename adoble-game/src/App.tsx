import { useEffect, useRef, useState } from 'react';

import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { useGame } from './hooks/useGame';

function App() {
  const {
    state,
    inputLetter,
    backspace,
    submitGuess,
    makeShareId,
    startNewGame,
  } = useGame();

  const [showShareFeedback, setShowShareFeedback] = useState(false);

  const isEnterEnabled = state.currentGuess.length === 5;
  const isUndoEnabled = state.currentGuess.length === 0;

  /* cell-color resolver for Grid */
  const colorFn = (guess: string, idx: number) => {
    const l = guess[idx];
    console.log('colorFn', state.currentWord[idx], l);
    return state.currentWord[idx] === l
      ? 'correct'
      : state.currentWord.includes(l)
      ? 'wrong'
      : 'miss';
  };

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.href}?id=${makeShareId()}`
      );
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      // Fallback for browsers that don't support clipboard API
      setShowShareFeedback(true);
      setTimeout(() => setShowShareFeedback(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
      backspace();
    } else if (e.key === 'Enter' && isEnterEnabled) {
      submitGuess();
    } else if (e.key === 'Backspace') {
      backspace();
    } else if (/^[a-z]$/i.test(e.key)) {
      inputLetter(e.key.toUpperCase());
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="max-w-md mx-auto p-4 min-h-screen flex flex-col gap-6 outline-none"
    >
      <header className="text-center">
        <h1 className="text-3xl font-extrabold text-red-600">Adoble</h1>
        <p className="text-gray-500">Guess the Adobe-related word!</p>
      </header>

      <Grid
        guesses={state.guesses}
        currentGuess={state.currentGuess}
        colorFn={colorFn}
      />

      <Keyboard
        onLetter={inputLetter}
        onBack={backspace}
        onEnter={submitGuess}
        correct={state.correctLetters}
        wrongPos={state.wrongPosLetters}
        miss={state.notInWordLetters}
        enterDisabled={!isEnterEnabled}
        undoDisabled={isUndoEnabled}
      />

      {/* Statistics Table */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">
            Game Statistics
          </h3>
        </div>

        <div className="p-4 space-y-4">
          {/* Letters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-green-800 mb-2">
                Letters Matched
              </h4>
              <div className="flex flex-wrap gap-1" data-testid='letters-matched-results'>
                {Array.from(
                  new Set([...state.correctLetters, ...state.wrongPosLetters])
                )
                  .sort()
                  .map((l) => (
                    <span key={l} className="mx-1">
                      {l}
                    </span>
                  ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Letters Not in Word
              </h4>
              <div className="flex flex-wrap gap-1" data-testid='no-letters-matched-results'>
                {Array.from(state.notInWordLetters)
                  .sort()
                  .map((l) => (
                    <span key={l} className="mx-1">
                      {l}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Words Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                Succeeded Words ({state.wonWords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {state.wonWords.map((w) => (
                  <span
                    key={w}
                    className="inline-block bg-blue-200 text-blue-800 px-2 py-1 rounded text-sm font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Failed Words ({state.lostWords.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {state.lostWords.map((w) => (
                  <span
                    key={w}
                    className="inline-block bg-red-200 text-red-800 px-2 py-1 rounded text-sm font-medium"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-3">
        <button
          onClick={startNewGame}
          disabled={!state.guessedLetters.size}
          className="px-4 py-2 bg-green-600 text-white rounded cursor-pointer"
        >
          New Game
        </button>

       <button
          onClick={handleShare}
          className={`px-4 py-2 text-white rounded cursor-pointer transition-colors duration-200 ${
            showShareFeedback 
              ? 'bg-green-600' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {showShareFeedback ? '✓ Copied!' : 'Share'}
        </button>
      </div>

      {/* basic stats */}
      <section className="text-center">
        {state.status === 'won' && (
          <p className="text-green-600 font-bold mb-2">You guessed it!</p>
        )}
        {state.status === 'lost' && (
          <p className="text-red-600 font-bold mb-2">
            Out of guesses this round.
          </p>
        )}
        {state.status === 'complete' && (
          <p className="text-gray-600 font-bold mb-2">
            🏁 Game over—no words left.
          </p>
        )}
        <p>
          Won : <strong>{state.wonWords.length}</strong>Lost :{' '}
          <strong>{state.lostWords.length}</strong>
        </p>
      </section>
      {/* Color Legend */}
      <section className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-3 text-center">
          Color Guide
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gray-600 rounded flex-shrink-0"></div>
            <span>Gray - No matching letter in the word</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-yellow-500 rounded flex-shrink-0"></div>
            <span>Yellow - Matching letter in the word</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-green-600 rounded flex-shrink-0"></div>
            <span>Green - Matching letter and correct position in the word</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
