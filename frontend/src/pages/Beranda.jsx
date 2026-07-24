import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getTopAnime, searchAnime } from '../services/api';

export default function Beranda() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('top'); // 'top' | 'search'
  const debounceRef = useRef(null);

  const fetchTop = useCallback(async (p) => {
    setLoading(true);
    try {
      const data = await getTopAnime(p);
      setResults(data.data || []);
      setHasNext(data.pagination?.has_next_page ?? false);
    } catch (err) {
      console.error('getTopAnime error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSearch = useCallback(async (q, p) => {
    setLoading(true);
    try {
      const data = await searchAnime(q, p);
      setResults(data.data || []);
      setHasNext(data.pagination?.has_next_page ?? false);
    } catch (err) {
      console.error('searchAnime error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // initial load: top anime page 1
  useEffect(() => { fetchTop(1); }, [fetchTop]);

  // debounced search
  const onSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setMode('top');
      setPage(1);
      fetchTop(1);
      return;
    }
    debounceRef.current = setTimeout(() => {
      setMode('search');
      setPage(1);
      fetchSearch(val.trim(), 1);
    }, 500);
  };

  const goPage = (dir) => {
    const next = page + dir;
    if (next < 1) return;
    setPage(next);
    mode === 'top' ? fetchTop(next) : fetchSearch(query.trim(), next);
  };

  return (
    <main className="beranda">
      <h1>Beranda Anime</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Cari anime..."
          value={query}
          onChange={onSearchChange}
        />
      </div>

      <section className="anime-grid">
        {loading && <p className="status-msg">Loading...</p>}
        {!loading && results.length === 0 && (
          <p className="status-msg">Tidak ada hasil.</p>
        )}
        {results.map((a) => (
          <Link to={`/anime/${a.mal_id}`} key={a.mal_id} className="anime-card">
            <img
              src={a.images?.jpg?.image_url || ''}
              alt={a.title}
              loading="lazy"
            />
            <div className="card-info">
              <h3>{a.title}</h3>
              <span className="card-meta">
                {a.type && `${a.type}`}{a.score != null && ` • ⭐ ${a.score}`}
              </span>
            </div>
          </Link>
        ))}
      </section>

      {results.length > 0 && (
        <div className="pagination">
          <button disabled={page <= 1} onClick={() => goPage(-1)}>
            ← Prev
          </button>
          <span>Halaman {page}</span>
          <button disabled={!hasNext} onClick={() => goPage(1)}>
            Next →
          </button>
        </div>
      )}

      <Link to="/" className="back-link">← Kembali</Link>
    </main>
  );
}
