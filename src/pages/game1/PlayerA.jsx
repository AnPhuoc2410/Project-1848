import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import FreemasonCipher from '../../components/FreemasonCipher';

// Initial time for Game 1 (5 minutes)
const INITIAL_TIME = 300;

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const playerAName = params.get('playerA') || 'Player A';
  const playerBName = params.get('playerB') || 'Player B';

  const [phrase, setPhrase] = useState(''); // Nhận từ server
  const [playerBConnected, setPlayerBConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [loading, setLoading] = useState(true); // Chờ nhận từ

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

  // Timer countdown
  useEffect(() => {
    if (!timerActive || gameComplete || loading) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameComplete, loading]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    socket.emit('join-game1', { roomId, role: 'A' });

    // Nhận từ random từ server
    socket.on('game1-phrase', ({ phrase: serverPhrase }) => {
      setPhrase(serverPhrase);
      setLoading(false);
      startTimeRef.current = Date.now(); // Start timer when phrase received
    });

    socket.on('game1-player-joined', ({ role }) => {
      if (role === 'B') setPlayerBConnected(true);
    });

    socket.on('game1-complete', () => {
      setGameComplete(true);
      setTimerActive(false);

      // Calculate time used
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Store time in sessionStorage for leaderboard
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game1 = timeUsed;
      times.playerA = playerAName;
      times.playerB = playerBName;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      setTimeout(() => {
        const urlParams = new URLSearchParams({
          room: roomId,
          playerA: playerAName,
          playerB: playerBName,
        });
        navigate(`/game2/a?${urlParams.toString()}`);
      }, 2000);
    });

    return () => {
      socket.off('game1-phrase');
      socket.off('game1-player-joined');
      socket.off('game1-complete');
    };
  }, [roomId, navigate, playerAName, playerBName]);

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
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-sm">
            {playerAName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`timer-display ${timeRemaining < 60 ? 'timer-warning' : ''}`}
          >
            ⏱️ {formatTime(timeRemaining)}
          </div>
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

      {/* Loading State - Chờ nhận từ từ server */}
      {loading && (
        <div className="game-overlay">
          <div className="overlay-card">
            <h2 className="text-xl font-bold text-text mb-2">
              🔄 Đang kết nối...
            </h2>
            <p className="text-text/70 mb-4">Đang tải từ mật mã từ server</p>
            <div className="three-body mx-auto">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-10xl mx-auto">
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
