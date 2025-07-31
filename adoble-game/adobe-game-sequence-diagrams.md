# Adobe Game - Sequence Diagrams

This document provides comprehensive sequence diagrams showing the key interactions and data flow in the Adobe Game application.

## Table of Contents

1. [Game Initialization Sequence](#game-initialization-sequence)
2. [User Input Sequence](#user-input-sequence)
3. [Guess Submission Sequence](#guess-submission-sequence)
4. [New Game Sequence](#new-game-sequence)
5. [Share Game Sequence](#share-game-sequence)
6. [State Restoration from Share URL](#state-restoration-from-share-url)
7. [Keyboard Event Handling Sequence](#keyboard-event-handling-sequence)
8. [Error Handling Sequence](#error-handling-sequence)
9. [Component Update Sequence](#component-update-sequence)

---

## Game Initialization Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant LocalStorage
    participant URL
    participant Utils

    User->>App: Load Application
    App->>useGame: Initialize Hook
    useGame->>URL: Check for 'id' parameter
    URL-->>useGame: Return URL parameter or null
    
    alt URL has share ID
        useGame->>Utils: restoreFromId(id)
        Utils->>Utils: decompress(id)
        Utils->>Utils: parse JSON
        Utils-->>useGame: Restored GameState
    else No URL parameter
        useGame->>LocalStorage: getItem('adobleGame')
        LocalStorage-->>useGame: Saved state or null
        
        alt Saved state exists
            useGame->>Utils: deserializeGameState(rawData)
            Utils-->>useGame: Deserialized GameState
        else No saved state
            useGame->>Utils: freshGame()
            Utils->>Utils: pickWord([])
            Utils-->>useGame: New GameState
        end
    end
    
    useGame-->>App: Initial GameState
    App->>App: Render Game UI
    App-->>User: Display Game Interface
```

---

## User Input Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant LocalStorage
    participant Grid
    participant Keyboard

    User->>App: Press Letter Key
    App->>useGame: inputLetter(letter)
    useGame->>useGame: Update currentGuess
    useGame->>LocalStorage: Save updated state
    useGame-->>App: Updated GameState
    
    App->>Grid: Update with new currentGuess
    Grid-->>User: Show letter in active cell
    
    App->>Keyboard: Update letter colors
    Keyboard-->>User: Visual feedback on keys
```

---

## Guess Submission Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant Utils
    participant LocalStorage
    participant Grid
    participant Keyboard

    User->>App: Press Enter (5 letters entered)
    App->>useGame: submitGuess()
    useGame->>useGame: analyseGuess(currentGuess)
    
    useGame->>useGame: Evaluate each letter
    useGame->>useGame: Update letter sets (correct, wrongPos, notIn)
    useGame->>useGame: Check win/loss conditions
    
    alt Guess is correct
        useGame->>useGame: Set status to 'won'
        useGame->>useGame: Add word to wonWords
    else Guess is wrong and 6 attempts used
        useGame->>useGame: Set status to 'lost'
        useGame->>useGame: Add word to lostWords
    else Guess is wrong but attempts remaining
        useGame->>useGame: Keep status as 'playing'
    end
    
    useGame->>LocalStorage: Save updated state
    useGame-->>App: Updated GameState
    
    App->>Grid: Update with new guess and colors
    Grid-->>User: Show colored feedback
    
    App->>Keyboard: Update key colors
    Keyboard-->>User: Visual feedback on used letters
```

---

## New Game Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant Utils
    participant LocalStorage

    User->>App: Click "New Game" button
    App->>useGame: startNewGame()
    
    useGame->>useGame: Check if all words used
    
    alt All words used
        useGame->>LocalStorage: removeItem('adobleGame')
        useGame->>Utils: freshGame()
        Utils->>Utils: pickWord([])
        Utils-->>useGame: New GameState
    else Words remaining
        useGame->>Utils: pickWord(usedWords)
        Utils-->>useGame: Next word
        useGame->>useGame: Reset game state with new word
    end
    
    useGame->>LocalStorage: Save new state
    useGame-->>App: New GameState
    
    App->>App: Reset UI components
    App-->>User: Fresh game interface
```

---

## Share Game Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant Utils
    participant Clipboard
    participant Browser

    User->>App: Click "Share" button
    App->>useGame: makeShareId()
    useGame->>Utils: compress(gameData)
    Utils->>Utils: JSON.stringify({w, g, u, wn, ls})
    Utils->>Utils: compressToEncodedURIComponent()
    Utils-->>useGame: Compressed share ID
    useGame-->>App: Share ID
    
    App->>App: Construct share URL
    App->>Clipboard: writeText(shareURL)
    
    alt Clipboard API supported
        Clipboard-->>App: Success
        App->>App: Show "✓ Copied!" feedback
    else Clipboard API not supported
        Clipboard-->>App: Error
        App->>App: Show fallback feedback
    end
    
    App-->>User: Share feedback message
```

---

## State Restoration from Share URL

```mermaid
sequenceDiagram
    participant User
    participant Browser
    participant App
    participant useGame
    participant Utils
    participant LocalStorage

    User->>Browser: Navigate to share URL
    Browser->>App: Load with URL parameters
    App->>useGame: Initialize Hook
    
    useGame->>Browser: URLSearchParams.get('id')
    Browser-->>useGame: Share ID
    
    useGame->>Utils: restoreFromId(shareId)
    Utils->>Utils: decompressFromEncodedURIComponent(id)
    Utils->>Utils: JSON.parse(decompressed)
    Utils->>Utils: Reconstruct GameState
    Utils-->>useGame: Restored GameState
    
    useGame->>LocalStorage: Save restored state
    useGame-->>App: Restored GameState
    
    App->>App: Render game with shared state
    App-->>User: Display shared game
```

---

## Keyboard Event Handling Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant Grid
    participant Keyboard

    User->>App: Press keyboard key
    
    alt Letter key (A-Z)
        App->>useGame: inputLetter(key.toUpperCase())
        useGame-->>App: Updated state
        App->>Grid: Update currentGuess display
        Grid-->>User: Show letter in active cell
    else Enter key
        App->>App: Check if currentGuess.length === 5
        alt Valid guess
            App->>useGame: submitGuess()
            useGame-->>App: Processed guess
            App->>Grid: Update with new guess
            App->>Keyboard: Update key colors
        else Invalid guess
            App->>App: Ignore Enter key
        end
    else Backspace key
        App->>useGame: backspace()
        useGame-->>App: Updated state
        App->>Grid: Update currentGuess display
        Grid-->>User: Remove last letter
    else Ctrl+Z
        App->>useGame: backspace()
        useGame-->>App: Updated state
        App->>Grid: Update currentGuess display
        Grid-->>User: Remove last letter
    end
```

---

## Error Handling Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant useGame
    participant LocalStorage
    participant Utils

    User->>App: Load Application
    App->>useGame: Initialize Hook
    
    useGame->>LocalStorage: getItem('adobleGame')
    LocalStorage-->>useGame: Corrupted data
    
    useGame->>Utils: deserializeGameState(corruptedData)
    Utils-->>useGame: Error thrown
    
    useGame->>useGame: Catch error
    useGame->>LocalStorage: removeItem('adobleGame')
    useGame->>Utils: freshGame()
    Utils-->>useGame: New GameState
    
    useGame-->>App: Fresh GameState
    App->>App: Render fresh game
    App-->>User: Display new game
```

---

## Component Update Sequence

```mermaid
sequenceDiagram
    participant User
    participant App
    participant Grid
    participant Keyboard
    participant useGame

    User->>App: Interact with game
    App->>useGame: Update game state
    useGame-->>App: New GameState
    
    par Grid Update
        App->>Grid: Update guesses and currentGuess
        Grid->>Grid: Re-render cells
        Grid-->>User: Visual update
    and Keyboard Update
        App->>Keyboard: Update letter sets
        Keyboard->>Keyboard: Re-render keys
        Keyboard-->>User: Color feedback
    and Statistics Update
        App->>App: Update statistics display
        App-->>User: Show updated stats
    end
```

---

## Data Flow Summary

The sequence diagrams above illustrate the key interactions in the Adobe Game:

1. **Initialization**: Game state is restored from URL, localStorage, or fresh start
2. **User Input**: Letters are processed and state is updated
3. **Guess Processing**: Guesses are evaluated and game state is updated
4. **State Persistence**: All state changes are automatically saved
5. **Sharing**: Game state is compressed and shared via URL
6. **Error Handling**: Corrupted state is detected and handled gracefully

These interactions ensure a smooth, responsive user experience with proper state management and error recovery.

---

## Technical Notes

### Mermaid Compatibility
These diagrams use Mermaid syntax and can be rendered in:
- GitHub (native support)
- GitLab (native support)
- Many documentation platforms
- VS Code with Mermaid extension
- Online Mermaid editors

### Key Components
- **App**: Main React component
- **useGame**: Custom hook managing game state
- **Grid**: Game board display component
- **Keyboard**: Virtual keyboard component
- **Utils**: Utility functions for state management
- **LocalStorage**: Browser storage for persistence

### State Management
- Immutable state updates
- Automatic persistence to localStorage
- URL-based state sharing
- Graceful error recovery

---

*Author: Sri Harsha Chintala*
*Email: shri.u2@gmail.com* 