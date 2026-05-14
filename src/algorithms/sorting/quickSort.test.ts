import { describe, expect, it } from "vitest";
import { quickSort } from "./quickSort";

describe("quickSort", () => {
  it("returns sorted visualization steps without mutating the input", () => {
    const input = [10, 7, 8, 9, 1, 5];

    const steps = quickSort(input);
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(0);
    expect(finalStep).toBeDefined();
    expect(finalStep?.type).toBe("sorted");
    expect(finalStep?.array).toEqual([1, 5, 7, 8, 9, 10]);
    expect(input).toEqual([10, 7, 8, 9, 1, 5]);
  });

  it("emits pivot and partition metadata for visualization", () => {
    const steps = quickSort([3, 1, 2]);

    expect(steps.some((step) => step.type === "pivot" && step.pivotIndex !== null)).toBe(true);
    expect(steps.some((step) => step.partitionRange !== null)).toBe(true);
    expect(steps.some((step) => step.highlightLine === 10)).toBe(true);
  });
});
