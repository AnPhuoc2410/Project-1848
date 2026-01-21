import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScientificSocialism from './pages/ScientificSocialism';
import './index.css';

// Lazy load components that might use heavy dependencies or sockets
const MirrorHall = lazy(() => import('./pages/MirrorHall'));
const MiniGame = lazy(() => import('./pages/MiniGame'));
const GameRedirect = lazy(() => import('./pages/GameRedirect'));
const Lobby = lazy(() => import('./pages/Lobby'));
const PlayerA = lazy(() => import('./pages/game2/PlayerA'));
const PlayerB = lazy(() => import('./pages/game2/PlayerB'));

// Game 1: Freemason Cipher
const Game1PlayerA = lazy(() => import('./pages/game1/PlayerA'));
const Game1PlayerB = lazy(() => import('./pages/game1/PlayerB'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <main className="relative w-screen min-h-screen overflow-x-hidden bg-background text-text">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<ScientificSocialism />} />
            <Route path="/mirror-hall" element={<MirrorHall />} />
            <Route path="/mini-game" element={<MiniGame />} />
            <Route path="/game" element={<GameRedirect />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game2/a" element={<PlayerA />} />
            <Route path="/game2/b" element={<PlayerB />} />
            {/* Game 1: Freemason Cipher */}
            <Route path="/game1/a" element={<Game1PlayerA />} />
            <Route path="/game1/b" element={<Game1PlayerB />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
