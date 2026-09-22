'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'

/**
 * Fyra steg med brandets platta illustration i stället för beskurna
 * telefonramar och glow. Bilderna är gjorda med receptet i
 * scripts/blog-image-prompts.json och ligger i public/images/brand/sa-gar-det-till.
 */
const steps = [
  {
    number: '01',
    titleKey: 'HOW_WE_HELP.step1.title',
    descriptionKey: 'HOW_WE_HELP.step1.description',
    image: '/images/brand/sa-gar-det-till/1-checklista.jpg',
    alt: 'Checklistan i mobilen står klar efter inloggningen, med hus och kalender bredvid',
  },
  {
    number: '02',
    titleKey: 'HOW_WE_HELP.step2.title',
    descriptionKey: 'HOW_WE_HELP.step2.description',
    image: '/images/brand/sa-gar-det-till/2-rekommendation.jpg',
    alt: 'Ett rekommenderat avtal med bock och prislapp, två andra alternativ tonade i bakgrunden',
  },
  {
    number: '03',
    titleKey: 'HOW_WE_HELP.step3.title',
    descriptionKey: 'HOW_WE_HELP.step3.description',
    image: '/images/brand/sa-gar-det-till/3-boka.jpg',
    alt: 'En checklista i mobilen där två rader är godkända med gröna bockar, med en kalender bredvid',
  },
  {
    number: '04',
    titleKey: 'HOW_WE_HELP.step4.title',
    descriptionKey: 'HOW_WE_HELP.step4.description',
    image: '/images/brand/sa-gar-det-till/4-luta-dig-tillbaka.jpg',
    alt: 'En fåtölj med kudde och en kopp kaffe, medan en flyttbil i bakgrunden kör mot ett hus med en grön bock ovanför',
  },
]

const HowItWorks = () => {
  const { t } = useTranslation('landing')

  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[var(--color-background-default)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        {/* Section header */}
        <div className="mb-10 md:mb-14 max-w-[720px]">
          <span className="inline-block text-[var(--color-primary-main)] text-sm font-semibold uppercase tracking-wider mb-4">
            Så går det till
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary-main)] mb-5">
            {t('HOW_WE_HELP.title')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-7 sm:gap-6">
          {steps.map(({ number, titleKey, descriptionKey, image, alt }) => (
            <article key={number} className="flex gap-4 sm:block">
              {/* Mobil: liten kvadrat bredvid texten så sektionen inte bygger på höjden.
                  Från 768: fullbredd 16:9 ovanför texten. */}
              <div className="relative shrink-0 w-[96px] h-[96px] sm:w-auto sm:h-auto sm:aspect-[16/9] sm:mb-6 overflow-hidden rounded-xl sm:rounded-2xl bg-[#EAF2F8]">
                <Image
                  src={image}
                  alt={alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 96px"
                  className="object-contain sm:object-cover scale-[1.4] sm:scale-100"
                />
              </div>

              <div className="min-w-0">
                <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary-main)] mb-2 sm:mb-3 flex items-baseline gap-2.5">
                  <span className="text-[var(--color-primary-main)] tabular-nums">{Number(number)}.</span>
                  {t(titleKey)}
                </h3>

                <p className="text-[var(--color-secondary-main)]/85 text-[15px] md:text-base leading-relaxed">
                  {t(descriptionKey)}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
