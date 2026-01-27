import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import FreemasonCipher from '../../components/FreemasonCipher';
import { GAME_TIMES } from '../../config/gameConfig';

// Initial time for Game 1
const INITIAL_TIME = GAME_TIMES.GAME1;

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const myName = params.get('myName') || 'Player A';
  const restartKey = params.get('t') || ''; // Force re-run on restart

  const [phrase, setPhrase] = useState('');
  const [playerBConnected, setPlayerBConnected] = useState(false);
  const [playerBName, setPlayerBName] = useState('Player B');
  const [gameComplete, setGameComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [loading, setLoading] = useState(true);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

  // Timer countdown - Player A is the master timer
  useEffect(() => {
    if (!timerActive || gameComplete || loading) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setTimerActive(false);
          setGameOver(true);
          return 0;
        }
        // Sync timer to server every 5 seconds
        if (newTime % 5 === 0) {
          socket.emit('game1-sync-timer', { roomId, timeRemaining: newTime });
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameComplete, loading, roomId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Setup listeners FIRST, then emit
    socket.on('game1-phrase', ({ phrase: serverPhrase }) => {
      setPhrase(serverPhrase);
      setLoading(false);
      startTimeRef.current = Date.now();
    });

    socket.on(
      'game1-player-joined',
      ({ role, playerName, playerNames, timeRemaining: serverTime }) => {
        if (role === 'B') {
          setPlayerBConnected(true);
          setPlayerBName(playerName);
        }
        // Sync player names
        if (playerNames?.B) setPlayerBName(playerNames.B);
        // Sync timer from server
        if (serverTime !== undefined) {
          setTimeRemaining(serverTime);
        }
      }
    );

    socket.on('game1-complete', () => {
      setGameComplete(true);
      setTimerActive(false);

      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);

      // Store time in sessionStorage for leaderboard
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game1 = timeUsed;
      times.playerA = myName;
      times.playerB = playerBName;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      setTimeout(() => {
        navigate(
          `/game2/a?room=${roomId}&myName=${encodeURIComponent(myName)}`
        );
      }, 2000);
    });

    socket.on('global-restart', () => {
      // Reset states before navigating
      setTimeRemaining(INITIAL_TIME);
      setTimerActive(true);
      setGameComplete(false);
      setGameOver(false);
      setLoading(true);
      // Navigate to game1 with timestamp to force re-join
      navigate(
        `/game1/a?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

    // Emit AFTER listeners are setup
    socket.emit('join-game1', { roomId, role: 'A', playerName: myName });

    return () => {
      socket.off('game1-phrase');
      socket.off('game1-player-joined');
      socket.off('game1-complete');
      socket.off('global-restart');
    };
  }, [roomId, navigate, myName, playerBName, restartKey]);

  const letters = phrase.split('');

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* ===== HEADER BAR 1: Dark top bar ===== */}
      <header className="flex-shrink-0 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Player Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-wide">
              PLAYER <span className="text-blue-400">A</span>
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-blue-500/20 text-blue-400 rounded-full border border-blue-500/30">
              🔐 Mã hóa
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
          <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg border border-blue-200">
            <span className="text-2xl">📋</span>
            <p className="text-base text-blue-800">
              <span className="font-semibold">Nhiệm vụ:</span> Mô tả từng ký
              hiệu Freemason cho{' '}
              <span className="font-black text-blue-900 underline decoration-2">
                {playerBName}
              </span>{' '}
              để họ giải mã được từ khóa.
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

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* Cipher Display */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              🔐 Mật mã cần giải
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Có {letters.filter((l) => l !== ' ').length} ký hiệu cần mô tả
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
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition"
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

      {/* Loading State */}
      {loading && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              Đang kết nối...
            </h2>
            <p className="text-slate-600 mb-4">Đang tải mật mã từ server</p>
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
