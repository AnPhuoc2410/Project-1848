import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { socket } from '../../socket';

export default function PlayerA() {
  const [params] = useSearchParams();
  const roomId = params.get('room') || 'mln131';

  const [playerBConnected, setPlayerBConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    socket.emit('join-game3', { roomId, role: 'A' });

    socket.on('game3-player-joined', ({ role }) => {
      if (role === 'B') setPlayerBConnected(true);
    });

    socket.on('game3-complete', () => {
      setGameComplete(true);
    });

    return () => {
      socket.off('game3-player-joined');
      socket.off('game3-complete');
    };
  }, [roomId]);

  return (
    <div className="game-page">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      </div>

      {/* Header */}
      <header className="game-header">
        <div className="flex items-center gap-4">
          <h1 className="special-font text-2xl font-black text-secondary">
            PL<b>A</b>YER A
          </h1>
          <span className="px-3 py-1 rounded-full bg-secondary/20 text-secondary text-sm font-medium">
            📖 Bảng mã Morse
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              playerBConnected
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {playerBConnected ? '🟢 Player B online' : '⏳ Chờ Player B...'}
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
              🎉 Hoàn thành Game 3!
            </h2>
            <p className="text-text/70 mb-4">
              Cả hai đã giải mã thành công mã Morse!
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
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {/* Instructions */}
        <div className="game-card mb-6">
          <h3 className="card-title">📋 Hướng dẫn</h3>
          <ol className="text-sm text-text/70 space-y-2">
            <li>
              1. Lắng nghe Player B mô tả ánh sáng: <strong>NGẮN</strong> (chấm)
              hoặc <strong>DÀI</strong> (gạch)
            </li>
            <li>2. Tra bảng mã Morse bên dưới để tìm chữ cái tương ứng</li>
            <li>3. Đọc lại chữ cái cho Player B biết</li>
            <li>4. Ghép đủ các chữ → Player B nhập đáp án</li>
          </ol>
        </div>

        {/* Morse Code Reference */}
        <div className="game-card">
          <h3 className="card-title">🔤 Bảng mã Morse</h3>
          <p className="text-sm text-text/50 mb-4">
            Chấm (•) = NGẮN | Gạch (—) = DÀI
          </p>
          <div className="rounded-xl overflow-hidden bg-white p-4 border border-border">
            <img
              src="/img_game/mmorse.jpg"
              alt="Bảng mã Morse"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Listening Status */}
        {!gameComplete && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-sm border border-border">
              <div className="three-body" style={{ '--uib-size': '25px' }}>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <span className="text-text/70">
                Lắng nghe Player B mô tả mã Morse...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
