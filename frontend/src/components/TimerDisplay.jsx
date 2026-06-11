import React from 'react';
import { formatTime } from '../hooks/useTimer.js';
import './TimerDisplay.css';

export default function TimerDisplay({ timeLeft, isRunning, totalTime, progress, onStop }) {
  if (!isRunning && timeLeft === 0) return null;

  const isWarning = timeLeft <= 30 && timeLeft > 0;
  const isDone = timeLeft === 0;

  return (
    <div className={`timer-display ${isWarning ? 'timer-display--warning' : ''} ${isDone ? 'timer-display--done' : ''}`}>
      <div className="timer-ring-container">
        <svg viewBox="0 0 100 100" className="timer-ring">
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth="6"
          />
          <circle
            cx="50" cy="50" r="42"
            fill="none"
            stroke={isWarning ? 'var(--color-warn)' : 'var(--accent)'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 42}`}
            strokeDashoffset={`${2 * Math.PI * 42 * (progress / 100)}`}
            transform="rotate(-90 50 50)"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <div className="timer-center">
          <span className="timer-time">{formatTime(timeLeft)}</span>
          <span className="timer-label">{isDone ? 'Done!' : isRunning ? 'remaining' : 'paused'}</span>
        </div>
      </div>

      <button className="timer-stop-btn" onClick={onStop} title="Stop timer">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M6 6h12v12H6z"/>
        </svg>
        Stop
      </button>
    </div>
  );
}
