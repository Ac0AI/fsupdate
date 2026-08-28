import { Suspense } from 'react'
import Loading from '../../app/loading'
import DemoUserBoundary from '../_components/DemoUserBoundary'
import DemoElectricityFlow from './_components/DemoElectricityFlow'

/**
 * Elavtal i fem steg: priser, detaljer, sammanfattning, BankID, klart. Ritat i
 * Paper under Elavtal · flödet (B-varianten med ett rekommenderat avtal) och
 * byggt här som ren frontend. Skarpa templaten i templates/Electricity är orörd.
 */
export default function DemoElectricityPage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <DemoUserBoundary>
          <DemoElectricityFlow />
        </DemoUserBoundary>
      </Suspense>
    </main>
  )
}
