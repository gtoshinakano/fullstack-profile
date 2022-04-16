import React, { useEffect, useRef } from 'react';
import Image from "next/image";
import * as HeroSvg from './HeroSvg';
import gsap from 'gsap';
import prefix from '@/helpers/prefix';
import customLoader from "@/helpers/customLoader"

const WideScreen = ({ loading }) => {

  const heroRef = useRef();
  const heroDiv = gsap.utils.selector(heroRef);

  useEffect(() => {
    if (!loading) {
      gsap.set(heroRef.current, { backgroundPositionY: "70%" });
      gsap.set(heroDiv("#big-mnt-img"), { top: "-10vh", rotateY: 180 });
      gsap.set(heroDiv("#mid-mnt-img"), { top: "38vh", rotateY: 180 });
      gsap.set(heroDiv("#uiux-dev-txt"), { top: "50vh", left: "50%", translateX: "-50%", translateY: "-50%" });
      gsap.set(heroDiv("#sm-mnt-back"), { top: "94vh", xPercent: -10 });
      gsap.set(heroDiv("#climb-mnt"), { top: "110vh", left: "40%" });
      gsap.set(heroDiv("#sm-mnt-front"), { rotateY: 180, xPercent: 10, top: "100vh" });
      gsap.set(heroDiv(".cloud-left"), { rotateY: 180, top: "50vh", opacity: 0.7 });
      gsap.set(heroDiv(".cloud-right"), { top: "70vh", opacity: 0.7 });
      gsap.set(heroDiv(".cloud-center"), { top: "74vh", opacity: 0.4 });
      gsap.set(heroDiv("#cta-btn"), { top: "75vh" });

      gsap.timeline({
        scrollTrigger: {
          end: 600,
          scrub: 1
        }
      })
        .to(heroRef.current, { backgroundPositionY: "60%", ease: "none", duration: 1 })
        .to(heroDiv("#big-mnt-img"), { top: "25vh", duration: 1, ease: "none" }, "<")
        .to(heroDiv("#mid-mnt-img"), { top: "40vh", duration: 1, ease: "none" }, "<")
        .to(heroDiv("#uiux-dev-txt"), { top: "80vh", duration: 1, ease: "none", translateY: "-=50%" }, "<")
        .to(heroDiv("#sm-mnt-back"), { top: "70vh", xPercent: 0, zoom: 1.1, duration: 1, ease: "none" }, "<")
        .to(heroDiv("#climb-mnt"), { top: "80vh", left: "50%", duration: 1, ease: "none" }, "<")
        .to(heroDiv("#sm-mnt-front"), { top: "80vh", xPercent: 0, duration: 1, ease: "none" }, "<")
        .to(heroDiv(".cloud-left"), { duration: 1, ease: "none", opacity: 0.3, xPercent: -30 }, "<")
        .to(heroDiv(".cloud-right"), { duration: 1, ease: "none", opacity: 0.3, xPercent: 30 }, "<")
        .to(heroDiv(".cloud-center"), { top: "90vh", duration: 1, ease: "none", opacity: 0.3, x: -300 }, "<")
        .to(heroDiv("#cta-btn"), { top: "90vh", duration: 1, ease: "none", opacity: 0 }, "<");
    }

  }, [loading]);

  const handleAction = () => {
    gsap.to(window, {duration: 0.5, scrollTo:"main"});
  }

  return (
    <section
      ref={heroRef}
      className={` h-screen min-h-screen bg-blue-200 transform-all bg-cover
        ${loading
          ? "bg-gradient-to-r from-purple-400 via-purple-300 to-rose-100"
          : "bg-transparent"}`}
      style={{
        backgroundImage: !loading ? `url('${prefix}/img/dev/gabriel/hero-light-bg.png')` : ""
      }}
    >
      <div
        className={`relative w-full mx-auto transform-all duration-200 ${loading ? "hidden" : "flex"} flex-col max-w-xl-screen`}
      >
        <div
          className='absolute w-full h-auto z-0'
          id="big-mnt-img"
        >
          <Image priority src={`${prefix}/img/dev/gabriel/mid-mnt-img.png`}
            layout="intrinsic" width={1728} height={881} loader={customLoader} unoptimized />
        </div>

        <div
          className='absolute w-3/4 xl:w-2/3 h-auto z-10'
          id='uiux-dev-txt'
        >
          <HeroSvg.UXDevWide />
        </div>
        <div
          className='cloud-right absolute right-0 w-1/3 opacity-70 z-50'
        >
          <div className=''>
            <Image priority src={`${prefix}/img/dev/gabriel/cloud-mnt-right.png`} layout="intrinsic" width={1728} height={919} loader={customLoader} unoptimized />
          </div>
        </div>
        <div className='absolute w-full h-auto z-30'
          id="mid-mnt-img"
        >
          <Image priority src={`${prefix}/img/dev/gabriel/big-mnt-img.png`}
            layout="intrinsic" width={1728} height={919} loader={customLoader} unoptimized />
        </div>
        <div
          className='cloud-left absolute left-0 w-1/2 opacity-70 z-10'
        >
          <div className=''>
            <Image priority src={`${prefix}/img/dev/gabriel/cloud-mnt-right.png`}
              layout="intrinsic" width={1988} height={1290} loader={customLoader} unoptimized />
          </div>
        </div>
        <div className='absolute left-0 w-full h-auto opacity-90 z-40'
          id="sm-mnt-back"
        >
          <Image priority src={`${prefix}/img/dev/gabriel/sm-mnt-front.png`}
            layout="intrinsic" width={1728} height={584} loader={customLoader} unoptimized />
        </div>
        <div
          className='cloud-center absolute left-1/3 w-2/5 z-40'
        >
          <div className=''>
            <Image priority src={`${prefix}/img/dev/gabriel/cloud-mnt-center.png`}
              layout="intrinsic" width={1499} height={876} loader={customLoader} unoptimized />
          </div>
        </div>
        <div className='absolute transform -translate-x-1/2 w-1/4 z-40'
          id="climb-mnt"
        >
          <Image priority src={`${prefix}/img/dev/gabriel/climb-mnt.png`}
            layout="intrinsic" width={927} height={945} loader={customLoader} unoptimized />
        </div>
        <div
          className='absolute w-full h-auto opacity-95 z-50'
          id="sm-mnt-front"
        >
          <Image priority src={`${prefix}/img/dev/gabriel/sm-mnt-front.png`}
            layout="intrinsic" width={1728} height={584} loader={customLoader} unoptimized />
        </div>
        <div
          className='absolute right-0 z-50'
          id="cta-btn"
        >
          <button
            className='font-futura text-xl pt-2.5 pb-2 pl-5 pr-16 font-semibold  text-white tracking-wider bg-primary hover:bg-opacity-100 transform transition-all duration-200'
            onClick={handleAction}
          >
            <span className='block font-wask font-semibold text-left text-sm'>Read The</span>
            3-3-3 Principles
            <span className='block font-wask font-thin text-left text-lg'>for a better UX</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default WideScreen