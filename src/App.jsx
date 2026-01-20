import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScientificSocialism from './pages/ScientificSocialism';
import './index.css';

// Lazy load components that might use heavy dependencies or sockets
const MirrorHall = lazy(() => import('./pages/MirrorHall'));
const MiniGame = lazy(() => import('./pages/MiniGame'));
const GameRedirect = lazy(() => import('./pages/GameRedirect'));
const Lobby = lazy(() => import('./pages/Lobby'));
const PlayerA = lazy(() => import('./pages/PlayerA'));
const PlayerB = lazy(() => import('./pages/PlayerB'));

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
            <Route path="/a" element={<PlayerA />} />
            <Route path="/b" element={<PlayerB />} />
          </Routes>
        </Suspense>
      </main>
    </BrowserRouter>
  );
};

export default App;
