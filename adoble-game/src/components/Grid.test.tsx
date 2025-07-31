import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Grid from './Grid';

const WORD_LEN = 5;
const MAX_GUESSES = 6;

type ColorFn = (
  guess: string,
  index: number
) => 'correct' | 'wrong' | 'miss' | '';

describe('Grid Component', () => {
  const mockColorFn: ColorFn = jest.fn((guess, idx) => {
    const letter = guess[idx];
    if (letter === 'A') return 'correct';
    if (letter === 'B') return 'wrong';
    if (letter === 'C') return 'miss';
    return '';
  });

  beforeEach(() => {
    (mockColorFn as jest.Mock).mockClear();
  });

  it('renders correct number of rows and cells, all empty initially', () => {
    render(<Grid guesses={[]} currentGuess="" colorFn={mockColorFn} />);

    // Expect 6 rows of guesses
    const rows = screen.getAllByTestId('grid-row');
    expect(rows).toHaveLength(MAX_GUESSES);

    // Each row has 5 cells: total cells = 30
    const cells = screen.getAllByTestId('grid-cell');
    expect(cells).toHaveLength(WORD_LEN * MAX_GUESSES);
  });

  it('displays submitted guesses with color classes from colorFn', () => {
    const guesses = ['ABCDE'];
    render(<Grid guesses={guesses} currentGuess="" colorFn={mockColorFn} />);

    expect((mockColorFn as jest.Mock)).toHaveBeenCalledTimes(WORD_LEN);
    expect((mockColorFn as jest.Mock)).toHaveBeenCalledWith('ABCDE', 0);

    const cells = screen.getAllByTestId('grid-cell');

    // Check first three letters colored as per mock
    expect(cells[0]).toHaveClass('bg-green-600', 'text-white', 'border-green-600'); // 'A' correct
    expect(cells[1]).toHaveClass('bg-yellow-500', 'text-white', 'border-yellow-500'); // 'B' wrong
    expect(cells[2]).toHaveClass('bg-gray-600', 'text-white', 'border-gray-600'); // 'C' miss

    // Remaining cells should have no coloring classes
    for (let i = 3; i < WORD_LEN; i++) {
      expect(cells[i]).not.toHaveClass('bg-green-600', 'bg-yellow-500', 'bg-gray-600');
    }
  });

  it('renders maximum allowed guesses rows properly', () => {
    const guesses = ['GUESS', 'WORDS', 'TESTS', 'CASES', 'FINAL', 'SIXTH'];
    render(
      <Grid guesses={guesses} currentGuess="" colorFn={() => 'correct'} />
    );

    // Check that the grid renders all 6 rows
    const rows = screen.getAllByTestId('grid-row');
    expect(rows).toHaveLength(MAX_GUESSES);

    // Spot-check a letter from guesses
    expect(screen.getAllByText('G').length).toBeGreaterThan(0);
    expect(screen.getAllByText('S').length).toBeGreaterThan(0);
  });

  it('works correctly with a realistic color function and repeated letters', () => {
    const guesses = ['CRANE', 'SLOTH'];
    const currentGuess = 'MIGHT';
    const targetWord = 'LIGHT';

    const realColorFn: ColorFn = (guess, idx) => {
      const letter = guess[idx];
      if (targetWord[idx] === letter) return 'correct';
      if (targetWord.includes(letter)) return 'wrong';
      return 'miss';
    };

    render(
      <Grid
        guesses={guesses}
        currentGuess={currentGuess}
        colorFn={realColorFn}
      />
    );

    // Check some letters presence
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('M')).toBeInTheDocument();

    // Check counts for repeated letters (I,H,T)
    expect(screen.getAllByText('I')).toHaveLength(1);
    expect(screen.getAllByText('H')).toHaveLength(2);
    expect(screen.getAllByText('T')).toHaveLength(2);
  });
});
