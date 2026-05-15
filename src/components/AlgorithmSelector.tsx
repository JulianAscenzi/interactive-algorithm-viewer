import React from "react";
import { ALGORITHMS, AlgorithmMeta } from "../algorithms";
import styles from "./AlgorithmSelector.module.css";

interface AlgorithmSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AlgorithmSelector({ selectedId, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className={styles.algoSelector}>
      {ALGORITHMS.map((algo: AlgorithmMeta) => (
        <button
          key={algo.id}
          className={`${styles.algoBtn} ${selectedId === algo.id ? styles.active : ""}`}
          onClick={() => onSelect(algo.id)}
          aria-pressed={selectedId === algo.id}
        >
          <span className={styles.algoBtnName}>{algo.name}</span>
          <span className={styles.algoBtnComplexity}>{algo.complexity.time}</span>
        </button>
      ))}
    </div>
  );
}
