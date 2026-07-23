import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Beranda from './pages/Beranda';
import DetailAnime from './pages/DetailAnime';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/beranda" element={<Beranda />} />
        <Route path="/anime/:id" element={<DetailAnime />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
