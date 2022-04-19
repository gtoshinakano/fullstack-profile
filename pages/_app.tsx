import '@Styles/globals.css'
import '@Styles/font-wask.css'
import '@Styles/font-trueno.css'
import 'react-loading-skeleton/dist/skeleton.css'
import Analytics from '@Components/dom/Analytics'
import Head from 'next/head'
import React from 'react'

interface IProps{
  Component: React.FC
  pageProps: any
}

function MyApp({ Component, pageProps } : IProps) {
  return (<>
    <Head>
      <script src="https://cdn.jsdelivr.net/npm/pace-js@latest/pace.min.js"></script>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pace-js@latest/pace-theme-default.min.css" />
    </Head> 
    <Analytics />
    <Component {...pageProps} />
  </>)
}

export default MyApp
