import { Suspense } from 'react'
import WelcomePage from '@/templates/WelcomePage'
import Loading from '../../app/loading'

/** Samma välkomstsida som skarpa /app/welcome. Skickar vidare till /demo/movepage. */
export default function DemoWelcomePage() {
  return (
    <main>
      <Suspense fallback={<Loading />}>
        <WelcomePage />
      </Suspense>
    </main>
  )
}
