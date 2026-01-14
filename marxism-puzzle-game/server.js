/**
 * Marxism-Leninism Puzzle Game Server
 * Asymmetric Co-op Multiplayer Game
 *
 * Player A (The Guide): Sees theory and questions
 * Player B (The Agent): Sees images and action buttons
 */

import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Game state management
const waitingPlayers = [];
const gameRooms = new Map();

// Level data - easily expandable for more levels
const levels = {
  1: {
    theme: 'Worker & Farmer Alliance',
    themeVi: 'Liên minh Công - Nông',
    guideInfo: {
      target: 'Find the symbol of the Worker and Farmer alliance.',
      hint: 'Worker = Hammer (búa), Farmer = Sickle (liềm)',
      additionalInfo:
        'The hammer and sickle together represent the unity of industrial workers and agricultural peasants.',
    },
    agentOptions: [
      {
        id: 'hammer-sickle',
        icon: '☭',
        label: 'Hammer & Sickle',
        correct: true,
      },
      {
        id: 'hammer-book',
        icon: '🔨📖',
        label: 'Hammer & Book',
        correct: false,
      },
      {
        id: 'sickle-magnify',
        icon: '🌾🔍',
        label: 'Sickle & Magnifying Glass',
        correct: false,
      },
      { id: 'coin-scale', icon: '🪙⚖️', label: 'Coin & Scale', correct: false },
    ],
    correctMessage:
      'CORRECT! The Alliance is formed. The hammer and sickle symbolize the unity of workers and farmers!',
    wrongMessage: "WRONG! That's not the symbol of unity. Try again!",
    explanation:
      'The hammer represents industrial workers, while the sickle represents agricultural farmers. Together, they symbolize the alliance between these two classes in building socialism.',
  },
};

// Room class to manage game state
class GameRoom {
  constructor(roomId) {
    this.roomId = roomId;
    this.players = {
      guide: null, // Player A
      agent: null, // Player B
    };
    this.currentLevel = 1;
    this.attempts = 0;
    this.maxAttempts = 3;
    this.score = 0;
    this.gameStarted = false;
    this.levelCompleted = false;
  }

  addPlayer(socketId) {
    if (!this.players.guide) {
      this.players.guide = socketId;
      return 'guide';
    } else if (!this.players.agent) {
      this.players.agent = socketId;
      return 'agent';
    }
    return null;
  }

  removePlayer(socketId) {
    if (this.players.guide === socketId) {
      this.players.guide = null;
      return 'guide';
    } else if (this.players.agent === socketId) {
      this.players.agent = null;
      return 'agent';
    }
    return null;
  }

  isFull() {
    return this.players.guide && this.players.agent;
  }

  isEmpty() {
    return !this.players.guide && !this.players.agent;
  }

  getOtherPlayer(socketId) {
    if (this.players.guide === socketId) return this.players.agent;
    if (this.players.agent === socketId) return this.players.guide;
    return null;
  }

  getLevelData() {
    return levels[this.currentLevel];
  }

  checkAnswer(answerId) {
    const levelData = this.getLevelData();
    const selectedOption = levelData.agentOptions.find(
      (opt) => opt.id === answerId
    );

    if (selectedOption && selectedOption.correct) {
      this.levelCompleted = true;
      this.score += Math.max(100 - this.attempts * 20, 20);
      return {
        correct: true,
        message: levelData.correctMessage,
        explanation: levelData.explanation,
        score: this.score,
      };
    } else {
      this.attempts++;
      const attemptsLeft = this.maxAttempts - this.attempts;
      return {
        correct: false,
        message: levelData.wrongMessage,
        attemptsLeft: attemptsLeft,
        gameOver: attemptsLeft <= 0,
      };
    }
  }

  resetLevel() {
    this.attempts = 0;
    this.levelCompleted = false;
  }
}

