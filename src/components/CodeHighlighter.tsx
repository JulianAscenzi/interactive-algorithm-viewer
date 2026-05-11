import React, { useEffect, useRef } from "react";

interface CodeHighlighterProps {
  code: string[];
  activeLine: number;
  stepType: string;
}

const LINE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  compare:   { bg: "rgba(124,106,247,0.15)", border: "#7c6af7", text: "#a78bfa" },
  swap:      { bg: "rgba(248,113,113,0.15)", border: "#f87171", text: "#fca5a5" },
  sorted:    { bg: "rgba(52,211,153,0.15)",  border: "#34d399", text: "#6ee7b7" },
  duplicate: { bg: "rgba(251,191,36,0.15)",  border: "#fbbf24", text: "#fde68a" },
  pivot:     { bg: "rgba(251,191,36,0.15)",  border: "#fbbf24", text: "#fde68a" },
  partition: { bg: "rgba(56,189,248,0.12)",  border: "#38bdf8", text: "#7dd3fc" },
  idle:      { bg: "rgba(100,100,170,0.1)",  border: "#6666aa", text: "#9999cc" },
};

export function CodeHighlighter({ code, activeLine, stepType }: CodeHighlighterProps) {
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [activeLine]);

  const colors = LINE_COLORS[stepType] ?? LINE_COLORS.idle;

  return (
    <div className="code-highlighter">
      <div className="code-header">
        <span className="code-title">Algorithm</span>
        <span className="code-lang">JavaScript</span>
      </div>
      <div className="code-body">
        {code.map((line, i) => {
          const isActive = i === activeLine;
          const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
          return (
            <div
              key={i}
              ref={isActive ? activeRef : null}
              className={`code-line ${isActive ? "active" : ""}`}
              style={isActive ? {
                background: colors.bg,
                borderLeft: `2px solid ${colors.border}`,
              } : {}}
            >
              <span className="line-number">{i + 1}</span>
              <span
                className="line-content"
                style={isActive ? { color: colors.text } : {}}
              >
                {line}
              </span>
              {isActive && (
                <span className="line-arrow" style={{ color: colors.border }}>{"<"}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
