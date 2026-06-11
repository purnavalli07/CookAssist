import { useState, useRef, useCallback, useEffect } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export function useSpeech({ onResult, onError, language = 'en-US' }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported] = useState(() => !!SpeechRecognition);

  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);
  const onResultRef = useRef(onResult);   // ← key fix
  const onErrorRef = useRef(onError);

  // Keep refs in sync every render — no stale closures
  useEffect(() => { onResultRef.current = onResult; }, [onResult]);
  useEffect(() => { onErrorRef.current = onError; }, [onError]);

  useEffect(() => {
    if (!isSupported) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      console.log('[Speech] Heard:', text);   // ← helps debug
      setTranscript(text);
      clearTimeout(timeoutRef.current);
      onResultRef.current?.(text);            // ← always calls latest version
    };

    recognition.onerror = (event) => {
      console.error('[Speech] Error:', event.error);
      setIsListening(false);
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        onErrorRef.current?.(event.error);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      clearTimeout(timeoutRef.current);
    };

    recognitionRef.current = recognition;
    return () => { recognition.abort(); };
  }, [isSupported, language]);   // ← only language dependency, not callbacks

  const startListening = useCallback(() => {
    if (!isSupported) return;

    // If already listening, stop first then restart
    try { recognitionRef.current?.abort(); } catch (_) {}

    setTimeout(() => {
      try {
        setTranscript('');
        setIsListening(true);
        recognitionRef.current.start();
        console.log('[Speech] Started listening');

        timeoutRef.current = setTimeout(() => {
          console.log('[Speech] Timeout — stopping');
          recognitionRef.current?.stop();
          setIsListening(false);
        }, 12000);
      } catch (err) {
        console.error('[Speech] Start failed:', err.message);
        setIsListening(false);
      }
    }, 100);  // ← small delay prevents "already started" errors
  }, [isSupported]);

  const stopListening = useCallback(() => {
    clearTimeout(timeoutRef.current);
    try { recognitionRef.current?.stop(); } catch (_) {}
    setIsListening(false);
  }, []);

  const speak = useCallback((text, onDone) => {
    if (!text) return;
    if (!window.speechSynthesis) { onDone?.(); return; }

    window.speechSynthesis.cancel();

    // Wait a tick for cancel to complete
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        onDone?.();
      };
      utterance.onerror = (e) => {
        console.error('[TTS] Error:', e.error);
        setIsSpeaking(false);
        onDone?.();
      };

      window.speechSynthesis.speak(utterance);
    }, 50);
  }, [language]);

  const cancelSpeech = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, transcript, isSupported, startListening, stopListening, speak, cancelSpeech };
}