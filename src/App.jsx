import { BrowserRouter, Routes, Route } from 'react-router-dom';
import About from './components/About';
import Contact from './components/Contact';
import Features from './components/Features';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Story from './components/Story';
import Lobby from './pages/Lobby';
import PlayerA from './pages/PlayerA';
import PlayerB from './pages/PlayerB';

const App = () => {
  return (
    <main className="relative w-screen min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Features />
      <Story />
      <Contact />
      <Footer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/a" element={<PlayerA />} />
          <Route path="/b" element={<PlayerB />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
};

export default App;
