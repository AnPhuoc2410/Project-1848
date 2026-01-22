import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SHEETS_API_URL = import.meta.env.VITE_SHEETS_URL;

export default function TestSheets() {
  const navigate = useNavigate();
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);

  // Test data form
  const [formData, setFormData] = useState({
    playerA: 'Test Player A',
    playerB: 'Test Player B',
    game1: 60,
    game2: 90,
    game3: 120,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name.includes('game') ? parseInt(value) || 0 : value,
    }));
  };

  // Test POST
  const testPost = async () => {
    setLoading(true);
    setResult('');

    const payload = {
      ...formData,
      total: formData.game1 + formData.game2 + formData.game3,
      timestamp: new Date().toISOString(),
    };

    try {
      const response = await fetch(SHEETS_API_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      setResult(
        `✅ POST thành công!\n\nPayload:\n${JSON.stringify(payload, null, 2)}\n\n(Kiểm tra Google Sheet để xem dữ liệu)`
      );
    } catch (error) {
      setResult(`❌ Lỗi POST: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test GET
  const testGet = async () => {
    setLoading(true);
    setResult('');
    setLeaderboard([]);

    try {
      const response = await fetch(`${SHEETS_API_URL}?action=get`);
      const data = await response.json();
      setLeaderboard(data);
      setResult(`✅ GET thành công! Nhận được ${data.length} records`);
    } catch (error) {
      setResult(`❌ Lỗi GET: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
            🧪 TEST SHEETS API
          </h1>
        </div>
        <button
          onClick={() => navigate('/lobby')}
          className="px-4 py-2 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
        >
          ← Back to Lobby
        </button>
      </header>

      {/* Main Content */}
      <div className="relative z-10 p-6 max-w-4xl mx-auto">
        {/* API URL Status */}
        <div className="game-card mb-6">
          <h3 className="card-title">📡 API URL</h3>
          <div
            className={`p-3 rounded-lg ${SHEETS_API_URL ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
          >
            {SHEETS_API_URL || '❌ Chưa set VITE_SHEETS_URL trong .env'}
          </div>
        </div>

        {/* Test POST Form */}
        <div className="game-card mb-6">
          <h3 className="card-title">📤 Test POST (Thêm data)</h3>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                Player A
              </label>
              <input
                type="text"
                name="playerA"
                value={formData.playerA}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                Player B
              </label>
              <input
                type="text"
                name="playerB"
                value={formData.playerB}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                Game 1 (giây)
              </label>
              <input
                type="number"
                name="game1"
                value={formData.game1}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                Game 2 (giây)
              </label>
              <input
                type="number"
                name="game2"
                value={formData.game2}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text/70 mb-1">
                Game 3 (giây)
              </label>
              <input
                type="number"
                name="game3"
                value={formData.game3}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-700">
            <strong>Total:</strong>{' '}
            {formatTime(formData.game1 + formData.game2 + formData.game3)}
          </div>

          <button
            onClick={testPost}
            disabled={loading || !SHEETS_API_URL}
            className="btn-check w-full"
          >
            {loading ? '⏳ Đang gửi...' : '📤 POST Test Data'}
          </button>
        </div>

        {/* Test GET */}
        <div className="game-card mb-6">
          <h3 className="card-title">📥 Test GET (Lấy leaderboard)</h3>
          <button
            onClick={testGet}
            disabled={loading || !SHEETS_API_URL}
            className="btn-secondary w-full"
          >
            {loading ? '⏳ Đang tải...' : '📥 GET Leaderboard'}
          </button>

          {leaderboard.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-2 text-left">#</th>
                    <th className="py-2 px-2 text-left">Player A</th>
                    <th className="py-2 px-2 text-left">Player B</th>
                    <th className="py-2 px-2 text-center">G1</th>
                    <th className="py-2 px-2 text-center">G2</th>
                    <th className="py-2 px-2 text-center">G3</th>
                    <th className="py-2 px-2 text-center">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((item, i) => (
                    <tr key={i} className="border-b border-border/30">
                      <td className="py-2 px-2">{i + 1}</td>
                      <td className="py-2 px-2">{item.playerA}</td>
                      <td className="py-2 px-2">{item.playerB}</td>
                      <td className="py-2 px-2 text-center">
                        {formatTime(item.game1)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {formatTime(item.game2)}
                      </td>
                      <td className="py-2 px-2 text-center">
                        {formatTime(item.game3)}
                      </td>
                      <td className="py-2 px-2 text-center font-bold text-yellow-600">
                        {formatTime(item.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div className="game-card">
            <h3 className="card-title">📋 Kết quả</h3>
            <pre className="p-4 bg-gray-100 rounded-lg text-sm whitespace-pre-wrap overflow-x-auto">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
