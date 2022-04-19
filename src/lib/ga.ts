declare global {
  interface Window {
    gtag: any
  }
}

interface IEvent {
  action: string
  params: {
    event_category?: string
    event_label?: string
  }
}

// log the pageview with their URL
export const pageview = (url: string): void => {
  if (window && window.gtag)
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
      page_path: url,
    })
}

// log specific events happening.
export const event = ({ action, params }: IEvent): void => {
  if (window && window.gtag) window.gtag('event', action, params)
}

export const hasGa = (): void => window && window.gtag
