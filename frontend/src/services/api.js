const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

async function request(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
}

export function getTopAnime(page = 1) { return request(`/top?page=${page}`); }
export function searchAnime(q, page = 1) { return request(`/search?q=${encodeURIComponent(q)}&page=${page}`); }
export function getAnimeById(id) { return request(`/anime/${id}`); }
