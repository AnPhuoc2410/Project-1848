import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BRANCHES = [
  {
    key: 'legislative',
    name: 'Lập pháp',
    agency: 'Quốc hội',
    mission: 'Làm luật, sửa đổi Hiến pháp.',
    accent: 'from-violet-500 to-fuchsia-600',
    icon: '📜',
  },
  {
    key: 'executive',
    name: 'Hành pháp',
    agency: 'Chính phủ',
    mission: 'Quản lý, điều hành các hoạt động xã hội.',
    accent: 'from-emerald-500 to-teal-500',
    icon: '🛠️',
  },
  {
    key: 'judicial',
    name: 'Tư pháp',
    agency: 'Tòa án, Viện kiểm sát',
    mission: 'Xét xử và kiểm sát hoạt động tư pháp.',
    accent: 'from-sky-500 to-blue-600',
    icon: '⚖️',
  },
];

const AGENCY_POOL = BRANCHES.map((b, index) => ({
  id: `agency-${b.key}`,
  label: b.agency,
  branchKey: b.key,
  order: index,
}));

const FUNCTION_POOL = BRANCHES.map((b, index) => ({
  id: `mission-${b.key}`,
  label: b.mission,
  branchKey: b.key,
  order: index,
}));

const SCENARIO_CHOICES = [
  {
    id: 'complaint',
    text: 'Gửi đơn khiếu nại/tố cáo đến cơ quan có thẩm quyền hoặc cơ quan công an.',
    correct: true,
  },
  {
    id: 'citizen-audit',
    text: 'Tham gia giám sát thông qua Ban thanh tra nhân dân tại địa phương.',
    correct: true,
  },
  {
    id: 'expose-online',
    text: 'Đăng ngay lên mạng xã hội với thông tin chưa kiểm chứng.',
    correct: false,
  },
  {
    id: 'ignore',
    text: 'Làm ngơ vì sợ phiền phức hoặc ngại va chạm.',
    correct: false,
  },
  {
    id: 'confront',
    text: 'Tự ý đối đầu, gây rối.',
    correct: false,
  },
];

