import React, { useState, ReactElement } from 'react'
import * as HeroSection from '@Components/views/dev/gabriel/HeroSection'
import PublicLayout from '@/components/layout/Public'
import HeroDark from '@/components/views/dev/gabriel/HeroDark'
import MainContent from '@/components/views/dev/gabriel/MainContent'

declare global {
  interface Window {
    Pace: any
  }
}

interface IWindowProps {
  width?: number
  height?: number
}

const GabrielPage = (): ReactElement => {
  const [loading, setLoading] = useState<boolean>(true)
  const [windowProps, setWindow] = useState<IWindowProps>({})

  React.useEffect(() => {
    const { Pace } = window
    Pace.on('done', () => {
      const { innerWidth, innerHeight } = window
      setLoading(false)
      setWindow({ width: innerWidth, height: innerHeight })
    })
    const handleResize = (): void => {
      const { innerWidth: width, innerHeight: height } = window
      setWindow({ width, height })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const isWide =
    windowProps.width &&
    windowProps.height &&
    windowProps.width > windowProps.height

  return (
    <PublicLayout title='FULL STACK DEV. Gabriel Toshinori Nakano - Tokyo'>
      <section className='min-h-screen'>
        {!loading &&
          (isWide ? (
            <HeroSection.WideScreen loading={loading} />
          ) : (
            <HeroSection.Mobile loading={loading} />
          ))}
      </section>
      <HeroDark isWide={isWide} />
      <MainContent />
    </PublicLayout>
  )
}

export default GabrielPage
