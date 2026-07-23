import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import redis from './redisClient.js';
import { getTopAnime, searchAnime, getAnimeById } from './services/jikanService.js';

const app = express();
app.use(cors());

const CACHE_TTL = 3600; // 1 jam

app.get('/api/top', async (_req, res) => {
  try {
    const cached = await redis.get('jikan:top:anime');
    if (cached) {
      console.log('Cache HIT: jikan:top:anime');
      return res.json(JSON.parse(cached));
    }

    console.log('Cache MISS: jikan:top:anime — fetching Jikan');
    const data = await getTopAnime();
    await redis.setEx('jikan:top:anime', CACHE_TTL, JSON.stringify(data));

    res.json(data);
  } catch (err) {
    console.error('GET /api/top error:', err.message);
    res.status(err.status || 502).json({ error: err.message });
  }
});

app.get('/api/anime/:id', async (req, res) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) return res.status(400).json({ error: 'Valid anime ID is required' });

  const cacheKey = `jikan:anime:${id}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      console.log(`Cache HIT: ${cacheKey}`);
      return res.json(JSON.parse(cached));
    }

    console.log(`Cache MISS: ${cacheKey} — fetching Jikan`);
    const data = await getAnimeById(id);
    await redis.setEx(cacheKey, 1800, JSON.stringify(data)); // 30 menit

    res.json(data);
  } catch (err) {
    console.error(`GET /api/anime/${id} error:`, err.message);
    const status = err.status || 502;
    res.status(status).json({ error: err.message });
  }
});

app.get('/api/search', async (req, res) => {
  const q = req.query.q?.trim();
  if (!q) return res.status(400).json({ error: 'Query parameter q is required' });

  try {
    const cached = await redis.get(`jikan:search:${q}`);
    if (cached) {
      console.log(`Cache HIT: jikan:search:${q}`);
      return res.json(JSON.parse(cached));
    }

    console.log(`Cache MISS: jikan:search:${q} — fetching Jikan`);
    const data = await searchAnime(q);
    await redis.setEx(`jikan:search:${q}`, 300, JSON.stringify(data));

    res.json(data);
  } catch (err) {
    console.error('GET /api/search error:', err.message);
    res.status(err.status || 502).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on :${process.env.PORT}`);
});
