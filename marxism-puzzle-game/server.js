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

// Philosophy questions database
const questions = [
  {
    id: 1,
    question: 'Hiện tượng có phản ánh bản chất không?',
    correctAnswer: 'YES',
  },
  {
    id: 2,
    question: 'Vật chất có quyết định ý thức không?',
    correctAnswer: 'YES',
  },
  {
    id: 3,
    question: 'Ý thức có thể tồn tại độc lập với vật chất không?',
    correctAnswer: 'NO',
  },
  {
    id: 4,
    question: 'Mâu thuẫn có phải động lực của sự phát triển không?',
    correctAnswer: 'YES',
  },
  {
    id: 5,
    question: 'Lượng đổi có dẫn đến chất đổi không?',
    correctAnswer: 'YES',
  },
  {
    id: 6,
    question: 'Phủ định biện chứng có giữ lại yếu tố tích cực không?',
    correctAnswer: 'YES',
  },
  {
    id: 7,
    question: 'Thực tiễn có phải tiêu chuẩn của chân lý không?',
    correctAnswer: 'YES',
  },
  {
    id: 8,
    question: 'Tồn tại xã hội có quyết định ý thức xã hội không?',
    correctAnswer: 'YES',
  },
  {
    id: 9,
    question: 'Quy luật tự nhiên có thể bị con người thay đổi không?',
    correctAnswer: 'NO',
  },
  {
    id: 10,
    question: 'Nhận thức cảm tính có phải giai đoạn đầu của nhận thức không?',
    correctAnswer: 'YES',
  },
  {
    id: 11,
    question: 'Biện chứng có phải là phương pháp tư duy khoa học không?',
    correctAnswer: 'YES',
  },
  {
    id: 12,
    question: 'Siêu hình học có thể giải thích được sự phát triển không?',
    correctAnswer: 'NO',
  },
];

// Light node definitions (matching both players)
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

// THE CORRECT WIRES (4 wires that Player B must connect)
// You can customize these!
const correctWires = [
  { from: 'orange', to: 'pink' }, // Cam - Hồng
  { from: 'pink', to: 'blue' }, // Hồng - Xanh Dương
  { from: 'blue', to: 'green' }, // Xanh Dương - Xanh Lá
  { from: 'green', to: 'yellow' }, // Xanh Lá - Vàng
];

// All possible wire pairs for the physical board (includes fake ones)
const allWirePairs = [
  { from: 'red', to: 'yellow' },
  { from: 'yellow', to: 'green' },
  { from: 'green', to: 'blue' },
  { from: 'blue', to: 'purple' },
  { from: 'purple', to: 'orange' },
  { from: 'orange', to: 'cyan' },
  { from: 'cyan', to: 'pink' },
  { from: 'pink', to: 'red' },
  { from: 'orange', to: 'pink' },
  { from: 'pink', to: 'blue' },
  { from: 'red', to: 'green' },
  { from: 'yellow', to: 'purple' },
];

// Room state management
let rooms = {};

// Game 1 (Freemason Cipher) room state
let game1Rooms = {};
// Từ vựng liên quan đến Chủ nghĩa xã hội khoa học
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

// ======================================
// GAME 3: MORSE CODE CONFIG
// ======================================
let game3Rooms = {};
const game3Phrase = 'DANG CONG SAN VIET NAM MUON NAM';

// ======================================
// GAME SESSION: Track progress across all games
// ======================================
// Structure: { roomId: { totalWrongAttempts: 0, startTime: Date, playerNames: {} } }
let gameSessions = {};

// Score calculation constants
const SCORE_TIME_MULTIPLIER = 10; // Points per second remaining
const SCORE_WRONG_PENALTY = 5; // Points lost per wrong attempt

// Morse code mapping
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

// Convert text to Morse code sequence
// Returns array of { char, morse, type: 'letter' | 'space' }
function textToMorse(text) {
  const result = [];
  const words = text.toUpperCase().split(' ');

  words.forEach((word, wordIndex) => {
    for (const char of word) {
      if (MORSE_CODE[char]) {
        result.push({
          char,
          morse: MORSE_CODE[char],
          type: 'letter',
        });
      }
    }
    // Add word separator after each word except last
    if (wordIndex < words.length - 1) {
      result.push({
        char: ' ',
        morse: '',
        type: 'space',
      });
    }
  });

  return result;
}

