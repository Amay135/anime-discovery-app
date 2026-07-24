import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <main className="landing">
      <h1>AnimeInfo</h1>
      <p className="landing-desc">
        Website informasi anime. Cari dan jelajahi data anime dari berbagai judul.
      </p>

      <div className="landing-info">
        <h2>Tentang Website Ini</h2>
        <ul>
          <li>Data berasal dari <strong>Jikan API v4</strong> (MyAnimeList unofficial API)</li>
          <li>Tidak berafiliasi dengan MyAnimeList, Jikan, atau pihak ketiga mana pun</li>
          <li>Website ini hanya menampilkan ulang data yang tersedia secara publik</li>
        </ul>
      </div>

      <Link to="/beranda" className="cta-button">Masuk Beranda Anime</Link>
    </main>
  );
}
