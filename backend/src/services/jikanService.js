const BASE = process.env.JIKAN_BASE_URL;

export async function getTopAnime() {
  const res = await fetch(`${BASE}/top/anime`);
  if (!res.ok) {
    if (res.status === 429) throw new Error('Jikan rate limited (429) — retry later');
    throw new Error(`Jikan responded ${res.status}`);
  }
  return res.json();
}
