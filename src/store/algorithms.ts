import { create } from "zustand";
import { Step, getAlgorithm, ALGORITHMS } from "../algorithms";

const DEFAULT_ARRAY_SIZE = 12;

interface AlgorithmStore {
  // Selection
  selectedId: string;

  // Data
  inputArray: number[];
  arraySize: number;
  steps: Step[];
  currentStep: number;

  // Playback
  isPlaying: boolean;
  speed: number;

  // Actions
  selectAlgorithm: (id: string) => void;
  generateRandom: (size?: number) => void;
  setArraySize: (size: number) => void;
  runAlgorithm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

function randomArray(size = DEFAULT_ARRAY_SIZE): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 80) + 15);
}

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  selectedId: ALGORITHMS[0].id,
  arraySize: DEFAULT_ARRAY_SIZE,
  inputArray: randomArray(DEFAULT_ARRAY_SIZE),
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 400,

  selectAlgorithm: (id) => {
    set({ selectedId: id, steps: [], currentStep: 0, isPlaying: false });
  },

  generateRandom: (size) => {
    const nextSize = size ?? get().arraySize;
    const arr = randomArray(nextSize);
    set({ arraySize: nextSize, inputArray: arr, steps: [], currentStep: 0, isPlaying: false });
  },

  setArraySize: (size) => {
    const arr = randomArray(size);
    set({ arraySize: size, inputArray: arr, steps: [], currentStep: 0, isPlaying: false });
  },

  runAlgorithm: () => {
    const { selectedId, inputArray } = get();
    const algo = getAlgorithm(selectedId);
    const steps = algo.run(inputArray);
    set({ steps, currentStep: 0, isPlaying: true });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) set({ currentStep: currentStep + 1 });
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) set({ currentStep: currentStep - 1 });
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
  reset: () => set({ currentStep: 0, isPlaying: false }),
  setSpeed: (speed) => set({ speed }),
}));
