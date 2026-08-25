import { Suspense } from 'react'
import MovehelpTemplate from '@/templates/Movehelp'
import Loading from '../../app/loading'

/**
 * Flytthjälp som ren frontendvisning. Skarpa sidan hämtar Google-omdömen
 * serversidigt, här skickas ett fast värde in i stället.
 */
export default function DemoMovehelpPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <MovehelpTemplate flyttsmartGoogleReviewCountAndRating={{ rating: 4.7, reviewCount: 498 }} />
      </Suspense>
    </main>
  )
}
