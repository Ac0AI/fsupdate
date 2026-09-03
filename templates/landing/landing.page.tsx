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
import Negotiated from './components/Negotiated'
import ProofBar from './components/ProofBar'

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
        <section className="w-screen flex justify-center bg-white py-16 md:py-24">
          <div className="w-full px-4 md:px-8 max-w-[1232px]">
            <Testimonials googleReviews={googleReviews} googleRating={googleRating} />
          </div>
        </section>

        {/* How It Works Section */}
        <HowItWorks />

        {/* Beviset: förhandlat i förväg, Fortum-rabatten */}
        <Negotiated />

        {/* Människorna bakom tjänsten */}
        <Coordinators />

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


        <Footer />
      </div>
      <StickyCta />
    </>
  )
}
