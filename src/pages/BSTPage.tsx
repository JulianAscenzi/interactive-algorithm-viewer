import React, { useEffect, useRef, useState } from "react";
import {
  BSTTree, BSTStep,
  buildStarterTree, bstInsertSteps, bstSearchSteps,
  BST_INSERT_CODE, BST_SEARCH_CODE,
} from "../algorithms/trees/bst";
import { TreeVisualizer } from "../visualizers/TreeVisualizer";
import { CodeHighlighter } from "../components/CodeHighlighter";
import styles from "./BSTPage.module.css";

const SPEEDS = [
  { label: "0.5x", ms: 900 },
  { label: "1x", ms: 500 },
  { label: "2x", ms: 220 },
  { label: "4x", ms: 80 },
];

const BADGE: Record<string, [string, string, string]> = {
  idle: ["Ready", "#6666aa", "rgba(100,100,170,0.12)"],
  "compare-left": ["Go left", "#7c6af7", "rgba(124,106,247,0.15)"],
  "compare-right": ["Go right", "#7c6af7", "rgba(124,106,247,0.15)"],
  insert: ["Inserted", "#34d399", "rgba(52,211,153,0.15)"],
  duplicate: ["Already Exists", "#fbbf24", "rgba(251,191,36,0.15)"],
  found: ["Found", "#34d399", "rgba(52,211,153,0.15)"],
  "not-found": ["Not Found", "#f87171", "rgba(248,113,113,0.15)"],
  visiting: ["Visiting", "#38bdf8", "rgba(56,189,248,0.12)"],
};

type Mode = "insert" | "search";

