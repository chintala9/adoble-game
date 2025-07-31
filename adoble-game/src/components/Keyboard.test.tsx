import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Keyboard from  './Keyboard';

describe('Keyboard Component', () => {
  const defaultProps = {
    onLetter: jest.fn(),
    onEnter: jest.fn(),
    onBack: jest.fn(),
    correct: new Set<string>(),
    wrongPos: new Set<string>(),
    miss: new Set<string>(),
    enterDisabled: false,
    undoDisabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all letter keys and action buttons', () => {
    render(<Keyboard {...defaultProps} />);
    
    // Test key letters from each row
    expect(screen.getByText('Q')).toBeInTheDocument();
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('Z')).toBeInTheDocument();
    
    // Test action buttons
    expect(screen.getByTestId('undo')).toBeInTheDocument();
    expect(screen.getByTestId('submit')).toBeInTheDocument();
    
    // Count total letter keys (26 letters)
    const letterButtons = screen.getAllByRole('button').filter(button => 
      /^[A-Z]$/.test(button.textContent || '')
    );
    expect(letterButtons).toHaveLength(26);
  });

  it('handles button interactions and disabled states correctly', () => {
    const onLetter = jest.fn();
    const onEnter = jest.fn();
    const onBack = jest.fn();
    
    render(<Keyboard 
      {...defaultProps} 
      onLetter={onLetter}
      onEnter={onEnter}
      onBack={onBack}
      enterDisabled={true}
      undoDisabled={true}
    />);
    
    // Test letter key interaction
    const qKey = screen.getByText('Q');
    fireEvent.click(qKey);
    expect(onLetter).toHaveBeenCalledWith('Q');
    
    // Test undo button (should work even when undoDisabled is true - only affects styling)
    const undoButton = screen.getByTestId('undo');
    fireEvent.click(undoButton);
    expect(onBack).toHaveBeenCalledTimes(1);
    expect(undoButton).toHaveClass('bg-red-300'); // Disabled styling
    
    // Test submit button (should be actually disabled)
    const submitButton = screen.getByTestId('submit');
    fireEvent.click(submitButton);
    expect(onEnter).not.toHaveBeenCalled(); // Should not trigger when disabled
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveClass('bg-blue-300'); // Disabled styling
  });
});