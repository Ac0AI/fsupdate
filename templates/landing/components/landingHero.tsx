'use client'

import React, { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useRouter, usePathname } from 'next/navigation'
import Button from '@/components/atoms/Button'
import BankId from '@/public/images/BankId.svg'
import AnimatedDashboard from './AnimatedDashboard'

const LandingHero = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [showFloatingCta, setShowFloatingCta] = useState(false)
  const loginUrl = '/i/testmode'
  const heroCtaClassName = clsx(
    '!border-[#ffb87a]',
    '!bg-[linear-gradient(135deg,#c45e1a_0%,#e8802e_24%,#ffc08a_50%,#e07628_72%,#a84d12_100%)]',
    'shadow-[inset_0_1px_0_rgba(255,255,255,0.45),inset_0_-6px_10px_rgba(120,40,5,0.28),0_14px_28px_rgba(0,0,0,0.24)]',
    'hover:!border-[#ffd4a8]',
    'hover:!bg-[linear-gradient(135deg,#d06a22_0%,#f09040_24%,#ffd0a0_50%,#ee8434_72%,#b85818_100%)]',
    'active:scale-[0.99]'
  )

  useEffect(() => {
    const handleScroll = () => {
      // Show floating CTA after scrolling past 70% of viewport height
      setShowFloatingCta(window.scrollY > window.innerHeight * 0.7)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-[100vh] md:min-h-[90vh] flex items-center py-6 md:py-16 bg-gradient-to-br from-[#1a3a52] via-[var(--color-secondary-main)] to-[#2d5a7b]">
      {/* Subtle decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--color-primary-main)]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--color-accent-main)]/10 rounded-full blur-3xl" />
      </div>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-gradient-to-r from-[#51c8b4]/20 to-white/10 backdrop-blur-sm border border-[#51c8b4]/30 rounded-full px-5 py-2.5 mb-5 md:mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-[#51c8b4] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#51c8b4]" />
              </span>
              <span className="text-sm font-semibold text-white tracking-wide">
                Inbjuden av din mäklare? Allt är förberett
              </span>
            </div>

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
              Din mäklare har bjudit in dig till Sveriges smidigaste flytt. Fem minuter, sen sköter vi resten.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <div className="relative">
                <div className="absolute -inset-[3px] rounded-[var(--radius-button)] overflow-hidden pointer-events-none">
                  <div className="cta-metal-ring absolute top-1/2 left-1/2 w-[320%] h-[320%]" />
                </div>
                <div className="absolute -inset-[5px] rounded-[var(--radius-button)] overflow-hidden pointer-events-none blur-[7px] opacity-70">
                  <div className="cta-metal-ring-soft absolute top-1/2 left-1/2 w-[320%] h-[320%]" />
                </div>
                <div className="absolute -inset-[6px] rounded-[var(--radius-button)] overflow-hidden pointer-events-none opacity-90 mix-blend-screen">
                  <div className="cta-metal-sparks absolute top-1/2 left-1/2 w-[320%] h-[320%]" />
                </div>
                <div className="absolute inset-[3px] rounded-[calc(var(--radius-button)-3px)] cta-metal-core pointer-events-none z-[1]" />
                <div className="relative z-[2]">
                  <Button
                    className={heroCtaClassName}
                    padding="16px 32px"
                    variant="primaryAltInverted"
                    iconRight={<BankId className="w-6 h-6" />}
                    text="STARTA DIN FLYTT"
                    onClick={() => router.push(loginUrl)}
                  />
                </div>
              </div>
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
              Logga in med BankID &bull; Ingår via din mäklare
            </span>
            <span className="text-[13px] text-white/40 mt-1.5 block text-center lg:text-left max-w-[480px] mx-auto lg:mx-0">
              Inte inbjuden än? Logga in ändå och lägg upp din flytt själv – lika kostnadsfritt, bara ett par minuter extra.
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

            {/* Phone frame - realistic iPhone style */}
            <div className="relative z-10">
              <div
                className={clsx(
                  'relative bg-[#1a1a1a] rounded-[50px] p-[12px]',
                  'w-[280px] md:w-[320px] lg:w-[360px]',
                  'shadow-[0_25px_60px_-10px_rgba(0,0,0,0.5)]'
                )}
              >
                {/* Side buttons - left */}
                <div className="absolute left-[-2px] top-[100px] w-[3px] h-[30px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute left-[-2px] top-[145px] w-[3px] h-[55px] bg-[#2a2a2a] rounded-l-sm" />
                <div className="absolute left-[-2px] top-[210px] w-[3px] h-[55px] bg-[#2a2a2a] rounded-l-sm" />

                {/* Side button - right (power) */}
                <div className="absolute right-[-2px] top-[160px] w-[3px] h-[70px] bg-[#2a2a2a] rounded-r-sm" />

                {/* Screen with notch */}
                <div className="relative rounded-[38px] overflow-hidden bg-black aspect-[9/19]">
                  {/* Dynamic Island / Notch */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20" />

                  {/* Animated dashboard checklist */}
                  <AnimatedDashboard />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile fixed CTA - only on small screens, appears after scrolling */}
      <div
        className={clsx(
          'fixed bottom-0 left-0 right-0 z-50 p-4 pt-12 lg:hidden',
          'bg-gradient-to-t from-[var(--color-secondary-main)] via-[var(--color-secondary-main)]/95 to-transparent',
          'transition-all duration-300',
          showFloatingCta ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        )}
      >
        <Button
          className={heroCtaClassName}
          padding="16px 32px"
          variant="primaryAltInverted"
          iconRight={<BankId className="w-6 h-6" />}
          text="STARTA DIN FLYTT"
          onClick={() => router.push(loginUrl)}
          withFullWidth
        />
      </div>
    </section>
  )
}

export default LandingHero
