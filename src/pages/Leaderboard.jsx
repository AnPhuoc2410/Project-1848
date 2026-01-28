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

  const handlePlayAgain = () => {
    sessionStorage.removeItem('gameTimes');
    sessionStorage.removeItem('scoreSubmitted');
    navigate('/lobby');
  };

  return (
    <div className="game-page min-h-screen pb-8">
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
          onClick={handlePlayAgain}
          className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
        >
          Chơi lại
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* Debug Info */}
        {!SHEETS_API_URL && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            ⚠️ Chưa cấu hình VITE_SHEETS_URL. Đang dùng dữ liệu giả lập.
          </div>
        )}

        {/* ========== HERO CARD: Team Result ========== */}
        {hasCompletedAllGames && (
          <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-2 border-amber-200 shadow-lg">
            {/* Card Header */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl">🎉</span>
              <h3 className="text-xl font-bold text-amber-700">
                Kết quả của nhóm bạn
              </h3>
              <span className="text-2xl">🎉</span>
            </div>

            {/* Main Content: 3 Columns */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* LEFT: The Team */}
              <div className="flex items-center gap-3 bg-white/70 px-5 py-4 rounded-xl border border-amber-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    A
                  </div>
                  <span className="font-semibold text-gray-800">
                    {times.playerA || 'Player A'}
                  </span>
                </div>
                <span className="text-amber-400 font-bold text-xl">&</span>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                    B
                  </div>
                  <span className="font-semibold text-gray-800">
                    {times.playerB || 'Player B'}
                  </span>
                </div>
              </div>

              {/* MIDDLE: Game Breakdown */}
              <div className="flex items-center gap-4">
                <div className="text-center px-4 py-2 bg-white/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    G1
                  </p>
                  <p className="font-mono font-semibold text-gray-700">
                    {formatTime(times.game1)}
                  </p>
                </div>
                <span className="text-gray-300">+</span>
                <div className="text-center px-4 py-2 bg-white/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    G2
                  </p>
                  <p className="font-mono font-semibold text-gray-700">
                    {formatTime(times.game2)}
                  </p>
                </div>
                <span className="text-gray-300">+</span>
                <div className="text-center px-4 py-2 bg-white/50 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
                    G3
                  </p>
                  <p className="font-mono font-semibold text-gray-700">
                    {formatTime(times.game3)}
                  </p>
                </div>
              </div>

              {/* RIGHT: Hero Metric - Total Time */}
              <div className="text-center px-6 py-4 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl shadow-md">
                <p className="text-xs text-amber-900 uppercase tracking-wider font-medium">
                  Tổng thời gian
                </p>
                <p className="font-mono font-black text-4xl text-white drop-shadow">
                  {formatTime(totalTime)}
                </p>
              </div>
            </div>

            {/* Status Messages */}
            {submitted && (
              <p className="text-center text-green-600 mt-5 font-semibold flex items-center justify-center gap-2">
                <span className="inline-block w-5 h-5 bg-green-500 rounded-full text-white text-xs flex items-center justify-center">
                  ✓
                </span>
                Đã lưu kết quả lên hệ thống!
              </p>
            )}
            {error && (
              <p className="text-center text-red-600 mt-5 font-medium">
                {error}
              </p>
            )}
          </div>
        )}

        {/* ========== LEADERBOARD TABLE ========== */}
        <div className="game-card">
          <h3 className="card-title flex items-center gap-2">
            <span>🥇</span>
            <span>Top 20 Cặp Đôi Xuất Sắc Nhất</span>
          </h3>

          {loading ? (
            <div className="text-center py-12">
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
                  <tr className="border-b-2 border-gray-200 bg-gray-50">
                    <th className="py-3 px-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
                    <th className="py-3 px-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Đội
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      G1
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      G2
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      G3
                    </th>
                    <th className="py-3 px-3 text-right text-xs font-semibold text-amber-600 uppercase tracking-wider w-24">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaderboard.map((entry, index) => {
                    const isMyTeam =
                      hasCompletedAllGames &&
                      entry.playerA === (times.playerA || 'Unknown A') &&
                      entry.playerB === (times.playerB || 'Unknown B') &&
                      entry.total === totalTime;

                    // Rank styling
                    const rankStyles = {
                      0: 'bg-gradient-to-r from-yellow-100 to-amber-50 border-l-4 border-l-yellow-400',
                      1: 'bg-gradient-to-r from-gray-100 to-slate-50 border-l-4 border-l-gray-400',
                      2: 'bg-gradient-to-r from-orange-100 to-amber-50 border-l-4 border-l-orange-400',
                    };

                    const myTeamStyle =
                      'bg-green-100 border-l-4 border-l-green-500 ring-2 ring-green-300 ring-inset';

                    return (
                      <tr
                        key={index}
                        className={`transition-all hover:bg-gray-50 ${
                          isMyTeam ? myTeamStyle : rankStyles[index] || ''
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-3 text-center">
                          {index === 0 && <span className="text-2xl">🥇</span>}
                          {index === 1 && <span className="text-2xl">🥈</span>}
                          {index === 2 && <span className="text-2xl">🥉</span>}
                          {index > 2 && (
                            <span className="text-gray-400 font-medium">
                              {index + 1}
                            </span>
                          )}
                        </td>

                        {/* Team Names */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-800">
                              {entry.playerA}
                            </span>
                            <span className="text-gray-300">&</span>
                            <span className="font-medium text-gray-800">
                              {entry.playerB}
                            </span>
                            {isMyTeam && (
                              <span className="ml-2 px-2 py-0.5 bg-green-500 text-white text-xs rounded-full font-semibold">
                                Bạn
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Game Times - Right Aligned */}
                        <td className="py-4 px-3 text-right font-mono text-sm text-gray-600">
                          {formatTime(entry.game1)}
                        </td>
                        <td className="py-4 px-3 text-right font-mono text-sm text-gray-600">
                          {formatTime(entry.game2)}
                        </td>
                        <td className="py-4 px-3 text-right font-mono text-sm text-gray-600">
                          {formatTime(entry.game3)}
                        </td>

                        {/* Total - Highlighted */}
                        <td className="py-4 px-3 text-right">
                          <span className="font-mono font-bold text-amber-600 text-lg">
                            {formatTime(entry.total)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {leaderboard.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="text-4xl mb-2">🏆</div>
                        Chưa có dữ liệu. Hãy là người đầu tiên!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ========== BOTTOM CTA BUTTON ========== */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handlePlayAgain}
            className="group px-8 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-3"
          >
            <span>🎮</span>
            <span>Chơi ván mới</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
