import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { COUNTRIES, SHARED_FAQ, getCountry } from '@/constants/abroad'
import { OG_IMAGES } from '@/constants/seo'
import { CountryPage } from '@/templates/Abroad'
import i18nConfig from '../../../../../i18nConfig'

interface Props {
  params: Promise<{ locale: string; land: string }>
}

/**
 * Landssidorna byggs statiskt. De är få och ändras sällan, och den som söker
 * "flytta till Spanien" ska inte vänta på en render.
 */
export function generateStaticParams() {
  return i18nConfig.locales.flatMap((locale) => COUNTRIES.map((country) => ({ locale, land: country.slug })))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { land } = await props.params
  const country = getCountry(land)

  if (!country) return {}

  const title = `Flytta till ${country.name} från Sverige | Flyttsmart`
  // Byggd av fälten i stället för kapad ur kort svar, så den slutar mitt i en mening.
  const description = `Flytta till ${country.name} tar ${country.transitDays} med samlast. ${country.customsLabel}, ${country.customsNote.toLowerCase()}. Fast pris och samma kontaktperson hela vägen.`

  return {
    title,
    description,
    alternates: { canonical: `/flytta-utomlands/${country.slug}` },
    openGraph: { title, description, url: `/flytta-utomlands/${country.slug}`, images: OG_IMAGES },
  }
}

export default async function LandPage(props: Props) {
  const { land } = await props.params
  const country = getCountry(land)

  if (!country) {
    notFound()
  }

  const faq = [...country.faq, ...SHARED_FAQ]

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: `Flytta till ${country.name}`,
        serviceType: 'Internationell flyttjänst',
        provider: { '@type': 'Organization', name: 'Flyttsmart Sverige AB' },
        areaServed: { '@type': 'Country', name: country.name },
      },
      {
        '@type': 'FAQPage',
        mainEntity: faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Flytta utomlands', item: '/flytta-utomlands' },
          { '@type': 'ListItem', position: 2, name: country.name, item: `/flytta-utomlands/${country.slug}` },
        ],
      },
    ],
  }

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CountryPage country={country} />
    </main>
  )
}
