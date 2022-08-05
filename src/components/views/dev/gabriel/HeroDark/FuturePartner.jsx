import React, { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

const Futurepartner = () => {
  const containerRef = useRef()
  const container = gsap.utils.selector(containerRef)

  useEffect(() => {
    gsap
      .timeline()
      .from(
        container('.should-hide'),
        { opacity: 0, stagger: 0.05, duration: 0.5 },
        '<'
      )
  }, [])

  return (
    <>
      <h2 className='should-hide text-2xl md:text-3xl font-futura font-bold mb-5 lg:mb-10 text-center md:text-left'>
      💬 Dear <span className='text-primary'>Future Partner</span> 
      </h2>
      <div
        ref={containerRef}
        className='space-y-4 lg:space-y-6 text-lg lg:text-xl lg:max-w-3xl tracking-wider font-openSans'
      >
        <p className='should-hide'>
          It may sound cliche, buy I grew up admiring successful people like Steve Jobs, Bill Gates and Mark Zuckerberg. That's why I chose to study Technology.
        </p>
        <p className='should-hide'>
          My dream was - and still is - to create products that would be useful for countless people, and would help them solve their daily basis problems.
        </p>
        <p className='should-hide'>
          In my previous jobs, I was always searching for problems that could have been solved by creating and implementing a system.
        </p>
        <p className='should-hide'>
          So far I have created simple calculators, admin dashboards, databases, processes supporters, and websites. I did most of my projects in my freelancing journey.
        </p>
        <p className='should-hide'>
          Some of them were for personal usage, some of them for organizations usage. But all of them was for solving someone's problem. 
        </p>
        <p className='should-hide'>
          You can see some repercussions that I'm proud of here and here (both in Japanese).
        </p>
        <p className='should-hide'>
          Each project made me practice all I learned and the next one guided me to learn the next necessary things. 
        </p>
        <p className='should-hide'>
          That's why I included so many tech stacks from my experiences in this portfolio. This is all I have experienced so far.
        </p>
        <p className='should-hide'>
          And I can not say that I am a specialist in all that stacks. That would be impossible.
        </p>
        <p className='should-hide'>
          But that shows you that I am not afraid of learning new technologies or new frameworks from this vast world of technology.
        </p>
        <p className='should-hide'>
          What I am missing now is to work with ambitious people to bring up to the world great projects. To learn from teams, from people and from challenges.
        </p>
        <p className='should-hide'>
          And of course, to give my best to contribute to a better world, with better results and better performance for clients projects.
        </p>
        <h3 className='should-hide text-3xl font-semibold font-futura pt-5 text-center md:text-left'>
          If you <span className='text-primary capitalize'>hire me</span>
        </h3>
        <p className='should-hide'>
          You will have on your team someone that loves technology and pursues
          solutions all the time, that is detail oriented and is willing to
          learn new things.
        </p>
        <p className='should-hide'>
          I am someone who enjoys philosophical thinking to understand the world, the people, and the life. 
        </p>
        <p className='should-hide'>  
          So, sometimes you will see me saying deep things.
        </p>
        <p className='should-hide'>
          After more than 30 years living in Brazil, I came to live in Japan because I am Japanese and I love the Japanese culture.
        </p>
        <p className='should-hide'>
          My intention is to stay here, learn Japanese, and contribute for the local economy.
        </p>
        <p className='should-hide'>
          If you want to know more about me, I invite you to read below my thoughts about UI/UX.
        </p>
      </div>
    </>
  )
}

export default Futurepartner
