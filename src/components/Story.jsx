import { useRef } from "react";
import AnimatedTitle from "./AnimatedTitle";
import gsap from "gsap";
import RoundedCorners from "./RoundedCorners";
import Button from "./Button";

const Story = () => {
  const frameRef = useRef(null);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const element = frameRef.current;

    if (!element) return;

    const rect = element.getBoundingClientRect();
    const xPos = clientX - rect.left;
    const yPos = clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((yPos - centerY) / centerY) * -10;
    const rotateY = ((xPos - centerX) / centerX) * 10;

    gsap.to(element, {
      duration: 0.3,
      rotateX,
      rotateY,
      transformPerspective: 500,
      ease: "power1.inOut",
    });
  };

  const handleMouseLeave = () => {
    const element = frameRef.current;

    if (element) {
      gsap.to(element, {
        duration: 0.3,
        rotateX: 0,
        rotateY: 0,
        ease: "power1.inOut",
      });
    }
  };

  return (
    <div>
      <section id="story" className="w-screen bg-black min-h-dvh text-blue-50">
        <div className="flex flex-col items-center py-10 pb-24 size-full">
          <p className="text-sm uppercase font-general md:text-[10px]">
            The world of tactical FPS
          </p>
          <div className="relative size-full">
            <AnimatedTitle
              title="<b>T</b>he l<b>o</b>re unfo<b>l</b>ds <br /> V<b>A</b>lorant Pro<b>T</b>ocol"
              sectionId="#story"
              containerClass="mt-5 pointer-events-none mix-blend-difference relative z-10"
            />
            <div className="story-img-container">
              <div className="story-img-mask">
                <div className="story-img-content">
                  <img
                    ref={frameRef}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseLeave}
                    onMouseEnter={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    src="/img/entrance.png"
                    alt="Entrance"
                    className="object-contain"
                  />
                </div>
              </div>
              <RoundedCorners />
            </div>
          </div>
          <div className="-mt-80 flex w-full justify-center md:-mt-64 md:me-44 md:justify-end ">
            <div className="flex h-full w-fit flex-col items-center md:items-start">
              <p className="mt-3 max-w-sm text-center font-circular-web text-violet-50 md:text-start">
                Dive into a world where Agents from across the globe unite to
                combat mysterious threats and secure the future of the planet.
              </p>
              <a href="">
                <Button
                  id="realm-btn"
                  title="explore the lore"
                  containerClass="mt-5"
                />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Story;
