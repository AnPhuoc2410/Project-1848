import { socket } from '../socket';
import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import LightBoard from '../components/LightBoard';

export default function PlayerB() {
  const [params] = useSearchParams();
  const roomId = params.get('room');

  // Blind Mode is now always ON (part of the game)
  const blindMode = true;

  // Game state
  const [lightNodes, setLightNodes] = useState([]);
  const [askedWires, setAskedWires] = useState([]); // List of wires asked (without results)
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

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    // Join room
    socket.emit('join-room', { roomId, role: 'B' });

    // Receive initial game state
    socket.on('game-init', (data) => {
      setLightNodes(data.lightNodes);
      setTimeRemaining(data.timeRemaining);
      setRequiredWireCount(data.requiredWireCount || 4);
      // In blind mode, we track asked wires without results
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

    // Wire pending (waiting for A to answer)
    socket.on('wire-pending', ({ wire }) => {
      setPendingWire(wire);
    });

    // Wire already asked
    socket.on('wire-already-asked', ({ result }) => {
      setCheckResult({
        type: 'info',
        message: 'Cặp này đã được hỏi rồi! Hỏi Player A để nhớ lại kết quả.',
      });
      setTimeout(() => setCheckResult(null), 3000);
    });

    // Wire result from Player A's answer - only track that it was asked
    socket.on('wire-result', ({ result, totalResults }) => {
      // Store wire info without the result (blind mode)
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

    // Check failed - time penalty
    socket.on('check-failed', (data) => {
      setCheckResult({
        type: 'error',
        ...data,
      });
      setTimeRemaining(data.timeRemaining);
    });

    // Time update
    socket.on('time-update', ({ timeRemaining: newTime }) => {
      setTimeRemaining(newTime);
    });

    // Level complete
    socket.on('level-complete', ({ message, nextLevel }) => {
      setLevelComplete(true);
      setTimerActive(false);
      setCheckResult({ type: 'success', message, nextLevel });
    });

    // Game over
    socket.on('game-over', ({ message }) => {
      setGameOver(true);
      setTimerActive(false);
    });

    // Game reset
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

  // Player B selects a wire pair to ask Player A
  const handleSelectWire = useCallback(
    (wire) => {
      if (pendingWire || levelComplete || gameOver) return;

      socket.emit('select-wire', {
        roomId,
        from: wire.from,
        to: wire.to,
      });
    },
    [roomId, pendingWire, levelComplete, gameOver]
  );

  // Toggle connection on/off
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
        { from: wire.from, to: wire.to, color: '#ffcc00' },
      ]);
    }
    setCheckResult(null);
  };

  const handleCheck = () => {
    socket.emit('submit-connections', {
      roomId,
      connections: myConnections,
    });
  };

  const handleReset = () => {
    socket.emit('reset-game', { roomId });
  };

  return (
    <div className="player-page player-b">
      <div className="player-header">
        <h1>Player B</h1>
        <span className="player-role">Thực hành</span>
        <span className="blind-mode-badge">🔇 BLIND MODE</span>
        <div className={`timer ${timeRemaining < 60 ? 'warning' : ''}`}>
          ⏱️ {formatTime(timeRemaining)}
        </div>
        <span className="room-id">Room: {roomId}</span>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>⏰ Hết Thời Gian!</h2>
            <p>Game Over</p>
            <button className="action-btn primary" onClick={handleReset}>
              Chơi lại
            </button>
          </div>
        </div>
      )}

      <div className="game-content">
        {/* Left side - Wire Selection */}
        <div className="board-section">
          <h3>📋 Chọn cặp dây để hỏi Player A</h3>
          <p className="board-hint">
            Nhìn ảnh vật lý bên dưới → Đọc cặp đèn → Click 2 đèn để hỏi Player A
          </p>

          <LightBoard
            nodes={lightNodes}
            connections={[]}
            onWireComplete={handleSelectWire}
            interactive={!pendingWire && !levelComplete && !gameOver}
            pendingWire={pendingWire}
          />

          {pendingWire && (
            <div className="pending-wire-status">
              <div className="three-body">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <p>
                Đang chờ Player A trả lời về:{' '}
                <strong style={{ color: pendingWire.fromColor }}>
                  {pendingWire.fromLabel}
                </strong>{' '}
                →{' '}
                <strong style={{ color: pendingWire.toColor }}>
                  {pendingWire.toLabel}
                </strong>
              </p>
            </div>
          )}

          {/* Reference Image */}
          <div className="reference-section">
            <h4>📷 Ảnh bảng đèn vật lý</h4>
            <p className="ref-hint">Nhìn ảnh này để biết các dây có thể nối</p>
            <div className="reference-image">
              <img
                src="/img/circuit.png"
                alt="Bảng đèn vật lý"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="ref-placeholder" style={{ display: 'none' }}>
                <p>Đặt ảnh bảng đèn vật lý tại:</p>
                <code>public/img/circuit.png</code>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Asked Wires and Connection */}
        <div className="instructions-section">
          <h3>🔌 Nối dây (Blind Mode)</h3>

          {/* Blind Mode Info */}
          <div className="blind-mode-info compact">
            <p>
              🔇 Bạn <strong>không thấy</strong> kết quả từ Player A trên màn
              hình.
            </p>
            <p>
              Hãy <strong>lắng nghe</strong> Player A qua voice chat!
            </p>
          </div>

          {/* Asked Wires List - Shows what was asked, NOT the results */}
          <div className="asked-wires-section">
            <h4>📝 Các cặp đã hỏi ({askedWires.length})</h4>
            {askedWires.length === 0 ? (
              <p className="no-results">
                Chưa hỏi cặp nào. Chọn cặp đèn để bắt đầu!
              </p>
            ) : (
              <ul className="asked-list">
                {askedWires.map((wire, i) => (
                  <li key={i}>
                    <span className="asked-number">{i + 1}.</span>
                    <span className="asked-wire">
                      <span style={{ color: wire.fromColor }}>
                        {wire.fromLabel}
                      </span>
                      <span className="arrow">→</span>
                      <span style={{ color: wire.toColor }}>
                        {wire.toLabel}
                      </span>
                    </span>
                    <span className="asked-status">❓ Hỏi A để biết!</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Connection Board */}
          <div className="connection-board">
            <h4>🔧 Bảng nối dây của bạn</h4>
            <p className="board-hint">
              Click 2 đèn để nối/gỡ dây. Nhớ lời Player A nói!
            </p>
            <LightBoard
              nodes={lightNodes}
              connections={myConnections}
              onWireComplete={handleToggleConnection}
              interactive={!levelComplete && !gameOver}
            />

            {/* Show current connections */}
            {myConnections.length > 0 && (
              <div className="my-connections-list">
                <h5>Dây bạn đã nối:</h5>
                <ul>
                  {myConnections.map((conn, i) => {
                    const fromNode = lightNodes.find((n) => n.id === conn.from);
                    const toNode = lightNodes.find((n) => n.id === conn.to);
                    return (
                      <li key={i} className="connected-wire">
                        <span style={{ color: fromNode?.color }}>
                          {fromNode?.label}
                        </span>
                        <span className="arrow">→</span>
                        <span style={{ color: toNode?.color }}>
                          {toNode?.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            <div className="connection-count">
              Đã nối: {myConnections.length} / {requiredWireCount} dây cần thiết
            </div>
          </div>

          {/* Submit Button */}
          {!levelComplete && !gameOver && (
            <button
              className="action-btn check-btn"
              onClick={handleCheck}
              disabled={myConnections.length === 0}
            >
              ✓ Kiểm tra ({myConnections.length} dây)
            </button>
          )}

          {/* Check Result */}
          {checkResult && checkResult.type === 'error' && (
            <div className="check-result error">
              <p>❌ {checkResult.message}</p>
              <p className="penalty">-{checkResult.timePenalty} giây!</p>
            </div>
          )}

          {checkResult && checkResult.type === 'info' && (
            <div className="check-result info">
              <p>{checkResult.message}</p>
            </div>
          )}

          {levelComplete && (
            <div className="check-result success">
              <h2>🎉 Hoàn thành!</h2>
              <p>{checkResult?.message}</p>
              <p>Chuyển sang Game {checkResult?.nextLevel}...</p>
              <button className="action-btn secondary" onClick={handleReset}>
                Chơi lại
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
