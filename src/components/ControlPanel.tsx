import React from "react";
import {
  PlaybackControls,
  playbackButtonClass,
  playbackPrimaryButtonClass,
} from "./PlaybackControls";

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
  return (
    <PlaybackControls
      isPlaying={isPlaying}
      currentStep={currentStep}
      totalSteps={hasSteps ? totalSteps : 0}
      speed={speed}
      speedOptions={SPEED_OPTIONS}
      doneLabel="Sorted"
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
        </>
      )}
    />
  );
}
