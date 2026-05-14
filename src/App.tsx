import React, { useEffect, useRef, useState } from "react";
import { useAlgorithmStore } from "./store/algorithms";
import { getAlgorithm } from "./algorithms";
import { ArrayVisualizer } from "./visualizers/ArrayVisualizer";
import { ControlPanel } from "./components/ControlPanel";
import { CodeHighlighter } from "./components/CodeHighlighter";
import { AlgorithmSelector } from "./components/AlgorithmSelector";
import BSTPage from "./pages/BSTPage";
import styles from "./App.module.css";

type Section = "sorting" | "trees";

export default function App() {
  const [section, setSection] = useState<Section>("sorting");

  const {
    selectedId, inputArray, steps, currentStep,
    isPlaying, speed,
    selectAlgorithm, generateRandom, runAlgorithm,
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

  const BADGE: Record<string, [string, string, string]> = {
    compare: ["Comparing", "#7c6af7", "rgba(124,106,247,0.15)"],
    swap: ["Swapping", "#f87171", "rgba(248,113,113,0.15)"],
    sorted: ["Sorted", "#34d399", "rgba(52,211,153,0.15)"],
    pivot: ["Pivot", "#fbbf24", "rgba(251,191,36,0.15)"],
    partition: ["Partition", "#38bdf8", "rgba(56,189,248,0.12)"],
    idle: ["Start", "#6666aa", "rgba(100,100,170,0.12)"],
  };
  const badge = step ? BADGE[step.type] : null;

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
            >
              Sorting
            </button>
            <button
              className={`${styles.sectionBtn} ${section === "trees" ? styles.active : ""}`}
              onClick={() => setSection("trees")}
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
              <span className={styles.stepDescription}>
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
              onPlay={play}
              onPause={pause}
              onNext={nextStep}
              onPrev={prevStep}
              onReset={reset}
              onRun={runAlgorithm}
              onGenerate={() => generateRandom(12)}
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
