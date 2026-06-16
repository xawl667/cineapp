const BASE_URL = 'http://localhost:3000/api'

function getToken() {
  const user = localStorage.getItem('currentUser')
  return user ? JSON.parse(user).token : null
}

async function apiFetch(endpoint, options = {}) {
  const token = getToken()

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Erreur serveur')
  }

  return data
}

export const api = {
  // Auth
  register: (username, email, password) =>
    apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password })
    }),

  login: (email, password) =>
    apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    }),

  me: () => apiFetch('/auth/me'),

  // Films
  getFilms: (page = 1) => apiFetch(`/films?page=${page}`),
  getFilmById: (id) => apiFetch(`/films/${id}`),
  searchFilms: (q) => apiFetch(`/films/search?q=${encodeURIComponent(q)}`),
  getTrending: () => apiFetch('/films/trending'),

  // Favoris
  getFavoris: () => apiFetch('/favoris'),
  addFavori: (film_id) =>
    apiFetch('/favoris', {
      method: 'POST',
      body: JSON.stringify({ film_id })
    }),
  removeFavori: (film_id) =>
    apiFetch(`/favoris/${film_id}`, { method: 'DELETE' }),

  // Watchlist
  getWatchlist: () => apiFetch('/watchlist'),
  addToWatchlist: (film_id) =>
    apiFetch('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ film_id })
    }),
  removeFromWatchlist: (film_id) =>
    apiFetch(`/watchlist/${film_id}`, { method: 'DELETE' }),

  // Watched
  getWatched: () => apiFetch('/watched'),
  addWatched: (film_id, rating, review) =>
    apiFetch('/watched', {
      method: 'POST',
      body: JSON.stringify({ film_id, rating, review })
    }),
  removeWatched: (film_id) =>
    apiFetch(`/watched/${film_id}`, { method: 'DELETE' }),
}