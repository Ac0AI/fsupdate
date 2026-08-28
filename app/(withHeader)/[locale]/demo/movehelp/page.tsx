import { Suspense } from 'react'
import Loading from '../../app/loading'
import DemoUserBoundary from '../_components/DemoUserBoundary'
import DemoMovehelpFlow from './_components/DemoMovehelpFlow'

/**
 * Flytthjälp i tre steg: bostaden, bohaget, Nina räknar. Ritad i Paper under
 * Flytthjälp · flödet och byggd här som ren frontend, så flödet går att testa
 * utan backend. Skarpa templaten i templates/Movehelp är orörd.
 */
export default function DemoMovehelpPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <DemoUserBoundary>
          <DemoMovehelpFlow />
        </DemoUserBoundary>
      </Suspense>
    </main>
  )
}
