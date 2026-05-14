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
