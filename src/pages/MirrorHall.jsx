import React from 'react';
import Navbar from '../components/Navbar';

const MirrorHall = () => {
  return (
    <div className="relative min-h-screen bg-background text-text">
      <Navbar />
      <section className="pt-28 pb-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
              Đại sảnh gương 3D
            </h1>
            <p className="text-lg text-text" style={{ fontFamily: 'var(--font-atkinson)' }}>
              Nội dung đang được chuẩn bị. Bạn có thể chuyển sang Mini-game hoặc Game từ thanh điều hướng.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MirrorHall;
