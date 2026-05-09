import React from "react";

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  hasSteps: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onRun: () => void;
  onGenerate: () => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [
  { label: "0.5×", value: 800 },
  { label: "1×", value: 400 },
  { label: "2×", value: 200 },
  { label: "4×", value: 80 },
];

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  hasSteps,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onRun,
  onGenerate,
  onSpeedChange,
}: ControlPanelProps) {
  const isFinished = hasSteps && currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="control-panel">
      {/* Step info */}
      <div className="step-info">
        <span className="step-badge">
          {hasSteps ? `Step ${currentStep + 1} / ${totalSteps}` : "Ready to start"}
        </span>
        {isFinished && <span className="done-badge">✓ Sorted</span>}
      </div>

      {/* Progress bar */}
      {hasSteps && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Main controls */}
      <div className="controls-row">
        {/* Generate & Run */}
        <button className="btn btn-secondary" onClick={onGenerate} title="Generate random array">
          ⟳ New
        </button>
        <button className="btn btn-primary" onClick={onRun}>
          {hasSteps ? "↺ Restart" : "▶ Run"}
        </button>

        <div className="divider" />

        {/* Step controls */}
        <button
          className="btn btn-icon"
          onClick={onPrev}
          disabled={!hasSteps || currentStep === 0}
          title="Previous step"
        >
          ◀◀
        </button>

        <button
          className="btn btn-icon btn-play"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!hasSteps || isFinished}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button
          className="btn btn-icon"
          onClick={onNext}
          disabled={!hasSteps || isFinished}
          title="Next step"
        >
          ▶▶
        </button>

        <button
          className="btn btn-icon"
          onClick={onReset}
          disabled={!hasSteps || currentStep === 0}
          title="Go to start"
        >
          ⏮
        </button>
      </div>

      {/* Speed selector */}
      <div className="speed-row">
        <span className="speed-label">Speed</span>
        <div className="speed-buttons">
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`btn btn-speed ${speed === opt.value ? "active" : ""}`}
              onClick={() => onSpeedChange(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}