import { socket } from '../socket';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PlayerA() {
  const [params] = useSearchParams();
  const roomId = params.get('room');

  useEffect(() => {
    socket.emit('join-room', { roomId, role: 'A' });
  }, []);

  const send = (answer) => {
    socket.emit('connect-wire', {
      roomId,
      from: 'HienTuong',
      to: 'BanChat',
      answer,
    });
  };

  return (
    <div>
      <h2>Player A – Theory</h2>
      <button onClick={() => send('YES')}>YES</button>
      <button onClick={() => send('NO')}>NO</button>
    </div>
  );
}
