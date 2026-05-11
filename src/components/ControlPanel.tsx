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
  { label: "0.5x", value: 800 },
  { label: "1x", value: 400 },
  { label: "2x", value: 200 },
  { label: "4x", value: 80 },
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
  const isFinished = hasSteps && totalSteps > 1 && currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="control-panel">
      <div className="step-info">
        <span className="step-badge">
          {hasSteps ? `Step ${currentStep + 1} / ${totalSteps}` : "Ready to start"}
        </span>
        {isFinished && <span className="done-badge">Sorted</span>}
      </div>

      {hasSteps && (
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="controls-row">
        <button className="btn btn-secondary" onClick={onGenerate} title="Generate random array">
          New
        </button>
        <button className="btn btn-primary" onClick={onRun}>
          {hasSteps ? "Restart" : "Run"}
        </button>

        <div className="divider" />

        <button
          className="btn btn-icon"
          onClick={onPrev}
          disabled={!hasSteps || currentStep === 0}
          title="Previous step"
        >
          Prev
        </button>

        <button
          className="btn btn-icon btn-play"
          onClick={isPlaying ? onPause : onPlay}
          disabled={!hasSteps || isFinished}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          className="btn btn-icon"
          onClick={onNext}
          disabled={!hasSteps || isFinished}
          title="Next step"
        >
          Next
        </button>

        <button
          className="btn btn-icon"
          onClick={onReset}
          disabled={!hasSteps || currentStep === 0}
          title="Go to start"
        >
          Start
        </button>
      </div>

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
