import React, { useRef, useEffect, useState } from 'react'
import StacksJson from '@/data/stacks.json'
import ProjectsJson from '@/data/toshi-projects.json'
import Image from 'next/image'
import gsap from 'gsap'
import _ from 'lodash'
import prefix from '@/helpers/prefix'
import customLoader from '@/helpers/customLoader'
import { useTranslation } from 'react-i18next'

type IProject = {
  period: string[]
  type: string
  title: string
  subtitle: string
  learnings: string
  country: string
  where: string
  public: string
  problem: string
  solution: string
  stacks: string[]
  cover?: any
  action: { label: string; url: string }
  label: string // Unique Key of project
}

type anyObj = {
  [key: string]: any
}

const Projects = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const container = gsap.utils.selector(containerRef)
  const { t } = useTranslation()

  useEffect(() => {
    gsap
      .timeline()
      .from(container('.icons-rotate'), {
        x: 1500,
        stagger: 0.05,
        duration: 0.5,
        reversed: true,
      })
      .to(container('.should-hide'), { opacity: 1, stagger: 0.05 }, '<')
  }, [])

  let data: IProject[] = ProjectsJson
  let stacks: anyObj = StacksJson
  const [expanded, setExpanded] = useState<string[]>([])

  const allExpanded: boolean = expanded.length === data.length

  const toggleAll = () => {
    if (allExpanded) setExpanded([])
    else setExpanded(data.map((item) => item.label))
  }

  const toggleByLabel = (label: string) => {
    if (!expanded.includes(label)) setExpanded([...expanded, label])
    else {
      const index = expanded.indexOf(label)
      let newState = [...expanded]
      if (index !== -1) {
        newState.splice(index, 1)
      }
      setExpanded(newState)
    }
  }

  let projects = _.reverse([...data])

  return (
    <>
      <h2 className='should-hide text-2xl md:text-3xl font-futura font-bold mb-5 capitalize text-center md:text-left'>
        🚀 {t('projects.jobs')}
        <span className='text-primary'> & </span>
        {t('projects.personal-projects')}
      </h2>
      <div className='should-hide w-full flex pb-2 '>
        <button
          className={` text-xs px-3 flex transition-all duration-150 rounded-full hover:scale-105 hover:bg-opacity-90 font-thin w-32 ${
            allExpanded ? 'bg-secondary' : 'bg-figmaBlue'
          }`}
          onClick={toggleAll}
        >
          {allExpanded ? (
            <i className='uil uil-minus text-xl mr-2'></i>
          ) : (
            <i className='uil uil-plus text-xl mr-2'></i>
          )}
          <span className='my-auto text-white font-trueno'>
            {allExpanded ? t('hide-all') : t('expand-all')}
          </span>
        </button>
      </div>
      <div ref={containerRef} className='w-full flex flex-col md:pl-5 pt-3'>
        {projects.map((item) => (
          <div
            className='should-hide opacity-0 w-full flex font-trueno border-l-2 border-figmaBlue pb-8'
            key={item.label}
          >
            <div className='absolute transform -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-figmaBlue border-2'></div>
            <div className='flex flex-wrap w-full'>
              <div className='pl-5 w-full md:max-w-lg xl:max-w-xl text-xs pt-0.5'>
                <span className='font-thin italic text-secondary text-xs uppercase mt-1 float-right'>
                  {item.type}
                </span>
                {item.period.map((period, i) => (
                  <span key={period + i} className=''>
                    {period} {i === 0 && '-'}{' '}
                  </span>
                ))}
                <span className='text-secondary'> | </span>
                {item.where} {item.country}
                <h3 className='block font-semibold text-lg mt-1'>
                  {item.title}
                </h3>
                <small className='mb-3 block tracking-widest  transform -translate-y-1'>
                  {item.subtitle}
                </small>
                <p className='tracking-wider text-slate-400 mb-1.5 block'>
                  <i className='uil uil-lightbulb-alt text-secondary'></i>{' '}
                  {item.learnings}
                </p>
                <div
                  className={`transition-all duration-300 overflow-hidden ${
                    !expanded.includes(item.label) ? 'max-h-0' : 'max-h-screen'
                  }`}
                >
                  <p className='tracking-wider mb-1.5'>
                    <span className='md:font-semibold text-slate-500'>
                      {t('projects.target')}:{' '}
                    </span>
                    {item.public}
                  </p>
                  <p className='tracking-wider mb-1.5'>
                    <span className='md:font-semibold text-slate-500'>
                    {t('projects.problem')}:{' '}
                    </span>
                    {item.problem}
                  </p>
                  <p className='tracking-wider mb-1.5'>
                    <span className='md:font-semibold text-slate-500'>
                    {t('projects.solution')}:{' '}
                    </span>
                    {item.solution}
                  </p>
                  <div className='flex flex-wrap overflow-hidden '>
                    <i className='uil uil-layer-group text-2xl text-slate-500 my-auto mr-4 hidden md:block'></i>
                    <span className='w-full block md:hidden mb-1 text-slate-500'>
                    {t('projects.tech-stacks-used')}
                    </span>
                    {item.stacks.map((stack, ind) => (
                      <div
                        className={`icons-rotate p-1 my-0.5 mx-1 bg-white rounded-full overflow-hidden ${stacks[stack].css}`}
                        key={stack + ind}
                      >
                        <div
                          className={`w-8 h-8 relative ${stacks[stack].css}`}
                        >
                          <Image
                            src={prefix + stacks[stack].src}
                            alt={`Gabriel Toshinori Nakano has experience with ${stacks[stack].name}`}
                            title={stacks[stack].name}
                            fill
                            className='object-scale-down'
                            loader={customLoader}
                            unoptimized
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={'flex w-full mt-2.5'}>
                  <button
                    onClick={() => toggleByLabel(item.label)}
                    className={`font-extralight text-figmaBlue flex ${
                      !expanded.includes(item.label) ? 'underline' : ''
                    }`}
                  >
                    {!expanded.includes(item.label) ? t('projects.read') : t('projects.hide')}
                    <i
                      className={`uil uil-plus block h-4 w-4 transform duration-300 transition-all ${
                        !expanded.includes(item.label)
                          ? 'rotate-0 '
                          : 'rotate-45  text-white rounded-full ml-0'
                      }`}
                    ></i>
                  </button>
                  {item.action?.label !== '' && (
                    <a
                      target='_blank'
                      href={item.action.url}
                      className={`font-extralight hover:underline flex ml-16 rounded-full bg-primary px-2.5 py-0.5`}
                    >
                      {item.action.label}
                      <i className='uil uil-corner-up-right ml-2'></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default Projects
