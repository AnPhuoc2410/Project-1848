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
  const [playerBName, setPlayerBName] = useState('Player B');
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
    socket.emit('join-game3', { roomId, role: 'A', playerName: myName });

    socket.on('game3-phrase-for-a', ({ correctWords: words }) => {
      setCorrectWords(words || []);
    });

    socket.on('game3-player-joined', ({ role, playerName }) => {
      if (role === 'B') {
        setPlayerBConnected(true);
        if (playerName) setPlayerBName(playerName);
      }
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
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          BAR 1 - TOP STATUS BAR (Dark Brand Color)
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="flex-shrink-0 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Player Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-wide">
              PLAYER <span className="text-blue-400">A</span>
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              📖 Bảng mã Morse
            </span>
          </div>

          {/* Right: Timer (Large Digital Clock Style) */}
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

      {/* ═══════════════════════════════════════════════════════════════════
          BAR 2 - INSTRUCTION SUB-HEADER (Light Background)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Instruction Text */}
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-2xl">📋</span>
            <p className="text-base text-blue-800">
              <span className="font-semibold">Nhiệm vụ:</span> Sử dụng bảng mã
              Morse bên dưới để{' '}
              <span className="font-black text-blue-900 underline decoration-2">
                hỗ trợ {playerBName}
              </span>{' '}
              giải mã các từ vựng.
            </p>
          </div>

          {/* Right: Status */}
          {!gameComplete && (
            <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
              <span className="text-sm text-slate-600 ml-2">
                Đang chờ {playerBName}...
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MIDDLE WORKSPACE - Main Content (Flex Grow)
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 min-h-0 overflow-auto">
        {/* Morse Code Reference */}
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 px-6 py-3 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              🔤 Bảng mã Morse quốc tế
            </h3>
          </div>
          <div className="p-4">
            <img
              src="/img_game/mmorse.jpg"
              alt="Bảng mã Morse"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERLAYS
      ═══════════════════════════════════════════════════════════════════ */}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">⏰</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Hết thời gian!
            </h2>
            <p className="text-slate-500 text-sm mb-4">Game kết thúc</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => socket.emit('restart-all-games', { roomId })}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors cursor-pointer"
              >
                🔄 Chơi lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors cursor-pointer"
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
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">
              Hoàn thành Game 3!
            </h2>
            <p className="text-slate-500 text-sm mb-4">
              Đang chuyển đến Leaderboard...
            </p>
            <div className="flex justify-center">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
