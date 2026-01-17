import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import PlayerA from './pages/PlayerA';
import PlayerB from './pages/PlayerB';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Lobby />} />
        <Route path="/a" element={<PlayerA />} />
        <Route path="/b" element={<PlayerB />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
