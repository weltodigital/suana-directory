import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL('https://saunaandcold.co.uk'),
  title: {
    default: 'Sauna & Cold | Find Saunas, Cold Plunge & Ice Baths Near You',
    template: '%s | Sauna & Cold'
  },
  description: 'Discover the UK\'s premier directory of saunas, cold plunge pools, ice baths, and wellness facilities. Find heat and cold therapy locations across England, Scotland, and Wales.',
  keywords: [
    'sauna UK',
    'cold plunge UK',
    'ice bath UK',
    'wellness centres UK',
    'thermal therapy UK',
    'spa UK',
    'sauna near me',
    'cold therapy UK',
    'heat therapy UK',
    'wellness directory UK'
  ],
  authors: [{ name: 'Sauna & Cold' }],
  creator: 'Sauna & Cold',
  publisher: 'Sauna & Cold',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://saunaandcold.co.uk',
    title: 'Sauna & Cold Directory UK | Find Saunas, Cold Plunge & Ice Baths Near You',
    description: 'Discover the UK\'s premier directory of saunas, cold plunge pools, ice baths, and wellness facilities. Find heat and cold therapy locations across England, Scotland, and Wales.',
    siteName: 'Sauna & Cold Directory UK',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sauna & Cold Directory UK | Find Saunas, Cold Plunge & Ice Baths Near You',
    description: 'Discover the UK\'s premier directory of saunas, cold plunge pools, ice baths, and wellness facilities.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://saunaandcold.co.uk',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-GB">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}