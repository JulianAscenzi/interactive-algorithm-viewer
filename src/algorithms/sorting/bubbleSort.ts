export type StepType = "compare" | "swap" | "sorted" | "idle" | "pivot" | "partition";

export interface Step {
  array: number[];
  comparing: [number, number] | null;
  swapped: boolean;
  sortedIndices: number[];
  pivotIndex: number | null;
  partitionRange: [number, number] | null;
  type: StepType;
  description: string;
  highlightLine: number;
}

export const BUBBLE_SORT_CODE = [
  "function bubbleSort(arr) {",                    // 0
  "  for (let i = 0; i < n - 1; i++) {",           // 1
  "    for (let j = 0; j < n - i - 1; j++) {",     // 2
  "      if (arr[j] > arr[j + 1]) {",              // 3
  "        swap(arr, j, j + 1)",                   // 4
  "      }",                                        // 5
  "    }",                                          // 6
  "  }",                                            // 7
  "}",                                              // 8
];

export function bubbleSort(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const n = arr.length;
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr], comparing: null, swapped: false,
    sortedIndices: [], pivotIndex: null, partitionRange: null,
    type: "idle", description: "Initial array. Bubble Sort will push the largest values to the end.",
    highlightLine: 0,
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    steps.push({
      array: [...arr], comparing: null, swapped: false,
      sortedIndices: [...sortedIndices], pivotIndex: null, partitionRange: null,
      type: "partition", description: `Pass ${i + 1}: comparing pairs up to index ${n - i - 2}`,
      highlightLine: 1,
    });

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr], comparing: [j, j + 1], swapped: false,
        sortedIndices: [...sortedIndices], pivotIndex: null, partitionRange: null,
        type: "compare", description: `Comparing arr[${j}]=${arr[j]} and arr[${j + 1}]=${arr[j + 1]}`,
        highlightLine: 3,
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swappedInPass = true;
        steps.push({
          array: [...arr], comparing: [j, j + 1], swapped: true,
          sortedIndices: [...sortedIndices], pivotIndex: null, partitionRange: null,
          type: "swap", description: `arr[${j}] > arr[${j + 1}] -> swapping`,
          highlightLine: 4,
        });
      }
    }

    sortedIndices.push(n - 1 - i);
    steps.push({
      array: [...arr], comparing: null, swapped: false,
      sortedIndices: [...sortedIndices], pivotIndex: null, partitionRange: null,
      type: "sorted", description: `Position ${n - 1 - i} is now correctly placed`,
      highlightLine: 7,
    });

    if (!swappedInPass) {
      for (let k = 0; k < n - 1 - i; k++) sortedIndices.push(k);
      break;
    }
  }

  const all = Array.from({ length: n }, (_, i) => i);
  steps.push({
    array: [...arr], comparing: null, swapped: false,
    sortedIndices: all, pivotIndex: null, partitionRange: null,
    type: "sorted", description: "Array fully sorted.",
    highlightLine: 8,
  });

  return steps;
}
