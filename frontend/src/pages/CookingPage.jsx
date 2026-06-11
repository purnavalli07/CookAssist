import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { recipeApi } from '../services/api.js';
import { useSpeech } from '../hooks/useSpeech.js';
import { useTimer } from '../hooks/useTimer.js';
import { useCooking } from '../hooks/useCooking.js';
import VoiceControl from '../components/VoiceControl.jsx';
import StepViewer from '../components/StepViewer.jsx';
import TimerDisplay from '../components/TimerDisplay.jsx';
import ModeToggle from '../components/ModeToggle.jsx';
import ConversationLog from '../components/ConversationLog.jsx';
import './CookingPage.css';

export default function CookingPage() {
  const { recipeId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [handsFree, setHandsFree] = useState(false);
  const [activeTab, setActiveTab] = useState('steps');

  const handsFreeRef = useRef(false);
  handsFreeRef.current = handsFree;

  // ─── Timer ───────────────────────────────────────────────
  const timerRef = useRef(null);   // store timer so speak callback can access it

  // ─── Speech ──────────────────────────────────────────────
  // onResult is wired AFTER cooking hook is set up, via a ref
  const onResultRef = useRef(null);

  const { isListening, isSpeaking, transcript, isSupported, startListening, stopListening, speak } =
    useSpeech({
      onResult: (text) => onResultRef.current?.(text),   // ← always calls latest
      onError: (err) => console.warn('[Speech Error]', err),
    });

  // ─── Cooking ─────────────────────────────────────────────
  const { stepIndex, log, isProcessing, processCommand, goToStep } = useCooking({
    recipe,
    speak,
    handsFreeMode: handsFreeRef,
    startListening,
  });

  // ─── Timer setup (needs speak) ───────────────────────────
  const timer = useTimer({
    onComplete: () => speak('Timer done! Your food needs attention.'),
  });
  timerRef.current = timer;

  // ─── Wire onResult AFTER all hooks ready ─────────────────
  // This avoids the stale-closure problem completely
  onResultRef.current = async (text) => {
    const result = await processCommand(text);
    if (result?.intent === 'start_timer' && result?.data?.timerSeconds) {
      timerRef.current.start(result.data.timerSeconds);
    }
    if (result?.intent === 'stop_timer') {
      timerRef.current.stop();
    }
  };

  // ─── Load recipe ─────────────────────────────────────────
  useEffect(() => {
    recipeApi.getById(recipeId)
      .then(({ recipe: r }) => {
        setRecipe(r);
        const startStep = parseInt(searchParams.get('step') || '0', 10);
        if (startStep > 0) {
          goToStep(startStep, true);
        }
        // Small delay so TTS voices are loaded
        setTimeout(() => {
          speak(`Starting ${r.name}. Step 1: ${r.steps[0]?.instruction}`);
        }, 500);
      })
      .catch((err) => {
        console.error('Failed to load recipe:', err);
        navigate('/');
      })
      .finally(() => setLoading(false));
  }, [recipeId]); // eslint-disable-line

  const toggleHandsFree = () => {
    const next = !handsFree;
    setHandsFree(next);
    speak(
      next
        ? 'Hands-free mode on. I will listen automatically after each response.'
        : 'Hands-free mode off. Tap the mic to speak.'
    );
  };

  if (loading) {
    return (
      <div className="cooking-loading">
        <div className="spinner" />
        <p>Loading recipe...</p>
      </div>
    );
  }

  return (
    <div className="cooking-page">
      <header className="cooking-header">
        <button className="back-btn" onClick={() => navigate('/')}>← Recipes</button>
        <div className="cooking-title">
          <h1>{recipe?.name}</h1>
          <span className="cooking-subtitle">
            {recipe?.steps?.length} steps · {recipe?.cookingTime} min
          </span>
        </div>
        <div className="header-spacer" />
      </header>

      <div className="cooking-layout">
        <aside className="cooking-sidebar">
          <div className="voice-panel">
            <VoiceControl
              isListening={isListening}
              isSpeaking={isSpeaking}
              isProcessing={isProcessing}
              transcript={transcript}
              onToggleListen={() => isListening ? stopListening() : startListening()}
              isSupported={isSupported}
            />
            <ModeToggle handsFree={handsFree} onToggle={toggleHandsFree} />
          </div>

          {(timer.isRunning || timer.timeLeft > 0) && (
            <TimerDisplay
              timeLeft={timer.timeLeft}
              isRunning={timer.isRunning}
              totalTime={timer.totalTime}
              progress={timer.progress}
              onStop={timer.stop}
            />
          )}

          <div className="hint-box">
            <p className="hint-title">Voice commands</p>
            <ul className="hint-list">
              <li>Next step</li>
              <li>Previous step</li>
              <li>Repeat that</li>
              <li>Set timer for 5 minutes</li>
              <li>List ingredients</li>
            </ul>
          </div>
        </aside>

        <main className="cooking-main">
          <div className="cooking-tabs">
            {['steps', 'ingredients', 'log'].map(tab => (
              <button
                key={tab}
                className={`cooking-tab ${activeTab === tab ? 'cooking-tab--active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'steps' && '📋 Steps'}
                {tab === 'ingredients' && '🥗 Ingredients'}
                {tab === 'log' && `💬 Log ${log.length > 0 ? `(${log.length})` : ''}`}
              </button>
            ))}
          </div>

          {activeTab === 'steps' && recipe && (
            <StepViewer
              recipe={recipe}
              stepIndex={stepIndex}
              onStepClick={(idx) => {
                goToStep(idx);
                speak(`Step ${idx + 1}: ${recipe.steps[idx].instruction}`);
              }}
            />
          )}

          {activeTab === 'ingredients' && recipe && (
            <div className="ingredients-panel">
              <h3 className="ingredients-title">Ingredients for {recipe.name}</h3>
              <div className="ingredients-grid">
                {recipe.ingredients.map((ing, i) => (
                  <div key={i} className="ingredient-item">
                    <span className="ingredient-amount">{ing.amount}</span>
                    <span className="ingredient-name">{ing.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'log' && (
            <div className="log-panel">
              <ConversationLog log={log} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}