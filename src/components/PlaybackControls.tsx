import React from "react";
import styles from "./PlaybackControls.module.css";

export interface SpeedOption {
  label: string;
  value: number;
}

interface PlaybackControlsProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  speedOptions: SpeedOption[];
  doneLabel?: string;
  emptyLabel?: string;
  leadingActions?: React.ReactNode;
  showProgressWhenEmpty?: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

export const playbackButtonClass = styles.btn;
export const playbackPrimaryButtonClass = `${styles.btn} ${styles.btnPrimary}`;

export function PlaybackControls({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  speedOptions,
  doneLabel,
  emptyLabel = "Ready to start",
  leadingActions,
  showProgressWhenEmpty = false,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onSpeedChange,
}: PlaybackControlsProps) {
  const hasSteps = totalSteps > 0;
  const isFinished = hasSteps && totalSteps > 1 && currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;
  const showProgress = hasSteps || showProgressWhenEmpty;

  return (
    <div className={styles.controlPanel}>
      <div className={styles.stepInfo}>
        <span className={styles.stepBadge}>
          {hasSteps ? `Step ${currentStep + 1} / ${totalSteps}` : emptyLabel}
        </span>
        {isFinished && doneLabel && <span className={styles.doneBadge}>{doneLabel}</span>}
      </div>

      {showProgress && (
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps > 1 ? totalSteps - 1 : 0}
          aria-valuenow={hasSteps ? currentStep : 0}
          aria-label="Visualization progress"
        >
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      <div className={styles.controlsRow}>
        {leadingActions}
        {leadingActions && <div className={styles.divider} />}

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
          {speedOptions.map((opt) => (
            <button
              key={opt.value}
              className={`${styles.btn} ${styles.btnSpeed} ${speed === opt.value ? styles.active : ""}`}
              onClick={() => onSpeedChange(opt.value)}
              aria-pressed={speed === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
