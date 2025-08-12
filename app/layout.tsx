import './globals.css'
import Analytics from './components/Analytics'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sarthak Mittal — Digital Contacts & Resume',
  description: 'Strategy, Investments & Transformation | PE / IB / Consulting',
  openGraph: {
    title: 'Sarthak Mittal — Digital Contacts & Resume',
    description: 'Strategy, Investments & Transformation | PE / IB / Consulting',
    url: 'https://example.com',
    siteName: 'Sarthak Mittal',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
    locale: 'en_US',
    type: 'website',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  metadataBase: new URL('https://example.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
