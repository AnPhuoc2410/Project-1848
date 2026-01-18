import React from 'react';
import { Link } from 'react-router-dom';

const GameSection = () => {
  return (
    <section id="game" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Trò chơi: Giải đố CNXH Khoa học
          </h2>
          <p className="text-base md:text-lg text-text max-w-3xl mx-auto">
            Đây là một trò chơi giải đố hợp tác dành cho 2 người chơi để tìm hiểu về triết học Mác - Lênin, lấy cảm hứng từ "We Were Here" và "Keep Talking and Nobody Explodes". Một người chơi sẽ là "Người hướng dẫn" chỉ thấy lý thuyết, và người còn lại là "Người thực hành" chỉ thấy các hành động. Cả hai phải giao tiếp để giải quyết các câu đố.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-border">
          <h3 className="text-xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Cách chơi
          </h3>
          <ol className="list-decimal list-inside space-y-3 text-left">
            <li>Mở terminal và di chuyển đến thư mục marxism-puzzle-game.</li>
            <li>Chạy npm install để cài đặt các dependencies.</li>
            <li>Chạy npm start để khởi động server game.</li>
            <li>Mở hai cửa sổ trình duyệt và truy cập http://localhost:3000.</li>
            <li>Nhấn "JOIN GAME" ở cả hai cửa sổ để bắt đầu.</li>
          </ol>
          <div className="mt-8 text-center">
            <Link
              to="/game"
              className="bg-secondary text-text font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-500 transition-colors duration-300 inline-block"
            >
              Mở trang trò chơi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameSection;
