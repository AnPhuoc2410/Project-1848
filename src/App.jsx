import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScientificSocialism from './pages/ScientificSocialism';
import './index.css';

const App = () => {
  return (
    <BrowserRouter>
      <main className="relative w-screen min-h-screen overflow-x-hidden bg-background text-text">
        <Routes>
          <Route path="/" element={<ScientificSocialism />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default App;