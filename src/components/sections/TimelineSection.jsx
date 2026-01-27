import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

import AnimatedTitle from '../AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const TimelineSection = ({ events }) => {
  useEffect(() => {
    const cards = gsap.utils.toArray('.timeline-card');

    cards.forEach((card, index) => {
      const fromX = index % 2 === 0 ? 160 : -160;

      gsap.set(card, { opacity: 0, x: fromX, y: 60, rotate: fromX / 15 });

      const enter = () => {
        gsap.to(card, {
          keyframes: [
            {
              x: fromX * 0.8,
              y: -24,
              rotate: fromX / -25,
              opacity: 0.6,
              duration: 0.25,
              ease: 'power1.out',
            },
            {
              x: 0,
              y: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.5,
              ease: 'power2.out',
            },
          ],
        });
      };

      const leave = () => {
        gsap.to(card, {
          x: fromX,
          y: 140,
          rotate: fromX / 10,
          opacity: 0,
          duration: 0.4,
          ease: 'power1.in',
        });
      };

      ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        end: 'bottom 60%',
        onEnter: enter,
        onEnterBack: enter,
        onLeave: leave,
        onLeaveBack: leave,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [events]);

  return (
    <section
      id="timeline"
      className="relative py-16 md:py-24 scroll-mt-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <AnimatedTitle
            title="DÒNG TH<b>Ờ</b>I GIAN <br /> NHỮNG CỘT M<b>Ố</b>C CHÍNH"
            containerClass="mt-2 pointer-events-none text-text"
          />
          <p className="mt-6 text-base md:text-lg text-text max-w-2xl mx-auto">
            Lịch sử hình thành và phát triển của chủ nghĩa xã hội khoa học qua
            các cột mốc quan trọng.
          </p>
        </div>

        {/* Thêm class timeline-container để làm trigger cho đường kẻ */}
        <div className="timeline-container relative wrap p-10 h-full">
          {/* Đường kẻ dọc: Thêm class timeline-line */}
          <div
            className="timeline-line border-2-2 absolute border-opacity-20 border-gray-700 h-full border"
            style={{ left: '50%' }}
          ></div>

          {events.map((event, index) => (
            <div
              key={event.id}
              className={`timeline-card mb-8 flex justify-between items-center w-full ${index % 2 === 0 ? 'flex-row-reverse left-timeline' : 'right-timeline'}`}
            >
              <div className="order-1 w-5/12"></div>

              {/* Vòng tròn trung tâm */}
              <div className="z-20 flex items-center order-1 bg-primary shadow-xl w-8 h-8 rounded-full ring-4 ring-white">
                <h1 className="mx-auto font-semibold text-sm text-white">
                  {event.id}
                </h1>
              </div>

              {/* Card nội dung */}
              <div className="order-1 bg-white rounded-lg shadow-xl w-5/12 px-6 py-4 transition-transform hover:scale-[1.02]">
                <p className="text-sm font-medium text-primary">{event.date}</p>
                <h3 className="font-bold text-gray-800 text-lg">
                  {event.title}
                </h3>
                <p className="text-sm leading-snug tracking-wide text-gray-900 text-opacity-100">
                  {event.description}
                </p>
                {event.image && (
                  <div className="mt-3 overflow-hidden rounded-lg border border-border/60 bg-gray-50">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="h-40 w-full object-cover object-center"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
