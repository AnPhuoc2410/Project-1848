import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const nav = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
  const [roomId, setRoomId] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);

  // Generate random room ID
  const generateRoomId = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generatedRoomId = useMemo(() => generateRoomId(), []);

  const handleCreateRoom = () => {
    setRoomId(generatedRoomId);
    setMode('create');
  };

  const handleJoinRoom = () => {
    setMode('join');
  };

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  const handleStartGame = () => {
    if (!roomId.trim() || !selectedRole) return;
    nav(`/game1/${selectedRole}?room=${roomId.toUpperCase()}`);
  };

  const handleBack = () => {
    setMode('select');
    setSelectedRole(null);
    setRoomId('');
  };

  return (
    <div className="lobby-container">
      {/* Animated Background */}
      <div className="lobby-bg">
        <div className="lobby-bg-gradient" />
        <div className="lobby-bg-grid" />
        <div className="lobby-bg-glow lobby-bg-glow-1" />
        <div className="lobby-bg-glow lobby-bg-glow-2" />
      </div>

      <div className="lobby-content">
        {/* Header */}
        <div className="lobby-header">
          <div className="lobby-logo">
            <span className="lobby-logo-icon">🔐</span>
            <h1 className="lobby-title">
              <span className="special-font">
                FREE<b>M</b>ASON
              </span>
            </h1>
          </div>
          <p className="lobby-subtitle">
            Giải mã mật thư • Hợp tác 2 người chơi
          </p>
        </div>

        {/* Main Card */}
        <div className="lobby-main-card">
          {/* Mode Selection */}
          {mode === 'select' && (
            <div className="lobby-mode-select">
              <h2 className="lobby-section-title">Bắt đầu trò chơi</h2>

              <div className="lobby-mode-buttons">
                <button
                  onClick={handleCreateRoom}
                  className="lobby-mode-btn lobby-mode-create"
                >
                  <div className="lobby-mode-icon">🎮</div>
                  <div className="lobby-mode-content">
                    <span className="lobby-mode-title">Tạo phòng mới</span>
                    <span className="lobby-mode-desc">
                      Bắt đầu game mới với bạn bè
                    </span>
                  </div>
                  <div className="lobby-mode-arrow">→</div>
                </button>

                <button
                  onClick={handleJoinRoom}
                  className="lobby-mode-btn lobby-mode-join"
                >
                  <div className="lobby-mode-icon">🚪</div>
                  <div className="lobby-mode-content">
                    <span className="lobby-mode-title">Tham gia phòng</span>
                    <span className="lobby-mode-desc">
                      Nhập mã để vào phòng có sẵn
                    </span>
                  </div>
                  <div className="lobby-mode-arrow">→</div>
                </button>
              </div>
            </div>
          )}

          {/* Create Room Flow */}
          {mode === 'create' && (
            <div className="lobby-room-flow">
              <button onClick={handleBack} className="lobby-back-btn">
                ← Quay lại
              </button>

              <div className="lobby-room-display">
                <span className="lobby-room-label">Mã phòng của bạn</span>
                <div className="lobby-room-code">
                  <span className="lobby-room-code-text">{roomId}</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(roomId)}
                    className="lobby-copy-btn"
                    title="Sao chép"
                  >
                    📋
                  </button>
                </div>
                <span className="lobby-room-hint">
                  Chia sẻ mã này cho bạn chơi cùng!
                </span>
              </div>

              <div className="lobby-role-section">
                <h3 className="lobby-role-title">Chọn vai trò của bạn</h3>
                <div className="lobby-role-cards">
                  <button
                    onClick={() => handleSelectRole('a')}
                    className={`lobby-role-card lobby-role-a ${selectedRole === 'a' ? 'selected' : ''}`}
                  >
                    <div className="role-icon">📖</div>
                    <div className="role-name">Player A</div>
                    <div className="role-desc">Mô tả mật mã</div>
                    <ul className="role-tasks">
                      <li>Nhìn ký hiệu Freemason</li>
                      <li>Mô tả hình dạng cho B</li>
                    </ul>
                  </button>

                  <button
                    onClick={() => handleSelectRole('b')}
                    className={`lobby-role-card lobby-role-b ${selectedRole === 'b' ? 'selected' : ''}`}
                  >
                    <div className="role-icon">🔍</div>
                    <div className="role-name">Player B</div>
                    <div className="role-desc">Giải mã</div>
                    <ul className="role-tasks">
                      <li>Nghe A mô tả ký hiệu</li>
                      <li>Tra bảng mã → nhập đáp án</li>
                    </ul>
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={!selectedRole}
                className="lobby-start-btn"
              >
                {selectedRole ? '🚀 Bắt đầu game' : 'Chọn vai trò để tiếp tục'}
              </button>
            </div>
          )}

          {/* Join Room Flow */}
          {mode === 'join' && (
            <div className="lobby-room-flow">
              <button onClick={handleBack} className="lobby-back-btn">
                ← Quay lại
              </button>

              <div className="lobby-input-section">
                <label className="lobby-input-label">Nhập mã phòng</label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="VD: ABC123"
                  className="lobby-room-input"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {roomId.length >= 4 && (
                <div className="lobby-role-section">
                  <h3 className="lobby-role-title">Chọn vai trò của bạn</h3>
                  <div className="lobby-role-cards">
                    <button
                      onClick={() => handleSelectRole('a')}
                      className={`lobby-role-card lobby-role-a ${selectedRole === 'a' ? 'selected' : ''}`}
                    >
                      <div className="role-icon">📖</div>
                      <div className="role-name">Player A</div>
                      <div className="role-desc">Mô tả mật mã</div>
                      <ul className="role-tasks">
                        <li>Nhìn ký hiệu Freemason</li>
                        <li>Mô tả hình dạng cho B</li>
                      </ul>
                    </button>

                    <button
                      onClick={() => handleSelectRole('b')}
                      className={`lobby-role-card lobby-role-b ${selectedRole === 'b' ? 'selected' : ''}`}
                    >
                      <div className="role-icon">🔍</div>
                      <div className="role-name">Player B</div>
                      <div className="role-desc">Giải mã</div>
                      <ul className="role-tasks">
                        <li>Nghe A mô tả ký hiệu</li>
                        <li>Tra bảng mã → nhập đáp án</li>
                      </ul>
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartGame}
                disabled={!roomId.trim() || roomId.length < 4 || !selectedRole}
                className="lobby-start-btn"
              >
                {!roomId.trim() || roomId.length < 4
                  ? 'Nhập mã phòng (ít nhất 4 ký tự)'
                  : !selectedRole
                    ? 'Chọn vai trò để tiếp tục'
                    : '🚀 Vào phòng chơi'}
              </button>
            </div>
          )}
        </div>

        {/* How to Play */}
        <div className="lobby-instructions">
          <h3 className="lobby-instructions-title">📋 Cách chơi</h3>
          <div className="lobby-instructions-grid">
            <div className="lobby-instruction-item">
              <span className="instruction-step">1</span>
              <p>Player A nhìn các ký hiệu Freemason trên màn hình</p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">2</span>
              <p>Player A mô tả hình dạng ký hiệu cho Player B qua giọng nói</p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">3</span>
              <p>Player B tra bảng mã để tìm chữ cái tương ứng</p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">4</span>
              <p>Player B ghép các chữ và nhập đáp án để qua màn!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
