import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const allowedOrigins = [
  'http://localhost:1848',
  'http://localhost:3000',
  'https://project-1848.vercel.app',
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
});

// ======================================
// CONFIGURATION & DATA
// ======================================

// 1. Questions Database: Scientific Socialism
const questions = [
  // --- YES QUESTIONS (Correct Wires) ---
  {
    id: 1,
    question:
      'Giai cấp công nhân có sứ mệnh lịch sử xóa bỏ chủ nghĩa tư bản không?',
    correctAnswer: 'YES',
  },
  {
    id: 2,
    question:
      'Đảng Cộng sản có phải là đội tiên phong của giai cấp công nhân không?',
    correctAnswer: 'YES',
  },
  {
    id: 3,
    question: 'Thời kỳ quá độ lên chủ nghĩa xã hội có mang tính tất yếu không?',
    correctAnswer: 'YES',
  },
  {
    id: 4,
    question:
      'Nền tảng của nhà nước XHCN là liên minh công - nông - trí thức đúng không?',
    correctAnswer: 'YES',
  },
  {
    id: 5,
    question:
      'Trong chủ nghĩa xã hội, nguyên tắc phân phối theo lao động là chủ yếu đúng không?',
    correctAnswer: 'YES',
  },
  {
    id: 6,
    question:
      'Dân chủ xã hội chủ nghĩa có phải là bản chất của chế độ ta không?',
    correctAnswer: 'YES',
  },
  {
    id: 7,
    question: 'Gia đình có phải là tế bào của xã hội không?',
    correctAnswer: 'YES',
  },
  {
    id: 8,
    question:
      'Cương lĩnh xây dựng đất nước có phải do Đảng Cộng sản đề ra không?',
    correctAnswer: 'YES',
  },
  // --- NO QUESTIONS (Wrong Wires) ---
  {
    id: 9,
    question:
      'Nhà nước có tồn tại vĩnh viễn trong xã hội cộng sản chủ nghĩa không?',
    correctAnswer: 'NO',
  },
  {
    id: 10,
    question:
      'Chủ nghĩa xã hội có duy trì chế độ tư hữu về tư liệu sản xuất chủ yếu không?',
    correctAnswer: 'NO',
  },
  {
    id: 11,
    question:
      'Giai cấp công nhân có thể tự giải phóng triệt để nếu thiếu Đảng lãnh đạo không?',
    correctAnswer: 'NO',
  },
  {
    id: 12,
    question:
      'Tôn giáo có bị cấm hoàn toàn trong thời kỳ quá độ lên chủ nghĩa xã hội không?',
    correctAnswer: 'NO',
  },
  {
    id: 13,
    question:
      'Quá độ lên chủ nghĩa xã hội có thể bỏ qua việc phát triển lực lượng sản xuất không?',
    correctAnswer: 'NO',
  },
  {
    id: 14,
    question:
      'Nhà nước pháp quyền XHCN có phải chỉ bảo vệ quyền lợi của riêng giai cấp công nhân không?',
    correctAnswer: 'NO',
  },
];

// 2. Light Nodes
const lightNodes = [
  { id: 'red', label: 'Đỏ', color: '#ff4444' },
  { id: 'yellow', label: 'Vàng', color: '#ffff44' },
  { id: 'green', label: 'Xanh Lá', color: '#44ff44' },
  { id: 'blue', label: 'Xanh Dương', color: '#4477ff' },
  { id: 'purple', label: 'Tím', color: '#aa44ff' },
  { id: 'orange', label: 'Cam', color: '#ff8844' },
  { id: 'cyan', label: 'Lục Lam', color: '#44ffff' },
  { id: 'pink', label: 'Hồng', color: '#ff44aa' },
];

// 3. Wires Configuration
const correctWires = [
  { from: 'orange', to: 'pink' },
  { from: 'pink', to: 'blue' },
  { from: 'blue', to: 'green' },
  { from: 'green', to: 'yellow' },
];

