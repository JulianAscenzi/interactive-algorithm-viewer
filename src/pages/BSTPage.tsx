import React, { useEffect, useRef, useState } from "react";
import {
  BSTTree, BSTStep,
  buildStarterTree, bstInsertSteps, bstSearchSteps,
  BST_INSERT_CODE, BST_SEARCH_CODE,
} from "../algorithms/trees/bst";
import { TreeVisualizer } from "../visualizers/TreeVisualizer";
import { CodeHighlighter } from "../components/CodeHighlighter";
import {
  PlaybackControls,
  playbackButtonClass,
  playbackPrimaryButtonClass,
} from "../components/PlaybackControls";
import styles from "./BSTPage.module.css";

const SPEED_OPTIONS = [
  { label: "0.5x", value: 900 },
  { label: "1x", value: 500 },
  { label: "2x", value: 220 },
  { label: "4x", value: 80 },
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

function parseBSTInput(value: string): number | null {
  const normalized = value.trim();
  if (!/^\d+$/.test(normalized)) return null;

  const parsed = Number(normalized);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 999) return null;

  return parsed;
}

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
  const code = mode === "insert" ? BST_INSERT_CODE : BST_SEARCH_CODE;
  const parsedInput = parseBSTInput(inputVal);
  const hasInput = inputVal.trim() !== "";
  const inputError = hasInput && parsedInput === null
    ? "Enter an integer from 0 to 999."
    : "";

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
    const v = parsedInput;
    if (v === null) return;

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
  const doneLabel = mode === "insert"
    ? completedDuplicate && !completedInsert
      ? "Skipped"
      : "Inserted"
    : step?.type === "found"
      ? "Found"
      : "Not Found";

  useEffect(() => {
    return () => setPlaying(false);
  }, []);

  return (
    <div className={styles.bstPage}>
      <div className={styles.bstTabs}>
        <button
          className={`${styles.bstTab} ${mode === "insert" ? styles.active : ""}`}
          onClick={() => handleModeSwitch("insert")}
          aria-pressed={mode === "insert"}
        >
          <span>Insert</span>
          <code>O(h)</code>
        </button>
        <button
          className={`${styles.bstTab} ${mode === "search" ? styles.active : ""}`}
          onClick={() => handleModeSwitch("search")}
          aria-pressed={mode === "search"}
        >
          <span>Search</span>
          <code>O(h)</code>
        </button>
        <div className={styles.bstTabNote}>h = tree height</div>
      </div>

      <div className={styles.bstInputRow}>
        <input
          className={styles.bstInput}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="Enter a value (0-999)"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && parsedInput !== null && handleRun()}
          aria-invalid={inputError ? "true" : "false"}
          aria-describedby={inputError ? "bst-input-error" : undefined}
        />
        <button
          className={`${playbackPrimaryButtonClass} ${styles.inputButton}`}
          onClick={handleRun}
          disabled={parsedInput === null}
        >
          {mode === "insert" ? "Insert" : "Search"}
        </button>
        <button className={`${playbackButtonClass} ${styles.inputButton}`} onClick={handleReset}>
          Reset Tree
        </button>
      </div>
      {inputError && (
        <p id="bst-input-error" className={styles.inputError} aria-live="polite">
          {inputError}
        </p>
      )}

      <div className={styles.descriptionBar}>
        <span className={styles.stepDescription} aria-live="polite">
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
                <svg width="14" height="14" className={styles.legendIcon} aria-hidden="true">
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
        <PlaybackControls
          isPlaying={playing}
          currentStep={cur}
          totalSteps={steps.length}
          speed={speedMs}
          speedOptions={SPEED_OPTIONS}
          doneLabel={doneLabel}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onNext={() => { setPlaying(false); setCur((c) => Math.min(steps.length - 1, c + 1)); }}
          onPrev={() => { setPlaying(false); setCur((c) => Math.max(0, c - 1)); }}
          onReset={() => { setPlaying(false); setCur(0); }}
          onSpeedChange={setSpeedMs}
        />
      )}
    </div>
  );
}
