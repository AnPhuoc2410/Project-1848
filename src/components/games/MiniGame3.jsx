import { useState, useEffect, useMemo } from 'react';
import { TiTick, TiTimes, TiUser } from 'react-icons/ti';
import { FaFlagCheckered, FaMountain } from 'react-icons/fa';

const stages = [
  {
    id: 1,
    title: 'Xuất phát: Nền kinh tế lạc hậu',
    description:
      'Đất nước vừa bước ra khỏi chiến tranh, kinh tế còn nghèo nàn. Bạn chọn đường lối nào?',
    choices: [
      {
        text: 'Bỏ qua tư bản, tiến thẳng lên CNXH bằng mọi giá.',
        isCorrect: false,
        feedback: 'Sai lầm! Đây là tư tưởng chủ quan, nóng vội.',
      },
      {
        text: 'Công nghiệp hóa, Hiện đại hóa đất nước.',
        isCorrect: true,
        feedback: 'Chính xác! Xây dựng cơ sở vật chất là tiên quyết.',
      },
      {
        text: 'Chờ đợi viện trợ từ bên ngoài hoàn toàn.',
        isCorrect: false,
        feedback: 'Sai! Phải tự lực cánh sinh là chính.',
      },
      {
        text: 'Quay lại nền kinh tế phong kiến tự cung tự cấp.',
        isCorrect: false,
        feedback: 'Sai! Đây là bước lùi lịch sử.',
      },
    ],
  },
  {
    id: 2,
    title: 'Nông nghiệp & Lương thực',
    description:
      'Nạn đói đe dọa, sản xuất đình trệ. Cần chính sách gì cho nông nghiệp?',
    choices: [
      {
        text: 'Tập thể hóa cưỡng ép, không quan tâm năng suất.',
        isCorrect: false,
        feedback: 'Sai! Triệt tiêu động lực làm việc của nông dân.',
      },
      {
        text: 'Khoán sản phẩm (Khoán 10) đến nhóm và người lao động.',
        isCorrect: true,
        feedback:
          'Tuyệt vời! Giải phóng sức sản xuất, đảm bảo an ninh lương thực.',
      },
      {
        text: 'Nhập khẩu 100% lương thực từ nước ngoài.',
        isCorrect: false,
        feedback: 'Sai! Không đảm bảo an ninh lương thực quốc gia.',
      },
      {
        text: 'Bỏ hoang ruộng đất, chuyển sang làm công nghiệp hết.',
        isCorrect: false,
        feedback: 'Sai! Mất cân đối nền kinh tế.',
      },
    ],
  },
  {
    id: 3,
    title: 'Cơ cấu kinh tế',
    description:
      'Nên tổ chức nền kinh tế như thế nào để phát huy tối đa nguồn lực?',
    choices: [
      {
        text: 'Xóa bỏ tư hữu, chỉ giữ lại kinh tế nhà nước.',
        isCorrect: false,
        feedback: 'Sai! Làm triệt tiêu động lực sản xuất.',
      },
      {
        text: 'Chỉ phát triển kinh tế tư nhân, bỏ qua nhà nước.',
        isCorrect: false,
        feedback: 'Sai! Mất định hướng XHCN.',
      },
      {
        text: 'Phát triển kinh tế hàng hóa nhiều thành phần.',
        isCorrect: true,
        feedback: 'Đúng! Huy động được mọi nguồn lực xã hội.',
      },
      {
        text: 'Cho phép nước ngoài nắm toàn bộ nền kinh tế.',
        isCorrect: false,
        feedback: 'Sai! Mất độc lập tự chủ.',
      },
    ],
  },
  {
    id: 4,
    title: 'Cơ chế quản lý',
    description:
      'Tình trạng quan liêu bao cấp đang kìm hãm sự phát triển. Giải pháp là gì?',
    choices: [
      {
        text: 'Nhà nước bao cấp toàn bộ đời sống, chia đều khó khăn.',
        isCorrect: false,
        feedback: 'Sai! Gây ỷ lại, lãng phí.',
      },
      {
        text: 'Thả nổi hoàn toàn cho thị trường tự điều tiết.',
        isCorrect: false,
        feedback: 'Sai! Dễ dẫn đến khủng hoảng, phân hóa giàu nghèo cực đoan.',
      },
      {
        text: 'Cơ chế thị trường định hướng XHCN.',
        isCorrect: true,
        feedback:
          'Chính xác! Kết hợp hiệu quả thị trường với quản lý của Nhà nước.',
      },
      {
        text: 'Thiết quân luật trong kinh tế.',
        isCorrect: false,
        feedback: 'Sai! Không phù hợp phát triển kinh tế.',
      },
    ],
  },
  {
    id: 5,
    title: 'Phân phối thu nhập',
    description: 'Làm sao để đảm bảo công bằng xã hội trong thời kỳ này?',
    choices: [
      {
        text: 'Chia đều cho tất cả mọi người (Bình quân chủ nghĩa).',
        isCorrect: false,
        feedback: 'Sai! Không khuyến khích người giỏi làm việc.',
      },
      {
        text: 'Phân phối theo lao động là chủ yếu.',
        isCorrect: true,
        feedback: 'Đúng! Làm nhiều hưởng nhiều, làm ít hưởng ít.',
      },
      {
        text: 'Ai giàu mặc ai, ai nghèo mặc ai.',
        isCorrect: false,
        feedback: 'Sai! Trái bản chất CNXH.',
      },
      {
        text: 'Chỉ ưu tiên lợi ích cho quan chức.',
        isCorrect: false,
        feedback: 'Sai! Đây là tham nhũng, lợi ích nhóm.',
      },
    ],
  },
  {
    id: 6,
    title: 'Văn hóa & Hội nhập',
    description: 'Thế giới đang toàn cầu hóa mạnh mẽ. Chúng ta nên làm gì?',
    choices: [
      {
        text: 'Đóng cửa để bảo vệ bản sắc dân tộc tuyệt đối.',
        isCorrect: false,
        feedback: 'Sai! Sẽ dẫn đến cô lập, tụt hậu.',
      },
      {
        text: 'Sao chép y nguyên văn hóa phương Tây.',
        isCorrect: false,
        feedback: 'Sai! Mất gốc, đánh mất bản sắc.',
      },
      {
        text: 'Hội nhập quốc tế sâu rộng nhưng giữ gìn bản sắc.',
        isCorrect: true,
        feedback: 'Rất tốt! "Hòa nhập nhưng không hòa tan".',
      },
      {
        text: 'Bài trừ mọi thứ từ nước ngoài.',
        isCorrect: false,
        feedback: 'Sai! Cực đoan và thiếu thực tế.',
      },
    ],
  },
  {
    id: 7,
    title: 'Thử thách cuối: Bẫy thu nhập trung bình',
    description: 'Để trở thành nước phát triển, động lực chính phải là gì?',
    choices: [
      {
        text: 'Tiếp tục dựa vào bán tài nguyên thiên nhiên.',
        isCorrect: false,
        feedback: 'Sai! Tài nguyên sẽ cạn kiệt.',
      },
      {
        text: 'Dựa vào lao động giá rẻ mãi mãi.',
        isCorrect: false,
        feedback: 'Sai! Không bền vững khi đời sống tăng lên.',
      },
      {
        text: 'In thêm tiền để kích cầu.',
        isCorrect: false,
        feedback: 'Sai! Gây lạm phát nghiêm trọng.',
      },
      {
        text: 'Đổi mới sáng tạo & Phát triển nhân lực chất lượng cao.',
        isCorrect: true,
        feedback: 'Tuyệt vời! Chìa khóa của sự thịnh vượng bền vững.',
      },
    ],
  },
];

