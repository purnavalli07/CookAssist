import React from 'react';
import './StepViewer.css';

export default function StepViewer({ recipe, stepIndex, onStepClick }) {
  if (!recipe) return null;

  const { steps } = recipe;

  return (
    <div className="step-viewer">
      {/* Current step hero */}
      <div className="current-step-card">
        <div className="step-counter">
          <span className="step-num">{stepIndex + 1}</span>
          <span className="step-total">/ {steps.length}</span>
        </div>
        <p className="step-instruction">{steps[stepIndex]?.instruction}</p>
        {steps[stepIndex]?.duration > 0 && (
          <div className="step-hint">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/>
            </svg>
            <span>Suggested time: {formatDuration(steps[stepIndex].duration)}</span>
          </div>
        )}
      </div>

      {/* All steps mini list */}
      <div className="steps-list">
        {steps.map((step, idx) => (
          <button
            key={idx}
            className={`step-item ${idx === stepIndex ? 'step-item--active' : ''} ${idx < stepIndex ? 'step-item--done' : ''}`}
            onClick={() => onStepClick?.(idx)}
          >
            <span className="step-item-num">
              {idx < stepIndex ? (
                <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              ) : (
                idx + 1
              )}
            </span>
            <span className="step-item-text">{step.instruction}</span>
            {step.duration > 0 && (
              <span className="step-item-time">{formatDuration(step.duration)}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function formatDuration(seconds) {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  }
  return `${seconds}s`;
}
