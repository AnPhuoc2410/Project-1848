import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiLocationArrow } from 'react-icons/ti';
import Button from '../components/Button';

export default function Lobby() {
  const nav = useNavigate();
  const [roomId, setRoomId] = useState('mln131');

  const join = (role) => {
    nav(`/${role}?room=${roomId}`);
  };

  return (
    <div className="game-lobby">
      {/* Background with grid pattern */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div className="lobby-card">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="special-font text-4xl sm:text-5xl font-black text-primary mb-2">
              🔌 LI<b>G</b>HT BO<b>A</b>RD
            </h1>
            <p className="font-robert-regular text-text/70">
              Triết học Marxism - Puzzle hợp tác 2 người
            </p>
          </div>

          {/* Room Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-text/80 mb-2">
              Mã phòng
            </label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Nhập mã phòng..."
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-white text-text 
                         focus:border-primary focus:outline-none transition-colors
                         font-atkinson text-lg"
            />
          </div>

          {/* Blind Mode Notice */}
          <div className="flex items-center gap-4 p-4 mb-6 bg-primary/5 rounded-xl border border-primary/20">
            <span className="text-2xl">🔇</span>
            <div>
              <p className="font-semibold text-primary">Blind Mode</p>
              <p className="text-sm text-text/60">
                Player B không thấy kết quả - giao tiếp qua voice chat!
              </p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => join('a')} className="role-card role-card-a">
              <span className="text-3xl mb-2">📖</span>
              <span className="font-crimson-pro text-xl font-bold">
                Player A
              </span>
              <span className="text-sm opacity-80">Lý thuyết</span>
            </button>

            <button onClick={() => join('b')} className="role-card role-card-b">
              <span className="text-3xl mb-2">🔧</span>
              <span className="font-crimson-pro text-xl font-bold">
                Player B
              </span>
              <span className="text-sm opacity-80">Thực hành 🔇</span>
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-white/50 rounded-xl p-5 border border-border">
            <h3 className="font-crimson-pro text-lg font-bold text-text mb-3">
              📋 Cách chơi
            </h3>
            <ol className="space-y-2 text-sm text-text/70 font-robert-regular">
              <li className="flex gap-2">
                <span className="font-bold text-primary">1.</span>
                <span>
                  <b>Player B</b> nhìn ảnh vật lý, chọn cặp đèn để hỏi A
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">2.</span>
                <span>
                  <b>Player A</b> trả lời câu hỏi (YES = NỐI, NO = KHÔNG NỐI)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">3.</span>
                <span>
                  <b>Player A</b> nói kết quả qua voice chat cho B
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">4.</span>
                <span>
                  <b>Player B</b> nối dây → bấm <b>Kiểm tra</b>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-bold text-primary">5.</span>
                <span>Đúng 4 dây → Thắng! Sai → Trừ 30 giây!</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
