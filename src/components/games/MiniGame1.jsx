import { useState, useRef } from 'react';
import { TiTick, TiTimes } from 'react-icons/ti';

const initialItems = [
  { id: 'item-2', content: 'Mác – Ăngghen xây dựng CNXH khoa học' },
  { id: 'item-1', content: 'CNXH không tưởng (Saint-Simon, Fourier, Owen)' },
  { id: 'item-3', content: 'Vai trò của Lênin trong hiện thực hóa CNXH' },
];

const CORRECT_ORDER = ['item-1', 'item-2', 'item-3'];

const MiniGame1 = ({ onClose, onComplete }) => {
  const [items, setItems] = useState(initialItems);
  const [draggedItemIndex, setDraggedItemIndex] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); // null, true, false

  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const onDragStart = (e, index) => {
    dragItem.current = index;
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image or default
  };

  const onDragEnter = (e, index) => {
    dragOverItem.current = index;
    // Optional: Visual feedback for reordering preview could go here
    // But for simple swap, we can just highlight
  };

  const onDragEnd = () => {
    const copyListItems = [...items];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDraggedItemIndex(null);
    setItems(copyListItems);
  };

  const checkAnswer = () => {
    const currentOrder = items.map((item) => item.id);
    const isMatch =
      JSON.stringify(currentOrder) === JSON.stringify(CORRECT_ORDER);
    setIsCorrect(isMatch);

    if (isMatch && onComplete) {
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-white/10 p-8 shadow-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2
            className="text-3xl font-bold text-primary mb-2"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Sắp xếp Timeline
          </h2>
          <p className="text-gray-300">
            Kéo và thả các sự kiện lịch sử theo đúng trình tự thời gian.
          </p>
        </div>

        {/* Game Area */}
        <div className="space-y-4 mb-8">
          {items.map((item, index) => (
            <div
              key={item.id}
              draggable={isCorrect !== true} // Disable drag if won
              onDragStart={(e) => onDragStart(e, index)}
              onDragEnter={(e) => onDragEnter(e, index)}
              onDragEnd={onDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`
                group relative flex items-center gap-4 rounded-xl p-4 transition-all duration-300
                ${
                  draggedItemIndex === index
                    ? 'opacity-50 scale-95 border-dashed border-2 border-white/20 bg-transparent'
                    : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20'
                }
                ${isCorrect === true ? 'border-green-500/50 bg-green-500/10' : ''}
                ${isCorrect === false ? 'border-red-500/50 bg-red-500/10' : ''}
                cursor-grab active:cursor-grabbing
              `}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white/70">
                {index + 1}
              </div>
              <span className="font-medium text-white">{item.content}</span>

              {/* Drag Handle Icon (Optional visual cue) */}
              <div className="ml-auto text-white/30 group-hover:text-white/70">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="9" cy="12" r="1" />
                  <circle cx="9" cy="5" r="1" />
                  <circle cx="9" cy="19" r="1" />
                  <circle cx="15" cy="12" r="1" />
                  <circle cx="15" cy="5" r="1" />
                  <circle cx="15" cy="19" r="1" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Feedback & Controls */}
        <div className="flex flex-col items-center gap-4">
          {isCorrect === true && (
            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/20 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <TiTick size={24} /> Chính xác! Bạn đã mở khóa kiến thức tiếp
              theo.
            </div>
          )}
          {isCorrect === false && (
            <div className="flex items-center gap-2 text-red-400 font-bold bg-red-500/20 px-4 py-2 rounded-lg animate-in fade-in slide-in-from-bottom-2">
              <TiTimes size={24} /> Chưa đúng. Hãy nhớ lại: Không tưởng -&gt;
              Khoa học.
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
            >
              {isCorrect === true ? 'Đóng' : 'Thoát'}
            </button>

            {isCorrect !== true && (
              <button
                onClick={checkAnswer}
                className="px-8 py-2 rounded-lg bg-primary hover:bg-primary/80 text-black font-bold transition-all hover:scale-105 active:scale-95"
              >
                Kiểm tra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniGame1;