const allWirePairs = [
  { from: 'red', to: 'yellow' },
  { from: 'yellow', to: 'green' },
  { from: 'green', to: 'blue' },
  { from: 'blue', to: 'purple' },
  { from: 'purple', to: 'orange' },
  { from: 'orange', to: 'cyan' },
  { from: 'cyan', to: 'pink' },
  { from: 'pink', to: 'red' },
  { from: 'red', to: 'green' },
  { from: 'blue', to: 'pink' },
  { from: 'pink', to: 'orange' },
  { from: 'red', to: 'purple' },
];

// 4. Game 1 Phrases
const game1Phrases = [
  'DAN GIAU NUOC MANH',
  'SU MENH LICH SU GIAI CAP CONG NHAN',
  'LAM THEO NANG LUC HUONG THEO LAO DONG',
  'THOI KY QUA DO LEN CHU NGHIA XA HOI',
  'LIEN MINH GIAI CAP',
  'NHA NUOC PHAP QUYEN',
  'QUYEN LUC NHAN DAN',
  'CACH MANG XA HOI',
  'LIEN MINH CONG NONG TRI THUC',
  'VAT CHAT QUYET DINH Y THUC',
  'THUC TIEN LA TIEU CHUAN CHAN LY',
  'CACH MANG XA HOI CHU NGHIA',
];

// 5. Game 3 Config
const game3Phrase = 'DANG CONG SAN VIET NAM MUON NAM';
const game3Words = ['DANG', 'CONG', 'SAN', 'VIET', 'NAM', 'MUON', 'NAM'];
const game3Distractors = ['NHAN', 'TOC', 'CHU'];
const MORSE_CODE = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  0: '-----',
  1: '.----',
  2: '..---',
  3: '...--',
  4: '....-',
  5: '.....',
  6: '-....',
  7: '--...',
  8: '---..',
  9: '----.',
};

// 6. Global Settings
const INITIAL_TIME = 20;
const TIME_PENALTY = 30;
const SCORE_TIME_MULTIPLIER = 10;
const SCORE_WRONG_PENALTY = 5;

// ======================================
// STATE MANAGEMENT
// ======================================
let rooms = {}; // Game 2
let game1Rooms = {}; // Game 1
let game3Rooms = {}; // Game 3
let gameSessions = {}; // Cross-game scoring
const lobbyRooms = {}; // Lobby

// ======================================
// HELPER FUNCTIONS (Optimized)
// ======================================

// Fisher-Yates Shuffle
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Logic to check correct wire
function isCorrectWire(from, to) {
  return correctWires.some(
    (w) => (w.from === from && w.to === to) || (w.from === to && w.to === from)
  );
}

// Core Logic: Assign randomized questions to wires
function assignQuestionsToWires() {
  // Shuffle questions separately to ensure randomness every reset
  const yesQuestions = shuffleArray(
    questions.filter((q) => q.correctAnswer === 'YES')
  );
  const noQuestions = shuffleArray(
    questions.filter((q) => q.correctAnswer === 'NO')
  );

  let yesIndex = 0;
  let noIndex = 0;

  return allWirePairs.map((wire, index) => {
    const needsYes = isCorrectWire(wire.from, wire.to);
    let question;

    if (needsYes) {
      question = yesQuestions[yesIndex % yesQuestions.length];
      yesIndex++;
    } else {
      question = noQuestions[noIndex % noQuestions.length];
      noIndex++;
    }

    return {
      wireIndex: index,
      from: wire.from,
      to: wire.to,
      question: question.question,
      questionId: question.id,
      correctAnswer: question.correctAnswer,
      isCorrectWire: needsYes,
    };
  });
}

