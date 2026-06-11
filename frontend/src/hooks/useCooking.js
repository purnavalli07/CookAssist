import { useState, useCallback, useRef } from 'react';
import { commandApi, sessionApi } from '../services/api.js';

export function useCooking({ recipe, speak, handsFreeMode, startListening }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [log, setLog] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const stepIndexRef = useRef(0);
  const recipeRef = useRef(recipe);

  // Always keep recipeRef current
  recipeRef.current = recipe;

  const addLog = useCallback((message, type = 'system') => {
    setLog(prev => [
      { id: Date.now() + Math.random(), message, type, timestamp: new Date() },
      ...prev.slice(0, 49),
    ]);
  }, []);

  const goToStep = useCallback((index, silent = false) => {
    if (!recipeRef.current) return;
    const steps = recipeRef.current.steps;
    const safeIndex = Math.max(0, Math.min(index, steps.length - 1));
    setStepIndex(safeIndex);
    stepIndexRef.current = safeIndex;
    sessionApi.save(recipeRef.current._id, safeIndex).catch(() => {});
    if (!silent) {
      const step = steps[safeIndex];
      addLog(`Step ${safeIndex + 1} of ${steps.length}: ${step.instruction}`, 'step');
    }
  }, [addLog]);

  const processCommand = useCallback(async (commandText) => {
    if (!commandText?.trim()) return null;

    // Prevent double-processing
    setIsProcessing(prev => {
      if (prev) return prev;
      return true;
    });

    addLog(`You: "${commandText}"`, 'user');

    try {
      const context = recipeRef.current
        ? { recipeId: recipeRef.current._id, stepIndex: stepIndexRef.current }
        : {};

      console.log('[Command] Sending:', commandText, 'Context:', context);

      const result = await commandApi.send(commandText, context);
      const { intent, reply, data } = result;

      console.log('[Command] Result:', intent, reply);

      // Apply state changes based on intent
      if (intent === 'start_recipe' && data?.recipe) {
        recipeRef.current = data.recipe;
        setStepIndex(0);
        stepIndexRef.current = 0;
        sessionApi.save(data.recipe._id, 0).catch(() => {});
      } else if ((intent === 'next_step' || intent === 'prev_step' || intent === 'repeat_step') && data?.stepIndex !== undefined) {
        setStepIndex(data.stepIndex);
        stepIndexRef.current = data.stepIndex;
        if (recipeRef.current?._id) {
          sessionApi.save(recipeRef.current._id, data.stepIndex).catch(() => {});
        }
      }

      addLog(reply, 'assistant');

      // Speak reply, THEN restart listening for hands-free
      speak(reply, () => {
        setIsProcessing(false);
        if (handsFreeMode?.current) {
          setTimeout(() => startListening?.(), 800);  // ← wait for TTS to fully finish
        }
      });

      return { intent, reply, data };

    } catch (err) {
      console.error('[Command] Error:', err);
      const errorMsg = `Sorry, something went wrong: ${err.message}`;
      addLog(errorMsg, 'error');
      speak(errorMsg, () => {
        setIsProcessing(false);
        if (handsFreeMode?.current) {
          setTimeout(() => startListening?.(), 800);
        }
      });
      return null;
    }
  }, [speak, addLog, handsFreeMode, startListening]);

  return { stepIndex, log, isProcessing, processCommand, goToStep, addLog };
}