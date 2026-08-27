import ClientPage from '../../app/addresschange/ClientPage'
import DemoUserBoundary from '../_components/DemoUserBoundary'

/**
 * Flyttanmälan som ren frontendvisning. Providern hämtar sin data som vanligt,
 * men anropen fångas av demoFetch i common/utils/api.ts eftersom sökvägen
 * innehåller /demo.
 */
export default function DemoAddresschangePage() {
  return (
    <main>
      <DemoUserBoundary>
        <ClientPage />
      </DemoUserBoundary>
    </main>
  )
}
