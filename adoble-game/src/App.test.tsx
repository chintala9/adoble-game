
import { render, screen, fireEvent, within, cleanup  } from '@testing-library/react';
import App from './App'; 
import { useGame } from './hooks/useGame'; 

import type { GameState, UseGameReturn } from './hooks/useGame'; 

// Mock Grid and Keyboard components
jest.mock('./components/Grid', () => () => <div data-testid="grid" />);
jest.mock('./components/Keyboard', () => (props: {
  onLetter: (letter: string) => void;
  onBack: () => void;
  onEnter: () => void;
}) => (
  <div data-testid="keyboard">
    <button onClick={() => props.onLetter('A')}>A</button>
    <button onClick={props.onBack}>Back</button>
    <button onClick={props.onEnter}>Enter</button>
  </div>
));

// Mock the useGame hook
jest.mock('./hooks/useGame');

const mockedUseGame = useGame as jest.MockedFunction<typeof useGame>;

const mockState: GameState = {
  currentWord: 'ADOBE',
  currentGuess: '',
  guesses: [],
  guessedLetters: new Set<string>(),
  correctLetters: new Set<string>(['A']),
  wrongPosLetters: new Set<string>(['D']),
  notInWordLetters: new Set<string>(['Z']),
  usedWords: [],
  wonWords: ['BRUSH'],
  lostWords: ['PIXEL'],
  status: 'playing',
};

describe('<App />', () => {
  beforeEach(() => {
    mockedUseGame.mockReturnValue({
      state: mockState,
      inputLetter: jest.fn(),
      backspace: jest.fn(),
      submitGuess: jest.fn(),
      makeShareId: jest.fn().mockReturnValue('mockedShareId'),
      startNewGame: jest.fn(),
    } as UseGameReturn);
  });

  test('renders core UI elements', () => {
    render(<App />);
    expect(screen.getByText(/Adoble/i)).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('keyboard')).toBeInTheDocument();
    expect(screen.getByText(/Guess the Adobe-related word/i)).toBeInTheDocument();
  });

  test('displays correct/wrong letters and game stats', () => {
    render(<App />);

    const letterMatchedSection = screen.getByTestId('letters-matched-results');
    const correctLetters = within(letterMatchedSection).getAllByText('A', { exact: false });
    expect(correctLetters.length).toBeGreaterThan(0);

    const letterUnMatchedSection = screen.getByTestId('no-letters-matched-results');
    const inCorrectLetters = within(letterUnMatchedSection).getAllByText('Z', { exact: false });
    expect(inCorrectLetters.length).toBeGreaterThan(0);

    expect(screen.getByText(/Succeeded Words \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Failed Words \(1\)/i)).toBeInTheDocument();
  });

  test('Share button copies correct URL with share ID', async () => {
    Object.assign(navigator, {
      clipboard: { writeText: jest.fn() },
    });

    render(<App />);
    fireEvent.click(screen.getByText('Share'));

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      expect.stringContaining('?id=mockedShareId')
    );
  });

  test('displays win/lose/complete messages based on game status', () => {
    const customStates: Record<string, string> = {
      won: 'You guessed it!',
      lost: 'Out of guesses this round.',
      complete: 'Game over—no words left.',
    };

    for (const [status, message] of Object.entries(customStates)) {
      // Clear any previous renders
      cleanup();
      
      mockedUseGame.mockReturnValue({
        ...mockedUseGame(),
        state: { ...mockState, status: status as GameState['status'] },
      } as UseGameReturn);

      render(<App />);
      expect(screen.getByText(message, { exact: false })).toBeInTheDocument();
    }
  });
});
