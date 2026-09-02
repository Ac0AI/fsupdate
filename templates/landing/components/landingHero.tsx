'use client'

import React from 'react'
import { clsx } from 'clsx'
import { useRouter, usePathname } from 'next/navigation'
import Button from '@/components/atoms/Button'
import BankId from '@/public/images/BankId.svg'
import AnimatedDashboard from './AnimatedDashboard'
import { partnerLogos } from './partnerLogos'

const LandingHero = () => {
  const router = useRouter()
  const pathname = usePathname()
  const loginUrl = '/i/testmode'
  const heroCtaClassName = clsx(
    '!text-[var(--color-inactive-super-dark)]',
    'shadow-[0_10px_24px_rgba(0,0,0,0.18)]'
  )

  return (
    <section className="relative min-h-[100vh] md:min-h-0 flex flex-col bg-gradient-to-br from-[#1a3a52] via-[var(--color-secondary-main)] to-[#2d5a7b]">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary-main)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-accent-main)]/10 rounded-full blur-3xl" />
      </div>
      <div className="flex-1 flex items-center w-full relative z-10 py-6 md:py-16">
        <div className="max-w-[1200px] mx-auto px-6 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-1">
            {/* Eyebrow */}
            <p className="text-[var(--color-primary-main)] text-xs md:text-sm font-semibold uppercase tracking-[0.18em] mb-4 md:mb-5">
              Ett beslut. Hela flytten.
            </p>

            {/* Headline */}
            <h1 className="text-white mb-4 md:mb-6">
              <span className="block text-[42px] md:text-[56px] lg:text-[64px] font-bold leading-[1.1]">
                Slipp stressen –
              </span>
              <span className="block text-[42px] md:text-[56px] lg:text-[64px] font-bold leading-[1.1]">
                <span className="text-[var(--color-accent-main)]">vi fixar</span> flytten
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-white/80 mb-7 md:mb-10 max-w-[480px] mx-auto lg:mx-0 leading-relaxed">
              El, bredband, hemförsäkring, flytthjälp och flyttstädning. Vi har redan valt leverantörerna och förhandlat priserna.
            </p>

            {/* CTA */}
            <div data-hero-cta className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Button
                className={heroCtaClassName}
                padding="16px 32px"
                variant="primaryAltInverted"
                iconRight={<BankId className="w-6 h-6" />}
                text="STARTA DIN FLYTT"
                onClick={() => router.push(loginUrl)}
              />
              <button
                onClick={() => {
                  document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-white/80 hover:text-white text-sm font-medium underline underline-offset-4 transition-colors"
              >
                Se hur det fungerar →
              </button>
            </div>
            <span className="text-sm text-white/60 mt-4 block text-center lg:text-left">
              Logga in med BankID. Kostnadsfritt, med eller utan inbjudan från din mäklare.
            </span>

            {/* Press - Som sett i */}
            <div className="flex items-center gap-4 mt-6 md:mt-8 justify-center lg:justify-start">
              <span className="text-white/35 text-[10px] font-medium uppercase tracking-widest shrink-0">Som sett i</span>
              <div className="flex items-center gap-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/press/di-logo.svg" alt="Dagens industri" className="h-4 md:h-5 brightness-0 invert opacity-40" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/press/breakit-logo.svg" alt="Breakit" className="h-3.5 md:h-4 brightness-0 invert opacity-40" />
              </div>
            </div>
          </div>

          {/* Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end order-2 -mt-2 lg:mt-0">
            {/* Bright glow effect behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-[var(--color-primary-main)]/30 rounded-full blur-[60px]" />

            {/* Telefonen: titankant runt en tunn svart ram, dynamic island med kameraöga,
                sidoknappar i samma metall. Skärmen är 256/288/320 bred så dashboarden
                (ritad i 320) skalas exakt. */}
            <div className="relative z-10">
              <div
                className={clsx(
                  'relative p-[3px]',
                  'rounded-[46px] md:rounded-[52px] lg:rounded-[58px]',
                  'w-[276px] md:w-[308px] lg:w-[342px]',
                  'bg-[linear-gradient(150deg,#f4f4f5_0%,#c2c3c7_26%,#e9e9eb_48%,#a6a7ab_70%,#d7d8da_100%)]',
                  'shadow-[0_30px_70px_-16px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(255,255,255,0.5)]'
                )}
              >
                {/* Sidoknappar: ljudlös, volym upp, volym ned, strömknapp */}
                <div className="absolute left-[-3px] top-[92px] w-[3px] h-[24px] rounded-l-[2px] bg-[linear-gradient(to_right,#d2d3d6,#8b8c90)]" />
                <div className="absolute left-[-3px] top-[136px] w-[3px] h-[52px] rounded-l-[2px] bg-[linear-gradient(to_right,#d2d3d6,#8b8c90)]" />
                <div className="absolute left-[-3px] top-[198px] w-[3px] h-[52px] rounded-l-[2px] bg-[linear-gradient(to_right,#d2d3d6,#8b8c90)]" />
                <div className="absolute right-[-3px] top-[160px] w-[3px] h-[84px] rounded-r-[2px] bg-[linear-gradient(to_left,#d2d3d6,#8b8c90)]" />

                {/* Svart innerram */}
                <div className="relative bg-[#0b0b0c] p-[7px] lg:p-[8px] rounded-[43px] md:rounded-[49px] lg:rounded-[55px]">
                  {/* Skärm - gränssnittet ritas en gång i 320x694 och skalas till varje ramstorlek */}
                  <div className="relative overflow-hidden bg-black aspect-[9/19.5] rounded-[36px] md:rounded-[42px] lg:rounded-[47px]">
                    <div className="absolute top-0 left-0 w-[320px] h-[694px] origin-top-left scale-[0.8] md:scale-[0.9] lg:scale-100">
                      <AnimatedDashboard />

                      {/* Dynamic Island med kameraöga */}
                      <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[100px] h-[30px] bg-black rounded-full z-20">
                        <span className="absolute right-[9px] top-1/2 -translate-y-1/2 w-[11px] h-[11px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3b4c6e,#0d1322_60%,#000_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
                      </div>
                    </div>

                    {/* Glasreflex uppe till vänster */}
                    <div className="pointer-events-none absolute inset-0 z-30 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_28%,transparent_46%)]" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* Mäklarlogotyper flush i hero-underkanten. Ljust band eftersom 16 av 41
          logotyper har opak bakgrund och inte tål det mörkblå. Logotyperna körs
          i sin egen färg, så bandet måste förbli ljust. */}
      <div className="relative z-10 w-full bg-[var(--color-background-default)] py-5 md:py-6">
        <div className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="flex w-max gap-6 animate-scroll-infinite">
            {[...partnerLogos, ...partnerLogos].map((logo, i) => (
              <span
                key={`${logo.src}-${i}`}
                className="flex-shrink-0 flex items-center justify-center px-5 h-11 md:h-12 w-28 md:w-32"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.src}
                  alt={logo.alt}
                  loading="lazy"
                  decoding="async"
                  className="max-h-full max-w-full object-contain"
                />
              </span>
            ))}
          </div>
        </div>
      </div>

    </section>
  )
}

export default LandingHero
