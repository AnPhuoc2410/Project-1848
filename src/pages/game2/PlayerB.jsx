import { socket } from '../../socket';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LightBoard from '../../components/LightBoard';
import { GAME_TIMES } from '../../config/gameConfig';

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room');
  const myName = params.get('myName') || 'Player B';

  // Get player A name from sessionStorage (saved in game1)
  const savedTimes = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
  const [playerAName] = useState(savedTimes.playerA || 'Player A');

  // Game state
  const [lightNodes, setLightNodes] = useState([]);
  const [myConnections, setMyConnections] = useState([]);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(GAME_TIMES.GAME2);
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

    socket.on('global-restart', () => {
      navigate(
        `/game1/b?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

    return () => {
      socket.off('game-init');
      socket.off('check-failed');
      socket.off('time-update');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
      socket.off('global-restart');
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
              🔧 Thực hành
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
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4 py-2">
        <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
          <span className="text-lg">📋</span>
          <p className="text-sm text-emerald-800">
            <span className="font-semibold">Nhiệm vụ:</span> Click 2 đèn để
            nối/gỡ dây. Hãy hỏi{' '}
            <span className="font-black text-emerald-900 underline decoration-2">
              {playerAName}
            </span>{' '}
            xem nên nối cặp dây nào.
          </p>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto p-2">
        <div className="max-w-6xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Left - Reference Image */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-2 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              📷 Ảnh bảng đèn vật lý
            </h3>
            <div className="rounded overflow-hidden bg-slate-50 flex-1 flex items-center justify-center bg-white">
              <img
                src="/img_game/circuit.png"
                alt="Bảng đèn vật lý"
                className="w-full h-auto max-h-[60vh] object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Right - Connection Board */}
          <div className="bg-white rounded-lg shadow border border-slate-200 p-2 flex flex-col">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              🔌 Bảng nối dây của bạn
            </h3>

            <div className="flex-1 flex items-center justify-center">
              <LightBoard
                nodes={lightNodes}
                connections={myConnections}
                onWireComplete={handleToggleConnection}
                interactive={!levelComplete && !gameOver}
              />
            </div>
          </div>
        </div>
      </main>

      {/* ===== FOOTER: Submit Button ===== */}
      {!levelComplete && !gameOver && (
        <footer className="flex-shrink-0 bg-white border-t border-slate-200 px-6 py-3">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                Dây đã nối:{' '}
                <strong className="text-emerald-600">
                  {myConnections.length}
                </strong>
              </span>
              {/* Check Result - show in footer */}
              {checkResult?.type === 'error' && (
                <div className="px-4 py-2 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
                  <span className="text-red-600 font-medium text-sm">
                    ❌ {checkResult.message}
                  </span>
                  <span className="text-lg font-bold text-red-600">
                    -{checkResult.timePenalty}s
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={handleCheck}
              disabled={myConnections.length === 0}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 
                         text-white rounded-xl font-bold text-base transition shadow-lg"
            >
              ✓ Kiểm tra kết quả
            </button>
          </div>
        </footer>
      )}

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

      {/* Level Complete Overlay */}
      {levelComplete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-green-200">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-slate-600 mb-4">{checkResult?.message}</p>
            <p className="text-sm text-slate-400">Đang chuyển sang Game 3...</p>
          </div>
        </div>
      )}
    </div>
  );
}
