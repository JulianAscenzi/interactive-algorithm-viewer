import React from "react";
import { Step } from "../algorithms";

interface ArrayVisualizerProps {
  step: Step | null;
  inputArray: number[];
}

export function ArrayVisualizer({ step, inputArray }: ArrayVisualizerProps) {
  const arr = step ? step.array : inputArray;
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const SVG_W = 640, SVG_H = 260;
  const GAP = n > 80 ? 1 : n > 50 ? 2 : n > 30 ? 4 : 6;
  const totalW = SVG_W - 40;
  const barW = Math.max(1, Math.floor((totalW - GAP * (n - 1)) / n));
  const maxBarH = SVG_H - 60;

  function getBarColor(i: number): string {
    if (!step) return "var(--bar-default)";
    if (step.sortedIndices.includes(i)) return "var(--bar-sorted)";
    if (step.pivotIndex === i) return "var(--bar-pivot)";
    if (step.comparing?.includes(i)) return step.swapped ? "var(--bar-swap)" : "var(--bar-compare)";
    if (step.partitionRange && i >= step.partitionRange[0] && i <= step.partitionRange[1]) return "var(--bar-partition)";
    return "var(--bar-default)";
  }

  function getLabelColor(i: number): string {
    if (!step) return "var(--label-default)";
    if (step.sortedIndices.includes(i)) return "var(--label-sorted)";
    if (step.pivotIndex === i) return "var(--label-pivot)";
    if (step.comparing?.includes(i)) return step.swapped ? "var(--label-swap)" : "var(--label-compare)";
    return "var(--label-default)";
  }

  return (
    <div className="visualizer-container">
      <svg width="100%" viewBox={`0 0 ${SVG_W} ${SVG_H}`} style={{ overflow: "visible" }}>
        {arr.map((val, i) => {
          const barH = Math.max(Math.round((val / maxVal) * maxBarH), 12);
          const x = 20 + i * (barW + GAP);
          const y = SVG_H - barH - 30;
          const isPivot = step?.pivotIndex === i;
          const isActive = step?.comparing?.includes(i) || step?.sortedIndices.includes(i) || isPivot;

          return (
            <g key={i}>
              <rect x={x} y={y} width={barW} height={barH}
                rx={Math.min(4, barW / 4)}
                fill={getBarColor(i)}
                style={{ transition: "fill 0.15s ease, y 0.3s ease, height 0.3s ease", filter: isActive ? "brightness(1.12)" : "none" }}
              />
              <text x={x + barW / 2} y={y - 6} textAnchor="middle"
                fontSize={Math.max(9, Math.min(13, barW - 2))}
                fill={getLabelColor(i)}
                fontFamily="'JetBrains Mono', 'Fira Mono', monospace"
                fontWeight="600"
                style={{ transition: "fill 0.15s ease" }}
              >{val}</text>
              <text x={x + barW / 2} y={SVG_H - 10} textAnchor="middle"
                fontSize={9} fill="var(--index-color)"
                fontFamily="'JetBrains Mono', monospace"
              >{i}</text>
              {isPivot && (
                <text x={x + barW / 2} y={y - 22} textAnchor="middle" fontSize={13} fill="var(--bar-pivot)">P</text>
              )}
              {!isPivot && step?.comparing?.includes(i) && !step?.sortedIndices.includes(i) && (
                <text x={x + barW / 2} y={y - 22} textAnchor="middle" fontSize={12}
                  fill={step.swapped ? "var(--bar-swap)" : "var(--bar-compare)"}
                >v</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
