import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { socket } from '../../socket';

// Timing constants (in milliseconds)
const DOT_DURATION = 400;
const DASH_DURATION = 1200;
const ELEMENT_GAP = 400;
const LETTER_GAP = 1200;
const WORD_GAP = 2800;

// Initial time for Game 3 (5 minutes)
const INITIAL_TIME = 300;

export default function PlayerB() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const roomId = params.get('room') || 'mln131';
  const playerAName = params.get('playerA') || 'Player A';
  const playerBName = params.get('playerB') || 'Player B';

  const [answer, setAnswer] = useState('');
  const [playerAConnected, setPlayerAConnected] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Morse code state
  const [morseSequence, setMorseSequence] = useState([]);
  const [phraseLength, setPhraseLength] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightOn, setLightOn] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentElement, setCurrentElement] = useState('');
  const playingRef = useRef(false);

  // Timer state
  const [timeRemaining, setTimeRemaining] = useState(INITIAL_TIME);
  const [timerActive, setTimerActive] = useState(true);
  const startTimeRef = useRef(Date.now());

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

    socket.on('game3-phrase', ({ morseSequence: seq, phraseLength: len }) => {
      setMorseSequence(seq);
      setPhraseLength(len);
    });

    socket.on('game3-player-joined', ({ role }) => {
      if (role === 'A') setPlayerAConnected(true);
    });

    socket.on('game3-wrong-answer', ({ message }) => {
      setError(message);
      setLoading(false);
      setTimeout(() => setError(''), 3000);
    });

    socket.on('game3-complete', () => {
      setGameComplete(true);
      setLoading(false);
      setTimerActive(false);

      // Calculate time used for Game 3
      const timeUsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
      times.game3 = timeUsed;
      sessionStorage.setItem('gameTimes', JSON.stringify(times));

      // Navigate to Leaderboard after delay
      setTimeout(() => {
        navigate('/leaderboard');
      }, 2000);
    });

    socket.on('game3-reset', ({ morseSequence: seq }) => {
      setMorseSequence(seq);
      setCurrentIndex(-1);
      setIsPlaying(false);
      setLightOn(false);
    });

    return () => {
      socket.off('game3-phrase');
      socket.off('game3-player-joined');
      socket.off('game3-wrong-answer');
      socket.off('game3-complete');
      socket.off('game3-reset');
      playingRef.current = false;
    };
  }, [roomId]);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const playMorseSequence = useCallback(async () => {
    if (morseSequence.length === 0) return;

    setIsPlaying(true);
    playingRef.current = true;

    for (let i = 0; i < morseSequence.length; i++) {
      if (!playingRef.current) break;

      const item = morseSequence[i];
      setCurrentIndex(i);

      if (item.type === 'space') {
        // Word gap
        setCurrentElement('NGHỈ (từ mới)');
        setLightOn(false);
        await sleep(WORD_GAP);
      } else {
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
        if (
          i < morseSequence.length - 1 &&
          morseSequence[i + 1].type !== 'space'
        ) {
          await sleep(LETTER_GAP);
        }
      }
    }

    setIsPlaying(false);
    playingRef.current = false;
    setCurrentIndex(-1);
    setCurrentElement('');
    setLightOn(false);
  }, [morseSequence]);

  const stopPlaying = () => {
    playingRef.current = false;
    setIsPlaying(false);
    setLightOn(false);
    setCurrentIndex(-1);
    setCurrentElement('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!answer.trim()) return;

    setLoading(true);
    setError('');
    socket.emit('submit-game3-answer', {
      roomId,
      answer: answer.toUpperCase(),
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
            💡 Đèn Morse
          </span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-600 text-sm">
            {playerBName}
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
      <div className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {/* Left - Morse Light Display */}
        <div className="game-card">
          <h3 className="card-title">💡 Đèn Morse</h3>
          <p className="text-sm text-text/50 mb-4">
            Quan sát đèn chớp và mô tả cho Player A
          </p>

          {/* Light Bulb */}
          <div className="flex flex-col items-center justify-center py-8">
            <div
              className={`w-40 h-40 rounded-full transition-all duration-100 ${
                lightOn
                  ? 'bg-yellow-400 shadow-[0_0_60px_30px_rgba(250,204,21,0.8)]'
                  : 'bg-gray-300 shadow-inner'
              }`}
            />

            {/* Current Element Display */}
            <div className="mt-6 h-12 flex items-center justify-center">
              {currentElement && (
                <span
                  className={`text-2xl font-bold ${
                    lightOn ? 'text-yellow-600' : 'text-text/50'
                  }`}
                >
                  {currentElement}
                </span>
              )}
            </div>

            {/* Progress */}
            {currentIndex >= 0 && (
              <div className="mt-4 text-sm text-text/50">
                Ký tự: {currentIndex + 1} / {morseSequence.length}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isPlaying ? (
              <button
                onClick={playMorseSequence}
                disabled={morseSequence.length === 0}
                className="btn-secondary px-6 py-3"
              >
                ▶️ Phát mã Morse
              </button>
            ) : (
              <button onClick={stopPlaying} className="btn-primary px-6 py-3">
                ⏹️ Dừng
              </button>
            )}
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <p className="text-yellow-700 text-sm text-center">
              <strong>Hướng dẫn:</strong> Đèn sáng NGẮN = Chấm (•) | Đèn sáng
              DÀI = Gạch (—)
            </p>
          </div>
        </div>

        {/* Right - Answer Input & Instructions */}
        <div className="space-y-6">
          {/* Instructions */}
          <div className="game-card">
            <h3 className="card-title">📋 Hướng dẫn</h3>
            <ol className="text-sm text-text/70 space-y-2">
              <li>
                1. Nhấn <strong>&quot;Phát mã Morse&quot;</strong> để xem đèn
                chớp
              </li>
              <li>
                2. Mô tả cho Player A: &quot;NGẮN&quot; hoặc &quot;DÀI&quot;
              </li>
              <li>3. Chờ Player A tra bảng và đọc lại chữ cái</li>
              <li>4. Ghi nhớ và nhập đáp án đầy đủ bên dưới</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-sm">
                📝 <strong>Số ký tự cần tìm:</strong> {phraseLength} chữ cái
              </p>
            </div>
          </div>

          {/* Answer Form */}
          <div className="game-card">
            <h3 className="card-title">✏️ Nhập đáp án</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Nhập câu đã giải mã..."
                className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text 
                           focus:border-primary focus:outline-none transition-colors
                           font-atkinson text-lg uppercase tracking-widest"
                disabled={gameComplete}
              />

              <button
                type="submit"
                disabled={!answer.trim() || loading || gameComplete}
                className="btn-check w-full"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div
                      className="three-body"
                      style={{ '--uib-size': '20px' }}
                    >
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
            </form>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 rounded-xl border border-red-200 text-center">
                <p className="text-primary font-medium">❌ {error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
