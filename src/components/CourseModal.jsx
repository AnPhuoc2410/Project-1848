import { useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * CourseModal - Display detailed course module content
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is visible
 * @param {Function} props.onClose - Callback to close modal
 * @param {Object} props.module - Module data {id, title, description, content}
 */
const CourseModal = ({ isOpen, onClose, module }) => {
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

  if (!isOpen || !module) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-white/20 animate-in fade-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-100 bg-white/95 backdrop-blur-md">
          <div className="pr-8">
            <span
              className="block text-sm font-bold text-primary mb-1 uppercase tracking-wider"
              style={{ fontFamily: 'var(--font-atkinson)' }}
            >
              Chuyên đề {module.id}
            </span>
            <h3
              className="text-2xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: 'var(--font-crimson-pro)' }}
            >
              {module.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          <p className="text-lg text-gray-600 mb-6 italic leading-relaxed border-l-4 border-primary/30 pl-4">
            {module.description}
          </p>

          <div
            className="prose prose-lg max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: module.content }}
          />

          <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

CourseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  module: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    description: PropTypes.string,
    content: PropTypes.string,
  }),
};

export default CourseModal;
