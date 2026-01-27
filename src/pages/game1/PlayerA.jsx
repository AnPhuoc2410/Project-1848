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
            {myName}
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
            {playerBConnected ? `🟢 ${playerBName}` : '⏳ Chờ Player B...'}
          </span>
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

      {/* Loading State */}
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
        {/* Cipher Display */}
        <div className="game-card">
          <h3 className="card-title">🔐 Mật mã cần giải</h3>
          <p className="text-sm text-text/50 mb-6">
            Mô tả từng ký hiệu cho {playerBName}
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
                Đang chờ {playerBName} nhập đáp án...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
