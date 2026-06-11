import dotenv from 'dotenv';
dotenv.config();

import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are a cooking assistant intent parser. Extract cooking-related intent and entities from user voice commands.

Respond ONLY with a valid JSON object. No explanations, no markdown, no extra text.

Supported intents:
- start_recipe: User wants to start cooking a specific recipe
- next_step: User wants to move to the next cooking step
- prev_step: User wants to go back to the previous step
- repeat_step: User wants the current step repeated
- start_timer: User wants to start a countdown timer
- stop_timer: User wants to stop or cancel a timer
- list_ingredients: User wants to hear the ingredients list
- list_recipes: User wants to see available recipes
- add_favorite: User wants to save a recipe as favorite
- resume_session: User wants to resume their last cooking session
- unknown: Command doesn't match any cooking intent

Response format:
{
  "intent": "<intent_name>",
  "recipe": "<recipe name if mentioned, null otherwise>",
  "time": <number of seconds if timer mentioned, null otherwise>,
  "confidence": <0.0-1.0>
}

Examples:
Input: "start biryani recipe" -> {"intent":"start_recipe","recipe":"biryani","time":null,"confidence":0.98}
Input: "go to next step" -> {"intent":"next_step","recipe":null,"time":null,"confidence":0.99}
Input: "set a timer for 5 minutes" -> {"intent":"start_timer","recipe":null,"time":300,"confidence":0.97}
Input: "what are the ingredients" -> {"intent":"list_ingredients","recipe":null,"time":null,"confidence":0.95}`;

/**
 * Parse a natural language voice command into structured intent JSON.
 * @param {string} command - Raw transcribed voice command text
 * @returns {Promise<{intent: string, recipe: string|null, time: number|null, confidence: number}>}
 */
export async function parseIntent(command) {
  if (!command || command.trim().length === 0) {
    return { intent: 'unknown', recipe: null, time: null, confidence: 0 };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      temperature: 0.1, // Low temperature for deterministic intent parsing
      max_tokens: 150,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: command.trim() },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) throw new Error('Empty response from OpenAI');

    const parsed = JSON.parse(raw);

    // Validate required fields
    if (!parsed.intent) throw new Error('Missing intent field');

    return {
      intent: parsed.intent,
      recipe: parsed.recipe || null,
      time: typeof parsed.time === 'number' ? parsed.time : null,
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 0.8,
    };
  } catch (err) {
    console.error('[AI Intent] Parse error:', err.message);

    // Graceful fallback - return unknown intent rather than crashing
    return {
      intent: 'unknown',
      recipe: null,
      time: null,
      confidence: 0,
      error: err.message,
    };
  }
}

/**
 * Build a human-readable TTS reply for a given intent + context.
 */
export function buildReply(intent, context = {}) {
  const { recipeName, stepInstruction, stepNumber, totalSteps, timerSeconds } = context;

  const replies = {
    start_recipe: recipeName
      ? `Starting ${recipeName} recipe. Let's begin!`
      : `I couldn't find that recipe. Please try again.`,
    next_step: stepInstruction
      ? `Step ${stepNumber} of ${totalSteps}: ${stepInstruction}`
      : `You're already at the last step. Great job!`,
    prev_step: stepInstruction
      ? `Going back. Step ${stepNumber} of ${totalSteps}: ${stepInstruction}`
      : `You're already at the first step.`,
    repeat_step: stepInstruction
      ? `Repeating. Step ${stepNumber}: ${stepInstruction}`
      : `No active step to repeat.`,
    start_timer: timerSeconds
      ? `Timer started for ${formatDuration(timerSeconds)}.`
      : `How long should I set the timer for?`,
    stop_timer: `Timer stopped.`,
    list_ingredients: context.ingredients
      ? `Here are the ingredients: ${context.ingredients.join(', ')}.`
      : `No recipe is active. Start a recipe first.`,
    list_recipes: `Here are the available recipes.`,
    add_favorite: recipeName
      ? `${recipeName} added to your favorites.`
      : `No recipe to add.`,
    resume_session: recipeName
      ? `Resuming ${recipeName} from step ${stepNumber}.`
      : `No previous session found.`,
    unknown: `I didn't understand that command. Try saying "next step", "start a recipe", or "set a timer".`,
  };

  return replies[intent] || replies.unknown;
}

function formatDuration(seconds) {
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins} minute${mins > 1 ? 's' : ''} and ${secs} seconds` : `${mins} minute${mins > 1 ? 's' : ''}`;
  }
  return `${seconds} second${seconds !== 1 ? 's' : ''}`;
}
