import React from 'react';
import './VoiceControl.css';

export default function VoiceControl({
  isListening,
  isSpeaking,
  isProcessing,
  transcript,
  onToggleListen,
  isSupported,
}) {
  const getStatus = () => {
    if (!isSupported) return 'Voice not supported in this browser';
    if (isProcessing) return 'Processing...';
    if (isSpeaking) return 'Speaking...';
    if (isListening) return 'Listening...';
    return 'Tap the mic to speak';
  };

  const getState = () => {
    if (isProcessing) return 'processing';
    if (isSpeaking) return 'speaking';
    if (isListening) return 'listening';
    return 'idle';
  };

  return (
    <div className={`voice-control voice-control--${getState()}`}>
      <button
        className="mic-button"
        onClick={onToggleListen}
        disabled={!isSupported || isProcessing || isSpeaking}
        aria-label={isListening ? 'Stop listening' : 'Start listening'}
      >
        <div className="mic-rings">
          <div className="ring ring-1" />
          <div className="ring ring-2" />
          <div className="ring ring-3" />
        </div>
        <div className="mic-icon">
          {isProcessing ? (
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="32" strokeDashoffset="32">
                <animate attributeName="stroke-dashoffset" values="32;0" dur="0.8s" repeatCount="indefinite" />
              </circle>
            </svg>
          ) : isSpeaking ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
            </svg>
          )}
        </div>
      </button>

      <div className="voice-status">
        <span className="status-dot" />
        <span className="status-text">{getStatus()}</span>
      </div>

      {transcript && (
        <div className="transcript-bubble">
          <span className="transcript-label">Heard:</span>
          <span className="transcript-text">"{transcript}"</span>
        </div>
      )}
    </div>
  );
}
