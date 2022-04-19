import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import * as HeroSvg from './HeroSvg'
import gsap from 'gsap'
import prefix from '@/helpers/prefix'
import customLoader from '@/helpers/customLoader'
import * as ga from '@/lib/ga'

type IProps = {
  loading: boolean
}

const Mobile = ({ loading }: IProps) => {
  const heroRef = useRef<HTMLElement>(null)
  const heroDiv = gsap.utils.selector(heroRef)

  useEffect(() => {
    if (!loading) {
      gsap.set(heroRef.current, { backgroundPosition: '0 -80px' })
      gsap.set(heroDiv('#big-mnt-img'), { top: '20vh', left: '50%' })
      gsap.set(heroDiv('#mid-mnt-img'), { top: '45vh', left: '50%' })
      gsap.set(heroDiv('#uiux-dev-txt'), {
        top: '50vh',
        left: '50%',
        translateX: '-50%',
        translateY: '-70%',
      })
      gsap.set(heroDiv('#sm-mnt-back'), { top: '64vh', xPercent: -10 })
      gsap.set(heroDiv('#climb-mnt'), { top: '95vh', left: '40%', scaleY: 0.2 })
      gsap.set(heroDiv('#sm-mnt-front'), {
        rotateY: 180,
        xPercent: -45,
        top: '78vh',
      })
      gsap.set(heroDiv('.cloud-left'), {
        rotateY: 180,
        top: '63vh',
        opacity: 0.5,
      })
      gsap.set(heroDiv('.cloud-right'), { top: '82vh', opacity: 0.2 })
      gsap.set(heroDiv('.cloud-center'), { top: '80vh', opacity: 0.2 })
      gsap.set(heroDiv('#cta-btn'), { top: '75vh' })

      const tl = gsap
        .timeline({
          scrollTrigger: {
            end: 600,
            scrub: 1,
          },
        })
        .to(heroRef.current, {
          backgroundPosition: '0 -110px',
          ease: 'none',
          duration: 1,
        })
        .to(
          heroDiv('#big-mnt-img'),
          { top: '30vh', duration: 1, ease: 'none' },
          '<'
        )
        .to(
          heroDiv('#mid-mnt-img'),
          { top: '45vh', duration: 1, ease: 'none' },
          '<'
        )
        .to(
          heroDiv('#uiux-dev-txt'),
          { top: '50vh', duration: 1, ease: 'none', translateY: '-30' },
          '<'
        )
        .to(
          heroDiv('#sm-mnt-back'),
          { top: '64vh', xPercent: 0, duration: 1, ease: 'none' },
          '<'
        )
        .to(
          heroDiv('#climb-mnt'),
          { top: '66vh', left: '50%', scale: 1, duration: 1, ease: 'none' },
          '<'
        )
        .to(
          heroDiv('#sm-mnt-front'),
          { top: '72vh', xPercent: -50, duration: 1, ease: 'none' },
          '<'
        )
        .to(
          heroDiv('.cloud-left'),
          { duration: 1, ease: 'none', opacity: 0.3, xPercent: -30 },
          '<'
        )
        .to(
          heroDiv('.cloud-right'),
          {
            top: '76vh',
            duration: 1,
            ease: 'none',
            opacity: 0.1,
            xPercent: 30,
          },
          '<'
        )
        .to(
          heroDiv('.cloud-center'),
          { top: '82vh', duration: 1, ease: 'none', opacity: 0.1, x: -50 },
          '<'
        )
        .to(
          heroDiv('#cta-btn'),
          { top: '90vh', duration: 1, ease: 'none', opacity: 0 },
          '<'
        )
    }
  }, [loading])

  const handleAction = (): void => {
    gsap.to(window, { duration: 0.5, scrollTo: 'main' })
    ga.event({
      action: 'hero_cta',
      params: {
        event_category: '3-3-3 Principle',
        event_label: 'mobile screen',
      },
    })
  }

  return (
    <section
      ref={heroRef}
      className={`w-screen min-h-screen bg-blue-200 transform-all bg-cover
        ${
          loading
            ? 'bg-gradient-to-r from-purple-400 via-purple-300 to-rose-100'
            : 'bg-transparent'
        }`}
      style={{
        backgroundImage: !loading
          ? `url('${prefix}/img/dev/gabriel/hero-light-bg.png')`
          : '',
      }}
    >
      <div
        className={`relative w-full mx-auto transform-all duration-200 ${
          loading ? 'hidden' : 'flex'
        } flex-col max-w-xl-screen`}
      >
        <div
          className='absolute w-[200vw] h-auto z-0 transform -translate-x-1/2'
          id='big-mnt-img'
        >
          <Image
            priority
            src={`${prefix}/img/dev/gabriel/mid-mnt-img.png`}
            layout='intrinsic'
            width={1728}
            height={881}
            loader={customLoader}
            unoptimized
          />
        </div>
        <div className='absolute w-1/2 h-auto z-10 transform' id='uiux-dev-txt'>
          <HeroSvg.UXDevMobile />
        </div>
        <div className='cloud-right absolute right-0 w-1/3 opacity-70 z-50'>
          <div className=''>
            <Image
              priority
              src={`${prefix}/img/dev/gabriel/cloud-mnt-right.png`}
              layout='intrinsic'
              width={1728}
              height={919}
              loader={customLoader}
              unoptimized
            />
          </div>
        </div>
        <div
          className='absolute w-[180vw] h-auto z-30  transform -translate-x-1/2'
          id='mid-mnt-img'
        >
          <Image
            priority
            src={`${prefix}/img/dev/gabriel/big-mnt-img.png`}
            layout='intrinsic'
            width={1728}
            height={919}
            loader={customLoader}
            unoptimized
          />
        </div>
        <div className='cloud-left absolute left-0 w-1/2 opacity-70 z-30'>
          <div className=''>
            <Image
              priority
              src={`${prefix}/img/dev/gabriel/cloud-mnt-right.png`}
              layout='intrinsic'
              width={1988}
              height={1290}
              loader={customLoader}
              unoptimized
            />
          </div>
        </div>
        <div className='absolute left-0 w-[200vw] h-auto z-40' id='sm-mnt-back'>
          <Image
            priority
            src={`${prefix}/img/dev/gabriel/sm-mnt-front.png`}
            layout='intrinsic'
            width={1728}
            height={584}
            loader={customLoader}
            unoptimized
          />
        </div>
        <div className='cloud-center absolute left-1/3 w-2/5 opacity-80 z-40'>
          <div className=''>
            <Image
              priority
              src={`${prefix}/img/dev/gabriel/cloud-mnt-center.png`}
              layout='intrinsic'
              width={1499}
              height={876}
              loader={customLoader}
              unoptimized
            />
          </div>
        </div>
        <div
          className='absolute transform -translate-x-1/2 w-1/2 z-40'
          id='climb-mnt'
        >
          <Image
            priority
            src={`${prefix}/img/dev/gabriel/climb-mnt.png`}
            layout='intrinsic'
            width={927}
            height={945}
            loader={customLoader}
            unoptimized
          />
        </div>
        <div
          className='absolute w-[200vw] h-auto opacity-95 z-50'
          id='sm-mnt-front'
        >
          <Image
            priority
            src={`${prefix}/img/dev/gabriel/sm-mnt-front.png`}
            layout='intrinsic'
            width={1728}
            height={584}
            loader={customLoader}
            unoptimized
          />
        </div>
        <div className='absolute right-0 z-50' id='cta-btn'>
          <button
            className='font-futura text-sm md:text-xl pb-1.5 pt-2 pl-5 pr-6 md:pr-16 font-semibold  text-white tracking-wider bg-primary hover:bg-opacity-100 transform transition-all duration-200 rounded-l-sm border-white uppercase'
            onClick={handleAction}
          >
            <span className='block font-wask text-left tracking-widest leading-relaxed font-thin'>
              Read The
            </span>
            3-3-3 Principles
            <span className='block font-wask font-thin text-left text-lg'>
              for a better UX
            </span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Mobile
