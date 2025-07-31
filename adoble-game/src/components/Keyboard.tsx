import { memo } from 'react';

interface Props {
  onLetter: (c: string) => void;
  onEnter: () => void;
  onBack: () => void;
  correct: Set<string>;
  wrongPos: Set<string>;
  miss: Set<string>;
  enterDisabled: boolean;
  undoDisabled: boolean;
}

const rows = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export default memo(function Keyboard({
  onLetter,
  onEnter,
  onBack,
  correct,
  wrongPos,
  miss,
  enterDisabled,
  undoDisabled,
}: Props) {
  const keyColor = (k: string) =>
    (correct.has(k) && 'bg-green-600 text-white') ||
    (wrongPos.has(k) && 'bg-yellow-500 text-white') ||
    (miss.has(k) && 'bg-gray-600 text-white') ||
    'bg-gray-300';

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {rows.map((row, idx) => (
        <div key={idx} className="flex gap-1">
          {idx === 2 && (
            <button
              onClick={onBack}
              className={`px-3 py-2 text-xs font-semibold text-white rounded cursor-pointer ${
                undoDisabled ? 'bg-red-300' : 'bg-red-500'
              }`}
              data-testid="undo"
            >
              ⌫ undo
            </button>
          )}
          {row.split('').map((k) => (
            <button
              key={k}
              onClick={() => onLetter(k)}
              className={`h-10 w-8 rounded ${keyColor(k)}`}
            >
              {k}
            </button>
          ))}
          {idx === 2 && (
            <button
              onClick={onEnter}
              disabled={enterDisabled}
              className={`px-3 py-2 text-xs font-semibold  text-white rounded cursor-pointer ${
                enterDisabled ? 'bg-blue-300' : 'bg-blue-600'
              }`}
              data-testid="submit"
            >
              ↵ submit
            </button>
          )}
        </div>
      ))}
    </div>
  );
});
