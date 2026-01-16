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

let rooms = {};

io.on('connection', (socket) => {
  console.log('Connected:', socket.id);

  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);
    if (!rooms[roomId]) rooms[roomId] = {};
    rooms[roomId][role] = socket.id;
  });

  socket.on('connect-wire', ({ roomId, from, to, answer }) => {
    const isValid =
      from === 'HienTuong' && to === 'BanChat' && answer === 'YES';

    io.to(roomId).emit('wire-result', {
      from,
      to,
      isValid,
    });
  });
});

server.listen(3001, () =>
  console.log('Socket server running on http://localhost:3001')
);
