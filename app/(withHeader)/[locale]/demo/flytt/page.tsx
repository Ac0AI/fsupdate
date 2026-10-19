import { Suspense } from 'react'
import Loading from '../../app/loading'
import DemoUserBoundary from '../_components/DemoUserBoundary'
import DemoFlyttFlow from '@/templates/FlyttSteg1/DemoFlyttFlow'

/**
 * Flyttflödet steg 1, utan pris: dagens flyttsida är ingången, Begär pris
 * skapar en Opportunity och frågorna är frivilliga. Ritad i Paper på sidan
 * "Flytt · steg 1 utan pris" (19 oktober). Ren frontend, inget går till backend.
 */
export default function DemoFlyttPage() {
  return (
    <main className="flex flex-1">
      <Suspense fallback={<Loading />}>
        <DemoUserBoundary>
          <DemoFlyttFlow />
        </DemoUserBoundary>
      </Suspense>
    </main>
  )
}
