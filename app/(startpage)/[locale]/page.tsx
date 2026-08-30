import { Suspense } from 'react'
import { preload } from 'react-dom'
import { HERO_SCENE } from '@/templates/landing/components/heroScene'
import { LandingPage } from '@/templates/landing'
import { isServerDemoMode } from '@/common/utils/demoMode'
import { isSafari, isIos } from '../../_components/responsive'
import { fetchReviews, fetchGoogleReviewCountAndRating } from '../../_actions/googleReviews'
import Loading from './loading'

export default async function Page() {
  // Heron strömmas först när Google-recensionerna hämtats. Förladda scenen i
  // dokumentets huvud så bilden ligger i cachen när texten dyker upp.
  preload(HERO_SCENE.src, { as: 'image', imageSrcSet: HERO_SCENE.srcSet, imageSizes: '100vw', fetchPriority: 'high' })
  const [isServerSafari, isServerIos] = await Promise.all([isSafari(), isIos()])
  const [googleReviews, googleRating] = isServerDemoMode
    ? [null, { rating: null, reviewCount: null }]
    : await Promise.all([fetchReviews('sv'), fetchGoogleReviewCountAndRating()])

  return (
    <main>
      <Suspense fallback={<Loading />}>
        <LandingPage
          isServerIosOrSafari={isServerSafari || isServerIos}
          googleReviews={googleReviews}
          googleRating={googleRating}
        />
      </Suspense>
    </main>
  )
}
