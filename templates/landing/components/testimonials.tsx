'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import Star from '@/public/images/Star.svg'
import useResponsive from '@/common/hooks/useResponsive'
import type { GoogleReview, GoogleReviewCountAndRating } from 'app/_actions/googleReviews.types'

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

const Testimonials = ({ googleReviews, googleRating }: TestimonialsProps) => {
  const { t } = useTranslation(['common', 'landing'])
  const { isTabletPortraitOrGreater, isDesktopOrGreater } = useResponsive()

  const filteredGoogleReviews = googleReviews?.filter(
    (r) => r.rating >= 3 && r.text
  ) ?? []

  const hasGoogleReviews = filteredGoogleReviews.length >= 6
  const carouselItems = t('landing:TESTAMONIALS', { returnObjects: true }) as { rating: string; name: string; bio: string; words: string }[]

  const cards: Card[] = hasGoogleReviews
    ? filteredGoogleReviews.map((r) => ({ text: r.text ?? '', name: r.author_name, subtitle: r.relative_time_description, rating: r.rating }))
    : carouselItems.map((r) => ({ text: r.words, name: r.name, subtitle: r.bio, rating: parseInt(r.rating || '5') }))

  const perPage = !isTabletPortraitOrGreater ? 1 : !isDesktopOrGreater ? 2 : 3
  const maxPage = Math.max(0, Math.ceil(cards.length / perPage) - 1)
  const [page, setPage] = useState(0)
  const [fading, setFading] = useState(false)

  const goToPage = useCallback((next: number) => {
    setFading(true)
    setTimeout(() => {
      setPage(next)
      setFading(false)
    }, 300)
  }, [])

  // Auto-rotate every 6s
  useEffect(() => {
    if (maxPage === 0) return
    const timer = setInterval(() => {
      goToPage(page >= maxPage ? 0 : page + 1)
    }, 6000)
    return () => clearInterval(timer)
  }, [page, maxPage, goToPage])

  const visibleCards = cards.slice(page * perPage, page * perPage + perPage)

  return (
    <div>
      {/* Rubriken får hela bredden; navigeringen står under på mobil och till höger på
          desktop. Prickar bara när de är få nog att träffa, annars pilar med räknare. */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--color-secondary-main)]">
          {t('landing:testamonial_title')}
        </h2>
        {maxPage > 0 && maxPage + 1 <= 6 && (
          <div className="flex gap-1.5">
            {Array.from({ length: maxPage + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i)}
                className={clsx(
                  'h-1.5 rounded-full transition-[width,background-color] duration-300 ease-standard',
                  i === page ? 'w-6 bg-[var(--color-primary-main)]' : 'w-1.5 bg-gray-200 hover:bg-gray-300'
                )}
                aria-label={`Sida ${i + 1}`}
              />
            ))}
          </div>
        )}
        {maxPage + 1 > 6 && (
          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => goToPage(page === 0 ? maxPage : page - 1)}
              className="w-11 h-11 rounded-full border border-[var(--color-secondary-main)]/20 text-[var(--color-secondary-main)] flex items-center justify-center hover:border-[var(--color-secondary-main)] transition-colors"
              aria-label="Föregående omdömen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <span className="text-sm text-[var(--color-secondary-main)]/60 tabular-nums min-w-[64px] text-center">
              {page + 1} av {maxPage + 1}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page >= maxPage ? 0 : page + 1)}
              className="w-11 h-11 rounded-full border border-[var(--color-secondary-main)]/20 text-[var(--color-secondary-main)] flex items-center justify-center hover:border-[var(--color-secondary-main)] transition-colors"
              aria-label="Nästa omdömen"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div
        className={clsx(
          'grid gap-5 transition-opacity duration-300',
          fading ? 'opacity-0' : 'opacity-100',
          perPage === 1 && 'grid-cols-1',
          perPage === 2 && 'grid-cols-2',
          perPage === 3 && 'grid-cols-3'
        )}
      >
        {visibleCards.map((card, i) => (
          <div
            key={`${page}-${i}`}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[220px]"
          >
            {/* Stars */}
            <div className="flex gap-0.5 mb-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star
                  key={j}
                  className={clsx(
                    'w-4 h-4',
                    j < card.rating ? 'fill-amber-400' : 'fill-gray-200'
                  )}
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-[var(--color-secondary-main)]/70 text-sm leading-relaxed italic flex-1 line-clamp-5">
              &ldquo;{card.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-50">
              <span className="text-sm font-semibold text-[var(--color-secondary-main)]">{card.name}</span>
              <GoogleIcon />
            </div>
          </div>
        ))}
      </div>

      {/* Google rating badge */}
      <div className="flex items-center justify-center gap-2.5 mt-8">
        <GoogleIcon />
        <span className="text-[var(--color-secondary-main)]/50 text-sm">
          {String(googleRating?.rating ?? '4.7').replace('.', ',')} på Google
        </span>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={clsx(
                'w-3.5 h-3.5',
                i < Math.floor(Number(googleRating?.rating ?? 4.7)) ? 'fill-amber-400' : 'fill-gray-200'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Testimonials
