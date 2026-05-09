import React, { useEffect, useRef } from "react";
import { useAlgorithmStore } from "./store/algorithms";
import { getAlgorithm } from "./algorithms";
import { ArrayVisualizer } from "./visualizers/ArrayVisualizer";
import { ControlPanel } from "./components/ControlPanel";
import { CodeHighlighter } from "./components/CodeHighlighter";
import { AlgorithmSelector } from "./components/AlgorithmSelector";

export default function App() {
  const {
    selectedId, inputArray, steps, currentStep,
    isPlaying, speed,
    selectAlgorithm, generateRandom, runAlgorithm,
    nextStep, prevStep, play, pause, reset, setSpeed,
  } = useAlgorithmStore();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const algo = getAlgorithm(selectedId);
  const step = steps.length > 0 ? steps[currentStep] : null;

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        const { currentStep, steps, pause } = useAlgorithmStore.getState();
        if (currentStep >= steps.length - 1) { pause(); }
        else { useAlgorithmStore.getState().nextStep(); }
      }, speed);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPlaying, speed, steps.length]);

  const BADGE: Record<string, [string, string, string]> = {
    compare:   ["🔍 Comparing",    "#7c6af7", "rgba(124,106,247,0.15)"],
    swap:      ["↔ Swapping",      "#f87171", "rgba(248,113,113,0.15)"],
    sorted:    ["✓ Sorted",        "#34d399", "rgba(52,211,153,0.15)"],
    pivot:     ["◈ Pivot",         "#fbbf24", "rgba(251,191,36,0.15)"],
    partition: ["⟨⟩ Partition",    "#38bdf8", "rgba(56,189,248,0.12)"],
    idle:      ["◉ Start",         "#6666aa", "rgba(100,100,170,0.12)"],
  };
  const badge = step ? BADGE[step.type] : null;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-bracket">{`{`}</span>
            <span className="logo-text">algo</span>
            <span className="logo-bracket">{`}`}</span>
          </div>
          <AlgorithmSelector selectedId={selectedId} onSelect={selectAlgorithm} />
          <div className="complexity-badges">
            <span className="cbadge time">{algo.complexity.time}</span>
            <span className="cbadge space">{algo.complexity.space} space</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Algorithm description */}
        <p className="algo-description">{algo.description}</p>

        {/* Step description bar */}
        <div className="description-bar">
          <span className="step-description">
            {step ? step.description : "Generate an array and press Run to start the visualization."}
          </span>
          {badge && (
            <span className="step-type-badge" style={{ color: badge[1], background: badge[2] }}>
              {badge[0]}
            </span>
          )}
        </div>

        {/* Two-column layout: visualizer + code */}
        <div className="viz-code-layout">
          <div className="viz-panel">
            <div className="panel-label">Array</div>
            <ArrayVisualizer step={step} inputArray={inputArray} />

            {/* Legend */}
            <div className="legend">
              {[
                ["var(--bar-default)",   "Default"],
                ["var(--bar-compare)",   "Comparing"],
                ["var(--bar-swap)",      "Swapping"],
                ["var(--bar-pivot)",     "Pivot"],
                ["var(--bar-partition)", "In range"],
                ["var(--bar-sorted)",    "Sorted"],
              ].map(([c, l]) => (
                <div key={l} className="legend-item">
                  <span className="legend-dot" style={{ background: c }} />
                  {l}
                </div>
              ))}
            </div>
          </div>

          <div className="code-panel">
            <div className="panel-label">Code</div>
            <CodeHighlighter
              code={algo.code}
              activeLine={step?.highlightLine ?? 0}
              stepType={step?.type ?? "idle"}
            />
          </div>
        </div>

        {/* Controls */}
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
      </main>
    </div>
  );
}