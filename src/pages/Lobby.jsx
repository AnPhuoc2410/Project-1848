import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { socket } from '../socket';

// Header component for Lobby
const LobbyHeader = () => {
  const navLinks = [
    { href: '/', label: 'Trang chủ', type: 'route' },
    { href: '/mirror-hall', label: 'Đại sảnh gương 3D', type: 'route' },
    { href: '/leaderboard', label: 'Bảng xếp hạng', type: 'route' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link
            to="/"
            className="text-lg font-bold text-slate-800"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Chủ nghĩa xã hội khoa học
          </Link>
          <div className="flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                style={{ fontFamily: 'var(--font-atkinson)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

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
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <LobbyHeader />

      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 pt-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-2">
            <span className="special-font">
              LOBBY <b className="text-amber-500">1848</b>
            </span>
          </h1>
          <p className="text-slate-500 text-sm">
            Lí luận kết hợp thực tiễn · Hợp tác 2 người chơi
          </p>
        </div>

        {/* Main Card */}
        <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          {/* Mode Selection */}
          {mode === 'select' && (
            <div>
              <h2 className="text-lg font-bold text-slate-700 text-center mb-6">
                Bắt đầu trò chơi
              </h2>

              <div className="space-y-3">
                <button
                  onClick={handleCreateRoom}
                  className="w-full flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                    🏠
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-slate-800">
                      Tạo phòng mới
                    </div>
                    <div className="text-sm text-slate-500">
                      Bắt đầu game mới với bạn bè
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>

                <button
                  onClick={handleJoinRoom}
                  className="w-full flex items-center gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-2xl">
                    🚪
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-slate-800">
                      Tham gia phòng
                    </div>
                    <div className="text-sm text-slate-500">
                      Nhập mã để vào phòng có sẵn
                    </div>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Create Room - Not in lobby yet */}
          {mode === 'create' && !inLobby && (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="text-sm text-slate-500 hover:text-slate-700 transition"
              >
                ← Quay lại
              </button>

              <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2">
                  Mã phòng của bạn
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-mono font-black text-slate-800 tracking-widest">
                    {generatedRoomId}
                  </span>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(generatedRoomId)
                    }
                    className="px-3 py-1.5 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
                  >
                    Copy
                  </button>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Chia sẻ mã này cho bạn chơi cùng
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nhập tên của bạn
                </label>
                <input
                  type="text"
                  value={myName}
                  onChange={(e) => setMyName(e.target.value)}
                  placeholder="Tên của bạn..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
                  maxLength={20}
                  autoFocus
                />
              </div>

              <button
                onClick={handleConfirmCreate}
                disabled={!myName.trim()}
                className="w-full py-4 rounded-xl font-semibold transition-all disabled:bg-slate-100 disabled:text-slate-400 bg-slate-800 hover:bg-slate-700 text-white"
              >
                {!myName.trim()
                  ? 'Nhập tên để tiếp tục'
                  : 'Tạo phòng & Chờ bạn chơi'}
              </button>
            </div>
          )}

          {/* Join Room - Not in lobby yet */}
          {mode === 'join' && !inLobby && (
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="text-sm text-slate-500 hover:text-slate-700 transition"
              >
                ← Quay lại
              </button>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Nhập mã phòng
                </label>
                <input
                  type="text"
                  value={joinRoomInput}
                  onChange={(e) =>
                    setJoinRoomInput(e.target.value.toUpperCase())
                  }
                  placeholder="VD: ABC123"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 font-mono text-lg tracking-widest text-center focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
                  maxLength={6}
                  autoFocus
                />
              </div>

              {joinRoomInput.length >= 4 && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Nhập tên của bạn
                  </label>
                  <input
                    type="text"
                    value={myName}
                    onChange={(e) => setMyName(e.target.value)}
                    placeholder="Tên của bạn..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 transition"
                    maxLength={20}
                  />
                </div>
              )}

              {lobbyError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                  ❌ {lobbyError}
                </div>
              )}

              <button
                onClick={handleConfirmJoin}
                disabled={joinRoomInput.length < 4 || !myName.trim()}
                className="w-full py-4 rounded-xl font-semibold transition-all disabled:bg-slate-100 disabled:text-slate-400 bg-slate-800 hover:bg-slate-700 text-white"
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
            <div className="space-y-6">
              <button
                onClick={handleBack}
                className="text-sm text-slate-500 hover:text-slate-700 transition"
              >
                ← Rời phòng
              </button>

              <div className="text-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Phòng
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-mono font-black text-slate-800 tracking-widest">
                    {roomId}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(roomId)}
                    className="px-2.5 py-1 text-xs font-medium bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Players Display */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">
                  Người chơi trong phòng
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {/* Player A */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      myRole === 'A'
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex items-center justify-center">
                        A
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        Lý Luận
                      </span>
                    </div>
                    {players.A ? (
                      <div className="text-base font-semibold text-slate-800">
                        ✓ {players.A.name}
                        {myRole === 'A' && (
                          <span className="text-blue-500 text-sm ml-1">
                            (Bạn)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        ⏳ Đang chờ...
                      </div>
                    )}
                  </div>

                  {/* Player B */}
                  <div
                    className={`p-4 rounded-xl border-2 transition-all ${
                      myRole === 'B'
                        ? 'border-emerald-400 bg-emerald-50'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                        B
                      </span>
                      <span className="text-sm font-medium text-slate-600">
                        Thực Tiễn
                      </span>
                    </div>
                    {players.B ? (
                      <div className="text-base font-semibold text-slate-800">
                        ✓ {players.B.name}
                        {myRole === 'B' && (
                          <span className="text-emerald-500 text-sm ml-1">
                            (Bạn)
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400">
                        ⏳ Đang chờ...
                      </div>
                    )}
                  </div>
                </div>

                {/* Swap roles button (owner only) */}
                {isOwner && players.B && (
                  <button
                    onClick={handleSwapRoles}
                    className="mt-3 w-full px-4 py-2 text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                  >
                    🔄 Đổi vai trò
                  </button>
                )}
              </div>

              {lobbyError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-200 text-sm">
                  ❌ {lobbyError}
                </div>
              )}

              {/* Start Game Button */}
              <button
                onClick={handleStartGame}
                disabled={!players.A || !players.B}
                className="w-full py-4 rounded-xl font-semibold transition-all disabled:bg-slate-100 disabled:text-slate-400 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {!players.B
                  ? '⏳ Đang chờ người chơi thứ 2...'
                  : '🎮 Bắt đầu Game!'}
              </button>
            </div>
          )}
        </div>

        {/* How to Play - Process Flow */}
        <div className="w-full max-w-3xl mt-10">
          <h3 className="text-center text-sm font-semibold text-slate-600 mb-5">
            Quy trình phối hợp
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                  Player A
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tiếp nhận dữ liệu hoặc vấn đề cần giải quyết trên màn hình.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-600 rounded-full">
                  Player A
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Phân tích và truyền đạt "lý luận" cho B qua hội thoại.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-600 rounded-full">
                  Player B
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Lắng nghe và áp dụng vào công cụ/bảng mã thực tiễn đang nắm giữ.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold flex items-center justify-center">
                  4
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-600 rounded-full">
                  Player B
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Thực hiện thao tác xử lý cuối cùng để hoàn thành nhiệm vụ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
