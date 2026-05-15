import React, { useEffect, useRef, useState } from "react";
import { useAlgorithmStore } from "./store/algorithms";
import { getAlgorithm } from "./algorithms";
import type { Step } from "./algorithms";
import { ArrayVisualizer } from "./visualizers/ArrayVisualizer";
import { ControlPanel } from "./components/ControlPanel";
import { CodeHighlighter } from "./components/CodeHighlighter";
import { AlgorithmSelector } from "./components/AlgorithmSelector";
import BSTPage from "./pages/BSTPage";
import styles from "./App.module.css";

type Section = "sorting" | "trees";

const STEP_BADGE: Record<string, [string, string, string]> = {
  compare: ["Compare", "#7c6af7", "rgba(124,106,247,0.15)"],
  swap: ["Swap", "#f87171", "rgba(248,113,113,0.15)"],
  sorted: ["Sorted", "#34d399", "rgba(52,211,153,0.15)"],
  pivot: ["Pivot", "#fbbf24", "rgba(251,191,36,0.15)"],
  partition: ["Partition", "#38bdf8", "rgba(56,189,248,0.12)"],
  idle: ["Ready", "#8888aa", "rgba(100,100,170,0.12)"],
};

function getSortingStepDetails(step: Step | null, currentStep: number, totalSteps: number): string {
  if (!step) return "Pick an algorithm, choose the array size, then run the visualization.";

  const progress = totalSteps > 0 ? `Step ${currentStep + 1} of ${totalSteps}` : "No steps yet";
  if (step.comparing) {
    const [a, b] = step.comparing;
    const left = step.array[a];
    const right = step.array[b];
    const action = step.swapped ? "Values just changed places." : "Watch the decision before the next move.";
    return `${progress}. Comparing index ${a} (${left}) with index ${b} (${right}). ${action}`;
  }
  if (step.pivotIndex !== null) {
    return `${progress}. Pivot is index ${step.pivotIndex} (${step.array[step.pivotIndex]}). Items move around this anchor.`;
  }
  if (step.partitionRange) {
    const [from, to] = step.partitionRange;
    return `${progress}. Current working range is ${from} to ${to}. Values outside it are not being scanned now.`;
  }
  if (step.sortedIndices.length > 0) {
    return `${progress}. ${step.sortedIndices.length} position${step.sortedIndices.length === 1 ? "" : "s"} locked in final order.`;
  }
  return `${progress}. The algorithm is setting up the first comparison.`;
}

function getPlaybackStatus(isPlaying: boolean, step: Step | null, currentStep: number, totalSteps: number): string {
  if (!step) return "Ready";
  if (totalSteps > 1 && currentStep >= totalSteps - 1) return "Finished";
  if (isPlaying) return "Playing";
  return STEP_BADGE[step.type]?.[0] ?? "Paused";
}

export default function App() {
  const [section, setSection] = useState<Section>("sorting");

  const {
    selectedId, inputArray, arraySize, steps, currentStep,
    isPlaying, speed,
    selectAlgorithm, generateRandom, setArraySize, runAlgorithm,
    nextStep, prevStep, play, pause, reset, setSpeed,
  } = useAlgorithmStore();

  useEffect(() => {
    return () => {
      pause();
    };
  }, [section, pause]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const algo = getAlgorithm(selectedId);
  const step = steps.length > 0 ? steps[currentStep] : null;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        const { currentStep, steps, pause } = useAlgorithmStore.getState();
        if (currentStep >= steps.length - 1) {
          pause();
        } else {
          useAlgorithmStore.getState().nextStep();
        }
      }, speed);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, speed, steps.length]);

  const badge = step ? STEP_BADGE[step.type] : null;
  const sortingDetails = getSortingStepDetails(step, currentStep, steps.length);
  const playbackStatus = getPlaybackStatus(isPlaying, step, currentStep, steps.length);

  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <span className={styles.logoBracket}>{`{`}</span>
            <span className={styles.logoText}>algo</span>
            <span className={styles.logoBracket}>{`}`}</span>
          </div>

          <nav className={styles.sectionNav}>
            <button
              className={`${styles.sectionBtn} ${section === "sorting" ? styles.active : ""}`}
              onClick={() => setSection("sorting")}
              aria-pressed={section === "sorting"}
            >
              Sorting
            </button>
            <button
              className={`${styles.sectionBtn} ${section === "trees" ? styles.active : ""}`}
              onClick={() => setSection("trees")}
              aria-pressed={section === "trees"}
            >
              Trees
            </button>
          </nav>

          {section === "sorting" && (
            <>
              <AlgorithmSelector selectedId={selectedId} onSelect={selectAlgorithm} />
              <div className={styles.complexityBadges}>
                <span className={`${styles.cbadge} ${styles.time}`}>{algo.complexity.time}</span>
                <span className={`${styles.cbadge} ${styles.space}`}>{algo.complexity.space} space</span>
              </div>
            </>
          )}
        </div>
      </header>

      <main className={styles.appMain}>
        {section === "sorting" && (
          <>
            <p className={styles.algoDescription}>{algo.description}</p>
            <div className={styles.descriptionBar}>
              <span className={styles.stepDescription} aria-live="polite">
                {step ? step.description : "Generate an array and press Run to start the visualization."}
              </span>
              {badge && (
                <span className={styles.stepTypeBadge} style={{ color: badge[1], background: badge[2] }}>
                  {badge[0]}
                </span>
              )}
            </div>
            <div className={styles.vizCodeLayout}>
              <div className={styles.vizPanel}>
                <div className={styles.panelLabel}>Array</div>
                <div className={styles.visualizerSlot}>
                  <ArrayVisualizer step={step} inputArray={inputArray} />
                </div>
                <div className={styles.legend}>
                  {[
                    ["var(--bar-default)", "Default"],
                    ["var(--bar-compare)", "Comparing"],
                    ["var(--bar-swap)", "Swapping"],
                    ["var(--bar-pivot)", "Pivot"],
                    ["var(--bar-partition)", "In range"],
                    ["var(--bar-sorted)", "Sorted"],
                  ].map(([c, l]) => (
                    <div key={l} className={styles.legendItem}>
                      <span className={styles.legendDot} style={{ background: c }} />
                      {l}
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.codePanel}>
                <div className={styles.panelLabel}>Code</div>
                <CodeHighlighter
                  code={algo.code}
                  activeLine={step?.highlightLine ?? 0}
                  stepType={step?.type ?? "idle"}
                />
              </div>
            </div>
            <ControlPanel
              isPlaying={isPlaying}
              currentStep={currentStep}
              totalSteps={steps.length}
              speed={speed}
              hasSteps={steps.length > 0}
              arraySize={arraySize}
              statusLabel={playbackStatus}
              secondaryInfo={sortingDetails}
              onPlay={play}
              onPause={pause}
              onNext={nextStep}
              onPrev={prevStep}
              onReset={reset}
              onRun={runAlgorithm}
              onGenerate={() => generateRandom(arraySize)}
              onArraySizeChange={setArraySize}
              onSpeedChange={setSpeed}
            />
          </>
        )}

        {section === "trees" && (
          <>
            <p className={styles.algoDescription}>
              A Binary Search Tree maintains the invariant: left child &lt; parent &lt; right child.
              Insert values to build the tree, or search to trace the lookup path step by step.
            </p>
            <BSTPage />
          </>
        )}
      </main>
    </div>
  );
}
