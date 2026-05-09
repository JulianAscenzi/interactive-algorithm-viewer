import React from "react";
import { Step } from "../algorithms/sorting/bubbleSort";

interface ArrayVisualizerProps {
  step: Step | null;
  inputArray: number[];
}

export function ArrayVisualizer({ step, inputArray }: ArrayVisualizerProps) {
  const arr = step ? step.array : inputArray;
  const maxVal = Math.max(...arr, 1);
  const n = arr.length;

  const SVG_W = 640;
  const SVG_H = 260;
  const BAR_GAP = 6;
  const TOTAL_W = SVG_W - 40;
  const barW = Math.floor((TOTAL_W - BAR_GAP * (n - 1)) / n);
  const maxBarH = SVG_H - 60;

  function getBarColor(i: number): string {
    if (!step) return "var(--bar-default)";
    if (step.sortedIndices.includes(i)) return "var(--bar-sorted)";
    if (step.comparing && step.comparing.includes(i)) {
      return step.swapped ? "var(--bar-swap)" : "var(--bar-compare)";
    }
    return "var(--bar-default)";
  }

  function getLabelColor(i: number): string {
    if (!step) return "var(--label-default)";
    if (step.sortedIndices.includes(i)) return "var(--label-sorted)";
    if (step.comparing && step.comparing.includes(i)) {
      return step.swapped ? "var(--label-swap)" : "var(--label-compare)";
    }
    return "var(--label-default)";
  }

  return (
    <div className="visualizer-container">
      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        style={{ overflow: "visible" }}
      >
        {arr.map((val, i) => {
          const barH = Math.max(Math.round((val / maxVal) * maxBarH), 12);
          const x = 20 + i * (barW + BAR_GAP);
          const y = SVG_H - barH - 30;
          const isActive =
            step?.comparing?.includes(i) || step?.sortedIndices.includes(i);

          return (
            <g key={i}>
              {/* Bar */}
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={Math.min(4, barW / 4)}
                fill={getBarColor(i)}
                style={{
                  transition: "fill 0.15s ease, y 0.3s ease, height 0.3s ease",
                  filter: isActive ? "brightness(1.1)" : "none",
                }}
              />

              {/* Value label on top */}
              <text
                x={x + barW / 2}
                y={y - 6}
                textAnchor="middle"
                fontSize={Math.max(9, Math.min(13, barW - 2))}
                fill={getLabelColor(i)}
                fontFamily="'JetBrains Mono', 'Fira Mono', monospace"
                fontWeight="600"
                style={{ transition: "fill 0.15s ease" }}
              >
                {val}
              </text>

              {/* Index below bar */}
              <text
                x={x + barW / 2}
                y={SVG_H - 10}
                textAnchor="middle"
                fontSize={9}
                fill="var(--index-color)"
                fontFamily="'JetBrains Mono', 'Fira Mono', monospace"
              >
                {i}
              </text>

              {/* Pointer arrow for comparing */}
              {step?.comparing?.includes(i) && !step?.sortedIndices.includes(i) && (
                <text
                  x={x + barW / 2}
                  y={y - 22}
                  textAnchor="middle"
                  fontSize={14}
                  fill={step.swapped ? "var(--bar-swap)" : "var(--bar-compare)"}
                >
                  ▼
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}