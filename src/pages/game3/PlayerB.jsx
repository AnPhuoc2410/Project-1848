import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';
import { GAME_TIMES } from '../../config/gameConfig';

// Timing constants (in milliseconds) - Chuẩn Morse tỉ lệ 1:3
const DOT_DURATION = 300; // Chấm: ngắn
const DASH_DURATION = 900; // Gạch: dài gấp 3 lần chấm
const ELEMENT_GAP = 300; // Khoảng cách giữa các tín hiệu trong 1 chữ
const LETTER_GAP = 900; // Khoảng cách giữa các chữ (= 3 đơn vị)

// Initial time for Game 3
const INITIAL_TIME = GAME_TIMES.GAME3;

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const myName = params.get('myName') || 'Player B';

  const [playerAConnected, setPlayerAConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [gameOver, setGameOver] = useState(false);
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
  const [currentMorseDisplay, setCurrentMorseDisplay] = useState(''); // Hiển thị morse đang phát
  const playingRef = useRef(false);
  const playbackIdRef = useRef(0); // Track current playback session ID
  const audioContextRef = useRef(null);
  const currentOscillatorRef = useRef(null); // Track current oscillator to stop it

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

  // Demo light state
  const [demoLightOn, setDemoLightOn] = useState(false);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const demoTimeoutRef = useRef(null);

  // Stop any currently playing beep
  const stopCurrentBeep = useCallback(() => {
    try {
      if (currentOscillatorRef.current) {
        currentOscillatorRef.current.stop();
        currentOscillatorRef.current = null;
      }
    } catch (e) {
      // Ignore - oscillator might already be stopped
    }
  }, []);

  // Initialize audio context for beep sounds
  const playBeep = useCallback(
    (duration) => {
      try {
        // Stop previous beep first
        stopCurrentBeep();

        if (!audioContextRef.current) {
          audioContextRef.current = new (
            window.AudioContext || window.webkitAudioContext
          )();
        }
        const ctx = audioContextRef.current;
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.value = 600; // Tần số beep
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          ctx.currentTime + duration / 1000
        );

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + duration / 1000);

        // Track this oscillator
        currentOscillatorRef.current = oscillator;

        // Clear ref when oscillator ends
        oscillator.onended = () => {
          if (currentOscillatorRef.current === oscillator) {
            currentOscillatorRef.current = null;
          }
        };
      } catch (e) {
        // Ignore audio errors
      }
    },
    [stopCurrentBeep]
  );

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
          setGameOver(true);
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

    socket.on('global-restart', () => {
      navigate(
        `/game1/b?room=${roomId}&myName=${encodeURIComponent(myName)}&t=${Date.now()}`
      );
    });

    return () => {
      socket.off('game3-word-cards');
      socket.off('game3-player-joined');
      socket.off('game3-wrong-answer');
      socket.off('game3-timer-update');
      socket.off('game3-complete');
      socket.off('game3-reset');
      socket.off('global-restart');
      playingRef.current = false;
    };
  }, [roomId, navigate, totalSlots]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playMorseForCard = useCallback(
    async (card) => {
      // Check if there was a previous playback running
      const wasPlaying = playingRef.current;

      // Stop any currently playing card first
      playingRef.current = false;
      stopCurrentBeep();
      setLightOn(false);
      setCurrentElement('');

      // Generate new playback ID - this invalidates any previous playback
      const currentPlaybackId = ++playbackIdRef.current;

      setActiveCardId(card.id);
      // Only delay if there was a previous playback to stop
      if (wasPlaying) {
        await sleep(700);
        // Check if another playback started while we were waiting
        if (playbackIdRef.current !== currentPlaybackId) return;
      }

      setIsPlaying(true);
      playingRef.current = true;
      setCurrentMorseDisplay('');

      const morseSequence = card.morseSequence;

      for (let i = 0; i < morseSequence.length; i++) {
        // Check both playingRef AND playbackId to ensure this session is still valid
        if (!playingRef.current || playbackIdRef.current !== currentPlaybackId)
          break;

        const item = morseSequence[i];

        // Play each dot/dash in the morse code
        const elements = item.morse.split('');

        for (let j = 0; j < elements.length; j++) {
          if (
            !playingRef.current ||
            playbackIdRef.current !== currentPlaybackId
          )
            break;

          const element = elements[j];
          const isDot = element === '.';
          const duration = isDot ? DOT_DURATION : DASH_DURATION;

          // Update morse display - hiển thị từng tín hiệu
          setCurrentElement(isDot ? '•' : '—');
          setCurrentMorseDisplay((prev) => prev + (isDot ? '•' : '—'));

          setLightOn(true);
          playBeep(duration);
          await sleep(duration);

          // Check again after sleep
          if (
            !playingRef.current ||
            playbackIdRef.current !== currentPlaybackId
          ) {
            setLightOn(false);
            break;
          }

          setLightOn(false);
          setCurrentElement('');

          if (j < elements.length - 1) {
            await sleep(ELEMENT_GAP);
            if (
              !playingRef.current ||
              playbackIdRef.current !== currentPlaybackId
            )
              break;
          }
        }

        // Check before adding space
        if (!playingRef.current || playbackIdRef.current !== currentPlaybackId)
          break;

        // Thêm dấu cách để phân biệt chữ
        setCurrentMorseDisplay((prev) => prev + ' ');

        // Letter gap after each letter
        if (i < morseSequence.length - 1) {
          await sleep(LETTER_GAP);
          if (
            !playingRef.current ||
            playbackIdRef.current !== currentPlaybackId
          )
            break;
        }
      }

      // Only clean up if this is still the active playback
      if (playbackIdRef.current === currentPlaybackId) {
        // Giữ hiển thị morse 1 giây trước khi xóa
        await sleep(1000);

        if (playbackIdRef.current === currentPlaybackId) {
          setIsPlaying(false);
          playingRef.current = false;
          setActiveCardId(null);
          setLightOn(false);
          setCurrentMorseDisplay('');
          setCurrentElement('');
        }
      }
    },
    [playBeep, stopCurrentBeep]
  );

  const stopPlaying = () => {
    playingRef.current = false;
    setIsPlaying(false);
    setLightOn(false);
    setActiveCardId(null);
    setCurrentElement('');
    setCurrentMorseDisplay('');
    stopCurrentBeep(); // Stop audio immediately
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
    // Always allow clicking - will stop current and play new
    playMorseForCard(card);
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

  // Get card label (A, B, C...) from card id - consistent mapping
  const getCardLabel = (cardId) => {
    const cardIndex = wordCards.findIndex((c) => c.id === cardId);
    if (cardIndex === -1) return '?';
    return String.fromCharCode(65 + cardIndex); // A, B, C, D...
  };

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

  // Demo functions
  const playDemo = (type) => {
    if (isPlayingDemo) return;
    setIsPlayingDemo(true);

    const clearAllTimeouts = () => {
      if (demoTimeoutRef.current) {
        clearTimeout(demoTimeoutRef.current);
      }
    };

    clearAllTimeouts();

    if (type === 'dot') {
      // Chấm: 0.3s sáng
      setDemoLightOn(true);
      playBeep(DOT_DURATION);
      demoTimeoutRef.current = setTimeout(() => {
        setDemoLightOn(false);
        setIsPlayingDemo(false);
      }, DOT_DURATION);
    } else if (type === 'dash') {
      // Gạch: 0.9s sáng
      setDemoLightOn(true);
      playBeep(DASH_DURATION);
      demoTimeoutRef.current = setTimeout(() => {
        setDemoLightOn(false);
        setIsPlayingDemo(false);
      }, DASH_DURATION);
    } else if (type === 'letter-gap') {
      // Khoảng lặng giữa chữ: chấm -> gap 0.9s -> chấm
      setDemoLightOn(true);
      playBeep(DOT_DURATION);
      demoTimeoutRef.current = setTimeout(() => {
        setDemoLightOn(false);
        setTimeout(() => {
          setDemoLightOn(true);
          playBeep(DOT_DURATION);
          setTimeout(() => {
            setDemoLightOn(false);
            setIsPlayingDemo(false);
          }, DOT_DURATION);
        }, LETTER_GAP);
      }, DOT_DURATION);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* ═══════════════════════════════════════════════════════════════════
          BAR 1 - TOP STATUS BAR (Dark Brand Color)
      ═══════════════════════════════════════════════════════════════════ */}
      <header className="flex-shrink-0 bg-slate-800 px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Player Title */}
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-wide">
              PLAYER <span className="text-emerald-400">B</span>
            </h1>
            <span className="px-3 py-1 text-sm font-semibold bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
              Giải mã Morse
            </span>
          </div>

          {/* Right: Timer (Large Digital Clock Style) */}
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

      {/* ═══════════════════════════════════════════════════════════════════
          BAR 2 - INSTRUCTION SUB-HEADER (Light Background)
      ═══════════════════════════════════════════════════════════════════ */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Hint Text (Larger & More Prominent) */}
          <div className="flex items-center gap-3 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <span className="text-2xl">💡</span>
            <p className="text-base text-amber-800">
              <span className="font-semibold">Gợi ý:</span> Mỗi thẻ ẩn chứa{' '}
              <span className="font-black text-amber-900 underline decoration-2">
                1 từ vựng
              </span>{' '}
              (word), không phải chữ cái.
            </p>
          </div>

          {/* Right: Signal Legend */}
          <div className="hidden md:flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-2 border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 mr-2">
              Bấm để nghe:
            </span>
            <button
              onClick={() => playDemo('dot')}
              disabled={isPlayingDemo}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isPlayingDemo
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-blue-50 active:scale-95 cursor-pointer'
              }`}
            >
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              <span className="text-slate-700">Chấm</span>
              <span className="text-slate-400 text-xs">
                {DOT_DURATION / 1000}s
              </span>
            </button>
            <div className="w-px h-5 bg-slate-300"></div>
            <button
              onClick={() => playDemo('dash')}
              disabled={isPlayingDemo}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isPlayingDemo
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-purple-50 active:scale-95 cursor-pointer'
              }`}
            >
              <span className="w-5 h-3 bg-purple-500 rounded"></span>
              <span className="text-slate-700">Gạch</span>
              <span className="text-slate-400 text-xs">
                {DASH_DURATION / 1000}s
              </span>
            </button>
            <div className="w-px h-5 bg-slate-300"></div>
            <button
              onClick={() => playDemo('letter-gap')}
              disabled={isPlayingDemo}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isPlayingDemo
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:bg-orange-50 active:scale-95 cursor-pointer'
              }`}
            >
              <span className="w-4 h-3 border-2 border-dashed border-orange-400 rounded"></span>
              <span className="text-slate-700">Lặng</span>
              <span className="text-slate-400 text-xs">
                {LETTER_GAP / 1000}s
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          MIDDLE WORKSPACE - Main Stage (Flex Grow)
      ═══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-4 min-h-0">
        {/* Signal Visualizer */}
        <div className="flex flex-col items-center gap-2">
          {/* Main Light */}
          <div
            className={`w-24 h-24 md:w-28 md:h-28 rounded-full transition-all duration-75 border-4 ${
              lightOn
                ? 'bg-yellow-400 border-yellow-500 shadow-[0_0_60px_20px_rgba(250,204,21,0.6)]'
                : 'bg-slate-200 border-slate-300'
            }`}
          />

          {/* Current Signal Display */}
          <div className="h-6 flex items-center justify-center">
            {currentElement ? (
              <span className="text-2xl font-bold text-yellow-600 animate-pulse">
                {currentElement}
              </span>
            ) : isPlaying ? (
              <span className="text-xs text-slate-400">Đang phát...</span>
            ) : (
              <span className="text-xs text-slate-400">Chọn thẻ để nghe</span>
            )}
          </div>

          {/* Stop Button */}
          {isPlaying && (
            <button
              onClick={stopPlaying}
              className="mt-1 px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              ⏹ Dừng
            </button>
          )}
        </div>

        {/* Card Grid */}
        <div
          className="w-full max-w-2xl"
          onDragOver={handleDragOver}
          onDrop={handleDropOnPool}
        >
          <div className="grid grid-cols-5 gap-2 md:gap-3">
            {wordCards.map((card) => {
              const isInSlot = answerSlots.some((slot) => slot?.id === card.id);
              const isActive = activeCardId === card.id;

              return (
                <button
                  key={card.id}
                  disabled={isInSlot}
                  draggable={!isPlaying && !isInSlot}
                  onDragStart={(e) => handleDragStart(e, card)}
                  onClick={() => !isInSlot && handleCardClick(card)}
                  className={`relative flex flex-col items-center justify-center py-3 px-2 rounded-lg border-2 transition-all font-medium text-sm ${
                    isInSlot
                      ? 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed'
                      : isActive
                        ? 'bg-yellow-50 border-yellow-400 text-yellow-700 shadow-lg scale-105'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-400 hover:shadow-md cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="text-base md:text-lg">🔊</span>
                  <span className="text-xs md:text-sm mt-0.5">
                    Thẻ {getCardLabel(card.id)}
                  </span>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════
          BOTTOM DOCK - Answer Zone (Taller Footer)
      ═══════════════════════════════════════════════════════════════════ */}
      <footer className="flex-shrink-0 bg-gradient-to-t from-slate-100 to-white border-t-2 border-slate-200 px-6 py-4">
        <div className="max-w-5xl mx-auto">
          {/* Title & Check Button Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-bold text-slate-800">
                Sắp xếp câu trả lời
              </h3>
              <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-sm font-semibold">
                {answerSlots.filter((s) => s).length} / {totalSlots}
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={
                loading ||
                gameComplete ||
                answerSlots.filter((s) => s).length !== totalSlots
              }
              className={`px-8 py-3 rounded-xl text-base font-bold transition-all shadow-lg ${
                answerSlots.filter((s) => s).length === totalSlots
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-95 hover:shadow-emerald-200'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              {loading ? '⏳ Đang kiểm tra...' : '✓ Kiểm tra đáp án'}
            </button>
          </div>

          {/* Answer Slots - LARGER */}
          <div className="flex gap-3 justify-center flex-wrap">
            {answerSlots.map((slot, index) => (
              <div
                key={index}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDropOnSlot(e, index)}
                className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl flex items-center justify-center transition-all ${
                  slot
                    ? 'bg-emerald-100 border-3 border-emerald-500 shadow-md'
                    : 'bg-white border-[3px] border-dashed border-slate-300 hover:border-emerald-400 hover:bg-emerald-50'
                }`}
              >
                {/* Slot Number Badge */}
                <span className="absolute -top-2 -left-2 w-6 h-6 bg-slate-700 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                  {index + 1}
                </span>

                {slot ? (
                  <>
                    <span
                      className="text-base font-bold text-emerald-700 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleDragStart(e, slot, index)}
                    >
                      Thẻ {getCardLabel(slot.id)}
                    </span>
                    <button
                      onClick={() => removeFromSlot(index)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 flex items-center justify-center leading-none shadow"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">
                    Kéo vào
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-3 text-center">
              <span className="text-sm text-red-600 bg-red-100 px-4 py-2 rounded-lg font-medium">
                ❌ {error}
              </span>
            </div>
          )}
        </div>
      </footer>

      {/* ═══════════════════════════════════════════════════════════════════
          OVERLAYS
      ═══════════════════════════════════════════════════════════════════ */}

      {/* Game Over Overlay */}
      {gameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">⏰</div>
            <h2 className="text-xl font-bold text-red-600 mb-2">
              Hết thời gian!
            </h2>
            <p className="text-slate-500 text-sm mb-4">Game kết thúc</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => socket.emit('restart-all-games', { roomId })}
                className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
              >
                🔄 Chơi lại
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-300 transition-colors"
              >
                🏠 Trang chủ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Complete Overlay */}
      {gameComplete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-emerald-600 mb-2">
              Hoàn thành Game 3!
            </h2>
            <p className="text-slate-500 text-sm mb-4">Đáp án chính xác!</p>
            <div className="flex justify-center">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
