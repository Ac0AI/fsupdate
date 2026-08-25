'use client'

import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { ChecklistVisual, RecommendationVisual, SupportVisual } from './howItWorksVisuals'

const steps = [
  {
    number: '01',
    titleKey: 'HOW_WE_HELP.step1.title',
    descriptionKey: 'HOW_WE_HELP.step1.description',
    benefitKey: 'HOW_WE_HELP.step1.benefit',
    Visual: ChecklistVisual,
  },
  {
    number: '02',
    titleKey: 'HOW_WE_HELP.step2.title',
    descriptionKey: 'HOW_WE_HELP.step2.description',
    benefitKey: 'HOW_WE_HELP.step2.benefit',
    Visual: RecommendationVisual,
  },
  {
    number: '03',
    titleKey: 'HOW_WE_HELP.step3.title',
    descriptionKey: 'HOW_WE_HELP.step3.description',
    benefitKey: 'HOW_WE_HELP.step3.benefit',
    Visual: SupportVisual,
  },
]

const HowItWorks = () => {
  const { t } = useTranslation('landing')

  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-gradient-to-b from-[var(--color-background-default)] to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-[var(--color-primary-main)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-[var(--color-accent-main)]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        {/* Section header */}
        <div className="text-center mb-14 md:mb-18">
          <span className="inline-block text-[var(--color-primary-main)] text-sm font-semibold uppercase tracking-wider mb-4">
            Så går det till
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[var(--color-secondary-main)] mb-5">
            {t('HOW_WE_HELP.title')}
          </h2>
          <p className="text-lg text-[var(--color-secondary-main)]/60 max-w-[640px] mx-auto">
            {t('HOW_WE_HELP.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8">
          {steps.map(({ number, titleKey, descriptionKey, benefitKey, Visual }) => (
            <article key={number}>
              {/* Beskuren gränssnittsbild - telefonen blöder ut ur underkanten */}
              <div
                className={clsx(
                  'relative h-[260px] md:h-[280px] mb-6 overflow-hidden rounded-2xl',
                  'bg-[var(--color-secondary-main)]/[0.045] border border-[var(--color-secondary-main)]/10'
                )}
              >
                <span className="absolute top-4 left-5 z-10 text-sm font-bold text-[var(--color-secondary-main)]/25">
                  {number}
                </span>
                <Visual />
              </div>

              <h3 className="text-lg md:text-xl font-bold text-[var(--color-secondary-main)] mb-3">
                {t(titleKey)}
              </h3>

              <p className="text-[var(--color-secondary-main)]/60 text-sm leading-relaxed mb-4">
                {t(descriptionKey)}
              </p>

              <div className="flex items-center gap-2 text-[var(--color-primary-main)]">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium text-sm">{t(benefitKey)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
