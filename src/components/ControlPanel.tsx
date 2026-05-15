import React from "react";
import {
  PlaybackControls,
  playbackButtonClass,
  playbackPrimaryButtonClass,
} from "./PlaybackControls";
import styles from "./PlaybackControls.module.css";

interface ControlPanelProps {
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
  speed: number;
  arraySize: number;
  hasSteps: boolean;
  statusLabel?: string;
  secondaryInfo?: string;
  onPlay: () => void;
  onPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  onRun: () => void;
  onGenerate: () => void;
  onArraySizeChange: (size: number) => void;
  onSpeedChange: (speed: number) => void;
}

const SPEED_OPTIONS = [
  { label: "0.5x", value: 800 },
  { label: "1x", value: 400 },
  { label: "2x", value: 200 },
  { label: "4x", value: 80 },
];

const ARRAY_SIZE_OPTIONS = [8, 12, 20, 32];

export function ControlPanel({
  isPlaying,
  currentStep,
  totalSteps,
  speed,
  arraySize,
  hasSteps,
  statusLabel,
  secondaryInfo,
  onPlay,
  onPause,
  onNext,
  onPrev,
  onReset,
  onRun,
  onGenerate,
  onArraySizeChange,
  onSpeedChange,
}: ControlPanelProps) {
  return (
    <PlaybackControls
      isPlaying={isPlaying}
      currentStep={currentStep}
      totalSteps={hasSteps ? totalSteps : 0}
      speed={speed}
      speedOptions={SPEED_OPTIONS}
      doneLabel="Sorted"
      statusLabel={statusLabel}
      secondaryInfo={secondaryInfo}
      onPlay={onPlay}
      onPause={onPause}
      onNext={onNext}
      onPrev={onPrev}
      onReset={onReset}
      onSpeedChange={onSpeedChange}
      leadingActions={(
        <>
          <button className={playbackButtonClass} onClick={onGenerate} title="Generate random array">
            New
          </button>
          <button className={playbackPrimaryButtonClass} onClick={onRun}>
            {hasSteps ? "Restart" : "Run"}
          </button>
          <div className={styles.inlineGroup} role="group" aria-label="Array size">
            {ARRAY_SIZE_OPTIONS.map((size) => (
              <button
                key={size}
                className={playbackButtonClass}
                onClick={() => onArraySizeChange(size)}
                aria-pressed={arraySize === size}
                aria-label={`Array size ${size}`}
                title={`Use ${size} values`}
              >
                {size}
              </button>
            ))}
          </div>
        </>
      )}
    />
  );
}
