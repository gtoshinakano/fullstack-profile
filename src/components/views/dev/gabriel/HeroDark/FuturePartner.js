import React, {useState, useEffect, useRef} from 'react';
import gsap from 'gsap'


const Futurepartner = () => {

  
  const containerRef = useRef()
  const container = gsap.utils.selector(containerRef)


  useEffect(() => {
    gsap.timeline()
      .from(container(".should-hide"), {opacity: 0, stagger: 0.05,  duration:0.5}, "<")
  }, []);

  return (
    <>
      <h2 className='should-hide text-2xl font-futura mb-5 lg:mb-10 text-center md:text-left'>
        🙍‍♂️ Why <span className='text-primary'>UI/UX Developer</span> and not <span className='text-primary'>Designer</span> ?
      </h2>
      <div ref={containerRef} className="space-y-4 lg:space-y-6 text-lg lg:text-xl lg:max-w-3xl tracking-wider font-openSans">
        <p className='should-hide'>My coding journey started on days when browsers didn't have Developer tools, the famous <strong>F12 key</strong>. </p>
        <p className='should-hide'>It was really hard to create websites full of user interactions at that time.</p>
        <p className='should-hide'>But, thanks to the evolution of technologies and browsers, now we can see more and more complex web applications doing an infinite amount of things.</p>
        <p className='should-hide'>My interest in UI/UX Design arose when browsers started to do complex features like playing videos and animating objects using pure CSS.</p>
        <p className='should-hide'>What intrigued me was how companies like Facebook and Youtube provided that level of user experience on a single web browser.</p>
        <p className='should-hide'>It was very exciting for me, because I always dreamed with being part of a big company or building my own APP.</p>
        <p className='should-hide'>And I realized that the code itself is not what makes a product perceived by people as useful.</p>
        <p className='should-hide'>What does that is the core idea of a product mixed with a good UX implementation.</p>
        <p className='should-hide'>So I decided to work more with the frontend side aiming to be closer to the end-user.</p>
        <p className='should-hide'>Learn Frontend Coding is not THAT difficult, but the challenge for most developers is the design part.</p>
        <p className='should-hide'>Because in general, we coders are more worried about making things work than making things beautiful and easy to understand.</p>
        <p className='should-hide'>But, as a developer who wishes to engage with impacting products, I felt the need to learn more about design and UX.</p>
        <p className='should-hide'>And through those studies, I realized that UX Design is something that is always going to exist and is an opportunity to learn more about people's minds.</p>
        <p className='should-hide'>That is the reason I'm pursuing a UX career now. </p>
        <p className='should-hide'>To gain experience, to work with end-users, to improve my design skills and make a positive impact on people's life.</p>
        <p className='should-hide'>And this is how I can contribute:</p>
        <h3 className='should-hide text-2xl font-futura pt-5 text-center md:text-left'>If you need a <span className='text-primary'>UI/UX Designer</span></h3>
        <p className='should-hide'>I will support the team by doing research, design, and prototypes. All having in consideration a preview experience about modeling systems architecture, data structure and processes.</p>
        <p className='should-hide'>I'm aware of the level of backend complexity needed to create any solution, so I will always design UX with what is technically possible in mind.</p>
        <p className='should-hide'>Since I don't have a personal design style shaped yet, I would appreciate working with other designers in order to learn from them.</p>
        <p className='should-hide'>Because, after all, I think that the goal of UX is to always pursue improvements and not perfectionism.</p>
        <p className='should-hide'>I've compiled my studies and written what I think are key principles to consider when creating for UI/UX.</p> 
        <p className='should-hide'>I called it <b className='font-semibold capitalize'>the 3-3-3 principles for a better UX</b>. You can read below to understand how I apply UX Design to my projects.</p>
        <h3 className='should-hide text-2xl font-futura pt-5 text-center md:text-left'>If you need a <span className='text-primary'>Frontend Developer</span></h3>
        <p className='should-hide'>I can build testable prototypes and MVPs (Minimum Viable Products) helping to maintain it.</p>
        <p className='should-hide'>I can join the development team and code to build SPA (Single Page Applications) similar to this portfolio in ReactJS connecting them with the backend structure.</p>
        <p className='should-hide'>With a solid CSS knowledge, I can turn a design file into a scalable, functional and responsive webpage with minimal configurations.</p>
        <p className='should-hide'>I know some ways to create complex Apps using free or free until limit BaaS (Backend As A Service) </p>
        <p className='should-hide'>And I'm also willing to work with ReactNative in order to learn more about Mobile development.</p>
        <h3 className='should-hide text-2xl font-futura pt-5 text-center md:text-left'>If you <span className='text-primary capitalize'>hire me</span></h3>
        <p className='should-hide'>You will have on your team someone that loves technology and pursues solutions all the time, that is detail oriented and is willing to learn new things.</p>
        <p className='should-hide'>I can do both coding and designing. You are free to choose how I could help you better!</p>
        <p className='should-hide'>I enjoy philosophical thinking to understand the world, the people, and our lives. Maybe sometimes you will see me saying deep things.</p>
        <p className='should-hide'>Although my Japanese level is (JLPT N3), I intend to enroll in a Japanese language school in order to get N2 in the future.</p>
        <p className='should-hide'>If you want to know more about me, I invite you to keep reading this page until the end.</p>
      </div>
    </>
  );
}

export default Futurepartner;
