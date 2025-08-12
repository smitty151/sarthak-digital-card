'use client'
import { useEffect } from 'react'
import Script from 'next/script'

export default function Analytics() {
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID
  const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  const PLAUSIBLE_SRC = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || 'https://plausible.io/js/script.js'

  useEffect(() => {
    if (!GA_ID) return
    const handleRouteChange = (url) => {
      if (typeof window.gtag !== 'function') return
      window.gtag('config', GA_ID, { page_path: url })
    }
    // No router import to keep this dead-simple; Next automatically tracks initial load.
  }, [])

  return (<>
    {GA_ID && (
      <>
        <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <Script id="ga-init">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </>
    )}
    {PLAUSIBLE_DOMAIN && (
      <Script defer data-domain={PLAUSIBLE_DOMAIN} src={PLAUSIBLE_SRC} />
    )}
  </>)
}
