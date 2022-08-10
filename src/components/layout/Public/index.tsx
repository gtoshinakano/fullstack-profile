import React, { ReactElement, ReactNode } from 'react'
import Head from 'next/head'
import ChangeLanguage from '@/components/dom/ChangeLanguage'

interface IProps {
  children: ReactNode
  title: string
}

const Index = ({ children, title }: IProps): ReactElement => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link
          rel='stylesheet'
          href='https://unicons.iconscout.com/release/v4.0.0/css/line.css'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#da532c' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <ChangeLanguage />
      {children}
    </>
  )
}

export default Index
