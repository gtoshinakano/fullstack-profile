import React, { useRef, useState, useEffect, ReactNode } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Jobs from './Jobs'
import Projects from './Projects'
import FuturePartner from '@Views/dev/gabriel/HeroDark/FuturePartner'
import ScrollToPlugin from 'gsap/dist/ScrollToPlugin'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import prefix from '@/helpers/prefix'
import customLoader from '@/helpers/customLoader'
import { event } from '@/lib/ga'

gsap.registerPlugin(ScrollToPlugin)
gsap.registerPlugin(ScrollTrigger)

dayjs.extend(relativeTime)

interface IProps {
  isWide: boolean | 0 | undefined
}

const Herodark = ({ isWide }: IProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const container = gsap.utils.selector(containerRef)

  const [selected, setSelected] = useState<string>('job') //job projects partner
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: container('#profile-photo'),
          scrub: 1,
          start: 'top center',
          end: '10% 10%',
        },
      })
      .to(container('#profile-photo-01'), { opacity: 0 })
      .from(container('#profile-photo-02'), { opacity: 0 }, '<')
      .to(container('#profile-photo-02'), { opacity: 0 })
      .from(container('#profile-photo-03'), { opacity: 0 }, '<')
  }, [])

  const onSelect = (newSelected: string): void => {
    setLoading(true)
    gsap
      .timeline({
        onComplete: () => {
          setSelected(newSelected)
          setLoading(false)
          event({
            action: 'menu_click',
            params: { event_category: newSelected },
          })
        },
      })
      .to(
        container('#mid-container .should-hide'),
        { opacity: 0, stagger: 0.05, reversed: true, duration: 0.01 },
        '<'
      )
      .to(window, { scrollTo: '#profile-photo' }, '<')
  }

  return (
    <section
      className={`bg-heroGray pt-48 lg:pt-80 xl:pt-[36rem] text-white pb-20 mb-10 md:mb-24`}
    >
      <div ref={containerRef} className='w-full max-w-xl-screen mx-auto p-4'>
        <div className='flex flex-wrap'>
          <div className='w-full md:w-2/3 flex flex-col px-4 md:pl-16 py-6'>
            <div className='font-trueno font-light text-xs md:text-sm'>
              <span className='font-pacifico'> Hi ! 👋 </span>
              <span className='hidden md:inline'>my name is </span>
              <span className='inline md:hidden'>I'm </span>
              Gabriel Toshinori Nakano,
            </div>
            <div className='font-futura text-5xl md:text-6xl font-bold'>
              Call me <span className='text-secondary'>Toshi</span>,
            </div>
            <div className='font-trueno font-semibold text-sm md:text-xl leading-loose'>
              UI/UX Developer | Full-Stack | NextJS
            </div>
            <div className='font-futura font-semibold text-sm leading-loose capitalize hidden md:block'>
              A New UX Designer with{' '}
              {dayjs().subtract(2011, 'year').format('YYYY')} years of coding
              experience.
            </div>
            <div className='font-trueno font-thin text-sm mt-5'>
              <p>🇯🇵 Japanese Brazilian 🇧🇷</p>
              {/*  */}
              <p>🎂 {dayjs(new Date(1988, 3, 9)).toNow(true)}</p>
              <p>🗼 Based in Tokyo</p>
            </div>
          </div>
          <div
            id='profile-photo'
            className='w-full md:w-1/3 lg:pr-16 py-5 my-auto'
          >
            <div className='relative w-72 h-72 md:w-60 md:h-60 lg:w-80 lg:h-80 rounded-full overflow-hidden border-4 mx-auto my-auto border-white'>
              <div id='profile-photo-01' className={'absolute'}>
                <Image
                  src={`${prefix}/img/dev/gabriel/gabriel-photo.png`}
                  width={1131}
                  height={1131}
                  layout='intrinsic'
                  loader={customLoader}
                  unoptimized
                />
              </div>
              <div id='profile-photo-02' className={'absolute'}>
                <Image
                  src={`${prefix}/img/dev/gabriel/gabriel-github.png`}
                  width={460}
                  height={460}
                  layout='intrinsic'
                  loader={customLoader}
                  unoptimized
                />
              </div>
              <div id='profile-photo-03' className={'absolute'}>
                <Image
                  src={`${prefix}/img/dev/gabriel/gabriel-photo.jpg`}
                  width={2199}
                  height={2184}
                  layout='intrinsic'
                  loader={customLoader}
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
        <Menu setSelected={onSelect} selected={selected} loading={loading} />
        <div className='flex flex-wrap pt-16 lg:pt-28'>
          <div className='px-4 md:px-16 flex flex-col font-thin mx-auto'>
            <div id='mid-container' className={`mx-auto`}>
              {selected === 'job' && <Jobs />}
              {selected === 'projects' && <Projects />}
              {selected === 'partner' && <FuturePartner />}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Herodark

interface IMenuProps {
  setSelected: (str: string) => void
  selected: string
  loading?: boolean
}

const Menu = ({ setSelected, selected, loading }: IMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const container = gsap.utils.selector(containerRef)

  useEffect(() => {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          end: 'max',
          pin: true,
          pinSpacing: false,
          toggleActions: 'play pause play reverse',
        },
      })
      .to(container('#menu-container'), {
        width: window.innerWidth < 768 ? window.innerWidth : 850,
        scale: 1.1,
        borderRadius: 0,
        duration: 0.7,
      })
    // .to(container("button"), {padding: "2px 0 2px 0"}, "<")
  }, [])

  return (
    <div className='relative'>
      <div ref={containerRef} className={`absolute w-full flex z-50`}>
        <div
          id='menu-container'
          className='flex w-[80%] md:w-1/2 lg:w-1/3 lg:min-w-[345px] border-b-42 border-primary rounded-full overflow-hidden shadow-md mx-auto'
        >
          <Button
            isActive={selected === 'job'}
            onClick={() => setSelected('job')}
          >
            Profile
          </Button>
          <Button
            isActive={selected === 'projects'}
            onClick={() => setSelected('projects')}
          >
            Timeline
          </Button>
          <Button
            isActive={selected === 'partner'}
            onClick={() => setSelected('partner')}
          >
            <span className='hidden md:inline'>For</span> Recruiters
          </Button>
        </div>
      </div>
    </div>
  )
}

interface IButtonProps {
  children: ReactNode
  className?: string
  isActive: boolean
  [x: string]: any
}

const Button = ({ children, className, isActive, ...rest }: IButtonProps) => {
  return (
    <button
      {...rest}
      className={`bg-white w-1/3 text-center py-2 font-trueno transition-all transform duration-150 hover:bg-ternary ${className} ${
        isActive
          ? 'cursor-not-allowed bg-gradient-to-br from-white via-slate-300 to-gray-400 text-primary font-[600] tracking-wider'
          : 'cursor-pointer text-ternary font-[100]  hover:text-figmaBlue hover:font-semibold'
      }`}
      disabled={isActive}
    >
      {children}
    </button>
  )
}
