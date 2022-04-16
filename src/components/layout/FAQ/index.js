import React from 'react'
import { Transition } from '@headlessui/react'
import commonQuestions from './commonFaq.json'
import ReactMarkdown from 'react-markdown'

const Faq = ({ questions }) => {
  let customQuestions = [...commonQuestions, ...questions]

  return (
    <div className='w-full md:w-3/4 lg:w-3/4 xl:w-3/5 font-wask pb-32'>
      <h1 className='text-5xl md:text-5xl lg:text-4xl px-1'>
        <i className='uil uil-comment-question'></i> Frequently Asked Questions
      </h1>
      <div className='mt-14'>
        {customQuestions.map((i, index) => (
          <FaqItem
            key={index}
            question={i.question}
            answer={i.answer}
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

const FaqItem = (props) => {
  const { question, answer, index } = props
  const [open, setOpen] = React.useState(false)

  return (
    <div
      className={`border border-gray-200 border-l-0 border-r-0 ${
        index > 0 && 'border-t-0'
      } md:border-l md:border-r`}
    >
      <div className='flex'>
        <button
          className='transform duration-200 delay-50 w-full flex justify-between py-5 px-6 md:text-lg xl:text-2xl rounded-none text-neutral-800 hover:bg-blueGray-50 bg-opacity-50'
          onClick={() => setOpen(!open)}
        >
          <span className='font-bold tracking-widest text-left'>
            {question}
          </span>
          <i
            className={`uil uil-plus transform duration-75 origin-center ${
              open ? 'scale-80 rotate-45' : 'scale-105'
            }`}
          ></i>
        </button>
      </div>
      <div
        className={`transition-all duration-500 ${
          open ? 'max-h-screen pb-5' : 'max-h-0 p-0'
        } px-6 overflow-hidden`}
      >
        <div
          className={`transition-all h-full origin-top ${
            open ? '' : 'opacity-0'
          } duration-300`}
        >
          <p className='md:text-lg xl:text-2xl'></p>
          <ReactMarkdown components={mdComp}>{answer}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

export default Faq

const mdComp = {
  p: ({ node, children }) => (
    <p className='md:text-lg xl:text-2xl'>{children}</p>
  ),
  a: ({ node, children, href }) => (
    <a
      href={href}
      target='_blank'
      rel='noopener noreferrer'
      className='text-sky-400 font-extralight'
    >
      {children}
    </a>
  ),
}
