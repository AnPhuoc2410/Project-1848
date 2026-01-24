import { useState } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';

const questions = [
  {
    id: 1,
    question: 'Ai là lực lượng lãnh đạo cách mạng xã hội chủ nghĩa?',
    options: [
      'A. Giai cấp nông dân',
      'B. Đội ngũ trí thức',
      'C. Giai cấp công nhân',
      'D. Tầng lớp doanh nhân',
    ],
    correctAnswer: 2, // Index of 'C. Giai cấp công nhân'
  },
  {
    id: 2,
    question: 'Về phương thức sản xuất, giai cấp công nhân là đại diện cho?',
    options: [
      'A. Phương thức sản xuất phong kiến',
      'B. Phương thức sản xuất tiên tiến, hiện đại',
      'C. Nền sản xuất nhỏ lẻ, manh mún',
      'D. Kinh tế tự nhiên, tự cung tự cấp',
    ],
    correctAnswer: 1,
  },
  {
    id: 3,
    question:
      'Đặc điểm chính trị - xã hội nổi bật của giai cấp công nhân là gì?',
    options: [
      'A. Tư hữu tư liệu sản xuất',
      'B. Tiên phong, cách mạng triệt để',
      'C. Bảo thủ, ngại đổi mới',
      'D. Gắn bó với ruộng đất',
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: 'Tổ chức chính trị cao nhất của giai cấp công nhân là?',
    options: [
      'A. Công đoàn',
      'B. Mặt trận Tổ quốc',
      'C. Đảng Cộng sản',
      'D. Đoàn Thanh niên',
    ],
    correctAnswer: 2,
  },
  {
    id: 5,
    question:
      'Trong cách mạng xã hội chủ nghĩa, giai cấp công nhân cần liên minh với ai?',
    options: [
      'A. Tư sản và tiểu tư sản',
      'B. Nông dân và các tầng lớp lao động khác',
      'C. Địa chủ phong kiến',
      'D. Chỉ hoạt động độc lập',
    ],
    correctAnswer: 1,
  },
  {
    id: 6,
    question:
      'Mục tiêu cuối cùng trong sứ mệnh lịch sử của giai cấp công nhân là gì?',
    options: [
      'A. Lật đổ chế độ phong kiến',
      'B. Giành chính quyền về tay mình',
      'C. Xây dựng thành công CNXH và CNCS',
      'D. Phát triển kinh tế thị trường',
    ],
    correctAnswer: 2,
  },
  {
    id: 7,
    question:
      'Tại sao giai cấp nông dân không thể là lực lượng lãnh đạo cách mạng XHCN?',
    options: [
      'A. Vì số lượng ít',
      'B. Vì không đại diện cho phương thức sản xuất tiên tiến nhất',
      'C. Vì không có tinh thần yêu nước',
      'D. Vì không tham gia sản xuất',
    ],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: 'Giai cấp công nhân Việt Nam ra đời trong hoàn cảnh nào?',
    options: [
      'A. Trước khi thực dân Pháp xâm lược',
      'B. Trong cuộc khai thác thuộc địa của thực dân Pháp',
      'C. Sau năm 1945',
      'D. Trong thời kỳ đổi mới',
    ],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: 'Nền tảng tư tưởng của Đảng Cộng sản Việt Nam là?',
    options: [
      'A. Chủ nghĩa Mác - Lênin và tư tưởng Hồ Chí Minh',
      'B. Triết học cổ điển Đức',
      'C. Chủ nghĩa xã hội không tưởng',
      'D. Tư tưởng văn hóa truyền thống',
    ],
    correctAnswer: 0,
  },
  {
    id: 10,
    question:
      'Điều kiện khách quan quy định sứ mệnh lịch sử của giai cấp công nhân là?',
    options: [
      'A. Sự lãnh đạo của Đảng Cộng sản',
      'B. Địa vị kinh tế - xã hội và đặc điểm chính trị - xã hội',
      'C. Tinh thần đoàn kết quốc tế',
      'D. Sự phát triển của khoa học kỹ thuật',
    ],
    correctAnswer: 1,
  },
];

const MiniGame2 = ({ onClose, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  // Constants
  const PASSING_SCORE = 7; // 70% of 10
  const isLastQuestion = currentQuestion === questions.length - 1;

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    if (index === questions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      if (
        score +
          (selectedOption === questions[currentQuestion].correctAnswer
            ? 1
            : 0) >=
          PASSING_SCORE &&
        onComplete
      ) {
        onComplete();
      }
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const currentQ = questions[currentQuestion];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-white/10 p-8 shadow-2xl">
        {!showResult ? (
          <>
            {/* Header */}
            <div className="mb-6 flex justify-between items-center bg-white/5 p-4 rounded-xl">
              <div>
                <h2
                  className="text-xl font-bold text-primary mb-1"
                  style={{ fontFamily: 'var(--font-crimson-pro)' }}
                >
                  Câu hỏi {currentQuestion + 1} / {questions.length}
                </h2>
                <div className="w-32 h-2 bg-white/10 rounded-full mt-2">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-400">Điểm hiện tại</span>
                <p className="text-2xl font-bold text-white">{score}</p>
              </div>
            </div>

            {/* Question */}
            <h3 className="text-xl md:text-2xl font-medium text-white mb-8 min-h-[80px]">
              {currentQ.question}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQ.options.map((option, index) => {
                let optionClass =
                  'p-4 rounded-xl border-2 transition-all duration-200 text-left font-medium text-lg ';

                if (isAnswered) {
                  if (index === currentQ.correctAnswer) {
                    optionClass +=
                      'bg-green-500/20 border-green-500 text-green-100';
                  } else if (index === selectedOption) {
                    optionClass += 'bg-red-500/20 border-red-500 text-red-100';
                  } else {
                    optionClass +=
                      'bg-white/5 border-transparent text-gray-400 opacity-50';
                  }
                } else {
                  optionClass +=
                    'bg-white/5 border-white/5 hover:bg-white/10 hover:border-primary/50 text-gray-200 hover:text-white cursor-pointer';
                }

                return (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(index)}
                    disabled={isAnswered}
                    className={optionClass}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-4 h-12">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition-colors font-medium"
              >
                Thoát
              </button>

              {isAnswered && (
                <button
                  onClick={handleNext}
                  className="px-8 py-2 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all animate-in fade-in slide-in-from-right-4"
                >
                  {isLastQuestion ? 'Xem kết quả' : 'Câu tiếp theo'}
                </button>
              )}
            </div>
          </>
        ) : (
          /* Result Screen */
          <div className="text-center py-8">
            <h2
              className="text-4xl font-bold mb-6"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              {score >= PASSING_SCORE ? (
                <span className="text-green-400">Chúc mừng! 🎉</span>
              ) : (
                <span className="text-red-400">Thất bại 😔</span>
              )}
            </h2>

            <div className="text-6xl font-black text-white mb-4">
              {score} / {questions.length}
            </div>

            <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
              {score >= PASSING_SCORE
                ? 'Bạn đã xuất sắc hoàn thành nhiệm vụ và nắm vững kiến thức về sứ mệnh lịch sử của giai cấp công nhân.'
                : `Bạn cần đạt ít nhất ${PASSING_SCORE} câu đúng để qua màn. Hãy ôn lại kiến thức và thử lại nhé!`}
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold transition-colors"
              >
                Đóng
              </button>
              {score < PASSING_SCORE && (
                <button
                  onClick={handleRetry}
                  className="px-8 py-3 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-colors"
                >
                  Chơi lại
                </button>
              )}
              {score >= PASSING_SCORE && (
                <button
                  onClick={onClose} // Could navigate to next level
                  className="px-8 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-black font-bold transition-colors"
                >
                  Màn tiếp theo
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGame2;
