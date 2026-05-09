export type StepType = "compare" | "swap" | "sorted" | "idle";

export interface Step {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sortedIndices: number[];
  type: StepType;
  description: string;
}

export function bubbleSort(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const n = arr.length;
  const sortedIndices: number[] = [];

  // Initial state
  steps.push({
    array: [...arr],
    comparing: null,
    swapped: false,
    sortedIndices: [],
    type: "idle",
    description: "Initial array. Starting bubble sort...",
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      // Comparing step
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        sortedIndices: [...sortedIndices],
        type: "compare",
        description: `Comparing arr[${j}]=${arr[j]} with arr[${j + 1}]=${arr[j + 1]}`,
      });

      if (arr[j] > arr[j + 1]) {
        // Swap
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedInPass = true;

        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: true,
          sortedIndices: [...sortedIndices],
          type: "swap",
          description: `Exchanging: arr[${j}] and arr[${j + 1}]`,
        });
      }
    }

    // Mark last element of this pass as sorted
    sortedIndices.push(n - 1 - i);
    steps.push({
      array: [...arr],
      comparing: null,
      swapped: false,
      sortedIndices: [...sortedIndices],
      type: "sorted",
      description: `Correctly ${n - 1 - i} ordered position`,
    });

    // Early exit if no swaps
    if (!swappedInPass) {
      for (let k = 0; k < n - 1 - i; k++) {
        sortedIndices.push(k);
      }
      break;
    }
  }

  // Mark all as sorted
  const allSorted = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr],
    comparing: null,
    swapped: false,
    sortedIndices: allSorted,
    type: "sorted",
    description: "Completely sorted array!",
  });

  return steps;
}