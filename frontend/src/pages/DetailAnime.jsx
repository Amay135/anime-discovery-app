import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAnimeById } from '../services/api';

export default function DetailAnime() {
  const { id } = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getAnimeById(id)
      .then((data) => setAnime(data.data))
      .catch((err) => console.error('getAnimeById error:', err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <main className="detail"><p>Loading...</p></main>;
  if (!anime) return <main className="detail"><p>Anime tidak ditemukan.</p><Link to="/beranda">← Kembali</Link></main>;

  return (
    <main className="detail">
      <h1>{anime.title}</h1>

      <div className="detail-content">
        <img
          className="detail-poster"
          src={anime.images?.jpg?.large_image_url || ''}
          alt={anime.title}
        />

        <div className="detail-info">
          {anime.score != null && (
            <p><strong>Skor:</strong> ⭐ {anime.score}</p>
          )}
          {anime.type && <p><strong>Tipe:</strong> {anime.type}</p>}
          {anime.episodes != null && <p><strong>Episode:</strong> {anime.episodes}</p>}
          {anime.status && <p><strong>Status:</strong> {anime.status}</p>}
          {anime.genres?.length > 0 && (
            <p><strong>Genre:</strong> {anime.genres.map((g) => g.name).join(', ')}</p>
          )}
        </div>
      </div>

      {anime.synopsis && (
        <section className="synopsis">
          <h2>Sinopsis</h2>
          <p>{anime.synopsis}</p>
        </section>
      )}

      <Link to="/beranda" className="back-link">← Kembali ke Beranda</Link>
    </main>
  );
}