// Define Coordinates for the Winding Road (Percentages)
// 8 Points: Start (0) + 7 Stages (1-7) + End (Finish line)
// Using a smoother layout
const WAYPOINTS = [
  { x: 5, y: 80 }, // Start
  { x: 15, y: 50 }, // Stage 1
  { x: 30, y: 20 }, // Stage 2
  { x: 45, y: 50 }, // Stage 3
  { x: 60, y: 80 }, // Stage 4
  { x: 75, y: 50 }, // Stage 5
  { x: 85, y: 20 }, // Stage 6
  { x: 95, y: 50 }, // Stage 7 (Goal)
];

const MiniGame3 = ({ onClose, onComplete }) => {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameStatus, setGameStatus] = useState('playing');
  const [currentChoices, setCurrentChoices] = useState([]);

  // Current position on map (interpolated or snapped)
  const currentPos =
    WAYPOINTS[Math.min(currentStageIndex, WAYPOINTS.length - 1)];

  const currentStage = stages[currentStageIndex];

  // Helper to shuffle array with forced move for correct answer
  const shuffle = (array, previousOrder = null) => {
    let newArray = [...array].sort(() => Math.random() - 0.5);

    // If we have previous order, ensure correct answer moves to a NEW position
    if (previousOrder && previousOrder.length > 0) {
      const oldCorrectIndex = previousOrder.findIndex((c) => c.isCorrect);
      const newCorrectIndex = newArray.findIndex((c) => c.isCorrect);

      // If it landed in the same spot, swap it
      if (oldCorrectIndex !== -1 && oldCorrectIndex === newCorrectIndex) {
        // Swap with the next item (wrapping around)
        const swapIndex = (newCorrectIndex + 1) % newArray.length;
        [newArray[newCorrectIndex], newArray[swapIndex]] = [
          newArray[swapIndex],
          newArray[newCorrectIndex],
        ];
      }
    }
    return newArray;
  };

  // Initialize/Update choices when stage changes
  useEffect(() => {
    setCurrentChoices(shuffle(stages[currentStageIndex].choices));
  }, [currentStageIndex]);

  const handleChoice = (choice) => {
    if (feedback) return;

    if (choice.isCorrect) {
      setFeedback({ isCorrect: true, message: choice.feedback });
    } else {
      setFeedback({ isCorrect: false, message: choice.feedback });
    }
  };

  const handleNext = () => {
    if (feedback?.isCorrect) {
      if (currentStageIndex < stages.length - 1) {
        setCurrentStageIndex((prev) => prev + 1);
        setFeedback(null);
      } else {
        setGameStatus('won');
        // Move to end? existing logic creates a "won" state screen anyway.
        if (onComplete) onComplete();
      }
    } else {
      setFeedback(null); // Retry
      // Re-shuffle on retry, passing currentChoices to ensure movement
      setCurrentChoices(shuffle(currentStage.choices, currentChoices));
    }
  };

  // Randomize choices order carefully only once per stage to avoid jumpiness?
  // Ideally yes, but here simple mapping is fine.

  // Helpers to generate SVG Path string from waypoints
  const pathData = useMemo(() => {
    let d = `M ${WAYPOINTS[0].x} ${WAYPOINTS[0].y}`;
    for (let i = 1; i < WAYPOINTS.length; i++) {
      // Simple smoothing: using previous point as control?
      // Or just straight lines for now, or Quadratic curves.
      // Let's do simple Line To for robustness or C (Cubic) if we calculate control points.
      // For a winding road look, we can just assume smooth curves.
      // A simple smoothing: C (prevX + dx/2) prevY, (currX - dx/2) currY, currX currY
      const prev = WAYPOINTS[i - 1];
      const curr = WAYPOINTS[i];
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;
    }
    return d;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <div className="relative w-full max-w-5xl rounded-2xl bg-zinc-900 border border-white/10 p-4 md:p-6 shadow-2xl flex flex-col h-[95vh] md:h-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2
            className="text-xl md:text-2xl font-bold text-primary"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Hành trình Quá độ: CNTB ➔ CNXH
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            Thoát
          </button>
        </div>

        {gameStatus === 'playing' && (
          <>
            {/* Map Area (Winding Road) */}
            <div className="relative w-full h-48 md:h-64 bg-[#1a1a2e] rounded-xl mb-4 overflow-hidden border border-white/10 shadow-inner">
              {/* Decoration: Grid */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'radial-gradient(circle, #fff 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              ></div>

              {/* SVG Path */}
              <svg
                className="absolute inset-0 w-full h-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                {/* The Road Border */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                {/* The Road Center Line */}
                <path
                  d={pathData}
                  fill="none"
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                />

                {/* Checkpoints */}
                {WAYPOINTS.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r="1.5"
                    fill={idx <= currentStageIndex ? '#FFD700' : '#444'}
                  />
                ))}
              </svg>

              {/* Character */}
              <div
                className="absolute w-8 h-8 -ml-4 -mt-8 transition-all duration-1000 ease-in-out z-20 flex flex-col items-center"
                style={{ left: `${currentPos.x}%`, top: `${currentPos.y}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black border-2 border-white shadow-[0_0_15px_rgba(255,215,0,0.6)] animate-bounce">
                  <TiUser size={20} />
                </div>
              </div>
            </div>

            {/* Scenario Area */}
            <div className="flex-1 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
              <div className="mb-4">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    Trạm {currentStageIndex + 1} / {stages.length}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                  {currentStage.title}
                </h3>
                <p className="text-gray-300 max-w-3xl text-sm md:text-base mx-auto">
                  {currentStage.description}
                </p>
              </div>

              {/* Choices Grid - 2x2 Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-4xl px-2 pb-4">
                {currentChoices.map((choice, idx) => {
                  let btnClass =
                    'relative p-4 rounded-xl border transition-all duration-200 group h-full flex items-center ';
                  if (feedback) {
                    if (choice.isCorrect)
                      btnClass +=
                        'bg-green-500/10 border-green-500 text-green-100';
                    else if (
                      !choice.isCorrect &&
                      feedback.message === choice.feedback
                    )
                      btnClass +=
                        'bg-red-500/10 border-red-500 text-red-100 opacity-100'; // Selected wrong
                    else
                      btnClass +=
                        'bg-white/5 border-white/5 text-gray-500 opacity-50'; // Others
                  } else {
                    btnClass +=
                      'bg-white/5 border-white/10 hover:bg-white/10 hover:border-primary/50 hover:scale-[1.01] cursor-pointer text-left text-gray-200';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleChoice(choice)}
                      disabled={!!feedback}
                      className={btnClass}
                    >
                      <span className="mr-3 flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm md:text-base font-medium">
                        {choice.text}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Overlay/Message */}
              {feedback && (
                <div className="fixed bottom-4 left-1/2 -translate-x-1/2 md:absolute md:bottom-8 z-30 w-[90%] max-w-xl p-4 rounded-xl bg-zinc-800/95 border border-white/20 shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-10">
                  <div
                    className={`flex items-center gap-2 font-bold text-lg mb-1 ${feedback.isCorrect ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {feedback.isCorrect ? (
                      <TiTick size={24} />
                    ) : (
                      <TiTimes size={24} />
                    )}
                    {feedback.isCorrect ? 'Quyết định đúng đắn!' : 'Cẩn thận!'}
                  </div>
                  <p className="text-gray-300 text-sm mb-3">
                    {feedback.message}
                  </p>

                  <button
                    onClick={handleNext}
                    className={`w-full py-2 rounded-lg font-bold text-black transition-colors ${feedback.isCorrect ? 'bg-primary hover:bg-primary/80' : 'bg-gray-200 hover:bg-white'}`}
                  >
                    {feedback.isCorrect ? 'Tiếp tục hành trình' : 'Thử lại'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {gameStatus === 'won' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
            <FaFlagCheckered className="text-6xl text-primary mx-auto mb-6" />
            <h2
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              Vượt Qua Thời Kỳ Quá Độ!
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Chúc mừng! Bạn đã đưa đất nước vượt qua 7 thử thách cam go, từ xóa
              bỏ bao cấp đến hội nhập quốc tế, xây dựng thành công nền tảng cho
              Chủ nghĩa Xã hội.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold transition-all hover:scale-105"
            >
              Hoàn thành xuất sắc
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGame3;
