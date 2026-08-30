'use client'

import React, { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'
import { GOOGLE_RATING, GOOGLE_REVIEW_COUNT, MOVES_SINCE_2020 } from '@/constants/trustStats'

// Sex mäklarlogotyper som är rena SVG:er utan egen bakgrund, så de tål att
// inverteras till vitt på navy. De 41 i partnerLogos har för många med opak
// platta för att kunna stå på mörk botten.
const HERO_LOGOS = [
  // width/height ur SVG:ernas viewBox, så raden inte hoppar under laddning.
  // Höjden sätts per logotyp: ordmärken lägre, staplade märken högre, så de väger lika. I egen färg på vit botten.
  { src: '/images/partners/all/fastighetsbyran-logo-pobmqvfiy.svg', alt: 'Fastighetsbyrån', width: 268, height: 55, h: 'h-5' },
  { src: '/images/partners/all/maklarhuset-logotyp-1wwxhjgay.svg', alt: 'Mäklarhuset', width: 1456, height: 188, h: 'h-[18px]' },
  { src: '/images/partners/all/notar-new-4g0mb9fuo.svg', alt: 'Notar', width: 142, height: 42, h: 'h-[22px]' },
  { src: '/images/partners/all/historiska-hem-logo-ri0m3fw-x.svg', alt: 'Historiska Hem', width: 174, height: 50, h: 'h-[30px]' },
  { src: '/images/partners/all/lejons-makleri-logo-njpe-l-5m.svg', alt: 'Lejons Mäkleri', width: 1788, height: 980, h: 'h-10' },
  { src: '/images/partners/all/edward-logo-mi5yjp1j1.svg', alt: 'Edward & Partners', width: 145, height: 66, h: 'h-9' },
]

const SCENE = {
  src: '/images/brand/hero-vagen-hem-1440.webp',
  srcSet: '/images/brand/hero-vagen-hem-1440.webp 1440w, /images/brand/hero-vagen-hem-2160.webp 2160w, /images/brand/hero-vagen-hem-3168.webp 3168w',
  width: 3168,
  height: 1344,
  // Bildens övre kant, så himlen fortsätter sömlöst från textytan ner i scenen.
  sky: '#E5F1FA',
}

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Star = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2.5l2.9 6.2 6.8.8-5 4.7 1.3 6.7L12 17.6l-6 3.3 1.3-6.7-5-4.7 6.8-.8z" fill="var(--color-accent-main)" />
  </svg>
)

const LandingHero = () => {
  const router = useRouter()
  const [showFloatingCta, setShowFloatingCta] = useState(false)
  const loginUrl = '/i/testmode'
  const rating = `${GOOGLE_RATING.toString().replace('.', ',')} av över ${GOOGLE_REVIEW_COUNT} recensioner på Google`

  // En orange knapp per vy. Texten navy på orange, som i brandguiden.
  const ctaClassName = clsx('!text-[var(--color-secondary-main)]', 'shadow-[0_10px_24px_rgba(33,71,102,0.18)]')

  useEffect(() => {
    const handleScroll = () => {
      // Flytande knapp på mobil när heron scrollat förbi
      setShowFloatingCta(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative flex flex-col" style={{ background: `linear-gradient(180deg, #FFFFFF 0%, ${SCENE.sky} 100%)` }}>
      {/* Budskapet: beviset före löftet, ett löfte, en knapp. */}
      <div className="stagger-rise w-full max-w-[1200px] mx-auto px-5 md:px-8 pt-7 md:pt-14 pb-8 md:pb-10 flex flex-col items-center text-center gap-4 md:gap-5">
        <p className="inline-flex items-center gap-2 h-9 md:h-10 pl-3 pr-4 rounded-full bg-white border border-[#EEEEF0] shadow-[0_4px_14px_rgba(33,71,102,0.10)] text-[13px] md:text-[14px] font-semibold text-[var(--color-secondary-main)]">
          <Star />
          {rating}
        </p>

        <h1 className="text-[var(--color-secondary-main)] font-bold tracking-[-0.02em] text-[40px] leading-[44px] md:text-[60px] md:leading-[64px] lg:text-[72px] lg:leading-[76px] max-w-[1000px]">
          Det enklaste sättet att flytta.
        </h1>

        <p className="text-[var(--color-secondary-main)] text-[17px] leading-[25px] md:text-[20px] md:leading-[30px] max-w-[640px]">
          Färdigförhandlat, kvalitetssäkrat, och vi tar ansvar hela vägen.
        </p>

        <div className="flex flex-col items-center gap-3 pt-1 w-full sm:w-auto">
          <Button
            className={ctaClassName}
            padding="16px 32px"
            variant="primaryAltInverted"
            iconRight={<Arrow />}
            text="Starta din flytt"
            onClick={() => router.push(loginUrl)}
            withFullWidth
          />
          <span className="text-[13px] leading-4 text-[#767678]">Kostnadsfritt · 2 min · logga in med BankID</span>
        </div>
      </div>

      {/* Scenen: vägen hem. Bilen står redan vid huset och lastar ur, paret går
          upp tomhänta. På mobil beskärs den till en stående ruta med huset och
          paret kvar i bild. */}
      <div className="relative w-full" style={{ backgroundColor: SCENE.sky }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SCENE.src}
          srcSet={SCENE.srcSet}
          sizes="100vw"
          width={SCENE.width}
          height={SCENE.height}
          alt=""
          fetchPriority="high"
          decoding="async"
          className="hero-scene-in block w-full h-[400px] object-cover object-bottom md:h-auto md:object-fill"
        />
      </div>

      {/* Remsan: vilka som rekommenderar oss. Ljus botten så logotyperna kan gå i
          sin egen färg, som ägaren vill. */}
      <div className="w-full bg-white border-b border-[#EEEEF0]">
        <div className="max-w-[1248px] mx-auto px-5 md:px-8 py-4 md:py-0 md:h-16 flex flex-col md:flex-row items-center md:justify-between gap-3 md:gap-6">
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5">
            <span className="text-[#767678] text-[11px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap">Rekommenderas av</span>
            <div className="flex items-center justify-center flex-wrap gap-x-6 gap-y-3 md:flex-nowrap">
              {HERO_LOGOS.map((logo) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={logo.src}
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                  className={clsx(logo.h, 'w-auto object-contain')}
                />
              ))}
            </div>
          </div>
          <span className="text-[var(--color-secondary-main)] text-[13px] whitespace-nowrap">{MOVES_SINCE_2020} flyttar sedan 2020</span>
        </div>
      </div>

      {/* Flytande knapp på mobil, dyker upp när heron scrollat förbi. */}
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 z-50 p-4 pt-12 lg:hidden',
          'bg-gradient-to-t from-white via-white/95 to-transparent',
          'transition-[transform,opacity] duration-300 ease-entry',
          showFloatingCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <Button
          className={ctaClassName}
          padding="16px 32px"
          variant="primaryAltInverted"
          iconRight={<Arrow />}
          text="Starta din flytt"
          onClick={() => router.push(loginUrl)}
          withFullWidth
        />
      </div>
    </section>
  )
}

export default LandingHero
