import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useTranslation, Trans } from 'react-i18next'

const Futurepartner = () => {
  const containerRef = useRef()
  const container = gsap.utils.selector(containerRef)
  const { t } = useTranslation('future-partner')

  console.log(t('intro', {returnObjects: true}))

  useEffect(() => {
    gsap
      .timeline()
      .from(
        container('.should-hide'),
        { opacity: 0, stagger: 0.05, duration: 0.5 },
        '<'
      )
  }, [])

  const translatedIntro = t("intro.paragraphs", {returnObjects: true})
  const translatedHire = t("hire.paragraphs", {returnObjects: true})

  return (
    <>
      <h2 className='should-hide text-2xl md:text-3xl font-futura font-bold mb-5 lg:mb-10 text-center md:text-left'>
        <Trans t={t} components={{span : <span className='text-primary'></span>}}>
          {t('intro.title')}
        </Trans>
      </h2>
      <div
        ref={containerRef}
        className='space-y-4 lg:space-y-6 text-lg lg:text-xl lg:max-w-3xl tracking-wider font-openSans'
      >
        <TransSection paragraphs={translatedIntro} t={t} />
        <h3 className='should-hide text-3xl font-semibold font-futura pt-5 text-center md:text-left'>
          <Trans t={t} components={{span : <span className='text-primary'></span>}}>
            {t('hire.title')}
          </Trans>
        </h3>
        <TransSection paragraphs={translatedHire} t={t} /> 
      </div>
    </>
  )
}

export default Futurepartner

const TransSection = ({paragraphs, t}) => (
  paragraphs.map((paragraph, i) => (
    !paragraph.components 
      ? <p key={i + paragraph.text} className='should-hide'>{paragraph.text}</p>
      : (
        <p
          key={i + paragraph.text}
          className='should-hide'
        >
          <TransParagraph 
            t={t}
            components={paragraph.components}
          >
            {paragraph.text}
          </TransParagraph>
        </p>
      )
  ))
)

const TransParagraph = ({components, t, children}) => {
  let comps = components.map(c => c.props ? elemMapping[c.elem](c.props) : elemMapping[c.elem])

 console.log(comps)

  return (
    <Trans 
      t={t}
      components={comps}
    >
      {children}
    </Trans>
  )
}

const elemMapping = {
  'strong': <strong />,
  'a': (props) => (<a {...props} />)
}
