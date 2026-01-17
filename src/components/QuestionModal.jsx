import { useEffect } from 'react';

/**
 * QuestionModal - Display philosophy Yes/No question
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {string} props.question - Question text
 * @param {Object} props.wire - Wire info {from, to, fromLabel, toLabel}
 * @param {Function} props.onAnswer - Callback with 'YES' or 'NO'
 * @param {boolean} props.loading - Show loading state
 */
export default function QuestionModal({
  isOpen,
  question,
  wire,
  onAnswer,
  loading = false,
}) {
  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="question-modal-overlay">
      <div className="question-modal">
        <div className="question-modal-header">
          <div className="question-icon">❓</div>
          <h3>Câu hỏi Triết học</h3>
        </div>

        {wire && (
          <div className="wire-info">
            <span className="wire-from" style={{ color: wire.fromColor }}>
              {wire.fromLabel}
            </span>
            <span className="wire-arrow">→</span>
            <span className="wire-to" style={{ color: wire.toColor }}>
              {wire.toLabel}
            </span>
          </div>
        )}

        <div className="question-text">
          <p>{question}</p>
        </div>

        <div className="question-actions">
          <button
            className="answer-btn answer-yes"
            onClick={() => onAnswer('YES')}
            disabled={loading}
          >
            <span className="answer-icon">✓</span>
            <span>YES</span>
            <span className="answer-desc">Dây cần thiết</span>
          </button>

          <button
            className="answer-btn answer-no"
            onClick={() => onAnswer('NO')}
            disabled={loading}
          >
            <span className="answer-icon">✗</span>
            <span>NO</span>
            <span className="answer-desc">Dây không cần</span>
          </button>
        </div>

        {loading && (
          <div className="question-loading">
            <div className="three-body">
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
              <div className="three-body__dot"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
