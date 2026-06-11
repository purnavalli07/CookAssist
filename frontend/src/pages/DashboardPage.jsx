import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipeApi, sessionApi } from '../services/api.js';
import { useAuth } from '../App.jsx';
import RecipeCard from '../components/RecipeCard.jsx';
import './DashboardPage.css';

export default function DashboardPage() {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [session, setSession] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      const [{ recipes: all }, { recipes: favRecipes }, { session: lastSession }] =
        await Promise.all([
          recipeApi.getAll(),
          recipeApi.getFavorites(),
          sessionApi.get(),
        ]);

      setRecipes(all);
      setFavorites(new Set(favRecipes.map((r) => r._id)));
      setSession(lastSession);
    } catch (err) {
      console.error('Failed to load data:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const handleToggleFavorite = async (recipeId) => {
    try {
      const { isFavorite } = await recipeApi.toggleFavorite(recipeId);
      setFavorites((prev) => {
        const next = new Set(prev);
        isFavorite ? next.add(recipeId) : next.delete(recipeId);
        return next;
      });
    } catch (err) {
      console.error('Failed to toggle favorite:', err.message);
    }
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchesSearch =
      !search ||
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisine?.toLowerCase().includes(search.toLowerCase()) ||
      r.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesFilter =
      activeFilter === 'all' ||
      (activeFilter === 'favorites' && favorites.has(r._id)) ||
      r.difficulty === activeFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-brand">
          <span>🍳</span>
          <span className="header-title">CookAssist</span>
        </div>
        <div className="header-user">
          <span className="user-name">Hi, {user?.name || user?.email?.split('@')[0]}</span>
          <button className="logout-btn" onClick={logout}>Sign out</button>
        </div>
      </header>

      <main className="dashboard-main">
        {/* Resume banner */}
        {session && (
          <div className="resume-banner">
            <div className="resume-info">
              <span className="resume-icon">🔖</span>
              <div>
                <strong>Continue where you left off</strong>
                <span>
                  {session.recipe.name} · Step {session.stepIndex + 1} of{' '}
                  {session.recipe.steps.length}
                </span>
              </div>
            </div>
            <div className="resume-actions">
              <button
                className="resume-btn"
                onClick={() => navigate(`/cook/${session.recipe._id}?step=${session.stepIndex}`)}
              >
                Resume
              </button>
              <button className="dismiss-btn" onClick={() => setSession(null)}>
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Search & filters */}
        <div className="search-bar-wrap">
          <div className="search-input-wrap">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" className="search-icon">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
            <input
              type="text"
              placeholder="Search recipes, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            {search && (
              <button className="search-clear" onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        <div className="filter-tabs">
          {['all', 'favorites', 'easy', 'medium', 'hard'].map((f) => (
            <button
              key={f}
              className={`filter-tab ${activeFilter === f ? 'filter-tab--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f === 'favorites' ? '❤️ Favorites' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Recipe grid */}
        {loading ? (
          <div className="loading-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-card" />
            ))}
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="no-results">
            <span>🍽️</span>
            <p>No recipes found</p>
            <span>Try a different search or filter</span>
          </div>
        ) : (
          <div className="recipe-grid">
            {filteredRecipes.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={favorites.has(recipe._id)}
                onStart={(id) => navigate(`/cook/${id}`)}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
