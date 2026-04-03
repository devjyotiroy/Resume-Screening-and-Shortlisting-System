import React from 'react';

export default function ScoreBar({ label, value, max = 100, color = '' }) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className="score-bar-item">
      <div className="score-bar-label">
        <span>{label}</span>
        <span>{Math.round(value)}</span>
      </div>
      <div className="score-bar-track">
        <div className={`score-bar-fill ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
