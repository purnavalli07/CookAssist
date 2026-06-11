import { Router } from 'express';
import {
  getAllRecipes,
  getRecipeById,
  searchRecipeByName,
  toggleFavorite,
  getFavorites,
} from '../controllers/recipeController.js';
import { authenticate } from '../services/authMiddleware.js';

const router = Router();

router.get('/', getAllRecipes);
router.get('/search', searchRecipeByName);
router.get('/favorites', authenticate, getFavorites);
router.get('/:id', getRecipeById);
router.post('/:recipeId/favorite', authenticate, toggleFavorite);

export default router;
