# Anime Info Website

Website info & pencarian anime pakai data Jikan API v4. Dibangun bertahap 4 hari.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express + Redis
- Data source: [Jikan API v4](https://api.jikan.moe/v4)

## Dokumen
- [PRD.md](./PRD.md) — spek fitur lengkap
- [CLAUDE.md](./CLAUDE.md) — panduan arsitektur & convention

## Struktur
```
project-root/
├── README.md
├── PRD.md
├── CLAUDE.md
├── frontend/
└── backend/
```

## Rencana Pengerjaan (4 Hari)

### Hari 1 — Setup & Backend Dasar
- Init repo, folder `/frontend` `/backend`
- Setup Express server + Redis client
- Buat `jikanService` (module khusus panggil Jikan API)
- Route `GET /api/top` (proxy `/top/anime` + cache Redis)
- Test proxy jalan, cache kebaca

### Hari 2 — Backend Lengkap + Frontend Setup
- Route `GET /api/search?q=` (cache TTL pendek)
- Route `GET /api/anime/:id` (cache TTL sedang)
- Throttle/queue request ke Jikan (hindar 429)
- Init React + Vite, routing (React Router): Landing, Beranda, Detail

### Hari 3 — Frontend Fitur Utama
- Landing page (info website)
- Beranda Anime: search bar + debounce, default tampil Top Anime
- Grid hasil anime + pagination (`pagination.has_next_page`)
- Halaman Detail Anime (fetch by id)

### Hari 4 — UX, Error Handling, Polish
- Loading state (skeleton/spinner) semua fetch
- Error state khusus 429 (pesan + retry button)
- Cache sisi frontend (localStorage) opsional
- Responsive mobile
- Testing manual end-to-end + deploy (frontend: Vercel/Netlify, backend: Railway/Render)

## Setup Lokal

```bash
# Backend
cd backend
npm install
cp .env.example .env   # isi REDIS_URL, PORT
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

## Environment Variables (Backend)
```
PORT=5000
REDIS_URL=redis://localhost:6379
JIKAN_BASE_URL=https://api.jikan.moe/v4
```

## Status
- [ ] Hari 1 — Setup & Backend Dasar
- [ ] Hari 2 — Backend Lengkap + Frontend Setup
- [ ] Hari 3 — Frontend Fitur Utama
- [ ] Hari 4 — UX, Error Handling, Polish
