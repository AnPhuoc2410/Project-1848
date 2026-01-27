import { useRef, useLayoutEffect } from 'react'; // Thêm hooks
import gsap from 'gsap'; // Import GSAP
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Import ScrollTrigger
import AnimatedTitle from '../AnimatedTitle';

// Đăng ký plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const TimelineSection = ({ events }) => {
  const containerRef = useRef(null); // Ref bao bọc toàn bộ section để scoped selector

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Animation cho đường kẻ dọc (Vẽ từ trên xuống dưới theo scroll)
      gsap.fromTo(
        '.timeline-line',
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: 'top center', // Bắt đầu vẽ từ trên
          ease: 'none',
          scrollTrigger: {
            trigger: '.timeline-container', // Trigger dựa trên wrapper của timeline
            start: 'top 70%',
            end: 'bottom 90%',
            scrub: 1, // Mượt mà theo tốc độ cuộn chuột
          },
        }
      );

      // 2. Animation cho từng sự kiện (Trượt vào từ 2 bên)
      const items = gsap.utils.toArray('.timeline-item');

      items.forEach((item, index) => {
        // Kiểm tra xem item đang nằm bên trái hay phải dựa vào index
        // Logic cũ: index chẵn (0, 2...) có class 'flex-row-reverse' => Card nằm bên TRÁI
        // index lẻ (1, 3...) => Card nằm bên PHẢI
        const isEven = index % 2 === 0;
        const xValue = isEven ? -100 : 100; // Trái trượt từ -100px, Phải trượt từ 100px

        gsap.fromTo(
          item,
          { opacity: 0, x: xValue },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%', // Bắt đầu chạy khi phần tử vào 85% viewport
              toggleActions: 'play none none reverse', // Cuộn xuống thì chạy, cuộn lên thì đảo ngược
            },
          }
        );
      });
    }, containerRef); // Scope animations vào containerRef

    return () => ctx.revert(); // Cleanup khi unmount
  }, [events]);

  return (
    <section
      ref={containerRef}
      id="timeline"
      className="py-16 md:py-24 scroll-mt-16 overflow-hidden"
    >
      <div className="container mx-auto px-4">
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
              // Thêm class timeline-item để target animation
              className={`timeline-item mb-8 flex justify-between items-center w-full ${
                index % 2 === 0
                  ? 'flex-row-reverse left-timeline'
                  : 'right-timeline'
              }`}
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
