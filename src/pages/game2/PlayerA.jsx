import { socket } from '../../socket';
import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GAME_TIMES } from '../../config/gameConfig';

export default function PlayerA() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room');
  const myName = params.get('myName') || 'Player A';

  // Get player B name from sessionStorage (saved in game1)
  const savedTimes = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
  const [playerBName] = useState(savedTimes.playerB || 'Player B');

  // Game state - store all questions with wire info
  const [allQuestions, setAllQuestions] = useState([]);
  const [answeredQuestions, setAnsweredQuestions] = useState({}); // { wireIndex: 'YES' | 'NO' }

  // Currently expanded question for answering
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Timer state (synced from Player B via server)
  const [timeRemaining, setTimeRemaining] = useState(GAME_TIMES.GAME2);

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

    socket.on('global-restart', () => {
      navigate(
        `/game1/a?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

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
      socket.off('global-restart');
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
              📖 Lý thuyết
            </span>
          </div>

          {/* Right: Timer */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">
              Room:{' '}
              <span className="font-semibold text-slate-200">{roomId}</span>
            </span>
            <span className="px-3 py-1 text-sm bg-slate-700 text-slate-300 rounded-lg">
              Đã trả lời: {answeredCount}/{allQuestions.length}
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
              <span className="font-semibold">Nhiệm vụ:</span> Trả lời các câu
              hỏi lý thuyết để{' '}
              <span className="font-black text-blue-900 underline decoration-2">
                {playerBName}
              </span>{' '}
              biết được nên nối hay không nối các cặp dây.
            </p>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl mx-auto">
          {/* All Questions List */}
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              📝 Danh sách câu hỏi
            </h3>
            <p className="text-xs text-slate-400 mb-4">
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
                        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500'
                        : answer
                          ? 'border-slate-200 bg-white hover:border-blue-300'
                          : 'border-dashed border-slate-300 bg-slate-50 hover:border-blue-400 hover:bg-blue-50/50'
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
                        <span className="text-slate-400">—</span>
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
                        <span className="text-slate-400">
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </div>
                    </div>

                    {/* Expanded Content - Question and Answer buttons */}
                    {isExpanded && (
                      <div
                        className="px-4 pb-4 border-t border-slate-200 pt-4"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Question Text */}
                        <div className="p-3 bg-blue-100 rounded-lg mb-4">
                          <p className="text-sm text-blue-700 font-medium mb-1">
                            Câu hỏi:
                          </p>
                          <p className="text-slate-800">{q.question}</p>
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
                  <p className="text-slate-500">
                    Đang tải danh sách câu hỏi...
                  </p>
                </div>
              )}
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

      {/* Level Complete Overlay */}
      {levelComplete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border-4 border-green-200">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              Hoàn thành!
            </h2>
            <p className="text-slate-600 mb-4">
              Player B đã nối đúng tất cả dây!
            </p>
            <p className="text-sm text-slate-400">Đang chuyển sang Game 3...</p>
          </div>
        </div>
      )}
    </div>
  );
}
