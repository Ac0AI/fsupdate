'use client'

import { useRef } from 'react'
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

// Riktiga Google-recensioner (ägaren 2026-09-24). Emojis borttagna och uppenbara
// stavfel rättade (Monica: "ned" -> "med"), annars ordagrant.
// Bara förnamn på sajten, recensenten har skrivit under med hela namnet på Google.
const GOOGLE_PICKS: Card[] = [
  { name: 'Kathrine', subtitle: 'Google-recension', rating: 5, text: 'Kan rekommendera flyttsmart till alla som ska flytta. Superproffs som jobbar där! Allt fungerade hur smidigt som helst, precis som man vill ha det. Flyttkillarna var dessutom väldigt trevliga.' },
  { name: 'Ewa', subtitle: 'Google-recension', rating: 5, text: 'Flytt Smart hjälpte mig på ett mycket professionellt och smidigt sätt med min långväga flytt. Trevlig personal, god kommunikation och allt fungerade perfekt från start till mål. Rekommenderas varmt!' },
  { name: 'Ulrika', subtitle: 'Google-recension', rating: 5, text: 'Bra kommunikation, perfekt utfört jobb.' },
  { name: 'Birgitta', subtitle: 'Google-recension', rating: 5, text: 'Flytten gick som på räls. De som flyttade till mig var omsorgsfulla, smidiga och punktliga. Har inget att klaga på.' },
  { name: 'Monica', subtitle: 'Google-recension', rating: 5, text: 'För mig fungerade det väldigt bra med Flyttsmart. Var skönt att slippa fixa med en del av alla administrativa saker man måste tänka på. Det har varit lätt att kommunicera med Flyttsmart, dom har snabbt återkommit om man sökt dom. Jag kan varmt rekommendera dom.' },
  { name: 'Emma', subtitle: 'Google-recension', rating: 5, text: 'Vi är supernöjda med Flyttsmart. Beställde både flytt och städ och är jättenöjd. Höll tiden, trevliga, duktiga, bra pris. Lätta att ha att göra med, inget krångel! Fem stjärnor!' },
  { name: 'Per', subtitle: 'Google-recension', rating: 5, text: 'Verkligen bra hjälp vid flytten.' },
  { name: 'Cecilia', subtitle: 'Google-recension', rating: 5, text: 'Mäklaren tipsade om Flyttsmart. Jeg fick god och nyttig information från första kontakten. Väldig förnöjd med tjänsten och servicen!' },
  { name: 'Wael', subtitle: 'Google-recension', rating: 5, text: 'Snabb och hjälpsam service. De fixade mitt elavtal inför flytten utan några problem. Rekommenderas!' },
]

const Arrow = ({ dir }: { dir: 'left' | 'right' }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className={dir === 'left' ? 'rotate-180' : ''}>
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
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

  const visibleCards = [...cards.slice(0, 3), ...GOOGLE_PICKS]
  const trackRef = useRef<HTMLDivElement>(null)
  const scrollPage = (dir: 1 | -1) => {
    const el = trackRef.current
    if (!el) return
    // En hel sida (tre kort) per klick.
    el.scrollBy({ left: dir * (el.clientWidth + 20), behavior: 'smooth' })
  }

  return (
    <div>
      <div className="flex items-end justify-between gap-4 px-4 md:px-0 mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-white">{t('landing:testamonial_title')}</h2>
        {/* Pilar från md, på mobil sveper man. */}
        <div className="hidden md:flex gap-2">
          <button type="button" aria-label="Föregående omdöme" onClick={() => scrollPage(-1)} className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
            <Arrow dir="left" />
          </button>
          <button type="button" aria-label="Nästa omdöme" onClick={() => scrollPage(1)} className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center hover:bg-white/10 transition-colors">
            <Arrow dir="right" />
          </button>
        </div>
      </div>

      {/* Alla omdömen i en rad som scrollar i sidled (ägaren 2026-09-24).
          Mobil: nästa kort sticker ut i kanten. Från md: tre kort i bild. */}
      <div ref={trackRef} className="flex gap-3 md:gap-5 overflow-x-auto snap-x snap-mandatory px-4 scroll-px-4 md:px-0 md:scroll-px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {visibleCards.map((card, i) => (
          <div
            key={`${card.name}-${i}`}
            className="snap-start shrink-0 w-[80%] max-w-[320px] md:w-[calc((100%-42px)/3)] md:max-w-none bg-white/5 rounded-2xl p-6 border border-white/10 flex flex-col"
          >

            {/* Quote */}
            <p className="text-white text-[15px] leading-relaxed flex-1">
              &ldquo;{card.text}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-white/10">
              <span className="text-sm font-semibold text-white">{card.name}</span>
              {card.subtitle && <span className="text-xs text-white/60 text-right">{card.subtitle}</span>}
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
          <span className="text-white/75 text-sm">
            {String(googleRating?.rating ?? '4.7').replace('.', ',')} av 5 på Google
          </span>
          <div className="flex gap-0.5" aria-hidden>
            {Array.from({ length: 5 }).map((_, i) => {
              const fill = Math.max(0, Math.min(1, Number(googleRating?.rating ?? 4.7) - i))
              return (
                <span key={i} className="relative w-3.5 h-3.5">
                  <StarIcon className="absolute inset-0 w-3.5 h-3.5 fill-white/20" />
                  <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                    <StarIcon className="w-3.5 h-3.5 fill-amber-400" />
                  </span>
                </span>
              )
            })}
          </div>
        </div>
        <p className="text-[13px] text-white/60">över {GOOGLE_REVIEW_COUNT} recensioner</p>
      </div>
    </div>
  )
}

export default Testimonials
