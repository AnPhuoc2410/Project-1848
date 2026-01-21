import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import FreemasonCipher from '../../components/FreemasonCipher';

// Default secret phrase
const SECRET_PHRASE = 'CONG SAN';

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';

  const [phrase] = useState(SECRET_PHRASE);
  const [playerBConnected, setPlayerBConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);

  useEffect(() => {
    socket.emit('join-game1', { roomId, role: 'A', phrase });

    socket.on('game1-player-joined', ({ role }) => {
      if (role === 'B') setPlayerBConnected(true);
    });

    socket.on('game1-complete', () => {
      setGameComplete(true);
      setTimeout(() => {
        navigate(`/game2/a?room=${roomId}`);
      }, 2000);
    });

    return () => {
      socket.off('game1-player-joined');
      socket.off('game1-complete');
    };
  }, [roomId, phrase, navigate]);

  const letters = phrase.split('');

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
            🔐 Mã hóa
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
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Instructions */}
        <div className="game-card mb-6">
          <h3 className="card-title">📋 Hướng dẫn</h3>
          <ol className="text-sm text-text/70 space-y-2">
            <li>1. Nhìn từng ký hiệu mật mã bên dưới</li>
            <li>2. Mô tả hình dạng ký hiệu cho Player B thông qua giao ti</li>
            <li>3. Player B sẽ giải mã và đọc lại chữ cái</li>
            <li>4. Khi đủ chữ, Player B nhập đáp án → Qua Game 2</li>
          </ol>
        </div>

        {/* Cipher Display */}
        <div className="game-card">
          <h3 className="card-title">🔐 Mật mã cần giải</h3>
          <p className="text-sm text-text/50 mb-6">
            Mô tả từng ký hiệu cho Player B
          </p>

          <div className="freemason-phrase">
            {letters.map((letter, index) => (
              <div key={index} className="freemason-phrase-item">
                {letter === ' ' ? (
                  <div className="freemason-space"></div>
                ) : (
                  <FreemasonCipher letter={letter} size={70} />
                )}
                <span className="freemason-index">{index + 1}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-yellow-700 text-sm text-center">
              ⚠️ <strong>Chú ý:</strong> Mô tả hình dạng (góc, đường thẳng, có
              chấm không...)
            </p>
          </div>
        </div>

        {/* Waiting status */}
        {!gameComplete && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-xl shadow-sm border border-border">
              <div className="three-body" style={{ '--uib-size': '25px' }}>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <span className="text-text/70">
                Đang chờ Player B nhập đáp án...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
