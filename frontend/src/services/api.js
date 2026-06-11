const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('ca_token');
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// ─── Auth ─────────────────────────────────────────────────────
export const authApi = {
  signup: (email, password, name) =>
    request('/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, name }) }),

  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  me: () => request('/auth/me'),
};

// ─── Recipes ──────────────────────────────────────────────────
export const recipeApi = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/recipes${qs ? `?${qs}` : ''}`);
  },

  getById: (id) => request(`/recipes/${id}`),

  searchByName: (name) => request(`/recipes/search?name=${encodeURIComponent(name)}`),

  toggleFavorite: (recipeId) =>
    request(`/recipes/${recipeId}/favorite`, { method: 'POST' }),

  getFavorites: () => request('/recipes/favorites'),
};

// ─── Command ──────────────────────────────────────────────────
export const commandApi = {
  send: (command, context = {}) =>
    request('/command', {
      method: 'POST',
      body: JSON.stringify({ command, context }),
    }),
};

// ─── Session ──────────────────────────────────────────────────
export const sessionApi = {
  get: () => request('/session'),
  save: (recipeId, stepIndex) =>
    request('/session', { method: 'POST', body: JSON.stringify({ recipeId, stepIndex }) }),
  clear: () => request('/session', { method: 'DELETE' }),
};
