import { socket } from '../../socket';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room');
  const myName = params.get('myName') || 'Player A';

  // Game state - store all questions with wire info
  const [allQuestions, setAllQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // { wireIndex: 'YES' | 'NO' }

  // Currently expanded question for answering
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Timer state (synced from Player B via server)
  const [timeRemaining, setTimeRemaining] = useState(300);

  // Game status
  const [levelComplete, setLevelComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const startTimeRef = useRef(Date.now());

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    socket.emit('join-room', { roomId, role: 'A' });

    socket.on('game-init', (data) => {
      // Store all questions for Player A
      if (data.allQuestions) {
        setAllQuestions(data.allQuestions);
      }
      // Restore answered questions from wireResults
      if (data.wireResults) {
        const answered = {};
        data.wireResults.forEach((r) => {
          answered[r.wireIndex] = r.shouldConnect ? 'YES' : 'NO';
        });
        setAnsweredQuestions(answered);
      }
      // Set initial time
      if (data.timeRemaining) {
        setTimeRemaining(data.timeRemaining);
      }
    });

    socket.on('answer-updated', ({ wireIndex, shouldConnect }) => {
      setAnsweredQuestions((prev) => ({
        ...prev,
        [wireIndex]: shouldConnect ? 'YES' : 'NO',
      }));
    });

    // Listen for time updates from server (synced from Player B)
    socket.on('time-update', ({ timeRemaining: newTime }) => {
      setTimeRemaining(newTime);
    });

    socket.on('level-complete', () => {
      setLevelComplete(true);

      // Calculate time used for Game 2
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game2 = timeUsed;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      // Navigate to Game 3 after delay
      setTimeout(() => {
        navigate(
          `/game3/a?room=${roomId}&myName=${encodeURIComponent(myName)}`
        );
      }, 2000);
    });
    socket.on('game-over', () => setGameOver(true));

    socket.on('game-reset', (data) => {
      if (data.allQuestions) {
        setAllQuestions(data.allQuestions);
      }
      setAnsweredQuestions({});
      setExpandedIndex(null);
      setLevelComplete(false);
      setGameOver(false);
      if (data.timeRemaining) {
        setTimeRemaining(data.timeRemaining);
      }
    });

    return () => {
      socket.off('game-init');
      socket.off('answer-updated');
      socket.off('time-update');
      socket.off('level-complete');
      socket.off('game-over');
      socket.off('game-reset');
    };
  }, [roomId, navigate, myName]);

  const handleQuestionClick = (index) => {
    // Toggle expand/collapse
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleAnswer = (wireIndex, answer) => {
    // Update local state immediately
    setAnsweredQuestions((prev) => ({
      ...prev,
      [wireIndex]: answer,
    }));

    // Send to server
    socket.emit('player-a-answer', { roomId, wireIndex, answer });

    // Collapse the question
    setExpandedIndex(null);
  };

  const handleReset = () => socket.emit('reset-game', { roomId });

  const answeredCount = Object.keys(answeredQuestions).length;

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
            <p className="text-text/70 mb-4">Player B đã hết thời gian</p>
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
            <p className="text-text/70 mb-4">
              Player B đã nối đúng tất cả dây!
            </p>
            <p className="text-sm text-text/50">Đang chuyển sang Game 3...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* All Questions List */}
        <div className="game-card">
          <h3 className="card-title">📝 Danh sách câu hỏi</h3>
          <p className="text-xs text-text/40 mb-4">
            Click vào cặp dây để xem câu hỏi và trả lời
          </p>

          <div className="space-y-3">
            {allQuestions.map((q, index) => {
              const answer = answeredQuestions[index];
              const isExpanded = expandedIndex === index;

              return (
                <div
                  key={index}
                  className={`rounded-xl border transition-all cursor-pointer ${
                    isExpanded
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : answer
                        ? 'border-border bg-white hover:border-secondary'
                        : 'border-dashed border-text/20 bg-gray-50 hover:border-secondary hover:bg-secondary/5'
                  }`}
                  onClick={() => handleQuestionClick(index)}
                >
                  {/* Header - Wire Pair */}
                  <div className="p-4 flex items-center gap-3">
                    {/* Wire Pair Label with Colors */}
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded-lg text-sm font-bold"
                        style={{
                          backgroundColor: q.fromColor + '30',
                          color: q.fromColor,
                          border: `2px solid ${q.fromColor}`,
                        }}
                      >
                        {q.fromLabel}
                      </span>
                      <span className="text-text/40">—</span>
                      <span
                        className="px-2 py-1 rounded-lg text-sm font-bold"
                        style={{
                          backgroundColor: q.toColor + '30',
                          color: q.toColor,
                          border: `2px solid ${q.toColor}`,
                        }}
                      >
                        {q.toLabel}
                      </span>
                    </div>

                    {/* Answer Badge */}
                    <div className="ml-auto flex items-center gap-2">
                      {answer && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-bold ${
                            answer === 'YES'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {answer === 'YES' ? '✓ NỐI' : '✗ KHÔNG NỐI'}
                        </span>
                      )}
                      <span className="text-text/40">
                        {isExpanded ? '▼' : '▶'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Content - Question and Answer buttons */}
                  {isExpanded && (
                    <div
                      className="px-4 pb-4 border-t border-border/50 pt-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Question Text */}
                      <div className="p-3 bg-secondary/10 rounded-lg mb-4">
                        <p className="text-sm text-secondary font-medium mb-1">
                          Câu hỏi:
                        </p>
                        <p className="text-text font-robert-regular">
                          {q.question}
                        </p>
                      </div>

                      {/* Answer Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleAnswer(index, 'YES')}
                          className={`py-3 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
                            answer === 'YES'
                              ? 'bg-green-600 text-white'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          <span>YES - NỐI</span>
                        </button>
                        <button
                          onClick={() => handleAnswer(index, 'NO')}
                          className={`py-3 rounded-xl font-bold transition flex flex-col items-center gap-1 ${
                            answer === 'NO'
                              ? 'bg-red-600 text-white'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <span>NO - KHÔNG NỐI</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {allQuestions.length === 0 && (
              <div className="text-center py-8">
                <div className="three-body mx-auto mb-4">
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                  <div className="three-body__dot"></div>
                </div>
                <p className="text-text/50">Đang tải danh sách câu hỏi...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