export default function MiniGame4({ onExit }) {
  const initialAssignments = useMemo(
    () =>
      BRANCHES.reduce((acc, b) => {
        acc[b.key] = { agency: null, mission: null };
        return acc;
      }, {}),
    []
  );

  const [assignments, setAssignments] = useState(initialAssignments);
  const [agencies, setAgencies] = useState(AGENCY_POOL);
  const [missions, setMissions] = useState(FUNCTION_POOL);
  const [feedback, setFeedback] = useState('');
  const [scenarioPicked, setScenarioPicked] = useState([]);
  const [scenarioResult, setScenarioResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null); // null | 'correct' | 'incorrect'
  const [confirmedProgress, setConfirmedProgress] = useState(0);

  const navigate = useNavigate();

  const correctCount = BRANCHES.filter(
    (b) =>
      assignments[b.key].agency === `agency-${b.key}` &&
      assignments[b.key].mission === `mission-${b.key}`
  ).length;

  const showToast = (text) => {
    setFeedback(text);
    setTimeout(() => setFeedback(''), 2200);
  };

  const resetMatching = () => {
    setAssignments(initialAssignments);
    setAgencies(AGENCY_POOL);
    setMissions(FUNCTION_POOL);
    setFeedback('');
    setMatchResult(null);
    setConfirmedProgress(0);
  };

  const handleDragStart = (e, payload) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(payload));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, branchKey, slot) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('text/plain');
    if (!raw) return;
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch (err) {
      return;
    }

    const { type, id, branchKey: itemBranch } = payload;
    if (!type || !id) return;

    if (slot === 'agency' && type === 'agency') {
      // Return previously assigned agency to pool (if any) to avoid losing it
      const currentAgency = assignments[branchKey].agency;
      if (currentAgency && currentAgency !== id) {
        const found = AGENCY_POOL.find((a) => a.id === currentAgency);
        if (found) {
          setAgencies((prev) =>
            [...prev, found].sort((a, b) => a.order - b.order)
          );
        }
      }
      setAssignments((prev) => ({
        ...prev,
        [branchKey]: { ...prev[branchKey], agency: id },
      }));
      setAgencies((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    if (slot === 'mission' && type === 'mission') {
      // Return previously assigned mission to pool (if any) to avoid losing it
      const currentMission = assignments[branchKey].mission;
      if (currentMission && currentMission !== id) {
        const found = FUNCTION_POOL.find((m) => m.id === currentMission);
        if (found) {
          setMissions((prev) =>
            [...prev, found].sort((a, b) => a.order - b.order)
          );
        }
      }
      setAssignments((prev) => ({
        ...prev,
        [branchKey]: { ...prev[branchKey], mission: id },
      }));
      setMissions((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const returnToPool = (branchKey, slot) => {
    const current = assignments[branchKey];
    if (slot === 'agency' && current.agency) {
      const found = AGENCY_POOL.find((a) => a.id === current.agency);
      if (found)
        setAgencies((prev) =>
          [...prev, found].sort((a, b) => a.order - b.order)
        );
      setAssignments((prev) => ({
        ...prev,
        [branchKey]: { ...prev[branchKey], agency: null },
      }));
    }
    if (slot === 'mission' && current.mission) {
      const found = FUNCTION_POOL.find((m) => m.id === current.mission);
      if (found)
        setMissions((prev) =>
          [...prev, found].sort((a, b) => a.order - b.order)
        );
      setAssignments((prev) => ({
        ...prev,
        [branchKey]: { ...prev[branchKey], mission: null },
      }));
    }
  };

  const toggleScenarioChoice = (id) => {
    setScenarioPicked((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
    setScenarioResult(null);
  };

  const evaluateScenario = () => {
    const correctIds = SCENARIO_CHOICES.filter((c) => c.correct).map(
      (c) => c.id
    );
    const isCorrect =
      correctIds.length === scenarioPicked.length &&
      correctIds.every((id) => scenarioPicked.includes(id));

    const missing = correctIds.filter((id) => !scenarioPicked.includes(id));
    const extra = scenarioPicked.filter((id) => !correctIds.includes(id));

    setScenarioResult({ isCorrect, missing, extra });
  };

  const handleConfirmMatches = () => {
    const allAssigned = BRANCHES.every(
      (b) => assignments[b.key].agency && assignments[b.key].mission
    );

    if (!allAssigned) {
      showToast(
        'Hãy ghép đủ cơ quan và chức năng cho cả 3 nhánh trước khi xác nhận.'
      );
      setMatchResult(null);
      return;
    }

    const allCorrect = BRANCHES.every(
      (b) =>
        assignments[b.key].agency === `agency-${b.key}` &&
        assignments[b.key].mission === `mission-${b.key}`
    );

    setMatchResult(allCorrect ? 'correct' : 'incorrect');
    setConfirmedProgress(correctCount);
    setFeedback('');
  };

  const handleExit = () => {
    if (onExit) {
      onExit();
      return;
    }
    navigate('/mini-game');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0d1a2f] to-[#0b1220] text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,68,0,0.08),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.08),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-14 md:py-20">
        <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="uppercase tracking-[0.2em] text-xs text-blue-200/70 mb-2">
              Mini-game 4 · Quyền lực nhà nước
            </p>
            <h1
              className="text-3xl md:text-4xl font-black text-white drop-shadow"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              Phân định trách nhiệm & Quyền làm chủ
            </h1>
            <p
              className="text-sm md:text-base text-slate-200/80 mt-3 max-w-2xl"
              style={{ fontFamily: 'var(--font-atkinson)' }}
            >
              Kéo thả để ghép đúng 3 nhánh quyền lực và chọn hành động đúng khi
              gặp tình huống tham nhũng. Mục tiêu: hiểu rõ nguyên tắc "Dân biết,
              dân bàn, dân làm, dân kiểm tra, dân giám sát, dân thụ hưởng".
            </p>
          </div>
          <div className="w-full md:w-72">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-5 shadow-lg">
              <div
                className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"
                aria-hidden
              />
              <div className="relative flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-400 to-pink-500 flex items-center justify-center text-2xl">
                  🎮
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-200/70">
                    Mục tiêu
                  </p>
                  <p className="font-semibold text-white">
                    Ghép đúng 3/3 + chọn đúng 2 hành động
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="mt-12 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200/80">
                Bước 1
              </p>
              <h2 className="text-2xl font-bold text-white">
                Ghép đúng 3 nhánh quyền lực (Phân định trách nhiệm)
              </h2>
              <p className="text-sm text-slate-200/80 max-w-2xl">
                Bạn cần kéo thả hoặc nối các cơ quan tương ứng với chức năng của
                chúng. Quyền lực nhà nước thống nhất nhưng có sự phân công, phối
                hợp.
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3 text-sm text-slate-200/80">
              <button
                onClick={handleConfirmMatches}
                className="rounded-lg bg-emerald-500 px-3 py-2 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
              >
                ✓ Xác nhận ghép
              </button>
              <button
                onClick={resetMatching}
                className="rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 transition"
              >
                Làm lại
              </button>
            </div>
          </div>

          <div className="min-h-[20px] pt-1 text-sm text-amber-200 md:text-right md:pl-10">
            {feedback ? feedback : ''}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-200/70">
            <span className="rounded-full border border-white/10 px-3 py-1">
              Tiến độ hiện tại: {confirmedProgress}/3 đúng
            </span>
            {matchResult === 'correct' && (
              <span className="rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">
                🎉 Ghép chính xác!
              </span>
            )}
            {matchResult === 'incorrect' && (
              <span className="rounded-full bg-amber-500/15 px-3 py-1 text-amber-100">
                ⚠️ Cần chỉnh lại, thử kiểm tra nhãn nhánh quyền lực.
              </span>
            )}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4 md:grid-cols-3">
              {BRANCHES.map((branch) => {
                const assignedAgency = assignments[branch.key].agency;
                const assignedMission = assignments[branch.key].mission;
                const agencyLabel = AGENCY_POOL.find(
                  (a) => a.id === assignedAgency
                )?.label;
                const missionLabel = FUNCTION_POOL.find(
                  (m) => m.id === assignedMission
                )?.label;
                const complete =
                  assignedAgency === `agency-${branch.key}` &&
                  assignedMission === `mission-${branch.key}`;

                return (
                  <div
                    key={branch.key}
                    className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg transition ${complete ? 'ring-2 ring-emerald-400/80' : 'hover:border-white/20'}`}
                  >
                    <div
                      className={`absolute inset-0 opacity-30 bg-gradient-to-br ${branch.accent}`}
                      aria-hidden
                    />
                    <div className="relative z-10 flex items-center gap-2">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                        {branch.icon}
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.15em] text-white/70">
                          Nhánh quyền lực
                        </p>
                        <p className="font-semibold text-white">
                          {branch.name}
                        </p>
                      </div>
                    </div>

                    <div className="relative z-10 mt-4 space-y-3">
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, branch.key, 'agency')}
                        className={`group rounded-xl border border-dashed px-3 py-3 transition ${
                          assignedAgency
                            ? 'border-white/30 bg-white/10'
                            : 'border-white/20 bg-transparent hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span>Cơ quan thực hiện</span>
                          {assignedAgency && (
                            <button
                              onClick={() => returnToPool(branch.key, 'agency')}
                              className="text-amber-200 hover:text-white"
                            >
                              Đổi
                            </button>
                          )}
                        </div>
                        <div className="mt-2 min-h-[44px] text-sm text-white/90">
                          {agencyLabel ? (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                              {agencyLabel}
                              {complete && (
                                <span className="text-emerald-300 text-xs"></span>
                              )}
                            </span>
                          ) : (
                            <span className="text-white/50">
                              Kéo thả cơ quan vào đây
                            </span>
                          )}
                        </div>
                      </div>

                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => handleDrop(e, branch.key, 'mission')}
                        className={`group rounded-xl border border-dashed px-3 py-3 transition ${
                          assignedMission
                            ? 'border-white/30 bg-white/10'
                            : 'border-white/20 bg-transparent hover:border-white/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-white/70">
                          <span>Chức năng chính</span>
                          {assignedMission && (
                            <button
                              onClick={() =>
                                returnToPool(branch.key, 'mission')
                              }
                              className="text-amber-200 hover:text-white"
                            >
                              Đổi
                            </button>
                          )}
                        </div>
                        <div className="mt-2 min-h-[44px] text-sm text-white/90">
                          {missionLabel ? (
                            <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2">
                              {missionLabel}
                              {complete && (
                                <span className="text-emerald-300 text-xs"></span>
                              )}
                            </span>
                          ) : (
                            <span className="text-white/50">
                              Kéo thả chức năng vào đây
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white mb-3">Cơ quan</p>
                <div className="flex flex-wrap gap-2">
                  {agencies.length === 0 && (
                    <span className="text-xs text-white/50">Đã ghép hết.</span>
                  )}
                  {agencies.map((item) => (
                    <button
                      key={item.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          ...item,
                          type: 'agency',
                          id: item.id,
                        })
                      }
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-white mb-3">
                  Chức năng
                </p>
                <div className="flex flex-wrap gap-2">
                  {missions.length === 0 && (
                    <span className="text-xs text-white/50">Đã ghép hết.</span>
                  )}
                  {missions.map((item) => (
                    <button
                      key={item.id}
                      draggable
                      onDragStart={(e) =>
                        handleDragStart(e, {
                          ...item,
                          type: 'mission',
                          id: item.id,
                        })
                      }
                      className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white hover:bg-white/10"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
            Bước 2
          </p>
          <h2 className="text-2xl font-bold text-white">
            Xử lý tình huống tham nhũng (Quyền làm chủ)
          </h2>
          <p className="text-sm text-slate-200/80 max-w-2xl">
            Khi phát hiện hành vi tham nhũng, hãy chọn các hành động đúng với
            quy định pháp luật. Mục tiêu: khẳng định vai trò của công dân trong
            giám sát và tố giác – "Dân biết, dân bàn, dân làm, dân kiểm tra, dân
            giám sát, dân thụ hưởng".
          </p>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-amber-500/20 text-amber-100 flex items-center justify-center text-xl">
                  🧭
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Tình huống</p>
                  <p className="text-xs text-slate-200/80">
                    Bạn phát hiện dấu hiệu tham nhũng tại địa phương.
                  </p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-slate-200/90">
                <p>
                  Trong quá trình sinh hoạt cộng đồng, bạn nhận thấy một số cán
                  bộ địa phương có biểu hiện lợi dụng chức vụ để trục lợi cá
                  nhân{' '}
                </p>
                <p>
                  Bạn nghe gia đình ông Phước làm hồ sơ tách thửa đất để chia
                  cho các con. Hồ sơ đã nộp tại Văn phòng Đăng ký đất đai được 4
                  tháng nhưng chưa thấy phản hồi. Khi ông Phước đến hỏi, cán bộ
                  An nói: "Hồ sơ đang bị tắc ở trên, khó lắm. Muốn nhanh thì
                  phải có 'chi phí ngoại giao' 50 triệu đồng, nếu không thì cứ
                  chờ theo thứ tự, có khi cả năm."
                </p>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-semibold text-white mb-2">
                Chọn hành động đúng
              </p>
              <div className="space-y-2">
                {SCENARIO_CHOICES.map((choice) => (
                  <label
                    key={choice.id}
                    className={`flex gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                      scenarioPicked.includes(choice.id)
                        ? 'border-emerald-400/70 bg-emerald-500/10'
                        : 'border-white/15 bg-white/5 hover:border-white/25'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={scenarioPicked.includes(choice.id)}
                      onChange={() => toggleScenarioChoice(choice.id)}
                      className="mt-1 accent-emerald-400"
                    />
                    <span className="text-white/90">{choice.text}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <button
                  onClick={evaluateScenario}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                >
                  Kiểm tra đáp án
                </button>
                <button
                  onClick={() => {
                    setScenarioPicked([]);
                    setScenarioResult(null);
                  }}
                  className="rounded-lg border border-white/15 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Chọn lại
                </button>
              </div>

              {scenarioResult && (
                <div
                  className={`mt-4 rounded-xl border px-4 py-3 text-sm ${
                    scenarioResult.isCorrect
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-50'
                      : 'border-amber-400/40 bg-amber-500/10 text-amber-50'
                  }`}
                >
                  {scenarioResult.isCorrect ? (
                    <>
                      <p className="font-semibold">🎉 Chính xác!</p>
                      <p className="text-emerald-50/90">
                        Bạn đã chọn đúng cả Khiếu nại/Tố cáo và Giám sát cộng
                        đồng. Đây là cách thực thi quyền làm chủ trong Nhà nước
                        pháp quyền XHCN.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="font-semibold">⚠️ Cần điều chỉnh</p>
                      {scenarioResult.extra.length > 0 && (
                        <p className="text-amber-50/90">
                          Không phù hợp:{' '}
                          {scenarioResult.extra
                            .map(
                              (id) =>
                                SCENARIO_CHOICES.find((c) => c.id === id)?.text
                            )
                            .join(', ')}
                          .
                        </p>
                      )}
                      <p className="text-amber-50/80 mt-2">
                        Gợi ý: ưu tiên gửi đơn đến cơ quan thẩm quyền và tham
                        gia giám sát thông qua Ban thanh tra nhân dân; tránh tự
                        xử hoặc lan truyền tin chưa kiểm chứng.
                      </p>
                    </>
                  )}
                </div>
              )}

              {matchResult === 'correct' && scenarioResult?.isCorrect && (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="text-sm text-emerald-50">
                    ✅ Hoàn thành cả hai bước! Bạn có thể quay lại sảnh.
                  </div>
                  <button
                    onClick={handleExit}
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                  >
                    Tiếp tục
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
