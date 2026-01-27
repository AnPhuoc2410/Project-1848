import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { GAME_TIMES } from '../../config/gameConfig';

// Initial time for Game 1
const INITIAL_TIME = GAME_TIMES.GAME1;

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const myName = params.get('myName') || 'Player B';
  const restartKey = params.get('t') || ''; // Force re-run on restart

  const [answer, setAnswer] = useState('');
  const [playerAConnected, setPlayerAConnected] = useState(false);
  const [playerAName, setPlayerAName] = useState('Player A');
  const [gameComplete, setGameComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    // Setup listeners FIRST, then emit
    socket.on(
      'game1-player-joined',
      ({ role, playerName, playerNames, timeRemaining: serverTime }) => {
        if (role === 'A') {
          setPlayerAConnected(true);
          setPlayerAName(playerName);
        }
        // Sync player names
        if (playerNames?.A) setPlayerAName(playerNames.A);
        // Sync timer from server
        if (serverTime !== undefined) {
          setTimeRemaining(serverTime);
        }
      }
    );

    // Timer sync from other player
    socket.on('game1-timer-update', ({ timeRemaining: newTime }) => {
      setTimeRemaining(newTime);
    });

    socket.on('game1-wrong-answer', ({ message }) => {
      setError(message);
      setLoading(false);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('game1-complete', () => {
      setGameComplete(true);
      setLoading(false);
      setTimerActive(false);

      // Calculate time used
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Store time in sessionStorage for leaderboard
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game1 = timeUsed;
      times.playerA = playerAName;
      times.playerB = myName;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      setTimeout(() => {
        navigate(
          `/game2/b?room=${roomId}&myName=${encodeURIComponent(myName)}`
        );
      }, 2000);
    });

    socket.on('global-restart', () => {
      // Reset states before navigating
      setTimeRemaining(INITIAL_TIME);
      setTimerActive(true);
      setGameComplete(false);
      setGameOver(false);
      setError('');
      setAnswer('');
      // Navigate to game1 with timestamp to force re-join
      navigate(
        `/game1/b?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

    // Emit AFTER listeners are setup
    socket.emit('join-game1', { roomId, role: 'B', playerName: myName });

    return () => {
      socket.off('game1-player-joined');
      socket.off('game1-timer-update');
      socket.off('game1-wrong-answer');
      socket.off('game1-complete');
      socket.off('global-restart');
    };
  }, [roomId, navigate, myName, playerAName, restartKey]);

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
        <div className="flex items-center gap-4">
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
