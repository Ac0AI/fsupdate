import { Suspense } from 'react'
import Loading from '../../app/loading'
import DemoUserBoundary from '../_components/DemoUserBoundary'
import DemoMovecleanFlow from './_components/DemoMovecleanFlow'

/**
 * Flyttstädning som hyllvara: fast pris efter RUT, bokas direkt i två steg,
 * flytten erbjuds i flödet. Regel 5 på artboarden Flyttsidan · regler.
 * Skarpa templaten i templates/MoveClean är orörd.
 */
export default function DemoMovecleanPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <DemoUserBoundary>
          <DemoMovecleanFlow />
        </DemoUserBoundary>
      </Suspense>
    </main>
  )
}
