import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScientificSocialism from './pages/ScientificSocialism';
import MirrorHall from './pages/MirrorHall';
import MiniGame from './pages/MiniGame';
import GameRedirect from './pages/GameRedirect';
import Lobby from './pages/Lobby';
import PlayerA from './pages/PlayerA';
import PlayerB from './pages/PlayerB';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <main className="relative w-screen min-h-screen overflow-x-hidden bg-background text-text">
        <Routes>
          <Route path="/" element={<ScientificSocialism />} />
          <Route path="/mirror-hall" element={<MirrorHall />} />
          <Route path="/mini-game" element={<MiniGame />} />
          <Route path="/game" element={<GameRedirect />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/a" element={<PlayerA />} />
          <Route path="/b" element={<PlayerB />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;