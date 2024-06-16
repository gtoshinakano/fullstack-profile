import React, { useEffect, useRef, ReactElement } from 'react'
import Layout from '@Components/layout/Public'
import gsap from 'gsap'

export default function Home(): ReactElement {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    gsap
      .timeline({ repeat: -1 })
      .to(containerRef.current, {
        backgroundColor: '#FEFADD',
        duration: 4,
      })
      .to(containerRef.current, {
        backgroundColor: '#F7F2A6',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#EED097',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#FCB47A',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#D7997F',
        duration: 1,
      })

      .to(containerRef.current, {
        backgroundColor: '#BF467A',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#322C52',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#140D16',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#10150F',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#203657',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#005E70',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#3E927F',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#98B282',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#FFEEB2',
        duration: 1,
      })
      .to(containerRef.current, {
        backgroundColor: '#FEFADD',
        duration: 1,
      })
  }, [])

  return (
    <Layout title='Error'>
      <section
        ref={containerRef}
        className='w-screen h-screen overflow-hidden flex flex-wrap justify-center align-middle bg-yellow-50'
      >
        <div className='w-full text-center z-50 text-black font-poppins text-1xl mt-10'>
          404 Error
        </div>
      </section>
      <div className='footer-bg fixed top-1/3 h-2/3 z-0 w-full'></div>
    </Layout>
  )
}
