import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
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

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  // Join room
  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) {
      rooms[roomId] = {
        players: {},
        wireResults: [], // Store answered wires with results
        usedQuestionIds: [],
        playerBConnections: [], // B's current connections
        timeRemaining: INITIAL_TIME,
        gameComplete: false,
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
    if (!room) return;

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
    if (!room) return;

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
        message: 'Chúc mừng! Cả hai đã hoàn thành puzzle!',
        nextLevel: 2,
      });
    } else {
      // Wrong submission - time penalty
      room.timeRemaining = Math.max(0, room.timeRemaining - TIME_PENALTY);

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
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian! Game Over.',
        });
      }
    }
  });

  // Sync timer (called periodically by frontend)
  socket.on('sync-timer', ({ roomId, timeRemaining }) => {
    const room = rooms[roomId];
    if (room && !room.gameComplete) {
      room.timeRemaining = timeRemaining;
      if (timeRemaining <= 0) {
        io.to(roomId).emit('game-over', {
          message: 'Hết thời gian! Game Over.',
        });
      }
    }
  });

  // Reset game
  socket.on('reset-game', ({ roomId }) => {
    if (rooms[roomId]) {
      rooms[roomId].wireResults = [];
      rooms[roomId].usedQuestionIds = [];
      rooms[roomId].playerBConnections = [];
      rooms[roomId].timeRemaining = INITIAL_TIME;
      rooms[roomId].gameComplete = false;
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
  socket.on('join-game1', ({ roomId, role }) => {
    socket.join(`game1-${roomId}`);

    if (!game1Rooms[roomId]) {
      // Server random chọn từ khi tạo room mới
      const randomPhrase =
        game1Phrases[Math.floor(Math.random() * game1Phrases.length)];
      game1Rooms[roomId] = {
        players: {},
        phrase: randomPhrase,
        attempts: 0,
      };
      console.log(
        `[Game1] Room ${roomId} created with phrase: "${randomPhrase}"`
      );
    }

    game1Rooms[roomId].players[role] = socket.id;

    // Nếu là Player A, gửi từ về cho A hiển thị
    if (role === 'A') {
      socket.emit('game1-phrase', {
        phrase: game1Rooms[roomId].phrase,
      });
    }

    // Notify other players
    io.to(`game1-${roomId}`).emit('game1-player-joined', { role });

    console.log(
      `[Game1] ${role} joined room ${roomId}, phrase: "${game1Rooms[roomId].phrase}"`
    );
  });

  // Player B submits answer
  socket.on('submit-game1-answer', ({ roomId, answer }) => {
    const room = game1Rooms[roomId];
    if (!room) return;

    room.attempts++;

    // Normalize comparison (uppercase, trim)
    const normalizedAnswer = answer.toUpperCase().trim();
    const normalizedPhrase = room.phrase.toUpperCase().trim();

    if (normalizedAnswer === normalizedPhrase) {
      // Correct! Notify both players to redirect to Game 2
      io.to(`game1-${roomId}`).emit('game1-complete', {
        message: 'Chính xác! Chuyển sang Game 2...',
        answer: normalizedAnswer,
      });
      console.log(
        `[Game1] Room ${roomId} completed! Answer: "${normalizedAnswer}"`
      );
    } else {
      // Wrong answer
      socket.emit('game1-wrong-answer', {
        message: `Sai rồi! Thử lại. (Đã thử ${room.attempts} lần)`,
        attempts: room.attempts,
      });
      console.log(
        `[Game1] Wrong answer in room ${roomId}: "${normalizedAnswer}" (expected: "${normalizedPhrase}")`
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

  socket.on('disconnect', () => {
    console.log('Disconnected:', socket.id);
  });
});

server.listen(3001, () =>
  console.log('Socket server running on http://localhost:3001')
);
