import { socket } from '../socket';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import LightBoard from '../components/LightBoard';

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

  // Editing existing answer
  const [editingIndex, setEditingIndex] = useState(null);

  // Game status
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    socket.emit('join-room', { roomId, role: 'A' });

    socket.on('game-init', (data) => {
      setLightNodes(data.lightNodes);
      setWireResults(data.wireResults || []);
    });

    socket.on('wire-question', ({ wire, question, forPlayerA }) => {
      if (!forPlayerA) return;
      setCurrentWire(wire);
      setCurrentQuestion(question);
      setShowQuestion(true);
      setLoading(false);
    });

    socket.on('wire-result', ({ result, totalResults }) => {
      setWireResults(totalResults);
      setShowQuestion(false);
      setCurrentWire(null);
      setLoading(false);
    });

    socket.on('answer-updated', ({ totalResults }) => {
      setWireResults(totalResults);
      setEditingIndex(null);
    });

    socket.on('level-complete', () => setLevelComplete(true));
    socket.on('game-over', () => setGameOver(true));

    socket.on('game-reset', (data) => {
      setLightNodes(data.lightNodes);
      setWireResults([]);
      setShowQuestion(false);
      setCurrentWire(null);
      setEditingIndex(null);
      setLevelComplete(false);
      setGameOver(false);
    });

    return () => {
      socket.off('game-init');
      socket.off('wire-question');
      socket.off('wire-result');
      socket.off('answer-updated');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [roomId]);

  const handleAnswer = (answer) => {
    setLoading(true);
    socket.emit('answer-question', { roomId, answer });
  };

  const handleEditClick = (index) => {
    setEditingIndex(editingIndex === index ? null : index);
  };

  const handleChangeAnswer = (index, newAnswer) => {
    const result = wireResults[index];
    if (result.shouldConnect === (newAnswer === 'YES')) {
      setEditingIndex(null);
      return;
    }
    socket.emit('update-answer', { roomId, wireIndex: index, newAnswer });
  };

  const handleReset = () => socket.emit('reset-game', { roomId });

  const displayConnections = wireResults.map((r) => ({
    from: r.from,
    to: r.to,
    color: r.shouldConnect ? '#16a34a' : '#dc2626',
  }));

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
            📖 Lý thuyết
          </span>
        </div>
        <span className="px-3 py-1 rounded-lg bg-white/80 text-text/60 text-sm">
          Room: {roomId}
        </span>
      </header>

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="game-overlay">
          <div className="overlay-card bg-red-50 border-red-200">
            <h2 className="text-2xl font-bold text-primary mb-2">
              ⏰ Hết Thời Gian!
            </h2>
            <p className="text-text/70 mb-4">Player B đã hết thời gian</p>
            <button onClick={handleReset} className="btn-primary">
              Chơi lại
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left - Board */}
        <div className="game-card">
          <h3 className="card-title">🔌 Bảng đèn</h3>
          <p className="text-sm text-text/50 mb-4">
            Hiển thị các cặp đèn đã được hỏi
          </p>
          <LightBoard
            nodes={lightNodes}
            connections={displayConnections}
            interactive={false}
            highlightWire={currentWire}
          />
        </div>

        {/* Right - Controls */}
        <div className="space-y-6">
          {/* Status Box */}
          <div className="game-card">
            <h3 className="card-title">📋 Trạng thái</h3>

            {!showQuestion && !levelComplete && (
              <div className="text-center py-8">
                <div className="three-body mx-auto mb-4">
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
                <p className="text-text/70">
                  Đang chờ Player B chọn cặp đèn...
                </p>
                <p className="text-sm text-text/40 mt-2">
                  Player B sẽ đọc từ ảnh vật lý và chọn cặp đèn để hỏi bạn
                </p>
              </div>
            )}

            {showQuestion && currentWire && (
              <div className="space-y-4">
                {/* Wire Info */}
                <div className="text-center p-4 bg-secondary/10 rounded-xl">
                  <p className="text-sm text-text/60 mb-2">
                    Player B hỏi về cặp:
                  </p>
                  <div className="flex items-center justify-center gap-3 text-xl font-bold">
                    <span style={{ color: currentWire.fromColor }}>
                      {currentWire.fromLabel}
                    </span>
                    <span className="text-text/30">→</span>
                    <span style={{ color: currentWire.toColor }}>
                      {currentWire.toLabel}
                    </span>
                  </div>
                </div>

                {/* Question */}
                <div className="p-4 bg-white rounded-xl border-l-4 border-secondary">
                  <h4 className="text-sm font-medium text-secondary mb-2">
                    ❓ Câu hỏi Triết học:
                  </h4>
                  <p className="text-text font-robert-regular">
                    {currentQuestion}
                  </p>
                </div>

                {/* Answer Buttons */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleAnswer('YES')}
                    disabled={loading}
                    className="answer-btn answer-yes"
                  >
                    <span className="text-2xl">✓</span>
                    <span className="font-bold">YES</span>
                    <span className="text-xs opacity-70">Dây cần nối</span>
                  </button>
                  <button
                    onClick={() => handleAnswer('NO')}
                    disabled={loading}
                    className="answer-btn answer-no"
                  >
                    <span className="text-2xl">✗</span>
                    <span className="font-bold">NO</span>
                    <span className="text-xs opacity-70">Không cần nối</span>
                  </button>
                </div>
                {loading && (
                  <p className="text-center text-text/50">Đang gửi...</p>
                )}
              </div>
            )}

            {levelComplete && (
              <div className="text-center py-8">
                <h2 className="text-2xl font-bold text-green-600 mb-2">
                  🎉 Hoàn thành!
                </h2>
                <p className="text-text/70 mb-4">
                  Player B đã nối đúng tất cả dây!
                </p>
                <button onClick={handleReset} className="btn-secondary">
                  Chơi lại
                </button>
              </div>
            )}
          </div>

          {/* Wire History */}
          <div className="game-card">
            <h3 className="card-title">
              📝 Lịch sử câu hỏi ({wireResults.length})
            </h3>
            <p className="text-xs text-text/40 mb-3">
              👆 Click vào để đổi đáp án
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {wireResults.map((result, i) => (
                <div
                  key={i}
                  onClick={() => handleEditClick(i)}
                  className={`history-item ${result.shouldConnect ? 'history-yes' : 'history-no'} 
                             ${editingIndex === i ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span>{result.shouldConnect ? '✅' : '❌'}</span>
                    <span className="flex-1">
                      <span style={{ color: result.fromColor }}>
                        {result.fromLabel}
                      </span>
                      <span className="text-text/30 mx-2">→</span>
                      <span style={{ color: result.toColor }}>
                        {result.toLabel}
                      </span>
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        result.shouldConnect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {result.shouldConnect ? 'NỐI' : 'KHÔNG NỐI'}
                    </span>
                    <span className="text-text/30">✏️</span>
                  </div>

                  {editingIndex === i && (
                    <div
                      className="mt-3 pt-3 border-t border-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <p className="text-sm text-text/60 mb-2">Đổi đáp án:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleChangeAnswer(i, 'YES')}
                          className={`py-2 rounded-lg text-sm font-medium transition
                            ${
                              result.shouldConnect
                                ? 'bg-green-600 text-white'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                        >
                          ✓ YES - NỐI
                        </button>
                        <button
                          onClick={() => handleChangeAnswer(i, 'NO')}
                          className={`py-2 rounded-lg text-sm font-medium transition
                            ${
                              !result.shouldConnect
                                ? 'bg-red-600 text-white'
                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                            }`}
                        >
                          ✗ NO - KHÔNG NỐI
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {wireResults.length === 0 && (
                <p className="text-center text-text/40 py-4">
                  Chưa có câu hỏi nào
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
