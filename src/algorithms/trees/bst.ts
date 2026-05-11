export type BSTStepType =
  | "idle"
  | "compare-left"
  | "compare-right"
  | "insert"
  | "duplicate"
  | "found"
  | "not-found"
  | "visiting";

export interface BSTNode {
  id: number;
  value: number;
  left: number | null;
  right: number | null;
}

// Flat map of id -> node (easier to clone and diff).
export type BSTTree = Record<number, BSTNode>;

export interface BSTStep {
  tree: BSTTree;
  rootId: number | null;
  activeNodeId: number | null;
  newNodeId: number | null;
  highlightPath: number[];
  type: BSTStepType;
  description: string;
  highlightLine: number;
  targetValue: number;
}

export const BST_INSERT_CODE = [
  "function insert(node, value) {",        // 0
  "  if (node === null) {",                // 1
  "    return new Node(value)  // insert", // 2
  "  }",                                   // 3
  "  if (value < node.value) {",           // 4
  "    node.left = insert(",               // 5
  "      node.left, value)",               // 6
  "  } else if (value > node.value) {",    // 7
  "    node.right = insert(",              // 8
  "      node.right, value)",              // 9
  "  }",                                   // 10
  "  return node",                         // 11
  "}",                                     // 12
];

export const BST_SEARCH_CODE = [
  "function search(node, value) {",        // 0
  "  if (node === null) return false",     // 1
  "  if (node.value === value) {",         // 2
  "    return true  // found!",            // 3
  "  }",                                   // 4
  "  if (value < node.value) {",           // 5
  "    return search(node.left, value)",   // 6
  "  } else {",                            // 7
  "    return search(node.right, value)",  // 8
  "  }",                                   // 9
  "}",                                     // 10
];

let _nextId = 1;
function freshId() {
  return _nextId++;
}

function cloneTree(tree: BSTTree): BSTTree {
  return Object.fromEntries(
    Object.entries(tree).map(([k, v]) => [k, { ...v }]),
  );
}

export function bstInsertSteps(
  initialTree: BSTTree,
  initialRootId: number | null,
  value: number,
): BSTStep[] {
  _nextId = Math.max(1, ...Object.keys(initialTree).map(Number), 0) + 1;

  const steps: BSTStep[] = [];
  let tree = cloneTree(initialTree);
  let rootId = initialRootId;
  let newNodeId: number | null = null;
  const path: number[] = [];

  function snap(
    type: BSTStepType,
    desc: string,
    hl: number,
    activeId: number | null,
  ) {
    steps.push({
      tree: cloneTree(tree),
      rootId,
      activeNodeId: activeId,
      newNodeId,
      highlightPath: [...path],
      type,
      description: desc,
      highlightLine: hl,
      targetValue: value,
    });
  }

  snap("idle", `Inserting value ${value} into the BST.`, 0, null);

  function insertRec(nodeId: number | null): number {
    if (nodeId === null) {
      const id = freshId();
      tree[id] = { id, value, left: null, right: null };
      newNodeId = id;
      return id;
    }

    const node = tree[nodeId];
    path.push(nodeId);

    if (value < node.value) {
      snap("compare-left", `${value} < ${node.value} -> go left`, 4, nodeId);
      const childId = node.left;
      const newLeft = insertRec(childId);
      if (childId === null) {
        tree[nodeId] = { ...tree[nodeId], left: newLeft };
        snap("insert", `Node ${value} inserted as a new leaf.`, 2, newLeft);
      } else {
        tree[nodeId] = { ...tree[nodeId], left: newLeft };
      }
    } else if (value > node.value) {
      snap("compare-right", `${value} > ${node.value} -> go right`, 7, nodeId);
      const childId = node.right;
      const newRight = insertRec(childId);
      if (childId === null) {
        tree[nodeId] = { ...tree[nodeId], right: newRight };
        snap("insert", `Node ${value} inserted as a new leaf.`, 2, newRight);
      } else {
        tree[nodeId] = { ...tree[nodeId], right: newRight };
      }
    } else {
      snap("duplicate", `${value} already exists in the tree; skipping insert.`, 11, nodeId);
    }

    return nodeId;
  }

  if (rootId === null) {
    rootId = insertRec(null);
    snap("insert", `Node ${value} inserted as the root.`, 2, rootId);
  } else {
    insertRec(rootId);
  }

  const inserted = newNodeId !== null;
  snap(
    "idle",
    inserted ? `Done. ${value} is now in the tree.` : `Done. ${value} was already in the tree.`,
    11,
    null,
  );
  return steps;
}

export function bstSearchSteps(
  tree: BSTTree,
  rootId: number | null,
  value: number,
): BSTStep[] {
  const steps: BSTStep[] = [];
  const path: number[] = [];

  function snap(type: BSTStepType, desc: string, hl: number, activeId: number | null) {
    steps.push({
      tree: cloneTree(tree),
      rootId,
      activeNodeId: activeId,
      newNodeId: null,
      highlightPath: [...path],
      type,
      description: desc,
      highlightLine: hl,
      targetValue: value,
    });
  }

  snap("idle", `Searching for value ${value} in the BST.`, 0, null);

  function searchRec(nodeId: number | null) {
    if (nodeId === null) {
      snap("not-found", `Reached null -> ${value} is NOT in the tree.`, 1, null);
      return;
    }

    const node = tree[nodeId];
    path.push(nodeId);
    snap("visiting", `Visiting node ${node.value}`, 2, nodeId);

    if (node.value === value) {
      snap("found", `Found ${value}.`, 3, nodeId);
      return;
    }

    if (value < node.value) {
      snap("compare-left", `${value} < ${node.value} -> go left`, 5, nodeId);
      searchRec(node.left);
    } else {
      snap("compare-right", `${value} > ${node.value} -> go right`, 7, nodeId);
      searchRec(node.right);
    }
  }

  searchRec(rootId);
  return steps;
}

export function buildStarterTree(): { tree: BSTTree; rootId: number } {
  _nextId = 1;
  const values = [50, 30, 70, 20, 40, 60, 80];
  let tree: BSTTree = {};
  let rootId: number | null = null;

  function ins(nodeId: number | null, v: number): number {
    if (nodeId === null) {
      const id = freshId();
      tree[id] = { id, value: v, left: null, right: null };
      return id;
    }
    const node = tree[nodeId];
    if (v < node.value) tree[nodeId] = { ...node, left: ins(node.left, v) };
    else if (v > node.value) tree[nodeId] = { ...node, right: ins(node.right, v) };
    return nodeId;
  }

  for (const v of values) rootId = ins(rootId, v);
  return { tree, rootId: rootId! };
}
