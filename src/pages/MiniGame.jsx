import Navbar from '../components/Navbar';
import { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import MiniGame1 from '../components/games/MiniGame1';
import MiniGame2 from '../components/games/MiniGame2';
import MiniGame3 from '../components/games/MiniGame3';

const MiniGame = () => {
  const [activeGameId, setActiveGameId] = useState(null);
  const [unlockedLevel, setUnlockedLevel] = useState(1);

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
    ...Array.from({ length: 4 }).map((_, i) => ({
      id: i + 4,
      title: `Mini Game ${i + 4}`,
      isPlaceholder: true,
    })),
  ];

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
            <p
              className="text-lg text-text mb-12"
              style={{ fontFamily: 'var(--font-atkinson)' }}
            >
              Nội dung Mini-game đang được chuẩn bị. Bạn có thể chọn Game hoặc
              quay lại Đại sảnh gương.
            </p>
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

                <h3
                  className="text-xl font-bold text-primary mb-3"
                  style={{ fontFamily: 'var(--font-crimson-pro)' }}
                >
                  {game.title}
                </h3>

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
                    onClick={() => {
                      if (game.id <= unlockedLevel && !game.isPlaceholder) {
                        setActiveGameId(game.id);
                      }
                    }}
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
    </div>
  );
};

export default MiniGame;
