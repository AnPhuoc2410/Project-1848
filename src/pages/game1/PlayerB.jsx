import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { FreemasonCipherKey } from '../../components/FreemasonCipher';

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';

  const [answer, setAnswer] = useState('');
  const [playerAConnected, setPlayerAConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.emit('join-game1', { roomId, role: 'B' });

    socket.on('game1-player-joined', ({ role }) => {
      if (role === 'A') setPlayerAConnected(true);
    });

    socket.on('game1-wrong-answer', ({ message }) => {
      setError(message);
      setLoading(false);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('game1-complete', () => {
      setGameComplete(true);
      setLoading(false);
      setTimeout(() => {
        navigate(`/game2/b?room=${roomId}`);
      }, 2000);
    });

    return () => {
      socket.off('game1-player-joined');
      socket.off('game1-wrong-answer');
      socket.off('game1-complete');
    };
  }, [roomId, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError('');
    socket.emit('submit-game1-answer', {
      roomId,
      answer: answer.toUpperCase(),
    });
  };

  return (
    <div className="game-page">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      </div>

      {/* Header */}
      <header className="game-header">
        <div className="flex items-center gap-4">
          <h1 className="special-font text-2xl font-black text-primary">
            PL<b>A</b>YER B
          </h1>
          <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
            🔓 Giải mã
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              playerAConnected
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {playerAConnected ? '🟢 Player A online' : '⏳ Chờ Player A...'}
          </span>
          <span className="px-3 py-1 rounded-lg bg-white/80 text-text/60 text-sm">
            Room: {roomId}
          </span>
        </div>
      </header>

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="game-overlay">
          <div className="overlay-card bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Chính xác!
            </h2>
            <p className="text-text/70 mb-4">
              Đang chuyển sang Game 2: Nối dây...
            </p>
            <div className="three-body mx-auto">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left - Cipher Key */}
        <div className="game-card">
          <div className="rounded-xl overflow-hidden bg-white p-4 border border-border">
            <img
              src="/img_game/FreemasonV2.png"
              alt="Bảng mã Freemason"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Right - Answer Input */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="game-card">
            <h3 className="card-title">📋 Hướng dẫn</h3>
            <ol className="text-sm text-text/70 space-y-2">
              <li>1. Lắng nghe Player A mô tả ký hiệu qua lời nói</li>
              <li>2. Tra bảng mã bên trái để tìm chữ cái tương ứng</li>
              <li>3. Nói lại chữ cái cho Player A biết</li>
              <li>4. Ghép đủ các chữ → Nhập đáp án bên dưới</li>
            </ol>
          </div>

          {/* Answer Form */}
          <div className="game-card">
            <h3 className="card-title">✏️ Nhập đáp án</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập từ đã giải mã..."
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text 
                           focus:border-primary focus:outline-none transition-colors
                           font-atkinson text-lg uppercase tracking-widest"
                disabled={gameComplete}
              />

              <button
                type="submit"
                disabled={!answer.trim() || loading || gameComplete}
                className="btn-check w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div
                      className="three-body"
                      style={{ '--uib-size': '20px' }}
                    >
                      <div className="three-body__dot"></div>
                      <div className="three-body__dot"></div>
                      <div className="three-body__dot"></div>
                    </div>
                    Đang kiểm tra...
                  </span>
                ) : (
                  '✓ Kiểm tra đáp án'
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                <p className="text-primary font-medium">❌ {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
