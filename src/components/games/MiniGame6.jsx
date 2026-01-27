import { useMemo, useRef, useState } from 'react';

const CLUES = [
  {
    id: 'q4',
    prompt: 'Hình thức gia đình cá thể ra đời trong chế độ xã hội nào?',
    expected: 'chiem huu no le',
    reveal: 'o',
  },
  {
    id: 'q3',
    prompt: 'Thời kỳ giữa CNTB và CNXH?',
    expected: 'qua do',
    reveal: 'd',
  },
  {
    id: 'q2',
    prompt:
      'Chủ nghĩa xã hội dựa trên chế độ sở hữu nào về tư liệu sản xuất chủ yếu?',
    expected: 'cong huu',
    reveal: 'u',
  },
  {
    id: 'q1',
    prompt:
      'Giữa xã hội tư bản chủ nghĩa và xã hội cộng sản chủ nghĩa là một thời kỳ cải biến cách mạng từ xã hội này sang xã hội kia. Thích ứng với thời kỳ ấy là một thời kỳ?',
    expected: 'qua do chinh tri',
    reveal: 't',
  },
];

const SECRET_WORD = 'tudo';

const normalize = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const normalizeNoSpace = (str) => normalize(str).replace(/\s+/g, '');

export default function MiniGame6({ onExit }) {
  const meta = useMemo(
    () =>
      CLUES.map((clue) => {
        const normalized = normalizeNoSpace(clue.expected);
        const specialIndex = normalized.indexOf(clue.reveal.toLowerCase());
        return {
          ...clue,
          normalized,
          length: normalized.length,
          specialIndex,
        };
      }),
    []
  );

  const emptyAnswers = useMemo(
    () =>
      meta.reduce((acc, clue) => {
        acc[clue.id] = Array(clue.length).fill('');
        return acc;
      }, {}),
    [meta]
  );

  const maxLeft = useMemo(
    () => Math.max(...meta.map((clue) => clue.specialIndex)),
    [meta]
  );
  const maxRight = useMemo(
    () => Math.max(...meta.map((clue) => clue.length - clue.specialIndex - 1)),
    [meta]
  );
  const totalColumns = maxLeft + 1 + maxRight;

  const [answers, setAnswers] = useState(emptyAnswers);
  const [checked, setChecked] = useState(false);
  const [secretGuess, setSecretGuess] = useState('');
  const cellRefs = useRef({});

  const results = useMemo(() => {
    return meta.map((clue) => {
      const userString = (answers[clue.id] || []).join('');
      const user = normalizeNoSpace(userString);
      return {
        id: clue.id,
        correct: user.length === clue.length && user === clue.normalized,
      };
    });
  }, [answers, meta]);

  const allCorrect = results.every((r) => r.correct);
  const revealedWord = results
    .map((r, idx) => (r.correct ? meta[idx].reveal.toUpperCase() : '_'))
    .join('');

  const handleCellChange = (id, cellIndex, val) => {
    const char = (val || '').slice(-1).toUpperCase();
    setAnswers((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[id] || [])];
      arr[cellIndex] = char;
      copy[id] = arr;
      return copy;
    });
    setChecked(false);

    if (char) {
      const nextIndex = cellIndex + 1;
      const nextRef = cellRefs.current[id]?.[nextIndex];
      if (nextRef) {
        nextRef.focus();
      }
    }
  };

  const handleCheck = () => setChecked(true);

  const handleReset = () => {
    setAnswers(emptyAnswers);
    setChecked(false);
    setSecretGuess('');
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  const secretCorrect = normalizeNoSpace(secretGuess) === SECRET_WORD;
  const canExit = allCorrect && checked && secretCorrect;

  return (
    <div className="game-overlay-content bg-gradient-to-b from-[#0d1224] to-[#090d1a] text-white min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
            Mini-game 6 · Chương 6
          </p>
          <h1
            className="text-3xl md:text-4xl font-black"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Ô chữ liên minh
          </h1>
          <p
            className="text-sm md:text-base text-white/80"
            style={{ fontFamily: 'var(--font-atkinson)' }}
          >
            Trả lời 4 ô chữ để lộ ra mật mã.
          </p>
        </header>

        <section className="space-y-6">
          <div className="grid gap-6">
            {meta.map((clue, idx) => {
              const res = results[idx];
              const leftPad = maxLeft - clue.specialIndex;
              const rightPad = maxRight - (clue.length - clue.specialIndex - 1);
              return (
                <div key={clue.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-white/70">
                    <div className="font-semibold tracking-[0.15em] uppercase">
                      Ô {idx + 1} · {clue.length} ô
                    </div>
                    {checked && (
                      <span
                        className={
                          res.correct ? 'text-emerald-200' : 'text-amber-200'
                        }
                      >
                        {res.correct ? 'Đúng' : 'Sai'}
                      </span>
                    )}
                  </div>

                  <div
                    className="grid gap-2 justify-center"
                    style={{
                      gridTemplateColumns: `repeat(${totalColumns}, 2.5rem)`,
                    }}
                  >
                    {Array.from({ length: leftPad }).map((_, i) => (
                      <div key={`l-${i}`} className="w-10 h-10" />
                    ))}
                    {(answers[clue.id] || []).map((char, i) => {
                      const isSpecial = clue.specialIndex === i;
                      return (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          value={char}
                          onChange={(e) =>
                            handleCellChange(clue.id, i, e.target.value)
                          }
                          ref={(el) => {
                            if (!cellRefs.current[clue.id])
                              cellRefs.current[clue.id] = [];
                            cellRefs.current[clue.id][i] = el;
                          }}
                          className={`w-10 h-10 text-center uppercase font-semibold text-base rounded-md outline-none transition-colors ${
                            isSpecial
                              ? 'bg-black text-white'
                              : 'bg-white text-gray-900 focus:ring-2 focus:ring-primary/70'
                          }`}
                        />
                      );
                    })}
                    {Array.from({ length: rightPad }).map((_, i) => (
                      <div key={`r-${i}`} className="w-10 h-10" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-white/75 uppercase tracking-[0.2em] text-center">
              Câu hỏi
            </h3>
            <div className="space-y-2">
              {meta.map((clue, idx) => (
                <div
                  key={clue.id}
                  className="text-sm text-white/80 leading-relaxed"
                  style={{ fontFamily: 'var(--font-atkinson)' }}
                >
                  Ô {idx + 1}: {clue.prompt}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-white/80 flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.2em] text-primary/80">
                  Ô chữ
                </span>
                <span className="font-mono text-lg md:text-xl tracking-[0.25em]">
                  {revealedWord}
                </span>
                {allCorrect && checked && (
                  <span className="text-xs rounded-full bg-emerald-500/15 px-3 py-1 text-emerald-100">
                    Đã mở đủ chữ cái
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleReset}
                  className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
                >
                  Làm lại
                </button>
                <button
                  onClick={handleCheck}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 hover:bg-primary/90"
                >
                  Kiểm tra
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/80">
                Bạn nghĩ từ bí mật là gì?
              </label>
              <input
                type="text"
                value={secretGuess}
                onChange={(e) => setSecretGuess(e.target.value)}
                placeholder="Nhập từ bí mật..."
                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white focus:border-primary outline-none"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-3">
              {canExit && (
                <button
                  onClick={handleExit}
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                >
                  Tiếp tục
                </button>
              )}
            </div>
          </div>

          {checked && !allCorrect && (
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-50">
              ⚠️ Có đáp án chưa đúng. Kiểm tra lại từ khóa về thời kỳ quá độ,
              chế độ công hữu và các hình thức gia đình lịch sử.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
