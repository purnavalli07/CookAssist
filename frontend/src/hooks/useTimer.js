import { useState, useRef, useCallback, useEffect } from 'react';

export function useTimer({ onComplete, onTick } = {}) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [totalTime, setTotalTime] = useState(0);

  const intervalRef = useRef(null);

  const clear = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const start = useCallback((seconds) => {
    if (seconds <= 0) return;
    clear();
    setTotalTime(seconds);
    setTimeLeft(seconds);
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        onTick?.(next);
        if (next <= 0) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, 1000);
  }, [onComplete, onTick]);

  const stop = useCallback(() => {
    clear();
    setIsRunning(false);
    setTimeLeft(0);
    setTotalTime(0);
  }, []);

  const pause = useCallback(() => {
    clear();
    setIsRunning(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => () => clear(), []);

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return { timeLeft, isRunning, totalTime, progress, start, stop, pause };
}

export function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}
