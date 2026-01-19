import React from 'react';
import AnimatedTitle from '../AnimatedTitle';

const CourseContentSection = ({ modules }) => {
  return (
    <section id="content" className="py-16 md:py-24 bg-gray-50 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedTitle
            title="NỘI DUNG <b>KHÓA</b> HỌC <br /> KẾT CẤU <b>CHUYÊN</b> ĐỀ"
            containerClass="mt-5 pointer-events-none text-text"
          />
          <p className="mt-6 text-base md:text-lg text-text max-w-2xl mx-auto">
            Khám phá các chủ đề cốt lõi của Chủ nghĩa xã hội khoa học qua các chuyên đề sau.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <div key={module.id} className="bg-white border border-border rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
              <span className="text-sm font-bold text-primary" style={{ fontFamily: 'var(--font-atkinson)' }}>
                Chuyên đề {module.id}
              </span>
              <h3 className="text-xl font-bold text-text mt-2 mb-3" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
                {module.title}
              </h3>
              <p className="text-base text-text leading-relaxed">
                {module.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseContentSection;
