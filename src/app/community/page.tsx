import { Metadata } from 'next'
import CommunityPageClient from '@/components/CommunityPageClient'

export const metadata: Metadata = {
  title: 'Join the Sauna & Cold Community | UK Sauna & Ice Bath Events',
  description: 'Join the UK\'s premier Sauna & Cold community. Experience the transformative power of sauna and cold therapy while building meaningful connections. Regular events across 5+ cities.',
  keywords: 'sauna community, ice bath events, cold plunge community, sauna therapy, wellness events, sauna meetups, ice bath groups, UK wellness community',
  openGraph: {
    title: 'The Sauna & Cold Community - Saunas, Ice Baths & Connection',
    description: 'Building meaningful connections through shared wellness experiences. Join our Sauna & Cold community events.',
    type: 'website',
    url: 'https://sauna-directory.co.uk/community',
  },
  alternates: {
    canonical: 'https://sauna-directory.co.uk/community'
  }
}

export default function CommunityPage() {
  return <CommunityPageClient />
}