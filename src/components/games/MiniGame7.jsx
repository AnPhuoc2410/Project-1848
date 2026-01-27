import { useEffect, useMemo, useState } from 'react';

const clamp = (v, min = 0, max = 100) => Math.min(max, Math.max(min, v));

const ACTIONS = [
  {
    id: 'share',
    title: 'Việc nhà',
    detail: 'Cả nhà cùng lập lịch, chia theo thời gian và sở trường.',
    delta: 15,
    topic: 'Bình đẳng giới',
  },
  {
    id: 'rotate',
    title: 'Công việc',
    detail: 'Việc nặng luân phiên cho cả nam và nữ, không dồn cho một người.',
    delta: 10,
    topic: 'Bình đẳng giới',
  },
  {
    id: 'teach',
    title: 'Dạy con',
    detail:
      'Hướng dẫn con trai và con gái cùng học nấu ăn, dọn dẹp, tài chính.',
    delta: 12,
    topic: 'Giáo dục gia đình',
  },
  {
    id: 'dialog',
    title: 'Gia đình ',
    detail: 'Cùng đánh giá, khen ngợi, điều chỉnh công việc, chia sẻ cảm xúc.',
    delta: 11,
    topic: 'Giáo dục gia đình',
  },
  {
    id: 'listen',
    title: 'Lắng nghe và ghi nhận',
    detail:
      'Lắng nghe ý kiến, khen ngợi chỉ người mình thích khi họ hoàn thành việc.',
    delta: -16,
    topic: 'Tránh',
  },
  {
    id: 'budget',
    title: 'Ngân sách',
    detail:
      'Cùng thống nhất chi tiêu, không phân biệt giới trong quyết định tài chính.',
    delta: 9,
    topic: 'Giáo dục gia đình',
  },
  {
    id: 'dump',
    title: 'Việc nhà',
    detail: 'Quan niệm “việc nhà là việc của mẹ/vợ”.',
    delta: -28,
    topic: 'Tránh',
  },
  {
    id: 'blame',
    title: 'Hỗ trợ lẫn nhau',
    detail:
      'Mỗi người né tránh trách nhiệm, không giúp đỡ mà còn phàn nàn khi người khác làm.',
    delta: -22,
    topic: 'Tránh',
  },
  {
    id: 'ignore',
    title: 'Đóng góp của con',
    detail: 'Khi con hoàn thành phần việc không khen ngợi, xem nhẹ.',
    delta: -20,
    topic: 'Tránh',
  },
  {
    id: 'giftbias',
    title: 'Tặng quà',
    detail: 'Ưu ái con trai hoặc con gái, tạo bất công trong gia đình.',
    delta: -25,
    topic: 'Tránh',
  },
];

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export default function MiniGame7({ onExit, onComplete }) {
  const randomized = useMemo(() => shuffle(ACTIONS), []);
  const positiveIds = useMemo(
    () => ACTIONS.filter((a) => a.delta > 0).map((a) => a.id),
    []
  );

  const [happiness, setHappiness] = useState(40);
  const [picked, setPicked] = useState([]);
  const [feedback, setFeedback] = useState(null);

  const handlePick = (action) => {
    if (picked.includes(action.id)) return;
    const nextScore = clamp(happiness + action.delta);
    setHappiness(nextScore);
    setPicked((prev) => [...prev, action.id]);
    setFeedback({
      id: action.id,
      delta: action.delta,
      message:
        action.delta > 0
          ? 'Hành vi tích cực! Hạnh phúc được cải thiện.'
          : 'Hành vi chưa đúng, hạnh phúc bị ảnh hưởng.',
    });
  };

  const handleReset = () => {
    setHappiness(40);
    setPicked([]);
    setFeedback(null);
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  const success =
    positiveIds.every((id) => picked.includes(id)) && happiness > 70;

  useEffect(() => {
    if (success && onComplete) onComplete();
  }, [success, onComplete]);

  return (
    <div className="game-overlay-content bg-gradient-to-b from-[#0d1224] to-[#090d1a] text-white min-h-screen p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
            Mini-game 7 · Chương 7
          </p>
          <h1
            className="text-3xl md:text-4xl font-black"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Gia đình bình đẳng
          </h1>
          <p
            className="text-sm md:text-base text-white/80"
            style={{ fontFamily: 'var(--font-atkinson)' }}
          >
            Chọn hành vi đúng trong gia đình. Điểm hạnh phúc tăng/giảm theo lựa
            chọn của bạn.
          </p>
        </header>
        <section className="grid gap-4 md:grid-cols-3 items-center">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="uppercase tracking-[0.18em]">
                Hạnh phúc gia đình
              </span>
              <div className="flex items-center gap-2">
                {' '}
                {happiness <= 30 && (
                  <span className="text-rose-200 text-[1rem] font-semibold">
                    Nhà bạn thật buồn😞
                  </span>
                )}
                <span className="font-semibold text-white">{happiness}</span>
              </div>
            </div>
            <div className="h-3 w-full rounded-full bg-white/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  happiness >= 70
                    ? 'bg-emerald-400'
                    : happiness >= 50
                      ? 'bg-amber-300'
                      : 'bg-rose-400'
                }`}
                style={{ width: `${happiness}%` }}
              />
            </div>
            <p className="text-xs text-white/70">
              Việc nhà → ai làm? Chia sẻ công bằng, tôn trọng, giáo dục cùng
              nhau.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-white/80">
            <p className="font-semibold text-white">Mục tiêu</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Hiểu gia đình là tế bào xã hội.</li>
              <li>Thực hành bình đẳng giới, giáo dục gia đình.</li>
            </ul>
          </div>
        </section>{' '}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2 text-sm text-white/80">
          <p className="font-semibold text-white">Ghi nhớ</p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Bình đẳng giới bắt đầu từ việc nhà: chia đều, luân phiên, tôn
              trọng.
            </li>
            <li>
              Giáo dục gia đình là cùng học kỹ năng sống, giao tiếp không bạo
              lực.
            </li>
            <li>
              Phản hồi tích cực giúp tăng hạnh phúc; đổ lỗi làm suy giảm niềm
              tin.
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-white/80">
            Chọn hết hành vi. Hạnh phúc ≥ 70 để tiếp tục.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Làm lại
            </button>
            {success && (
              <button
                onClick={handleExit}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
              >
                Tiếp tục
              </button>
            )}
          </div>
        </div>
        <section className="grid gap-3 md:grid-cols-2">
          {randomized.map((action) => {
            const isPicked = picked.includes(action.id);
            const positive = action.delta > 0;
            return (
              <button
                key={action.id}
                onClick={() => handlePick(action)}
                disabled={isPicked}
                className={`text-left rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary/60 ${
                  isPicked ? 'opacity-80' : ''
                }`}
              >
                <h3 className="mt-2 text-base font-semibold text-white">
                  {action.title}
                </h3>
                <p className="text-sm text-white/80 leading-relaxed mt-1">
                  {action.detail}
                </p>
                {isPicked && (
                  <p
                    className={`mt-2 text-xs ${positive ? 'text-emerald-200' : 'text-rose-200'}`}
                  >
                    {positive
                      ? 'Bạn đã chọn hành vi đúng.'
                      : 'Hành vi này làm giảm hạnh phúc. Hãy rút kinh nghiệm.'}
                  </p>
                )}
              </button>
            );
          })}
        </section>
        <section className="space-y-3">
          {feedback && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                feedback.delta > 0
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-50'
                  : 'border-rose-500/50 bg-rose-500/10 text-rose-50'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