export default function BSTPage() {
  const [starter] = useState(buildStarterTree);
  const [tree, setTree] = useState<BSTTree>(starter.tree);
  const [rootId, setRootId] = useState<number | null>(starter.rootId);
  const [mode, setMode] = useState<Mode>("insert");
  const [inputVal, setInputVal] = useState("");
  const [steps, setSteps] = useState<BSTStep[]>([]);
  const [cur, setCur] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps.length > 0 ? steps[cur] : null;
  const isFinished = steps.length > 0 && cur >= steps.length - 1;
  const progress = steps.length > 1 ? (cur / (steps.length - 1)) * 100 : 0;
  const code = mode === "insert" ? BST_INSERT_CODE : BST_SEARCH_CODE;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (playing && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        setCur((c) => {
          if (c >= steps.length - 1) {
            setPlaying(false);
            return c;
          }
          return c + 1;
        });
      }, speedMs);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speedMs, steps.length]);

  function handleRun() {
    const v = parseInt(inputVal, 10);
    if (isNaN(v) || v < 0 || v > 999) return;

    setPlaying(false);
    if (mode === "insert") {
      const nextSteps = bstInsertSteps(tree, rootId, v);
      const finalStep = nextSteps[nextSteps.length - 1];
      setSteps(nextSteps);
      if (finalStep) {
        setTree(finalStep.tree);
        setRootId(finalStep.rootId);
      }
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
  const completedInsert = steps.some((s) => s.type === "insert");
  const completedDuplicate = steps.some((s) => s.type === "duplicate");

  useEffect(() => {
    return () => setPlaying(false);
  }, []);

  return (
    <div className={styles.bstPage}>
      <div className={styles.bstTabs}>
        <button
          className={`${styles.bstTab} ${mode === "insert" ? styles.active : ""}`}
          onClick={() => handleModeSwitch("insert")}
        >
          <span>Insert</span>
          <code>O(h)</code>
        </button>
        <button
          className={`${styles.bstTab} ${mode === "search" ? styles.active : ""}`}
          onClick={() => handleModeSwitch("search")}
        >
          <span>Search</span>
          <code>O(h)</code>
        </button>
        <div className={styles.bstTabNote}>h = tree height</div>
      </div>

      <div className={styles.bstInputRow}>
        <input
          className={styles.bstInput}
          type="number"
          min={0}
          max={999}
          placeholder="Enter a value (0-999)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleRun()}
        />
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={handleRun}
          disabled={inputVal === "" || isNaN(parseInt(inputVal, 10))}
        >
          {mode === "insert" ? "Insert" : "Search"}
        </button>
        <button className={styles.btn} onClick={handleReset}>
          Reset Tree
        </button>
      </div>

      <div className={styles.descriptionBar}>
        <span className={styles.stepDescription}>
          {step
            ? step.description
            : mode === "insert"
              ? "Enter a value and press Insert to animate the insertion."
              : "Enter a value and press Search to trace the lookup path."}
        </span>
        {badge && (
          <span className={styles.stepTypeBadge} style={{ color: badge[1], background: badge[2] }}>
            {badge[0]}
          </span>
        )}
      </div>

      <div className={styles.vizCodeLayout}>
        <div className={styles.vizPanel}>
          <div className={styles.panelLabel}>Binary Search Tree</div>
          <div className={styles.treeSlot}>
            <TreeVisualizer step={step} tree={tree} rootId={rootId} />
          </div>
          <div className={styles.legend}>
            {[
              ["#1a1a28", "#2e2e44", "Default"],
              ["#2d1f6e", "#7c6af7", "Comparing"],
              ["#1e2a3a", "#38bdf8", "Visiting"],
              ["#065f46", "#34d399", "Inserted / Found"],
              ["#3f300f", "#fbbf24", "Already Exists"],
              ["#4c1d1d", "#f87171", "Not Found"],
            ].map(([fill, stroke, label]) => (
              <div key={label} className={styles.legendItem}>
                <svg width="14" height="14" className={styles.legendIcon}>
                  <circle cx="7" cy="7" r="6" fill={fill} stroke={stroke} strokeWidth="1.5" />
                </svg>
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.codePanel}>
          <div className={styles.panelLabel}>Code</div>
          <CodeHighlighter
            code={code}
            activeLine={step?.highlightLine ?? 0}
            stepType={step?.type ?? "idle"}
          />
        </div>
      </div>

      {steps.length > 0 && (
        <div className={styles.controlPanel}>
          <div className={styles.stepInfo}>
            <span className={styles.stepBadge}>Step {cur + 1} / {steps.length}</span>
            {isFinished && (
              <span className={styles.doneBadge}>
                {mode === "insert"
                  ? completedDuplicate && !completedInsert
                    ? "Skipped"
                    : "Inserted"
                  : step?.type === "found"
                    ? "Found"
                    : "Not Found"}
              </span>
            )}
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.controlsRow}>
            <button
              className={`${styles.btn} ${styles.btnIcon}`}
              onClick={() => { setPlaying(false); setCur(0); }}
              disabled={cur === 0}
            >
              Start
            </button>
            <button
              className={`${styles.btn} ${styles.btnIcon}`}
              onClick={() => { setPlaying(false); setCur((c) => Math.max(0, c - 1)); }}
              disabled={cur === 0}
            >
              Prev
            </button>
            <button
              className={`${styles.btn} ${styles.btnIcon} ${styles.btnPlay}`}
              onClick={() => setPlaying((p) => !p)}
              disabled={isFinished}
            >
              {playing ? "Pause" : "Play"}
            </button>
            <button
              className={`${styles.btn} ${styles.btnIcon}`}
              onClick={() => { setPlaying(false); setCur((c) => Math.min(steps.length - 1, c + 1)); }}
              disabled={isFinished}
            >
              Next
            </button>
            <div className={styles.divider} />
            <div className={styles.speedRow}>
              <span className={styles.speedLabel}>Speed</span>
              <div className={styles.speedButtons}>
                {SPEEDS.map((s) => (
                  <button
                    key={s.ms}
                    className={`${styles.btn} ${styles.btnSpeed} ${speedMs === s.ms ? styles.active : ""}`}
                    onClick={() => setSpeedMs(s.ms)}
                  >
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
