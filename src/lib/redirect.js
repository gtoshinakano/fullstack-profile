import { useEffect } from 'react'
import { useRouter } from 'next/router'
import languageDetector from './languageDetector'

export const useRedirect = (to) => {
  const router = useRouter()
  to = to || router.asPath


  // language detection
  useEffect(() => {
    const detectedLng = languageDetector.detect()
    const basePath = process.env.NODE_ENV === 'production' ?  process.env.NEXT_PUBLIC_BASE_PATH + '/' : '/'
    if (to.startsWith(basePath + detectedLng) && router.route === '/404') { // prevent endless loop
      router.replace(basePath + detectedLng + router.route)
      return
    }

    languageDetector.cache(detectedLng)
    router.replace(basePath + detectedLng + to)
  })

  return <></>
};

export const Redirect = () => {
  useRedirect()
  return <></>
}

// eslint-disable-next-line react/display-name
export const getRedirect = (to) => () => {
  useRedirect(to)
  return <></>
}