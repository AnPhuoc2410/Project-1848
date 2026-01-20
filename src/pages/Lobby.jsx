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

        {/* Blind Mode Info - Always ON */}
        <div className="blind-mode-notice">
          <span className="blind-icon">🔇</span>
          <div className="blind-text">
            <strong>Blind Mode</strong>
            <span>
              Player B không thấy kết quả - phải giao tiếp qua voice chat!
            </span>
          </div>
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
            <span className="role-desc">Thực hành - Nối dây 🔇</span>
          </button>
        </div>

        <div className="lobby-instructions">
          <h3>Cách chơi:</h3>
          <ol>
            <li>
              <strong>Player B</strong> nhìn ảnh vật lý, chọn cặp đèn để hỏi A
            </li>
            <li>
              <strong>Player A</strong> đọc câu hỏi, suy nghĩ và trả lời (YES =
              NỐI, NO = KHÔNG NỐI)
            </li>
            <li>
              <strong>Player A</strong> nói kết quả qua voice chat cho B (B
              không thấy trên màn hình!)
            </li>
            <li>
              <strong>Player B</strong> nối dây theo hướng dẫn từ A
            </li>
            <li>
              Khi hoàn thành, Player B bấm <strong>Kiểm tra</strong>
            </li>
            <li>Đúng 4 dây → Thắng! Sai → Trừ 30 giây!</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
