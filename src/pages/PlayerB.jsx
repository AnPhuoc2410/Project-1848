import { socket } from '../socket';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function PlayerB() {
  const [params] = useSearchParams();
  const roomId = params.get('room');
  const [status, setStatus] = useState('Waiting...');

  useEffect(() => {
    socket.emit('join-room', { roomId, role: 'B' });

    socket.on('wire-result', ({ from, to, isValid }) => {
      setStatus(
        isValid ? `✅ ${from} → ${to} CONNECTED` : `❌ INVALID CONNECTION`
      );
    });
  }, []);

  return (
    <div>
      <h2>Player B – Practice</h2>
      <p>{status}</p>
    </div>
  );
}
