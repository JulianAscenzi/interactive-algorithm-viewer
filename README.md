# Interactive Algorithm Viewer

Visualize algorithms step by step with synchronized data structures, descriptions, playback controls, and highlighted code.

## Features

- Sorting visualizations for Bubble Sort and Quick Sort.
- Binary Search Tree insert and search visualizations.
- Step-by-step playback with previous, next, start, play/pause, and speed controls.
- Code highlighting tied to each visualization step.
- SVG-based array and tree visualizers.
- React + TypeScript + Vite.
- CSS Modules for component-scoped styling.
- Vitest coverage for sorting and BST algorithm step generation.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run tests:

```bash
npm run test
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

```txt
src/
  algorithms/
    sorting/      Sorting algorithm step generators and tests
    trees/        Binary Search Tree logic and tests
    index.ts      Algorithm registry used by the UI
  components/     Shared UI components
  pages/          Larger feature pages, currently the BST page
  store/          Zustand state for sorting visualizations
  visualizers/    SVG renderers for arrays and trees
  App.tsx         Main app shell and section switcher
  main.tsx        React entry point
  index.css       Global tokens, reset, and base page styles
```

Most component styles live next to their component as `*.module.css`. Global CSS is intentionally limited to shared design tokens and base browser reset.

## How Visualization Works

Algorithms do not render UI directly. Instead, each algorithm returns a list of immutable visualization steps.

For sorting, each `Step` includes:

- the array snapshot
- compared indices
- swapped state
- sorted indices
- pivot and partition metadata
- a human-readable description
- the code line to highlight

The UI then reads the current step and passes it to:

- `ArrayVisualizer` for bars and labels
- `CodeHighlighter` for the active code line
- `PlaybackControls` for navigation through the generated steps

BST insert/search follows the same idea with `BSTStep`, but uses tree-specific metadata such as active node, new node, root ID, and highlighted path.

## Adding A Sorting Algorithm

1. Create a new file under `src/algorithms/sorting/`.
2. Import the shared sorting types from `src/algorithms/sorting/types.ts`.
3. Export:
   - an algorithm function returning `Step[]`
   - a `CODE` array containing the displayed code lines
4. Register it in `src/algorithms/index.ts`.
5. Add a focused test next to the algorithm.

The algorithm should copy its input before mutating:

```ts
const arr = [...input];
```

This keeps the original data stable for React state and tests.

## Testing

Current tests cover:

- Bubble Sort sorted output and input immutability.
- Quick Sort sorted output, input immutability, and visualization metadata.
- BST insert, duplicate insert, root insert, successful search, and not-found search.

Run all tests with:

```bash
npm run test
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Zustand
- Vitest
- CSS Modules
