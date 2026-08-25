import type { Metadata } from 'next'
import { ABROAD_FAQ, COUNTRIES } from '@/constants/abroad'
import { OG_IMAGES } from '@/constants/seo'
import { AbroadHub } from '@/templates/Abroad'

export const metadata: Metadata = {
  title: 'Flytta utomlands | Flyttsmart',
  description: 'Vi tar hand om hela utlandsflytten: packning, transport, tull och bärning in i det nya hemmet. Fast pris och samma kontaktperson hela vägen.',
  alternates: { canonical: '/flytta-utomlands' },
  openGraph: {
    title: 'Flytta utomlands | Flyttsmart',
    description: 'Packning, transport, tull och bärning in i det nya hemmet. Ett pris, en kontaktperson, ett företag som ansvarar.',
    url: '/flytta-utomlands',
    images: OG_IMAGES,
  },
}

/**
 * Schema läggs bara på för innehåll som faktiskt syns på sidan: tjänsten,
 * frågelistan och länkarna vidare till landssidorna.
 */
const schema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Utlandsflytt',
      serviceType: 'Internationell flyttjänst',
      provider: { '@type': 'Organization', name: 'Flyttsmart Sverige AB' },
      areaServed: COUNTRIES.map((country) => ({ '@type': 'Country', name: country.name })),
    },
    {
      '@type': 'FAQPage',
      mainEntity: ABROAD_FAQ.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ],
}

export default function FlyttaUtomlandsPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AbroadHub />
    </main>
  )
}
