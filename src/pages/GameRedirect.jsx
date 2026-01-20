import Navbar from '../components/Navbar';

const GameRedirect = () => {
  return (
    <div className="relative min-h-screen bg-background text-text">
      <Navbar />
      <div className="flex items-center justify-center pt-28 pb-12 px-4">
        <div className="text-center px-4">
          <h1
            className="text-3xl font-bold text-primary mb-4"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Truy cập game
          </h1>
        </div>
      </div>
    </div>
  );
};

export default GameRedirect;
