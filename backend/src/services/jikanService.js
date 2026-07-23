import https from 'node:https';

const BASE = process.env.JIKAN_BASE_URL;

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (!res.statusCode || res.statusCode >= 400) {
        const err = new Error(`Jikan responded ${res.statusCode}`);
        err.status = res.statusCode;
        reject(err);
        return;
      }
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
}

// ponytail: simple sequential queue, 350ms gap (~2.85 req/s, well under 3/s limit)
let queue = Promise.resolve();
const MIN_GAP = 350;

function enqueue(fn) {
  const p = queue.then(fn, fn);
  queue = p.then(
    () => new Promise(r => setTimeout(r, MIN_GAP)),
    () => new Promise(r => setTimeout(r, MIN_GAP))
  );
  return p;
}

async function fetchWithRetry(url, retries = 1) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await enqueue(() => fetchJSON(url));
    } catch (err) {
      if (err.status === 429 && i < retries) {
        const delay = 2000 * (i + 1);
        console.log(`Jikan 429, retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      if (err.status === 429) {
        const e = new Error('Jikan API sedang sibuk, coba lagi');
        e.status = 429;
        throw e;
      }
      throw err;
    }
  }
}

export function getTopAnime() { return fetchWithRetry(`${BASE}/top/anime`); }
export function searchAnime(q) { return fetchWithRetry(`${BASE}/anime?q=${encodeURIComponent(q)}`); }
export function getAnimeById(id) { return fetchWithRetry(`${BASE}/anime/${id}`); }
