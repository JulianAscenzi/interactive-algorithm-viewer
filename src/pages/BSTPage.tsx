import React, { useState, useEffect, useRef } from "react";
import {
  BSTTree, BSTStep,
  buildStarterTree, bstInsertSteps, bstSearchSteps,
  BST_INSERT_CODE, BST_SEARCH_CODE,
} from "../algorithms/trees/bst";
import { TreeVisualizer } from "../visualizers/TreeVisualizer";
import { CodeHighlighter } from "../components/CodeHighlighter";

const SPEEDS = [
  { label: "0.5×", ms: 900 },
  { label: "1×",   ms: 500 },
  { label: "2×",   ms: 220 },
  { label: "4×",   ms: 80  },
];

const BADGE: Record<string, [string, string, string]> = {
  idle:           ["◉ Ready",       "#6666aa", "rgba(100,100,170,0.12)"],
  "compare-left": ["← Go Left",     "#7c6af7", "rgba(124,106,247,0.15)"],
  "compare-right":["→ Go Right",    "#7c6af7", "rgba(124,106,247,0.15)"],
  insert:         ["✚ Inserted",    "#34d399", "rgba(52,211,153,0.15)"],
  found:          ["✓ Found",       "#34d399", "rgba(52,211,153,0.15)"],
  "not-found":    ["✗ Not Found",   "#f87171", "rgba(248,113,113,0.15)"],
  visiting:       ["● Visiting",    "#38bdf8", "rgba(56,189,248,0.12)"],
};

type Mode = "insert" | "search";

export default function BSTPage() {
  const starter = buildStarterTree();
  const [tree, setTree]       = useState<BSTTree>(starter.tree);
  const [rootId, setRootId]   = useState<number | null>(starter.rootId);
  const [mode, setMode]       = useState<Mode>("insert");
  const [inputVal, setInputVal] = useState("");
  const [steps, setSteps]     = useState<BSTStep[]>([]);
  const [cur, setCur]         = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps.length > 0 ? steps[cur] : null;
  const isFinished = steps.length > 0 && cur >= steps.length - 1;
  const progress = steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 0;
  const code = mode === "insert" ? BST_INSERT_CODE : BST_SEARCH_CODE;

  // Keep tree state in sync after insert animation ends
  useEffect(() => {
    if (isFinished && step && mode === "insert") {
      setTree(step.tree);
      if (step.rootId !== null) setRootId(step.rootId);
    }
  }, [isFinished]);

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (playing && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCur((c) => {
          if (c >= steps.length - 1) { setPlaying(false); return c; }
          return c + 1;
        });
      }, speedMs);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, speedMs, steps.length]);

  function handleRun() {
    const v = parseInt(inputVal, 10);
    if (isNaN(v) || v < 0 || v > 999) return;
    setPlaying(false);
    if (mode === "insert") {
      setSteps(bstInsertSteps(tree, rootId, v));
    } else {
      setSteps(bstSearchSteps(tree, rootId, v));
    }
    setCur(0);
  }

  function handleReset() {
    setPlaying(false);
    const s = buildStarterTree();
    setTree(s.tree);
    setRootId(s.rootId);
    setSteps([]);
    setCur(0);
    setInputVal("");
  }

  function handleModeSwitch(m: Mode) {
    setMode(m);
    setSteps([]);
    setCur(0);
    setPlaying(false);
  }

  const badge = step ? BADGE[step.type] : null;

  // Cleanup: stop playback on unmount
  useEffect(() => {
    return () => setPlaying(false);
  }, []);

  return (
    <div className="bst-page">
      {/* Mode tabs */}
      <div className="bst-tabs">
        <button
          className={`bst-tab ${mode === "insert" ? "active" : ""}`}
          onClick={() => handleModeSwitch("insert")}
        >
          <span>Insert</span>
          <code>O(h)</code>
        </button>
        <button
          className={`bst-tab ${mode === "search" ? "active" : ""}`}
          onClick={() => handleModeSwitch("search")}
        >
          <span>Search</span>
          <code>O(h)</code>
        </button>
        <div className="bst-tab-note">h = tree height</div>
      </div>

      {/* Input row */}
      <div className="bst-input-row">
        <input
          className="bst-input"
          type="number"
          min={0} max={999}
          placeholder="Enter a value (0–999)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRun()}
        />
        <button className="btn btn-primary" onClick={handleRun}
          disabled={inputVal === "" || isNaN(parseInt(inputVal, 10))}>
          {mode === "insert" ? "✚ Insert" : "🔍 Search"}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          ↺ Reset Tree
        </button>
      </div>

      {/* Step description */}
      <div className="description-bar">
        <span className="step-description">
          {step
            ? step.description
            : mode === "insert"
              ? "Enter a value and press Insert to animate the insertion."
              : "Enter a value and press Search to trace the lookup path."}
        </span>
        {badge && (
          <span className="step-type-badge" style={{ color: badge[1], background: badge[2] }}>
            {badge[0]}
          </span>
        )}
      </div>

      {/* Tree + Code */}
      <div className="viz-code-layout">
        <div className="viz-panel">
          <div className="panel-label">Binary Search Tree</div>
          <div style={{ padding: "12px 10px 8px" }}>
            <TreeVisualizer step={step} tree={tree} rootId={rootId} />
          </div>
          {/* Legend */}
          <div className="legend" style={{ padding: "0 16px 16px" }}>
            {[
              ["#1a1a28","#2e2e44",  "Default"],
              ["#2d1f6e","#7c6af7",  "Comparing"],
              ["#1e2a3a","#38bdf8",  "Visiting"],
              ["#065f46","#34d399",  "Inserted / Found"],
              ["#4c1d1d","#f87171",  "Not Found"],
            ].map(([fill, stroke, label]) => (
              <div key={label} className="legend-item">
                <svg width="14" height="14" style={{ flexShrink: 0 }}>
                  <circle cx="7" cy="7" r="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="code-panel">
          <div className="panel-label">Code</div>
          <CodeHighlighter
            code={code}
            activeLine={step?.highlightLine ?? 0}
            stepType={step?.type ?? "idle"}
          />
        </div>
      </div>

      {/* Playback controls */}
      {steps.length > 0 && (
        <div className="control-panel">
          <div className="step-info">
            <span className="step-badge">Step {cur + 1} / {steps.length}</span>
            {isFinished && (
              <span className="done-badge">
                {mode === "insert" ? "✚ Inserted" : step?.type === "found" ? "✓ Found" : "✗ Not Found"}
              </span>
            )}
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="controls-row">
            <button className="btn btn-icon" onClick={() => { setPlaying(false); setCur(0); }}
              disabled={cur === 0}>⏮</button>
            <button className="btn btn-icon" onClick={() => { setPlaying(false); setCur((c) => Math.max(0, c - 1)); }}
              disabled={cur === 0}>◀◀</button>
            <button className="btn btn-icon btn-play"
              onClick={() => setPlaying((p) => !p)} disabled={isFinished}>
              {playing ? "⏸" : "▶"}
            </button>
            <button className="btn btn-icon" onClick={() => { setPlaying(false); setCur((c) => Math.min(steps.length - 1, c + 1)); }}
              disabled={isFinished}>▶▶</button>
            <div className="divider" />
            <div className="speed-row" style={{ margin: 0 }}>
              <span className="speed-label">Speed</span>
              <div className="speed-buttons">
                {SPEEDS.map((s) => (
                  <button key={s.ms}
                    className={`btn btn-speed ${speedMs === s.ms ? "active" : ""}`}
                    onClick={() => setSpeedMs(s.ms)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}