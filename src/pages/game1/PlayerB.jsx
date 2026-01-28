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
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* ===== HEADER BAR 1: Dark top bar ===== */}
      <header className="flex-shrink-0 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Player Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-wide">
              PLAYER <span className="text-emerald-400">B</span>
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              🔓 Giải mã
            </span>
          </div>

          {/* Right: Timer */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Room:{' '}
              <span className="font-semibold text-slate-200">{roomId}</span>
            </span>
            <div
              className={`px-5 py-2 rounded-xl font-mono text-2xl font-black tracking-wider ${
                timeRemaining < 60
                  ? 'bg-red-500/20 text-red-400 border-2 border-red-500/50 animate-pulse'
                  : 'bg-slate-700 text-white border-2 border-slate-600'
              }`}
            >
              ⏱️ {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </header>

      {/* ===== HEADER BAR 2: Instruction sub-header ===== */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Instruction Text */}
          <div className="flex items-center gap-3 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
            <span className="text-2xl">📋</span>
            <p className="text-base text-emerald-800">
              <span className="font-semibold">Nhiệm vụ:</span> Nghe mô tả từ{' '}
              <span className="font-black text-emerald-900 underline decoration-2">
                {playerAName}
              </span>{' '}
              và tra bảng mã để nhập từ khóa đúng.
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left - Cipher Key */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              📋 Bảng mã Freemason
            </h3>
            <div className="rounded-xl overflow-hidden bg-slate-50 p-4 border border-slate-200">
              <img
                src="/img_game/FreemasonV2.png"
                alt="Bảng mã Freemason"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Right - Answer Input */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              ✏️ Nhập đáp án
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập từ đã giải mã..."
                className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 bg-white text-slate-800 
                           focus:border-emerald-500 focus:outline-none transition-colors
                           text-lg uppercase tracking-widest font-mono"
                disabled={gameComplete}
              />

              <button
                type="submit"
                disabled={!answer.trim() || loading || gameComplete}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 
                           text-white rounded-xl font-bold text-lg transition"
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
                <p className="text-red-600 font-medium">❌ {error}</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ===== OVERLAYS ===== */}
      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-red-200">
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Hết thời gian!
            </h2>
            <p className="text-slate-600 mb-6">Game kết thúc</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => socket.emit('restart-all-games', { roomId })}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition"
              >
                🔄 Chơi lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition"
              >
                🏠 Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-green-200">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Chính xác!
            </h2>
            <p className="text-slate-600 mb-4">
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
    </div>
  );
}
