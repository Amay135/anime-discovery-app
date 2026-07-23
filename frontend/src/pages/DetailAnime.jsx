import { useParams, Link } from 'react-router-dom';

export default function DetailAnime() {
  const { id } = useParams();
  return (
    <div>
      <h1>Detail Anime #{id}</h1>
      <p>Detail coming soon.</p>
      <Link to="/beranda">← Beranda</Link>
    </div>
  );
}