// Generate unique room ID
function generateRoomId() {
  return 'room_' + Math.random().toString(36).substr(2, 9);
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Handle player joining
  socket.on('joinGame', () => {
    let roomId;
    let room;
    let role;

    // Check if there's a waiting player
    if (waitingPlayers.length > 0) {
      // Join existing room
      roomId = waitingPlayers.shift();
      room = gameRooms.get(roomId);
      role = room.addPlayer(socket.id);
    } else {
      // Create new room and wait
      roomId = generateRoomId();
      room = new GameRoom(roomId);
      role = room.addPlayer(socket.id);
      gameRooms.set(roomId, room);
      waitingPlayers.push(roomId);
    }

    // Join socket.io room
    socket.join(roomId);
    socket.roomId = roomId;
    socket.role = role;

    console.log(`Player ${socket.id} joined room ${roomId} as ${role}`);

    // Send role assignment to player
    socket.emit('roleAssigned', {
      role: role,
      roomId: roomId,
      waiting: !room.isFull(),
    });

    // If room is full, start the game
    if (room.isFull()) {
      startGame(roomId);
    }
  });

  // Handle answer submission from Agent
  socket.on('submitAnswer', (data) => {
    const { answerId } = data;
    const roomId = socket.roomId;
    const room = gameRooms.get(roomId);

    if (!room || socket.role !== 'agent') {
      socket.emit('error', { message: 'Invalid action' });
      return;
    }

    const result = room.checkAnswer(answerId);

    // Broadcast result to both players
    io.to(roomId).emit('answerResult', result);

    if (result.correct) {
      console.log(`Room ${roomId}: Level completed! Score: ${result.score}`);
    } else if (result.gameOver) {
      console.log(`Room ${roomId}: Game Over - Out of attempts`);
      io.to(roomId).emit('gameOver', {
        message: 'Out of attempts! The alliance was not formed.',
        finalScore: room.score,
      });
    }
  });

  // Handle restart request
  socket.on('restartLevel', () => {
    const roomId = socket.roomId;
    const room = gameRooms.get(roomId);

    if (room && room.isFull()) {
      room.resetLevel();
      startGame(roomId);
    }
  });

  // Handle chat messages between players
  socket.on('chatMessage', (message) => {
    const roomId = socket.roomId;
    if (roomId) {
      socket.to(roomId).emit('chatMessage', {
        from: socket.role,
        message: message,
      });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);

    const roomId = socket.roomId;
    if (roomId) {
      const room = gameRooms.get(roomId);
      if (room) {
        // const removedRole = room.removePlayer(socket.id);

        // Notify other player
        socket.to(roomId).emit('partnerDisconnected', {
          message: 'Your partner has disconnected. Waiting for a new player...',
        });

        // If room is empty, clean up
        if (room.isEmpty()) {
          gameRooms.delete(roomId);
          const waitingIndex = waitingPlayers.indexOf(roomId);
          if (waitingIndex > -1) {
            waitingPlayers.splice(waitingIndex, 1);
          }
        } else {
          // Add room back to waiting list
          if (!waitingPlayers.includes(roomId)) {
            waitingPlayers.push(roomId);
          }
        }
      }
    }
  });
});

// Start game function
function startGame(roomId) {
  const room = gameRooms.get(roomId);
  if (!room) return;

  const levelData = room.getLevelData();
  room.gameStarted = true;

  console.log(`Starting game in room ${roomId}`);

  // Send game data to Guide (Player A)
  io.to(room.players.guide).emit('gameStart', {
    role: 'guide',
    level: room.currentLevel,
    theme: levelData.theme,
    themeVi: levelData.themeVi,
    guideInfo: levelData.guideInfo,
    maxAttempts: room.maxAttempts,
  });

  // Send game data to Agent (Player B)
  io.to(room.players.agent).emit('gameStart', {
    role: 'agent',
    level: room.currentLevel,
    theme: levelData.theme,
    themeVi: levelData.themeVi,
    options: levelData.agentOptions.map((opt) => ({
      id: opt.id,
      icon: opt.icon,
      label: opt.label,
    })), // Don't send correct answer info!
    maxAttempts: room.maxAttempts,
  });
}

// Start server
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║   🚩 MARXISM-LENINISM PUZZLE GAME SERVER 🚩              ║
    ║                                                           ║
    ║   Server running on http://localhost:${PORT}               ║
    ║                                                           ║
    ║   Open two browser windows to play!                       ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);
});
