import React from 'react';

const TimelineSection = ({ events }) => {
  return (
    <section id="timeline" className="py-16 md:py-24 scroll-mt-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-4" style={{ fontFamily: 'var(--font-crimson-pro)' }}>
            Dòng thời gian
          </h2>
          <p className="text-base md:text-lg text-text max-w-2xl mx-auto">
            Lịch sử hình thành và phát triển của chủ nghĩa xã hội khoa học qua các cột mốc quan trọng.
          </p>
        </div>
        <div className="relative wrap overflow-hidden p-10 h-full">
          <div className="border-2-2 absolute border-opacity-20 border-gray-700 h-full border" style={{ left: '50%' }}></div>
          {events.map((event, index) => (
            <div key={event.id} className={`mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}>
              <div className="order-1 w-5/12"></div>
              <div className="z-20 flex items-center order-1 bg-primary shadow-xl w-8 h-8 rounded-full">
                <h1 className="mx-auto font-semibold text-sm text-white">{event.id}</h1>
              </div>
              <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
                <p className="text-sm font-medium text-primary">{event.date}</p>
                <h3 className="font-bold text-gray-800 text-lg">{event.title}</h3>
                <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
