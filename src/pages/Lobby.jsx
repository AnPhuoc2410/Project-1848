import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const nav = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
  const [roomId, setRoomId] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [playerAName, setPlayerAName] = useState('');
  const [playerBName, setPlayerBName] = useState('');

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
    <div className="w-full h-full">
      {/* Background */}
      <div className="lobby-bg">
        <div className="lobby-bg-base" />
        <div className="lobby-bg-grid" />
      </div>

      <div className="lobby-content">
        {/* Header */}
        <div className="lobby-header">
          <h1 className="lobby-title">
            <span className="special-font">
              LOBBY <b>1848</b>
            </span>
          </h1>
          <p className="lobby-subtitle">
            Lí luận kết hợp thực tiễn · Hợp tác 2 người chơi
          </p>
        </div>

        {/* Main Card */}
        <div className="lobby-main-card">
          {/* Mode Selection */}
          {mode === 'select' && (
            <div className="lobby-mode-select">
              <h2 className="lobby-section-title">Bắt đầu trò chơi</h2>

              <div className="lobby-mode-buttons">
                <button onClick={handleCreateRoom} className="lobby-mode-btn">
                  <div className="lobby-mode-content">
                    <span className="lobby-mode-title">Tạo phòng mới</span>
                    <span className="lobby-mode-desc">
                      Bắt đầu game mới với bạn bè
                    </span>
                  </div>
                  <span className="lobby-mode-arrow">→</span>
                </button>

                <button onClick={handleJoinRoom} className="lobby-mode-btn">
                  <div className="lobby-mode-content">
                    <span className="lobby-mode-title">Tham gia phòng</span>
                    <span className="lobby-mode-desc">
                      Nhập mã để vào phòng có sẵn
                    </span>
                  </div>
                  <span className="lobby-mode-arrow">→</span>
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
                    Copy
                  </button>
                </div>
                <h3 className="lobby-role-title">Nhập tên cặp đôi</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      👤 Tên Player A
                    </label>
                    <input
                      type="text"
                      value={playerAName}
                      onChange={(e) => setPlayerAName(e.target.value)}
                      placeholder="VD: Phuoc"
                      className="lobby-room-input"
                      maxLength={20}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text/70 mb-2">
                      👤 Tên Player B
                    </label>
                    <input
                      type="text"
                      value={playerBName}
                      onChange={(e) => setPlayerBName(e.target.value)}
                      placeholder="VD: Ngan"
                      className="lobby-room-input"
                      maxLength={20}
                    />
                  </div>
                </div>

                <span className="lobby-room-hint">
                  Chia sẻ mã này cho bạn chơi cùng
                </span>
              </div>

              <div className="lobby-role-section">
                <h3 className="lobby-role-title">Chọn vai trò tác chiến</h3>
                <div className="lobby-role-cards">
                  {/* Player A - Lý Luận */}
                  <button
                    onClick={() => handleSelectRole('a')}
                    className={`lobby-role-card lobby-role-a ${selectedRole === 'a' ? 'selected' : ''}`}
                  >
                    <div className="role-name">Player A</div>
                    <div className="role-desc">Nhà Lý Luận</div>
                    <ul className="role-tasks">
                      <li>
                        Nắm giữ <b>thông tin mật</b> & dữ kiện
                      </li>
                      <li>
                        Phân tích vấn đề & <b>định hướng</b>
                      </li>
                      <li>Truyền tải chỉ thị cho người thực hiện</li>
                    </ul>
                  </button>

                  {/* Player B - Thực Tiễn */}
                  <button
                    onClick={() => handleSelectRole('b')}
                    className={`lobby-role-card lobby-role-b ${selectedRole === 'b' ? 'selected' : ''}`}
                  >
                    <div className="role-name">Player B</div>
                    <div className="role-desc">Nhà Thực Tiễn</div>
                    <ul className="role-tasks">
                      <li>
                        Nắm giữ <b>công cụ</b> & giải pháp
                      </li>
                      <li>
                        Tiếp nhận thông tin & <b>xử lý</b>
                      </li>
                      <li>Thao tác trực tiếp để qua màn</li>
                    </ul>
                  </button>
                </div>
              </div>

              <button
                onClick={handleStartGame}
                disabled={
                  !selectedRole || !playerAName.trim() || !playerBName.trim()
                }
                className="lobby-start-btn"
              >
                {!playerAName.trim() || !playerBName.trim()
                  ? 'Nhập tên cả 2 người chơi'
                  : !selectedRole
                    ? 'Chọn vai trò để tiếp tục'
                    : 'Bắt đầu game'}
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
                  <h3 className="lobby-role-title">Nhập tên cặp đôi</h3>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-text/70 mb-2">
                        👤 Tên Player A
                      </label>
                      <input
                        type="text"
                        value={playerAName}
                        onChange={(e) => setPlayerAName(e.target.value)}
                        placeholder="VD: Minh"
                        className="lobby-room-input"
                        maxLength={20}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text/70 mb-2">
                        👤 Tên Player B
                      </label>
                      <input
                        type="text"
                        value={playerBName}
                        onChange={(e) => setPlayerBName(e.target.value)}
                        placeholder="VD: Lan"
                        className="lobby-room-input"
                        maxLength={20}
                      />
                    </div>
                  </div>

                  <h3 className="lobby-role-title">Chọn vai trò</h3>
                  <div className="lobby-role-cards">
                    <button
                      onClick={() => handleSelectRole('a')}
                      className={`lobby-role-card lobby-role-a ${selectedRole === 'a' ? 'selected' : ''}`}
                    >
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
                disabled={
                  !roomId.trim() ||
                  roomId.length < 4 ||
                  !selectedRole ||
                  !playerAName.trim() ||
                  !playerBName.trim()
                }
                className="lobby-start-btn"
              >
                {!roomId.trim() || roomId.length < 4
                  ? 'Nhập mã phòng (ít nhất 4 ký tự)'
                  : !playerAName.trim() || !playerBName.trim()
                    ? 'Nhập tên cả 2 người chơi'
                    : !selectedRole
                      ? 'Chọn vai trò để tiếp tục'
                      : 'Vào phòng chơi'}
              </button>
            </div>
          )}
        </div>

        {/* How to Play */}
        <div className="lobby-instructions">
          <h3 className="lobby-instructions-title">Quy trình phối hợp</h3>
          <div className="lobby-instructions-list">
            <div className="lobby-instruction-item">
              <span className="instruction-step">1</span>
              <p>
                <b>Player A</b> tiếp nhận dữ liệu hoặc vấn đề cần giải quyết
                trên màn hình.
              </p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">2</span>
              <p>
                <b>Player A</b> phân tích và truyền đạt "lý luận" (chỉ thị/mô
                tả) cho B qua hội thoại.
              </p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">3</span>
              <p>
                <b>Player B</b> lắng nghe và áp dụng vào công cụ/bảng mã thực
                tiễn đang nắm giữ.
              </p>
            </div>
            <div className="lobby-instruction-item">
              <span className="instruction-step">4</span>
              <p>
                <b>Player B</b> thực hiện thao tác xử lý cuối cùng để hoàn thành
                nhiệm vụ chung.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
