import React, {useState} from 'react';
import * as HeroSection from "@Components/views/dev/gabriel/HeroSection"
import PublicLayout from '@/components/layout/Public';
import HeroDark from '@/components/views/dev/gabriel/HeroDark';
import MainContent from '@/components/views/dev/gabriel/MainContent';

const GabrielPage = () => {

  const [loading, setLoading] = useState(true);
  const [windowProps, setWindow] = useState({})
  
  React.useEffect(() => {
    const { Pace } = window
    Pace.on("done", () => {
      const {innerWidth, innerHeight } = window
      setLoading(false)
      setWindow({ width: innerWidth, height :innerHeight })
    })
    const handleResize = () => {
      const {innerWidth: width, innerHeight: height } = window
      setWindow({  width, height })
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const isWide = windowProps.width > windowProps.height;

  return (
    <PublicLayout title="UI/UX Dev. Gabriel Toshinori Nakano - Tokyo">
      {/* {isWide 
        ? <HeroSection.WideScreen loading={loading} /> 
        : <HeroSection.Mobile loading={loading} />} */}
      <HeroDark isWide={isWide} />
      <MainContent />
    </PublicLayout>
  );
}

export default GabrielPage;
