import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';

gsap.registerPlugin(ScrollTrigger);

const InstructorSection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const [confettiPlayed, setConfettiPlayed] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const cards = cardsRef.current;

    // Section fade in
    gsap.fromTo(
      section,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 10%',
        },
      }
    );

    // Title animation
    gsap.fromTo(
      title,
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
        },
      }
    );

    // Staggered card animations
    gsap.fromTo(
      cards,
      { y: 100, opacity: 0, scale: 0.9 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        stagger: 0.2,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          onEnter: () => {
            if (!confettiPlayed) {
              launchConfetti();
              setConfettiPlayed(true);
            }
          },
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [confettiPlayed]);

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  // 🎉 Confetti effect
  const launchConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FF4500', '#00CED1'],
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FF69B4', '#7FFF00'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const members = [
    {
      name: 'Hoàng Quốc An',
      mssv: 'SE181520',
      img: 'https://avatars.githubusercontent.com/u/165766167?v=4',
    },
    {
      name: 'Lê Trung Anh Khôi',
      mssv: 'SE180591',
      img: '/img/khoi.JPG',
    },
    {
      name: 'Đào Công An Phước',
      mssv: 'SE180581',
      img: 'https://avatars.githubusercontent.com/u/153256952?v=4',
    },
    {
      name: 'Vũ Hoàng Hiếu Ngân',
      mssv: 'SE183096',
      img: 'https://avatars.githubusercontent.com/u/139431216?v=4',
    },
    {
      name: 'Trần Đình Thịnh',
      mssv: 'SE181531',
      img: 'https://avatars.githubusercontent.com/u/156297768?v=4',
    },
    {
      name: 'Hoàng Gia Phong',
      mssv: 'SE181531',
      img: 'https://scontent.fsgn2-4.fna.fbcdn.net/v/t39.30808-1/273499459_974232276854220_950445217617548796_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=101&ccb=1-7&_nc_sid=e99d92&_nc_eui2=AeEtb7moDESuHwp_IorVrQswAWgZQWnlHYUBaBlBaeUdhZOokbJQ9-oGgf5UzxYv9Q40wC8Ay_iMLoa4nTR4Oi77&_nc_ohc=dtyyiqj5ANwQ7kNvwHQD696&_nc_oc=AdmNx_dbS7u6rdATV9xS-cxVmZ2qgUnSebNwZfAJyWY0EGSqo22k6r8eye6sY6t3QfU&_nc_zt=24&_nc_ht=scontent.fsgn2-4.fna&_nc_gid=ifqM__IRkCyWF8yYZVoKHA&oh=00_AfrEbtJ3meA-EYzxttdprQwPzd6kurgFEH38UG12xPNHDg&oe=69815CAE',
    },
  ];

  return (
    <section
      id="instructor"
      ref={sectionRef}
      className="relative py-16 md:py-24 scroll-mt-16 overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <h2
            ref={titleRef}
            className="text-3xl md:text-4xl font-bold text-text mb-8 text-center drop-shadow-lg"
            style={{ fontFamily: 'var(--font-crimson-pro)' }}
          >
            Thành viên nhóm 🚀
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-4xl">
            {members.map((member) => (
              <div
                key={member.name}
                ref={addToRefs}
                className="flex flex-col items-center bg-black/30 border border-revolutionary-gold/30 rounded-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-3 hover:shadow-2xl hover:border-revolutionary-gold/60"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 mb-4 shadow-md ring-4 ring-revolutionary-gold/20 hover:ring-revolutionary-gold/50 transition-all duration-300">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-bold text-primary text-lg text-center">
                  {member.name}
                </h3>
                <p className="text-revolutionary-gold text-sm">{member.mssv}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstructorSection;
