import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

export async function getAllRecipes(req, res, next) {
  try {
    const { search, cuisine, difficulty, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
        { cuisine: { $regex: search, $options: 'i' } },
      ];
    }
    if (cuisine) query.cuisine = { $regex: cuisine, $options: 'i' };
    if (difficulty) query.difficulty = difficulty;

    const skip = (Number(page) - 1) * Number(limit);
    const [recipes, total] = await Promise.all([
      Recipe.find(query).skip(skip).limit(Number(limit)).lean(),
      Recipe.countDocuments(query),
    ]);

    res.json({
      recipes,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getRecipeById(req, res, next) {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
}

export async function searchRecipeByName(req, res, next) {
  try {
    const { name } = req.query;
    if (!name) return res.status(400).json({ error: 'Name query required' });

    const recipe = await Recipe.findOne({
      name: { $regex: name, $options: 'i' },
    }).lean();

    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });
    res.json({ recipe });
  } catch (err) {
    next(err);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const { recipeId } = req.params;
    const user = req.user;

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    const idx = user.favorites.indexOf(recipeId);
    if (idx === -1) {
      user.favorites.push(recipeId);
    } else {
      user.favorites.splice(idx, 1);
    }
    await user.save();

    res.json({ favorites: user.favorites, isFavorite: idx === -1 });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('favorites').lean();
    res.json({ recipes: user.favorites });
  } catch (err) {
    next(err);
  }
}
