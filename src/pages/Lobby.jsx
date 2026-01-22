import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';

export default function Lobby() {
  const nav = useNavigate();
  const [mode, setMode] = useState('select'); // 'select', 'create', 'join'
  const [roomId, setRoomId] = useState('');
  const [myName, setMyName] = useState('');
  const [joinRoomInput, setJoinRoomInput] = useState('');

  // Real-time lobby state
  const [players, setPlayers] = useState({ A: null, B: null });
  const [isOwner, setIsOwner] = useState(false);
  const [myRole, setMyRole] = useState(null);
  const [lobbyError, setLobbyError] = useState('');
  const [inLobby, setInLobby] = useState(false);

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

  // Socket event listeners
  useEffect(() => {
    socket.on(
      'lobby-update',
      ({ roomId: rid, players: p, isOwner: owner, myRole: role }) => {
        setRoomId(rid);
        setPlayers(p);
        setIsOwner(owner);
        setMyRole(role);
        setInLobby(true);
        setLobbyError('');
      }
    );

    socket.on('lobby-roles-swapped', ({ players: p }) => {
      setPlayers(p);
      // Swap my role
      setMyRole((prev) => (prev === 'A' ? 'B' : 'A'));
      setIsOwner((prev) => !prev);
    });

    socket.on('lobby-error', ({ message }) => {
      setLobbyError(message);
      setTimeout(() => setLobbyError(''), 3000);
    });

    socket.on('lobby-closed', ({ message }) => {
      setLobbyError(message);
      setInLobby(false);
      setMode('select');
      setPlayers({ A: null, B: null });
    });

    socket.on('game-started', ({ roomId: rid, playerA, playerB }) => {
      // Navigate based on my role
      if (myRole === 'A') {
        nav(`/game1/a?room=${rid}&myName=${encodeURIComponent(playerA)}`);
      } else {
        nav(`/game1/b?room=${rid}&myName=${encodeURIComponent(playerB)}`);
      }
    });

    return () => {
      socket.off('lobby-update');
      socket.off('lobby-roles-swapped');
      socket.off('lobby-error');
      socket.off('lobby-closed');
      socket.off('game-started');
    };
  }, [nav, myRole]);

  const handleCreateRoom = () => {
    setMode('create');
    setRoomId(generatedRoomId);
  };

  const handleJoinRoom = () => {
    setMode('join');
  };

  const handleConfirmCreate = () => {
    if (!myName.trim()) return;
    socket.emit('create-lobby', {
      roomId: generatedRoomId,
      playerName: myName.trim(),
    });
  };

  const handleConfirmJoin = () => {
    if (!myName.trim() || joinRoomInput.length < 4) return;
    socket.emit('join-lobby', {
      roomId: joinRoomInput.toUpperCase(),
      playerName: myName.trim(),
    });
  };

  const handleSwapRoles = () => {
    if (!isOwner) return;
    socket.emit('swap-roles', { roomId });
  };

  const handleStartGame = () => {
    if (!players.A || !players.B) return;
    socket.emit('start-game', { roomId });
  };

  const handleBack = () => {
    if (inLobby) {
      socket.emit('leave-lobby', { roomId });
    }
    setMode('select');
    setMyName('');
    setJoinRoomInput('');
    setInLobby(false);
    setPlayers({ A: null, B: null });
    setLobbyError('');
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

          {/* Create Room - Not in lobby yet */}
          {mode === 'create' && !inLobby && (
            <div className="lobby-room-flow">
              <button onClick={handleBack} className="lobby-back-btn">
                ← Quay lại
              </button>

              <div className="lobby-room-display">
                <span className="lobby-room-label">Mã phòng của bạn</span>
                <div className="lobby-room-code">
                  <span className="lobby-room-code-text">
                    {generatedRoomId}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(generatedRoomId)
                    }
                    className="lobby-copy-btn"
                    title="Sao chép"
                  >
                    Copy
                  </button>
                </div>
                <span className="lobby-room-hint">
                  Chia sẻ mã này cho bạn chơi cùng
                </span>
              </div>

              <div className="lobby-role-section">
                <h3 className="lobby-role-title">Nhập tên của bạn</h3>
                <div className="mb-6">
                  <input
                    type="text"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="lobby-room-input"
                    maxLength={20}
                    autoFocus
                  />
                </div>

                <button
                  onClick={handleConfirmCreate}
                  disabled={!myName.trim()}
                  className="lobby-start-btn"
                >
                  {!myName.trim()
                    ? 'Nhập tên để tiếp tục'
                    : 'Tạo phòng & Chờ bạn chơi'}
                </button>
              </div>
            </div>
          )}

          {/* Join Room - Not in lobby yet */}
          {mode === 'join' && !inLobby && (
            <div className="lobby-room-flow">
              <button onClick={handleBack} className="lobby-back-btn">
                ← Quay lại
              </button>

              <div className="lobby-input-section">
                <label className="lobby-input-label">Nhập mã phòng</label>
                <input
                  type="text"
                  value={joinRoomInput}
                  onChange={(e) =>
                    setJoinRoomInput(e.target.value.toUpperCase())
                  }
                  placeholder="VD: ABC123"
                  className="lobby-room-input"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {joinRoomInput.length >= 4 && (
                <div className="lobby-role-section">
                  <h3 className="lobby-role-title">Nhập tên của bạn</h3>
                  <div className="mb-6">
                    <input
                      type="text"
                      value={myName}
                      onChange={(e) => setMyName(e.target.value)}
                      placeholder="Tên của bạn..."
                      className="lobby-room-input"
                      maxLength={20}
                    />
                  </div>
                </div>
              )}

              {lobbyError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-4">
                  ❌ {lobbyError}
                </div>
              )}

              <button
                onClick={handleConfirmJoin}
                disabled={joinRoomInput.length < 4 || !myName.trim()}
                className="lobby-start-btn"
              >
                {joinRoomInput.length < 4
                  ? 'Nhập mã phòng (ít nhất 4 ký tự)'
                  : !myName.trim()
                    ? 'Nhập tên để tiếp tục'
                    : 'Vào phòng'}
              </button>
            </div>
          )}

          {/* In Lobby - Waiting room */}
          {inLobby && (
            <div className="lobby-room-flow">
              <button onClick={handleBack} className="lobby-back-btn">
                ← Rời phòng
              </button>

              <div className="lobby-room-display">
                <span className="lobby-room-label">Phòng</span>
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
              </div>

              {/* Players Display */}
              <div className="lobby-role-section">
                <h3 className="lobby-role-title">Người chơi trong phòng</h3>
                <div className="lobby-role-cards">
                  {/* Player A */}
                  <div
                    className={`lobby-role-card lobby-role-a ${myRole === 'A' ? 'selected' : ''}`}
                  >
                    <div className="role-name">Player A</div>
                    <div className="role-desc">Nhà Lý Luận</div>
                    {players.A ? (
                      <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-700 font-bold text-lg">
                        ✓ {players.A.name}
                        {myRole === 'A' && (
                          <span className="text-sm"> (Bạn)</span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-500">
                        ⏳ Đang chờ...
                      </div>
                    )}
                  </div>

                  {/* Player B */}
                  <div
                    className={`lobby-role-card lobby-role-b ${myRole === 'B' ? 'selected' : ''}`}
                  >
                    <div className="role-name">Player B</div>
                    <div className="role-desc">Nhà Thực Tiễn</div>
                    {players.B ? (
                      <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-700 font-bold text-lg">
                        ✓ {players.B.name}
                        {myRole === 'B' && (
                          <span className="text-sm"> (Bạn)</span>
                        )}
                      </div>
                    ) : (
                      <div className="mt-4 p-3 bg-gray-100 rounded-lg text-gray-500">
                        ⏳ Đang chờ...
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap roles button (owner only) */}
                {isOwner && players.B && (
                  <button
                    onClick={handleSwapRoles}
                    className="mt-4 px-6 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                  >
                    🔄 Đổi vai trò
                  </button>
                )}
              </div>

              {lobbyError && (
                <div className="p-4 bg-red-100 text-red-700 rounded-xl mb-4">
                  ❌ {lobbyError}
                </div>
              )}

              {/* Start Game Button */}
              <button
                onClick={handleStartGame}
                disabled={!players.A || !players.B}
                className="lobby-start-btn"
              >
                {!players.B
                  ? '⏳ Đang chờ người chơi thứ 2...'
                  : '🎮 Bắt đầu Game!'}
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
