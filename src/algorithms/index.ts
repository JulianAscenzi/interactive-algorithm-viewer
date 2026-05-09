import { bubbleSort, BUBBLE_SORT_CODE } from "./sorting/bubbleSort";
import { quickSort, QUICK_SORT_CODE } from "./sorting/quickSort";
import type { Step } from "./sorting/bubbleSort";

export type { Step };

export interface AlgorithmMeta {
  id: string;
  name: string;
  category: string;
  complexity: { time: string; space: string };
  description: string;
  code: string[];
  run: (arr: number[]) => Step[];
}

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: "bubble-sort",
    name: "Bubble Sort",
    category: "Sorting",
    complexity: { time: "O(n²)", space: "O(1)" },
    description: "Repeatedly compares adjacent elements and swaps them if out of order. Simple but inefficient for large arrays.",
    code: BUBBLE_SORT_CODE,
    run: bubbleSort,
  },
  {
    id: "quick-sort",
    name: "Quick Sort",
    category: "Sorting",
    complexity: { time: "O(n log n)", space: "O(log n)" },
    description: "Selects a pivot, partitions the array around it, then recursively sorts each partition. Very fast in practice.",
    code: QUICK_SORT_CODE,
    run: quickSort,
  },
];

export function getAlgorithm(id: string): AlgorithmMeta {
  const algo = ALGORITHMS.find((a) => a.id === id);
  if (!algo) throw new Error(`Algorithm "${id}" not found`);
  return algo;
}