import { create } from "zustand";
import { Step, bubbleSort } from "../algorithms/sorting/bubbleSort";

interface AlgorithmStore {
  // Data
  inputArray: number[];
  steps: Step[];
  currentStep: number;

  // Playback
  isPlaying: boolean;
  speed: number; // ms per step (lower = faster)

  // Actions
  setInputArray: (arr: number[]) => void;
  generateRandom: (size?: number) => void;
  runAlgorithm: () => void;
  nextStep: () => void;
  prevStep: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
}

function randomArray(size: number = 12): number[] {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export const useAlgorithmStore = create<AlgorithmStore>((set, get) => ({
  inputArray: randomArray(),
  steps: [],
  currentStep: 0,
  isPlaying: false,
  speed: 400,

  setInputArray: (arr) => {
    set({ inputArray: arr, steps: [], currentStep: 0, isPlaying: false });
  },

  generateRandom: (size = 12) => {
    const arr = randomArray(size);
    set({ inputArray: arr, steps: [], currentStep: 0, isPlaying: false });
  },

  runAlgorithm: () => {
    const { inputArray } = get();
    const steps = bubbleSort(inputArray);
    set({ steps, currentStep: 0, isPlaying: false });
  },

  nextStep: () => {
    const { currentStep, steps } = get();
    if (currentStep < steps.length - 1) {
      set({ currentStep: currentStep + 1 });
    }
  },

  prevStep: () => {
    const { currentStep } = get();
    if (currentStep > 0) {
      set({ currentStep: currentStep - 1 });
    }
  },

  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),

  reset: () => {
    set({ currentStep: 0, isPlaying: false });
  },

  setSpeed: (speed) => set({ speed }),
}));