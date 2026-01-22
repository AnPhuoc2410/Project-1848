import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Google Sheets Web App URL - User needs to replace this with their actual URL
const SHEETS_API_URL = 'YOUR_GOOGLE_SHEETS_WEB_APP_URL';

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Get times from sessionStorage
  const times = JSON.parse(sessionStorage.getItem('gameTimes') || '{}');
  const hasCompletedAllGames = times.game1 && times.game2 && times.game3;

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalTime =
    (times.game1 || 0) + (times.game2 || 0) + (times.game3 || 0);

  // Submit score to Google Sheets
  const submitScore = async () => {
    if (!hasCompletedAllGames || submitted) return;

    try {
      const payload = {
        playerA: times.playerA || 'Player A',
        playerB: times.playerB || 'Player B',
        game1: times.game1,
        game2: times.game2,
        game3: times.game3,
        total: totalTime,
        timestamp: new Date().toISOString(),
      };

      // POST to Google Sheets
      if (SHEETS_API_URL !== 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
        await fetch(SHEETS_API_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      setSubmitted(true);
      sessionStorage.removeItem('gameTimes'); // Clear after submit
    } catch (err) {
      console.error('Error submitting score:', err);
      setError('Không thể lưu kết quả. Vui lòng thử lại.');
    }
  };

  // Fetch leaderboard from Google Sheets
  const fetchLeaderboard = async () => {
    try {
      if (SHEETS_API_URL !== 'YOUR_GOOGLE_SHEETS_WEB_APP_URL') {
        const response = await fetch(`${SHEETS_API_URL}?action=get`);
        const data = await response.json();
        setLeaderboard(data.slice(0, 20)); // Top 20
      } else {
        // Demo data when no API URL is set
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
      }
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    submitScore();
    fetchLeaderboard();
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
          onClick={() => navigate('/lobby')}
          className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
        >
          Chơi lại
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-5xl mx-auto">
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
              <p className="text-center text-green-600 mt-4">
                ✓ Đã lưu kết quả!
              </p>
            )}
            {error && <p className="text-center text-red-600 mt-4">{error}</p>}
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="game-card">
          <h3 className="card-title">🥇 Top 20 Cặp Đôi</h3>

          {loading ? (
            <div className="text-center py-8">
              <div className="three-body mx-auto">
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
                <div className="three-body__dot"></div>
              </div>
              <p className="mt-4 text-text/60">Đang tải bảng xếp hạng...</p>
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
                      Game 1
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-text/60">
                      Game 2
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-text/60">
                      Game 3
                    </th>
                    <th className="py-3 px-2 text-center text-sm font-medium text-yellow-600">
                      Tổng
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={index}
                      className={`border-b border-border/50 ${index < 3 ? 'bg-yellow-50' : ''}`}
                    >
                      <td className="py-3 px-2">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                        {index > 2 && (
                          <span className="text-text/50">{index + 1}</span>
                        )}
                      </td>
                      <td className="py-3 px-2 font-medium">{entry.playerA}</td>
                      <td className="py-3 px-2 font-medium">{entry.playerB}</td>
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
                  ))}
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

        {/* Instructions */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-medium text-blue-700 mb-2">
            📋 Hướng dẫn cài đặt Google Sheets
          </h4>
          <ol className="text-sm text-blue-600 space-y-1">
            <li>
              1. Tạo Google Sheet với các cột: PlayerA, PlayerB, Game1, Game2,
              Game3, Total, Timestamp
            </li>
            <li>2. Vào Extensions → Apps Script</li>
            <li>3. Tạo Web App với doPost và doGet functions</li>
            <li>
              4. Deploy và copy URL vào SHEETS_API_URL trong Leaderboard.jsx
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}
