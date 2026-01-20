import { socket } from '../socket';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LightBoard from '../components/LightBoard';
import QuestionModal from '../components/QuestionModal';

export default function PlayerA() {
  const [params] = useSearchParams();
  const roomId = params.get('room');

  // Game state
  const [lightNodes, setLightNodes] = useState([]);
  const [wireResults, setWireResults] = useState([]);

  // Question modal state
  const [showQuestion, setShowQuestion] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [currentWire, setCurrentWire] = useState(null);
  const [loading, setLoading] = useState(false);

  // Game status
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Join room
    socket.emit('join-room', { roomId, role: 'A' });

    // Receive initial game state
    socket.on('game-init', (data) => {
      setLightNodes(data.lightNodes);
      setWireResults(data.wireResults || []);
    });

    // Receive question from Player B's wire selection
    socket.on('wire-question', ({ wire, question, forPlayerA }) => {
      if (!forPlayerA) return;

      setCurrentWire(wire);
      setCurrentQuestion(question);
      setShowQuestion(true);
      setLoading(false);
    });

    // Wire result confirmed
    socket.on('wire-result', ({ result, totalResults }) => {
      setWireResults(totalResults);
      setShowQuestion(false);
      setCurrentWire(null);
      setLoading(false);
    });

    // Level complete
    socket.on('level-complete', ({ message }) => {
      setLevelComplete(true);
    });

    // Game over
    socket.on('game-over', () => {
      setGameOver(true);
    });

    // Game reset
    socket.on('game-reset', (data) => {
      setLightNodes(data.lightNodes);
      setWireResults([]);
      setShowQuestion(false);
      setCurrentWire(null);
      setLevelComplete(false);
      setGameOver(false);
    });

    return () => {
      socket.off('game-init');
      socket.off('wire-question');
      socket.off('wire-result');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [roomId]);

  const handleAnswer = (answer) => {
    setLoading(true);
    socket.emit('answer-question', {
      roomId,
      answer,
    });
  };

  const handleReset = () => {
    socket.emit('reset-game', { roomId });
  };

  // Create visual connections from results
  const displayConnections = wireResults.map((r) => ({
    from: r.from,
    to: r.to,
    color: r.shouldConnect ? '#44ff88' : '#ff4444',
  }));

  return (
    <div className="player-page player-a">
      <div className="player-header">
        <h1>Player A</h1>
        <span className="player-role">Lý thuyết</span>
        <span className="room-id">Room: {roomId}</span>
      </div>

      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h2>⏰ Hết Thời Gian!</h2>
            <p>Player B đã hết thời gian</p>
            <button className="action-btn primary" onClick={handleReset}>
              Chơi lại
            </button>
          </div>
        </div>
      )}

      <div className="game-content">
        <div className="board-section">
          <h3>Bảng đèn</h3>
          <p className="board-hint">Hiển thị các cặp đèn đã được hỏi</p>
          <LightBoard
            nodes={lightNodes}
            connections={displayConnections}
            interactive={false}
            highlightWire={currentWire}
          />
        </div>

        <div className="control-section">
          <div className="status-box">
            <h3>📋 Trạng thái</h3>
            {!showQuestion && !levelComplete && (
              <div className="waiting-status">
                <div className="three-body">
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
                <p>Đang chờ Player B chọn cặp đèn...</p>
                <p className="hint-text">
                  Player B sẽ đọc từ ảnh vật lý và chọn cặp đèn để hỏi bạn
                </p>
              </div>
            )}

            {showQuestion && currentWire && (
              <div className="question-incoming">
                <p>
                  Player B hỏi về cặp:{' '}
                  <strong style={{ color: currentWire.fromColor }}>
                    {currentWire.fromLabel}
                  </strong>{' '}
                  →{' '}
                  <strong style={{ color: currentWire.toColor }}>
                    {currentWire.toLabel}
                  </strong>
                </p>
              </div>
            )}
          </div>

          {levelComplete && (
            <div className="status-message success">
              <h2>🎉 Hoàn thành!</h2>
              <p>Player B đã nối đúng tất cả dây!</p>
              <button className="action-btn secondary" onClick={handleReset}>
                Chơi lại
              </button>
            </div>
          )}

          <div className="wire-history">
            <h4>Lịch sử câu hỏi ({wireResults.length})</h4>
            <ul>
              {wireResults.map((result, i) => (
                <li
                  key={i}
                  className={result.shouldConnect ? 'required' : 'not-required'}
                >
                  <span className="result-icon">
                    {result.shouldConnect ? '✅' : '❌'}
                  </span>
                  <span className="wire-label">
                    {result.fromLabel} → {result.toLabel}
                  </span>
                  <span className="result-text">
                    {result.shouldConnect ? 'NỐI' : 'KHÔNG NỐI'}
                  </span>
                </li>
              ))}
              {wireResults.length === 0 && (
                <li className="empty">Chưa có câu hỏi nào</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <QuestionModal
        isOpen={showQuestion}
        question={currentQuestion}
        wire={currentWire}
        onAnswer={handleAnswer}
        loading={loading}
      />
    </div>
  );
}
