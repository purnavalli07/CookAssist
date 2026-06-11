import React from 'react';
import './RecipeCard.css';

const CUISINE_EMOJI = {
  indian: '🇮🇳',
  italian: '🇮🇹',
  american: '🇺🇸',
  chinese: '🇨🇳',
  mexican: '🇲🇽',
  japanese: '🇯🇵',
  default: '🍽️',
};

const DIFF_COLOR = {
  easy: 'var(--color-success)',
  medium: 'var(--color-warn)',
  hard: 'var(--color-error)',
};

export default function RecipeCard({ recipe, onStart, isFavorite, onToggleFavorite }) {
  const cuisineKey = recipe.cuisine?.toLowerCase() || 'default';
  const emoji = CUISINE_EMOJI[cuisineKey] || CUISINE_EMOJI.default;

  return (
    <div className="recipe-card">
      <div className="recipe-card-header">
        <span className="recipe-emoji">{emoji}</span>
        <button
          className={`fav-btn ${isFavorite ? 'fav-btn--active' : ''}`}
          onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(recipe._id); }}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg viewBox="0 0 24 24" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" width="18" height="18">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      <h3 className="recipe-name">{recipe.name}</h3>
      {recipe.description && (
        <p className="recipe-desc">{recipe.description}</p>
      )}

      <div className="recipe-meta">
        <span className="meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm.5 5v5.25l4.5 2.67-.75 1.23L11 13V7h1.5z"/>
          </svg>
          {recipe.cookingTime} min
        </span>
        <span className="meta-item">
          <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
          </svg>
          {recipe.servings} servings
        </span>
        <span
          className="meta-item meta-difficulty"
          style={{ color: DIFF_COLOR[recipe.difficulty] }}
        >
          {recipe.difficulty}
        </span>
      </div>

      {recipe.tags?.length > 0 && (
        <div className="recipe-tags">
          {recipe.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <button className="start-btn" onClick={() => onStart?.(recipe._id)}>
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M8 5v14l11-7z"/>
        </svg>
        Start Cooking
      </button>
    </div>
  );
}
