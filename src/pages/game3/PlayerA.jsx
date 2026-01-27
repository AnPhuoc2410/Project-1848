import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { GAME_TIMES } from '../../config/gameConfig';

// Initial time for Game 3
const INITIAL_TIME = GAME_TIMES.GAME3;

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const myName = params.get('myName') || 'Player A';

  const [playerBConnected, setPlayerBConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [correctWords, setCorrectWords] = useState([]);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

  // Timer countdown
  useEffect(() => {
    if (!timerActive || gameComplete) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    socket.emit('join-game3', { roomId, role: 'A' });

    socket.on('game3-phrase-for-a', ({ correctWords: words }) => {
      setCorrectWords(words || []);
    });

    socket.on('game3-player-joined', ({ role }) => {
      if (role === 'B') setPlayerBConnected(true);
    });

    socket.on('game3-complete', () => {
      setGameComplete(true);
      setTimerActive(false);

      // Calculate time used for Game 3
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game3 = timeUsed;
      times.isScoreSubmitter = false; // Player A không submit score - chỉ Player B submit
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      // Navigate to Leaderboard after delay
      setTimeout(() => {
        navigate('/leaderboard');
      }, 2000);
    });

    socket.on('global-restart', () => {
      navigate(
        `/game1/a?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

    return () => {
      socket.off('game3-phrase-for-a');
      socket.off('game3-player-joined');
      socket.off('game3-complete');
      socket.off('global-restart');
    };
  }, [roomId, navigate]);

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
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-sm">
            {myName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div
            className={`timer-display ${timeRemaining < 60 ? 'timer-warning' : ''}`}
          >
            ⏱️ {formatTime(timeRemaining)}
          </div>
          <span className="px-3 py-1 rounded-lg bg-white/80 text-text/60 text-sm">
            Room: {roomId}
          </span>
        </div>
      </header>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="game-overlay">
          <div className="overlay-card bg-red-50 border-red-200">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              ⏰ Hết thời gian!
            </h2>
            <p className="text-text/70 mb-4">Game kết thúc</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  socket.emit('restart-all-games', { roomId });
                }}
                className="btn-primary px-6 py-2"
              >
                🔄 Chơi lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-secondary px-6 py-2"
              >
                🏠 Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="game-overlay">
          <div className="overlay-card bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Hoàn thành Game 3!
            </h2>
            <p className="text-text/70 mb-4">Đang chuyển đến Leaderboard...</p>
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
        {/* Morse Code Reference */}
        <div className="game-card">
          <h3 className="card-title">🔤 Bảng mã Morse</h3>
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
