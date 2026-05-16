import '@Styles/globals.css'
import '@Styles/font-wask.css'
import '@Styles/font-trueno.css'
import 'react-loading-skeleton/dist/skeleton.css'
import Analytics from '@Components/dom/Analytics'
import Head from 'next/head'
import React from 'react'
import { AppProps } from 'next/app'
import { appWithTranslation } from "next-i18next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <script src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pace.min.js`}></script>
        <link
          rel='stylesheet'
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/pace-theme-default.min.css`}
        />
      </Head>
      <Analytics />
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(MyApp)
