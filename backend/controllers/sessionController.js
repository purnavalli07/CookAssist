import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

export async function saveSession(req, res, next) {
  try {
    const { recipeId, stepIndex } = req.body;

    if (!recipeId || stepIndex === undefined) {
      return res.status(400).json({ error: 'recipeId and stepIndex required' });
    }

    await User.findByIdAndUpdate(req.user._id, {
      lastSession: {
        recipeId,
        stepIndex,
        updatedAt: new Date(),
      },
    });

    res.json({ message: 'Session saved' });
  } catch (err) {
    next(err);
  }
}

export async function getSession(req, res, next) {
  try {
    const user = await User.findById(req.user._id)
      .populate('lastSession.recipeId')
      .lean();

    const session = user.lastSession;

    if (!session?.recipeId || !session.recipeId._id) {
      return res.json({ session: null });
    }

    res.json({
      session: {
        recipe: session.recipeId,
        stepIndex: session.stepIndex,
        updatedAt: session.updatedAt,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function clearSession(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      lastSession: { recipeId: null, stepIndex: 0, updatedAt: null },
    });
    res.json({ message: 'Session cleared' });
  } catch (err) {
    next(err);
  }
}
