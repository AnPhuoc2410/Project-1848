import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { TiLocationArrow } from "react-icons/ti";

export const BentoTilt = ({ children, className = "" }) => {
  const [transformStyle, setTransformStyle] = useState("");
  const itemRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!itemRef.current) return;

    const { left, top, width, height } =
      itemRef.current.getBoundingClientRect();

    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;

    const tiltX = (relativeY - 0.5) * 5;
    const tiltY = (relativeX - 0.5) * -5;

    const newTransform = `perspective(700px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(0.98, 0.98, 0.98)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
  };

  return (
    <div
      ref={itemRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: transformStyle }}
    >
      {children}
    </div>
  );
};

const BentoCard = ({ src, title, description }) => {
  return (
    <div className="relative size-full">
      <video
        src={src}
        loop
        muted
        autoPlay
        className="absolute top-0 left-0 object-cover object-center size-full"
      />
      <div className="relative z-10 flex flex-col justify-between p-5 size-full text-blue-50">
        <div>
          <h1 className="bento-title special-font">{title}</h1>
          {description && (
            <p className="mt-3 text-sm max-w-64 md:text-base">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="bg-black pb-52">
      <div className="container px-3 mx-auto md:px-10">
        <div className="px-5 py-32">
          <p className="text-lg font-circular-web text-blue-50">
            CREATIVITY IS YOUR GREATEST WEAPON.
          </p>
          <p className="max-w-md text-lg opacity-50 font-circular-web text-blue-50">
            More than guns and bullets, you’ll choose an Agent armed with
            adaptive, swift, and lethal abilities that create opportunities to
            let your gunplay shine.
          </p>
        </div>

        <BentoTilt className="relative w-full overflow-hidden rounded-md border-hsla mb-7 h-96 md:h-[65vh]">
          <BentoCard
            src="videos/skill-1.webm"
            title={
              <>
                DE<b>F</b>Y THE LI<b>M</b>ITS
              </>
            }
            description="Take on foes across Competitive and Unranked modes as well as Deathmatch and Spike Rush."
          />
        </BentoTilt>

        <div className="grid h-[135vh] grid-cols-2 grid-rows-3 gap-7">
          <BentoTilt className="row-span-1 bento-tilt_1 md:col-span-1 md:row-span-2">
            <BentoCard
              src="videos/skill-2.webm"
              title={
                <>
                  B<b>A</b>ttl<b>e</b>field <b>A</b>waits
                </>
              }
              description="Immerse yourself in the world of Valorant, where every map tells a story, and each match is an opportunity to outthink and outplay."
            />
          </BentoTilt>

          <BentoTilt className="row-span-1 bento-tilt_1 ms-32 md:col-span-1 md:ms-0">
            <BentoCard
              src="videos/skill.webm"
              title={
                <>
                  <b>A</b>ge<b>n</b>ts
                </>
              }
              description="Unique characters with abilities that redefine gameplay. Master their skills, build your strategies."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_1 me-14 md:col-span-1 md:me-0">
            <BentoCard
              src="videos/skill-3.webm"
              title={
                <>
                  R<b>a</b>nked Pl<b>a</b>y
                </>
              }
              description="Prove your skills, climb the ranks, and become the Radiant of Valorant."
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_2">
            <video
              src="videos/skill-4.webm"
              loop
              autoPlay
              muted
              className="object-cover object-center size-full"
            />
          </BentoTilt>

          <BentoTilt className="bento-tilt_2">
            <div className="flex flex-col justify-between p-5 size-full bg-violet-300">
              <h1 className="text-black bento-title special-font max-w-64">
                m<b>o</b>re co<b>m</b>ing s<b>o</b>on!
              </h1>
              <TiLocationArrow className="m-5 scale-[5] self-end" />
            </div>
          </BentoTilt>
        </div>
      </div>
    </section>
  );
};

BentoTilt.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

BentoCard.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.node.isRequired,
  description: PropTypes.string,
};

export default Features;
