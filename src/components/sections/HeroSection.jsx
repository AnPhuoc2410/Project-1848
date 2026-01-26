import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/all';
import { TiLocationArrow } from 'react-icons/ti';
import { useRef, useState, useEffect } from 'react';

import Button from '../Button';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const shouldRenderMedia = true; // keep media visible
  const autoRotateMedia = false;

  // Shared gradient text style for hero headings (yellow to red)
  const heroGradientText =
    'bg-gradient-to-r from-yellow-200 via-yellow-300 to-red-700 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,255,255,0.35)]';

  // Fallback to ensure loading screen doesn't get stuck
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadedCount(100); // Checkmate mechanism to force "loaded"
    }, 5000); // 5 seconds max wait

    return () => clearTimeout(timer);
  }, []);

  const mediaResources = [
    // { type: 'image', src: '/img/1.jpg' },
    // { type: 'image', src: '/img/2.jpg' },
    // { type: 'image', src: '/img/3.jpeg' },
    { type: 'image', src: '/img/4.png' },
    // { type: 'image', src: '/img/6.webp' },
    // { type: 'image', src: '/img/7.jpeg' },
    // { type: 'image', src: '/img/8.jpg' },
    // { type: 'image', src: '/img/9.jpeg' },
  ];

  const totalSlides = mediaResources.length;
  const nextMediaRef = useRef(null);

  const handleMediaLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  const handleMediaError = () => {
    console.warn('HeroSection: A media resource failed to load, skipping...');
    setLoadedCount((prev) => prev + 1);
  };

  // 0-based index helper for mediaResources
  const getMediaResource = (index) => mediaResources[(index - 1) % totalSlides];

  const isLoading = shouldRenderMedia ? loadedCount < totalSlides : false;

  const handleMiniVdClick = () => {
    if (!shouldRenderMedia) return;
    setHasClicked(true);
    setCurrentIndex((prevIndex) => (prevIndex % totalSlides) + 1);
  };

  useEffect(() => {
    if (!shouldRenderMedia || !autoRotateMedia) return undefined;
    const interval = setInterval(() => {
      handleMiniVdClick();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, shouldRenderMedia]);

  useGSAP(
    () => {
      if (shouldRenderMedia && hasClicked) {
        gsap.set('#next-media', { visibility: 'visible' });
        gsap.to('#next-media', {
          transformOrigin: 'center center',
          scale: 1,
          width: '100%',
          height: '100%',
          duration: 1,
          ease: 'power1.inOut',
          onStart: () => {
            if (nextMediaRef.current && nextMediaRef.current.play) {
              nextMediaRef.current.play();
            }
          },
        });
        gsap.from('#current-media', {
          transformOrigin: 'center center',
          scale: 0,
          duration: 1.5,
          ease: 'power1.inOut',
        });
      }
    },
    {
      dependencies: [currentIndex, hasClicked, shouldRenderMedia],
      revertOnUpdate: true,
    }
  );

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(14% 0, 72% 0, 88% 90%, 0 95%)',
      borderRadius: '0% 0% 40% 10%',
    });
    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      borderRadius: '0% 0% 0% 0%',
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: 'bottom center',
        scrub: true,
      },
    });
  });

  const renderMedia = (
    index,
    className,
    id,
    ref = null,
    isBackground = false
  ) => {
    if (!shouldRenderMedia) return null;
    const resource = getMediaResource(index);
    if (!resource) return null;

    // Dim background for readability and dim any video to 80% visibility
    const opacityClasses = [];
    if (isBackground) opacityClasses.push('opacity-80');
    if (resource.type === 'video') opacityClasses.push('opacity-80');
    const mediaClassName = `${className} ${opacityClasses.join(' ')}`.trim();

    if (resource.type === 'video') {
      return (
        <video
          ref={ref}
          src={resource.src}
          className={mediaClassName}
          id={id}
          loop
          muted
          autoPlay={isBackground} // Only autoplay if it's the background
          onLoadedData={handleMediaLoad}
          onError={handleMediaError}
        />
      );
    }

    return (
      <img
        ref={ref}
        src={resource.src}
        className={mediaClassName}
        id={id}
        onLoad={handleMediaLoad}
        onError={handleMediaError}
        alt="Hero content"
      />
    );
  };

  return (
    <header id="home" className="relative h-dvh w-screen overflow-x-hidden">
      <div className="absolute inset-0 z-0 bg-background">
        <div className="absolute inset-0 bg-grid-pattern" />
      </div>

      {isLoading && (
        <div className="flex-center absolute z-[100] h-full w-full overflow-hidden bg-violet-50/70">
          <div className="three-body">
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
            <div className="three-body__dot"></div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex h-dvh w-screen items-center justify-center">
        <div
          id="video-frame"
          className="relative z-10 h-dvh w-screen overflow-hidden bg-blue-75"
        >
          <div>
            <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
              <div
                onClick={handleMiniVdClick}
                className="origin-center scale-50 opacity-0 transition-all duration-500 ease-in hover:scale-100 hover:opacity-100"
              >
                {/* Mini Media: Shows next (index + 1) */}
                {renderMedia(
                  (currentIndex % totalSlides) + 1,
                  'size-64 origin-center scale-150 object-cover object-center',
                  'current-media'
                )}
              </div>
            </div>

            {/* Next Media: animating in (current index) */}
            {renderMedia(
              currentIndex,
              'absolute-center invisible absolute z-20 size-64 object-cover object-center',
              'next-media',
              nextMediaRef
            )}

            {/* Background Media: current index */}
            {renderMedia(
              1,
              'absolute left-0 top-0 size-full object-cover object-center',
              'bg-media',
              null,
              true
            )}

            {/* Dark Overlay */}
            <div className="absolute left-0 top-0 size-full bg-black/40 z-10 pointer-events-none" />
          </div>

          <h1
            className={`special-font hero-heading absolute bottom-5 right-5 z-40 ${heroGradientText}`}
          >
            K<b>H</b>OA<b> H</b>ỌC
          </h1>

          <div className="absolute left-0 top-0 z-40 size-full">
            <div className="mt-24 px-5 sm:px-10">
              <h1 className={`special-font hero-heading ${heroGradientText}`}>
                CH<b>Ủ</b> NGH<b>Ĩ</b>A <br /> X<b>Ã</b> HỘ<b>I</b>
              </h1>

              <p className="mb-5 max-w-100 font-robert-regular text-white text-lg">
                Khóa học nền tảng về tư tưởng và lý luận <br />
                Củng cố kiến thức, mở rộng tầm nhìn.
              </p>
              <a href="#introduction">
                <Button
                  id="cta-course"
                  title="Khám phá khóa học"
                  leftIcon={<TiLocationArrow />}
                  containerClass="bg-secondary flex-center gap-1 text-text"
                />
              </a>
            </div>
          </div>
        </div>

        <h1 className={`special-font hero-heading absolute bottom-5 right-5 `}>
          K<b>H</b>OA<b> H</b>ỌC
        </h1>
      </div>
    </header>
  );
};

export default HeroSection;
