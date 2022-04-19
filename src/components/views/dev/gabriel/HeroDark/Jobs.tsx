import React, {useEffect, useRef, useState, ReactElement} from 'react';
import Image from 'next/image';
import gsap from 'gsap'
import StacksJson from "@/data/stacks.json"
import ToolsJson from "@/data/swtools.json"
import _ from 'lodash'
import prefix from '@/helpers/prefix';
import customLoader from "@/helpers/customLoader"
import data from '@/data/jobs.json'

type anyObj = {
  [key: string]: any
}

const Jobs = () : ReactElement => {

  const containerRef = useRef<HTMLDivElement>(null)
  const container = gsap.utils.selector(containerRef)
  const [hasEducation, setEducation] = useState<boolean>(true)

  useEffect(() => {
    gsap.set(container(".should-hide"), {opacity:0})
    gsap.timeline()
      .from(container(".icons-rotate"), {x:1500, rotate: 360, stagger: 0.05, duration: 0.5})
      .to(container(".should-hide"), {opacity: 1, stagger: 0.2}, "<")
  }, []);

  let jobs = _.reverse([...data])
  let stacks : anyObj = StacksJson
  let tools : anyObj = ToolsJson

  return (
    <>
      <h2 className='should-hide text-2xl md:text-3xl font-futura font-bold mb-5 capitalize text-center md:text-left'>
        📋 Profile <span className='text-primary'>&</span> Experiences
      </h2>
      <div className='should-hide w-full my-4 space-y-2'>
        <h3 className='text-xl font-futura tracking-wider capitalize pb-2'>Summary</h3>
        <div className='pl-5 pb-4 space-y-1'>
          <p>• UI/UX Designer </p>
          <p>• FullStack Javascript Developer</p>
          <p>• Multi-Tech experienced</p>
          <p>• Japanese raised in Brazil</p>
        </div>
        <h3 className='text-xl font-futura tracking-wider capitalize pb-2'>Skills</h3>
        <div className='pl-5 pb-4 space-y-1'>
          <p>• Figma, Illustrator, Photoshop, Adobe XD</p>
          <p>• JavaScript/HTML/CSS</p>
          <p>• ReactJS/NextJS/Express</p>
          <p>• Firebase/Google Maps API/Analytics</p>
          <p>• SQL and NoSQL Data Modeling/Thinking</p>
          <p>• Google App Scripts (SpreadSheets)</p>          
        </div>
        <h3 className='text-xl font-futura tracking-wider capitalize pb-2'>Experiences</h3>
      </div>
      <div className='should-hide w-full flex pb-2'>
        <button
          className={`text-xs px-3 flex transition-all duration-150 rounded-full hover:scale-105 hover:bg-opacity-90 font-thin ${hasEducation ? "bg-secondary" : "bg-figmaBlue"}`}
          onClick={() => setEducation(!hasEducation)}
        >
          { hasEducation 
            ? <i className="uil uil-eye-slash text-xl mr-2"></i>
            : <i className="uil uil-eye text-xl mr-2"></i>
          }
          <span className='my-auto text-white font-trueno capitalize'>
            { hasEducation 
              ? "hide degrees"
              : "show degrees"
            }
          </span>
        </button>
      </div>
      <div ref={containerRef} className='w-full flex flex-col md:pl-5 pt-3'>
        {jobs.map((item, index) => (
          <React.Fragment key={item.company + index}>
            {index === 3 && hasEducation && (
              <div 
                className='should-hide w-full flex font-trueno border-l-2 border-secondary pb-6'
              >
                <div className="absolute transform -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-secondary border-2 "></div>
                <div
                  className='pl-5 w-4/5 xl:w-2/3 text-xs pt-0.5'
                >
                  <span className="text-white">Jul. 2010 - Jul. 2013</span>
                  <span className='text-secondary'> |</span> Graduation
                  <span className='block font-semibold text-lg mt-1 capitalize'>
                    <i className="uil uil-graduation-cap mr-2"></i>
                    Technologist In Business Management
                  </span>
                  <span className='text-slate-400'>Faculdade de Tecnologia - FATEC Zona Sul </span>
                </div>
                <div className="text-right mt-1.5">
                  <div className='w-14 h-10 lg:w-28 lg:h-20 ml-auto mr-0 bg-white rounded overflow-hidden relative'>
                    <Image src={`${prefix}/img/dev/gabriel/logo-fatec.png`}   layout="fill" objectFit="scale-down" loader={customLoader} unoptimized />
                  </div>
                </div>
              </div>
            )}
            <div 
              className='should-hide opacity-0 w-full flex font-trueno border-l-2 border-figmaBlue pb-6'
            >
              <div className="absolute transform -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-figmaBlue border-2 "></div>
              <div className='flex flex-wrap w-full'>
                <div className="pl-5 w-4/5 xl:w-2/3 text-xs pt-0.5">
                  {item.period.map((period, i) => (
                    <span key={period + i} className="">{period} {i===0 && "-"} </span>
                  ))}
                  <span className='text-secondary'>|</span> {item.job_name}
                  <span className='block font-semibold text-lg mt-1 mb-3'>{item.company}</span>
                  <div className='flex flex-wrap overflow-hidden '>
                    <i className="uil uil-layer-group text-2xl text-slate-600 my-auto mr-4 hidden md:block"></i>
                    <span className='w-full block md:hidden mb-1 text-slate-500'>Tech Stacks</span>
                    {item.stacks.map((stack: string, ind: number) => (
                      <div 
                        className={`icons-rotate p-1 my-0.5 mx-1 bg-white rounded-full overflow-hidden ${stacks[stack].css}`} 
                        key={stack + ind}
                      >
                        <div className={`w-8 h-8 relative ${stacks[stack].css}`}>
                          <Image src={prefix+stacks[stack].src} alt={`Gabriel Toshinori Nakano has experience with ${stacks[stack].name}`} title={stacks[stack].name} layout="fill" objectFit="scale-down" loader={customLoader} unoptimized/>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className='flex flex-wrap overflow-hidden '>
                    <i className="uil uil-wrench text-2xl text-slate-600 my-auto mr-4 hidden md:block"></i>
                    <span className='w-full block md:hidden mb-1 text-slate-500'>Tools</span>
                    {item.tools.map((tool, ind) => (
                      <div className={`icons-rotate p-1 my-0.5 mx-1 bg-white rounded-full overflow-hidden ${tools[tool].css}`} key={tool + ind}>
                        <div className={`w-8 h-8 relative ${tools[tool].css}`}>
                          <Image src={prefix+tools[tool].src} alt={`Gabriel Toshinori Nakano has experience with ${tools[tool].name}`} title={tools[tool].name} layout="fill" objectFit="scale-down" loader={customLoader} unoptimized/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-right mt-1.5">
                  <div className='w-14 h-14 lg:w-28 lg:h-28 ml-auto mr-0 bg-white rounded overflow-hidden relative'>
                    <Image src={prefix+item.image} layout="fill" objectFit="scale-down" loader={customLoader} unoptimized/>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        ))}
        {hasEducation && 
          <div 
            className='should-hide w-full flex font-trueno border-l-2 border-transparent pb-6'
          >
            <div className="absolute transform -translate-x-1/2 w-[20px] h-[20px] rounded-full bg-secondary border-2"></div>
            <div
              className='pl-5 w-4/5 xl:w-2/3 text-xs pt-0.5'
            >
              <span className="text-white">Jan. 2008 - Jul. 2010</span>
              <span className='text-secondary'> |</span> Graduation
              <span className='block font-semibold text-lg mt-1 capitalize'><i className="uil uil-graduation-cap mr-2"></i> Technologist In System Development And Analisys</span>
              <span className='text-slate-400'>Universidade Nove de Julho - UNINOVE</span>
            </div>
            <div className="text-right mt-1.5">
              <div className='w-14 h-10 lg:w-28 lg:h-20 ml-auto mr-0 bg-white rounded overflow-hidden relative'>
                <Image src={`${prefix}/img/dev/gabriel/logo-uninove.png`} layout="fill" objectFit="scale-down" loader={customLoader} unoptimized/>
              </div>
            </div>
          </div>
        }
        <div className='should-hide w-full mb-4 space-y-2'>
          <h3 className='text-xl font-futura tracking-wider capitalize pb-2'>languages</h3>
          <p>🗣 Portuguese (Native)</p>
          <p>🗣 Japanese Low Business Level</p>
          <p>🗣 English Low Business Level</p>
        </div>
      </div>
    </>
  );
}

export default Jobs;