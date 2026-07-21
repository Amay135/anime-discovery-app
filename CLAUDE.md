# CLAUDE.md

Panduan project buat Claude Code kerja di repo ini.

## Project
Website info anime. Data dari Jikan API v4. Landing page → Beranda Anime (search + top ranking) → Detail anime.

## Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Cache: Redis
- Data source: Jikan API v4 — `https://api.jikan.moe/v4` (public, no API key)

## Arsitektur Wajib
Frontend TIDAK BOLEH fetch langsung ke Jikan. Semua lewat backend Express (proxy). Backend cek Redis dulu sebelum hit Jikan.

```
React → Express (/api/*) → Redis cache → Jikan API (fallback kalau cache miss)
```

## Struktur Folder (target)
```
/frontend    React + Vite app
/backend     Express server, Redis client, route proxy
```

## Backend Routes
- `GET /api/top` → proxy `/top/anime`, cache TTL panjang (misal 1 jam)
- `GET /api/search?q=` → proxy `/anime?q=`, cache TTL pendek (misal 5 menit)
- `GET /api/anime/:id` → proxy `/anime/{id}`, cache TTL sedang (misal 30 menit)

Cache key pattern: `jikan:{endpoint}:{params}`

## Rate Limit Jikan
- Limit: 3 request/detik, 60/menit
- Backend wajib throttle/queue request keluar ke Jikan
- Kalau kena 429 dari Jikan: retry pakai backoff, atau balikin error jelas ke frontend (jangan silent fail)

## Frontend Pages
1. Landing — info website, tombol masuk beranda
2. Beranda Anime — search bar + default tampil Top Anime, grid hasil, pagination (`pagination.has_next_page`)
3. Detail Anime — sinopsis, skor, genre, episode, status

## State & UX Wajib
- Loading state tiap fetch (skeleton/spinner)
- Error state khusus buat rate limit (429) — pesan jelas + retry button
- Debounce input search (jangan fetch tiap keystroke)
- Optional: localStorage cache sisi frontend buat kurangi request ulang saat navigasi balik

## Convention
- Commit message: Conventional Commits (feat/fix/chore/docs)
- Env var backend: `.env` buat Redis URL, port, Jikan base URL — jangan hardcode
- Semua panggilan Jikan dari backend HARUS lewat satu module/service (`jikanService`), jangan sebar fetch di banyak file

## Out of Scope Sekarang
Auth, watchlist, komentar/rating user — jangan buat kecuali diminta eksplisit.
