import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';

import AnimatedTitle from './AnimatedTitle';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  useGSAP(() => {
    const clipAnimation = gsap.timeline({
      scrollTrigger: {
        trigger: '#clip',
        start: 'center center',
        end: '+=800 center',
        scrub: 0.5,
        pin: true,
        pinSpacing: true,
      },
    });

    clipAnimation.to('.mask-clip-path', {
      width: '100vw',
      height: '100vh',
      borderRadius: 0,
    });
  });

  return (
    <section
      id="about"
      className="relative min-h-screen w-screen overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 mb-8 mt-36 flex flex-col items-center gap-5 px-4 text-center">
        <AnimatedTitle
          title="GIỚI THIỆU VỀ <b>KHÓA</b> HỌC"
          containerClass="mt-5 !text-text text-center"
        />

        <div className="about-subtext text-text">
          <p>
            Chủ nghĩa xã hội khoa học là một trong ba bộ phận hợp thành của chủ nghĩa Mác - Lênin, luận giải sự chuyển biến tất yếu từ chủ nghĩa tư bản lên chủ nghĩa xã hội và chủ nghĩa cộng sản.
          </p>
          <p className="text-gray-600">
            Môn học tập trung nghiên cứu những quy luật chính trị - xã hội của quá trình hình thành và phát triển hình thái kinh tế - xã hội cộng sản chủ nghĩa, hướng tới mục tiêu giải phóng giai cấp, dân tộc và con người, tạo điều kiện phát triển toàn diện.
          </p>
        </div>
      </div>

      <div className="relative z-10 h-dvh w-screen" id="clip">
        <div className="mask-clip-path about-image">
          <img
            src="img/about.jpg"
            alt="Scientific Socialism"
            className="absolute left-0 top-0 size-full object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default About;
