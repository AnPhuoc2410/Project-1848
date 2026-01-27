import Navbar from '../components/Navbar';
import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import MiniGame1 from '../components/games/MiniGame1';
import MiniGame2 from '../components/games/MiniGame2';
import MiniGame3 from '../components/games/MiniGame3';
import MiniGame4 from '../components/games/MiniGame4';
import MiniGame5 from '../components/games/MiniGame5';
import MiniGame6 from '../components/games/MiniGame6';
import MiniGame7 from '../components/games/MiniGame7';

const MiniGame = () => {
  const [activeGameId, setActiveGameId] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(7);

  const handleLevelComplete = (id) => {
    if (id >= unlockedLevel) {
      setUnlockedLevel(id + 1);
    }
  };

  const miniGames = [
    {
      id: 1,
      title: 'CHƯƠNG 1: HÌNH THÀNH CHỦ NGHĨA XÃ HỘI KHOA HỌC',
      objectives: [
        'Hiểu nguồn gốc ra đời CNXH khoa học',
        'Phân biệt CNXH không tưởng & CNXH khoa học',
      ],
      gameplay:
        'Kéo – thả các mốc lịch sử vào timeline. Sắp xếp đúng thứ tự → qua màn.',
      knowledge: [
        'CNXH không tưởng (Saint-Simon, Fourier, Owen)',
        'Mác – Ăngghen xây dựng CNXH khoa học',
        'Vai trò của Lênin',
      ],
      mission: 'Sắp xếp đúng: CNXH không tưởng -> Mác – Ăngghen -> Lênin',
      image: '/img/game1.jpg',
      isPlaceholder: false,
    },
    {
      id: 2,
      title: 'CHƯƠNG 2: SỨ MỆNH LỊCH SỬ GIAI CẤP CÔNG NHÂN',
      objectives: ['Nắm vai trò lãnh đạo cách mạng của công nhân'],
      gameplay: 'Chọn đúng vai trò cho từng giai cấp (Trắc nghiệm)',
      knowledge: [
        'Công nhân: lực lượng lãnh đạo',
        'Nông dân: lực lượng đông đảo',
        'Trí thức: lực lượng quan trọng',
      ],
      mission: 'Trả lời đúng ≥ 70% câu hỏi để qua màn',
      image: '/img/game2.jpg',
      isPlaceholder: false,
    },
    {
      id: 3,
      title: 'CHƯƠNG 3: VƯỢT QUA THỜI KỲ QUÁ ĐỘ',
      objectives: ['Hiểu tính tất yếu, lâu dài của quá độ'],
      gameplay: 'Hành trình chọn giải pháp (Adventure)',
      knowledge: [
        'Mâu thuẫn kinh tế',
        'Phát triển lực lượng sản xuất',
        'Không thể “nhảy cóc”',
      ],
      mission: 'Vượt qua 5 thử thách để về đích',
      image: '/img/game3.jpg',
      isPlaceholder: false,
    },
    {
      id: 4,
      title: 'CHƯƠNG 4: XÂY DỰNG NHÀ NƯỚC PHÁP QUYỀN XHCN',
      objectives: ['Hiểu dân chủ XHCN & nhà nước pháp quyền'],
      gameplay: 'Ghép đúng 3 nhánh quyền lực · Xử lý tình huống tham nhũng',
      knowledge: [
        'Lập pháp – Hành pháp – Tư pháp',
        'Quyền làm chủ của nhân dân',
      ],
      mission: 'Tình huống: Phát hiện tham nhũng → công dân làm gì?',
      image: '/img/game4.jpg',
      isPlaceholder: false,
    },
    {
      id: 5,
      title: 'CHƯƠNG 5: GIỮ CÂN BẰNG LIÊN MINH GIAI CẤP',
      objectives: ['Hiểu vai trò liên minh công – nông – trí thức'],
      gameplay: 'Điều chỉnh 3 thanh cân bằng; lệch → xã hội mất ổn định',
      knowledge: [
        'Liên minh là nền tảng xã hội',
        'Thiếu 1 giai cấp → mất cân bằng',
      ],
      mission: 'Giữ 3 thanh trong vùng “ổn định”.',
      image: '/img/game5.jpeg',
      isPlaceholder: false,
    },
    {
      id: 6,
      title: 'CHƯƠNG 6: Ô CHỮ THỜI KỲ',
      objectives: ['Hiểu thời kỳ quá độ và chế độ công hữu'],
      gameplay: 'Giải 4 ô chữ',
      knowledge: [
        'Thời kỳ quá độ chính trị',
        'Chế độ công hữu trong CNXH',
        'Hình thái gia đình trong lịch sử xã hội',
      ],
      mission: 'Điền đúng 4 đáp án để mở ô chữ bí mật.',
      image: '/img/game6.png',
      isPlaceholder: false,
    },
    {
      id: 7,
      title: 'CHƯƠNG 7: GIA ĐÌNH BÌNH ĐẲNG',
      objectives: ['Hiểu gia đình là tế bào xã hội'],
      gameplay: 'Chọn hành vi đúng; điểm hạnh phúc tăng/giảm',
      knowledge: ['Bình đẳng giới', 'Giáo dục gia đình'],
      mission:
        'Tình huống: Việc nhà → ai làm? Chọn hành vi đúng để giữ hạnh phúc.',
      image: '/img/game7.webp',
      isPlaceholder: false,
    },
  ];

  const handlePlay = (game) => {
    if (game.id > unlockedLevel) return;
    if (game.isPlaceholder) return;
    setActiveGameId(game.id);
  };

  return (
    <div className="relative min-h-screen bg-background text-text">
      <Navbar />
      <section className="pt-28 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl font-bold text-primary mb-6"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              Mini-game
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {miniGames.map((game, index) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/20 h-full flex flex-col"
              >
                <div className="aspect-video w-full rounded-lg bg-black/20 mb-4 flex items-center justify-center overflow-hidden">
                  {game.image ? (
                    <img
                      src={game.image}
                      alt={game.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <span className="text-white/40 font-medium">
                      Thumbnail {game.id}
                    </span>
                  )}
                </div>

                <div className="flex items-start justify-between gap-2">
                  <h3
                    className="text-xl font-bold text-primary mb-3"
                    style={{ fontFamily: 'var(--font-crimson-pro)' }}
                  >
                    {game.title}
                  </h3>
                  {game.isNew && (
                    <span className="mt-1 rounded-full bg-secondary/15 px-3 py-1 text-xs font-semibold text-secondary">
                      NEW
                    </span>
                  )}
                </div>

                {!game.isPlaceholder ? (
                  <div className="text-sm text-text/80 mb-4 space-y-2 flex-grow">
                    <div>
                      <strong className="text-secondary">🎯 Mục tiêu:</strong>
                      <ul className="list-disc list-inside pl-1 text-xs text-text/70 mt-1">
                        {game.objectives.map((obj, i) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>

                    <p>
                      <strong className="text-secondary">🕹 Gameplay:</strong>{' '}
                      {game.gameplay}
                    </p>

                    <div>
                      <strong className="text-secondary">🧠 Kiến thức:</strong>
                      <ul className="list-disc list-inside pl-1 text-xs text-text/70 mt-1">
                        {game.knowledge.map((k, i) => (
                          <li key={i}>{k}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-text/80 mb-4 line-clamp-2 flex-grow">
                    Mô tả ngắn về nội dung của trò chơi số {game.id}. Tại đây sẽ
                    là nơi hiển thị thông tin chi tiết.
                  </p>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-xs text-text/50 uppercase tracking-wider">
                    {game.id > unlockedLevel ? (
                      <span className="flex items-center gap-1 text-red-400">
                        <FaLock size={12} /> Locked
                      </span>
                    ) : !game.isPlaceholder ? (
                      'Ready to Play'
                    ) : (
                      'Coming Soon'
                    )}
                  </span>
                  <button
                    onClick={() => handlePlay(game)}
                    disabled={game.id > unlockedLevel}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      game.id > unlockedLevel
                        ? 'bg-white/5 text-gray-500 cursor-not-allowed'
                        : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    {!game.isPlaceholder ? 'Chơi ngay' : 'Chi tiết'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Game Overlays */}
      {activeGameId === 1 && (
        <MiniGame1
          onClose={() => setActiveGameId(null)}
          onComplete={() => handleLevelComplete(1)}
        />
      )}
      {activeGameId === 2 && (
        <MiniGame2
          onClose={() => setActiveGameId(null)}
          onComplete={() => handleLevelComplete(2)}
        />
      )}
      {activeGameId === 3 && (
        <MiniGame3
          onClose={() => setActiveGameId(null)}
          onComplete={() => handleLevelComplete(3)}
        />
      )}
      {activeGameId === 4 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative min-h-screen">
            <button
              onClick={() => setActiveGameId(null)}
              className="fixed top-4 right-4 z-50 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 border border-white/20"
            >
              Đóng
            </button>
            <MiniGame4 onExit={() => setActiveGameId(null)} />
          </div>
        </div>
      )}
      {activeGameId === 5 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative min-h-screen">
            <button
              onClick={() => setActiveGameId(null)}
              className="fixed top-4 right-4 z-50 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 border border-white/20"
            >
              Đóng
            </button>
            <MiniGame5 onExit={() => setActiveGameId(null)} />
          </div>
        </div>
      )}
      {activeGameId === 6 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative min-h-screen">
            <button
              onClick={() => setActiveGameId(null)}
              className="fixed top-4 right-4 z-50 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 border border-white/20"
            >
              Đóng
            </button>
            <MiniGame6 onExit={() => setActiveGameId(null)} />
          </div>
        </div>
      )}
      {activeGameId === 7 && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative min-h-screen">
            <button
              onClick={() => setActiveGameId(null)}
              className="fixed top-4 right-4 z-50 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 border border-white/20"
            >
              Đóng
            </button>
            <MiniGame7
              onExit={() => setActiveGameId(null)}
              onComplete={() => handleLevelComplete(7)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGame;
