import { parseIntent, buildReply } from '../services/aiService.js';
import Recipe from '../models/Recipe.js';

export async function handleCommand(req, res, next) {
  try {
    const { command, context = {} } = req.body;

    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Command string is required' });
    }

    // Step 1: Parse intent using OpenAI
    const parsed = await parseIntent(command);
    const { intent, recipe: recipeName, time, confidence } = parsed;

    // Step 2: Build response context from DB if needed
    let responseContext = {};
    let data = {};

    if (intent === 'start_recipe' && recipeName) {
      const recipe = await Recipe.findOne({
        name: { $regex: recipeName, $options: 'i' },
      }).lean();

      if (recipe) {
        responseContext.recipeName = recipe.name;
        responseContext.stepInstruction = recipe.steps[0]?.instruction;
        responseContext.stepNumber = 1;
        responseContext.totalSteps = recipe.steps.length;
        data.recipe = recipe;
        data.stepIndex = 0;
      } else {
        responseContext.recipeName = null;
      }
    }

    if (intent === 'next_step' && context.recipeId && context.stepIndex !== undefined) {
      const recipe = await Recipe.findById(context.recipeId).lean();
      if (recipe) {
        const nextIndex = context.stepIndex + 1;
        if (nextIndex < recipe.steps.length) {
          responseContext.stepInstruction = recipe.steps[nextIndex].instruction;
          responseContext.stepNumber = nextIndex + 1;
          responseContext.totalSteps = recipe.steps.length;
          data.stepIndex = nextIndex;
          data.stepDuration = recipe.steps[nextIndex].duration || 0;
        } else {
          responseContext.stepInstruction = null;
        }
      }
    }

    if (intent === 'prev_step' && context.recipeId && context.stepIndex !== undefined) {
      const recipe = await Recipe.findById(context.recipeId).lean();
      if (recipe) {
        const prevIndex = Math.max(0, context.stepIndex - 1);
        responseContext.stepInstruction = recipe.steps[prevIndex].instruction;
        responseContext.stepNumber = prevIndex + 1;
        responseContext.totalSteps = recipe.steps.length;
        data.stepIndex = prevIndex;
        data.stepDuration = recipe.steps[prevIndex].duration || 0;
      }
    }

    if (intent === 'repeat_step' && context.recipeId && context.stepIndex !== undefined) {
      const recipe = await Recipe.findById(context.recipeId).lean();
      if (recipe) {
        const step = recipe.steps[context.stepIndex];
        responseContext.stepInstruction = step?.instruction;
        responseContext.stepNumber = context.stepIndex + 1;
        responseContext.totalSteps = recipe.steps.length;
        data.stepDuration = step?.duration || 0;
      }
    }

    if (intent === 'list_ingredients' && context.recipeId) {
      const recipe = await Recipe.findById(context.recipeId).lean();
      if (recipe) {
        responseContext.ingredients = recipe.ingredients.map(
          (i) => `${i.amount} ${i.name}`
        );
      }
    }

    if (intent === 'start_timer' && time) {
      responseContext.timerSeconds = time;
      data.timerSeconds = time;
    }

    if (intent === 'list_recipes') {
      const recipes = await Recipe.find({}).select('name cookingTime difficulty').lean();
      data.recipes = recipes;
    }

    // Step 3: Build natural language reply
    const reply = buildReply(intent, responseContext);

    res.json({
      intent,
      reply,
      confidence,
      data,
    });
  } catch (err) {
    next(err);
  }
}
