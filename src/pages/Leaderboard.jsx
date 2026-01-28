import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Đảm bảo file .env của bạn có biến VITE_SHEETS_URL
const SHEETS_API_URL = import.meta.env.VITE_SHEETS_URL;

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Dùng ref để tránh chạy useEffect 2 lần (React 18 Strict Mode)
  const hasInitialized = useRef(false);

  // Get times from sessionStorage
  const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');

  // Kiểm tra xem đã hoàn thành đủ 3 game chưa
  const hasCompletedAllGames =
    times.game1 !== undefined &&
    times.game2 !== undefined &&
    times.game3 !== undefined;

  const formatTime = (seconds) => {
    if (seconds === undefined || seconds === null) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime =
    (times.game1 || 0) + (times.game2 || 0) + (times.game3 || 0);

  // 1. Hàm Gửi điểm (POST)
  const submitScore = async () => {
    console.log('--- Bắt đầu quy trình Submit Score ---');

    // Check các điều kiện chặn
    const alreadySubmitted =
      sessionStorage.getItem('scoreSubmitted') === 'true';

    if (!hasCompletedAllGames) {
      console.log('>> Chưa hoàn thành đủ game, bỏ qua submit.');
      return;
    }
    if (alreadySubmitted) {
      console.log('>> Đã submit trước đó (session flag), bỏ qua.');
      setSubmitted(true); // Vẫn hiện thông báo đã lưu
      return;
    }
    if (!times.isScoreSubmitter) {
      console.log(
        '>> User này không có quyền submit (là Player A hoặc truy cập trực tiếp).'
      );
      return;
    }
    if (!SHEETS_API_URL) {
      console.error('>> LỖI: Không tìm thấy VITE_SHEETS_URL trong .env');
      setError('Lỗi cấu hình: Thiếu API URL.');
      return;
    }

    try {
      const payload = {
        playerA: times.playerA || 'Unknown A',
        playerB: times.playerB || 'Unknown B',
        game1: times.game1,
        game2: times.game2,
        game3: times.game3,
        total: totalTime,
        timestamp: new Date().toLocaleString('sv-SE', {
          timeZone: 'Asia/Ho_Chi_Minh',
        }),
      };

      console.log('>> Đang gửi payload:', payload);

      // Gửi POST
      await fetch(SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors', // Quan trọng với Google Script
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('>> Submit thành công (no-cors mode)!');

      setSubmitted(true);
      sessionStorage.setItem('scoreSubmitted', 'true'); // Đánh dấu đã gửi
      // KHÔNG xóa gameTimes ngay, để còn hiển thị kết quả ở UI "Kết quả của bạn"
    } catch (err) {
      console.error('>> Lỗi khi submit score:', err);
      setError('Không thể lưu kết quả. Vui lòng thử lại.');
    }
  };

  // 2. Hàm Lấy bảng xếp hạng (GET)
  const fetchLeaderboard = async () => {
    console.log('--- Bắt đầu Fetch Leaderboard ---');

    if (!SHEETS_API_URL) {
      // Fallback data nếu chưa cấu hình URL
      console.log('>> Không có API URL, dùng Mock Data.');
      setLeaderboard([
        {
          playerA: 'Demo A',
          playerB: 'Demo B',
          game1: 60,
          game2: 120,
          game3: 90,
          total: 270,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      // Thêm tham số time để tránh cache
      const response = await fetch(
        `${SHEETS_API_URL}?action=get&t=${Date.now()}`
      );
      const data = await response.json();
      console.log('>> Đã nhận data leaderboard:', data.length, 'records');

      // Sắp xếp tăng dần theo total (thời gian ít nhất lên đầu)
      const sortedData = data.sort((a, b) => a.total - b.total);

      setLeaderboard(sortedData.slice(0, 20)); // Top 20
    } catch (err) {
      console.error('>> Lỗi fetching leaderboard:', err);
      // Fallback nếu lỗi mạng
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  // 3. UseEffect điều phối luồng chạy
  useEffect(() => {
    const initProcess = async () => {
      // Ngăn chạy 2 lần trên dev
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      // Bước 1: Gửi điểm trước
      await submitScore();

      // Bước 2: Đợi một chút để Google Sheet kịp cập nhật (Google Script hơi chậm)
      if (times.isScoreSubmitter && !sessionStorage.getItem('scoreSubmitted')) {
        console.log('>> Đợi Server xử lý...');
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        // Nếu chỉ vào xem hoặc đã submit rồi thì không cần đợi lâu
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Bước 3: Tải lại bảng xếp hạng mới nhất
      await fetchLeaderboard();

      // Bước 4: Nếu đã hoàn thành tất cả game, hiển thị thông báo đã lưu cho cả 2 player
      if (hasCompletedAllGames) {
        setSubmitted(true);
      }
    };

    initProcess();
  }, []);

  return (
    <div className="game-page min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
      </div>

      {/* Header */}
      <header className="game-header">
        <div className="flex items-center gap-4">
          <h1 className="special-font text-2xl font-black text-primary">
            🏆 LE<b>A</b>DERBOARD
          </h1>
        </div>
        <button
          onClick={() => {
            // Xóa session khi bấm chơi lại
            sessionStorage.removeItem('gameTimes');
            sessionStorage.removeItem('scoreSubmitted');
            navigate('/lobby');
          }}
          className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
        >
          Chơi lại
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
        {/* Debug Info (Tạm thời để kiểm tra URL, xóa sau khi chạy ngon) */}
        {!SHEETS_API_URL && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            ⚠️ Chưa cấu hình VITE_SHEETS_URL. Đang dùng dữ liệu giả lập.
          </div>
        )}

        {/* Your Score Card */}
        {hasCompletedAllGames && (
          <div className="game-card mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300">
            <h3 className="card-title text-yellow-700">🎉 Kết quả của bạn</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-text/60">Player A</p>
                <p className="font-bold text-lg">
                  {times.playerA || 'Player A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-text/60">Player B</p>
                <p className="font-bold text-lg">
                  {times.playerB || 'Player B'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-text/50">Game 1</p>
                <p className="font-bold text-secondary">
                  {formatTime(times.game1)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-text/50">Game 2</p>
                <p className="font-bold text-secondary">
                  {formatTime(times.game2)}
                </p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <p className="text-xs text-text/50">Game 3</p>
                <p className="font-bold text-secondary">
                  {formatTime(times.game3)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg border-2 border-yellow-400">
                <p className="text-xs text-yellow-600">Tổng</p>
                <p className="font-bold text-xl text-yellow-700">
                  {formatTime(totalTime)}
                </p>
              </div>
            </div>
            {submitted && (
              <p className="text-center text-green-600 mt-4 font-bold">
                ✓ Đã lưu kết quả lên hệ thống!
              </p>
            )}
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="game-card">
          <h3 className="card-title">🥇 Top 20 Cặp Đôi Xuất Sắc Nhất</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="three-body mx-auto">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <p className="mt-4 text-text/60">
                Đang cập nhật bảng xếp hạng...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-3 px-2 text-left text-sm font-medium text-text/60">
                      #
                    </th>
                    <th className="py-3 px-2 text-left text-sm font-medium text-text/60">
                      Player A
                    </th>
                    <th className="py-3 px-2 text-left text-sm font-medium text-text/60">
                      Player B
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-text/60">
                      G1
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-text/60">
                      G2
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-text/60">
                      G3
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-yellow-600">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => {
                    // Kiểm tra xem dòng này có phải nhóm mình không
                    const isMyTeam =
                      hasCompletedAllGames &&
                      entry.playerA === (times.playerA || 'Unknown A') &&
                      entry.playerB === (times.playerB || 'Unknown B') &&
                      entry.total === totalTime;

                    return (
                      <tr
                        key={index}
                        className={`border-b border-border/50 transition-all ${
                          isMyTeam
                            ? 'bg-green-100 border-l-4 border-l-green-500 animate-pulse'
                            : index < 3
                              ? 'bg-yellow-50'
                              : ''
                        }`}
                      >
                        <td className="py-3 px-2">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && (
                            <span className="text-text/50">{index + 1}</span>
                          )}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {entry.playerA}
                          {isMyTeam && (
                            <span className="ml-1 text-green-600">★</span>
                          )}
                        </td>
                        <td className="py-3 px-2 font-medium">
                          {entry.playerB}
                          {isMyTeam && (
                            <span className="ml-1 text-green-600">★</span>
                          )}
                        </td>
                        <td className="py-3 px-2 text-center text-sm">
                          {formatTime(entry.game1)}
                        </td>
                        <td className="py-3 px-2 text-center text-sm">
                          {formatTime(entry.game2)}
                        </td>
                        <td className="py-3 px-2 text-center text-sm">
                          {formatTime(entry.game3)}
                        </td>
                        <td className="py-3 px-2 text-center font-bold text-yellow-600">
                          {formatTime(entry.total)}
                        </td>
                      </tr>
                    );
                  })}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text/50">
                        Chưa có dữ liệu. Hãy là người đầu tiên!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
