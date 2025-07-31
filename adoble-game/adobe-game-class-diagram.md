# Adobe Game - Class Diagram

This document provides a comprehensive class diagram showing the structure and relationships of all components, hooks, types, and utilities in the Adobe Game application.

## Main Class Diagram

```mermaid
classDiagram
    %% Main Application Component
    class App {
        +showShareFeedback: boolean
        +containerRef: RefObject
        +handleKeyDown(event: KeyboardEvent): void
        +handleShare(): Promise~void~
        +colorFn(guess: string, idx: number): string
        +render(): JSX.Element
    }

    %% Game State Types
    class GameState {
        +currentWord: string
        +guesses: string[]
        +currentGuess: string
        +status: GameStatus
        +usedWords: string[]
        +wonWords: string[]
        +lostWords: string[]
        +guessedLetters: Set~string~
        +correctLetters: Set~string~
        +wrongPosLetters: Set~string~
        +notInWordLetters: Set~string~
    }

    class GameStatus {
        <<enumeration>>
        playing
        won
        lost
        complete
    }

    %% Custom Hook
    class useGame {
        +state: GameState
        +inputLetter(ltr: string): void
        +backspace(): void
        +submitGuess(): void
        +makeShareId(): string
        +startNewGame(): void
        -analyseGuess(guess: string): GameState
        -LS_KEY: string
    }

    %% UI Components
    class Grid {
        +guesses: string[]
        +currentGuess: string
        +colorFn: (g: string, i: number) => string
        +render(): JSX.Element
        -MAX_GUESSES: number
        -WORD_LEN: number
    }

    class Keyboard {
        +onLetter: (c: string) => void
        +onEnter: () => void
        +onBack: () => void
        +correct: Set~string~
        +wrongPos: Set~string~
        +miss: Set~string~
        +enterDisabled: boolean
        +undoDisabled: boolean
        +render(): JSX.Element
        -rows: string[]
        -keyColor(k: string): string
    }

    %% Utility Functions
    class Utils {
        <<static>>
        +freshGame(): GameState
        +pickWord(used: string[]): string
        +serializeGameState(gameState: GameState): object
        +deserializeGameState(rawData: any): GameState
        +restoreFromId(id: string): GameState | null
    }

    %% Data
    class Data {
        <<static>>
        +WORD_LIST: string[]
    }

    %% Constants
    class Constants {
        <<static>>
        +MAX_GUESSES: number = 6
        +WORD_LEN: number = 5
    }

    %% Relationships
    App --> useGame : uses
    App --> Grid : renders
    App --> Keyboard : renders
    App --> GameState : manages state
    App --> GameStatus : uses

    useGame --> GameState : manages
    useGame --> GameStatus : uses
    useGame --> Utils : uses
    useGame --> Data : uses
    useGame --> Constants : uses

    Grid --> GameState : displays
    Grid --> Constants : uses
    Grid --> GameStatus : uses

    Keyboard --> GameState : displays
    Keyboard --> GameStatus : uses

    Utils --> GameState : processes
    Utils --> Data : uses
    Utils --> Constants : uses

    Data --> Constants : references
```

## Component Hierarchy Diagram

```mermaid
classDiagram
    class App {
        +state: GameState
        +showShareFeedback: boolean
        +containerRef: RefObject
        +handleKeyDown()
        +handleShare()
        +colorFn()
        +render()
    }

    class GameContainer {
        +header: JSX.Element
        +gameGrid: JSX.Element
        +keyboard: JSX.Element
        +statistics: JSX.Element
        +controls: JSX.Element
        +gameStatus: JSX.Element
        +colorLegend: JSX.Element
    }

    class Header {
        +title: string
        +subtitle: string
        +render()
    }

    class StatisticsPanel {
        +lettersMatched: JSX.Element
        +lettersNotInWord: JSX.Element
        +succeededWords: JSX.Element
        +failedWords: JSX.Element
        +render()
    }

    class ControlsPanel {
        +newGameButton: JSX.Element
        +shareButton: JSX.Element
        +render()
    }

    class GameStatusPanel {
        +status: GameStatus
        +wonCount: number
        +lostCount: number
        +render()
    }

    class ColorLegend {
        +render()
    }

    App --> GameContainer : contains
    GameContainer --> Header : contains
    GameContainer --> Grid : contains
    GameContainer --> Keyboard : contains
    GameContainer --> StatisticsPanel : contains
    GameContainer --> ControlsPanel : contains
    GameContainer --> GameStatusPanel : contains
    GameContainer --> ColorLegend : contains
```

## State Management Flow

```mermaid
classDiagram
    class User {
        +inputLetter()
        +backspace()
        +submitGuess()
        +startNewGame()
        +shareGame()
    }

    class App {
        +handleKeyDown()
        +handleShare()
        +colorFn()
    }

    class useGame {
        +state: GameState
        +inputLetter()
        +backspace()
        +submitGuess()
        +startNewGame()
        +makeShareId()
        -analyseGuess()
    }

    class GameState {
        +currentWord
        +guesses
        +currentGuess
        +status
        +usedWords
        +wonWords
        +lostWords
        +guessedLetters
        +correctLetters
        +wrongPosLetters
        +notInWordLetters
    }

    class LocalStorage {
        +getItem()
        +setItem()
        +removeItem()
    }

    class Utils {
        +freshGame()
        +pickWord()
        +serializeGameState()
        +deserializeGameState()
        +restoreFromId()
    }

    User --> App : interacts
    App --> useGame : calls methods
    useGame --> GameState : updates
    useGame --> LocalStorage : persists
    useGame --> Utils : uses utilities
    GameState --> LocalStorage : saved to
    Utils --> GameState : creates/processes
```

