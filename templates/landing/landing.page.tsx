'use client'

import { useTranslation } from 'react-i18next'
import Footer from 'app/_components/footer/FooterClient'
import { clsx } from 'clsx'
import dynamic from 'next/dynamic'
import useResponsive from '@/common/hooks/useResponsive'
import { useCookieFirst } from '@cookiefirst/cookiefirst-react'
import type { GoogleReview, GoogleReviewCountAndRating } from 'app/_actions/googleReviews.types'
import ClosingCta, { StickyCta } from './components/ClosingCta'
import Coordinators from './components/Coordinators'
import FAQ from './components/faq'
import HowItWorks from './components/howItWorks'
import LandingHero from './components/landingHero'
import ProofBar from './components/ProofBar'
import RecentMoves from './components/RecentMoves'

const Testimonials = dynamic(() => import('./components/testimonials'), { ssr: false })

interface LandingPageProps {
  isServerIosOrSafari: boolean
  googleReviews?: GoogleReview[] | null
  googleRating?: GoogleReviewCountAndRating | null
}

export const LandingPage = ({ isServerIosOrSafari, googleReviews, googleRating }: LandingPageProps) => {
  const { changeLanguage } = useCookieFirst()
  const { i18n } = useTranslation('')
  changeLanguage(i18n.language)
  const { isTabletPortraitOrGreater } = useResponsive()

  return (
    <>
      <div className="overflow-x-hidden overflow-y-auto scroll-smooth sm:scroll-auto">
        {/* Hero Section - component handles its own background */}
        <LandingHero />

        {/* Bevisraden - backar upp "vi har gjort researchen så du slipper" */}
        <ProofBar />

        {/* Testimonials - white section */}
        <section className="w-screen flex justify-center bg-white py-10 md:py-14">
          <div className="w-full px-4 md:px-8 max-w-[1232px]">
            <Testimonials googleReviews={googleReviews} googleRating={googleRating} />
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Människorna bakom tjänsten */}
        <Coordinators />

        {/* Flödet av genomförda tjänster */}
        <RecentMoves />

        {/* FAQ Section */}
        <section
          id="faq"
          className={clsx(
            'w-screen flex pt-8 justify-center',
            'bg-[var(--color-background-default)] text-[var(--color-secondary-main)]',
            'py-16 md:py-24'
          )}
        >
          <div className="w-full px-4 md:px-8 max-w-[1232px]">
            <FAQ isServerIosOrSafari={isServerIosOrSafari} />
          </div>
        </section>

        {/* Sista knappen, samma handling som heron */}
        <ClosingCta />

        {/* Contact - tight, centered */}
        <section className="w-screen flex justify-center bg-white border-t border-gray-100">
          <div className="w-full px-4 md:px-8 max-w-[1232px] py-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <span className="text-[var(--color-secondary-main)]/40 text-sm">Har du frågor?</span>
              <a href="tel:+46812008822" className="flex items-center gap-2 text-[var(--color-secondary-main)] hover:text-[var(--color-primary-main)] transition-colors">
                <span className="w-7 h-7 rounded-full bg-[var(--color-primary-main)]/10 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[var(--color-primary-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <span className="text-sm font-semibold">08-12 00 88 22</span>
              </a>
              <a href="mailto:hej@flyttsmart.se" className="flex items-center gap-2 text-[var(--color-secondary-main)] hover:text-[var(--color-primary-main)] transition-colors">
                <span className="w-7 h-7 rounded-full bg-[var(--color-primary-main)]/10 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 text-[var(--color-primary-main)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.75}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </span>
                <span className="text-sm font-semibold">hej@flyttsmart.se</span>
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
      <StickyCta />
    </>
  )
}
