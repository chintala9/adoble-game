import { WORD_LEN, MAX_GUESSES } from '../types';

interface Props {
  guesses: string[];
  currentGuess: string;
  colorFn: (g: string, i: number) => string;
}

export default function Grid({ guesses, currentGuess, colorFn }: Props) {
  return (
    <div className="grid gap-1 justify-center">
      {Array.from({ length: MAX_GUESSES }).map((_, r) => {
        const guess = guesses[r] || '';
        const isCurrent = r === guesses.length;
        const letter = guess[r] ?? (isCurrent ? currentGuess[r] ?? '' : '');
        const isActive = isCurrent && !letter && r === currentGuess.length;

        return (
          <div key={r} className="grid grid-cols-5 gap-1" data-testid="grid-row">
            {Array.from({ length: WORD_LEN }).map((_, c) => {
              const letter =
                guess[c] ?? (isCurrent ? currentGuess[c] ?? '' : '');
              const cellColor = guess ? colorFn(guess, c) : '';
              return (
                <div
                  key={c}
                  data-testid="grid-cell"
                  className={`h-14 w-14 border-2  border-gray-200 flex items-center justify-center font-bold uppercase text-lg select-none
                    ${
                      cellColor === 'correct' &&
                      'bg-green-600 text-white border-green-600'
                    }
                    ${
                      cellColor === 'wrong' &&
                      'bg-yellow-500 text-white border-yellow-500'
                    }
                    ${
                      cellColor === 'miss' &&
                      'bg-gray-600 text-white border-gray-600'
                    }
                    ${
                      cellColor === 'correct' &&
                      'bg-green-600 text-white border-green-600'
                    }
                    ${
                      cellColor === 'wrong' &&
                      'bg-yellow-500 text-white border-yellow-500'
                    }
                    ${
                      cellColor === 'miss' &&
                      'bg-gray-600 text-white border-gray-600'
                    }
                    ${isActive && 'ring-2 ring-blue-500 animate-pulse'}
                `}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