## Data Flow Architecture

```mermaid
classDiagram
    class ExternalData {
        +URL Parameters
        +LocalStorage
        +Clipboard API
        +Keyboard Events
    }

    class DataLayer {
        +WORD_LIST: string[]
        +Constants
        +Utils
    }

    class StateLayer {
        +GameState
        +GameStatus
        +useGame Hook
    }

    class ComponentLayer {
        +App
        +Grid
        +Keyboard
        +Statistics
        +Controls
    }

    class UserInterface {
        +Game Board
        +Virtual Keyboard
        +Statistics Display
        +Control Buttons
        +Color Feedback
    }

    ExternalData --> DataLayer : provides input
    DataLayer --> StateLayer : initializes
    StateLayer --> ComponentLayer : manages
    ComponentLayer --> UserInterface : renders
    UserInterface --> ExternalData : user interaction
```

## Hook Dependencies

```mermaid
classDiagram
    class useGame {
        +state: GameState
        +inputLetter()
        +backspace()
        +submitGuess()
        +makeShareId()
        +startNewGame()
        -analyseGuess()
    }

    class ReactHooks {
        +useState()
        +useEffect()
        +useCallback()
        +useRef()
    }

    class GameLogic {
        +Word Selection
        +Guess Evaluation
        +State Updates
        +Win/Loss Detection
    }

    class Persistence {
        +LocalStorage
        +URL Compression
        +State Serialization
    }

    class Validation {
        +Input Validation
        +State Validation
        +Error Handling
    }

    useGame --> ReactHooks : uses
    useGame --> GameLogic : implements
    useGame --> Persistence : manages
    useGame --> Validation : includes
```

## Component Props Interface

```mermaid
classDiagram
    class GridProps {
        +guesses: string[]
        +currentGuess: string
        +colorFn: (g: string, i: number) => string
    }

    class KeyboardProps {
        +onLetter: (c: string) => void
        +onEnter: () => void
        +onBack: () => void
        +correct: Set~string~
        +wrongPos: Set~string~
        +miss: Set~string~
        +enterDisabled: boolean
        +undoDisabled: boolean
    }

    class AppProps {
        +None (root component)
    }

    class useGameReturn {
        +state: GameState
        +inputLetter: (ltr: string) => void
        +backspace: () => void
        +submitGuess: () => void
        +makeShareId: () => string
        +startNewGame: () => void
    }

    Grid --> GridProps : receives
    Keyboard --> KeyboardProps : receives
    App --> AppProps : receives
    App --> useGameReturn : uses
```

## Utility Functions Structure

```mermaid
classDiagram
    class Utils {
        <<namespace>>
    }

    class GameInitialization {
        +freshGame(): GameState
        +pickWord(used: string[]): string
    }

    class StateManagement {
        +serializeGameState(gameState: GameState): object
        +deserializeGameState(rawData: any): GameState
    }

    class Sharing {
        +restoreFromId(id: string): GameState | null
    }

    class Validation {
        +validateGameState(state: any): boolean
        +validateGuess(guess: string): boolean
    }

    Utils --> GameInitialization : contains
    Utils --> StateManagement : contains
    Utils --> Sharing : contains
    Utils --> Validation : contains
```

## Key Design Patterns

### 1. Custom Hook Pattern
```mermaid
classDiagram
    class useGame {
        +state: GameState
        +actions: GameActions
        +return: UseGameReturn
    }

    class GameActions {
        +inputLetter()
        +backspace()
        +submitGuess()
        +startNewGame()
        +makeShareId()
    }

    class UseGameReturn {
        +state: GameState
        +inputLetter: Function
        +backspace: Function
        +submitGuess: Function
        +makeShareId: Function
        +startNewGame: Function
    }

    useGame --> GameActions : encapsulates
    useGame --> UseGameReturn : returns
```

### 2. Component Composition Pattern
```mermaid
classDiagram
    class App {
        +render()
    }

    class Grid {
        +render()
    }

    class Keyboard {
        +render()
    }

    class Statistics {
        +render()
    }

    App --> Grid : composes
    App --> Keyboard : composes
    App --> Statistics : composes
```

### 3. State Management Pattern
```mermaid
classDiagram
    class GameState {
        +currentWord: string
        +guesses: string[]
        +currentGuess: string
        +status: GameStatus
        +letterSets: LetterSets
        +wordLists: WordLists
    }

    class LetterSets {
        +guessedLetters: Set~string~
        +correctLetters: Set~string~
        +wrongPosLetters: Set~string~
        +notInWordLetters: Set~string~
    }

    class WordLists {
        +usedWords: string[]
        +wonWords: string[]
        +lostWords: string[]
    }

    GameState --> LetterSets : contains
    GameState --> WordLists : contains
```

## Summary

The Adobe Game follows a clean, modular architecture with:

1. **Component-Based Design**: Reusable UI components with clear responsibilities
2. **Custom Hook Pattern**: Encapsulated business logic in the `useGame` hook
3. **Type-Safe Development**: Comprehensive TypeScript interfaces
4. **State Management**: Immutable state updates with automatic persistence
5. **Utility Functions**: Pure functions for data processing and validation
6. **Error Handling**: Graceful error recovery and validation

This architecture ensures maintainability, testability, and scalability while providing a smooth user experience. 