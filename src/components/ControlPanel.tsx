import React from "react";
import styles from "./ControlPanel.module.css";

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
    <div className={styles.controlPanel}>
      <div className={styles.stepInfo}>
        <span className={styles.stepBadge}>
          {hasSteps ? `Step ${currentStep + 1} / ${totalSteps}` : "Ready to start"}
        </span>
        {isFinished && <span className={styles.doneBadge}>Sorted</span>}
      </div>

      {hasSteps && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className={styles.controlsRow}>
        <button className={styles.btn} onClick={onGenerate} title="Generate random array">
          New
        </button>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onRun}>
          {hasSteps ? "Restart" : "Run"}
        </button>

        <div className={styles.divider} />

        <button
          className={`${styles.btn} ${styles.btnIcon}`}
          onClick={onPrev}
          disabled={!hasSteps || currentStep === 0}
          title="Previous step"
        >
          Prev
        </button>

        <button
          className={`${styles.btn} ${styles.btnIcon} ${styles.btnPlay}`}
          onClick={isPlaying ? onPause : onPlay}
          disabled={!hasSteps || isFinished}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <button
          className={`${styles.btn} ${styles.btnIcon}`}
          onClick={onNext}
          disabled={!hasSteps || isFinished}
          title="Next step"
        >
          Next
        </button>

        <button
          className={`${styles.btn} ${styles.btnIcon}`}
          onClick={onReset}
          disabled={!hasSteps || currentStep === 0}
          title="Go to start"
        >
          Start
        </button>
      </div>

      <div className={styles.speedRow}>
        <span className={styles.speedLabel}>Speed</span>
        <div className={styles.speedButtons}>
          {SPEED_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.btn} ${styles.btnSpeed} ${speed === opt.value ? styles.active : ""}`}
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
