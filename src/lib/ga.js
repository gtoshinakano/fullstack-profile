
// log the pageview with their URL
export const pageview = (url) => {
  if(window && window.gtag) window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    page_path: url,
  })
}

// log specific events happening.
export const event = ({ action, params }) => {
  if(window && window.gtag) window.gtag('event', action, params)
}

export const hasGa = () => (window && window.gtag)