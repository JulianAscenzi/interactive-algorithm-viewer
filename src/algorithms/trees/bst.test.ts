import { describe, expect, it } from "vitest";
import {
  BSTTree,
  bstInsertSteps,
  bstSearchSteps,
  buildStarterTree,
} from "./bst";

function valuesOf(tree: BSTTree): number[] {
  return Object.values(tree)
    .map((node) => node.value)
    .sort((a, b) => a - b);
}

function cloneTree(tree: BSTTree): BSTTree {
  return Object.fromEntries(
    Object.entries(tree).map(([id, node]) => [id, { ...node }]),
  );
}

describe("bstInsertSteps", () => {
  it("inserts a new value and returns visualization steps without mutating the input tree", () => {
    const { tree, rootId } = buildStarterTree();
    const originalTree = cloneTree(tree);

    const steps = bstInsertSteps(tree, rootId, 65);
    const finalStep = steps[steps.length - 1];
    const insertStep = steps.find((step) => step.type === "insert");

    expect(steps.length).toBeGreaterThan(0);
    expect(insertStep).toBeDefined();
    expect(insertStep?.newNodeId).not.toBeNull();
    expect(finalStep?.rootId).toBe(rootId);
    expect(valuesOf(finalStep!.tree)).toEqual([20, 30, 40, 50, 60, 65, 70, 80]);
    expect(tree).toEqual(originalTree);
  });

  it("skips duplicate values without adding a node", () => {
    const { tree, rootId } = buildStarterTree();

    const steps = bstInsertSteps(tree, rootId, 30);
    const finalStep = steps[steps.length - 1];

    expect(steps.some((step) => step.type === "duplicate")).toBe(true);
    expect(steps.some((step) => step.type === "insert")).toBe(false);
    expect(valuesOf(finalStep!.tree)).toEqual([20, 30, 40, 50, 60, 70, 80]);
  });

  it("inserts into an empty tree as the root", () => {
    const steps = bstInsertSteps({}, null, 42);
    const finalStep = steps[steps.length - 1];

    expect(finalStep?.rootId).not.toBeNull();
    expect(valuesOf(finalStep!.tree)).toEqual([42]);
    expect(steps.some((step) => step.type === "insert" && step.activeNodeId === finalStep?.rootId)).toBe(true);
  });
});

describe("bstSearchSteps", () => {
  it("finds an existing value and highlights the visited path", () => {
    const { tree, rootId } = buildStarterTree();

    const steps = bstSearchSteps(tree, rootId, 60);
    const foundStep = steps.find((step) => step.type === "found");

    expect(foundStep).toBeDefined();
    expect(foundStep?.targetValue).toBe(60);
    expect(foundStep?.activeNodeId).not.toBeNull();
    expect(foundStep?.highlightPath.length).toBeGreaterThan(0);
    expect(foundStep?.tree[foundStep.activeNodeId!].value).toBe(60);
  });

  it("returns a not-found step when the value is absent", () => {
    const { tree, rootId } = buildStarterTree();

    const steps = bstSearchSteps(tree, rootId, 65);
    const finalStep = steps[steps.length - 1];

    expect(finalStep?.type).toBe("not-found");
    expect(finalStep?.targetValue).toBe(65);
    expect(finalStep?.highlightPath.length).toBeGreaterThan(0);
  });
});
