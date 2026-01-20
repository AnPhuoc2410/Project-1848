import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const nav = useNavigate();
  const [roomId, setRoomId] = useState('mln131');

  const join = (role) => {
    nav(`/${role}?room=${roomId}`);
  };

  return (
    <div className="lobby-page">
      <div className="lobby-container">
        <div className="lobby-header">
          <h1>🔌 Light Board Puzzle</h1>
          <p className="subtitle">Triết học Marxism - Puzzle hợp tác 2 người</p>
        </div>

        <div className="room-input">
          <label>Mã phòng:</label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="Nhập mã phòng..."
          />
        </div>

        <div className="role-selection">
          <button className="role-btn role-a" onClick={() => join('a')}>
            <span className="role-icon">📖</span>
            <span className="role-name">Player A</span>
            <span className="role-desc">Lý thuyết - Trả lời câu hỏi</span>
          </button>

          <button className="role-btn role-b" onClick={() => join('b')}>
            <span className="role-icon">🔧</span>
            <span className="role-name">Player B</span>
            <span className="role-desc">Thực hành - Nối dây</span>
          </button>
        </div>

        <div className="lobby-instructions">
          <h3>Cách chơi:</h3>
          <ol>
            <li>
              <strong>Player A</strong> kéo dây và trả lời câu hỏi triết học
              (Yes/No)
            </li>
            <li>
              <strong>Player B</strong> nhận hướng dẫn và nối dây trên bảng thật
            </li>
            <li>
              Khi hoàn thành tất cả dây, Player B bấm <strong>Kiểm tra</strong>
            </li>
            <li>Đúng → Cả hai thắng! Sai → Thử lại!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
