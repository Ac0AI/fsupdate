'use client'

import Image from 'next/image'
import { useTranslation } from 'react-i18next'

/**
 * Tre steg med brandets platta illustration i stället för beskurna
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
    image: '/images/brand/sa-gar-det-till/3-manniska.jpg',
    alt: 'En flyttkoordinator vid ett skrivbord med headset, med pratbubblor för telefon, mejl och chatt',
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {steps.map(({ number, titleKey, descriptionKey, image, alt }) => (
            <article key={number}>
              <div className="relative aspect-[16/9] mb-6 overflow-hidden rounded-2xl bg-[#EAF2F8]">
                <Image src={image} alt={alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary-main)] mb-3 flex items-baseline gap-2.5">
                <span className="text-[var(--color-primary-main)] tabular-nums">{Number(number)}.</span>
                {t(titleKey)}
              </h3>

              <p className="text-[var(--color-secondary-main)]/60 text-sm leading-relaxed mb-4">
                {t(descriptionKey)}
              </p>

            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
