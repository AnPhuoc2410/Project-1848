import { socket } from '../../socket';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LightBoard from '../../components/LightBoard';

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room');
  const myName = params.get('myName') || 'Player B';

  // Game state
  const [lightNodes, setLightNodes] = useState([]);
  const [myConnections, setMyConnections] = useState([]);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timerActive, setTimerActive] = useState(true);

  // UI state
  const [checkResult, setCheckResult] = useState(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const startTimeRef = useRef(Date.now());

  // Timer countdown
  useEffect(() => {
    if (!timerActive || gameOver || levelComplete) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        // Sync timer to server every second so Player A gets the update
        socket.emit('sync-timer', { roomId, timeRemaining: newTime });
        if (newTime <= 0) {
          setGameOver(true);
          setTimerActive(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameOver, levelComplete, roomId]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    socket.emit('join-room', { roomId, role: 'B' });

    socket.on('game-init', (data) => {
      setLightNodes(data.lightNodes);
      setTimeRemaining(data.timeRemaining);
    });

    socket.on('check-failed', (data) => {
      setCheckResult({ type: 'error', ...data });
      setTimeRemaining(data.timeRemaining);
    });

    socket.on('time-update', ({ timeRemaining: newTime }) =>
      setTimeRemaining(newTime)
    );

    socket.on('level-complete', ({ message, nextLevel }) => {
      setLevelComplete(true);
      setTimerActive(false);
      setCheckResult({ type: 'success', message, nextLevel });

      // Calculate time used for Game 2
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game2 = timeUsed;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      // Navigate to Game 3 after delay
      setTimeout(() => {
        navigate(
          `/game3/b?room=${roomId}&myName=${encodeURIComponent(myName)}`
        );
      }, 2000);
    });

    socket.on('game-over', () => {
      setGameOver(true);
      setTimerActive(false);
    });

    socket.on('game-reset', (data) => {
      setLightNodes(data.lightNodes);
      setMyConnections([]);
      setTimeRemaining(data.timeRemaining);
      setCheckResult(null);
      setLevelComplete(false);
      setGameOver(false);
      setTimerActive(true);
    });

    return () => {
      socket.off('game-init');
      socket.off('check-failed');
      socket.off('time-update');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [roomId, navigate, myName]);

  const handleToggleConnection = (wire) => {
    if (levelComplete || gameOver) return;
    const exists = myConnections.some(
      (c) =>
        (c.from === wire.from && c.to === wire.to) ||
        (c.from === wire.to && c.to === wire.from)
    );
    if (exists) {
      setMyConnections((prev) =>
        prev.filter(
          (c) =>
            !(c.from === wire.from && c.to === wire.to) &&
            !(c.from === wire.to && c.to === wire.from)
        )
      );
    } else {
      setMyConnections((prev) => [
        ...prev,
        { from: wire.from, to: wire.to, color: '#eab308' },
      ]);
    }
    setCheckResult(null);
  };

  const handleCheck = () => {
    socket.emit('submit-connections', { roomId, connections: myConnections });
  };

  const handleReset = () => socket.emit('reset-game', { roomId });

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
            🔧 Thực hành
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
            <h2 className="text-2xl font-bold text-primary mb-2">
              ⏰ Hết Thời Gian!
            </h2>
            <p className="text-text/70 mb-4">Game Over</p>
            <button onClick={handleReset} className="btn-primary">
              Chơi lại
            </button>
          </div>
        </div>
      )}

      {/* Level Complete Overlay */}
      {levelComplete && (
        <div className="game-overlay">
          <div className="overlay-card bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Hoàn thành!
            </h2>
            <p className="text-text/70 mb-4">{checkResult?.message}</p>
            <p className="text-sm text-text/50">Đang chuyển sang Game 3...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left - Reference Image */}
        <div className="game-card">
          <h3 className="card-title">Ảnh bảng đèn vật lý</h3>
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src="/img_game/circuit.png"
              alt="Bảng đèn vật lý"
              className="w-full h-auto"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Right - Connection Board */}
        <div className="space-y-6">
          {/* Connection Board */}
          <div className="game-card">
            <h3 className="card-title">Bảng nối dây của bạn</h3>
            <p className="text-sm text-text/50 mb-4">
              Click 2 đèn để nối/gỡ dây.
            </p>

            <LightBoard
              nodes={lightNodes}
              connections={myConnections}
              onWireComplete={handleToggleConnection}
              interactive={!levelComplete && !gameOver}
            />
          </div>

          {/* Submit Button */}
          {!levelComplete && !gameOver && (
            <button
              onClick={handleCheck}
              disabled={myConnections.length === 0}
              className="btn-check w-full"
            >
              ✓ Kiểm tra kết quả
            </button>
          )}

          {/* Check Result */}
          {checkResult?.type === 'error' && (
            <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
              <p className="text-primary font-medium">
                ❌ {checkResult.message}
              </p>
              <p className="text-xl font-bold text-primary mt-2">
                -{checkResult.timePenalty} giây!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