function textToMorse(text) {
  const result = [];
  const words = text.toUpperCase().split(' ');
  words.forEach((word, wordIndex) => {
    for (const char of word) {
      if (MORSE_CODE[char]) {
        result.push({ char, morse: MORSE_CODE[char], type: 'letter' });
      }
    }
    if (wordIndex < words.length - 1) {
      result.push({ char: ' ', morse: '', type: 'space' });
    }
  });
  return result;
}

// ======================================
// SOCKET SERVER
// ======================================

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // ------------------------------------
  // GLOBAL RESTART EVENT
  // ------------------------------------
  socket.on('restart-all-games', ({ roomId }) => {
    console.log(`[Restart] Room ${roomId} - Restarting all games`);

    // Clear all game rooms for this roomId
    if (game1Rooms[roomId]) {
      const randomPhrase =
        game1Phrases[Math.floor(Math.random() * game1Phrases.length)];
      game1Rooms[roomId] = {
        players: game1Rooms[roomId].players,
        playerNames: game1Rooms[roomId].playerNames,
        phrase: randomPhrase,
        attempts: 0,
        startTime: Date.now(),
        timeRemaining: INITIAL_TIME,
        gameOver: false,
      };
    }
    if (rooms[roomId]) delete rooms[roomId];
    if (game3Rooms[roomId]) delete game3Rooms[roomId];
    if (gameSessions[roomId]) delete gameSessions[roomId];

    // Notify all players in all game rooms to restart
    io.to(`game1-${roomId}`).emit('global-restart', { roomId });
    io.to(roomId).emit('global-restart', { roomId }); // game2 uses roomId directly
    io.to(`game3-${roomId}`).emit('global-restart', { roomId });

    console.log(`[Restart] Room ${roomId} - All games reset, players notified`);
  });

  // ------------------------------------
  // LOBBY EVENTS
  // ------------------------------------
  socket.on('create-lobby', ({ roomId, playerName }) => {
    socket.join(`lobby-${roomId}`);
    lobbyRooms[roomId] = {
      owner: socket.id,
      players: { A: { id: socket.id, name: playerName }, B: null },
    };
    console.log(`[Lobby] Room ${roomId} created by ${playerName}`);
    socket.emit('lobby-update', {
      roomId,
      players: lobbyRooms[roomId].players,
      isOwner: true,
      myRole: 'A',
    });
  });

  socket.on('join-lobby', ({ roomId, playerName }) => {
    const room = lobbyRooms[roomId];
    if (!room)
      return socket.emit('lobby-error', { message: 'Phòng không tồn tại!' });
    if (room.players.B)
      return socket.emit('lobby-error', { message: 'Phòng đã đầy!' });

    socket.join(`lobby-${roomId}`);
    room.players.B = { id: socket.id, name: playerName };
    console.log(`[Lobby] ${playerName} joined room ${roomId}`);

    socket.emit('lobby-update', {
      roomId,
      players: room.players,
      isOwner: false,
      myRole: 'B',
    });
    socket.to(`lobby-${roomId}`).emit('lobby-update', {
      roomId,
      players: room.players,
      isOwner: true,
      myRole: 'A',
    });
  });

  socket.on('swap-roles', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room || room.owner !== socket.id) return;
    const temp = room.players.A;
    room.players.A = room.players.B;
    room.players.B = temp;
    if (room.players.A) room.owner = room.players.A.id;
    io.to(`lobby-${roomId}`).emit('lobby-roles-swapped', {
      players: room.players,
    });
  });

  socket.on('leave-lobby', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room) return;
    socket.leave(`lobby-${roomId}`);
    if (room.players.A?.id === socket.id) {
      io.to(`lobby-${roomId}`).emit('lobby-closed', {
        message: 'Chủ phòng đã rời đi',
      });
      delete lobbyRooms[roomId];
    } else if (room.players.B?.id === socket.id) {
      room.players.B = null;
      socket.to(`lobby-${roomId}`).emit('lobby-update', {
        roomId,
        players: room.players,
        isOwner: true,
        myRole: 'A',
      });
    }
  });

  socket.on('start-game', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room || !room.players.A || !room.players.B) return;
    io.to(`lobby-${roomId}`).emit('game-started', {
      roomId,
      playerA: room.players.A.name,
      playerB: room.players.B.name,
    });
    delete lobbyRooms[roomId];
  });

  // ------------------------------------
  // GAME 2 EVENTS (WIRES) - Optimized
  // ------------------------------------
  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);

    // Initialize room if not exists
    if (!rooms[roomId]) {
      const questionAssignments = assignQuestionsToWires(); // Call Helper
      rooms[roomId] = {
        players: {},
        wireResults: [],
        timeRemaining: INITIAL_TIME,
        gameComplete: false,
        gameOver: false,
        currentWire: null,
        questionAssignments,
      };
    }
    rooms[roomId].players[role] = socket.id;

    // Payload for Player A (Questions Map)
    const allQuestions = rooms[roomId].questionAssignments.map((qa) => {
      const fromNode = lightNodes.find((n) => n.id === qa.from);
      const toNode = lightNodes.find((n) => n.id === qa.to);
      return {
        question: qa.question,
        questionId: qa.questionId,
        from: qa.from,
        to: qa.to,
        fromLabel: fromNode?.label || qa.from,
        toLabel: toNode?.label || qa.to,
        fromColor: fromNode?.color,
        toColor: toNode?.color,
      };
    });

    socket.emit('game-init', {
      lightNodes,
      allWirePairs,
      role,
      wireResults: rooms[roomId].wireResults,
      timeRemaining: rooms[roomId].timeRemaining,
      requiredWireCount: correctWires.length,
      allQuestions: role === 'A' ? allQuestions : undefined,
    });
  });

  socket.on('select-wire', ({ roomId, from, to }) => {
    const room = rooms[roomId];
    if (!room || room.gameComplete || room.gameOver) return;

    const wireIndex = room.questionAssignments.findIndex(
      (qa) =>
        (qa.from === from && qa.to === to) || (qa.from === to && qa.to === from)
    );

    const alreadyAsked = room.wireResults.find(
      (r) =>
        (r.from === from && r.to === to) || (r.from === to && r.to === from)
    );

    if (alreadyAsked) {
      return socket.emit('wire-already-asked', {
        from,
        to,
        result: alreadyAsked,
      });
    }

    const qa = room.questionAssignments[wireIndex];
    const fromNode = lightNodes.find((n) => n.id === from);
    const toNode = lightNodes.find((n) => n.id === to);

    room.currentWire = {
      from,
      to,
      fromLabel: fromNode?.label || from,
      toLabel: toNode?.label || to,
      fromColor: fromNode?.color,
      toColor: toNode?.color,
      questionId: qa.questionId,
      wireIndex,
    };

    socket.emit('wire-pending', {
      wire: room.currentWire,
      message: 'Đang chờ Player A trả lời...',
    });
    io.to(roomId).emit('wire-question', {
      wire: room.currentWire,
      question: qa.question,
      forPlayerA: true,
      wireIndex: room.currentWire.wireIndex,
    });
  });

  socket.on('player-a-answer', ({ roomId, wireIndex, answer }) => {
    const room = rooms[roomId];
    if (!room) return;
    const shouldConnect = answer === 'YES';
    const existingIndex = room.wireResults.findIndex(
      (r) => r.wireIndex === wireIndex
    );

    if (existingIndex >= 0) {
      room.wireResults[existingIndex].playerAAnswer = answer;
      room.wireResults[existingIndex].shouldConnect = shouldConnect;
    } else {
      const qa = room.questionAssignments[wireIndex];
      if (!qa) return;
      const fromNode = lightNodes.find((n) => n.id === qa.from);
      const toNode = lightNodes.find((n) => n.id === qa.to);
      room.wireResults.push({
        from: qa.from,
        to: qa.to,
        fromLabel: fromNode?.label || qa.from,
        toLabel: toNode?.label || qa.to,
        fromColor: fromNode?.color,
        toColor: toNode?.color,
        playerAAnswer: answer,
        shouldConnect,
        wireIndex,
      });
    }
    io.to(roomId).emit('answer-updated', {
      wireIndex,
      shouldConnect,
      totalResults: room.wireResults,
    });
  });

  socket.on('submit-connections', ({ roomId, connections }) => {
    const room = rooms[roomId];
    if (!room || room.gameComplete || room.gameOver) return;

    const normalizeWire = (from, to) => [from, to].sort().join('-');
    const playerBConns = connections.map((c) => normalizeWire(c.from, c.to));
    const requiredConns = correctWires.map((c) => normalizeWire(c.from, c.to));

    const isCorrect =
      requiredConns.every((c) => playerBConns.includes(c)) &&
      playerBConns.every((c) => requiredConns.includes(c)) &&
      playerBConns.length === requiredConns.length;

    if (isCorrect) {
      room.gameComplete = true;
      io.to(roomId).emit('level-complete', {
        message: 'Chúc mừng! Cả hai đã hoàn thành game 2!',
        nextLevel: 2,
      });
    } else {
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);
      if (gameSessions[roomId]) gameSessions[roomId].totalWrongAttempts++;

      socket.emit('check-failed', {
        message: 'Chưa đúng! Kiểm tra lại các dây nối.',
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
        expected: requiredConns.length,
        got: playerBConns.length,
      });
      io.to(roomId).emit('time-update', { timeRemaining: room.timeRemaining });

      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian! Quay lại Game 1...',
          redirectToGame1: true,
        });
        delete gameSessions[roomId];
      }
    }
  });

  socket.on('sync-timer', ({ roomId, timeRemaining }) => {
    const room = rooms[roomId];
    if (room && !room.gameComplete && !room.gameOver) {
      room.timeRemaining = timeRemaining;
      io.to(roomId).emit('time-update', { timeRemaining });
      if (timeRemaining <= 0) {
        room.gameOver = true;
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian!',
          redirectToGame1: true,
        });
        delete gameSessions[roomId];
      }
    }
  });

  socket.on('reset-game', ({ roomId }) => {
    if (rooms[roomId]) {
      const questionAssignments = assignQuestionsToWires(); // Re-shuffle via Helper

      rooms[roomId].wireResults = [];
      rooms[roomId].timeRemaining = INITIAL_TIME;
      rooms[roomId].gameComplete = false;
      rooms[roomId].gameOver = false;
      rooms[roomId].currentWire = null;
      rooms[roomId].questionAssignments = questionAssignments;

      const allQuestions = questionAssignments.map((qa) => {
        const fromNode = lightNodes.find((n) => n.id === qa.from);
        const toNode = lightNodes.find((n) => n.id === qa.to);
        return {
          question: qa.question,
          questionId: qa.questionId,
          from: qa.from,
          to: qa.to,
          fromLabel: fromNode?.label || qa.from,
          toLabel: toNode?.label || qa.to,
          fromColor: fromNode?.color,
          toColor: toNode?.color,
        };
      });

      io.to(roomId).emit('game-reset', {
        lightNodes,
        allWirePairs,
        timeRemaining: INITIAL_TIME,
        requiredWireCount: correctWires.length,
        allQuestions,
      });
    }
  });

  // ------------------------------------
  // GAME 1 EVENTS
  // ------------------------------------
  socket.on('join-game1', ({ roomId, role, playerName }) => {
    socket.join(`game1-${roomId}`);
    if (!game1Rooms[roomId]) {
      const randomPhrase =
        game1Phrases[Math.floor(Math.random() * game1Phrases.length)];
      game1Rooms[roomId] = {
        players: {},
        playerNames: {},
        phrase: randomPhrase,
        attempts: 0,
        startTime: Date.now(),
        timeRemaining: INITIAL_TIME,
        gameOver: false,
      };
      gameSessions[roomId] = {
        totalWrongAttempts: 0,
        startTime: Date.now(),
        playerNames: {},
      };
      console.log(`[Game1] Room ${roomId} created: "${randomPhrase}"`);
    }

    const room = game1Rooms[roomId];
    room.playerNames[role] = playerName || `Player ${role}`;
    room.players[role] = socket.id;

    if (role === 'A') socket.emit('game1-phrase', { phrase: room.phrase });

    io.to(`game1-${roomId}`).emit('game1-player-joined', {
      role,
      playerName: room.playerNames[role],
      playerNames: room.playerNames,
      timeRemaining: room.timeRemaining,
    });
  });

  socket.on('submit-game1-answer', ({ roomId, answer }) => {
    const room = game1Rooms[roomId];
    if (!room || room.gameOver) return;

    room.attempts++;
    if (gameSessions[roomId]) gameSessions[roomId].totalWrongAttempts++;

    const normalizedAnswer = answer.toUpperCase().trim();
    const normalizedPhrase = room.phrase.toUpperCase().trim();

    if (normalizedAnswer === normalizedPhrase) {
      if (gameSessions[roomId]) gameSessions[roomId].totalWrongAttempts--; // Revert penalty for correct
      io.to(`game1-${roomId}`).emit('game1-complete', {
        message: 'Chính xác! Sang Game 2...',
        answer: normalizedAnswer,
      });
    } else {
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);
      socket.emit('game1-wrong-answer', {
        message: `Sai rồi! -${TIME_PENALTY}s (Thử: ${room.attempts})`,
        attempts: room.attempts,
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
      });
      io.to(`game1-${roomId}`).emit('game1-timer-update', {
        timeRemaining: room.timeRemaining,
      });
      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(`game1-${roomId}`).emit('game1-game-over', {
          message: 'Hết thời gian!',
          redirectToGame1: true,
        });
        delete gameSessions[roomId];
      }
    }
  });

  socket.on('game1-sync-timer', ({ roomId, timeRemaining }) => {
    const room = game1Rooms[roomId];
    if (room) {
      room.timeRemaining = timeRemaining;
      socket
        .to(`game1-${roomId}`)
        .emit('game1-timer-update', { timeRemaining });
    }
  });

  socket.on('reset-game1', ({ roomId }) => {
    if (game1Rooms[roomId]) {
      game1Rooms[roomId].attempts = 0;
      game1Rooms[roomId].phrase =
        game1Phrases[Math.floor(Math.random() * game1Phrases.length)];
      io.to(`game1-${roomId}`).emit('game1-reset', {
        phraseLength: game1Rooms[roomId].phrase.length,
      });
    }
  });

  // ------------------------------------
  // GAME 3 EVENTS
  // ------------------------------------

  // Helper: Generate word cards with morse codes
  function generateWordCards() {
    const correctCards = game3Words.map((word, index) => ({
      id: `card-${index}`,
      word: word,
      morseSequence: textToMorse(word),
      isDistractor: false,
    }));

    const distractorCards = game3Distractors.map((word, index) => ({
      id: `distractor-${index}`,
      word: word,
      morseSequence: textToMorse(word),
      isDistractor: true,
    }));

    return shuffleArray([...correctCards, ...distractorCards]);
  }

  socket.on('join-game3', ({ roomId, role }) => {
    socket.join(`game3-${roomId}`);
    if (!game3Rooms[roomId]) {
      game3Rooms[roomId] = {
        players: {},
        phrase: game3Phrase,
        correctWords: game3Words,
        wordCards: generateWordCards(),
        attempts: 0,
        timeRemaining: INITIAL_TIME,
        gameOver: false,
      };
    }
    game3Rooms[roomId].players[role] = socket.id;

    if (role === 'A') {
      socket.emit('game3-phrase-for-a', {
        phrase: game3Rooms[roomId].phrase,
        correctWords: game3Rooms[roomId].correctWords,
        message: 'Hướng dẫn Player B giải mã các thẻ từ!',
      });
    }
    if (role === 'B') {
      socket.emit('game3-word-cards', {
        wordCards: game3Rooms[roomId].wordCards,
        totalSlots: game3Words.length,
      });
    }
    io.to(`game3-${roomId}`).emit('game3-player-joined', { role });
  });

  socket.on('submit-game3-answer', ({ roomId, orderedWords }) => {
    const room = game3Rooms[roomId];
    if (!room || room.gameOver) return;

    room.attempts++;
    if (gameSessions[roomId]) gameSessions[roomId].totalWrongAttempts++;

    // Check if submitted words match the correct order
    const isCorrect =
      orderedWords.length === room.correctWords.length &&
      orderedWords.every(
        (word, index) =>
          word.toUpperCase() === room.correctWords[index].toUpperCase()
      );

    if (isCorrect) {
      if (gameSessions[roomId]) gameSessions[roomId].totalWrongAttempts--;
      const session = gameSessions[roomId];
      const finalScore = session
        ? Math.max(
            0,
            room.timeRemaining * SCORE_TIME_MULTIPLIER -
              session.totalWrongAttempts * SCORE_WRONG_PENALTY
          )
        : room.timeRemaining * SCORE_TIME_MULTIPLIER;

      io.to(`game3-${roomId}`).emit('game3-complete', {
        message: 'HOÀN THÀNH TẤT CẢ!',
        answer: orderedWords.join(' '),
        score: finalScore,
        timeRemaining: room.timeRemaining,
        totalWrongAttempts: session?.totalWrongAttempts || 0,
      });
      delete gameSessions[roomId];
    } else {
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);
      socket.emit('game3-wrong-answer', {
        message: `Sai thứ tự! -${TIME_PENALTY}s`,
        attempts: room.attempts,
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
      });
      io.to(`game3-${roomId}`).emit('game3-timer-update', {
        timeRemaining: room.timeRemaining,
      });
      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(`game3-${roomId}`).emit('game3-game-over', {
          message: 'Hết thời gian!',
          redirectToGame1: true,
        });
        delete gameSessions[roomId];
      }
    }
  });

  socket.on('reset-game3', ({ roomId }) => {
    if (game3Rooms[roomId]) {
      game3Rooms[roomId].attempts = 0;
      game3Rooms[roomId].wordCards = generateWordCards();
      io.to(`game3-${roomId}`).emit('game3-reset', {
        wordCards: game3Rooms[roomId].wordCards,
      });
    }
  });

  // ------------------------------------
  // CLEANUP
  // ------------------------------------
  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
    const cleanupRoom = (roomList, type) => {
      for (const roomId in roomList) {
        const room = roomList[roomId];
        for (const role in room.players) {
          if (room.players[role] === socket.id) {
            delete room.players[role];
            if (Object.keys(room.players).length === 0) {
              delete roomList[roomId];
              console.log(`[${type}] Room ${roomId} deleted`);
            } else {
              io.to(
                type === 'lobby'
                  ? `lobby-${roomId}`
                  : type === 'Game2'
                    ? roomId
                    : `${type.toLowerCase()}-${roomId}`
              ).emit(
                type === 'lobby'
                  ? 'lobby-update'
                  : type === 'Game1'
                    ? 'game1-player-disconnected'
                    : 'player-disconnected',
                type === 'lobby'
                  ? {
                      roomId,
                      players: room.players,
                      isOwner: true,
                      myRole: 'A',
                    }
                  : { role }
              );
            }
            return;
          }
        }
      }
    };
    cleanupRoom(lobbyRooms, 'lobby');
    cleanupRoom(rooms, 'Game2');
    cleanupRoom(game1Rooms, 'Game1');
    cleanupRoom(game3Rooms, 'Game3');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () =>
  console.log(`Socket server running on http://localhost:${PORT}`)
);
