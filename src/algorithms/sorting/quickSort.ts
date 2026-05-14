import type { Step, StepType } from "./types";

export const QUICK_SORT_CODE = [
  "function quickSort(arr, low, high) {",   // 0
  "  if (low < high) {",                    // 1
  "    let pivot = arr[high]",              // 2
  "    let i = low - 1",                    // 3
  "    for (let j = low; j < high; j++) {", // 4
  "      if (arr[j] <= pivot) {",           // 5
  "        i++",                            // 6
  "        swap(arr, i, j)",                // 7
  "      }",                                // 8
  "    }",                                  // 9
  "    swap(arr, i + 1, high)  // pivot",   // 10
  "    quickSort(arr, low, i)",             // 11
  "    quickSort(arr, i + 2, high)",        // 12
  "  }",                                    // 13
  "}",                                      // 14
];

export function quickSort(input: number[]): Step[] {
  const arr = [...input];
  const steps: Step[] = [];
  const sortedIndices: number[] = [];

  steps.push({
    array: [...arr], comparing: null, swapped: false,
    sortedIndices: [], pivotIndex: null, partitionRange: null,
    type: "idle", description: "Initial array. Quick Sort will partition around a pivot.",
    highlightLine: 0,
  });

  function addStep(
    type: StepType,
    description: string,
    highlightLine: number,
    comparing: [number, number] | null = null,
    swapped = false,
    pivotIndex: number | null = null,
    partitionRange: [number, number] | null = null,
  ) {
    steps.push({
      array: [...arr], comparing, swapped,
      sortedIndices: [...sortedIndices],
      pivotIndex, partitionRange, type, description, highlightLine,
    });
  }

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    addStep("pivot", `Pivot selected: arr[${high}] = ${pivot}`, 2, null, false, high, [low, high]);

    let i = low - 1;
    addStep("partition", `i = ${i}, scanning from ${low} to ${high - 1}`, 3, null, false, high, [low, high]);

    for (let j = low; j < high; j++) {
      addStep("compare", `Comparing arr[${j}]=${arr[j]} <= pivot(${pivot})?`, 5, [j, high], false, high, [low, high]);

      if (arr[j] <= pivot) {
        i++;
        addStep("partition", `arr[${j}] <= pivot -> i becomes ${i}`, 6, [i, j], false, high, [low, high]);

        if (i !== j) {
          const beforeI = arr[i];
          const beforeJ = arr[j];
          [arr[i], arr[j]] = [arr[j], arr[i]];
          addStep("swap", `Swapping arr[${i}]=${beforeI} and arr[${j}]=${beforeJ}`, 7, [i, j], true, high, [low, high]);
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    const pivotFinal = i + 1;
    sortedIndices.push(pivotFinal);
    addStep("sorted", `Pivot ${pivot} placed at final position ${pivotFinal}`, 10, [i + 1, high], true, pivotFinal, [low, high]);

    return pivotFinal;
  }

  function sort(low: number, high: number) {
    if (low < high) {
      addStep("partition", `Sorting subarray [${low}..${high}]`, 1, null, false, null, [low, high]);
      const pi = partition(low, high);
      addStep("partition", `Recursing left [${low}..${pi - 1}]`, 11, null, false, pi, [low, pi - 1 >= low ? pi - 1 : low]);
      sort(low, pi - 1);
      addStep("partition", `Recursing right [${pi + 1}..${high}]`, 12, null, false, pi, [pi + 1 <= high ? pi + 1 : high, high]);
      sort(pi + 1, high);
    } else if (low === high && !sortedIndices.includes(low)) {
      sortedIndices.push(low);
      addStep("sorted", `Single element arr[${low}]=${arr[low]} is in place`, 1, null, false, low, [low, low]);
    }
  }

  sort(0, arr.length - 1);

  const all = Array.from({ length: arr.length }, (_, i) => i);
  steps.push({
    array: [...arr], comparing: null, swapped: false,
    sortedIndices: all, pivotIndex: null, partitionRange: null,
    type: "sorted", description: "Array fully sorted.",
    highlightLine: 14,
  });

  return steps;
}
