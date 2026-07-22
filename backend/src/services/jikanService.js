import https from 'node:https';

const BASE = process.env.JIKAN_BASE_URL;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 429) {
        reject(new Error('Jikan rate limited (429) — retry later'));
        return;
      }
      if (!res.statusCode || res.statusCode >= 400) {
        reject(new Error(`Jikan responded ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

export function getTopAnime() { return fetchJSON(`${BASE}/top/anime`); }
export function searchAnime(q) { return fetchJSON(`${BASE}/anime?q=${encodeURIComponent(q)}`); }
