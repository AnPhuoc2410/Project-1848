import { useMemo, useState, useEffect, useRef, useCallback } from 'react';

const STABLE_MIN = 45;
const STABLE_MAX = 55;

const clamp = (v) => Math.min(100, Math.max(0, v));
const displayValue = (v) => Math.round(v);
const withinRange = (v) => v >= STABLE_MIN && v <= STABLE_MAX;

const DraggableSlider = ({ value, stable = false, onChange }) => {
  const trackRef = useRef(null);
  const isDragging = useRef(false);

  const valueFromPointer = (clientX) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return value;
    const percent = ((clientX - rect.left) / rect.width) * 100;
    return clamp(percent);
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging.current) return;
      onChange(valueFromPointer(e.clientX));
    };

    const stopDrag = () => {
      isDragging.current = false;
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', stopDrag);
    window.addEventListener('pointercancel', stopDrag);

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', stopDrag);
      window.removeEventListener('pointercancel', stopDrag);
    };
  }, [onChange]);

  const handlePointerDown = (e) => {
    isDragging.current = true;
    onChange(valueFromPointer(e.clientX));
  };

  return (
    <div className="relative mb-3 select-none" ref={trackRef}>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${stable ? 'from-emerald-400 to-emerald-500' : 'from-red-500 to-red-600'}`}
          style={{ width: `${clamp(value)}%` }}
          aria-hidden
        />
      </div>
      <button
        type="button"
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-gradient-to-r from-orange-400 to-orange-500 border border-orange-300 shadow-md shadow-orange-500/40 cursor-grab active:cursor-grabbing focus:outline-none"
        style={{ left: `${clamp(value)}%` }}
        onPointerDown={handlePointerDown}
        aria-label="Kéo để điều chỉnh giá trị"
      />
    </div>
  );
};

export default function MiniGame5({ onExit }) {
  const randStart = () => {
    // Random outside stable band to force player adjustment
    const options = [
      () => Math.round(Math.random() * (STABLE_MIN - 5)), // below stable
      () => Math.round(STABLE_MAX + 5 + Math.random() * (100 - STABLE_MAX - 5)), // above stable
    ];
    const pick = options[Math.floor(Math.random() * options.length)]();
    return clamp(pick);
  };

  const [workers, setWorkers] = useState(randStart);
  const [peasants, setPeasants] = useState(randStart);
  const [intellectuals, setIntellectuals] = useState(randStart);
  const [checked, setChecked] = useState(false);
  const [isStable, setIsStable] = useState(false);
  const [autoStopped, setAutoStopped] = useState(false);

  const handleCheck = () => {
    const stable =
      withinRange(workers) &&
      withinRange(peasants) &&
      withinRange(intellectuals);
    setChecked(true);
    setIsStable(stable);
  };

  const handleReset = () => {
    setWorkers(randStart());
    setPeasants(randStart());
    setIntellectuals(randStart());
    setChecked(false);
    setIsStable(false);
    setAutoStopped(false);
  };

  const statusLabel = (value) => {
    if (value < STABLE_MIN) return 'Thiếu';
    if (value > STABLE_MAX) return 'Lệch';
    return 'Ổn định';
  };

  const handleExit = () => {
    if (onExit) onExit();
  };

  const autoStable = useMemo(
    () =>
      withinRange(workers) &&
      withinRange(peasants) &&
      withinRange(intellectuals),
    [workers, peasants, intellectuals]
  );

  const handleSliderChange = useCallback((key, value) => {
    const val = Math.round(Number(value));

    if (key === 'workers') {
      setWorkers(val);
      setPeasants((p) => clamp(p - 0.6));
      setIntellectuals((t) => clamp(t + 0.4));
    } else if (key === 'peasants') {
      setPeasants(val);
      setWorkers((w) => clamp(w + 0.5));
      setIntellectuals((t) => clamp(t + 0.3));
    } else if (key === 'intellectuals') {
      setIntellectuals(val);
      setWorkers((w) => clamp(w + 0.4));
      setPeasants((p) => clamp(p - 0.5));
    }

    setChecked(false);
    setIsStable(false);
    setAutoStopped(false);
  }, []);

  useEffect(() => {
    if (autoStable) {
      setAutoStopped(true);
      return undefined;
    }

    const id = setInterval(() => {
      // Double speed drift toward imbalance for tension
      setWorkers((v) => clamp(v + 1.2));
      setIntellectuals((v) => clamp(v + 1.0));
      setPeasants((v) => clamp(v - 1.0));
    }, 900);

    return () => clearInterval(id);
  }, [autoStable]);

  return (
    <div className="game-overlay-content bg-gradient-to-b from-[#0c1224] to-[#0a0f1d] text-white min-h-screen p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="space-y-3 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-primary/70">
            Mini-game 5 · Chương 5
          </p>
          <h1
            className="text-3xl md:text-4xl font-black"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Giữ cân bằng liên minh giai cấp
          </h1>
          <p
            className="text-sm md:text-base text-white/80"
            style={{ fontFamily: 'var(--font-atkinson)' }}
          >
            🎯 Mục tiêu: Hiểu vai trò liên minh công – nông – trí thức. 🕹
            Gameplay: Điều chỉnh 3 thanh cân bằng; lệch là xã hội mất ổn định.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            {
              key: 'workers',
              label: 'Công nhân',
              value: workers,
              setter: setWorkers,
              color: 'from-primary to-primary/70',
            },
            {
              key: 'peasants',
              label: 'Nông dân',
              value: peasants,
              setter: setPeasants,
              color: 'from-emerald-500 to-emerald-600',
            },
            {
              key: 'intellectuals',
              label: 'Trí thức',
              value: intellectuals,
              setter: setIntellectuals,
              color: 'from-amber-400 to-orange-500',
            },
          ].map((item) => (
            <div
              key={item.key}
              className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.15em] text-white/60">
                    Thanh cân bằng
                  </p>
                  <p className="text-lg font-semibold text-white">
                    {item.label}
                  </p>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/80">
                  {displayValue(item.value)}
                </span>
              </div>
              <DraggableSlider
                value={item.value}
                stable={withinRange(item.value)}
                onChange={(val) => handleSliderChange(item.key, val)}
              />
              <div className="mt-2 text-xs text-white/70 flex items-center justify-between">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
              <div className="mt-3 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                    item.value < STABLE_MIN
                      ? 'bg-amber-500/20 text-amber-100'
                      : item.value > STABLE_MAX
                        ? 'bg-red-500/20 text-red-100'
                        : 'bg-emerald-500/20 text-emerald-100'
                  }`}
                >
                  {statusLabel(item.value)}
                </span>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm font-semibold text-white mb-2">
              Nội dung kiến thức
            </p>
            <ul className="list-disc list-inside text-sm text-white/80 space-y-1">
              <li>Liên minh công – nông – trí thức là nền tảng xã hội.</li>
              <li>
                Thiếu một giai cấp → mất cân bằng và mất ổn định chính trị.
              </li>
              <li>
                Giữ các thanh trong vùng ổn định ({STABLE_MIN}-{STABLE_MAX}) để
                bảo đảm đồng thuận.
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-white/80">
              Nhiệm vụ: Giữ 3 thanh trong vùng “ổn định”.
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
                Xác nhận cân bằng
              </button>
            </div>
          </div>

          {checked && (
            <div
              className={`rounded-2xl border px-4 py-3 text-sm ${
                isStable
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-50'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-50'
              }`}
            >
              {isStable ? (
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div>
                    🎉 Ổn định! Bạn đã giữ liên minh công – nông – trí thức
                    trong vùng an toàn.
                  </div>
                  <button
                    onClick={handleExit}
                    className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400"
                  >
                    Tiếp tục
                  </button>
                </div>
              ) : (
                <>
                  <p>
                    ⚠️ Chưa ổn định. Cân chỉnh lại để cả 3 thanh nằm trong
                    khoảng {STABLE_MIN}-{STABLE_MAX}.
                  </p>
                  <p className="text-amber-100/80 mt-1">
                    Gợi ý: đừng để một giai cấp quá thấp hoặc quá cao so với
                    phần còn lại.
                  </p>
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
