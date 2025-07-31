# Adoble game

A modern React application built with TypeScript, featuring custom hooks, reusable components, and a clean project structure.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

1. Navigate to project directory
```bash
cd <project-name>
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Run test cases or specific tests
```bash
npm test
# or
 npx jest src/utils.test.ts
 npx jest src/hooks/useGame.test.ts
 npx jest src/components/Grid.test.tsx
 npx jest src/components/Keyboard.test.tsx
 npx jest src/App.test.tsx
# or
yarn test
```

5. Build for production
```bash
npm run build
# or
yarn build
```

## Share button

Hosted the application in surge.sh
Creates a url when Share button is clicked (https://adoblegame.surge.sh/)

## Color highlights for letters

- Gray - No matching letter in the word
- Yellow - Matching letter in the word
- Green - Matching letter and correct position in the word


The application will be available at `http://localhost:5173`

## Project Structure

```
├── src/
│   ├── components/         Reusable UI components
│   │   ├── Grid.test.tsx   Test cases for Grid layout component
│   │   ├── Grid.tsx        Grid layout component
│   │   ├── Keyboard.test.tsx Test cases for Keyboard input component
│   │   └── Keyboard.tsx    Keyboard input component
│   ├── hooks/              Custom React hooks
│   │   ├── useGame.test.ts Test cases for game logic
│   │   └── useGame.ts      Game logic and state management
│   ├── App.css             Main application styles
│   ├── App.test.tsx        Test cases for Root component
│   ├── App.tsx             Root component
│   ├── data.tsx            Sample test data
│   ├── index.css           Global styles
│   ├── main.tsx            Application entry point
│   ├── types.ts            TypeScript type definitions
│   ├── utils.test.ts       Test cases for Utility functions
│   ├── utils.ts            Utility functions
│   └── vite-env.d.ts       Vite environment types
├── public/                 Static assets
├── .gitignore              Git ignore rules
├── eslint.config.js        ESLint configuration
├── index.html              HTML template
├── jest.config.cjs         JEST configuration
├── package-lock.json       Dependency lock file
├── package.json            Project dependencies and scripts
├── README.md               Project documentation
├── tailwind.config.js      Tailwind CSS configuration
├── tsconfig.app.json       TypeScript config for app
├── tsconfig.json           Main TypeScript configuration
├── tsconfig.node.json      TypeScript config for Node.js
└── vite.config.ts          Vite build configuration
```

## Built With

- **React** - UI library for building user interfaces
- **TypeScript** - Typed superset of JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting and formatting

## Key Components

### Components
- **Grid.tsx** - Handles grid layout and display logic
- **Keyboard.tsx** - Manages keyboard input and interactions

### Hooks
- **useGame.ts** - Custom hook containing game state management and logic

### Configuration Files
- **vite.config.ts** - Vite bundler configuration
- **tailwind.config.js** - Tailwind CSS customization
- **tsconfig.json** - TypeScript compiler options
- **eslint.config.js** - Code quality and style rules

### Author
  Sri Harsha Chintala
  email: shri.u2@gmail.com
