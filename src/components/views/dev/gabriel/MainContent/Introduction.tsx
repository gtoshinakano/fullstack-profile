import React, { ReactElement } from 'react'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import type { Components } from 'react-markdown'
import prefix from '@/helpers/prefix'
import customLoader from '@/helpers/customLoader'
import { useTranslation } from 'react-i18next'
import articleEN from '@/content/article-en.md'
import articleJA from '@/content/article-ja.md'
import articlePTBR from '@/content/article-pt-BR.md'

const articles: Record<string, string> = {
  en: articleEN,
  ja: articleJA,
  'pt-BR': articlePTBR,
}

const SECTION_COLORS = ['text-secondary', 'text-figmaBlue', 'text-primary'] as const

const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  'ss-netflix.png': { width: 1289, height: 731 },
  'ss-maple.png': { width: 1289, height: 896 },
  'ss-twitter.png': { width: 1258, height: 711 },
  'ss-uber.png': { width: 1218, height: 646 },
}

function renderNumberedHeading(text: string, colorClass: string): ReactElement {
  const match = text.match(/^(\d(?:\/3)?)\s+(.+)$/)
  if (match) {
    return (
      <>
        <span className={colorClass}>{match[1]}</span>
        {' '}
        {match[2]}
      </>
    )
  }
  return <>{text}</>
}

function getTextContent(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map(getTextContent).join('')
  if (React.isValidElement(node)) return getTextContent((node.props as any).children)
  return ''
}

const Introduction = (): ReactElement => {
  const { t } = useTranslation('common');
  const { i18n } = useTranslation()
  const locale = i18n.language || 'en'
  const content = articles[locale] ?? articles['en']

  let h3Count = 0
  let currentSectionColor: string = SECTION_COLORS[0]

  const components: Components = {
    h1({ children }) {
      return (
        <h1 className='font-futura mb-16 text-5xl capitalize text-heroGray'>
          {children}
        </h1>
      )
    },

    h2({ children }) {
      const text = getTextContent(children)
      if (text.includes('3-3-3')) {
        return (
          <h2 className='font-futura text-5xl pt-16'>
            The
            <span className='text-secondary'> 3</span>-
            <span className='text-figmaBlue'>3</span>-
            <span className='text-primary'>3 </span>
            Principles
          </h2>
        )
      }
      return <h2 className='font-futura text-5xl pt-16'>{children}</h2>
    },

    h3({ children }) {
      currentSectionColor = SECTION_COLORS[h3Count % 3]
      h3Count++
      const text = getTextContent(children)
      return (
        <h3 className='font-futura text-2xl md:text-4xl pt-4 md:pt-10'>
          {renderNumberedHeading(text, currentSectionColor)}
        </h3>
      )
    },

    h4({ children }) {
      const text = getTextContent(children)
      return (
        <h3 className='font-futura text-2xl md:text-3xl pt-4 capitalize'>
          {renderNumberedHeading(text, currentSectionColor)}
        </h3>
      )
    },

    p({ children }) {
      const text = getTextContent(children)
      if (text === 'The design part of the whole thing.') {
        return <p className='italic text-ternary font-bold'>{text}</p>
      }
      return <p>{children}</p>
    },

    em({ children }) {
      return <em className='italic font-light'>{children}</em>
    },

    strong({ children }) {
      const text = getTextContent(children)
      if (text === 'THAT BAD') return <span className='text-secondary'>THAT BAD</span>
      if (text === 'hypnotic gift') return <b className='text-primary capitalize'>{children}</b>
      return <b className='tracking-wider'>{children}</b>
    },

    ul({ children }) {
      return <ul className='space-y-5 list-disc list-inside font-normal'>{children}</ul>
    },

    ol({ children }) {
      return <ol className='space-y-5 list-decimal list-inside font-normal'>{children}</ol>
    },

    img({ src, alt }) {
      if (!src) return null
      const filename = src.split('/').pop() || ''
      const dims = IMAGE_DIMENSIONS[filename] ?? { width: 1289, height: 731 }
      const fullSrc = prefix + src
      return (
        <div className='w-full'>
          <Image
            alt={alt || ''}
            src={fullSrc}
            width={dims.width}
            height={dims.height}
            loader={customLoader}
            unoptimized
          />
        </div>
      )
    },

    a({ href, children }) {
      const text = getTextContent(children)
      if (text === "Let's connect") {
        return (
          <a
            href={href}
            target='_blank'
            rel='noopener noreferrer'
            className='text-primary hover:underline'
          >
            {children}
          </a>
        )
      }
      return (
        <a href={href} target='_blank' rel='noopener noreferrer' className='underline'>
          {children}
        </a>
      )
    },

    blockquote({ children }) {
      return <blockquote className='italic font-light pl-4 border-l-2 border-ternary'>{children}</blockquote>
    },

    small({ children }) {
      return <small className='font-thin text-sm mx-auto'>{children}</small>
    },

    hr() {
      return null
    },
  }

  return (
    <section className='space-y-10'>
      <ReactMarkdown components={components}>{content}</ReactMarkdown>
      <p className='flex text-primary justify-center space-x-4 text-sm mt-18'>
        <a
          href='https://www.linkedin.com/in/gabriel-toshinori-nakano-5b2ba696/'
          target='_blank'
          rel='noopener noreferrer'
          className='hover:underline'
        >
          {t('lets-connect')}
        </a>
        <span>{t('share-this-page')}</span>
      </p>
    </section>
  )
}

export default Introduction
