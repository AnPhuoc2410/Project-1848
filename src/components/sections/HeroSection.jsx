import React from 'react';

const HeroSection = () => {
  return (
    <header id="home" className="relative h-screen w-full flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-background z-0">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>
      <div className="relative z-10 text-center px-4">
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-primary mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
          Chủ Nghĩa Xã Hội Khoa Học
        </h1>
        <p className="text-lg md:text-xl lg:text-2xl text-text mb-8 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-atkinson)' }}>
          Khóa học nền tảng về tư tưởng và lý luận
        </p>
      </div>
    </header>
  );
};

export default HeroSection;
