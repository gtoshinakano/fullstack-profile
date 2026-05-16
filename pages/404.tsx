import React, { useEffect, useRef, ReactElement } from 'react'
import Layout from '@Components/layout/Public'
import gsap from 'gsap'

export default function Home(): ReactElement {
  const containerRef = useRef<HTMLElement>(null)

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
