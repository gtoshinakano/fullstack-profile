import React, { ReactElement } from 'react'
import GA from './GoogleAnalytics'
// import Plausible from './Plausible';
// import SimpleAnalytics from './SimpleAnalytics';
// import siteMetadata from '@/data/siteMetadata';

const isProduction = process.env.NODE_ENV === 'production'

const Analytics = (): ReactElement => {
  return (
    <>
      {/* {isProduction && siteMetadata.analytics.plausibleDataDomain && (
        <Plausible />
      )}
      {isProduction && siteMetadata.analytics.simpleAnalytics && (
        <SimpleAnalytics />
      )} */}
      {isProduction && <GA />}
    </>
  )
}

export default Analytics
