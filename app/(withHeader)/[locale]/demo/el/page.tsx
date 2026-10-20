import { Suspense } from 'react'
import Loading from '../../app/loading'
import DemoUserBoundary from '../_components/DemoUserBoundary'
import DemoElFlow from '@/templates/ElDemo/DemoElFlow'

/**
 * Det nya elflödet: priset direkt, ett utpekat avtal, fast knapp i botten och
 * en sammanfattning som säger vad som saknas. Ritat i Paper på sidan
 * "El · mätbar och tumvänlig (20 okt)". Ren frontend, inget går till backend.
 */
export default function DemoElPage() {
  return (
    <main className="flex flex-1">
      <Suspense fallback={<Loading />}>
        <DemoUserBoundary>
          <DemoElFlow />
        </DemoUserBoundary>
      </Suspense>
    </main>
  )
}
