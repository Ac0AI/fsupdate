'use client'

import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import type { GoogleReview, GoogleReviewCountAndRating } from 'app/_actions/googleReviews.types'
import { GOOGLE_REVIEW_COUNT } from '@/constants/trustStats'

interface TestimonialsProps {
  googleReviews?: GoogleReview[] | null
  googleRating?: GoogleReviewCountAndRating | null
}

interface Card {
  text: string
  name: string
  subtitle?: string
  rating: number
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
)

// Egen stjärna: den delade Star.svg har fyllning inbakad, så delstjärnan blev alltid hel.
const StarIcon = ({ className }: { className: string }) => (
  <svg viewBox="0 0 15 14" className={className} aria-hidden>
    <path d="M6.78251 1.04493L5.15001 4.35493L1.49751 4.88743C0.842512 4.98243 0.580012 5.78993 1.05501 6.25243L3.69751 8.82743L3.07251 12.4649C2.96001 13.1224 3.65251 13.6149 4.23251 13.3074L7.50001 11.5899L10.7675 13.3074C11.3475 13.6124 12.04 13.1224 11.9275 12.4649L11.3025 8.82743L13.945 6.25243C14.42 5.78993 14.1575 4.98243 13.5025 4.88743L9.85001 4.35493L8.21751 1.04493C7.92501 0.454926 7.07751 0.447426 6.78251 1.04493Z" />
  </svg>
)

const Testimonials = ({ googleReviews, googleRating }: TestimonialsProps) => {
  const { t } = useTranslation(['common', 'landing'])

  // Tre svenska citat som bekräftar löftet, inga engelska och inga som berömmer "alternativ".
  const looksSwedish = (text: string) => /[åäö]/i.test(text) || /\b(och|att|det|inte)\b/i.test(text)
  const filteredGoogleReviews =
    googleReviews?.filter((r) => r.rating >= 4 && !!r.text && looksSwedish(r.text) && !/alternativ/i.test(r.text)) ?? []

  const hasGoogleReviews = false && filteredGoogleReviews.length >= 3
  // Tre kurerade citat om Flyttsmart och koordinatorn (Anna, Andreas, Eline i listan), hela meningar, aldrig klippta.
  const picks = [10, 15, 27]
  const carouselItems = t('landing:TESTAMONIALS', { returnObjects: true }) as { rating: string; name: string; bio: string; words: string }[]

  const cards: Card[] = hasGoogleReviews
    ? filteredGoogleReviews.map((r) => ({ text: r.text ?? '', name: r.author_name, subtitle: r.relative_time_description, rating: r.rating }))
    : picks.map((i) => carouselItems[i]).filter(Boolean).map((r) => ({ text: r.words, name: r.name, subtitle: r.bio, rating: parseInt(r.rating || '5') }))

  const visibleCards = cards.slice(0, 3)

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-[var(--color-secondary-main)] mb-8">{t('landing:testamonial_title')}</h2>

      {/* Cards */}
      <div
        className="grid gap-5 grid-cols-1 md:grid-cols-3"
      >
        {visibleCards.map((card, i) => (
          <div
            key={`${card.name}-${i}`}
            className="bg-white rounded-2xl p-6 border border-gray-100 flex flex-col"
          >

            {/* Quote */}
            <p className="text-[var(--color-secondary-main)] text-[15px] leading-relaxed flex-1">
              &ldquo;{card.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
              <span className="text-sm font-semibold text-[var(--color-secondary-main)]">{card.name}</span>
              {card.subtitle && <span className="text-xs text-[var(--color-secondary-main)]/60">{card.subtitle}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Google rating badge. Antalet recensioner står under betyget (ägaren
          2026-09-04): ett snitt utan volym går inte att lita på. Talet är
          avrundat nedåt och bor i GOOGLE_REVIEW_COUNT, inte här. */}
      <div className="flex flex-col items-center gap-1.5 mt-8">
        <div className="flex items-center justify-center gap-2.5">
          <GoogleIcon />
          <span className="text-[var(--color-secondary-main)]/70 text-sm">
            {String(googleRating?.rating ?? '4.7').replace('.', ',')} av 5 på Google
          </span>
          <div className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => {
              const fill = Math.max(0, Math.min(1, Number(googleRating?.rating ?? 4.7) - i))
              return (
                <span key={i} className="relative w-3.5 h-3.5">
                  <StarIcon className="absolute inset-0 w-3.5 h-3.5 fill-gray-200" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                    <StarIcon className="w-3.5 h-3.5 fill-amber-400" />
                  </span>
                </span>
              )
            })}
          </div>
        </div>
        <p className="text-[13px] text-[var(--color-secondary-main)]/60">över {GOOGLE_REVIEW_COUNT} recensioner</p>
      </div>
    </div>
  )
}

export default Testimonials
