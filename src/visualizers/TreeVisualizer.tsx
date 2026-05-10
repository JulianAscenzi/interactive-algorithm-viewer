import React, { useMemo } from "react";
import { BSTTree, BSTStep } from "../algorithms/trees/bst";

interface TreeVisualizerProps {
  step: BSTStep | null;
  tree: BSTTree;
  rootId: number | null;
}

interface NodeLayout {
  id: number;
  x: number;
  y: number;
  value: number;
}

const NODE_R = 22;
const LEVEL_H = 80;
const SVG_W = 640;

// Assign x positions using in-order traversal index
function computeLayout(
  tree: BSTTree,
  rootId: number | null,
): NodeLayout[] {
  const positions: NodeLayout[] = [];
  let inorderIdx = 0;

  // First pass: count total nodes to size the tree
  function countNodes(id: number | null): number {
    if (id === null) return 0;
    return 1 + countNodes(tree[id]?.left ?? null) + countNodes(tree[id]?.right ?? null);
  }
  const total = countNodes(rootId);

  function walk(id: number | null, depth: number) {
    if (id === null || !tree[id]) return;
    walk(tree[id].left, depth + 1);
    const x = ((inorderIdx + 0.5) / total) * SVG_W;
    const y = NODE_R + depth * LEVEL_H + 16;
    positions.push({ id, x, y, value: tree[id].value });
    inorderIdx++;
    walk(tree[id].right, depth + 1);
  }

  walk(rootId, 0);
  return positions;
}

function getNodeColor(
  id: number,
  step: BSTStep | null,
): { fill: string; stroke: string; textColor: string } {
  if (!step) return { fill: "#252535", stroke: "#3a3a55", textColor: "#8888aa" };

  if (step.newNodeId === id) {
    return { fill: "#065f46", stroke: "#34d399", textColor: "#6ee7b7" };
  }
  if (step.activeNodeId === id) {
    const colors: Record<string, { fill: string; stroke: string; textColor: string }> = {
      "compare-left":  { fill: "#2d1f6e", stroke: "#7c6af7", textColor: "#a78bfa" },
      "compare-right": { fill: "#2d1f6e", stroke: "#7c6af7", textColor: "#a78bfa" },
      "found":         { fill: "#065f46", stroke: "#34d399", textColor: "#6ee7b7" },
      "not-found":     { fill: "#4c1d1d", stroke: "#f87171", textColor: "#fca5a5" },
      "visiting":      { fill: "#1e2a3a", stroke: "#38bdf8", textColor: "#7dd3fc" },
      "insert":        { fill: "#065f46", stroke: "#34d399", textColor: "#6ee7b7" },
    };
    return colors[step.type] ?? { fill: "#252535", stroke: "#7c6af7", textColor: "#a78bfa" };
  }
  if (step.highlightPath.includes(id)) {
    return { fill: "#1c1c30", stroke: "#4a4a70", textColor: "#7777aa" };
  }
  return { fill: "#1a1a28", stroke: "#2e2e44", textColor: "#55556a" };
}

function getEdgeColor(
  parentId: number,
  childId: number,
  step: BSTStep | null,
): string {
  if (!step) return "#2e2e44";
  const pathIdx = step.highlightPath.indexOf(childId);
  if (pathIdx > 0 && step.highlightPath[pathIdx - 1] === parentId) return "#4a4a80";
  if (step.highlightPath.includes(parentId) && step.highlightPath.includes(childId)) return "#4a4a80";
  return "#252535";
}

export function TreeVisualizer({ step, tree, rootId }: TreeVisualizerProps) {
  const treeToRender = step ? step.tree : tree;
  const rootToRender = step ? step.rootId : rootId;

  const layout = useMemo(
    () => computeLayout(treeToRender, rootToRender),
    [treeToRender, rootToRender],
  );

  const posMap = useMemo(() => {
    const m: Record<number, { x: number; y: number }> = {};
    for (const n of layout) m[n.id] = { x: n.x, y: n.y };
    return m;
  }, [layout]);

  const maxY = Math.max(...layout.map((n) => n.y), 60) + NODE_R + 20;

  // Collect all edges
  const edges: { parentId: number; childId: number }[] = [];
  for (const node of layout) {
    const n = treeToRender[node.id];
    if (n.left !== null && posMap[n.left]) edges.push({ parentId: node.id, childId: n.left });
    if (n.right !== null && posMap[n.right]) edges.push({ parentId: node.id, childId: n.right });
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${maxY}`}
        style={{ overflow: "visible", minHeight: 120 }}
      >
        {/* Edges first (behind nodes) */}
        {edges.map(({ parentId, childId }) => {
          const p = posMap[parentId];
          const c = posMap[childId];
          if (!p || !c) return null;
          const color = getEdgeColor(parentId, childId, step);
          // Offset edge endpoints to circle boundary
          const dx = c.x - p.x, dy = c.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const x1 = p.x + (dx / dist) * NODE_R;
          const y1 = p.y + (dy / dist) * NODE_R;
          const x2 = c.x - (dx / dist) * NODE_R;
          const y2 = c.y - (dy / dist) * NODE_R;
          return (
            <line
              key={`${parentId}-${childId}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={color}
              strokeWidth={2}
              style={{ transition: "stroke 0.2s" }}
            />
          );
        })}

        {/* Nodes */}
        {layout.map((n) => {
          const { fill, stroke, textColor } = getNodeColor(n.id, step);
          const isNew = step?.newNodeId === n.id;
          return (
            <g key={n.id} style={{ transition: "transform 0.3s" }}>
              <circle
                cx={n.x} cy={n.y} r={NODE_R}
                fill={fill} stroke={stroke} strokeWidth={isNew ? 2.5 : 1.5}
                style={{ transition: "fill 0.2s, stroke 0.2s" }}
              />
              <text
                x={n.x} y={n.y + 1}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={13} fontWeight="700"
                fontFamily="'JetBrains Mono', monospace"
                fill={textColor}
                style={{ transition: "fill 0.2s" }}
              >
                {n.value}
              </text>
              {isNew && (
                <circle
                  cx={n.x} cy={n.y} r={NODE_R + 6}
                  fill="none" stroke="#34d399" strokeWidth={1.5}
                  strokeDasharray="4 3" opacity={0.6}
                />
              )}
            </g>
          );
        })}

        {/* Empty state */}
        {layout.length === 0 && (
          <text x={SVG_W / 2} y={60} textAnchor="middle"
            fontSize={13} fill="#44445a"
            fontFamily="'JetBrains Mono', monospace">
            Tree is empty — insert a value to begin
          </text>
        )}
      </svg>
    </div>
  );
}