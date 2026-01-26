import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';

// Timing constants (in milliseconds)
const DOT_DURATION = 400;
const DASH_DURATION = 1200;
const ELEMENT_GAP = 400;
const LETTER_GAP = 1200;

// Initial time for Game 3 (5 minutes)
const INITIAL_TIME = 300;

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const myName = params.get('myName') || 'Player B';

  const [playerAConnected, setPlayerAConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Word cards state
  const [wordCards, setWordCards] = useState([]);
  const [totalSlots, setTotalSlots] = useState(7);
  const [answerSlots, setAnswerSlots] = useState([]);
  const [draggedCard, setDraggedCard] = useState(null);

  // Morse playback state
  const [activeCardId, setActiveCardId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [currentElement, setCurrentElement] = useState('');
  const playingRef = useRef(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

  // Initialize empty answer slots
  useEffect(() => {
    setAnswerSlots(Array(totalSlots).fill(null));
  }, [totalSlots]);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || gameComplete) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setTimerActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, gameComplete]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    socket.emit('join-game3', { roomId, role: 'B' });

    socket.on('game3-word-cards', ({ wordCards: cards, totalSlots: slots }) => {
      setWordCards(cards);
      setTotalSlots(slots);
      setAnswerSlots(Array(slots).fill(null));
    });

    socket.on('game3-player-joined', ({ role }) => {
      if (role === 'A') setPlayerAConnected(true);
    });

    socket.on('game3-wrong-answer', ({ message, timeRemaining: newTime }) => {
      setError(message);
      setLoading(false);
      setTimeRemaining(newTime);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('game3-timer-update', ({ timeRemaining: newTime }) => {
      setTimeRemaining(newTime);
    });

    socket.on('game3-complete', () => {
      setGameComplete(true);
      setLoading(false);
      setTimerActive(false);

      // Calculate time used for Game 3
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game3 = timeUsed;
      times.isScoreSubmitter = true;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      // Navigate to Leaderboard after delay
      setTimeout(() => {
        navigate('/leaderboard');
      }, 2000);
    });

    socket.on('game3-reset', ({ wordCards: cards }) => {
      setWordCards(cards);
      setAnswerSlots(Array(totalSlots).fill(null));
      setIsPlaying(false);
      setLightOn(false);
      setActiveCardId(null);
    });

    return () => {
      socket.off('game3-word-cards');
      socket.off('game3-player-joined');
      socket.off('game3-wrong-answer');
      socket.off('game3-timer-update');
      socket.off('game3-complete');
      socket.off('game3-reset');
      playingRef.current = false;
    };
  }, [roomId, navigate, totalSlots]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playMorseForCard = useCallback(
    async (card) => {
      if (isPlaying) return;

      setActiveCardId(card.id);
      setIsPlaying(true);
      playingRef.current = true;

      const morseSequence = card.morseSequence;

      for (let i = 0; i < morseSequence.length; i++) {
        if (!playingRef.current) break;

        const item = morseSequence[i];

        // Play each dot/dash in the morse code
        const elements = item.morse.split('');

        for (let j = 0; j < elements.length; j++) {
          if (!playingRef.current) break;

          const element = elements[j];
          const isDot = element === '.';

          setCurrentElement(isDot ? '• NGẮN' : '— DÀI');
          setLightOn(true);
          await sleep(isDot ? DOT_DURATION : DASH_DURATION);

          setLightOn(false);
          if (j < elements.length - 1) {
            await sleep(ELEMENT_GAP);
          }
        }

        // Letter gap after each letter
        if (i < morseSequence.length - 1) {
          await sleep(LETTER_GAP);
        }
      }

      setIsPlaying(false);
      playingRef.current = false;
      setActiveCardId(null);
      setCurrentElement('');
      setLightOn(false);
    },
    [isPlaying]
  );

  const stopPlaying = () => {
    playingRef.current = false;
    setIsPlaying(false);
    setLightOn(false);
    setActiveCardId(null);
    setCurrentElement('');
  };

  // Drag and Drop handlers
  const handleDragStart = (e, card, fromSlot = null) => {
    setDraggedCard({ card, fromSlot });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnSlot = (e, slotIndex) => {
    e.preventDefault();
    if (!draggedCard) return;

    const { card, fromSlot } = draggedCard;
    const newSlots = [...answerSlots];

    // If dragging from another slot, clear that slot first
    if (fromSlot !== null) {
      newSlots[fromSlot] = null;
    }

    // If slot is occupied, swap or return to pool
    if (newSlots[slotIndex]) {
      // Return existing card to pool (no action needed, it stays in wordCards)
    }

    newSlots[slotIndex] = card;
    setAnswerSlots(newSlots);
    setDraggedCard(null);
  };

  const handleDropOnPool = (e) => {
    e.preventDefault();
    if (!draggedCard || draggedCard.fromSlot === null) return;

    // Remove from slot
    const newSlots = [...answerSlots];
    newSlots[draggedCard.fromSlot] = null;
    setAnswerSlots(newSlots);
    setDraggedCard(null);
  };

  const handleCardClick = (card) => {
    if (!isPlaying) {
      playMorseForCard(card);
    }
  };

  const removeFromSlot = (slotIndex) => {
    const newSlots = [...answerSlots];
    newSlots[slotIndex] = null;
    setAnswerSlots(newSlots);
  };

  // Get cards that are not in any slot
  const availableCards = wordCards.filter(
    (card) => !answerSlots.some((slot) => slot?.id === card.id)
  );

  const handleSubmit = () => {
    // Check if all slots are filled
    const filledSlots = answerSlots.filter((slot) => slot !== null);
    if (filledSlots.length !== totalSlots) {
      setError(`Hãy điền đủ ${totalSlots} ô!`);
      setTimeout(() => setError(''), 3000);
      return;
    }

    setLoading(true);
    setError('');
    const orderedWords = answerSlots.map((slot) => slot.word);
    socket.emit('submit-game3-answer', {
      roomId,
      orderedWords,
    });
  };

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
            💡 Giải mã Morse
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
              playerAConnected
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            {playerAConnected ? '🟢 Player A online' : '⏳ Chờ Player A...'}
          </span>
          <span className="px-3 py-1 rounded-lg bg-white/80 text-text/60 text-sm">
            Room: {roomId}
          </span>
        </div>
      </header>

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="game-overlay">
          <div className="overlay-card bg-green-50 border-green-200">
            <h2 className="text-2xl font-bold text-green-600 mb-2">
              🎉 Hoàn thành Game 3!
            </h2>
            <p className="text-text/70 mb-4">Đáp án chính xác!</p>
            <div className="three-body mx-auto">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-6xl mx-auto space-y-6">
        {/* Morse Light Display */}
        <div className="game-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title">💡 Đèn Morse</h3>
            {isPlaying && (
              <button
                onClick={stopPlaying}
                className="btn-primary px-4 py-2 text-sm"
              >
                ⏹️ Dừng
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-8">
            {/* Light Bulb */}
            <div
              className={`w-24 h-24 rounded-full transition-all duration-100 flex-shrink-0 ${
                lightOn
                  ? 'bg-yellow-400 shadow-[0_0_40px_20px_rgba(250,204,21,0.8)]'
                  : 'bg-gray-300 shadow-inner'
              }`}
            />

            {/* Current Element Display */}
            <div className="text-center">
              {currentElement ? (
                <span
                  className={`text-2xl font-bold ${
                    lightOn ? 'text-yellow-600' : 'text-text/50'
                  }`}
                >
                  {currentElement}
                </span>
              ) : (
                <span className="text-text/40">
                  {isPlaying ? 'Đang phát...' : 'Nhấn vào thẻ để nghe mã Morse'}
                </span>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-center">
            <p className="text-yellow-700 text-sm">
              <strong>Hướng dẫn:</strong> Đèn sáng NGẮN = Chấm (•) | Đèn sáng
              DÀI = Gạch (—)
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="game-card bg-blue-50 border-blue-200">
          <h3 className="card-title text-blue-700">📋 Cách chơi</h3>
          <ol className="text-sm text-blue-600 space-y-1">
            <li>
              1. <strong>Nhấn vào thẻ</strong> để nghe mã Morse của từ đó
            </li>
            <li>
              2. Mô tả cho Player A: &quot;NGẮN&quot; hoặc &quot;DÀI&quot; để
              giải mã từng chữ cái
            </li>
            <li>
              3. <strong>Kéo thả các thẻ</strong> vào 7 ô theo đúng thứ tự câu
            </li>
            <li>
              4. <strong>⚠️ Lưu ý:</strong> Có 3 thẻ gây nhiễu, không thuộc câu
              đáp án!
            </li>
          </ol>
        </div>

        {/* Answer Slots */}
        <div className="game-card">
          <h3 className="card-title">
            📝 Sắp xếp câu trả lời ({answerSlots.filter((s) => s).length}/
            {totalSlots})
          </h3>
          <div className="flex flex-wrap gap-3 justify-center mt-4">
            {answerSlots.map((slot, index) => (
              <div
                key={index}
                className={`relative w-28 h-16 rounded-xl border-2 border-dashed flex items-center justify-center transition-all ${
                  slot
                    ? 'bg-green-100 border-green-400'
                    : 'bg-gray-100 border-gray-300 hover:border-primary hover:bg-primary/5'
                }`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, index)}
              >
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </span>
                {slot ? (
                  <div
                    className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
                    draggable
                    onDragStart={(e) => handleDragStart(e, slot, index)}
                  >
                    <span className="font-bold text-green-700">
                      {slot.word}
                    </span>
                    <button
                      onClick={() => removeFromSlot(index)}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full hover:bg-red-600"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-400 text-sm">Kéo thẻ vào</span>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                gameComplete ||
                answerSlots.filter((s) => s).length !== totalSlots
              }
              className="btn-check px-8 py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="three-body" style={{ '--uib-size': '20px' }}>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                    <div className="three-body__dot"></div>
                  </div>
                  Đang kiểm tra...
                </span>
              ) : (
                '✓ Kiểm tra đáp án'
              )}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-center">
              <p className="text-primary font-medium">❌ {error}</p>
            </div>
          )}
        </div>

        {/* Word Cards Pool */}
        <div
          className="game-card"
          onDragOver={handleDragOver}
          onDrop={handleDropOnPool}
        >
          <h3 className="card-title">🎴 Thẻ từ (Nhấn để nghe Morse)</h3>
          <p className="text-sm text-text/50 mb-4">
            Có {wordCards.length} thẻ, trong đó {totalSlots} thẻ là đáp án, còn
            lại là thẻ gây nhiễu
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            {availableCards.map((card) => (
              <div
                key={card.id}
                className={`relative px-4 py-3 rounded-xl border-2 cursor-pointer transition-all select-none ${
                  activeCardId === card.id
                    ? 'bg-yellow-100 border-yellow-400 shadow-lg scale-105'
                    : 'bg-white border-gray-200 hover:border-primary hover:shadow-md hover:scale-102'
                }`}
                draggable={!isPlaying}
                onDragStart={(e) => handleDragStart(e, card)}
                onClick={() => handleCardClick(card)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔊</span>
                  <span className="font-bold text-text tracking-wide">
                    Thẻ{' '}
                    {card.id.replace('card-', '').replace('distractor-', 'X-')}
                  </span>
                </div>
                {activeCardId === card.id && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {availableCards.length === 0 && (
            <div className="text-center text-text/40 py-4">
              Tất cả thẻ đã được sử dụng
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
