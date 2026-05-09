import React from "react";
import { ALGORITHMS, AlgorithmMeta } from "../algorithms";

interface AlgorithmSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AlgorithmSelector({ selectedId, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className="algo-selector">
      {ALGORITHMS.map((algo) => (
        <button
          key={algo.id}
          className={`algo-btn ${selectedId === algo.id ? "active" : ""}`}
          onClick={() => onSelect(algo.id)}
        >
          <span className="algo-btn-name">{algo.name}</span>
          <span className="algo-btn-complexity">{algo.complexity.time}</span>
        </button>
      ))}
    </div>
  );
}