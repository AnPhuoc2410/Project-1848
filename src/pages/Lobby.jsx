import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const nav = useNavigate();

  const join = (role) => {
    const roomId = 'mln131';
    nav(`/${role}?room=${roomId}`);
  };

  return (
    <div>
      <h2>Hybrid Marxism Puzzle</h2>
      <button onClick={() => join('a')}>Player A</button>
      <button onClick={() => join('b')}>Player B</button>
    </div>
  );
}
