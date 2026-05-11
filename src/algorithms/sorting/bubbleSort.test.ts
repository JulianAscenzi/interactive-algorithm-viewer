import { describe, expect, it } from "vitest";
import { bubbleSort } from "./bubbleSort";

describe("bubbleSort", () => {
  it("returns sorted visualization steps without mutating the input", () => {
    const input = [5, 1, 4, 2, 8];

    const steps = bubbleSort(input);
    const finalStep = steps[steps.length - 1];

    expect(steps.length).toBeGreaterThan(0);
    expect(finalStep).toBeDefined();
    expect(finalStep?.type).toBe("sorted");
    expect(finalStep?.array).toEqual([1, 2, 4, 5, 8]);
    expect(input).toEqual([5, 1, 4, 2, 8]);
  });
});