// Initial time in seconds (e.g., 5 minutes = 300 seconds)
const INITIAL_TIME = 300;
// Time penalty for wrong submission (in seconds)
const TIME_PENALTY = 30;

function isCorrectWire(from, to) {
  return correctWires.some(
    (w) => (w.from === from && w.to === to) || (w.from === to && w.to === from)
  );
}

function getRandomQuestion(usedQuestionIds) {
  const availableQuestions = questions.filter(
    (q) => !usedQuestionIds.includes(q.id)
  );
  if (availableQuestions.length === 0) {
    // Reset if all questions used
    return questions[Math.floor(Math.random() * questions.length)];
  }
  return availableQuestions[
    Math.floor(Math.random() * availableQuestions.length)
  ];
}

// ======================================
// LOBBY: Real-time Room Management
// ======================================
const lobbyRooms = {};
// Structure: { roomId: { owner: socketId, players: { A: {id, name}, B: {id, name} } } }

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // ======================================
  // LOBBY EVENTS
  // ======================================

  // Create a new lobby room (creator is automatically Player A)
  socket.on('create-lobby', ({ roomId, playerName }) => {
    socket.join(`lobby-${roomId}`);

    lobbyRooms[roomId] = {
      owner: socket.id,
      players: {
        A: { id: socket.id, name: playerName },
        B: null,
      },
    };

    console.log(`[Lobby] Room ${roomId} created by ${playerName}`);

    // Send update to creator
    socket.emit('lobby-update', {
      roomId,
      players: lobbyRooms[roomId].players,
      isOwner: true,
      myRole: 'A',
    });
  });

  // Join an existing lobby room (joiner is automatically Player B)
  socket.on('join-lobby', ({ roomId, playerName }) => {
    const room = lobbyRooms[roomId];

    if (!room) {
      socket.emit('lobby-error', { message: 'Phòng không tồn tại!' });
      return;
    }

    if (room.players.B) {
      socket.emit('lobby-error', { message: 'Phòng đã đầy!' });
      return;
    }

    socket.join(`lobby-${roomId}`);
    room.players.B = { id: socket.id, name: playerName };

    console.log(`[Lobby] ${playerName} joined room ${roomId}`);

    // Send update to joiner
    socket.emit('lobby-update', {
      roomId,
      players: room.players,
      isOwner: false,
      myRole: 'B',
    });

    // Broadcast to room owner
    socket.to(`lobby-${roomId}`).emit('lobby-update', {
      roomId,
      players: room.players,
      isOwner: true,
      myRole: 'A',
    });
  });

  // Swap roles (only owner can do this)
  socket.on('swap-roles', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room || room.owner !== socket.id) return;

    // Swap A and B
    const temp = room.players.A;
    room.players.A = room.players.B;
    room.players.B = temp;

    // Update owner to new Player A
    if (room.players.A) {
      room.owner = room.players.A.id;
    }

    console.log(`[Lobby] Roles swapped in room ${roomId}`);

    // Broadcast new state to all
    io.to(`lobby-${roomId}`).emit('lobby-roles-swapped', {
      players: room.players,
    });
  });

  // Leave lobby
  socket.on('leave-lobby', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room) return;

    socket.leave(`lobby-${roomId}`);

    // Remove player from room
    if (room.players.A?.id === socket.id) {
      // Owner left - close room
      io.to(`lobby-${roomId}`).emit('lobby-closed', {
        message: 'Chủ phòng đã rời đi',
      });
      delete lobbyRooms[roomId];
    } else if (room.players.B?.id === socket.id) {
      room.players.B = null;
      // Notify owner
      socket.to(`lobby-${roomId}`).emit('lobby-update', {
        roomId,
        players: room.players,
        isOwner: true,
        myRole: 'A',
      });
    }
  });

  // Start game (both players must be ready)
  socket.on('start-game', ({ roomId }) => {
    const room = lobbyRooms[roomId];
    if (!room || !room.players.A || !room.players.B) return;

    console.log(`[Lobby] Game starting in room ${roomId}`);

    // Emit to both players to navigate
    io.to(`lobby-${roomId}`).emit('game-started', {
      roomId,
      playerA: room.players.A.name,
      playerB: room.players.B.name,
    });

    // Clean up lobby room
    delete lobbyRooms[roomId];
  });

  // Handle disconnect for lobby
  socket.on('disconnect', () => {
    // Check if user was in any lobby
    for (const roomId in lobbyRooms) {
      const room = lobbyRooms[roomId];
      if (room.players.A?.id === socket.id) {
        io.to(`lobby-${roomId}`).emit('lobby-closed', {
          message: 'Chủ phòng đã mất kết nối',
        });
        delete lobbyRooms[roomId];
      } else if (room.players.B?.id === socket.id) {
        room.players.B = null;
        io.to(`lobby-${roomId}`).emit('lobby-update', {
          roomId,
          players: room.players,
          isOwner: true,
          myRole: 'A',
        });
      }
    }
  });

  // Join room
  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: {},
        wireResults: [], // Store answered wires with results
        usedQuestionIds: [],
        timeRemaining: INITIAL_TIME,
        gameComplete: false,
        gameOver: false, // Track if time ran out
        currentWire: null, // Wire being questioned
      };
    }
    rooms[roomId].players[role] = socket.id;

    // Send initial game state
    socket.emit('game-init', {
      lightNodes,
      allWirePairs,
      role,
      wireResults: rooms[roomId].wireResults,
      timeRemaining: rooms[roomId].timeRemaining,
      requiredWireCount: correctWires.length,
    });

    console.log(`${role} joined room ${roomId}`);
  });

  // Player B selects a wire pair to ask about
  socket.on('select-wire', ({ roomId, from, to }) => {
    const room = rooms[roomId];
    if (!room || room.gameComplete || room.gameOver) return;

    // Check if this wire was already asked
    const alreadyAsked = room.wireResults.find(
      (r) =>
        (r.from === from && r.to === to) || (r.from === to && r.to === from)
    );

    if (alreadyAsked) {
      socket.emit('wire-already-asked', {
        from,
        to,
        result: alreadyAsked,
      });
      return;
    }

    // Get question for Player A
    const question = getRandomQuestion(room.usedQuestionIds);
    room.usedQuestionIds.push(question.id);

    const fromNode = lightNodes.find((n) => n.id === from);
    const toNode = lightNodes.find((n) => n.id === to);

    room.currentWire = {
      from,
      to,
      fromLabel: fromNode?.label || from,
      toLabel: toNode?.label || to,
      fromColor: fromNode?.color,
      toColor: toNode?.color,
      questionId: question.id,
    };

    // Notify Player B that wire is being processed
    socket.emit('wire-pending', {
      wire: room.currentWire,
      message: 'Đang chờ Player A trả lời...',
    });

    // Send question to Player A
    io.to(roomId).emit('wire-question', {
      wire: room.currentWire,
      question: question.question,
      forPlayerA: true,
    });

    console.log(`Wire selected: ${fromNode?.label} → ${toNode?.label}`);
  });

  // Player A answers the question
  socket.on('answer-question', ({ roomId, answer }) => {
    const room = rooms[roomId];
    if (!room || !room.currentWire) return;

    const wire = room.currentWire;

    // Player A's answer directly tells B whether to connect or not
    // YES = B should connect this wire
    // NO = B should NOT connect this wire
    const shouldConnect = answer === 'YES';

    const result = {
      from: wire.from,
      to: wire.to,
      fromLabel: wire.fromLabel,
      toLabel: wire.toLabel,
      fromColor: wire.fromColor,
      toColor: wire.toColor,
      playerAAnswer: answer,
      shouldConnect: shouldConnect, // What A told B to do
    };

    room.wireResults.push(result);
    room.currentWire = null;

    // Notify both players
    io.to(roomId).emit('wire-result', {
      result,
      totalResults: room.wireResults,
    });

    console.log(
      `Answer: ${wire.fromLabel} → ${wire.toLabel} = ${answer} (${shouldConnect ? 'NỐI' : 'KHÔNG NỐI'})`
    );
  });

  // Player A updates an existing answer
  socket.on('update-answer', ({ roomId, wireIndex, newAnswer }) => {
    const room = rooms[roomId];
    if (!room || wireIndex < 0 || wireIndex >= room.wireResults.length) return;

    const shouldConnect = newAnswer === 'YES';
    room.wireResults[wireIndex].playerAAnswer = newAnswer;
    room.wireResults[wireIndex].shouldConnect = shouldConnect;

    // Notify both players of the update
    io.to(roomId).emit('answer-updated', {
      wireIndex,
      newAnswer,
      shouldConnect,
      totalResults: room.wireResults,
    });

    const wire = room.wireResults[wireIndex];
    console.log(
      `Answer UPDATED: ${wire.fromLabel} → ${wire.toLabel} = ${newAnswer} (${shouldConnect ? 'NỐI' : 'KHÔNG NỐI'})`
    );
  });

  // Player B submits their connections
  socket.on('submit-connections', ({ roomId, connections }) => {
    const room = rooms[roomId];
    if (!room || room.gameComplete || room.gameOver) return;

    // Normalize connections for comparison
    const normalizeWire = (from, to) => {
      const sorted = [from, to].sort();
      return `${sorted[0]}-${sorted[1]}`;
    };

    const playerBConns = connections.map((c) => normalizeWire(c.from, c.to));
    const requiredConns = correctWires.map((c) => normalizeWire(c.from, c.to));

    // Check if B connected exactly the required wires
    const hasAllRequired = requiredConns.every((c) => playerBConns.includes(c));
    const hasOnlyRequired = playerBConns.every((c) =>
      requiredConns.includes(c)
    );
    const isCorrect =
      hasAllRequired &&
      hasOnlyRequired &&
      playerBConns.length === requiredConns.length;

    if (isCorrect) {
      room.gameComplete = true;
      io.to(roomId).emit('level-complete', {
        message: 'Chúc mừng! Cả hai đã hoàn thành game 2!',
        nextLevel: 2,
      });
    } else {
      // Wrong submission - time penalty
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);

      // Track wrong attempts
      if (gameSessions[roomId]) {
        gameSessions[roomId].totalWrongAttempts++;
      }

      socket.emit('check-failed', {
        message: 'Chưa đúng! Kiểm tra lại các dây nối.',
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
        expected: requiredConns.length,
        got: playerBConns.length,
      });

      io.to(roomId).emit('time-update', {
        timeRemaining: room.timeRemaining,
      });

      // Check if time ran out
      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian! Quay lại Game 1...',
          redirectToGame1: true,
        });
        // Clean up session
        delete gameSessions[roomId];
      }
    }
  });

  // Sync timer (called periodically by frontend)
  socket.on('sync-timer', ({ roomId, timeRemaining }) => {
    const room = rooms[roomId];
    if (room && !room.gameComplete && !room.gameOver) {
      room.timeRemaining = timeRemaining;
      if (timeRemaining <= 0) {
        room.gameOver = true;
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian! Quay lại Game 1...',
          redirectToGame1: true,
        });
        // Clean up session
        delete gameSessions[roomId];
      }
    }
  });

  // Reset game
  socket.on('reset-game', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].wireResults = [];
      rooms[roomId].usedQuestionIds = [];
      rooms[roomId].timeRemaining = INITIAL_TIME;
      rooms[roomId].gameComplete = false;
      rooms[roomId].gameOver = false;
      rooms[roomId].currentWire = null;

      io.to(roomId).emit('game-reset', {
        lightNodes,
        allWirePairs,
        timeRemaining: INITIAL_TIME,
        requiredWireCount: correctWires.length,
      });
    }
  });

  // ======================================
  // GAME 1: FREEMASON CIPHER
  // ======================================

  // Join Game 1
  socket.on('join-game1', ({ roomId, role, playerName }) => {
    socket.join(`game1-${roomId}`);

    // Nếu room chưa tồn tại - tạo phrase ngay lập tức
    if (!game1Rooms[roomId]) {
      const randomPhrase =
        game1Phrases[Math.floor(Math.random() * game1Phrases.length)];
      game1Rooms[roomId] = {
        players: {},
        playerNames: {},
        phrase: randomPhrase, // Phrase được tạo ngay khi room được khởi tạo
        attempts: 0,
        startTime: Date.now(),
        timeRemaining: INITIAL_TIME,
        gameOver: false,
      };

      // Initialize game session for tracking score across all games
      gameSessions[roomId] = {
        totalWrongAttempts: 0,
        startTime: Date.now(),
        playerNames: {},
      };

      console.log(
        `[Game1] Room ${roomId} created with phrase: "${randomPhrase}"`
      );
    }

    // Store player name
    game1Rooms[roomId].playerNames[role] =
      playerName || `Player ${role.toUpperCase()}`;

    game1Rooms[roomId].players[role] = socket.id;

    // Gửi phrase cho Player A (dù join trước hay sau)
    if (role === 'A') {
      socket.emit('game1-phrase', {
        phrase: game1Rooms[roomId].phrase,
      });
      console.log(
        `[Game1] Room ${roomId} - Player A (${playerName}) joined, phrase: "${game1Rooms[roomId].phrase}"`
      );
    }

    // Emit player info and sync to all players in room
    io.to(`game1-${roomId}`).emit('game1-player-joined', {
      role,
      playerName: game1Rooms[roomId].playerNames[role],
      playerNames: game1Rooms[roomId].playerNames,
      timeRemaining: game1Rooms[roomId].timeRemaining,
    });

    console.log(`[Game1] ${role} (${playerName}) joined room ${roomId}`);
  });

  // Sync timer for game1
  socket.on('game1-sync-timer', ({ roomId, timeRemaining }) => {
    const room = game1Rooms[roomId];
    if (room) {
      room.timeRemaining = timeRemaining;
      // Broadcast to other players
      socket
        .to(`game1-${roomId}`)
        .emit('game1-timer-update', { timeRemaining });
    }
  });

  // Player B submits answer
  socket.on('submit-game1-answer', ({ roomId, answer }) => {
    const room = game1Rooms[roomId];
    if (!room || room.gameOver) return;

    room.attempts++;

    // Track in game session
    if (gameSessions[roomId]) {
      gameSessions[roomId].totalWrongAttempts++;
    }

    // Normalize comparison (uppercase, trim)
    const normalizedAnswer = answer.toUpperCase().trim();
    const normalizedPhrase = room.phrase.toUpperCase().trim();

    if (normalizedAnswer === normalizedPhrase) {
      // Correct! Decrement the wrong attempt we added above
      if (gameSessions[roomId]) {
        gameSessions[roomId].totalWrongAttempts--;
      }

      // Notify both players to redirect to Game 2
      io.to(`game1-${roomId}`).emit('game1-complete', {
        message: 'Chính xác! Chuyển sang Game 2...',
        answer: normalizedAnswer,
      });
      console.log(
        `[Game1] Room ${roomId} completed! Answer: "${normalizedAnswer}"`
      );
    } else {
      // Wrong answer - time penalty
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);

      socket.emit('game1-wrong-answer', {
        message: `Sai rồi! -${TIME_PENALTY}s (Đã thử ${room.attempts} lần)`,
        attempts: room.attempts,
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
      });

      // Broadcast time update to all players
      io.to(`game1-${roomId}`).emit('game1-timer-update', {
        timeRemaining: room.timeRemaining,
      });

      // Check if time ran out
      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(`game1-${roomId}`).emit('game1-game-over', {
          message: 'Hết thời gian! Quay lại Game 1...',
          redirectToGame1: true,
        });
        // Clean up session on game over
        delete gameSessions[roomId];
      }

      console.log(
        `[Game1] Wrong answer in room ${roomId}: "${normalizedAnswer}" (expected: "${normalizedPhrase}") - Time: ${room.timeRemaining}s`
      );
    }
  });

  // Reset Game 1
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

  // ======================================
  // GAME 3: MORSE CODE
  // ======================================

  // Join Game 3
  socket.on('join-game3', ({ roomId, role }) => {
    socket.join(`game3-${roomId}`);

    if (!game3Rooms[roomId]) {
      game3Rooms[roomId] = {
        players: {},
        phrase: game3Phrase,
        morseSequence: textToMorse(game3Phrase),
        attempts: 0,
        timeRemaining: INITIAL_TIME,
        gameOver: false,
      };
    }

    game3Rooms[roomId].players[role] = socket.id;

    // Send phrase to Player A (as text) - A will help B via voice
    if (role === 'A') {
      socket.emit('game3-phrase-for-a', {
        phrase: game3Rooms[roomId].phrase,
        message: 'Hướng dẫn Player B giải mã Morse code!',
      });
    }

    // Send Morse sequence to Player B (Player B sees morse, not text)
    if (role === 'B') {
      socket.emit('game3-phrase', {
        morseSequence: game3Rooms[roomId].morseSequence,
        phraseLength: game3Rooms[roomId].phrase.replace(/\s/g, '').length,
      });
    }

    // Notify other players
    io.to(`game3-${roomId}`).emit('game3-player-joined', { role });

    console.log(`[Game3] ${role} joined room ${roomId}`);
  });

  // Player B submits answer
  socket.on('submit-game3-answer', ({ roomId, answer }) => {
    const room = game3Rooms[roomId];
    if (!room || room.gameOver) return;

    room.attempts++;

    // Track in game session (will decrement if correct)
    if (gameSessions[roomId]) {
      gameSessions[roomId].totalWrongAttempts++;
    }

    // Normalize: uppercase, trim, remove extra spaces
    const normalizedAnswer = answer.toUpperCase().trim().replace(/\s+/g, ' ');
    const normalizedPhrase = room.phrase.toUpperCase().trim();

    if (normalizedAnswer === normalizedPhrase) {
      // Correct! Decrement wrong attempt we added above
      if (gameSessions[roomId]) {
        gameSessions[roomId].totalWrongAttempts--;
      }

      // Calculate final score
      const session = gameSessions[roomId];
      const finalScore = session
        ? Math.max(
            0,
            room.timeRemaining * SCORE_TIME_MULTIPLIER -
              session.totalWrongAttempts * SCORE_WRONG_PENALTY
          )
        : room.timeRemaining * SCORE_TIME_MULTIPLIER;

      io.to(`game3-${roomId}`).emit('game3-complete', {
        message: 'Chính xác! Hoàn thành tất cả các game!',
        answer: normalizedAnswer,
        score: finalScore,
        timeRemaining: room.timeRemaining,
        totalWrongAttempts: session?.totalWrongAttempts || 0,
      });

      console.log(
        `[Game3] Room ${roomId} completed! Answer: "${normalizedAnswer}" - Score: ${finalScore}`
      );

      // Clean up session after successful completion
      delete gameSessions[roomId];
    } else {
      // Wrong answer - time penalty
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);

      socket.emit('game3-wrong-answer', {
        message: `Sai rồi! -${TIME_PENALTY}s (Đã thử ${room.attempts} lần)`,
        attempts: room.attempts,
        timePenalty: TIME_PENALTY,
        timeRemaining: room.timeRemaining,
      });

      // Broadcast time update to all players
      io.to(`game3-${roomId}`).emit('game3-timer-update', {
        timeRemaining: room.timeRemaining,
      });

      // Check if time ran out
      if (room.timeRemaining <= 0) {
        room.gameOver = true;
        io.to(`game3-${roomId}`).emit('game3-game-over', {
          message: 'Hết thời gian! Quay lại Game 1...',
          redirectToGame1: true,
        });
        // Clean up session
        delete gameSessions[roomId];
      }

      console.log(
        `[Game3] Wrong answer in room ${roomId}: "${normalizedAnswer}" (expected: "${normalizedPhrase}") - Time: ${room.timeRemaining}s`
      );
    }
  });

  // Reset Game 3
  socket.on('reset-game3', ({ roomId }) => {
    if (game3Rooms[roomId]) {
      game3Rooms[roomId].attempts = 0;
      io.to(`game3-${roomId}`).emit('game3-reset', {
        morseSequence: game3Rooms[roomId].morseSequence,
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);

    // Cleanup Game 2 rooms
    for (const roomId in rooms) {
      const room = rooms[roomId];
      for (const role in room.players) {
        if (room.players[role] === socket.id) {
          delete room.players[role];
          // If no players left, delete the room
          if (Object.keys(room.players).length === 0) {
            delete rooms[roomId];
            console.log(`[Game2] Room ${roomId} deleted - no players`);
          } else {
            // Notify remaining player
            io.to(roomId).emit('player-disconnected', { role });
          }
          break;
        }
      }
    }

    // Cleanup Game 1 rooms
    for (const roomId in game1Rooms) {
      const room = game1Rooms[roomId];
      for (const role in room.players) {
        if (room.players[role] === socket.id) {
          delete room.players[role];
          if (Object.keys(room.players).length === 0) {
            delete game1Rooms[roomId];
            console.log(`[Game1] Room ${roomId} deleted - no players`);
          } else {
            io.to(`game1-${roomId}`).emit('game1-player-disconnected', {
              role,
            });
          }
          break;
        }
      }
    }

    // Cleanup Game 3 rooms
    for (const roomId in game3Rooms) {
      const room = game3Rooms[roomId];
      for (const role in room.players) {
        if (room.players[role] === socket.id) {
          delete room.players[role];
          if (Object.keys(room.players).length === 0) {
            delete game3Rooms[roomId];
            console.log(`[Game3] Room ${roomId} deleted - no players`);
          } else {
            io.to(`game3-${roomId}`).emit('game3-player-disconnected', {
              role,
            });
          }
          break;
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () =>
  console.log(`Socket server running on http://localhost:${PORT}`)
);
