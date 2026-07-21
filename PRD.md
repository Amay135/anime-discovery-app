# PRD — Anime Info Website (Jikan API)

## 1. Overview
Website info anime pakai data dari Jikan API v4. User buka landing page info website, masuk ke Beranda Anime, lalu browse/search/cek detail anime.

## 2. Tujuan
- Kasih user cara gampang cari & jelajah anime
- Tampil Top Anime ranking di beranda
- Response cepat + hindar rate limit Jikan (3 req/detik, 60/menit)

## 3. Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express + Redis
- Data source: Jikan API v4 (`https://api.jikan.moe/v4`)

## 4. Arsitektur
```
React (Vite) → Express (proxy + cache) → Redis (cache layer) → Jikan API
```
Backend wajib jadi proxy. Semua request ke Jikan lewat Express, gak langsung dari frontend. Redis cache hasil biar gak spam Jikan tiap request sama.

## 5. Halaman

### 5.1 Landing Page
- Info tentang website (deskripsi, sumber data Jikan, disclaimer non-affiliasi)
- CTA tombol "Masuk Beranda Anime"

### 5.2 Beranda Anime
- Search bar (`/anime?q=...`)
- Section "Top Anime" (ranking) tampil default sebelum user search
- Grid/list hasil anime (poster, judul, skor, tipe)
- Pagination pakai `pagination.has_next_page` dari Jikan
- Klik card → ke halaman detail

### 5.3 Halaman Detail Anime
- Info lengkap: judul, sinopsis, skor, genre, episode, status, gambar
- Loading state saat fetch
- Error state (khusus 429 kasih pesan "server sibuk, coba lagi")

## 6. Fitur

| Fitur | Endpoint Jikan | Catatan |
|---|---|---|
| Search anime | `/anime?q=` | debounce input, lewat backend |
| Top Anime (beranda) | `/top/anime` | cache lama di Redis (jarang berubah) |
| Detail anime | `/anime/{id}` | cache per id |
| Pagination | field `pagination.has_next_page` | next/prev button |
| Loading & error state | - | skeleton loader, retry button saat 429 |
| Cache | Redis (backend) + optional localStorage (frontend, short-term) | kurangi request duplikat |

## 7. Backend — Express + Redis
- Endpoint proxy sendiri, contoh:
  - `GET /api/search?q=`
  - `GET /api/top`
  - `GET /api/anime/:id`
- Tiap endpoint cek Redis dulu → kalau miss, fetch Jikan → simpan Redis (TTL beda-beda: top anime TTL lebih lama, search TTL pendek)
- Rate limit internal (misal pakai queue/throttle) biar gak lewat batas Jikan 3 req/detik
- Handle error 429 dari Jikan → retry pakai backoff atau balikin pesan jelas ke frontend

## 8. Non-Functional
- Response backend < 500ms (cache hit)
- Handle Jikan down/limit gracefully, gak crash
- Mobile responsive

## 9. Out of Scope (versi awal)
- User login/auth
- Watchlist/favorit
- Komentar/rating user

## 10. Metrik Sukses
- Search & detail page load lancar tanpa error 429 ke user
- Cache hit rate tinggi (kurangi beban Jikan)
