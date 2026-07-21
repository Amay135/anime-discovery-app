import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import redis from './redisClient.js';
import { getTopAnime } from './services/jikanService.js';

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
    res.status(502).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server listening on :${process.env.PORT}`);
});
