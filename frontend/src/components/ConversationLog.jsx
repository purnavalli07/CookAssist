import React, { useEffect, useRef } from 'react';
import './ConversationLog.css';

export default function ConversationLog({ log }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [log]);

  if (log.length === 0) {
    return (
      <div className="conv-log conv-log--empty">
        <svg viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
        <p>Conversation will appear here</p>
        <span>Try saying "next step" or "list ingredients"</span>
      </div>
    );
  }

  return (
    <div className="conv-log">
      {[...log].reverse().map((entry) => (
        <div key={entry.id} className={`log-entry log-entry--${entry.type}`}>
          <span className="log-icon">
            {entry.type === 'user' ? '🎙️' : entry.type === 'assistant' ? '🤖' : entry.type === 'error' ? '⚠️' : '📌'}
          </span>
          <div className="log-content">
            <span className="log-message">{entry.message}</span>
            <span className="log-time">{formatTime(entry.timestamp)}</span>
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
