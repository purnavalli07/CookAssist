import React from 'react';
import './ModeToggle.css';

export default function ModeToggle({ handsFree, onToggle }) {
  return (
    <div className="mode-toggle">
      <div className="mode-toggle-info">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M12 3C10.35 3 9 4.35 9 6v6c0 1.65 1.35 3 3 3s3-1.35 3-3V6c0-1.65-1.35-3-3-3zm5.3 9c0 2.94-2.36 5.3-5.3 5.3s-5.3-2.36-5.3-5.3H5c0 3.53 2.61 6.43 6 6.92V21h2v-2.08c3.39-.49 6-3.39 6-6.92h-1.7z"/>
        </svg>
        <div>
          <span className="mode-toggle-label">Hands-Free Mode</span>
          <span className="mode-toggle-desc">Auto-listens after responses</span>
        </div>
      </div>
      <button
        className={`toggle-switch ${handsFree ? 'toggle-switch--on' : ''}`}
        onClick={onToggle}
        aria-pressed={handsFree}
        aria-label="Toggle hands-free mode"
      >
        <span className="toggle-thumb" />
      </button>
    </div>
  );
}
