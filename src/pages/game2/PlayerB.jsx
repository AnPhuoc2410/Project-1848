import { socket } from '../../socket';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import LightBoard from '../../components/LightBoard';

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room');
  const myName = params.get('myName') || 'Player B';
  const blindMode = true;

  // Game state
  const [lightNodes, setLightNodes] = useState([]);
  const [askedWires, setAskedWires] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  const [requiredWireCount, setRequiredWireCount] = useState(4);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(300);
  const [timerActive, setTimerActive] = useState(true);

  // UI state
  const [pendingWire, setPendingWire] = useState(null);
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
        if (newTime <= 0) {
          setGameOver(true);
          setTimerActive(false);
          socket.emit('sync-timer', { roomId, timeRemaining: 0 });
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
      setRequiredWireCount(data.requiredWireCount || 4);
      if (data.wireResults) {
        setAskedWires(
          data.wireResults.map((r) => ({
            from: r.from,
            to: r.to,
            fromLabel: r.fromLabel,
            toLabel: r.toLabel,
            fromColor: r.fromColor,
            toColor: r.toColor,
          }))
        );
      }
    });

    socket.on('wire-pending', ({ wire }) => setPendingWire(wire));

    socket.on('wire-already-asked', () => {
      setCheckResult({
        type: 'info',
        message: 'Cặp này đã được hỏi rồi! Hỏi Player A để nhớ lại kết quả.',
      });
      setTimeout(() => setCheckResult(null), 3000);
    });

    socket.on('wire-result', ({ totalResults }) => {
      setAskedWires(
        totalResults.map((r) => ({
          from: r.from,
          to: r.to,
          fromLabel: r.fromLabel,
          toLabel: r.toLabel,
          fromColor: r.fromColor,
          toColor: r.toColor,
        }))
      );
      setPendingWire(null);
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
      setAskedWires([]);
      setMyConnections([]);
      setTimeRemaining(data.timeRemaining);
      setRequiredWireCount(data.requiredWireCount || 4);
      setPendingWire(null);
      setCheckResult(null);
      setLevelComplete(false);
      setGameOver(false);
      setTimerActive(true);
    });

    return () => {
      socket.off('game-init');
      socket.off('wire-pending');
      socket.off('wire-already-asked');
      socket.off('wire-result');
      socket.off('check-failed');
      socket.off('time-update');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [roomId]);

  const handleSelectWire = useCallback(
    (wire) => {
      if (pendingWire || levelComplete || gameOver) return;
      socket.emit('select-wire', { roomId, from: wire.from, to: wire.to });
    },
    [roomId, pendingWire, levelComplete, gameOver]
  );

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
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-bold animate-pulse">
            🔇 BLIND
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

      {/* Main Content */}
      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left - Wire Selection */}
        <div className="space-y-6">
          <div className="game-card">
            <h3 className="card-title">📋 Chọn cặp dây để hỏi Player A</h3>
            <p className="text-sm text-text/50 mb-4">
              Nhìn ảnh vật lý → Click 2 đèn để hỏi
            </p>

            <LightBoard
              nodes={lightNodes}
              connections={[]}
              onWireComplete={handleSelectWire}
              interactive={!pendingWire && !levelComplete && !gameOver}
              pendingWire={pendingWire}
            />

            {pendingWire && (
              <div className="mt-4 p-4 bg-secondary/10 rounded-xl text-center">
                <div
                  className="three-body mx-auto mb-2"
                  style={{ '--uib-size': '25px' }}
                >
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
                <p className="text-text/70">
                  Đang chờ Player A trả lời về:{' '}
                  <strong style={{ color: pendingWire.fromColor }}>
                    {pendingWire.fromLabel}
                  </strong>
                  {' → '}
                  <strong style={{ color: pendingWire.toColor }}>
                    {pendingWire.toLabel}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {/* Reference Image */}
          <div className="game-card">
            <h3 className="card-title">📷 Ảnh bảng đèn vật lý</h3>
            <p className="text-sm text-text/50 mb-3">
              Nhìn ảnh này để biết các dây có thể nối
            </p>
            <div className="rounded-lg overflow-hidden bg-gray-100">
              <img
                src="/img_game/circuit.png"
                alt="Bảng đèn vật lý"
                className="w-full h-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            </div>
          </div>
        </div>

        {/* Right - Results and Connection */}
        <div className="space-y-6">
          {/* Blind Mode Info */}
          <div className="p-4 bg-red-50 rounded-xl border border-red-200 text-center">
            <p className="text-primary font-medium">
              🔇 Bạn <strong>không thấy</strong> kết quả từ Player A
            </p>
            <p className="text-sm text-text/60">
              Hãy <strong>lắng nghe</strong> Player A qua voice chat!
            </p>
          </div>

          {/* Asked Wires */}
          <div className="game-card">
            <h3 className="card-title">
              📝 Các cặp đã hỏi ({askedWires.length})
            </h3>
            {askedWires.length === 0 ? (
              <p className="text-center text-text/40 py-4">
                Chưa hỏi cặp nào. Chọn cặp đèn để bắt đầu!
              </p>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {askedWires.map((wire, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg text-sm"
                  >
                    <span className="text-text/40 font-medium">{i + 1}.</span>
                    <span style={{ color: wire.fromColor }}>
                      {wire.fromLabel}
                    </span>
                    <span className="text-text/30">→</span>
                    <span style={{ color: wire.toColor }}>{wire.toLabel}</span>
                    <span className="ml-auto text-xs text-secondary">
                      ❓ Hỏi A!
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Connection Board */}
          <div className="game-card">
            <h3 className="card-title">🔧 Bảng nối dây của bạn</h3>
            <p className="text-sm text-text/50 mb-4">
              Click 2 đèn để nối/gỡ dây. Nhớ lời Player A nói!
            </p>

            <LightBoard
              nodes={lightNodes}
              connections={myConnections}
              onWireComplete={handleToggleConnection}
              interactive={!levelComplete && !gameOver}
            />

            {myConnections.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <h5 className="text-sm font-medium text-yellow-700 mb-2">
                  Dây bạn đã nối:
                </h5>
                <div className="flex flex-wrap gap-2">
                  {myConnections.map((conn, i) => {
                    const fromNode = lightNodes.find((n) => n.id === conn.from);
                    const toNode = lightNodes.find((n) => n.id === conn.to);
                    return (
                      <span
                        key={i}
                        className="px-2 py-1 bg-yellow-100 rounded text-sm"
                      >
                        <span style={{ color: fromNode?.color }}>
                          {fromNode?.label}
                        </span>
                        <span className="text-text/30 mx-1">→</span>
                        <span style={{ color: toNode?.color }}>
                          {toNode?.label}
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-4 text-center p-3 bg-gray-50 rounded-lg">
              <span className="text-text/70">
                Đã nối: <strong>{myConnections.length}</strong> /{' '}
                {requiredWireCount} dây cần thiết
              </span>
            </div>
          </div>

          {/* Submit Button */}
          {!levelComplete && !gameOver && (
            <button
              onClick={handleCheck}
              disabled={myConnections.length === 0}
              className="btn-check w-full"
            >
              ✓ Kiểm tra ({myConnections.length} dây)
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

          {checkResult?.type === 'info' && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 text-center">
              <p className="text-blue-600">{checkResult.message}</p>
            </div>
          )}

          {levelComplete && (
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 text-center">
              <h2 className="text-2xl font-bold text-green-600 mb-2">
                🎉 Hoàn thành!
              </h2>
              <p className="text-text/70 mb-4">{checkResult?.message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
